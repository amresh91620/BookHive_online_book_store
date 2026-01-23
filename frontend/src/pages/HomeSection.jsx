import React, { useState } from "react";
import { Star, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const books = [
  {
    id: 1,
    title: "Harry Potter and the Sorcerer's Stone",
    author: "J.K. Rowling",
    rating: 4.47,
    ratingsCount: "11,422,614",
    score: 4215,
    voted: 45,
    img: "https://covers.openlibrary.org/b/id/7984916-M.jpg",
  },
  {
    id: 2,
    title: "Jane Eyre",
    author: "Charlotte Brontë",
    rating: 4.16,
    ratingsCount: "2,325,194",
    score: 4129,
    voted: 44,
    img: "https://covers.openlibrary.org/b/id/8226191-M.jpg",
  },
  {
    id: 3,
    title: "Harry Potter and the Goblet of Fire",
    author: "J.K. Rowling",
    rating: 4.57,
    ratingsCount: "4,196,335",
    score: 3702,
    voted: 40,
    img: "https://covers.openlibrary.org/b/id/8108697-M.jpg",
  },
  {
    id: 4,
    title: "Harry Potter and the Prisoner of Azkaban",
    author: "J.K. Rowling",
    rating: 4.58,
    ratingsCount: "4,845,426",
    score: 3494,
    voted: 38,
    img: "https://covers.openlibrary.org/b/id/7984920-M.jpg",
  },
  {
    id: 5,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    rating: 4.25,
    ratingsCount: "1,254,123",
    score: 3250,
    voted: 36,
    img: "https://covers.openlibrary.org/b/id/8081237-M.jpg",
  },
  {
    id: 6,
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    rating: 4.3,
    ratingsCount: "3,124,312",
    score: 3400,
    voted: 40,
    img: "https://covers.openlibrary.org/b/id/6979861-M.jpg",
  },
];

const HomeSection = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const booksPerPage = 3;

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const currentBooks = filteredBooks.slice(
    startIndex,
    startIndex + booksPerPage,
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 bg-white text-slate-800">
      {/* HEADER */}
      <div className="text-center mb-10 sm:mb-14">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Let’s find your favorite book for rating
        </h1>
        <p className="text-gray-500 italic text-sm sm:text-base">
          Discover, review, and rate timeless books
        </p>

        {/* SEARCH */}
        <div className="relative max-w-xl mx-auto mt-6 sm:mt-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title or author..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full border border-gray-200 rounded-full py-3 pl-12 pr-4 text-sm sm:text-base
                       focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* BOOK LIST */}
      <div className="flex flex-col gap-10 sm:gap-12">
        {currentBooks.map((book, index) => (
          <div
            key={book.id}
            className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start border-b pb-8 sm:pb-10"
          >
            {/* IMAGE */}
            <div className="w-full sm:w-36 shrink-0 flex justify-center sm:justify-start">
              <img
                src={book.img}
                alt={book.title}
                className="rounded-md shadow-md w-32 sm:w-full"
              />
            </div>

            {/* DETAILS */}
            <div className="flex-1 w-full">
              <div className="flex flex-col lg:flex-row justify-between gap-4">
                <div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
                    <span className="text-gray-300 mr-2">
                      {startIndex + index + 1}.
                    </span>
                    {book.title}
                  </h2>
                  <p className="text-gray-600 mt-1 sm:mt-2 text-sm">
                    by{" "}
                    <span className="underline hover:text-amber-600 cursor-pointer">
                      {book.author}
                    </span>
                  </p>
                </div>

                <Link
                  to="/book-rating"
                  className="group relative flex items-center justify-center gap-2 overflow-hidden border-2 border-gray-900 bg-yellow-400 px-2 py-2.5 text-[11px] font-black uppercase tracking-[0.15em] text-gray-900 transition-all duration-300 hover:bg-gray-900 hover:text-white active:scale-95"
                >
                  <span className="relative z-10">Write a Review</span>
                </Link>
              </div>

              {/* RATING */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-4">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={
                        i < Math.floor(book.rating) ? "currentColor" : "none"
                      }
                    />
                  ))}
                </div>
                <span className="font-semibold">{book.rating}</span>
                <span className="text-gray-400 text-sm">
                  {book.ratingsCount} ratings
                </span>
              </div>

              {/* META */}
              <div className="mt-3 flex flex-wrap gap-4 sm:gap-6 text-xs uppercase tracking-widest text-gray-400">
                <span>Score: {book.score}</span>
                <span>Votes: {book.voted}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 mt-12 sm:mt-16">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="flex items-center gap-2 text-sm font-semibold text-amber-700 disabled:text-gray-300"
          >
            <ChevronLeft size={18} /> Previous
          </button>

          <span className="text-gray-400 text-sm">
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="flex items-center gap-2 text-sm font-semibold text-amber-700 disabled:text-gray-300"
          >
            Next <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default HomeSection;
