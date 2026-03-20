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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Books</h1>
          <p className="text-gray-600 mt-1">Total: {total} books</p>
        </div>
        <Link to="/admin/books/add">
          <Button className="bg-amber-600 hover:bg-amber-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Book
          </Button>
        </Link>
      </div>

        {/* Search */}
        <div className="mb-6">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search books by title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>
        </div>

        {/* Books Table */}
        {isLoading ? (
          <LoadingSkeleton type="table" count={1} />
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Book
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {books.map((book) => (
                    <tr key={book._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={book.coverImage}
                            alt={book.title}
                            className="w-12 h-16 object-cover rounded"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{book.title}</div>
                            <div className="text-sm text-gray-500">{book.categories}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{book.author}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatPrice(book.price)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{book.stock}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            book.stock > 0
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {book.stock > 0 ? "In Stock" : "Out of Stock"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link 
                            to={`/admin/books/edit/${book._id}`}
                            state={{ from: getCurrentUrl() }}
                          >
                            <Button variant="ghost" size="sm">
                              <Pencil className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(book._id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6">
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
