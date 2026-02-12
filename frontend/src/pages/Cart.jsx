import { useCart } from "../hooks/useCart";
import { useNavigate } from "react-router-dom";
import { DollarSign, BookOpen, Tag, Calendar, Package, Star, ShoppingCart } from "lucide-react";
import { useEffect } from "react";
import { Button, Card, Badge } from "../components/ui";
import { EmptyState } from "../components/common";
import { LoadingSpinner } from "../components/ui/Spinner";
import showToast from "../utils/toast";

const Cart = () => {
  const { cart, cartCount, cartTotal, loading, removeFromCart, updateQuantity, fetchCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (itemId) => {
    try {
      await removeFromCart(itemId);
      showToast.success("Item removed from cart");
    } catch (error) {
      showToast.error("Failed to remove item");
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateQuantity(itemId, newQuantity);
    } catch (error) {
      showToast.error("Failed to update quantity");
    }
  };

  if (loading && (!cart.items || cart.items.length === 0)) {
    return <LoadingSpinner fullScreen message="Loading your cart..." />;
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-20">
        <EmptyState
          icon={ShoppingCart}
          title="Your cart is empty"
          description="Looks like you haven't added any books to your cart yet. Start shopping to fill it up!"
          actionLabel="Continue Shopping"
          onAction={() => navigate("/")}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Your Cart</h1>
            <p className="text-slate-600 mt-1">{cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart</p>
          </div>
          <Button variant="ghost" onClick={() => navigate("/")}>
            ← Continue Shopping
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cart.items.map((item) => {
              const book = item.book || {};
              const itemSubtotal = (book.price || 0) * (item.quantity || 1);

              return (
                <Card key={item._id} variant="elevated" padding="lg" hover>
                  <div className="flex flex-col sm:flex-row gap-6">
                    {/* Book Cover */}
                    <img
                      src={book.coverImage || "/placeholder.png"}
                      className="w-full sm:w-32 h-48 sm:h-44 object-cover rounded-lg shadow-md"
                      alt={book.title || "Book"}
                      onError={(e) => {
                        e.target.src = "/placeholder.png";
                      }}
                    />

                    {/* Book Details */}
                    <div className="flex-1 flex flex-col">
                      <div className="flex-1">
                        <h2 className="text-xl font-bold text-slate-900 mb-1">
                          {book.title || "Untitled"}
                        </h2>
                        <p className="text-slate-500 mb-3 italic text-sm">
                          by {book.author || "Unknown"}
                        </p>

                        {/* Description */}
                        {book.description && book.description.trim() !== "" && (
                          <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                            {book.description}
                          </p>
                        )}

                        {/* Book Specs */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge variant="secondary" size="sm" icon={DollarSign}>
                            ₹{book.price || 0}
                          </Badge>
                          {book.pages > 0 && (
                            <Badge variant="secondary" size="sm" icon={BookOpen}>
                              {book.pages} pages
                            </Badge>
                          )}
                          {book.categories && book.categories !== 'N/A' && (
                            <Badge variant="secondary" size="sm" icon={Tag}>
                              {book.categories}
                            </Badge>
                          )}
                          {book.publishedDate && (
                            <Badge variant="secondary" size="sm" icon={Calendar}>
                              {new Date(book.publishedDate).getFullYear()}
                            </Badge>
                          )}
                          {book.stock > 0 && (
                            <Badge variant="success" size="sm" icon={Package}>
                              {book.stock} in stock
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Bottom Controls */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-slate-100">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-slate-600 font-medium">Quantity:</span>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                              disabled={item.quantity === 1 || loading}
                            >
                              -
                            </Button>
                            <span className="font-semibold w-8 text-center">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                              disabled={loading}
                            >
                              +
                            </Button>
                          </div>
                        </div>

                        {/* Subtotal and Remove */}
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-xs text-slate-500">Subtotal</p>
                            <p className="text-xl font-bold text-slate-900">
                              ₹{itemSubtotal.toFixed(2)}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleRemove(item._id)}
                            disabled={loading}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card variant="elevated" padding="lg" className="sticky top-24">
              <Card.Header>
                <Card.Title>Order Summary</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal ({cartCount} items)</span>
                    <span className="font-semibold">₹{cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping</span>
                    <Badge variant="success" size="sm">FREE</Badge>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Tax</span>
                    <span className="font-semibold">₹0.00</span>
                  </div>
                  <div className="border-t border-slate-200 pt-3 flex justify-between text-lg font-black text-slate-900">
                    <span>Total</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  variant="primary"
                  fullWidth
                  size="lg"
                  onClick={() => navigate("/checkout")}
                  disabled={loading}
                >
                  Proceed to Checkout
                </Button>

                <div className="mt-4 text-center">
                  <Button
                    variant="ghost"
                    fullWidth
                    onClick={() => navigate("/books")}
                  >
                    Continue Shopping
                  </Button>
                </div>
              </Card.Content>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
