import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/store/slices/cartSlice";
import { addToWishlist, removeFromWishlist } from "@/store/slices/wishlistSlice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/utils/format";
import toast from "react-hot-toast";

export default function BookCard({ book }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  const isInWishlist = wishlistItems?.some((item) => item._id === book._id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }
    dispatch(addToCart(book._id))
      .unwrap()
      .then(() => toast.success("Added to cart"))
      .catch((err) => toast.error(err));
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to manage wishlist");
      return;
    }
    if (isInWishlist) {
      dispatch(removeFromWishlist(book._id))
        .unwrap()
        .then(() => toast.success("Removed from wishlist"))
        .catch((err) => toast.error(err));
    } else {
      dispatch(addToWishlist(book._id))
        .unwrap()
        .then(() => toast.success("Added to wishlist"))
        .catch((err) => toast.error(err));
    }
  };

  return (
    <Link to={`/books/${book._id}`} className="group block">
      <div className="bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
        {/* Image Container - 3D Book Effect */}
        <div className="relative aspect-[3/4] bg-gray-50 flex-shrink-0 mx-4 mt-4 rounded-r-md  overflow-hidden shadow-[4px_4px_10px_rgba(0,0,0,0.15)] group-hover:shadow-[6px_6px_15px_rgba(0,0,0,0.2)] transition-shadow duration-300 transform perspective-1000">
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          />
          
          {/* 3D Spine and Edge Overlays */}
          <div className="absolute inset-0 pointer-events-none rounded-r-md rounded-l-sm opacity-60">
            {/* Spine Highlight/Shadow */}
            <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/20 via-white/10 to-transparent"></div>
            {/* Page edge highlight (right) */}
            <div className="absolute inset-y-0 right-0 w-[2px] bg-gradient-to-l from-white/40 to-transparent"></div>
            {/* Top and Bottom edge highlights */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-white/20"></div>
            <div className="absolute inset-x-0 bottom-0 h-[1px] bg-black/10"></div>
          </div>
          
          <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
            {book.bestseller && (
              <Badge className="bg-[#f54343] text-[#FEF3C7] font-serif font-bold text-[9px] sm:text-[10px] px-2 py-0.5 shadow-md border border-[#D97706] uppercase tracking-wider w-fit">
                ★ Best Seller
              </Badge>
            )}
            {book.discount > 0 && (
              <Badge className="bg-[#F59E0B] text-white font-bold text-[9px] sm:text-[10px] px-2 py-0.5 shadow-md border-0 w-fit">
                {book.discount}% OFF
              </Badge>
            )}
            {book.newArrival && (
              <Badge className="bg-[#10B981] text-white font-bold text-[10px] sm:text-xs px-2.5 py-1 shadow-md border-0 w-fit">
                New Arrival
              </Badge>
            )}
          </div>

          
          {/* Wishlist Button - Top Right */}
          <button
            onClick={handleWishlistToggle}
            className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-md hover:bg-white hover:scale-110 transition-all duration-200 z-10"
          >
            <Heart
              className={`w-3.5 h-3.5 ${isInWishlist ? "fill-red-500 text-red-500" : "text-gray-600"}`}
            />
          </button>

          {/* Hover Overlay with Quick Add */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#451a03]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 z-10">
            <Button
              onClick={handleAddToCart}
              className="bg-[#D97706] hover:bg-[#B45309] text-white font-serif tracking-wide shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
              size="sm"
              disabled={book.stock === 0}
            >
              {book.stock === 0 ? (
                "Out of Stock"
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  Quick Add
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Title */}
          <h3 className="font-serif font-bold text-[#451a03] text-base lg:text-lg line-clamp-2 mb-1 group-hover:text-[#D97706] transition-colors leading-snug">
            {book.title}
          </h3>
          
          {/* Author */}
          <p className="text-sm text-gray-600 mb-2">{book.author}</p>

          {/* Rating */}
          {book.rating > 0 && (
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(book.rating)
                      ? "fill-[#F59E0B] text-[#F59E0B]"
                      : "fill-gray-200 text-gray-200"
                  }`}
                />
              ))}
              <span className="text-xs text-gray-500 ml-1">({book.totalReviews || 0})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2 mt-auto pt-3 border-t border-gray-100">
            <span className="text-xl font-bold text-[#78350F]">
              {formatPrice(book.price)}
            </span>
            {book.originalPrice && book.originalPrice > book.price && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(book.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
