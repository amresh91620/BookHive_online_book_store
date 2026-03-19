import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useBooksList, useBookCategories } from "@/hooks/api/useBooks";
import BookCard from "@/components/common/BookCard";
import BookSkeleton from "@/components/common/BookSkeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X, Tag } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

const ITEMS_PER_PAGE = 12;

export default function DealsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page") || "1"));

  const debouncedSearch = useDebounce(searchQuery, 500);

  const params = {
    limit: ITEMS_PER_PAGE,
    offset: (currentPage - 1) * ITEMS_PER_PAGE,
  };
  if (debouncedSearch) params.q = debouncedSearch;
  if (category) params.category = category;

  const { data: booksData, isLoading } = useBooksList(params);
  const { data: categories = [] } = useBookCategories();

  // Filter books with discounts
  const allBooks = booksData?.books || booksData?.items || [];
  const books = allBooks.filter(book => book.discount > 0);
  const totalBooks = books.length;
  const totalPages = Math.ceil(totalBooks / ITEMS_PER_PAGE);

  // Paginate filtered books
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedBooks = books.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    updateURL({ page: "1", q: searchQuery, category });
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setCurrentPage(1);
    updateURL({ page: "1", q: searchQuery, category: newCategory });
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setCategory("");
    setCurrentPage(1);
    setSearchParams({});
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    updateURL({ page: page.toString(), q: searchQuery, category });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateURL = ({ page, q, category }) => {
    const params = { page };
    if (q) params.q = q;
    if (category) params.category = category;
    setSearchParams(params);
  };

  const hasActiveFilters = searchQuery || category;

  const maxDiscount = Math.max(...books.map(b => b.discount || 0), 0);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Hero Header */}
      <div className="relative z-10 bg-gradient-to-r from-[#1F2937] via-[#374151] to-[#1F2937] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="container-shell py-8 sm:py-12 relative z-10">
          <div className="flex items-center gap-2 text-sm text-gray-300 mb-4">
            <span className="hover:text-white transition-colors cursor-pointer">Home</span>
            <span>/</span>
            <span className="text-white font-medium">Deals & Offers</span>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Deals & Offers
              </h1>
              <p className="text-base sm:text-lg text-gray-300 flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#F59E0B]" />
                Save big on <span className="font-bold text-[#F59E0B]">{totalBooks}</span> discounted books
              </p>
            </div>
            
            {maxDiscount > 0 && (
              <div className="bg-[#F59E0B] rounded-xl px-6 py-3 shadow-lg">
                <div className="text-sm text-white/90">Up to</div>
                <div className="text-3xl font-bold text-white">{maxDiscount}% OFF</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="relative z-10 container-shell py-6 sm:py-8">
        {/* Compact Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
            {/* Category Filter */}
            <div className="w-full sm:w-auto sm:min-w-[200px]">
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
                    placeholder="Search deals..."
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
                      updateURL({ page: "1", q: "", category });
                    }}
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
        {!isLoading && paginatedBooks.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
              {paginatedBooks.map((book) => (
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
        {!isLoading && paginatedBooks.length === 0 && (
          <div className="text-center py-16 sm:py-20 bg-white rounded-xl border border-gray-200">
            <div className="mb-4">
              <Tag className="w-16 h-16 mx-auto text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No deals found</h3>
            <p className="text-gray-500 mb-6">
              {hasActiveFilters 
                ? "We couldn't find any deals matching your criteria"
                : "No discounted books available at the moment"}
            </p>
            {hasActiveFilters && (
              <Button onClick={handleClearFilters} className="bg-[#F59E0B] hover:bg-[#D97706]">
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
