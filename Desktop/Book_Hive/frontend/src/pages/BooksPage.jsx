import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { fetchBooks, fetchCategories } from "@/store/slices/booksSlice";
import BookCard from "@/components/common/BookCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X } from "lucide-react";

const ITEMS_PER_PAGE = 12;

export default function BooksPage() {
  const dispatch = useDispatch();
  const { items: books, status, total: totalBooks, categories } = useSelector((state) => state.books);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page") || "1"));
  const [showFilters, setShowFilters] = useState(false);

  const totalPages = Math.ceil(totalBooks / ITEMS_PER_PAGE);

  // Fetch categories on mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const params = {
      limit: ITEMS_PER_PAGE,
      offset: (currentPage - 1) * ITEMS_PER_PAGE,
    };
    if (searchQuery) params.q = searchQuery;
    if (category) params.category = category;
    dispatch(fetchBooks(params));
  }, [dispatch, searchQuery, category, currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    const params = { page: "1" };
    if (searchQuery) params.q = searchQuery;
    if (category) params.category = category;
    setSearchParams(params);
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setCurrentPage(1);
    const params = { page: "1" };
    if (searchQuery) params.q = searchQuery;
    if (newCategory) params.category = newCategory;
    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setCategory("");
    setCurrentPage(1);
    setSearchParams({});
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const params = { page: page.toString() };
    if (searchQuery) params.q = searchQuery;
    if (category) params.category = category;
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasActiveFilters = searchQuery || category;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-shell py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Explore Books</h1>
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
        {status === "loading" && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          </div>
        )}

        {/* Books Grid */}
        {status !== "loading" && books.length > 0 && (
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
        {status !== "loading" && books.length === 0 && (
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
