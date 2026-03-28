import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useBooksList, useDeleteBook } from "@/hooks/api/useBooks";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { Pencil, Trash2, Plus, Search } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-amber-50/30 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 animate-fade-in-up">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-stone-900 via-amber-900 to-stone-800 bg-clip-text text-transparent">
            Manage Books
          </h1>
          <p className="text-stone-600 mt-2">Total: {total} books</p>
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
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search books by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-2 border-stone-200 focus:border-amber-500 transition-colors bg-white/80 backdrop-blur-sm"
            />
          </div>
        </form>
      </div>

      {/* Books Table/Cards */}
      {isLoading ? (
        <LoadingSkeleton type="table" count={1} />
      ) : (
        <>
          {/* Desktop Table */}
          <Card className="hidden md:block border-2 border-stone-200 shadow-lg hover:shadow-xl transition-all duration-300 animate-scale-up stagger-2 bg-white/80 backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-stone-50 to-amber-50/50 border-b-2 border-stone-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">Book</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">Author</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-stone-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {books.map((book) => (
                    <tr key={book._id} className="hover:bg-gradient-to-r hover:from-amber-50/50 hover:to-stone-50 transition-all duration-200">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-16 flex-shrink-0">
                            <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover rounded shadow-md" loading="lazy" onError={(e) => { e.target.src = 'https://via.placeholder.com/120x160?text=No+Image'; }} />
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-stone-900 truncate">{book.title}</div>
                            <div className="text-xs text-stone-400 truncate">{book.categories}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-stone-900">{book.author}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-amber-700">{formatPrice(book.price)}</td>
                      <td className="px-6 py-4 text-sm text-stone-900">{book.stock}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${book.stock > 0 ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800" : "bg-gradient-to-r from-red-100 to-rose-100 text-red-800"}`}>
                          {book.stock > 0 ? "In Stock" : "Out of Stock"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link to={`/admin/books/edit/${book._id}`} state={{ from: getCurrentUrl() }}>
                            <Button variant="ghost" size="sm" className="hover:bg-amber-100 hover:text-amber-700 transition-colors">
                              <Pencil className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(book._id)} className="hover:bg-red-100 hover:text-red-700 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4 animate-scale-up stagger-2">
            {books.map((book) => (
              <Card key={book._id} className="p-4 border-2 border-stone-200 shadow-lg bg-white/80 backdrop-blur-sm">
                <div className="flex gap-4">
                  <div className="w-20 h-28 flex-shrink-0">
                    <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover rounded shadow-md" loading="lazy" onError={(e) => { e.target.src = 'https://via.placeholder.com/120x160?text=No+Image'; }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-stone-900 mb-1 line-clamp-2">{book.title}</h3>
                    <p className="text-sm text-stone-600 mb-2">{book.author}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-bold text-amber-700">{formatPrice(book.price)}</span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${book.stock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {book.stock > 0 ? `${book.stock} in stock` : "Out of Stock"}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Link to={`/admin/books/edit/${book._id}`} state={{ from: getCurrentUrl() }} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full border-2 hover:border-amber-500">
                          <Pencil className="w-4 h-4 mr-1" /> Edit
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(book._id)} className="border-2 hover:border-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
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
