import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Hexagon } from "lucide-react";
import { Link } from "react-router-dom";
import { useBooks } from "../hooks/useBooks";
import { useReview } from "../hooks/useReview";
import { useAuth } from "../hooks/useAuth";
import AuthModal from "../components/AuthModal";
import toast from "react-hot-toast";
import { useCart } from "../hooks/useCart";
import { BookGrid } from "../components/books";
import { Button, Badge } from "../components/ui";
import { HOME_CONTENT } from "../config/site";

const HomeSection = () => {
  const { books, fetchBooksPage, loading } = useBooks();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [coverStep, setCoverStep] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );
  const [pageBooks, setPageBooks] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authType, setAuthType] = useState("login");
  const { getAvgRatingByBook, getReviewCountByBook, fetchAllReviews } = useReview();
  const lastReviewIdsRef = useRef("");
  const featuredReviewIdsRef = useRef("");
  const featuredListKeyRef = useRef("");
  const [featuredBooks, setFeaturedBooks] = useState({
    bestSellers: [],
    newArrivals: [],
  });
  const coverBooks = books.filter((book) => book.coverImage).slice(0, 10);
  const horizontalSpacing =
    viewportWidth < 640 ? 30 : viewportWidth < 1024 ? 45 : 65;

  useEffect(() => {
    if (books.length === 0) return;
    const bookIds = books.map((book) => book._id).filter(Boolean);
    const key = bookIds.join("|");
    if (key === featuredListKeyRef.current) return;
    featuredListKeyRef.current = key;
    const ratingSnapshot = {};
    books.forEach((book) => {
      ratingSnapshot[book._id] = Number(getAvgRatingByBook(book._id)) || 0;
    });
    const bestSellers = [...books]
      .sort((a, b) => {
        const diff =
          (ratingSnapshot[b._id] || 0) - (ratingSnapshot[a._id] || 0);
        if (diff !== 0) return diff;
        return String(a._id).localeCompare(String(b._id));
      })
      .slice(0, 10);
    setFeaturedBooks((prev) => ({ ...prev, bestSellers }));
  }, [books, getAvgRatingByBook]);

  useEffect(() => {
    if (featuredBooks.bestSellers.length === 0) return;
    const bookIds = featuredBooks.bestSellers
      .map((book) => book._id)
      .filter(Boolean);
    const key = bookIds.join("|");
    if (key === featuredReviewIdsRef.current) return;
    featuredReviewIdsRef.current = key;
    fetchAllReviews(bookIds);
  }, [featuredBooks.bestSellers, fetchAllReviews]);

  useEffect(() => {
    if (pageBooks.length === 0) return;
    const bookIds = pageBooks.map((book) => book._id).filter(Boolean);
    const key = bookIds.join("|");
    if (key === lastReviewIdsRef.current) return;
    lastReviewIdsRef.current = key;
    fetchAllReviews(bookIds);
  }, [pageBooks, fetchAllReviews]);

  const featuredRatings = useMemo(() => {
    const ratings = {};
    featuredBooks.bestSellers.forEach((book) => {
      ratings[book._id] = getAvgRatingByBook(book._id);
    });
    return ratings;
  }, [featuredBooks.bestSellers, getAvgRatingByBook]);

  const featuredReviewCounts = useMemo(() => {
    const counts = {};
    featuredBooks.bestSellers.forEach((book) => {
      counts[book._id] = getReviewCountByBook(book._id);
    });
    return counts;
  }, [featuredBooks.bestSellers, getReviewCountByBook]);

  const pageRatings = useMemo(() => {
    const ratings = {};
    pageBooks.forEach((book) => {
      ratings[book._id] = getAvgRatingByBook(book._id);
    });
    return ratings;
  }, [pageBooks, getAvgRatingByBook]);

  const pageReviewCounts = useMemo(() => {
    const counts = {};
    pageBooks.forEach((book) => {
      counts[book._id] = getReviewCountByBook(book._id);
    });
    return counts;
  }, [pageBooks, getReviewCountByBook]);

  useEffect(() => {
    const loadPage = async () => {
      try {
        setPageLoading(true);
        const res = await fetchBooksPage({ offset: 0, limit: 10 });
        setPageBooks(res?.books || []);
      } catch (error) {
        setPageBooks([]);
      } finally {
        setPageLoading(false);
      }
    };
    loadPage();
  }, [fetchBooksPage]);

  useEffect(() => {
    if (coverBooks.length <= 1) return;
    const timer = setInterval(() => {
      setCoverStep((prev) => prev + 1);
    }, 4500);
    return () => clearInterval(timer);
  }, [coverBooks.length]);

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleAddToCart = useCallback(async (bookId) => {
    if (!user) {
      toast.error("Please login to add items to cart.");
      setAuthType("login");
      setIsAuthModalOpen(true);
      return;
    }
    try {
      await addToCart(bookId);
      toast.success("Added to BookHive cart!");
    } catch (err) {
      toast.error("Failed to add item");
    }
  }, [user, addToCart]);

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans text-[#1E293B] overflow-x-hidden">
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        type={authType}
        setType={setAuthType}
      />

      {/* Hero Section - 50% Height & Fully Responsive */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-[#F8FAFC] min-h-[420px] sm:min-h-[500px] lg:min-h-[560px] flex items-center">
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill-rule='evenodd' fill='%232563EB' fill-opacity='1'/%3E%3C/svg%3E")`,
            backgroundSize: "40px 40px",
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full h-full flex items-center">
          <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-6 sm:gap-8 lg:gap-12 xl:gap-16 h-full py-6 sm:py-8 lg:py-0">
            <div className="flex-1 relative w-full h-[320px] sm:h-[400px] lg:h-[500px] order-1 lg:order-2 perspective-[2000px]">
              <div className="relative h-full w-full flex items-center justify-center">
                {coverBooks.slice(0, 10).map((book, index) => {
                  const total = Math.min(coverBooks.length, 10);

                  // Calculate relative position (0 is center, negative is left, positive is right)
                  let position = (index - (coverStep % total) + total) % total;
                  if (position > total / 2) position -= total;

                  const absPos = Math.abs(position);
                  const isActive = position === 0;

                  // --- RESPONSIVE MATH ---
                  // Spread distance between books
                  // Shrink books as they move away from center
                  const scale = 1 - absPos * 0.12;
                  // Fade out books that are too far to the side
                  const opacity = absPos > 3 ? 0 : 1 - absPos * 0.25;
                  // 3D rotation for the "shelf" curve
                  const rotateY = position * -15;
                  const xOffset = position * horizontalSpacing;
                  const zIndex = 100 - absPos;

                  return (
                    <div
                      key={book._id}
                      className="absolute w-28 h-[152px] sm:w-36 sm:h-[210px] md:w-44 md:h-[240px] lg:w-52 lg:h-[288px] xl:w-60 xl:h-[336px] transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]"
                      style={{
                        transform: `translateX(${xOffset}px) scale(${scale}) rotateY(${rotateY}deg)`,
                        zIndex,
                        opacity,
                        visibility: opacity === 0 ? "hidden" : "visible",
                      }}
                    >
                      <div
                        className={`
            w-full h-full rounded-sm overflow-hidden 
            border-l-[4px] md:border-l-[8px] border-[#0F172A]
            shadow-[0_10px_30px_rgba(0,0,0,0.3)]
            ${isActive ? "ring-2 ring-blue-500/30" : ""}
          `}
                      >
                        {/* Book Reflection/Glossy Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />

                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className={`w-full h-full object-cover transition-all duration-700 ${!isActive ? "brightness-75 contrast-125" : ""}`}
                        />
                      </div>

                      {/* Subtle Shadow on Floor */}
                      {isActive && (
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[80%] h-4 bg-black/20 blur-xl rounded-[100%]" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Text Content (Order 2) */}
            <div className="flex-1 text-center lg:text-left z-20 w-full order-2 lg:order-1">
              <Badge
                variant="outline"
                className="mb-2 sm:mb-3 border-[#3B82F6] bg-[#3B82F6]/5 text-[#2563EB]"
              >
                <Hexagon className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-[#3B82F6] mr-2" />
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest">
                  {HOME_CONTENT.badge}
                </span>
              </Badge>

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-2 sm:mb-3 md:mb-4 tracking-tight text-[#0F172A]">
                {HOME_CONTENT.heroTitle} <br />
                <span className="italic font-medium text-[#2563EB]">
                  {HOME_CONTENT.heroEmphasis}
                </span>
              </h1>

              <p className="text-xs sm:text-sm md:text-base lg:text-lg text-[#475569] max-w-lg mx-auto lg:mx-0 font-sans leading-relaxed mb-4 sm:mb-5 md:mb-6 px-2 sm:px-0">
                {HOME_CONTENT.heroSubtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 justify-center lg:justify-start px-4 sm:px-0">
                <Button
                  variant="primary"
                  size="lg"
                  asChild
                  className="w-full sm:w-auto bg-[#0F172A] hover:bg-[#2563EB] text-[10px] sm:text-xs uppercase tracking-widest"
                >
                  <Link to="/books">{HOME_CONTENT.heroPrimaryCta}</Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() =>
                    document
                      .getElementById("featured")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="w-full sm:w-auto border-2 border-[#3B82F6] text-[#0F172A] hover:bg-[#3B82F6] hover:text-white text-[10px] sm:text-xs uppercase tracking-widest"
                >
                  {HOME_CONTENT.heroSecondaryCta}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section - Mobile Optimized */}
      <section
        id="featured"
        className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white border-y border-[#E2E8F0]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16">
            <h2 className="text-[10px] sm:text-xs font-sans font-bold uppercase tracking-[0.3em] text-[#3B82F6] mb-2">
              {HOME_CONTENT.featuredKicker}
            </h2>
            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#0F172A]">
              {HOME_CONTENT.featuredTitle}
            </h3>
          </div>

          <BookGrid
            books={featuredBooks.bestSellers}
            loading={loading}
            avgRatings={featuredRatings}
            reviewCounts={featuredReviewCounts}
            onAddToCart={handleAddToCart}
            className="sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8 lg:gap-10"
          />
        </div>
      </section>

      {/* Full Library Section - Mobile Optimized */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 md:mb-12 lg:mb-14 gap-4">
          <div className="max-w-xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 text-[#0F172A]">
              {HOME_CONTENT.libraryTitle}
            </h2>
            <p className="text-[#64748B] font-sans text-xs sm:text-sm md:text-base leading-relaxed">
              {HOME_CONTENT.libraryDescription}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="w-fit font-bold text-[10px] sm:text-xs uppercase tracking-widest border-b-2 border-[#0F172A] pb-1 hover:text-[#3B82F6] hover:border-[#3B82F6] rounded-none"
          >
            <Link to="/books">{HOME_CONTENT.libraryCta}</Link>
          </Button>
        </div>

        <BookGrid
          books={pageBooks}
          loading={pageLoading}
          avgRatings={pageRatings}
          reviewCounts={pageReviewCounts}
          onAddToCart={handleAddToCart}
          className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 sm:gap-x-6 md:gap-x-8 gap-y-8 sm:gap-y-10 md:gap-y-12 lg:gap-y-16"
        />
      </section>

      {/* Footer CTA - Mobile Optimized */}
      <section className="bg-[#0F172A] py-12 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden">
        <Hexagon className="absolute -bottom-12 -right-12 sm:-bottom-16 sm:-right-16 md:-bottom-20 md:-right-20 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 text-white/5 opacity-[0.03]" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <h2 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 md:mb-6 leading-tight">
            {HOME_CONTENT.ctaTitle}
          </h2>
          <p className="text-slate-400 font-sans text-xs sm:text-sm md:text-base lg:text-lg mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed px-2">
            {HOME_CONTENT.ctaDescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
            {user ? (
              <Button
                variant="primary"
                size="lg"
                asChild
                className="w-full sm:w-auto bg-[#3B82F6] hover:bg-white hover:text-[#0F172A] text-[10px] sm:text-xs uppercase tracking-widest"
              >
                <Link to="/books">{HOME_CONTENT.ctaLoggedIn}</Link>
              </Button>
            ) : (
              <Button
                variant="primary"
                size="lg"
                onClick={() => {
                  setAuthType("register");
                  setIsAuthModalOpen(true);
                }}
                className="w-full sm:w-auto bg-[#3B82F6] hover:bg-white hover:text-[#0F172A] text-[10px] sm:text-xs uppercase tracking-widest"
              >
                {HOME_CONTENT.ctaLoggedOut}
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeSection;
