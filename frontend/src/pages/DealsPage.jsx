import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useBookCategories } from "@/hooks/api/useBooks";
import { useInfiniteBooks } from "@/hooks/api/useInfiniteBooks";
import BookCard from "@/components/common/BookCard";
import BookSkeleton from "@/components/common/BookSkeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Tag, Loader2, ChevronRight, SlidersHorizontal } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

const ITEMS_PER_PAGE = 12;

export default function DealsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const loadMoreRef = useRef(null);

  const debouncedSearch = useDebounce(searchQuery, 500);

  const params = {
    limit: ITEMS_PER_PAGE,
  };
  if (debouncedSearch) params.q = debouncedSearch;
  if (category) params.category = category;

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteBooks(params);

  const { data: categories = [] } = useBookCategories();

  // Flatten all pages and filter books with discounts
  const allBooks = data?.pages.flatMap(page => page.books || []) || [];
  const books = allBooks.filter(book => book.discount > 0);
  const totalBooks = books.length;

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    updateURL({ q: searchQuery, category });
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    updateURL({ q: searchQuery, category: newCategory });
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setCategory("");
    setSearchParams({});
  };

  const updateURL = ({ q, category }) => {
    const params = {};
    if (q) params.q = q;
    if (category) params.category = category;
    setSearchParams(params);
  };

  const hasActiveFilters = searchQuery || category;

  const maxDiscount = Math.max(...books.map(b => b.discount || 0), 0);

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-20">
      {/* Premium Editorial Header */}
      <div className="bg-white border-b border-gray-100 pt-8 pb-10">
        <div className="container-shell">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-gray-400 mb-6">
            <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-900">Deals & Offers</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6 flex flex-wrap items-center gap-4">
                Special <span className="text-amber-600 font-serif italic font-normal">Offers</span>
                {maxDiscount > 0 && (
                  <span className="inline-flex items-center justify-center bg-gray-900 text-amber-400 text-lg md:text-xl font-bold px-4 py-2 rounded-full shadow-md transform -rotate-2">
                    Up to {maxDiscount}% OFF
                  </span>
                )}
              </h1>
              <p className="text-lg md:text-xl text-gray-500 leading-relaxed flex items-center gap-3">
                <Tag className="w-5 h-5 text-amber-500" />
                Curated deals on <span className="font-semibold text-gray-900">{totalBooks}</span> beautifully crafted editions.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-shell py-10">
        {/* Refined Filter Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
          
          {/* Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="flex items-center gap-2 text-sm font-semibold tracking-widest uppercase text-gray-400 mr-2 hidden md:flex">
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </div>

            <select
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="h-12 px-6 rounded-full border border-gray-200 bg-white text-gray-700 text-sm font-medium focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all cursor-pointer hover:bg-gray-50 appearance-none pr-10 relative shadow-sm"
              style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="h-12 px-6 rounded-full text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>

          {/* Minimal Search Bar */}
          <div className="w-full lg:w-auto">
            <form onSubmit={handleSearch} className="relative w-full lg:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search deals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-12 bg-white border border-gray-200 rounded-full focus:border-gray-900 focus:ring-1 focus:ring-gray-900 w-full shadow-sm"
              />
            </form>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
            {[...Array(8)].map((_, i) => (
              <BookSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Books Grid */}
        {!isLoading && books.length > 0 && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
              {books.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>

            {/* Load More Trigger */}
            {hasNextPage && (
              <div ref={loadMoreRef} className="flex justify-center mt-20">
                {isFetchingNextPage ? (
                  <div className="flex items-center gap-3 text-gray-500 bg-white px-6 py-3 rounded-full border border-gray-100 shadow-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm font-medium uppercase tracking-wider">Loading deals</span>
                  </div>
                ) : (
                  <div className="h-12" /> 
                )}
              </div>
            )}

            {/* End of Results */}
            {!hasNextPage && books.length > 0 && (
              <div className="text-center mt-20 pt-8 border-t border-gray-200">
                <p className="text-gray-400 text-sm uppercase tracking-widest font-medium">
                  End of Offers
                </p>
              </div>
            )}
          </>
        )}

        {/* No Results */}
        {!isLoading && books.length === 0 && (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm mt-8">
            <div className="mb-6 relative">
              <div className="w-20 h-20 mx-auto bg-gray-50 rounded-full flex items-center justify-center border border-gray-100">
                <Tag className="w-8 h-8 text-gray-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No deals found</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              We couldn't find any discounted books matching your criteria. Try adjusting your filters.
            </p>
            {hasActiveFilters && (
              <Button 
                onClick={handleClearFilters} 
                className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-8 py-6 h-auto"
              >
                Clear All Filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}