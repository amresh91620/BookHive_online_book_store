import { Link } from "react-router-dom";
import { Heart, Star } from "lucide-react";
import { useSelector } from "react-redux";
import { useAddToCart } from "@/hooks/api/useCart";
import {
  useWishlist,
  useAddToWishlist,
  useRemoveFromWishlist,
} from "@/hooks/api/useWishlist";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/utils/format";
import toast from "react-hot-toast";

const FALLBACK_IMAGE =
  "https://via.placeholder.com/300x400/78350F/FEF3C7?text=No+Image";

export default function BookCard({ book }) {
  const { user } = useSelector((state) => state.auth);
  const { data: wishlistItems = [] } = useWishlist();
  const addToCart = useAddToCart();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  const isInWishlist = wishlistItems?.some((item) => item._id === book._id);
  
  // Safe rating calculation
  const rating = book?.averageRating || book?.rating || 0;
  const reviewCount = book?.totalReviews || book?.reviewCount || 0;
  const roundedRating = Math.max(0, Math.min(5, Math.round(Number(rating))));
  
  const hasDiscount = Number(book.originalPrice || 0) > Number(book.price || 0);
  const isOutOfStock = book.stock === 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }
    addToCart.mutate({ bookId: book._id, quantity: 1 }, {
      onSuccess: () => toast.success("Added to cart"),
      onError: (err) => toast.error(err?.response?.data?.msg || "Failed to add to cart"),
    });
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to manage wishlist");
      return;
    }
    if (isInWishlist) {
      removeFromWishlist.mutate(book._id, {
        onSuccess: () => toast.success("Removed from wishlist"),
        onError: (err) => toast.error(err?.response?.data?.msg || "Failed to remove"),
      });
    } else {
      addToWishlist.mutate(book._id, {
        onSuccess: () => toast.success("Added to wishlist"),
        onError: (err) => toast.error(err?.response?.data?.msg || "Failed to add"),
      });
    }
  };

  return (
    <Link to={`/books/${book._id}`} className="group block">
      <div className="overflow-hidden rounded-2xl border-2 border-stone-200 bg-white shadow-soft transition-smooth hover:shadow-medium hover:border-amber-300 hover:-translate-y-1">
        {/* Image Section with 3D Book Effect */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-stone-100 to-stone-50 p-3 sm:p-4">
          {/* 3D Book Container */}
          <div className="relative mx-auto h-full w-[85%] transition-transform duration-500 group-hover:scale-105">
            <div 
              className="relative h-full w-full rounded-sm shadow-2xl transition-transform duration-500"
              style={{ 
                transform: 'perspective(1000px) rotateY(-12deg)',
                boxShadow: '10px 10px 30px rgba(0,0,0,0.3), -3px 0 10px rgba(0,0,0,0.15)'
              }}
            >
              {/* Book Cover */}
              <img
                src={book.coverImage || FALLBACK_IMAGE}
                alt={book.title || "Book cover"}
                loading="lazy"
                onError={(e) => {
                  console.log('Image failed to load:', book.coverImage);
                  e.target.onerror = null;
                  e.target.src = FALLBACK_IMAGE;
                }}
                className="h-full w-full rounded-sm object-cover"
              />
              
              {/* Book Spine Shadow */}
              <div className="absolute left-0 top-0 h-full w-2 sm:w-3 bg-gradient-to-r from-black/50 via-black/20 to-transparent pointer-events-none" />
              
              {/* Book Edge Highlight */}
              <div className="absolute right-0 top-0 h-full w-0.5 sm:w-1 bg-gradient-to-l from-white/40 to-transparent pointer-events-none" />
              
              {/* Book Pages Effect - Right Side */}
              <div className="absolute -right-0.5 sm:-right-1 top-1 h-[calc(100%-8px)] w-1 sm:w-1.5 rounded-r-sm bg-white shadow-sm pointer-events-none" />
              <div className="absolute -right-1 sm:-right-2 top-2 h-[calc(100%-16px)] w-1 sm:w-1.5 rounded-r-sm bg-stone-100 shadow-sm pointer-events-none" />
            </div>
          </div>
          
          {/* Badges */}
          {(book.discount > 0 || book.bestseller || book.newArrival) && (
            <div className="absolute left-2 sm:left-3 top-2 sm:top-3 z-10 flex flex-col gap-1">
              {book.discount > 0 && (
                <Badge className="bg-gradient-to-r from-red-500 to-red-600 px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-bold text-white shadow-medium">
                  -{book.discount}%
                </Badge>
              )}
              {book.bestseller && (
                <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-600 px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-bold text-white shadow-medium">
                  Bestseller
                </Badge>
              )}
              {book.newArrival && (
                <Badge className="bg-gradient-to-r from-green-500 to-green-600 px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-bold text-white shadow-medium">
                  New
                </Badge>
              )}
            </div>
          )}

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={handleWishlistToggle}
            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            className="absolute right-2 sm:right-3 top-2 sm:top-3 z-10 rounded-full bg-white p-2 shadow-medium transition-smooth hover:scale-110 hover:shadow-large"
          >
            <Heart
              className={`h-4 w-4 transition-smooth ${isInWishlist ? "fill-red-500 text-red-500 scale-110" : "text-stone-600 hover:text-red-500"}`}
            />
          </button>
        </div>

        {/* Content Section */}
        <div className="p-3 sm:p-4">
          {/* Title & Author */}
          <h3 className="line-clamp-2 text-sm sm:text-base font-semibold text-stone-900 group-hover:text-amber-700 leading-tight transition-smooth">
            {book.title}
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-stone-600 truncate font-light">{book.author}</p>

          {/* Rating */}
          <div className="mt-2 sm:mt-3 flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition-smooth ${
                    i < roundedRating
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-stone-100 text-stone-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs sm:text-sm font-bold text-stone-900">
              {rating > 0 ? Number(rating).toFixed(1) : "0.0"}
            </span>
            <span className="hidden sm:inline text-xs text-stone-500">({reviewCount})</span>
          </div>

          {/* Price & Button */}
          <div className="mt-3 sm:mt-4 flex items-center justify-between gap-2">
            <div className="flex-shrink-0">
              <p className="text-base sm:text-xl font-bold text-stone-900">{formatPrice(book.price)}</p>
              {hasDiscount && (
                <p className="text-xs sm:text-sm text-stone-400 line-through font-light">
                  {formatPrice(book.originalPrice)}
                </p>
              )}
            </div>
            <Button
              onClick={handleAddToCart}
              className="btn-premium rounded-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white transition-smooth shadow-soft hover:shadow-medium hover:scale-105"
              size="sm"
              disabled={isOutOfStock}
            >
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
