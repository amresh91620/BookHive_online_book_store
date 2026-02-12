import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Badge, Card, Button } from "../ui";
import { useBooks } from "../../hooks/useBooks";
import { useReview } from "../../hooks/useReview";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import BookGrid from "./BookGrid";
import SearchBar from "../common/SearchBar";
import toast from "react-hot-toast";

const BookCollectionPage = ({
  kicker,
  title,
  description,
  icon: Icon,
  accent = "from-amber-500 via-orange-500 to-rose-500",
  filterBooks,
  emptyTitle = "No titles found",
  emptyDescription = "We couldn't find any books in this collection yet.",
  cta,
}) => {
  const { books, loading } = useBooks();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { fetchAllReviews, getAvgRatingByBook, getReviewCountByBook } = useReview();
  const [query, setQuery] = useState("");

  const filteredBase = useMemo(() => {
    if (typeof filterBooks === "function") {
      return filterBooks(books);
    }
    return books;
  }, [books, filterBooks]);

  const filteredBooks = useMemo(() => {
    if (!query) return filteredBase;
    const q = query.trim().toLowerCase();
    return filteredBase.filter((book) => {
      const haystack = [
        book.title,
        book.author,
        book.categories,
        book.genre,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [filteredBase, query]);

  const avgRatings = useMemo(() => {
    const ratings = {};
    filteredBooks.forEach((book) => {
      ratings[book._id] = Number(getAvgRatingByBook(book._id)) || 0;
    });
    return ratings;
  }, [filteredBooks, getAvgRatingByBook]);

  const reviewCounts = useMemo(() => {
    const counts = {};
    filteredBooks.forEach((book) => {
      counts[book._id] = getReviewCountByBook(book._id);
    });
    return counts;
  }, [filteredBooks, getReviewCountByBook]);

  const handleAddToCart = useCallback(
    async (bookId) => {
      if (!user) {
        toast.error("Please login to add items to cart.");
        return;
      }
      try {
        await addToCart(bookId);
        toast.success("Added to cart!");
      } catch (error) {
        toast.error("Failed to add item");
      }
    },
    [user, addToCart],
  );

  useEffect(() => {
    if (filteredBooks.length === 0) return;
    const ids = filteredBooks.slice(0, 24).map((book) => book._id).filter(Boolean);
    if (ids.length > 0) fetchAllReviews(ids);
  }, [filteredBooks, fetchAllReviews]);

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-90`} />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.6),_transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-white">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="bg-white/15 text-white border border-white/20">
              {kicker}
            </Badge>
            <h1 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
              {title}
            </h1>
            <p className="mt-4 text-sm sm:text-base text-white/90 leading-relaxed">
              {description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Card className="bg-white/10 border border-white/20 text-white px-4 py-3 rounded-2xl">
                <div className="text-xs uppercase tracking-[0.3em] text-white/70">Titles</div>
                <div className="text-2xl font-black">{filteredBase.length}</div>
              </Card>
              {Icon && (
                <Card className="bg-white/10 border border-white/20 text-white px-4 py-3 rounded-2xl flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Icon size={20} />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.3em] text-white/70">Curated</div>
                    <div className="text-sm font-semibold">Staff Picks</div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Card className="p-5 sm:p-6 bg-white shadow-lg border border-slate-200 rounded-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
            <div className="flex-1">
              <SearchBar
                value={query}
                onChange={setQuery}
                placeholder="Search by title, author, or category"
              />
            </div>
            {cta && (
              <Button asChild variant="primary" className="lg:w-auto">
                {cta}
              </Button>
            )}
          </div>
        </Card>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {filteredBooks.length === 0 && !loading ? (
          <Card className="p-10 bg-white text-center border border-slate-200 rounded-2xl">
            <h3 className="text-xl font-bold text-slate-900">{emptyTitle}</h3>
            <p className="mt-2 text-sm text-slate-600">{emptyDescription}</p>
          </Card>
        ) : (
          <BookGrid
            books={filteredBooks}
            loading={loading}
            avgRatings={avgRatings}
            reviewCounts={reviewCounts}
            onAddToCart={handleAddToCart}
          />
        )}
      </section>
    </div>
  );
};

export default BookCollectionPage;
