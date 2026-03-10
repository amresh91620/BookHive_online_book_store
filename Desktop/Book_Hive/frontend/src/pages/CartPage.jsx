import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchCart, removeFromCart, updateCartQuantity } from "@/store/slices/cartSlice";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/utils/format";
import toast from "react-hot-toast";

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, status } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleRemove = (itemId) => {
    dispatch(removeFromCart(itemId))
      .unwrap()
      .then(() => toast.success("Item removed from cart"))
      .catch((err) => toast.error(err));
  };

  const handleUpdateQuantity = (itemId, currentQty, change) => {
    const newQty = currentQty + change;
    if (newQty < 1) return;
    dispatch(updateCartQuantity({ itemId, quantity: newQty }))
      .unwrap()
      .catch((err) => toast.error(err));
  };

  const subtotal = items.reduce((sum, item) => sum + (item.book?.price || 0) * item.quantity, 0);
  const shipping = 0;
  const total = subtotal + shipping;

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some books to get started</p>
          <Link to="/books">
            <Button>Browse Books</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-shell">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item._id} className="p-4">
                <div className="flex gap-4">
                  <img
                    src={item.book?.coverImage}
                    alt={item.book?.title}
                    className="w-24 h-32 object-cover rounded"
                  />
                  <div className="flex-1">
                    <Link to={`/books/${item.book?._id}`}>
                      <h3 className="font-semibold text-gray-900 hover:text-amber-600">
                        {item.book?.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-600 mb-2">{item.book?.author}</p>
                    <p className="text-lg font-bold text-gray-900">
                      {formatPrice(item.book?.price)}
                    </p>

                    <div className="flex items-center gap-4 mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 border rounded">
                        <button
                          onClick={() => handleUpdateQuantity(item._id, item.quantity, -1)}
                          className="p-2 hover:bg-gray-100"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 font-medium">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item._id, item.quantity, 1)}
                          className="p-2 hover:bg-gray-100"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemove(item._id)}
                        className="text-red-600 hover:text-red-700 flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="p-6 sticky top-20">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? "Free" : formatPrice(shipping)}
                  </span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-lg font-bold text-amber-600">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>
              <Button
                className="w-full"
                size="lg"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
