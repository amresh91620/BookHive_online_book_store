import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Search, BookOpen } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useBooks } from "../hooks/useBooks";
import { useAuth } from "../hooks/useAuth";
import AuthModal from "../components/AuthModal";
import toast from "react-hot-toast";

const Books = () => {
  const { books, fetchBooksPage } = useBooks();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [pageBooks, setPageBooks] = useState([]);
  const [initialLoading, setInitialLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authType, setAuthType] = useState("login");
  const observerRef = useRef(null);

  const booksPerPage = 10;

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

  const loadFirstPage = useCallback(async () => {
    try {
      setInitialLoading(true);
      const res = await fetchBooksPage({
        limit: booksPerPage,
        cursor: "",
        q: search,
        category: category === "all" ? "" : category,
      });
      setPageBooks(res?.books || []);
      setNextCursor(res?.nextCursor || null);
      setHasMore(Boolean(res?.hasMore));
    } catch (error) {
      setPageBooks([]);
      setNextCursor(null);
      setHasMore(false);
    } finally {
      setInitialLoading(false);
    }
  }, [fetchBooksPage, booksPerPage, search, category]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loadingMore) return;
    if (!nextCursor) return;
    setLoadingMore(true);
    try {
      const res = await fetchBooksPage({
        cursor: nextCursor,
        limit: booksPerPage,
        q: search,
        category: category === "all" ? "" : category,
      });
      setPageBooks((prev) => [...prev, ...(res?.books || [])]);
      setNextCursor(res?.nextCursor || null);
      setHasMore(Boolean(res?.hasMore));
    } catch (error) {
      // no-op
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loadingMore, nextCursor, fetchBooksPage, booksPerPage, search, category]);

  useEffect(() => {
    loadFirstPage();
  }, [loadFirstPage]);

  useEffect(() => {
    const node = observerRef.current;
    if (!node) return;
    if (!hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, nextCursor, loadingMore, loadMore]);

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add items to cart.");
      setAuthType("login");
      setIsAuthModalOpen(true);
      return;
    }
    navigate("/cart");
  };

  return (
    <div className="bg-white text-slate-900 min-h-screen">
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        type={authType}
        setType={setAuthType}
      />
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              Browse Books
            </p>
            <h1 className="mt-2 text-3xl sm:text-4xl font-black">
              All Books
            </h1>
            <p className="mt-2 text-slate-600 text-sm sm:text-base">
              Explore our full collection and find your next favorite read.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by title or author..."
                value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              />
            </div>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
              }}
              className="w-full sm:w-56 rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === "all" ? "All Categories" : c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* List (HomeSection style) */}
        <div className="bg-white">
          {initialLoading ? (
            <div className="flex flex-col items-center py-20 gap-4 ">
              <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
              <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">
                Fetching Books...
              </p>
            </div>
          ) : pageBooks.length > 0 ? (
            <div className="flex flex-col gap-6">
              {pageBooks.map((book, index) => (
                <div
                  key={book._id}
                  className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start border-b border-slate-200 bg-white py-6 transition"
                >
                  <div className="w-full lg:w-40 shrink-0 flex justify-center lg:justify-start">
                    <Link
                      to={`/book-rating/${book._id}`}
                      className="relative w-32 sm:w-36 lg:w-full overflow-hidden shadow-lg border border-slate-100 bg-white block"
                    >
                      <img
                        src={
                          book.coverImage ||
                          "https://via.placeholder.com/150?text=No+Cover"
                        }
                        alt={book.title}
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                      />
                    </Link>
                  </div>

                  <div className="flex-1 w-full">
                    <div className="flex flex-col xl:flex-row justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-slate-900 font-semibold">
                            {index + 1}.
                          </span>
                          <span className="px-2 py-1 rounded-full bg-slate-100 text-[10px] font-bold uppercase text-slate-500">
                            {book.categories || "General"}
                          </span>
                        </div>
                        <h2 className="text-xl md:text-2xl font-black text-slate-900">
                          {book.title}
                        </h2>
                        <p className="text-slate-500 mt-2 text-sm font-medium">
                          by{" "}
                          <span className="text-slate-900 underline decoration-slate-300">
                            {book.author}
                          </span>
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          to={`/book-rating/${book._id}`}
                          className="inline-flex items-center justify-center bg-slate-900 text-white h-11 rounded-2xl px-5 text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition"
                        >
                          Rate
                        </Link>
                        <Link
                          to="/cart"
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddToCart();
                          }}
                          className="inline-flex items-center justify-center border border-slate-300 text-slate-700 h-11 rounded-2xl px-4 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition"
                        >
                          Add to Cart
                        </Link>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mt-4">
                      <span className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">
                        {book.pages || "N/A"} Pages
                      </span>
                      <div className="h-1 w-1 bg-slate-300 rounded-full"></div>
                      <span className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">
                        Rs. {book.price}
                      </span>
                    </div>

                    <p className="mt-4 text-slate-500 text-sm line-clamp-2 leading-relaxed">
                      {book.description || "No description available."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[2rem]">
              <BookOpen className="mx-auto text-slate-200 mb-4" size={48} />
              <p className="text-slate-400 font-bold">No books found.</p>
            </div>
          )}
        </div>

        {/* Infinite Scroll Sentinel */}
        <div ref={observerRef} className="h-10" />
        {loadingMore ? (
          <div className="flex justify-center py-6">
            <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          !initialLoading &&
          pageBooks.length > 0 &&
          !hasMore && (
            <div className="flex justify-end py-6">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">
                No more items
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Books;
