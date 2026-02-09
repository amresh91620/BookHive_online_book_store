import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Search,
  BookOpen,
  Star,
  ShoppingCart,
  Eye,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useBooks } from "../hooks/useBooks";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { useReview } from "../hooks/useReview";
import AuthModal from "../components/AuthModal";
import toast from "react-hot-toast";

const Books = () => {
  const { books, fetchBooksPage } = useBooks();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { getAvgRatingByBook, fetchAllReviews } = useReview();

  // State
  const [searchInput, setSearchInput] = useState(""); // UI state for input
  const [search, setSearch] = useState(""); // Debounced state for API
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

  // --- Search Debouncing ---
  useEffect(() => {
    const handler = setTimeout(() => setSearch(searchInput), 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // --- Real-time Rating Fetching ---
  useEffect(() => {
    if (pageBooks.length === 0) return;
    const bookIds = pageBooks.map((b) => b._id).filter(Boolean);
    const key = bookIds.join("|");
    if (key === lastReviewIdsRef.current) return;
    lastReviewIdsRef.current = key;
    fetchAllReviews(bookIds);
  }, [pageBooks, fetchAllReviews]);

  // --- Categories Memo ---
  const categories = useMemo(() => {
    const set = new Set();
    books.forEach((book) => {
      const raw = book.categories || "";
      raw.split(",").map((c) => c.trim()).filter(Boolean).forEach((c) => set.add(c));
    });
    return ["all", ...Array.from(set)];
  }, [books]);

  // --- Data Loading ---
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
    } finally {
      setInitialLoading(false);
    }
  }, [fetchBooksPage, search, category]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loadingMore || !nextCursor) return;
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
      console.error(error);
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loadingMore, nextCursor, fetchBooksPage, search, category]);

  useEffect(() => {
    loadFirstPage();
  }, [loadFirstPage]);

  // --- Intersection Observer ---
  useEffect(() => {
    const node = observerRef.current;
    if (!node || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore(); },
      { rootMargin: "300px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  const handleAddToCart = async (bookId) => {
    if (!user) {
      toast.error("Please login to add items to cart.");
      setAuthType("login");
      setIsAuthModalOpen(true);
      return;
    }
    try {
      await addToCart(bookId);
      toast.success("Added to cart");
    } catch (err) {
      toast.error("Failed to add item");
    }
  };

  // --- Skeleton Component ---
  const SkeletonCard = () => (
    <div className="animate-pulse bg-white rounded-xl overflow-hidden border border-slate-100">
      <div className="bg-slate-200 aspect-[3/4]" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-3 bg-slate-100 rounded w-1/2" />
        <div className="h-8 bg-slate-50 rounded mt-4" />
      </div>
    </div>
  );

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-20 font-sans text-slate-900">
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        type={authType}
        setAuthType={setAuthType}
      />

      {/* --- REFINED HEADER --- */}
      <div className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="bg-slate-900 p-1.5 rounded-lg">
                  <BookOpen className="text-white" size={18} />
                </div>
                <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase">
                  The Library
                </h1>
              </div>
              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">
                {pageBooks.length} Editions in <span className="text-amber-600 underline decoration-2 underline-offset-4">{category}</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Find your next read..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full bg-slate-100 border-none rounded-xl py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-slate-900/5 transition-all placeholder:text-slate-400"
                />
              </div>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full sm:w-auto appearance-none bg-slate-100 border-none rounded-xl py-3 px-6 pr-12 text-xs font-black text-slate-700 uppercase tracking-widest outline-none cursor-pointer hover:bg-slate-200 transition-all"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c === "all" ? "All Genres" : c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* --- GRID SECTION --- */}
      <div className="max-w-7xl mx-auto px-6 mt-12">
        {initialLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : pageBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
            {pageBooks.map((book) => {
              const avgRating = getAvgRatingByBook(book._id);
              const isOutOfStock = book.stock <= 0;
              const isLowStock = book.stock > 0 && book.stock < 10;

              return (
                <div key={book._id} className="group relative flex flex-col bg-white rounded-2xl transition-all duration-500 hover:-translate-y-2">
                  {/* Decorative Spine */}
                  <div className="absolute left-0 top-6 bottom-6 w-[3px] bg-slate-100 group-hover:bg-amber-400 transition-colors z-10 rounded-r" />
                  
                  {/* Image Container */}
                  <div className="relative aspect-[3/4] overflow-hidden rounded-t-2xl bg-slate-100">
                    <img
                      src={book.coverImage || "https://via.placeholder.com/300x400"}
                      alt={book.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Floating Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {book.bestseller && (
                        <span className="backdrop-blur-md bg-slate-900/80 text-white text-[9px] font-black px-2 py-1 rounded shadow-sm uppercase tracking-tighter">
                          Bestseller
                        </span>
                      )}
                      {book.discount > 0 && (
                        <span className="backdrop-blur-md bg-rose-500/90 text-white text-[9px] font-black px-2 py-1 rounded shadow-sm uppercase">
                          -{book.discount}%
                        </span>
                      )}
                    </div>

                    {/* Quick Actions Hover Overlay */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 translate-x-14 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                      <Link to={`/book-rating/${book._id}`} className="p-3 bg-white text-slate-900 rounded-full shadow-xl hover:bg-slate-900 hover:text-white transition-all">
                        <Eye size={18} />
                      </Link>
                      {!isOutOfStock && (
                        <button onClick={() => handleAddToCart(book._id)} className="p-3 bg-white text-slate-900 rounded-full shadow-xl hover:bg-amber-500 hover:text-white transition-all">
                          <ShoppingCart size={18} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-6 flex flex-col flex-1 border-x border-b border-slate-100 rounded-b-2xl shadow-sm group-hover:shadow-2xl group-hover:shadow-slate-200/50 transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 min-h-[2.5rem] group-hover:text-amber-600 transition-colors">
                          {book.title}
                        </h3>
                        <p className="text-slate-500 text-[11px] font-semibold italic">
                          {book.author}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
                        <Star size={10} fill="#f59e0b" className="text-amber-500" />
                        <span className="text-[10px] font-black text-amber-700">{avgRating || "0.0"}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-[9px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-black uppercase tracking-widest">{book.format}</span>
                      <span className="text-[9px] text-slate-400 font-bold uppercase">{book.language}</span>
                    </div>

                    <div className="mt-auto pt-5 border-t border-slate-50 flex items-center justify-between">
                      <div className="flex flex-col">
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-black text-slate-900">₹{book.price}</span>
                          {book.originalPrice > book.price && (
                            <span className="text-[10px] text-slate-400 line-through">₹{book.originalPrice}</span>
                          )}
                        </div>
                        {isLowStock && (
                          <span className="text-[9px] font-bold text-orange-500 mt-1 uppercase flex items-center gap-1">
                            <AlertTriangle size={8} /> Only {book.stock} Left
                          </span>
                        )}
                        {!isOutOfStock && !isLowStock && (
                           <span className="text-[9px] font-bold text-emerald-500 mt-1 uppercase flex items-center gap-1">
                            <CheckCircle size={8} /> In Stock
                          </span>
                        )}
                      </div>

                      <button
                        disabled={isOutOfStock}
                        onClick={() => handleAddToCart(book._id)}
                        className={`text-[9px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl transition-all ${
                          isOutOfStock ? 'bg-slate-50 text-slate-300' : 'bg-slate-900 text-white hover:bg-amber-600 hover:shadow-lg hover:shadow-amber-200'
                        }`}
                      >
                        {isOutOfStock ? 'Sold Out' : 'Add to Bag'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-40 text-center">
            <div className="inline-flex p-6 rounded-full bg-slate-50 mb-6">
              <BookOpen className="text-slate-200" size={48} />
            </div>
            <h2 className="text-slate-900 font-black text-xl mb-2">No Titles Found</h2>
            <p className="text-slate-400 font-medium text-sm">Try adjusting your filters or search terms.</p>
          </div>
        )}

        {/* Load More Trigger */}
        <div ref={observerRef} className="h-20 flex items-center justify-center">
          {loadingMore && (
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Books;