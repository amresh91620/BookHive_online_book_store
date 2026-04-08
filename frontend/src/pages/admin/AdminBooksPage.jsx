import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useBooksList, useDeleteBook } from "@/hooks/api/useBooks";
import { AdminSkeleton } from "@/components/admin/AdminSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { Pencil, Trash2, Plus, Search, BookOpen, Package } from "lucide-react";
import { formatPrice } from "@/utils/format";
import toast from "react-hot-toast";

const ITEMS_PER_PAGE = 10;

export default function AdminBooksPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const params = {
    limit: ITEMS_PER_PAGE,
    offset: (currentPage - 1) * ITEMS_PER_PAGE,
  };
  if (searchQuery) {
    params.q = searchQuery;
  }

  const { data: booksData, isLoading } = useBooksList(params);
  const deleteBook = useDeleteBook();

  const books = booksData?.books || booksData?.items || [];
  const total = booksData?.totalBooks || booksData?.total || 0;

  // Get current URL with search params for return navigation
  const getCurrentUrl = () => {
    const params = new URLSearchParams();
    if (currentPage > 1) params.set("page", currentPage.toString());
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    const queryString = params.toString();
    return `/admin/books${queryString ? `?${queryString}` : ''}`;
  };

  // Sync search query with URL on mount
  useEffect(() => {
    const urlQuery = searchParams.get("q") || "";
    if (urlQuery !== searchQuery) {
      setSearchQuery(urlQuery);
    }
  }, []);

  const handleDelete = (bookId) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      deleteBook.mutate(bookId, {
        onSuccess: () => toast.success("Book deleted successfully"),
        onError: (err) => toast.error(err?.response?.data?.msg || "Failed to delete book"),
      });
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const newParams = { page: "1" };
    if (searchQuery.trim()) {
      newParams.q = searchQuery.trim();
    }
    setSearchParams(newParams);
  };

  const handlePageChange = (page) => {
    const newParams = { page: page.toString() };
    if (searchQuery.trim()) {
      newParams.q = searchQuery.trim();
    }
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  return (
    <div className="admin-page p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 animate-fade-in-up">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-stone-900 via-amber-900 to-stone-800 bg-clip-text text-transparent">
            Manage Books
          </h1>
          <p className="text-stone-500 mt-1.5 text-sm font-medium">
            {total} books in your inventory
          </p>
        </div>
        <Link to="/admin/books/add">
          <Button className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <Plus className="w-4 h-4 mr-2" />
            Add Book
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6 animate-slide-in-right stagger-1">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search books by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-2 border-stone-200 focus:border-amber-500 transition-colors bg-white/80 backdrop-blur-sm rounded-xl h-11"
            />
          </div>
        </form>
      </div>

      {/* Books Table/Cards */}
      {isLoading ? (
        <AdminSkeleton type="table" />
      ) : books.length === 0 ? (
        <div className="admin-table-wrapper p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-amber-400" />
          </div>
          <p className="text-stone-500 font-semibold text-lg mb-1">No books found</p>
          <p className="text-stone-400 text-sm">
            {searchQuery ? "Try adjusting your search term" : "Add your first book to get started"}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block admin-table-wrapper animate-scale-up stagger-2">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="admin-thead">
                  <tr>
                    <th style={{width: '44px'}}>#</th>
                    <th>Book</th>
                    <th>Author</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th style={{textAlign: 'right'}}>Actions</th>
                  </tr>
                </thead>
                <tbody className="admin-tbody">
                  {books.map((book, idx) => (
                    <tr key={book._id}>
                      <td className="admin-td">
                        <span className="admin-row-num">{startIndex + idx + 1}</span>
                      </td>
                      <td className="admin-td">
                        <div className="flex items-center gap-3">
                          <img
                            src={book.coverImage}
                            alt={book.title}
                            className="admin-thumb"
                            loading="lazy"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/120x160?text=No+Image'; }}
                          />
                          <div className="min-w-0">
                            <div className="admin-cell-primary truncate max-w-[220px]">{book.title}</div>
                            <div className="admin-cell-secondary truncate">{book.categories}</div>
                          </div>
                        </div>
                      </td>
                      <td className="admin-td">
                        <span className="text-sm text-stone-700 font-medium">{book.author}</span>
                      </td>
                      <td className="admin-td">
                        <span className="admin-price">{formatPrice(book.price)}</span>
                      </td>
                      <td className="admin-td">
                        <div className="flex items-center gap-2">
                          <Package className="w-3.5 h-3.5 text-stone-400" />
                          <span className={`text-sm font-semibold ${book.stock < 10 ? 'text-amber-600' : 'text-stone-700'}`}>
                            {book.stock}
                          </span>
                        </div>
                      </td>
                      <td className="admin-td">
                        <span className={`admin-status ${book.stock > 0 ? 'success' : 'danger'}`}>
                          <span className="dot" />
                          {book.stock > 0 ? "In Stock" : "Out of Stock"}
                        </span>
                      </td>
                      <td className="admin-td">
                        <div className="admin-actions justify-end">
                          <Link to={`/admin/books/edit/${book._id}`} state={{ from: getCurrentUrl() }}>
                            <button className="admin-action-btn edit" title="Edit">
                              <Pencil className="w-4 h-4" />
                            </button>
                          </Link>
                          <button className="admin-action-btn delete" onClick={() => handleDelete(book._id)} title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Table Footer */}
            <div className="admin-table-footer flex items-center justify-between">
              <span>Showing {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, total)} of {total} books</span>
              <span className="text-xs text-stone-400">Page {currentPage} of {totalPages || 1}</span>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3 animate-scale-up stagger-2">
            {books.map((book, idx) => (
              <div key={book._id} className="admin-mobile-card">
                <div className="flex gap-3">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-16 h-22 object-cover rounded-lg border-2 border-stone-200 shadow-sm flex-shrink-0"
                    loading="lazy"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/120x160?text=No+Image'; }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-stone-900 mb-0.5 line-clamp-2 text-sm">{book.title}</h3>
                    <p className="text-xs text-stone-500 mb-2">{book.author}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="admin-price text-base">{formatPrice(book.price)}</span>
                      <span className={`admin-status text-xs ${book.stock > 0 ? 'success' : 'danger'}`}>
                        <span className="dot" />
                        {book.stock > 0 ? `${book.stock} left` : "Out"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-3 pt-3 border-t border-stone-100">
                  <Link to={`/admin/books/edit/${book._id}`} state={{ from: getCurrentUrl() }} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full border-2 border-stone-200 hover:border-amber-500 text-xs h-9">
                      <Pencil className="w-3.5 h-3.5 mr-1.5" /> Edit
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(book._id)} className="border-2 border-stone-200 hover:border-red-400 hover:text-red-600 text-xs h-9 px-3">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 animate-fade-in-up stagger-3">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
