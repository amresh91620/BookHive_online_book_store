import { Link } from "react-router-dom";
import { useWishlist, useRemoveFromWishlist } from "@/hooks/api/useWishlist";
import { useAddToCart } from "@/hooks/api/useCart";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
      <div className="min-h-screen bg-gray-50 py-8">
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
        <div className="text-center">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((book) => (
            <Card key={book._id} className="p-4">
              <Link to={`/books/${book._id}`}>
                <img
                  src={book.coverImage}
                  alt={book.title}
                  loading="lazy"
                  className="w-full aspect-[3/4] object-cover rounded mb-4"
                />
              </Link>
              <Link to={`/books/${book._id}`}>
                <h3 className="font-semibold text-gray-900 hover:text-amber-600 mb-1">
                  {book.title}
                </h3>
              </Link>
              <p className="text-sm text-gray-600 mb-2">{book.author}</p>
              <p className="text-lg font-bold text-gray-900 mb-4">
                {formatPrice(book.price)}
              </p>

              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  size="sm"
                  onClick={() => handleAddToCart(book._id)}
                  disabled={book.stock === 0}
                >
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  {book.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemove(book._id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
