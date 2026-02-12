import React from "react";
import { useNavigate } from "react-router-dom";
import { Star, Heart } from "lucide-react";
import Button from "../ui/Button";
import { useWishlist } from "../../hooks/useWishlist";

const BookCard = React.memo(
  ({ book, avgRating = 0, reviewCount = 0, onAddToCart, className = "" }) => {
    const { toggleWishlist, wishlistIds } = useWishlist();
    const navigate = useNavigate();
    const isWishlisted = wishlistIds?.has(String(book._id));
    const ratingValue =
      typeof avgRating === "number"
        ? avgRating.toFixed(1)
        : avgRating || "0.0";
    const categoryLabel = (book.categories || "")
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean)[0];
    const publishedYear = book.publishedDate
      ? new Date(book.publishedDate).getFullYear()
      : null;
    const isOutOfStock = Number(book.stock) <= 0;
    const isLowStock = !isOutOfStock && Number(book.stock) < 10;

    const handleNavigate = () => {
      navigate(`/book-rating/${book._id}`);
    };

    const handleToggleWishlist = (event) => {
      event.stopPropagation();
      toggleWishlist(book._id);
    };

    const handleAddToCart = (event) => {
      event.stopPropagation();
      if (typeof onAddToCart === "function") {
        onAddToCart(book._id);
      }
    };

    return (
      <div
        className={`group cursor-pointer h-full flex flex-col ${className}`}
        onClick={handleNavigate}
      >
        <div className="relative mb-3 sm:mb-4 overflow-hidden bg-slate-200 aspect-[3/4] shadow-sm transition-transform group-hover:-translate-y-1 sm:group-hover:-translate-y-2">
          <img
            src={book.coverImage || "https://via.placeholder.com/300x400"}
            alt={book.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute left-2 sm:left-3 top-2 sm:top-3 flex flex-col gap-1">
            {book.bestseller && (
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full bg-amber-400 text-amber-950 shadow-sm">
                Bestseller
              </span>
            )}
            {Number(book.discount) > 0 && (
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full bg-rose-500 text-white shadow-sm">
                {book.discount}% Off
              </span>
            )}
          </div>
          <div className="absolute right-2 sm:right-3 top-2 sm:top-3">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full bg-white/90 text-slate-900 shadow-sm">
              ₹{book.price}
            </span>
          </div>
        </div>

      <div className="flex flex-col flex-1">
        <div className="flex items-center gap-1 mb-1 sm:mb-1.5">
          <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-[#3B82F6] text-[#3B82F6]" />
          <span className="text-[9px] sm:text-[10px] font-sans font-bold text-[#2563EB]">
            {ratingValue} / 5.0
          </span>
          <span className="text-[9px] sm:text-[10px] text-slate-400">
            ({reviewCount} reviews)
          </span>
        </div>

        <h3 className="font-bold text-xs sm:text-sm md:text-base leading-tight mb-1 group-hover:text-[#3B82F6] transition-colors text-[#0F172A] line-clamp-2 min-h-[2.5rem]">
          {book.title}
        </h3>
        <p className="text-[#64748B] text-[9px] sm:text-[10px] md:text-xs mb-2 italic truncate">
          {book.author}
        </p>
        <div className="flex flex-wrap items-center gap-1.5 mb-2">
          {categoryLabel && (
            <span className="text-[8px] sm:text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {categoryLabel}
            </span>
          )}
          {book.format && (
            <span className="text-[8px] sm:text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
              {book.format}
            </span>
          )}
          {book.language && (
            <span className="text-[8px] sm:text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
              {book.language}
            </span>
          )}
        </div>
        <p className="text-[9px] sm:text-[10px] text-slate-500 mb-2">
          {book.pages ? `${book.pages} pages` : "Pages N/A"}
          {publishedYear ? ` · ${publishedYear}` : ""}
        </p>
        <p
          className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mb-3 ${
            isOutOfStock
              ? "text-rose-500"
              : isLowStock
                ? "text-amber-500"
                : "text-emerald-500"
          }`}
        >
          {isOutOfStock
            ? "Out of Stock"
            : isLowStock
              ? `Only ${book.stock} left`
              : "In Stock"}
        </p>

        <div className="mt-auto flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddToCart}
            className="flex-1 border-[#0F172A] text-[9px] sm:text-[10px] font-bold uppercase tracking-widest hover:bg-[#0F172A] hover:text-white"
          >
            Add to Cart
          </Button>
          <button
            type="button"
            onClick={handleToggleWishlist}
            className={`h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center border rounded-full transition-colors ${
              isWishlisted
                ? "border-rose-500 bg-rose-500 text-white"
                : "border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-white"
            }`}
            aria-label="Toggle wishlist"
          >
            <Heart className={isWishlisted ? "fill-current" : ""} size={14} />
          </button>
        </div>
      </div>
      </div>
    );
  },
);

BookCard.displayName = "BookCard";

export default BookCard;
