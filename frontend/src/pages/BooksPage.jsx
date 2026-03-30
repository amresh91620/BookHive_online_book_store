import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useBookCategories } from "@/hooks/api/useBooks";
import { useInfiniteBooks } from "@/hooks/api/useInfiniteBooks";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import BookCard from "@/components/common/BookCard";
import AnimatedBookRow from "@/components/common/AnimatedBookRow";
import BookSkeleton from "@/components/common/BookSkeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Loader2, ChevronRight, SlidersHorizontal } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

const ITEMS_PER_PAGE = 12;

export default function BooksPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("filter") || "");
  const loadMoreRef = useRef(null);

  // Scroll animation refs for header and filters only
  const [headerRef, headerVisible] = useScrollAnimation();
  const [filtersRef, filtersVisible] = useScrollAnimation();

  const debouncedSearch = useDebounce(searchQuery, 500);

  const params = {
    limit: ITEMS_PER_PAGE,
  };
  if (debouncedSearch) params.q = debouncedSearch;
  if (category) params.category = category;
  if (statusFilter) params.status = statusFilter;

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteBooks(params);

  const { data: categories = [] } = useBookCategories();

  const books = data?.pages.flatMap(page => page.books || []) || [];
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

  const handleSearch = (e) => {
    e.preventDefault();
    updateURL({ q: searchQuery, category, filter: statusFilter });
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    updateURL({ q: searchQuery, category: newCategory, filter: statusFilter });
  };

  const handleStatusFilterChange = (newFilter) => {
    setStatusFilter(newFilter);
    updateURL({ q: searchQuery, category, filter: newFilter });
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setCategory("");
    setStatusFilter("");
    setSearchParams({});
  };

  const updateURL = ({ q, category, filter }) => {
    const params = {};
    if (q) params.q = q;
    if (category) params.category = category;
    if (filter) params.filter = filter;
    setSearchParams(params);
  };

  const hasActiveFilters = searchQuery || category || statusFilter;

  const getPageTitle = () => {
    if (statusFilter === 'newArrival') return 'New Arrivals';
    if (statusFilter === 'bestseller') return 'Best Sellers';
    if (statusFilter === 'featured') return 'Featured Collection';
    return 'The Library';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-50 pb-16">
      {/* Premium Editorial Header */}
      <div ref={headerRef} className={`bg-white/95 backdrop-blur-sm border-b border-stone-200 pt-10 pb-12 shadow-soft relative overflow-hidden transition-all duration-700 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="absolute inset-0 bg-noise opacity-30"></div>
        <div className="container-shell relative">
          <div className="flex items-center gap-2.5 text-xs font-semibold tracking-[0.12em] uppercase text-amber-700 mb-8">
            <Link to="/" className="hover:text-amber-800 transition-smooth">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-stone-900">{getPageTitle()}</span>
          </div>
          
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-stone-900 tracking-tight leading-[1.1] mb-6">
              {getPageTitle() === 'The Library' ? (
                <>The BookHive <span className="gradient-text italic">Library</span></>
              ) : (
                getPageTitle()
              )}
            </h1>
            <p className="text-lg md:text-xl text-stone-600 leading-relaxed flex items-center gap-3 font-light">
              Discover from our collection of <span className="font-semibold text-amber-700 text-2xl">{totalBooks}</span> carefully curated titles
            </p>
          </div>
        </div>
      </div>

      <div className="container-shell py-14">
        {/* Refined Filter Section */}
        <div ref={filtersRef} className={`flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12 transition-all duration-700 ${filtersVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          {/* Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            <div className="flex items-center gap-2.5 text-sm font-semibold tracking-[0.08em] uppercase text-amber-700 mr-3 hidden md:flex">
              <SlidersHorizontal className="w-4 h-4" />
              Refine
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
              className="h-12 px-6 rounded-full border-2 border-stone-200 bg-white text-stone-700 text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-smooth cursor-pointer hover:border-amber-300 hover:shadow-soft appearance-none pr-12 relative"
              style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23B45309' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
            >
              <option value="">All Collections</option>
              <option value="featured">Featured</option>
              <option value="bestseller">Best Sellers</option>
              <option value="newArrival">New Arrivals</option>
            </select>

            <select
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="h-12 px-6 rounded-full border-2 border-stone-200 bg-white text-stone-700 text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-smooth cursor-pointer hover:border-amber-300 hover:shadow-soft appearance-none pr-12 relative"
              style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23B45309' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
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
                className="h-12 px-6 rounded-full text-sm font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition-smooth flex items-center gap-2 border-2 border-transparent hover:border-red-200"
              >
                <X className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>

          {/* Premium Search Bar */}
          <div className="w-full lg:w-auto">
            <form onSubmit={handleSearch} className="relative w-full lg:w-96">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-600" />
              <Input
                type="text"
                placeholder="Search titles, authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-white border-2 border-stone-200 rounded-full focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 w-full shadow-soft hover:shadow-medium transition-smooth font-medium"
              />
            </form>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
            {[...Array(8)].map((_, i) => (
              <div 
                key={i} 
                className="transition-all duration-700 opacity-100 translate-y-0"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <BookSkeleton />
              </div>
            ))}
          </div>
        )}

        {/* Books Grid */}
        {!isLoading && books.length > 0 && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
              {/* Group books into rows of 4 */}
              {Array.from({ length: Math.ceil(books.length / 4) }, (_, rowIndex) => {
                const rowBooks = books.slice(rowIndex * 4, (rowIndex + 1) * 4);
                return (
                  <AnimatedBookRow 
                    key={`row-${rowIndex}`} 
                    books={rowBooks} 
                    startIndex={rowIndex * 4}
                  />
                );
              })}
            </div>

            {/* Load More Trigger */}
            {hasNextPage && (
              <div ref={loadMoreRef} className="flex justify-center mt-20">
                {isFetchingNextPage ? (
                  <div className="flex items-center gap-3 text-stone-700 bg-white px-8 py-4 rounded-full border-2 border-stone-200 shadow-soft animate-pulse">
                    <Loader2 className="w-5 h-5 animate-spin text-amber-600" />
                    <span className="text-sm font-semibold uppercase tracking-wider">Loading more</span>
                  </div>
                ) : (
                  <div className="h-12" /> 
                )}
              </div>
            )}

            {/* End of Results */}
            {!hasNextPage && books.length > 0 && (
              <div className="text-center mt-20 pt-10 border-t-2 border-stone-200">
                <p className="text-stone-600 text-sm uppercase tracking-[0.12em] font-semibold">
                  You've reached the end
                </p>
                <p className="text-stone-400 text-xs mt-2 font-light">
                  Showing all {books.length} results
                </p>
              </div>
            )}
          </>
        )}

        {/* No Results */}
        {!isLoading && books.length === 0 && (
          <div className="text-center py-32 bg-white rounded-3xl border-2 border-stone-200 shadow-medium mt-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-noise opacity-20"></div>
            <div className="relative">
              <h3 className="text-3xl font-bold text-stone-900 mb-4">No books found</h3>
              <p className="text-stone-600 mb-10 max-w-md mx-auto font-light leading-relaxed">
                We couldn't find any books matching your search criteria. Try adjusting your filters or exploring our full collection.
              </p>
              {hasActiveFilters && (
                <Button 
                  onClick={handleClearFilters} 
                  className="btn-premium bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-full px-10 py-6 h-auto text-base font-semibold shadow-medium hover:shadow-large transition-smooth"
                >
                  Clear All Filters
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
