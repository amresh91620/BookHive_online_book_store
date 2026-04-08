import { Link } from "react-router-dom";
import { useWishlist, useRemoveFromWishlist } from "@/hooks/api/useWishlist";
import { useAddToCart } from "@/hooks/api/useCart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Trash2, BookOpen } from "lucide-react";
import { formatPrice } from "@/utils/format";
import toast from "react-hot-toast";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function WishlistPage() {
  const { data: items = [], isLoading } = useWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const addToCart = useAddToCart();

  const [headerRef, headerVisible] = useScrollAnimation();

  const handleRemove = (bookId) => {
    removeFromWishlist.mutate(bookId, {
      onSuccess: () => toast.success("Removed from wishlist"),
      onError: (err) => toast.error(err?.response?.data?.msg || "Failed to remove"),
    });
  };

  const handleAddToCart = (bookId) => {
    addToCart.mutate({ bookId, quantity: 1 }, {
      onSuccess: () => toast.success("Added to cart"),
      onError: (err) => toast.error(err?.response?.data?.msg || "Failed to add to cart"),
    });
  };

  /* ── Loading skeleton ───────────────────────────────────────── */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f7f5ef] py-8 sm:py-12">
        <div className="container-shell">
          {/* Page header skeleton */}
          <div className="mb-8 animate-fade-in-up">
            <div className="h-10 w-56 skeleton-wave rounded-xl mb-2" />
            <div className="h-4 w-32 skeleton-wave rounded" />
          </div>

          {/* Items */}
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-[#f0e4d6] p-5 sm:p-6"
                style={{
                  animationDelay: `${i * 100}ms`,
                  boxShadow: '0 4px 20px rgba(217,118,66,0.05)',
                }}
              >
                <div className="flex flex-col sm:flex-row gap-5">
                  {/* Book image skeleton — 3D-style */}
                  <div
                    className="relative w-28 h-40 sm:w-24 sm:h-32 flex-shrink-0 mx-auto sm:mx-0 skeleton-wave rounded-lg overflow-hidden"
                    style={{
                      transform: 'perspective(800px) rotateY(-8deg)',
                      boxShadow: '6px 6px 18px rgba(0,0,0,0.1)',
                    }}
                  >
                    <div className="skeleton-overlay rounded-lg" />
                  </div>

                  {/* Content skeletons */}
                  <div className="flex-1 space-y-3 pt-1">
                    <div className="h-6 skeleton-wave rounded w-3/4" />
                    <div className="h-4 skeleton-wave rounded w-2/5" />

                    <div className="flex gap-2 flex-wrap">
                      <div className="h-6 w-20 skeleton-wave-orange rounded-full" />
                      <div className="h-6 w-16 skeleton-wave rounded-full" />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                      <div className="flex items-baseline gap-2">
                        <div className="h-8 w-24 skeleton-wave-orange rounded" />
                        <div className="h-4 w-16 skeleton-wave rounded" />
                      </div>
                      <div className="flex gap-2">
                        <div className="h-10 flex-1 sm:w-36 skeleton-wave-orange rounded-xl" />
                        <div className="h-10 w-28 skeleton-wave rounded-xl" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── Empty state ────────────────────────────────────────────── */
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f7f5ef] flex items-center justify-center py-20 px-4">
        <div className="text-center max-w-sm">
          <div
            className="w-24 h-24 rounded-full bg-[#fef3ed] flex items-center justify-center mx-auto mb-6"
            style={{ boxShadow: '0 0 0 8px rgba(217,118,66,0.08)' }}
          >
            <Heart className="w-12 h-12 text-[#d97642]" />
          </div>
          <h2 className="text-3xl font-bold text-stone-900 mb-3">Your wishlist is empty</h2>
          <p className="text-stone-600 mb-8 font-light leading-relaxed">
            Save your favourite books here so you never lose track of what you want to read next.
          </p>
          <Link to="/books">
            <Button className="bg-gradient-to-r from-[#d97642] to-[#e08550] hover:from-[#c26535] hover:to-[#d97642] text-white px-8 py-6 h-auto text-base font-semibold shadow-md hover:shadow-lg transition-all duration-300 rounded-xl">
              <BookOpen className="w-5 h-5 mr-2" />
              Browse Books
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  /* ── Wishlist items ─────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#f7f5ef] py-8 sm:py-12">
      <div className="container-shell">
        {/* Header */}
        <div
          ref={headerRef}
          className={`mb-8 transition-all duration-700 ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-1 flex items-center gap-3">
            <Heart className="w-8 h-8 text-red-500 fill-red-500" />
            My Wishlist
          </h1>
          <p className="text-stone-600 font-light">
            {items.length} saved {items.length === 1 ? 'book' : 'books'}
          </p>
        </div>

        {/* Items list */}
        <div className="space-y-4">
          {items.map((book, index) => (
            <div
              key={book._id}
              className="bg-white rounded-2xl border border-[#f0e4d6] p-5 sm:p-6 transition-all duration-700 hover:border-[#d97642]/40 hover:shadow-lg"
              style={{
                opacity: headerVisible ? 1 : 0,
                transform: headerVisible ? 'translateY(0)' : 'translateY(40px)',
                transitionDelay: `${index * 100}ms`,
                boxShadow: '0 4px 20px rgba(217,118,66,0.05)',
              }}
            >
              <div className="flex flex-col sm:flex-row gap-5">
                {/* Book image — subtle 3D tilt */}
                <Link to={`/books/${book._id}`} className="flex-shrink-0 mx-auto sm:mx-0">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    loading="lazy"
                    className="w-28 h-40 sm:w-24 sm:h-32 object-cover rounded-lg transition-transform duration-300 hover:scale-105"
                    style={{
                      transform: 'perspective(800px) rotateY(-8deg)',
                      boxShadow: '6px 8px 20px rgba(0,0,0,0.18), -2px 0 8px rgba(0,0,0,0.08)',
                    }}
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <Link to={`/books/${book._id}`}>
                    <h3 className="text-xl font-bold text-stone-900 hover:text-[#d97642] transition-colors mb-1 line-clamp-2">
                      {book.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-stone-600 mb-3 font-light">by {book.author}</p>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {book.categories && (
                      <Badge
                        variant="secondary"
                        className="text-xs bg-[#fef3ed] text-[#c26535] border border-[#f3dccc]"
                      >
                        {Array.isArray(book.categories) ? book.categories[0] : book.categories}
                      </Badge>
                    )}
                    {book.format && (
                      <Badge variant="outline" className="text-xs border-[#f0e4d6] text-stone-600">
                        {book.format}
                      </Badge>
                    )}
                    {book.discount > 0 && (
                      <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs border-0">
                        {book.discount}% OFF
                      </Badge>
                    )}
                  </div>

                  {/* Price & actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-[#d97642]">
                        {formatPrice(book.price)}
                      </span>
                      {book.originalPrice && book.originalPrice > book.price && (
                        <span className="text-sm text-stone-400 line-through">
                          {formatPrice(book.originalPrice)}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        className="flex-1 sm:flex-none bg-gradient-to-r from-[#d97642] to-[#e08550] hover:from-[#c26535] hover:to-[#d97642] text-white shadow-sm hover:shadow-md transition-all rounded-xl"
                        onClick={() => handleAddToCart(book._id)}
                        disabled={book.stock === 0}
                        aria-label={book.stock === 0 ? "Out of stock" : `Add ${book.title} to cart`}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" aria-hidden="true" />
                        {book.stock === 0 ? "Out of Stock" : "Add to Cart"}
                      </Button>
                      <Button
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 rounded-xl transition-all"
                        onClick={() => handleRemove(book._id)}
                        aria-label={`Remove ${book.title} from wishlist`}
                      >
                        <Trash2 className="w-4 h-4 mr-2" aria-hidden="true" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
