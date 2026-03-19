import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useBooksList, useBookCategories } from "@/hooks/api/useBooks";
import BookCard from "@/components/common/BookCard";
import BookSkeleton from "@/components/common/BookSkeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

const ITEMS_PER_PAGE = 12;

export default function BooksPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("filter") || "");
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page") || "1"));

  // Debounce search query to reduce API calls
  const debouncedSearch = useDebounce(searchQuery, 500);

  const params = {
    limit: ITEMS_PER_PAGE,
    offset: (currentPage - 1) * ITEMS_PER_PAGE,
  };
  if (debouncedSearch) params.q = debouncedSearch;
  if (category) params.category = category;
  if (statusFilter) params.status = statusFilter;

  const { data: booksData, isLoading } = useBooksList(params);
  const { data: categories = [] } = useBookCategories();

  const books = booksData?.books || booksData?.items || [];
  const totalBooks = booksData?.totalBooks || booksData?.total || books.length;
  const totalPages = Math.ceil(totalBooks / ITEMS_PER_PAGE);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    updateURL({ page: "1", q: searchQuery, category, filter: statusFilter });
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setCurrentPage(1);
    updateURL({ page: "1", q: searchQuery, category: newCategory, filter: statusFilter });
  };

  const handleStatusFilterChange = (newFilter) => {
    setStatusFilter(newFilter);
    setCurrentPage(1);
    updateURL({ page: "1", q: searchQuery, category, filter: newFilter });
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setCategory("");
    setStatusFilter("");
    setCurrentPage(1);
    setSearchParams({});
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    updateURL({ page: page.toString(), q: searchQuery, category, filter: statusFilter });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateURL = ({ page, q, category, filter }) => {
    const params = { page };
    if (q) params.q = q;
    if (category) params.category = category;
    if (filter) params.filter = filter;
    setSearchParams(params);
  };

  const hasActiveFilters = searchQuery || category || statusFilter;

  const getPageTitle = () => {
    if (statusFilter === 'newArrival') return 'New Arrivals';
    if (statusFilter === 'bestseller') return 'Best Sellers';
    if (statusFilter === 'featured') return 'Featured Books';
    return 'All Books';
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Hero Header with Gradient */}
      <div className="relative z-10 bg-gradient-to-r from-[#1F2937] via-[#374151] to-[#1F2937] text-white overflow-hidden">
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="container-shell py-8 sm:py-12 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-300 mb-4">
            <span className="hover:text-white transition-colors cursor-pointer">Home</span>
            <span>/</span>
            <span className="text-white font-medium">{getPageTitle()}</span>
          </div>
          
          {/* Title & Description */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {getPageTitle()}
              </h1>
              <p className="text-base sm:text-lg text-gray-300 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-[#F59E0B] rounded-full animate-pulse"></span>
                Discover from our collection of <span className="font-bold text-[#F59E0B]">{totalBooks}</span> amazing books
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 container-shell py-6 sm:py-8">
        {/* Compact Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
            {/* Book Type Filter */}
            <div className="w-full sm:w-auto sm:min-w-[180px]">
              <label className="text-xs font-medium text-gray-600 mb-1.5 block">Book Type</label>
              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilterChange(e.target.value)}
                className="w-full h-11 px-4 border border-gray-300 rounded-lg text-sm focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20 focus:outline-none bg-white transition-all"
              >
                <option value="">All Books</option>
                <option value="featured">Featured</option>
                <option value="bestseller">Best Sellers</option>
                <option value="newArrival">New Arrivals</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="w-full sm:w-auto sm:min-w-[180px]">
              <label className="text-xs font-medium text-gray-600 mb-1.5 block">Category</label>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full h-11 px-4 border border-gray-300 rounded-lg text-sm focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20 focus:outline-none bg-white transition-all"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Search Bar */}
            <div className="flex-1 w-full">
              <label className="text-xs font-medium text-gray-600 mb-1.5 block">Search</label>
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search books..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-11 border-gray-300 focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20 rounded-lg"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="bg-[#F59E0B] hover:bg-[#D97706] h-11 px-5 rounded-lg"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </form>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                className="h-11 px-4 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 rounded-lg whitespace-nowrap"
              >
                <X className="w-4 h-4 mr-1.5" />
                Clear
              </Button>
            )}
          </div>

          {/* Active Filter Tags */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
              {searchQuery && (
                <Badge className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1.5 rounded-full">
                  {searchQuery}
                  <X
                    className="w-3 h-3 ml-1.5 cursor-pointer inline-block"
                    onClick={() => {
                      setSearchQuery("");
                      updateURL({ page: "1", q: "", category, filter: statusFilter });
                    }}
                  />
                </Badge>
              )}
              {statusFilter && (
                <Badge className="bg-purple-500 hover:bg-purple-600 text-white text-xs px-3 py-1.5 rounded-full">
                  {statusFilter === 'newArrival' ? 'New Arrival' : statusFilter}
                  <X
                    className="w-3 h-3 ml-1.5 cursor-pointer inline-block"
                    onClick={() => handleStatusFilterChange("")}
                  />
                </Badge>
              )}
              {category && (
                <Badge className="bg-amber-500 hover:bg-amber-600 text-white text-xs px-3 py-1.5 rounded-full">
                  {category}
                  <X
                    className="w-3 h-3 ml-1.5 cursor-pointer inline-block"
                    onClick={() => handleCategoryChange("")}
                  />
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <BookSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Books Grid */}
        {!isLoading && books.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
              {books.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 p-6 bg-white rounded-xl border border-gray-200">
                <div className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}

        {/* No Results */}
        {!isLoading && books.length === 0 && (
          <div className="text-center py-16 sm:py-24 bg-gradient-to-br from-white to-gray-50 rounded-2xl border-2 border-dashed border-gray-300 shadow-lg">
            <div className="mb-6 relative">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-[#F59E0B]/10 rounded-full blur-3xl -z-10"></div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No books found</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              We couldn't find any books matching your search criteria. Try adjusting your filters or search terms.
            </p>
            {hasActiveFilters && (
              <Button 
                onClick={handleClearFilters} 
                className="bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:from-[#D97706] hover:to-[#B45309] shadow-lg hover:shadow-xl transition-all"
              >
                <X className="w-4 h-4 mr-2" />
                Clear All Filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
