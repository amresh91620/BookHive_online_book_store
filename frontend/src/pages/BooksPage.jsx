import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useBookCategories } from "@/hooks/api/useBooks";
import { useInfiniteBooks } from "@/hooks/api/useInfiniteBooks";
import BookCard from "@/components/common/BookCard";
import BookSkeleton from "@/components/common/BookSkeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  Grid3x3,
  Loader2,
  Filter,
} from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 12;

export default function BooksPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("filter") || "");
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [sortBy, setSortBy] = useState("relevance");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const loadMoreRef = useRef(null);

  const debouncedSearch = useDebounce(searchQuery, 500);

  const params = {
    limit: ITEMS_PER_PAGE,
  };

  if (debouncedSearch) params.q = debouncedSearch;
  if (category) params.category = category;
  if (statusFilter) params.status = statusFilter;
  
  // Add price range filters
  if (priceRange[0] > 0) params.minPrice = priceRange[0];
  if (priceRange[1] < 2000) params.maxPrice = priceRange[1];
  
  // Add sort parameter
  if (sortBy && sortBy !== 'relevance') params.sortBy = sortBy;

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteBooks(params);

  const { data: categories = [] } = useBookCategories();

  const books = data?.pages.flatMap((page) => page.books || []) || [];
  const totalBooks = data?.pages[0]?.totalBooks || 0;

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

  const updateURL = ({ q, category: nextCategory, filter }) => {
    const nextParams = {};
    if (q) nextParams.q = q;
    if (nextCategory) nextParams.category = nextCategory;
    if (filter) nextParams.filter = filter;
    setSearchParams(nextParams);
  };

  const handleCategoryChange = (nextCategory) => {
    setCategory(nextCategory);
    updateURL({ q: searchQuery, category: nextCategory, filter: statusFilter });
  };

  const handleStatusFilterChange = (nextFilter) => {
    setStatusFilter(nextFilter);
    updateURL({ q: searchQuery, category, filter: nextFilter });
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setCategory("");
    setStatusFilter("");
    setPriceRange([0, 2000]);
    setSortBy("relevance");
    setSearchParams({});
  };

  const hasActiveFilters = Boolean(
    searchQuery || 
    category || 
    statusFilter || 
    priceRange[0] > 0 || 
    priceRange[1] < 2000 || 
    (sortBy && sortBy !== 'relevance')
  );

  return (
    <div className="min-h-screen bg-[#f7f5ef]">
      {/* Header with Search */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="container-shell py-3 sm:py-4">
          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search books, authors, or genres..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 sm:h-12 pl-10 sm:pl-12 pr-4 rounded-full border-gray-300 bg-gray-50 text-sm sm:text-base focus:bg-white focus:border-[#d97642] focus:ring-[#d97642]/20"
              />
            </div>

            {/* Filters Button */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="flex items-center gap-2 px-4 sm:px-5 h-11 sm:h-12 rounded-full border border-gray-300 bg-white hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-[#d97642]" />
              <span className="text-sm sm:text-base font-medium">Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-shell py-3 sm:py-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <style>{`
              .overflow-x-auto::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            <button
              onClick={() => handleCategoryChange("")}
              className={cn(
                "px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all",
                category === ""
                  ? "bg-[#d97642] text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              All
            </button>
            {categories.slice(0, 10).map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={cn(
                  "px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all",
                  category === cat
                    ? "bg-[#d97642] text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container-shell py-4 sm:py-6 lg:py-8">
        <div className="flex gap-4 sm:gap-6">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-[180px] space-y-6">
              {/* Filter Header */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Filter Books</h3>
                  {hasActiveFilters && (
                    <button
                      onClick={handleClearFilters}
                      className="text-xs text-red-600 hover:text-red-700 font-medium"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Price Range
                  </label>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm text-gray-600">₹{priceRange[0]}</span>
                    <span className="text-gray-400">-</span>
                    <span className="text-sm text-gray-600">₹{priceRange[1]}</span>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="2000"
                      step="50"
                      value={priceRange[0]}
                      onChange={(e) => {
                        const newMin = parseInt(e.target.value);
                        if (newMin <= priceRange[1]) {
                          setPriceRange([newMin, priceRange[1]]);
                        }
                      }}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#d97642]"
                    />
                    <input
                      type="range"
                      min="0"
                      max="2000"
                      step="50"
                      value={priceRange[1]}
                      onChange={(e) => {
                        const newMax = parseInt(e.target.value);
                        if (newMax >= priceRange[0]) {
                          setPriceRange([priceRange[0], newMax]);
                        }
                      }}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#d97642]"
                    />
                  </div>
                </div>

                {/* Sort Options */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Sort By
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: "relevance", label: "Relevance" },
                      { value: "price-low", label: "Price: Low to High" },
                      { value: "price-high", label: "Price: High to Low" },
                      { value: "rating", label: "Rating" },
                      { value: "newest", label: "Newest First" },
                    ].map((option) => (
                      <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="sort"
                          value={option.value}
                          checked={sortBy === option.value}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="w-4 h-4 text-[#d97642] focus:ring-[#d97642]"
                        />
                        <span className="text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Collection Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Collection
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: "", label: "All Books" },
                      { value: "featured", label: "Featured" },
                      { value: "bestseller", label: "Best Sellers" },
                      { value: "newArrival", label: "New Arrivals" },
                    ].map((option) => (
                      <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={statusFilter === option.value}
                          onChange={() => handleStatusFilterChange(option.value === statusFilter ? "" : option.value)}
                          className="w-4 h-4 text-[#d97642] rounded focus:ring-[#d97642]"
                        />
                        <span className="text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Filters Overlay */}
          {showMobileFilters && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setShowMobileFilters(false)}>
              <div 
                className="absolute right-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                  <button onClick={() => setShowMobileFilters(false)}>
                    <X className="h-6 w-6 text-gray-600" />
                  </button>
                </div>

                {/* Same filter content as desktop */}
                <div className="space-y-6">
                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Price Range
                    </label>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm text-gray-600">₹{priceRange[0]}</span>
                      <span className="text-gray-400">-</span>
                      <span className="text-sm text-gray-600">₹{priceRange[1]}</span>
                    </div>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="0"
                        max="2000"
                        step="50"
                        value={priceRange[0]}
                        onChange={(e) => {
                          const newMin = parseInt(e.target.value);
                          if (newMin <= priceRange[1]) {
                            setPriceRange([newMin, priceRange[1]]);
                          }
                        }}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#d97642]"
                      />
                      <input
                        type="range"
                        min="0"
                        max="2000"
                        step="50"
                        value={priceRange[1]}
                        onChange={(e) => {
                          const newMax = parseInt(e.target.value);
                          if (newMax >= priceRange[0]) {
                            setPriceRange([priceRange[0], newMax]);
                          }
                        }}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#d97642]"
                      />
                    </div>
                  </div>

                  {/* Sort Options */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Sort By
                    </label>
                    <div className="space-y-2">
                      {[
                        { value: "relevance", label: "Relevance" },
                        { value: "price-low", label: "Price: Low to High" },
                        { value: "price-high", label: "Price: High to Low" },
                        { value: "rating", label: "Rating" },
                        { value: "newest", label: "Newest First" },
                      ].map((option) => (
                        <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="sort-mobile"
                            value={option.value}
                            checked={sortBy === option.value}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-4 h-4 text-[#d97642] focus:ring-[#d97642]"
                          />
                          <span className="text-sm text-gray-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Collection Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Collection
                    </label>
                    <div className="space-y-2">
                      {[
                        { value: "", label: "All Books" },
                        { value: "featured", label: "Featured" },
                        { value: "bestseller", label: "Best Sellers" },
                        { value: "newArrival", label: "New Arrivals" },
                      ].map((option) => (
                        <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={statusFilter === option.value}
                            onChange={() => handleStatusFilterChange(option.value === statusFilter ? "" : option.value)}
                            className="w-4 h-4 text-[#d97642] rounded focus:ring-[#d97642]"
                          />
                          <span className="text-sm text-gray-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={() => setShowMobileFilters(false)}
                    className="w-full h-12 rounded-full bg-[#d97642] text-white hover:bg-[#c26535]"
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {statusFilter === "featured" && "Featured Books"}
                  {statusFilter === "bestseller" && "Best Sellers"}
                  {statusFilter === "newArrival" && "New Arrivals"}
                  {!statusFilter && "All Books"}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  {totalBooks} books available
                </p>
              </div>
            </div>

            {/* Books Grid */}
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
                    <BookSkeleton />
                  </div>
                ))}
              </div>
            ) : books.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                  {books.map((book, index) => (
                    <div 
                      key={book._id} 
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${(index % 12) * 30}ms` }}
                    >
                      <BookCard book={book} />
                    </div>
                  ))}
                </div>

                {/* Load More */}
                {hasNextPage && (
                  <div ref={loadMoreRef} className="flex justify-center mt-8 mb-4">
                    {isFetchingNextPage && (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 w-full">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
                            <BookSkeleton />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {!hasNextPage && books.length > 0 && (
                  <div className="mt-12 text-center">
                    <p className="text-sm text-gray-500">
                      You've reached the end of the catalog
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <Grid3x3 className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No books found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or search query
                </p>
                {hasActiveFilters && (
                  <Button
                    onClick={handleClearFilters}
                    className="rounded-full bg-[#d97642] text-white hover:bg-[#c26535]"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
