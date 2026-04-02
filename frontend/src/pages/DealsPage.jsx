import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useBookCategories } from "@/hooks/api/useBooks";
import { useInfiniteBooks } from "@/hooks/api/useInfiniteBooks";
import { useDebounce } from "@/hooks/useDebounce";
import BookCard from "@/components/common/BookCard";
import BookSkeleton from "@/components/common/BookSkeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Filter,
  X,
  Zap,
  Grid3x3,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 12;

export default function DealsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [discountRange, setDiscountRange] = useState([0, 100]);
  const [sortBy, setSortBy] = useState("discount-high");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const loadMoreRef = useRef(null);

  const debouncedSearch = useDebounce(searchQuery, 500);

  const params = {
    limit: ITEMS_PER_PAGE,
  };

  if (debouncedSearch) params.q = debouncedSearch;
  if (category) params.category = category;
  if (sortBy && sortBy !== 'relevance') params.sortBy = sortBy;

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteBooks(params);

  const { data: categories = [] } = useBookCategories();

  const allBooks = data?.pages.flatMap((page) => page.books || []) || [];
  
  // Filter books with discount and apply discount range filter
  const books = allBooks.filter((book) => {
    const discount = Number(book.discount) || 0;
    return discount > 0 && discount >= discountRange[0] && discount <= discountRange[1];
  });

  const totalDeals = books.length;
  const maxDiscount = books.reduce(
    (currentMax, book) => Math.max(currentMax, Number(book.discount) || 0),
    0
  );

  const hasActiveFilters = Boolean(
    searchQuery || 
    category || 
    discountRange[0] > 0 || 
    discountRange[1] < 100 ||
    (sortBy && sortBy !== 'discount-high')
  );

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

  const updateURL = ({ q, category: nextCategory }) => {
    const nextParams = {};
    if (q) nextParams.q = q;
    if (nextCategory) nextParams.category = nextCategory;
    setSearchParams(nextParams);
  };

  const handleCategoryChange = (nextCategory) => {
    setCategory(nextCategory);
    updateURL({ q: searchQuery, category: nextCategory });
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setCategory("");
    setDiscountRange([0, 100]);
    setSortBy("discount-high");
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-[#f7f5ef]">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-[#0b7a71] via-[#0d8a7f] to-[#0b7a71] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#deb05a] rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="container-shell relative py-8 sm:py-12 lg:py-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-4 animate-fade-in">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#deb05a] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#deb05a]"></span>
              </span>
              <span className="text-sm font-bold text-white uppercase tracking-wider">
                Limited Time Offer
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-3 leading-tight animate-slide-up">
              MASSIVE BOOK DEALS!
            </h1>
            <p className="text-base sm:text-lg text-white/95 mb-2 font-medium">
              Up to <span className="text-[#deb05a] font-black text-xl sm:text-2xl">{maxDiscount}%</span> OFF + Free Shipping on orders above ₹499
            </p>
            <p className="text-sm text-white/80 mb-6">
              🎉 Grab your favorite books at unbeatable prices • 📚 {totalDeals}+ deals available • ⚡ New deals added daily
            </p>

            <div className="flex flex-wrap items-center gap-3 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 sm:px-5 py-2.5 border border-white/20">
                <div className="text-xs text-white/80 mb-0.5">⏰ Ends in</div>
                <div className="text-lg sm:text-xl font-black text-white tabular-nums">12h 45m</div>
              </div>
              <div className="flex items-center gap-2 text-white/90 text-xs sm:text-sm">
                <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs">✓</div>
                <span>Authentic Books</span>
              </div>
              <div className="flex items-center gap-2 text-white/90 text-xs sm:text-sm">
                <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs">🚚</div>
                <span>Fast Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Header with Search */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="container-shell py-3 sm:py-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search deals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 sm:h-12 pl-10 sm:pl-12 pr-4 rounded-full border-gray-300 bg-gray-50 text-sm sm:text-base focus:bg-white focus:border-[#0b7a71] focus:ring-[#0b7a71]/20"
              />
            </div>

            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="flex items-center gap-2 px-4 sm:px-5 h-11 sm:h-12 rounded-full border border-gray-300 bg-white hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-[#0b7a71]" />
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
                  ? "bg-[#0b7a71] text-white shadow-md"
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
                    ? "bg-[#0b7a71] text-white shadow-md"
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
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Filter Deals</h3>
                  {hasActiveFilters && (
                    <button
                      onClick={handleClearFilters}
                      className="text-xs text-red-600 hover:text-red-700 font-medium"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {/* Discount Range */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Discount Range
                  </label>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm text-gray-600">{discountRange[0]}%</span>
                    <span className="text-gray-400">-</span>
                    <span className="text-sm text-gray-600">{discountRange[1]}%</span>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={discountRange[0]}
                      onChange={(e) => {
                        const newMin = parseInt(e.target.value);
                        if (newMin <= discountRange[1]) {
                          setDiscountRange([newMin, discountRange[1]]);
                        }
                      }}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0b7a71]"
                    />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={discountRange[1]}
                      onChange={(e) => {
                        const newMax = parseInt(e.target.value);
                        if (newMax >= discountRange[0]) {
                          setDiscountRange([discountRange[0], newMax]);
                        }
                      }}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0b7a71]"
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
                      { value: "discount-high", label: "Highest Discount" },
                      { value: "discount-low", label: "Lowest Discount" },
                      { value: "price-low", label: "Price: Low to High" },
                      { value: "price-high", label: "Price: High to Low" },
                      { value: "newest", label: "Newest First" },
                    ].map((option) => (
                      <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="sort"
                          value={option.value}
                          checked={sortBy === option.value}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="w-4 h-4 text-[#0b7a71] focus:ring-[#0b7a71]"
                        />
                        <span className="text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Promo Card */}
              <div className="bg-gradient-to-br from-[#deb05a] to-[#c89a4a] rounded-2xl p-5 text-white shadow-lg">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Flash Sale!</h3>
                    <p className="text-sm text-white/90">
                      Extra discounts on selected books. Limited time only!
                    </p>
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

                <div className="space-y-6">
                  {/* Discount Range */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Discount Range
                    </label>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm text-gray-600">{discountRange[0]}%</span>
                      <span className="text-gray-400">-</span>
                      <span className="text-sm text-gray-600">{discountRange[1]}%</span>
                    </div>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={discountRange[0]}
                        onChange={(e) => {
                          const newMin = parseInt(e.target.value);
                          if (newMin <= discountRange[1]) {
                            setDiscountRange([newMin, discountRange[1]]);
                          }
                        }}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0b7a71]"
                      />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={discountRange[1]}
                        onChange={(e) => {
                          const newMax = parseInt(e.target.value);
                          if (newMax >= discountRange[0]) {
                            setDiscountRange([discountRange[0], newMax]);
                          }
                        }}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0b7a71]"
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
                        { value: "discount-high", label: "Highest Discount" },
                        { value: "discount-low", label: "Lowest Discount" },
                        { value: "price-low", label: "Price: Low to High" },
                        { value: "price-high", label: "Price: High to Low" },
                        { value: "newest", label: "Newest First" },
                      ].map((option) => (
                        <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="sort-mobile"
                            value={option.value}
                            checked={sortBy === option.value}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-4 h-4 text-[#0b7a71] focus:ring-[#0b7a71]"
                          />
                          <span className="text-sm text-gray-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={() => setShowMobileFilters(false)}
                    className="w-full h-12 rounded-full bg-[#0b7a71] text-white hover:bg-[#095f59]"
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
                  Today's Flash Deals
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  {totalDeals} amazing deals available
                </p>
              </div>
              <div className="bg-gradient-to-br from-[#deb05a] to-[#c89a4a] rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-center text-white">
                <div className="text-xl sm:text-2xl font-black">{maxDiscount}%</div>
                <div className="text-xs font-medium opacity-90">Max Off</div>
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
                      You've reached the end of deals
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
                  No deals found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or search query
                </p>
                {hasActiveFilters && (
                  <Button
                    onClick={handleClearFilters}
                    className="rounded-full bg-[#0b7a71] text-white hover:bg-[#095f59]"
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
