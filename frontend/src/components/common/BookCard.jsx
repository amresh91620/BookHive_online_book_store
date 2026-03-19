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
    addToCart.mutate(book._id, {
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
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl">
        {/* Image Section with 3D Book Effect */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 p-2 sm:p-4">
          {/* 3D Book Container */}
          <div className="relative mx-auto h-full w-[85%] transition-transform duration-300 group-hover:scale-105">
            <div 
              className="relative h-full w-full rounded-sm shadow-2xl transition-transform duration-300"
              style={{ 
                transform: 'perspective(1000px) rotateY(-12deg)',
                boxShadow: '10px 10px 30px rgba(0,0,0,0.3), -3px 0 10px rgba(0,0,0,0.15)'
              }}
            >
              {/* Book Cover */}
              <img
                src={book.coverImage || FALLBACK_IMAGE}
                alt={book.title}
                loading="lazy"
                onError={(e) => {
                  e.target.src = FALLBACK_IMAGE;
                }}
                className="h-full w-full rounded-sm object-cover"
              />
              
              {/* Book Spine Shadow */}
              <div className="absolute left-0 top-0 h-full w-2 sm:w-3 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
              
              {/* Book Edge Highlight */}
              <div className="absolute right-0 top-0 h-full w-0.5 sm:w-1 bg-gradient-to-l from-white/40 to-transparent" />
              
              {/* Book Pages Effect - Right Side */}
              <div className="absolute -right-0.5 sm:-right-1 top-1 h-[calc(100%-8px)] w-1 sm:w-1.5 rounded-r-sm bg-white shadow-sm" />
              <div className="absolute -right-1 sm:-right-2 top-2 h-[calc(100%-16px)] w-1 sm:w-1.5 rounded-r-sm bg-gray-100 shadow-sm" />
            </div>
          </div>
          
          {/* Badges */}
          {(book.discount > 0 || book.bestseller || book.newArrival) && (
            <div className="absolute left-1 sm:left-2 top-1 sm:top-2 z-10 flex flex-col gap-0.5 sm:gap-1">
              {book.discount > 0 && (
                <Badge className="bg-red-500 px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold text-white shadow-md">
                  -{book.discount}%
                </Badge>
              )}
              {book.bestseller && (
                <Badge className="bg-yellow-500 px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold text-white shadow-md">
                  Bestseller
                </Badge>
              )}
              {book.newArrival && (
                <Badge className="bg-green-500 px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold text-white shadow-md">
                  New Arrival
                </Badge>
              )}
            </div>
          )}

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={handleWishlistToggle}
            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            className="absolute right-1 sm:right-2 top-1 sm:top-2 z-10 rounded-full bg-white p-1.5 sm:p-2 shadow-md transition-all hover:scale-110"
          >
            <Heart
              className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isInWishlist ? "fill-red-500 text-red-500" : "text-gray-600"}`}
            />
          </button>
        </div>

        {/* Content Section */}
        <div className="p-2 sm:p-3">
          {/* Title & Author */}
          <h3 className="line-clamp-2 text-xs sm:text-sm font-semibold text-gray-900 group-hover:text-[#D97706] leading-tight">
            {book.title}
          </h3>
          <p className="mt-0.5 text-[10px] sm:text-xs text-gray-500 truncate">{book.author}</p>

          {/* Rating */}
          <div className="mt-1.5 sm:mt-2 flex items-center gap-1 sm:gap-1.5">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 sm:h-4 sm:w-4 ${
                    i < roundedRating
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-gray-100 text-gray-300 stroke-2"
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] sm:text-sm font-bold text-gray-900">
              {rating > 0 ? Number(rating).toFixed(1) : "0.0"}
            </span>
            <span className="hidden sm:inline text-xs text-gray-500">({reviewCount})</span>
          </div>

          {/* Price & Button */}
          <div className="mt-2 sm:mt-3 flex items-center justify-between gap-2">
            <div className="flex-shrink-0">
              <p className="text-sm sm:text-lg font-bold text-gray-900">{formatPrice(book.price)}</p>
              {hasDiscount && (
                <p className="text-[10px] sm:text-xs text-gray-400 line-through">
                  {formatPrice(book.originalPrice)}
                </p>
              )}
            </div>
            <Button
              onClick={handleAddToCart}
              className="rounded-md bg-[#F59E0B] hover:bg-[#D97706] px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium text-white transition-colors flex-shrink-0"
              size="sm"
              disabled={isOutOfStock}
            >
              {isOutOfStock ? "Out" : "Add"}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
