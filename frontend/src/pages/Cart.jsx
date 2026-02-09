import { useCart } from "../hooks/useCart";
import { useNavigate } from "react-router-dom";
import { DollarSign, BookOpen, Tag, Calendar, Package, Star } from "lucide-react";
import { useEffect } from "react";

const Cart = () => {
  const { cart, cartCount, cartTotal, loading, removeFromCart, updateQuantity, fetchCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading && (!cart.items || cart.items.length === 0)) {
    return (
      <div className="p-20 text-center">
        <div className="animate-pulse text-gray-500 text-xl">Loading cart...</div>
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="p-20 text-center">
        <div className="text-gray-400 text-xl mb-4">Your cart is empty.</div>
        <button
          onClick={() => navigate("/")}
          className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-black">Your Cart ({cartCount} items)</h1>
        <button
          onClick={() => navigate("/")}
          className="text-sm text-gray-600 hover:text-black transition"
        >
          ← Continue Shopping
        </button>
      </div>

      <div className="space-y-8">
        {cart.items.map((item) => {
          const book = item.book || {};
          const itemSubtotal = (book.price || 0) * (item.quantity || 1);

          return (
            <div
              key={item._id}
              className="flex flex-col lg:flex-row gap-6 border rounded-xl p-6 shadow-sm hover:shadow-md transition"
            >
              {/* Book Cover */}
              <img
                src={book.coverImage || "/placeholder.png"}
                className="w-40 h-56 object-cover rounded-lg shadow-md"
                alt={book.title || "Book"}
                onError={(e) => {
                  e.target.src = "/placeholder.png";
                }}
              />

              {/* Book Details */}
              <div className="flex-1 flex flex-col">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-1">
                    {book.title || "Untitled"}
                  </h2>
                  <p className="text-gray-500 mb-3 italic">
                    by {book.author || "Unknown"}
                  </p>

                  {/* Description */}
                  {book.description && book.description.trim() !== "" && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {book.description}
                    </p>
                  )}

                  {/* Book Specs Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 text-sm mb-4">
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} className="text-green-600" />
                      <span className="font-semibold">₹{book.price || 0}</span>
                    </div>
                    {book.pages > 0 && (
                      <div className="flex items-center gap-2">
                        <BookOpen size={16} className="text-blue-500" />
                        <span>{book.pages} pages</span>
                      </div>
                    )}
                    {book.categories && book.categories !== 'N/A' && (
                      <div className="flex items-center gap-2">
                        <Tag size={16} className="text-purple-500" />
                        <span className="capitalize">{book.categories}</span>
                      </div>
                    )}
                    {book.publishedDate && (
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-orange-500" />
                        <span>{new Date(book.publishedDate).getFullYear()}</span>
                      </div>
                    )}
                    {book.rating > 0 && (
                      <div className="flex items-center gap-2">
                        <Star size={16} className="text-yellow-500" />
                        <span>{book.rating} / 5</span>
                      </div>
                    )}
                    {book.stock > 0 && (
                      <div className="flex items-center gap-2">
                        <Package size={16} className="text-indigo-500" />
                        <span>{book.stock} in stock</span>
                      </div>
                    )}
                  </div>

                  {/* Additional Details - Only show if data exists */}
                  {((book.isbn && book.isbn !== 'N/A') || 
                    (book.publisher && book.publisher !== 'Unknown Publisher') || 
                    (book.language && book.language !== 'English')) && (
                    <div className="text-xs text-gray-500 space-y-1">
                      {book.isbn && book.isbn !== 'N/A' && (
                        <p><span className="font-semibold">ISBN:</span> {book.isbn}</p>
                      )}
                      {book.publisher && book.publisher !== 'Unknown Publisher' && (
                        <p><span className="font-semibold">Publisher:</span> {book.publisher}</p>
                      )}
                      {book.language && book.language !== 'English' && (
                        <p><span className="font-semibold">Language:</span> {book.language}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Controls */}
                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">Quantity:</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      disabled={item.quantity === 1 || loading}
                      className="px-3 py-1 border rounded hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <span className="font-semibold w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      disabled={loading}
                      className="px-3 py-1 border rounded hover:bg-gray-100 transition disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal and Remove */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Subtotal</p>
                      <p className="text-xl font-bold">
                        ₹{itemSubtotal.toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      disabled={loading}
                      className="text-red-500 hover:text-red-700 hover:underline transition text-sm disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total & Checkout */}
      <div className="mt-10 border-t pt-6">
        <div className="max-w-md ml-auto">
          <div className="space-y-2 text-lg">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping:</span>
              <span className="text-green-600">FREE</span>
            </div>
            <div className="flex justify-between text-2xl font-black pt-2 border-t">
              <span>Total:</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </div>
          </div>
          
          <button
            onClick={() => navigate("/checkout")}
            disabled={loading}
            className="w-full mt-6 bg-black text-white px-6 py-4 rounded-xl hover:bg-gray-800 transition font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;