import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useBooks } from "../hooks/useBooks";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { useReview } from "../hooks/useReview";
import AuthModal from "../components/AuthModal";
import { BookFilters, BookGrid } from "../components/books";
import { Badge } from "../components/ui";
import { BookOpen, Layers } from "lucide-react";
import showToast from "../utils/toast";
import Spinner from "../components/ui/Spinner";

const Books = () => {
  const { books, fetchBooksPage } = useBooks();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { getAvgRatingByBook, getReviewCountByBook, fetchAllReviews } = useReview();

  // State
  const [searchInput, setSearchInput] = useState("");
  const [category, setCategory] = useState("all");
  const [pageBooks, setPageBooks] = useState([]);
  const [initialLoading, setInitialLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authType, setAuthType] = useState("login");

  const observerRef = useRef(null);
  const lastReviewIdsRef = useRef("");
  const booksPerPage = 12;

  // Real-time Rating Fetching
  useEffect(() => {
    if (pageBooks.length === 0) return;
    const bookIds = pageBooks.map((b) => b._id).filter(Boolean);
    const key = bookIds.join("|");
    if (key === lastReviewIdsRef.current) return;
    lastReviewIdsRef.current = key;
    fetchAllReviews(bookIds);
  }, [pageBooks, fetchAllReviews]);

  // Categories Memo
  const categories = useMemo(() => {
    const set = new Set();
    books.forEach((book) => {
      const raw = book.categories || "";
      raw
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean)
        .forEach((c) => set.add(c));
    });
    return ["all", ...Array.from(set)];
  }, [books]);

  // Average Ratings Memo
  const avgRatings = useMemo(() => {
    const ratings = {};
    pageBooks.forEach((book) => {
      ratings[book._id] = getAvgRatingByBook(book._id);
    });
    return ratings;
  }, [pageBooks, getAvgRatingByBook]);

  const reviewCounts = useMemo(() => {
    const counts = {};
    pageBooks.forEach((book) => {
      counts[book._id] = getReviewCountByBook(book._id);
    });
    return counts;
  }, [pageBooks, getReviewCountByBook]);

  // Data Loading
  const loadFirstPage = useCallback(async () => {
    try {
      setInitialLoading(true);
      const res = await fetchBooksPage({
        limit: booksPerPage,
        cursor: "",
        q: searchInput,
        category: category === "all" ? "" : category,
      });
      setPageBooks(res?.books || []);
      setNextCursor(res?.nextCursor || null);
      setHasMore(Boolean(res?.hasMore));
    } catch (error) {
      setPageBooks([]);
      showToast.error("Failed to load books");
    } finally {
      setInitialLoading(false);
    }
  }, [fetchBooksPage, searchInput, category]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loadingMore || !nextCursor) return;
    setLoadingMore(true);
    try {
      const res = await fetchBooksPage({
        cursor: nextCursor,
        limit: booksPerPage,
        q: searchInput,
        category: category === "all" ? "" : category,
      });
      setPageBooks((prev) => [...prev, ...(res?.books || [])]);
      setNextCursor(res?.nextCursor || null);
      setHasMore(Boolean(res?.hasMore));
    } catch (error) {
      showToast.error("Failed to load more books");
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loadingMore, nextCursor, fetchBooksPage, searchInput, category]);

  useEffect(() => {
    loadFirstPage();
  }, [loadFirstPage]);

  // Intersection Observer
  useEffect(() => {
    const node = observerRef.current;
    if (!node || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "300px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  const handleAddToCart = async (bookId) => {
    if (!user) {
      showToast.error("Please login to add items to cart");
      setAuthType("login");
      setIsAuthModalOpen(true);
      return;
    }
    try {
      await addToCart(bookId);
      showToast.success("Added to cart successfully!");
    } catch (err) {
      showToast.error(err.response?.data?.msg || "Failed to add item to cart");
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        type={authType}
        setType={setAuthType}
      />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.6),_transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-white">
          <Badge variant="secondary" className="bg-white/10 text-white border border-white/20">
            The Library
          </Badge>
          <h1 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            Browse every shelf
          </h1>
          <p className="mt-4 text-sm sm:text-base text-white/85 max-w-2xl">
            Discover new favorites, explore genres, and shop curated reads from the BookHive collection.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                <BookOpen size={20} />
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.3em] text-white/70">Titles</div>
                <div className="text-lg font-black">{pageBooks.length}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                <Layers size={20} />
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.3em] text-white/70">Genres</div>
                <div className="text-lg font-black">{categories.length - 1}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <BookFilters
          sticky={false}
          searchValue={searchInput}
          onSearchChange={setSearchInput}
          categoryValue={category}
          onCategoryChange={setCategory}
          categories={categories}
          totalBooks={pageBooks.length}
        />
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <BookGrid
          books={pageBooks}
          loading={initialLoading}
          avgRatings={avgRatings}
          reviewCounts={reviewCounts}
          onAddToCart={handleAddToCart}
        />

        {/* Load More Trigger */}
        <div ref={observerRef} className="h-20 flex items-center justify-center mt-8">
          {loadingMore && <Spinner size="lg" />}
        </div>
      </div>
    </div>
  );
};

export default Books;
