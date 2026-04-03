import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/api/useCart";
import { useAddresses, useAddAddress } from "@/hooks/api/useAddress";
import { useCreateOrder } from "@/hooks/api/useOrders";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, MapPin, CreditCard, Wallet, Info } from "lucide-react";
import { formatPrice } from "@/utils/format";
import toast from "react-hot-toast";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import api from "@/services/api";
import { useQueryClient, useQuery } from "@tanstack/react-query";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useSelector((state) => state.auth);
  const { data: cartData } = useCart();
  const { data: addresses = [] } = useAddresses();
  const addAddress = useAddAddress();
  const createOrder = useCreateOrder();

  // Fetch settings from API
  const { data: settings, isLoading: settingsLoading, refetch: refetchSettings } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const { data } = await api.get("/api/settings");
      return data;
    },
    staleTime: 0,
    cacheTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const cartItems = cartData?.items || [];
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD"); // COD or ONLINE
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });
  
  const [headerRef, headerVisible] = useScrollAnimation();
  const [addressRef, addressVisible] = useScrollAnimation();
  const [paymentRef, paymentVisible] = useScrollAnimation();
  const [itemsRef, itemsVisible] = useScrollAnimation();
  const [summaryRef, summaryVisible] = useScrollAnimation();

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      setSelectedAddress(addresses[0]._id);
    }
  }, [addresses, selectedAddress]);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleAddressChange = (e) => {
    setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    addAddress.mutate(addressForm, {
      onSuccess: () => {
        toast.success("Address added successfully");
        setShowAddressForm(false);
        setAddressForm({
          fullName: "",
          phone: "",
          street: "",
          city: "",
          state: "",
          pincode: "",
        });
      },
      onError: (error) => toast.error(error?.response?.data?.msg || "Failed to add address"),
    });
  };

  // Calculate totals using settings from API
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.book?.price || 0) * item.quantity,
    0
  );
  
  // Use settings from API with proper defaults
  const taxRate = settings?.taxEnabled && settings?.taxRate ? settings.taxRate : 0;
  const freeDeliveryThreshold = settings?.freeDeliveryThreshold || 500;
  const deliveryCharge = settings?.deliveryEnabled && settings?.deliveryCharge ? settings.deliveryCharge : 0;
  
  const tax = settings?.taxEnabled ? Math.ceil(subtotal * taxRate) : 0;
  const shipping = subtotal >= freeDeliveryThreshold ? 0 : deliveryCharge;
  const total = subtotal + shipping + tax;

  // Handle Razorpay Payment
  const handleRazorpayPayment = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    setIsProcessingPayment(true);

    try {
      // Create Razorpay order
      const { data } = await api.post("/api/orders/razorpay/create", {
        addressId: selectedAddress,
      });

      if (!window.Razorpay) {
        throw new Error("Razorpay SDK not loaded. Please refresh the page.");
      }

      const options = {
        key: data.key,
        amount: data.amount * 100,
        currency: data.currency,
        name: "BookHive",
        description: "Book Purchase",
        order_id: data.orderId,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyResponse = await api.post("/api/orders/razorpay/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              addressId: selectedAddress,
            });
            
            // Invalidate cart and orders queries to refresh data
            await queryClient.invalidateQueries({ queryKey: ["cart"] });
            await queryClient.invalidateQueries({ queryKey: ["orders"] });
            
            toast.success("Payment successful! Order placed.");
            navigate("/orders");
          } catch (error) {
            console.error("Payment verification error:", error);
            
            const errorMsg = error?.response?.data?.msg || error?.response?.data?.error || "Payment verification failed";
            toast.error(errorMsg);
          } finally {
            setIsProcessingPayment(false);
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.phone || "",
        },
        theme: {
          color: "#d97642",
        },
        modal: {
          ondismiss: function () {
            setIsProcessingPayment(false);
            toast.error("Payment cancelled");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Razorpay error:", error);
      console.error("Error details:", error.response?.data);
      
      const errorMsg = error?.response?.data?.msg || error.message || "Failed to initiate payment";
      toast.error(errorMsg);
      setIsProcessingPayment(false);
    }
  };

  // Handle COD Order
  const handleCODOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    createOrder.mutate(
      {
        addressId: selectedAddress,
        paymentMethod: "COD",
      },
      {
        onSuccess: () => {
          toast.success("Order placed successfully!");
          navigate("/orders");
        },
        onError: (error) => toast.error(error?.response?.data?.msg || "Failed to place order"),
      }
    );
  };

  const handlePlaceOrder = () => {
    if (paymentMethod === "ONLINE") {
      handleRazorpayPayment();
    } else {
      handleCODOrder();
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some books to checkout</p>
          <Button onClick={() => navigate("/books")}>Browse Books</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-shell">
        <h1
          ref={headerRef}
          className={`text-3xl font-bold text-gray-900 mb-8 transition-all duration-700 ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <Card
              ref={addressRef}
              className={`transition-all duration-700 ${
                addressVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Delivery Address</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddressForm(!showAddressForm)}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add New
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {showAddressForm && (
                  <form onSubmit={handleAddAddress} className="mb-6 p-4 border rounded-lg bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={addressForm.fullName}
                          onChange={handleAddressChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={addressForm.phone}
                          onChange={handleAddressChange}
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="street">Street Address *</Label>
                        <Input
                          id="street"
                          name="street"
                          value={addressForm.street}
                          onChange={handleAddressChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          name="city"
                          value={addressForm.city}
                          onChange={handleAddressChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          name="state"
                          value={addressForm.state}
                          onChange={handleAddressChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="pincode">Pincode *</Label>
                        <Input
                          id="pincode"
                          name="pincode"
                          value={addressForm.pincode}
                          onChange={handleAddressChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button type="submit" className="bg-[#d97642] hover:bg-[#c26535]">
                        Save Address
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowAddressForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}

                <div className="space-y-3">
                  {addresses.map((address) => (
                    <div
                      key={address._id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                        selectedAddress === address._id
                          ? "border-[#d97642] bg-orange-50"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                      onClick={() => setSelectedAddress(address._id)}
                    >
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-[#d97642] mt-1" />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{address.fullName}</p>
                          <p className="text-gray-600">{address.phone}</p>
                          <p className="text-gray-600 mt-1">
                            {address.street}, {address.city}
                          </p>
                          <p className="text-gray-600">
                            {address.state} - {address.pincode}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {addresses.length === 0 && !showAddressForm && (
                  <p className="text-center text-gray-500 py-8">
                    No addresses found. Please add a delivery address.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card
              ref={paymentRef}
              className={`transition-all duration-700 ${
                paymentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: '100ms' }}
            >
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                      paymentMethod === "ONLINE"
                        ? "border-[#d97642] bg-orange-50"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                    onClick={() => setPaymentMethod("ONLINE")}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-6 h-6 text-[#d97642]" />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">Online Payment</p>
                        <p className="text-sm text-gray-600">Pay via UPI, Card, Net Banking</p>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                      paymentMethod === "COD"
                        ? "border-[#d97642] bg-orange-50"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                    onClick={() => setPaymentMethod("COD")}
                  >
                    <div className="flex items-center gap-3">
                      <Wallet className="w-6 h-6 text-[#d97642]" />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">Cash on Delivery</p>
                        <p className="text-sm text-gray-600">Pay when you receive</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card
              ref={itemsRef}
              className={`transition-all duration-700 ${
                itemsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
              <CardHeader>
                <CardTitle>Order Items ({cartItems.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex gap-4 pb-4 border-b last:border-0">
                      <img
                        src={item.book?.coverImage}
                        alt={item.book?.title}
                        className="w-16 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 line-clamp-1">{item.book?.title}</h4>
                        <p className="text-sm text-gray-600">{item.book?.author}</p>
                        <p className="text-sm text-gray-900 mt-1">
                          Qty: {item.quantity} × {formatPrice(item.book?.price)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatPrice((item.book?.price || 0) * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card
              ref={summaryRef}
              className={`sticky top-20 transition-all duration-700 ${
                summaryVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: '300ms' }}
            >
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Tax ({settings?.taxName || 'GST'} {(taxRate * 100).toFixed(2)}%)</span>
                    <span className="font-medium">{formatPrice(tax)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Delivery Charges</span>
                    <span className="font-medium">
                      {shipping === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        formatPrice(shipping)
                      )}
                    </span>
                  </div>
                  
                  {settings?.deliveryEnabled && subtotal < freeDeliveryThreshold && (
                    <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                      <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-blue-900">
                        Add {formatPrice(freeDeliveryThreshold - subtotal)} more to get FREE delivery!
                      </p>
                    </div>
                  )}
                  
                  <div className="border-t-2 pt-3 flex justify-between">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-[#d97642]">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full bg-[#d97642] hover:bg-[#c26535]"
                  size="lg"
                  onClick={handlePlaceOrder}
                  disabled={createOrder.isPending || isProcessingPayment || !selectedAddress}
                >
                  {isProcessingPayment || createOrder.isPending
                    ? "Processing..."
                    : paymentMethod === "ONLINE"
                    ? "Pay Now"
                    : "Place Order"}
                </Button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  By placing your order, you agree to our terms and conditions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
