import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CreditCard, MapPin, Wallet } from "lucide-react";
import { Card, Button, Badge, Input } from "../components/ui";
import { EmptyState } from "../components/common";
import { useCart } from "../hooks/useCart";
import { useAddress } from "../hooks/useAddress";
import { createOrderApi } from "../services/orderApi";
import showToast from "../utils/toast";
import toast from "react-hot-toast";

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, cartCount, cartTotal, loading, fetchCart } = useCart();
  const { addresses, fetchAddresses } = useAddress();

  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [upiId, setUpiId] = useState("");
  const [card, setCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    fetchCart();
    fetchAddresses();
  }, [fetchCart, fetchAddresses]);

  useEffect(() => {
    if (!selectedAddressId && addresses.length > 0) {
      setSelectedAddressId(addresses[0]._id);
    }
  }, [addresses, selectedAddressId]);

  const summary = useMemo(() => {
    return {
      subtotal: cartTotal,
      shipping: 0,
      tax: 0,
      total: cartTotal,
    };
  }, [cartTotal]);

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      showToast.error("Please select a delivery address.");
      return;
    }
    if (paymentMethod === "UPI" && !upiId.trim()) {
      showToast.error("Enter your UPI ID.");
      return;
    }
    if (paymentMethod === "CARD" && !card.number.trim()) {
      showToast.error("Enter card details.");
      return;
    }

    try {
      setPlacing(true);
      const payload = {
        addressId: selectedAddressId,
        paymentMethod,
      };
      const res = await createOrderApi(payload);
      showToast.success(res?.msg || "Order placed");
      await fetchCart();
      navigate("/user/orders");
    } catch (error) {
      const msg = error?.response?.data?.msg || "Failed to place order";
      showToast.error(msg);
    } finally {
      setPlacing(false);
    }
  };

  const confirmPlaceOrder = () => {
    if (placing) return;
    toast(
      (t) => (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-white">
            Are you sure you want to place this order?
          </p>
          <div className="flex gap-2">
            <Button
              variant="white"
              size="sm"
              onClick={() => toast.dismiss(t.id)}
            >
              No
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                toast.dismiss(t.id);
                handlePlaceOrder();
              }}
            >
              Yes, place order
            </Button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-20">
        <EmptyState
          icon={Wallet}
          title="Your cart is empty"
          description="Add books to your cart before checkout."
          actionLabel="Browse Books"
          onAction={() => navigate("/books")}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Checkout</h1>
            <p className="text-slate-600 mt-1">
              {cartCount} {cartCount === 1 ? "item" : "items"} in your order
            </p>
          </div>
          <Button variant="ghost" onClick={() => navigate("/cart")}>
            Back to Cart
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card variant="elevated" padding="lg">
              <Card.Header>
                <Card.Title className="flex items-center gap-2">
                  <MapPin size={18} />
                  Delivery Address
                </Card.Title>
              </Card.Header>
              <Card.Content>
                {addresses.length === 0 ? (
                  <div className="space-y-3">
                    <p className="text-sm text-slate-600">
                      No address found. Please add a delivery address.
                    </p>
                    <Link to="/user/address">
                      <Button variant="primary" size="sm">
                        Add Address
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((address) => (
                      <label
                        key={address._id}
                        className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition ${
                          selectedAddressId === address._id
                            ? "border-blue-500 bg-blue-50/40"
                            : "border-slate-200 bg-white"
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          className="mt-1"
                          checked={selectedAddressId === address._id}
                          onChange={() => setSelectedAddressId(address._id)}
                        />
                        <div className="text-sm text-slate-700">
                          <p className="font-semibold text-slate-900">
                            {address.fullName}
                          </p>
                          <p>{address.street}</p>
                          <p>
                            {address.city}, {address.state} - {address.pincode}
                          </p>
                          <p>{address.phone}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </Card.Content>
            </Card>

            <Card variant="elevated" padding="lg">
              <Card.Header>
                <Card.Title className="flex items-center gap-2">
                  <CreditCard size={18} />
                  Payment Method
                </Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 border rounded-xl p-4 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "COD"}
                      onChange={() => setPaymentMethod("COD")}
                    />
                    <div>
                      <p className="font-semibold text-slate-900">Cash on Delivery</p>
                      <p className="text-xs text-slate-500">
                        Pay when the order arrives
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 border rounded-xl p-4 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "UPI"}
                      onChange={() => setPaymentMethod("UPI")}
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">UPI</p>
                      <p className="text-xs text-slate-500">
                        Instant payment via UPI
                      </p>
                      {paymentMethod === "UPI" && (
                        <div className="mt-3">
                          <Input
                            label="UPI ID"
                            name="upiId"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="name@bank"
                          />
                        </div>
                      )}
                    </div>
                  </label>

                  <label className="flex items-center gap-3 border rounded-xl p-4 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "CARD"}
                      onChange={() => setPaymentMethod("CARD")}
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">Card</p>
                      <p className="text-xs text-slate-500">
                        Debit/Credit card payment
                      </p>
                      {paymentMethod === "CARD" && (
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Input
                            label="Card Number"
                            name="cardNumber"
                            value={card.number}
                            onChange={(e) =>
                              setCard((prev) => ({ ...prev, number: e.target.value }))
                            }
                            placeholder="1234 5678 9012 3456"
                          />
                          <Input
                            label="Name on Card"
                            name="cardName"
                            value={card.name}
                            onChange={(e) =>
                              setCard((prev) => ({ ...prev, name: e.target.value }))
                            }
                            placeholder="Cardholder name"
                          />
                          <Input
                            label="Expiry"
                            name="cardExpiry"
                            value={card.expiry}
                            onChange={(e) =>
                              setCard((prev) => ({ ...prev, expiry: e.target.value }))
                            }
                            placeholder="MM/YY"
                          />
                          <Input
                            label="CVV"
                            name="cardCvv"
                            value={card.cvv}
                            onChange={(e) =>
                              setCard((prev) => ({ ...prev, cvv: e.target.value }))
                            }
                            placeholder="***"
                          />
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </Card.Content>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card variant="elevated" padding="lg" className="sticky top-24">
              <Card.Header>
                <Card.Title>Order Summary</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal ({cartCount} items)</span>
                    <span className="font-semibold">Rs. {summary.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping</span>
                    <Badge variant="success" size="sm">
                      FREE
                    </Badge>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Tax</span>
                    <span className="font-semibold">Rs. {summary.tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-slate-200 pt-3 flex justify-between text-lg font-black text-slate-900">
                    <span>Total</span>
                    <span>Rs. {summary.total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  variant="primary"
                  fullWidth
                  size="lg"
                  onClick={confirmPlaceOrder}
                  disabled={loading || placing || addresses.length === 0}
                >
                  {placing ? "Placing order..." : "Place Order"}
                </Button>

                <div className="mt-3 text-xs text-slate-500">
                  By placing your order, you agree to our terms and conditions.
                </div>
              </Card.Content>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
