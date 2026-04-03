import { Link } from "react-router-dom";
import { Heart, Star, ShoppingCart } from "lucide-react";
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
  "https://via.placeholder.com/300x400/0B7A71/F5F7F6?text=No+Image";

export default function BookCard({ book }) {
  const { user } = useSelector((state) => state.auth);
  const { data: wishlistItems = [] } = useWishlist();
  const addToCart = useAddToCart();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  const isInWishlist = wishlistItems?.some((item) => item._id === book._id);
  
  // Safe rating calculation - with multiple fallbacks for different API responses
  const rating = book?.averageRating || book?.rating || book?.avg_rating || 0;
  const reviewCount = book?.totalReviews || book?.reviewCount || book?.reviews?.length || book?.numberOfReviews || 0;
  const roundedRating = Math.max(0, Math.min(5, Math.round(Number(rating))));
  const hasReviews = Number(reviewCount) > 0 || Number(rating) > 0;
  
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
    <Link to={`/books/${book._id}`} className="group block h-full">
      <div className="relative rounded-xl shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col bg-white overflow-hidden border border-gray-100">
        
        {/* Book Image Container with 3D Effect */}
        <div className="relative bg-gray-50 p-4 md:p-5 lg:p-6 flex items-center justify-center" style={{ minHeight: '240px' }}>
          {/* 3D Shadow Circle */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[60%] h-6 bg-gradient-to-r from-transparent via-black/20 to-transparent rounded-full blur-lg"></div>
          
          {/* Discount Badge - Top Right */}
          {book.discount > 0 && (
            <div className="absolute right-2 top-2 z-20 rounded-md bg-gradient-to-r from-red-500 to-red-600 px-2 py-1 shadow-lg">
              <span className="text-[10px] font-bold text-white">{book.discount}% OFF</span>
            </div>
          )}

          {/* Wishlist Button - Top Left */}
          <button
            type="button"
            onClick={handleWishlistToggle}
            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            className="absolute left-2 top-2 z-20 rounded-full bg-white/95 backdrop-blur-sm p-2 shadow-lg transition-all hover:scale-110 hover:bg-white"
          >
            <Heart
              className={`h-4 w-4 transition-all ${isInWishlist ? "fill-red-500 text-red-500" : "text-gray-600 hover:text-red-500"}`}
            />
          </button>

          {/* 3D Book */}
          <div className="relative w-[75%] md:w-[70%] lg:w-[65%] max-w-[180px] transition-transform duration-300 group-hover:scale-105">
            <div 
              className="relative aspect-[2/3] rounded-sm shadow-2xl"
              style={{ 
                transform: 'perspective(1200px) rotateY(-12deg)',
                boxShadow: '12px 12px 35px rgba(0,0,0,0.3), -4px 0 12px rgba(0,0,0,0.15)'
              }}
            >
              {/* Book Cover */}
              <img
                src={book.coverImage || FALLBACK_IMAGE}
                alt={book.title || "Book cover"}
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = FALLBACK_IMAGE;
                }}
                className="h-full w-full rounded-sm object-cover"
              />
              
              {/* Book Spine Shadow */}
              <div className="absolute left-0 top-0 h-full w-3 bg-gradient-to-r from-black/50 via-black/20 to-transparent rounded-l-sm" />
              
              {/* Book Edge Highlight */}
              <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-l from-white/40 to-transparent rounded-r-sm" />
              
              {/* Book Pages Effect - Right Side */}
              <div className="absolute -right-1 top-1.5 h-[calc(100%-12px)] w-2 rounded-r-sm bg-white shadow-md" />
              <div className="absolute -right-2 top-3 h-[calc(100%-24px)] w-2 rounded-r-sm bg-gray-100 shadow-md" />
              <div className="absolute -right-3 top-4 h-[calc(100%-32px)] w-2 rounded-r-sm bg-gray-200 shadow-sm" />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-3 md:p-4 flex-1 flex flex-col">
          {/* Author */}
          <p className="text-xs text-gray-500 mb-1 line-clamp-1">
            {book.author}
          </p>

          {/* Title */}
          <h3 className="text-sm md:text-base font-semibold leading-tight text-gray-900 line-clamp-2 mb-2 flex-grow">
            {book.title}
          </h3>

          {/* Rating */}
          {hasReviews && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 md:h-3.5 md:w-3.5 ${
                      i < roundedRating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'
                    }`}
                  />
                ))}
              </div>
              {Number(reviewCount) > 0 && (
                <span className="text-xs text-gray-600">
                  ({reviewCount})
                </span>
              )}
            </div>
          )}

          {/* Price Section */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-xl md:text-2xl font-bold text-[#d97642]">
              {formatPrice(book.price)}
            </span>
            {hasDiscount && (
              <span className="text-sm md:text-base text-gray-400 line-through">
                {formatPrice(book.originalPrice)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          {isOutOfStock && (
            <div className="mb-2">
              <span className="text-xs text-red-600 font-semibold">Out of Stock</span>
            </div>
          )}

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            className="w-full h-10 md:h-11 rounded-lg bg-[#d97642] hover:bg-[#c26535] text-white font-semibold text-sm md:text-base shadow-sm transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            disabled={isOutOfStock}
          >
            <ShoppingCart className="w-4 h-4" />
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </Button>
        </div>
      </div>
    </Link>
  );
}

