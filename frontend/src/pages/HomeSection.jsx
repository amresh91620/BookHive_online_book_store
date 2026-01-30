import React, { useState, useEffect } from "react";
import {
  Star,
  Search,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useBooks } from "../hooks/useBooks";
import { useReview } from "../hooks/useReview";

const HomeSection = () => {
  const { books, loading } = useBooks();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { getAvgRatingByBook, fetchAllReviews } = useReview(); 

 

  // Filter books based on search term
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase()),
  );

  // Pagination Logic
  const booksPerPage = 5;
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const currentBooks = filteredBooks.slice(
    startIndex,
    startIndex + booksPerPage,
  );

  useEffect(() => {
    if (books.length > 0) {
      const bookIds = books.map(book => book._id);
      fetchAllReviews(bookIds);
    }
  }, [books.length]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 bg-white text-slate-800"> 
      {/* HEADER */}
      <div className="text-center mb-10 sm:mb-14">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-3 tracking-tight">
          Let's find your favorite book
        </h1>
        <p className="text-gray-500 italic text-sm sm:text-base">
          Discover, review, and rate titles from our digital library
        </p>

        {/* SEARCH */}
        <div className="relative max-w-xl mx-auto mt-6 sm:mt-8">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-800"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by title or author..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full border-2 border-gray-400 rounded-sm py-4 pl-12 pr-4 text-sm sm:text-base"
          />
        </div>
      </div>

      {/* BOOK LIST */}
      <div className="flex flex-col gap-8">
        {loading ? (
          <div className="flex flex-col items-center py-20 gap-4 ">
            <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="font-bold text-gray-400 uppercase tracking-widest text-xs">
              Fetching Books...
            </p>
          </div>
        ) : currentBooks.length > 0 ? (
          currentBooks.map((book, index) => (
            <div
              key={book._id}
              className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start border-b border-black pb-4 group"
            >
              {/* IMAGE */}
              <div className="w-full sm:w-32 shrink-0 flex justify-center sm:justify-start">
                <div className="relative w-28 sm:w-full  overflow-hidden shadow-lg">
                  <img
                    src={
                      book.coverImage ||
                      "https://via.placeholder.com/150?text=No+Cover"
                    }
                    alt={book.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* DETAILS */}
              <div className="flex-1 w-full">
                <div className="flex flex-col lg:flex-row justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-black font-semibold">
                        {startIndex + index + 1}.
                      </span>
                      <span className="px-2 py-0.5 bg-gray-100 text-[10px] font-bold uppercase text-gray-500">
                        {book.categories || "General"}
                      </span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                      {book.title}
                    </h2>
                    <p className="text-gray-500 mt-1 text-sm font-medium">
                      by{" "}
                      <span className="text-gray-900 underline decoration-gray-400">
                        {book.author}
                      </span>
                    </p>
                  </div>

                  <Link
                    to={`/book-rating/${book._id}`}
                    className="flex items-center justify-center bg-black text-white  h-10 rounded-lg p-4 uppercase"
                  >
                    Rate & Review
                  </Link>
                </div>

                {/* RATING & STATS */}
                <div className="flex flex-wrap items-center gap-4 mt-4">
                  <div className="flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full text-yellow-500">
                    <Star size={16} fill="currentColor" />
                    <span className="font-black text-sm">
                      {getAvgRatingByBook(book._id)}
                    </span>
                  </div>
                  <span className="text-gray-400 text-xs font-bold uppercase tracking-tighter">
                    {book.pages || "N/A"} Pages
                  </span>
                  <div className="h-1 w-1 bg-gray-300 rounded-full"></div>
                  <span className="text-gray-400 text-xs font-bold uppercase tracking-tighter">
                    ₹{book.price}
                  </span>
                </div>

                <p className="mt-4 text-gray-500 text-sm line-clamp-2 leading-relaxed">
                  {book.description ||
                    "No description available for this title."}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-[3rem]">
            <BookOpen className="mx-auto text-gray-200 mb-4" size={48} />
            <p className="text-gray-400 font-bold">
              No books match your search.
            </p>
          </div>
        )}
      </div>

      {/* PAGINATION */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-12">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="p-3 rounded-full border border-gray-200 text-gray-600 disabled:opacity-30 hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                  currentPage === i + 1
                    ? "bg-yellow-400 text-gray-900 shadow-md"
                    : "text-gray-400 hover:text-gray-900"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="p-3 rounded-full border border-gray-200 text-gray-600 disabled:opacity-30 hover:bg-gray-50 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default HomeSection;