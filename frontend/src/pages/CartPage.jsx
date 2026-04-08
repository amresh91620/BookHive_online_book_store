import { Link, useNavigate } from "react-router-dom";
import { useCart, useRemoveFromCart, useUpdateCartQuantity } from "@/hooks/api/useCart";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, Plus, Minus, ShoppingBag, Info } from "lucide-react";
import { formatPrice } from "@/utils/format";
import toast from "react-hot-toast";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";

export default function CartPage() {
  const navigate = useNavigate();
  const { data: cartData, isLoading } = useCart();
  const removeFromCart = useRemoveFromCart();
  const updateCartQuantity = useUpdateCartQuantity();

  const items = cartData?.items || [];
  
  const [headerRef, headerVisible] = useScrollAnimation();
  const [summaryRef, summaryVisible] = useScrollAnimation();

  // Fetch settings from API
  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const { data } = await api.get("/api/settings");
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleRemove = (itemId) => {
    removeFromCart.mutate(itemId, {
      onSuccess: () => toast.success("Item removed from cart"),
      onError: (err) => toast.error(err?.response?.data?.msg || "Failed to remove item"),
    });
  };

  const handleUpdateQuantity = (itemId, currentQty, change) => {
    const newQty = currentQty + change;
    if (newQty < 1) return;
    updateCartQuantity.mutate(
      { itemId, quantity: newQty },
      {
        onError: (err) => toast.error(err?.response?.data?.msg || "Failed to update quantity"),
      }
    );
  };

  const subtotal = items.reduce((sum, item) => sum + (item.book?.price || 0) * item.quantity, 0);
  
  // Use settings from API with proper defaults
  const taxRate = settings?.taxEnabled && settings?.taxRate ? settings.taxRate : 0;
  const freeDeliveryThreshold = settings?.freeDeliveryThreshold || 500;
  const deliveryCharge = settings?.deliveryEnabled && settings?.deliveryCharge ? settings.deliveryCharge : 0;
  
  const tax = settings?.taxEnabled ? Math.ceil(subtotal * taxRate) : 0;
  const shipping = subtotal >= freeDeliveryThreshold ? 0 : deliveryCharge;
  const total = subtotal + shipping + tax;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white py-12">
        <div className="container-shell">
          {/* Header Skeleton */}
          <div className="mb-8 animate-fade-in-up">
            <div className="h-10 w-64 bg-stone-200 rounded-lg mb-2 animate-pulse"></div>
            <div className="h-5 w-40 bg-stone-200 rounded animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items Skeleton */}
            <div className="lg:col-span-2 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div 
                  key={i} 
                  className="bg-white rounded-2xl border-2 border-stone-200 p-5 animate-fade-in-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="flex gap-5">
                    {/* Image Skeleton */}
                    <div className="w-24 h-32 bg-stone-200 rounded-lg animate-pulse shrink-0"></div>
                    
                    {/* Content Skeleton */}
                    <div className="flex-1 space-y-3">
                      <div className="h-6 w-3/4 bg-stone-200 rounded animate-pulse"></div>
                      <div className="h-4 w-1/3 bg-stone-200 rounded animate-pulse"></div>
                      <div className="h-7 w-24 bg-stone-200 rounded animate-pulse"></div>
                      
                      <div className="flex items-center gap-4 pt-2">
                        <div className="h-10 w-32 bg-stone-200 rounded-lg animate-pulse"></div>
                        <div className="h-5 w-32 bg-stone-200 rounded animate-pulse"></div>
                        <div className="h-9 w-24 bg-stone-200 rounded-lg animate-pulse ml-auto"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Order Summary Skeleton */}
            <div>
              <div 
                className="bg-white rounded-2xl border-2 border-stone-200 p-6 sticky top-24 animate-fade-in-up"
                style={{ animationDelay: '200ms' }}
              >
                <div className="h-8 w-48 bg-stone-200 rounded-lg mb-6 animate-pulse"></div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <div className="h-5 w-32 bg-stone-200 rounded animate-pulse"></div>
                    <div className="h-5 w-20 bg-stone-200 rounded animate-pulse"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="h-5 w-24 bg-stone-200 rounded animate-pulse"></div>
                    <div className="h-5 w-16 bg-stone-200 rounded animate-pulse"></div>
                  </div>
                  <div className="border-t-2 border-stone-200 pt-4 flex justify-between">
                    <div className="h-7 w-20 bg-stone-200 rounded animate-pulse"></div>
                    <div className="h-8 w-28 bg-stone-200 rounded animate-pulse"></div>
                  </div>
                </div>
                
                <div className="h-12 w-full bg-gradient-to-r from-orange-200 to-amber-200 rounded-lg animate-pulse"></div>
                
                <div className="mt-4 text-center">
                  <div className="h-4 w-40 bg-stone-200 rounded animate-pulse mx-auto"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white flex items-center justify-center py-20">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mb-6 inline-flex items-center justify-center w-24 h-24 rounded-full bg-stone-100">
            <ShoppingBag className="w-12 h-12 text-stone-400" />
          </div>
          <h2 className="text-3xl font-bold text-stone-900 mb-3">Your cart is empty</h2>
          <p className="text-stone-600 mb-8 font-light">Discover amazing books and start your reading journey</p>
          <Link to="/books">
            <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8 py-6 h-auto text-base font-semibold shadow-md hover:shadow-lg transition-all duration-300">
              Browse Books
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white py-12">
      <div className="container-shell">
        <div
          ref={headerRef}
          className={`mb-8 transition-all duration-700 ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h1 className="text-4xl font-bold text-stone-900 mb-2">Shopping Cart</h1>
          <p className="text-stone-600 font-light">{items.length} {items.length === 1 ? 'item' : 'items'} in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <Card
                key={item._id}
                className="p-5 border-2 border-stone-200 hover:border-amber-300 transition-all duration-700 shadow-soft hover:shadow-medium"
                style={{
                  opacity: headerVisible ? 1 : 0,
                  transform: headerVisible ? 'translateY(0)' : 'translateY(40px)',
                  transitionDelay: `${index * 100}ms`
                }}
              >
                <div className="flex gap-5">
                  {/* Book Image */}
                  <Link to={`/books/${item.book?._id}`} className="shrink-0">
                    <img
                      src={item.book?.coverImage || "https://via.placeholder.com/120x160/78350F/FEF3C7?text=No+Image"}
                      alt={item.book?.title}
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/120x160/78350F/FEF3C7?text=No+Image";
                      }}
                      className="w-24 h-32 object-cover rounded-lg shadow-medium border-2 border-stone-200 hover:scale-105 transition-smooth"
                    />
                  </Link>

                  {/* Book Details */}
                  <div className="flex-1 min-w-0">
                    <Link to={`/books/${item.book?._id}`}>
                      <h3 className="font-semibold text-lg text-stone-900 hover:text-amber-700 transition-smooth line-clamp-2 mb-1">
                        {item.book?.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-stone-600 mb-3 font-light">{item.book?.author}</p>
                    <p className="text-xl font-bold text-stone-900 mb-4">
                      {formatPrice(item.book?.price)}
                    </p>

                    <div className="flex flex-wrap items-center gap-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1 border-2 border-stone-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => handleUpdateQuantity(item._id, item.quantity, -1)}
                          disabled={item.quantity <= 1}
                          aria-label={`Decrease quantity of ${item.book?.title}`}
                          className="p-2.5 hover:bg-stone-100 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Minus className="w-4 h-4 text-stone-700" aria-hidden="true" />
                        </button>
                        <span className="px-4 py-2 font-semibold text-stone-900 min-w-[3rem] text-center" aria-label={`Quantity: ${item.quantity}`}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item._id, item.quantity, 1)}
                          aria-label={`Increase quantity of ${item.book?.title}`}
                          className="p-2.5 hover:bg-stone-100 transition-smooth"
                        >
                          <Plus className="w-4 h-4 text-stone-700" aria-hidden="true" />
                        </button>
                      </div>

                      {/* Subtotal */}
                      <div className="text-sm text-stone-600">
                        Subtotal: <span className="font-semibold text-stone-900">{formatPrice((item.book?.price || 0) * item.quantity)}</span>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemove(item._id)}
                        aria-label={`Remove ${item.book?.title} from cart`}
                        className="ml-auto text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg flex items-center gap-2 transition-smooth font-medium"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                        <span className="hidden sm:inline">Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <Card
              ref={summaryRef}
              className={`p-6 sticky top-24 border-2 border-stone-200 shadow-medium transition-all duration-700 ${
                summaryVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
              <h2 className="text-2xl font-bold text-stone-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-stone-700">
                  <span className="font-light">Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
                  <span className="font-semibold">{formatPrice(subtotal)}</span>
                </div>
                
                {settings?.taxEnabled && (
                  <div className="flex justify-between text-stone-700">
                    <span className="font-light">
                      {settings?.taxName || 'Tax'} ({(taxRate * 100).toFixed(2)}%)
                    </span>
                    <span className="font-semibold">{formatPrice(tax)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-stone-700">
                  <span className="font-light">Shipping</span>
                  <span className="font-semibold text-green-600">
                    {shipping === 0 ? "Free" : formatPrice(shipping)}
                  </span>
                </div>
                
                {subtotal > 0 && subtotal < freeDeliveryThreshold && settings?.deliveryEnabled && (
                  <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-blue-700">
                      Add {formatPrice(freeDeliveryThreshold - subtotal)} more to get free delivery!
                    </p>
                  </div>
                )}
                
                <div className="border-t-2 border-stone-200 pt-4 flex justify-between items-center">
                  <span className="text-xl font-bold text-stone-900">Total</span>
                  <span className="text-2xl font-bold text-amber-700">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </Button>

              <div className="mt-4 text-center">
                <Link to="/books" className="text-sm text-stone-600 hover:text-amber-700 transition-smooth font-medium">
                  ← Continue Shopping
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
