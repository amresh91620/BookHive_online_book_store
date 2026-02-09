import React, { useState, useEffect, useRef } from "react";
import { Star, BookOpen, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useBooks } from "../hooks/useBooks";
import { useReview } from "../hooks/useReview";
import { useAuth } from "../hooks/useAuth";
import AuthModal from "../components/AuthModal";
import toast from "react-hot-toast";

const HomeSection = () => {
  const { books, fetchBooksPage } = useBooks();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [coverStep, setCoverStep] = useState(0);
  const [pageBooks, setPageBooks] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authType, setAuthType] = useState("login");
  const { getAvgRatingByBook, fetchAllReviews } = useReview();
  const lastReviewIdsRef = useRef("");

  const coverBooks = books.filter((book) => book.coverImage).slice(0, 11);
  const coverIndex =
    coverBooks.length > 0 ? coverStep % coverBooks.length : 0;
  const ringBooks = coverBooks;

  const booksPerPage = 5;
  const startIndex = 0;
  const currentBooks = pageBooks;

  useEffect(() => {
    if (pageBooks.length === 0) return;
    const bookIds = pageBooks.map((book) => book._id).filter(Boolean);
    const key = bookIds.join("|");
    if (key === lastReviewIdsRef.current) return;
    lastReviewIdsRef.current = key;
    fetchAllReviews(bookIds);
  }, [pageBooks, fetchAllReviews]);

  useEffect(() => {
    const loadPage = async () => {
      try {
        setPageLoading(true);
        const res = await fetchBooksPage({
          offset: startIndex,
          limit: booksPerPage,
        });
        setPageBooks(res?.books || []);
      } catch (error) {
        setPageBooks([]);
      } finally {
        setPageLoading(false);
      }
    };

    loadPage();
  }, [fetchBooksPage, startIndex, booksPerPage]);

  useEffect(() => {
    if (coverBooks.length <= 1) return;
    const timer = setInterval(() => {
      setCoverStep((prev) => prev + 1);
    }, 2200);
    return () => clearInterval(timer);
  }, [coverBooks.length]);

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add items to cart.");
      setAuthType("login");
      setIsAuthModalOpen(true);
      return;
    }
    navigate("/cart");
  };

  return (
    <div className="bg-white text-slate-900 overflow-x-hidden">
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        type={authType}
        setType={setAuthType}
      />
      {/* HERO */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 py-12 sm:py-16">
          <div className="flex flex-col lg:flex-row lg:items-center gap-8 min-w-0">
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                Trusted Bookstore
              </p>
              <h1 className="mt-4 text-3xl sm:text-4xl font-black tracking-tight">
                Discover your next great read
              </h1>
              <p className="mt-3 text-slate-600 text-sm sm:text-base max-w-xl">
                Curated titles, honest reviews, and a smooth shopping
                experience for every kind of reader.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Link
                  to="/books"
                  className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold uppercase tracking-wider hover:bg-slate-800 transition"
                >
                  Browse Books <ArrowRight size={16} />
                </Link>
                <a
                  href="#browse"
                  className="text-slate-700 hover:text-slate-900 text-xs sm:text-sm font-semibold uppercase tracking-wider"
                >
                  View Collection
                </a>
              </div>
            </div>

            <div className="w-full lg:w-[400px] flex justify-center lg:justify-end mt-8 mr-0 lg:mr-20 min-w-0">
              <div className="mt-6 lg:mt-0">
                <div className="relative h-56 w-56 sm:h-64 sm:w-64 lg:h-72 lg:w-72 max-w-full">
                  <div className="absolute inset-8 rounded-full border border-slate-200 bg-slate-50"></div>
                  {coverBooks.length > 0 && (
                    <div className="absolute left-1/2 top-1/2 z-30 h-[180px] w-[120px] sm:h-[200px] sm:w-[140px] lg:h-[200px] lg:w-[140px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg border-4 border-white bg-white shadow-2xl transition-all duration-500">
                      <img
                        src={coverBooks[coverIndex]?.coverImage}
                        alt={coverBooks[coverIndex]?.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  {ringBooks.length > 0 && (
                    <div
                      className="absolute inset-0 z-10 transition-transform duration-1000 ease-in-out"
                      style={{
                        transform: `rotate(-${
                          (360 / ringBooks.length) * coverStep
                        }deg)`,
                      }}
                    >
                      {ringBooks.map((book, i) => {
                        const angle = (360 / ringBooks.length) * i;
                        const radius = 140;
                        const isCenter = i === coverIndex;
                        const counterRotate =
                          (360 / ringBooks.length) * coverStep;

                        return (
                          <div
                            key={book._id}
                            className="absolute left-1/2 top-1/2 transition-transform duration-700 ease-in-out"
                            style={{
                              transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${radius}px) rotate(${
                                -angle + counterRotate
                              }deg)`,
                            }}
                          >
                            <Link
                              to={`/book-rating/${book._id}`}
                              onClick={() => setCoverStep(i)}
                              aria-hidden={isCenter}
                              tabIndex={isCenter ? -1 : 0}
                              className={`block relative h-25 w-15 sm:h-30 sm:w-20 lg:h-30 lg:w-20 cursor-pointer overflow-hidden bg-white shadow-lg transition-all duration-300 ${
                                isCenter
                                  ? "opacity-100 pointer-events-none"
                                  : "hover:opacity-80 hover:scale-105"
                              }`}
                            >
                              <img
                                src={book.coverImage}
                                alt={book.title}
                                className="h-full w-full object-cover"
                              />
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LIST SECTION */}
      <section
        id="browse"
        className="max-w-7xl mx-auto px-6 pb-12 sm:pb-16"
      >
        <div className="bg-white py-4 sm:py-6 mt-10 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                Latest Arrivals
              </p>
              <h2 className="text-2xl sm:text-3xl font-black">Featured Books</h2>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="text-sm text-slate-500 font-semibold">
                Curated picks for you
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {pageLoading ? (
              <div className="flex flex-col items-center py-20 gap-4 ">
                <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">
                  Fetching Books...
                </p>
              </div>
            ) : currentBooks.length > 0 ? (
              currentBooks.map((book, index) => (
                <div
                  key={book._id}
                  className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start border-b border-slate-300 bg-white py-5 sm:py-6  transition"
                >
                  <div className="w-full lg:w-40 shrink-0 flex justify-center lg:justify-start">
                    <Link
                      to={`/book-rating/${book._id}`}
                      className="relative w-32 sm:w-36 lg:w-full overflow-hidden shadow-lg border border-slate-100 bg-white block"
                    >
                      <img
                        src={
                          book.coverImage ||
                          "https://via.placeholder.com/150?text=No+Cover"
                        }
                        alt={book.title}
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                      />
                    </Link>
                  </div>

                  <div className="flex-1 w-full">
                    <div className="flex flex-col xl:flex-row justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-slate-900 font-semibold">
                            {startIndex + index + 1}.
                          </span>
                          <span className="px-2 py-1 rounded-full bg-slate-100 text-[10px] font-bold uppercase text-slate-500">
                            {book.categories || "General"}
                          </span>
                        </div>
                        <h2 className="text-xl md:text-2xl font-black text-slate-900">
                          {book.title}
                        </h2>
                        <p className="text-slate-500 mt-2 text-sm font-medium">
                          by{" "}
                          <span className="text-slate-900 underline decoration-slate-300">
                            {book.author}
                          </span>
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          to={`/book-rating/${book._id}`}
                          className="inline-flex items-center justify-center bg-black text-white h-11 rounded-2xl px-4 text-xs font-bold uppercase tracking-wider"
                        >
                          Rate
                        </Link>
                        <Link
                          to="/cart"
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddToCart();
                          }}
                          className="inline-flex items-center justify-center border border-slate-300 text-slate-700 h-11 rounded-2xl px-4 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition"
                        >
                          Add to Cart
                        </Link>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mt-4">
                      <div className="flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-full text-slate-700">
                        <Star size={16} fill="currentColor" />
                        <span className="font-black text-sm">
                          {getAvgRatingByBook(book._id)}
                        </span>
                      </div>
                      <span className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">
                        {book.pages || "N/A"} Pages
                      </span>
                      <div className="h-1 w-1 bg-slate-300 rounded-full"></div>
                      <span className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">
                        Rs. {book.price}
                      </span>
                    </div>

                    <p className="mt-4 text-slate-500 text-sm line-clamp-2 leading-relaxed">
                      {book.description ||
                        "No description available for this title."}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[3rem]">
                <BookOpen className="mx-auto text-slate-200 mb-4" size={48} />
                <p className="text-slate-400 font-bold">
                  No books match your search.
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end mt-10">
            <Link
              to="/books"
              className="inline-flex items-center justify-center bg-slate-800 text-white px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition"
            >
              Explore More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeSection;
