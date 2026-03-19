import { Link } from "react-router-dom";
import { useWishlist, useRemoveFromWishlist } from "@/hooks/api/useWishlist";
import { useAddToCart } from "@/hooks/api/useCart";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { formatPrice } from "@/utils/format";
import toast from "react-hot-toast";

export default function WishlistPage() {
  const { data: items = [], isLoading } = useWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const addToCart = useAddToCart();

  const handleRemove = (bookId) => {
    removeFromWishlist.mutate(bookId, {
      onSuccess: () => toast.success("Removed from wishlist"),
      onError: (err) => toast.error(err?.response?.data?.msg || "Failed to remove"),
    });
  };

  const handleAddToCart = (bookId) => {
    addToCart.mutate(bookId, {
      onSuccess: () => toast.success("Added to cart"),
      onError: (err) => toast.error(err?.response?.data?.msg || "Failed to add to cart"),
    });
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="h-8 w-32 bg-gray-200 rounded mb-6 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <LoadingSkeleton type="card" count={6} />
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center mb-28">
          <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-6">Save your favorite books here</p>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>

        <div className="space-y-4">
          {items.map((book) => (
            <Card key={book._id} className="p-4 sm:p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                {/* Book Image */}
                <Link to={`/books/${book._id}`} className="flex-shrink-0">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    loading="lazy"
                    className="w-full sm:w-32 h-48 sm:h-44 object-cover rounded-lg"
                  />
                </Link>

                {/* Book Details */}
                <div className="flex-1 min-w-0">
                  <Link to={`/books/${book._id}`}>
                    <h3 className="text-xl font-bold text-gray-900 hover:text-[#F59E0B] mb-2 line-clamp-2">
                      {book.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-600 mb-3">by {book.author}</p>
                  
                  {/* Book Info */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {book.categories && (
                      <Badge variant="secondary" className="text-xs">
                        {Array.isArray(book.categories) ? book.categories[0] : book.categories}
                      </Badge>
                    )}
                    {book.format && (
                      <Badge variant="outline" className="text-xs">
                        {book.format}
                      </Badge>
                    )}
                    {book.discount > 0 && (
                      <Badge className="bg-red-500 text-white text-xs">
                        {book.discount}% OFF
                      </Badge>
                    )}
                  </div>

                  {/* Price and Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-gray-900">
                        {formatPrice(book.price)}
                      </span>
                      {book.originalPrice && book.originalPrice > book.price && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(book.originalPrice)}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        className="flex-1 sm:flex-none bg-[#F59E0B] hover:bg-[#D97706]"
                        onClick={() => handleAddToCart(book._id)}
                        disabled={book.stock === 0}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {book.stock === 0 ? "Out of Stock" : "Add to Cart"}
                      </Button>
                      <Button
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        onClick={() => handleRemove(book._id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
