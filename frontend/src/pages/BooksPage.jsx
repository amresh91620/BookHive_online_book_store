import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useBookCategories } from "@/hooks/api/useBooks";
import { useInfiniteBooks } from "@/hooks/api/useInfiniteBooks";
import BookCard from "@/components/common/BookCard";
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
    <div className="min-h-screen bg-[#fffaf2] pb-10">
      {/* Premium Editorial Header */}
      <div className="bg-white/90 border-b border-amber-100 pt-8 pb-10">
        <div className="container-shell">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#7c5b3d] mb-6">
            <Link to="/" className="hover:text-[#451a03] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#451a03]">{getPageTitle()}</span>
          </div>
          
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-serif text-[#451a03] tracking-tight leading-tight mb-6">
              {getPageTitle() === 'The Library' ? (
                <>The BookHive <span className="text-[#b45309] font-serif italic font-normal">Library</span></>
              ) : (
                getPageTitle()
              )}
            </h1>
            <p className="text-lg md:text-xl text-[#6b4a2a] leading-relaxed flex items-center gap-3">
              Explore our curated collection of <span className="font-semibold text-[#451a03]">{totalBooks}</span> titles.
            </p>
          </div>
        </div>
      </div>

      <div className="container-shell py-12">
        {/* Refined Filter Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
          
          {/* Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="flex items-center gap-2 text-sm font-semibold tracking-widest uppercase text-[#7c5b3d] mr-2 hidden md:flex">
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
              className="h-12 px-6 rounded-full border border-amber-100 bg-white/90 text-[#5b3a1e] text-sm font-medium focus:ring-2 focus:ring-[#d97706] focus:border-transparent outline-none transition-all cursor-pointer hover:bg-amber-50 appearance-none pr-10 relative shadow-sm"
              style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b4a2a' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
            >
              <option value="">All Collections</option>
              <option value="featured">Featured</option>
              <option value="bestseller">Best Sellers</option>
              <option value="newArrival">New Arrivals</option>
            </select>

            <select
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="h-12 px-6 rounded-full border border-amber-100 bg-white/90 text-[#5b3a1e] text-sm font-medium focus:ring-2 focus:ring-[#d97706] focus:border-transparent outline-none transition-all cursor-pointer hover:bg-amber-50 appearance-none pr-10 relative shadow-sm"
              style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b4a2a' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
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
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7c5b3d]" />
              <Input
                type="text"
                placeholder="Search titles, authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-12 bg-white/90 border border-amber-100 rounded-full focus:border-[#d97706] focus:ring-1 focus:ring-[#d97706] w-full shadow-sm"
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
                  <div className="flex items-center gap-3 text-[#6b4a2a] bg-white/90 px-6 py-3 rounded-full border border-amber-100 shadow-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm font-medium uppercase tracking-wider">Loading more</span>
                  </div>
                ) : (
                  <div className="h-12" /> 
                )}
              </div>
            )}

            {/* End of Results */}
            {!hasNextPage && books.length > 0 && (
              <div className="text-center mt-20 pt-8 border-t border-amber-100">
                <p className="text-[#7c5b3d] text-sm uppercase tracking-widest font-medium">
                  End of Collection
                </p>
              </div>
            )}
          </>
        )}

        {/* No Results */}
        {!isLoading && books.length === 0 && (
          <div className="text-center py-24 bg-white/90 rounded-3xl border border-amber-100 shadow-sm mt-8">
            <h3 className="text-2xl font-bold font-serif text-[#451a03] mb-3">No books found</h3>
            <p className="text-[#6b4a2a] mb-8 max-w-md mx-auto">
              We couldn't find any books matching your search criteria. Try adjusting your filters or searching for something else.
            </p>
            {hasActiveFilters && (
              <Button 
                onClick={handleClearFilters} 
                className="bg-[#78350f] hover:bg-[#5f280a] text-white rounded-full px-8 py-6 h-auto"
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