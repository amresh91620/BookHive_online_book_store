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
  const [showFilters, setShowFilters] = useState(false);

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
    const params = { page: "1" };
    if (searchQuery) params.q = searchQuery;
    if (category) params.category = category;
    if (statusFilter) params.filter = statusFilter;
    setSearchParams(params);
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setCurrentPage(1);
    const params = { page: "1" };
    if (searchQuery) params.q = searchQuery;
    if (newCategory) params.category = newCategory;
    if (statusFilter) params.filter = statusFilter;
    setSearchParams(params);
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
    const params = { page: page.toString() };
    if (searchQuery) params.q = searchQuery;
    if (category) params.category = category;
    if (statusFilter) params.filter = statusFilter;
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasActiveFilters = searchQuery || category || statusFilter;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-shell py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {statusFilter === 'newArrival' ? 'New Arrivals' : 
             statusFilter === 'bestseller' ? 'Best Sellers' : 
             statusFilter === 'featured' ? 'Featured Books' : 'Explore Books'}
          </h1>
          <p className="text-gray-600">
            Discover from our collection of {totalBooks} books
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <form onSubmit={handleSearch} className="flex gap-4 mb-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search by title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Button type="submit">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </form>

          {/* Category Filter Toggle */}
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              {showFilters ? "Hide" : "Show"} Categories
            </Button>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
              >
                <X className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mb-4">
              {searchQuery && (
                <Badge variant="secondary" className="px-3 py-1">
                  Search: {searchQuery}
                  <X
                    className="w-3 h-3 ml-2 cursor-pointer"
                    onClick={() => {
                      setSearchQuery("");
                      setCurrentPage(1);
                      const params = { page: "1" };
                      if (category) params.category = category;
                      setSearchParams(params);
                    }}
                  />
                </Badge>
              )}
              {category && (
                <Badge variant="secondary" className="px-3 py-1">
                  Category: {category}
                  <X
                    className="w-3 h-3 ml-2 cursor-pointer"
                    onClick={() => {
                      setCategory("");
                      setCurrentPage(1);
                      const params = { page: "1" };
                      if (searchQuery) params.q = searchQuery;
                      setSearchParams(params);
                    }}
                  />
                </Badge>
              )}
              {statusFilter && (
                <Badge variant="secondary" className="px-3 py-1 bg-amber-100 text-amber-900 border-amber-200">
                  Type: {statusFilter === 'newArrival' ? 'New Arrival' : statusFilter}
                  <X
                    className="w-3 h-3 ml-2 cursor-pointer"
                    onClick={() => {
                      setStatusFilter("");
                      setCurrentPage(1);
                      const params = { page: "1" };
                      if (searchQuery) params.q = searchQuery;
                      if (category) params.category = category;
                      setSearchParams(params);
                    }}
                  />
                </Badge>
              )}
            </div>
          )}

          {/* Category Filter */}
          {showFilters && (
            <div className="flex flex-wrap gap-2">
              <Button
                variant={category === "" ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryChange("")}
              >
                All Categories
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={category === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryChange(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(8)].map((_, i) => (
              <BookSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Books Grid */}
        {!isLoading && books.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
              {books.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
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
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg mb-4">No books found</p>
            {hasActiveFilters && (
              <Button onClick={handleClearFilters}>Clear Filters</Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
