import { useState, useEffect, useRef } from "react";
import { 
  Star, 
  Bookmark,
  ShoppingBag,
  Hexagon 
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useBooks } from "../hooks/useBooks";
import { useReview } from "../hooks/useReview";
import { useAuth } from "../hooks/useAuth";
import AuthModal from "../components/AuthModal";
import toast from "react-hot-toast";
import { useCart } from "../hooks/useCart";

const HomeSection = () => {
  const { books, fetchBooksPage } = useBooks();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [coverStep, setCoverStep] = useState(0);
  const [pageBooks, setPageBooks] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authType, setAuthType] = useState("login");
  const { getAvgRatingByBook, fetchAllReviews } = useReview();
  const lastReviewIdsRef = useRef("");
  const [featuredBooks, setFeaturedBooks] = useState({ bestSellers: [], newArrivals: [] });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const coverBooks = books.filter((book) => book.coverImage).slice(0, 10);
  const coverIndex = coverBooks.length > 0 ? coverStep % coverBooks.length : 0;

  // Handle window resize for responsive carousel
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (books.length > 0) {
      const bestSellers = [...books]
        .sort((a, b) => getAvgRatingByBook(b._id) - getAvgRatingByBook(a._id))
        .slice(0, 10);
      setFeaturedBooks({ bestSellers });
    }
  }, [books, getAvgRatingByBook]);

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

  const handleAddToCart = async (bookId) => {
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
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-serif text-[#1E293B] overflow-x-hidden mt-2">
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        type={authType}
        setType={setAuthType}
      />

      {/* Hero Section - 50% Height & Fully Responsive */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-[#F8FAFC] h-[50vh] min-h-[450px] sm:min-h-[500px] md:min-h-[550px] flex items-center">
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none" 
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill-rule='evenodd' fill='%232563EB' fill-opacity='1'/%3E%3C/svg%3E")`, 
            backgroundSize: '40px 40px' 
          }}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full h-full flex items-center">
          <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-6 sm:gap-8 lg:gap-12 xl:gap-16 h-full py-6 sm:py-8 lg:py-0">
        
<div className="flex-1 relative w-full h-[350px] sm:h-[400px] lg:h-[500px] order-1 lg:order-2 perspective-[2000px]">
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
      const horizontalSpacing = window.innerWidth < 640 ? 35 : window.innerWidth < 1024 ? 50 : 70;
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
          className="absolute w-28 h-40 sm:w-36 sm:h-52 md:w-44 md:h-64 lg:w-52 lg:h-72 xl:w-60 xl:h-84 transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]"
          style={{
            transform: `translateX(${xOffset}px) scale(${scale}) rotateY(${rotateY}deg)`,
            zIndex,
            opacity,
            visibility: opacity === 0 ? 'hidden' : 'visible'
          }}
        >
          <div className={`
            w-full h-full rounded-sm overflow-hidden 
            border-l-[4px] md:border-l-[8px] border-[#0F172A]
            shadow-[0_10px_30px_rgba(0,0,0,0.3)]
            ${isActive ? 'ring-2 ring-blue-500/30' : ''}
          `}>
            {/* Book Reflection/Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
            
            <img 
              src={book.coverImage} 
              alt={book.title} 
              className={`w-full h-full object-cover transition-all duration-700 ${!isActive ? 'brightness-75 contrast-125' : ''}`} 
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
              <div className="inline-flex items-center gap-2 mb-2 sm:mb-3 px-3 sm:px-4 py-1.5 border border-[#3B82F6] rounded-full bg-[#3B82F6]/5">
                <Hexagon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#3B82F6] fill-[#3B82F6]" />
                <span className="text-[9px] sm:text-[10px] font-sans font-bold uppercase tracking-widest text-[#2563EB]">
                  The Collector's Archive
                </span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-2 sm:mb-3 md:mb-4 tracking-tight text-[#0F172A]">
                Welcome to <br />
                <span className="italic font-medium text-[#2563EB]">BookHive.</span>
              </h1>
              
              <p className="text-xs sm:text-sm md:text-base lg:text-lg text-[#475569] max-w-lg mx-auto lg:mx-0 font-sans leading-relaxed mb-4 sm:mb-5 md:mb-6 px-2 sm:px-0">
                Where every story finds its place. Browse our curated selection of 
                fine literature and modern classics in a space built for readers.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 justify-center lg:justify-start px-4 sm:px-0">
                <Link 
                  to="/books" 
                  className="w-full sm:w-auto text-center bg-[#0F172A] text-white px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-3.5 font-sans font-bold text-[10px] sm:text-xs uppercase tracking-widest hover:bg-[#2563EB] transition-all duration-300 shadow-lg"
                >
                  Browse Hive
                </Link>
                <button 
                  onClick={() => document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' })} 
                  className="w-full sm:w-auto border-2 border-[#3B82F6] text-[#0F172A] px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-3.5 font-sans font-bold text-[10px] sm:text-xs uppercase tracking-widest hover:bg-[#3B82F6] hover:text-white transition-all duration-300"
                >
                  Bestsellers
                </button>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Featured Section - Mobile Optimized */}
      <section id="featured" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white border-y border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16">
            <h2 className="text-[10px] sm:text-xs font-sans font-bold uppercase tracking-[0.3em] text-[#3B82F6] mb-2">
              Prime Picks
            </h2>
            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#0F172A]">
              Hive Bestsellers
            </h3>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
            {featuredBooks.bestSellers.map((book) => (
              <div key={book._id} className="group relative">
                <div className="relative aspect-2/3 overflow-hidden shadow-[4px_4px_0px_#3B82F6] sm:shadow-[6px_6px_0px_#3B82F6] group-hover:shadow-[6px_6px_0px_#0F172A] sm:group-hover:shadow-[8px_8px_0px_#0F172A] transition-all duration-500 mb-3 sm:mb-4">
                  <img 
                    src={book.coverImage} 
                    alt={book.title} 
                    className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" 
                  />
                </div>
                <h4 className="font-bold text-sm sm:text-base md:text-lg mb-1 sm:mb-2 line-clamp-2 text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                  {book.title}
                </h4>
                <p className="text-[10px] sm:text-xs font-sans text-[#64748B] mb-3 uppercase tracking-wider truncate">
                  {book.author}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0]">
                  <span className="font-bold text-base sm:text-lg md:text-xl text-[#0F172A]">
                    ₹{book.price}
                  </span>
                  <button 
                    onClick={() => handleAddToCart(book._id)} 
                    className="text-[#0F172A] hover:text-[#3B82F6] hover:scale-110 transition-all p-1.5 sm:p-2"
                    aria-label="Add to cart"
                  >
                    <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full Library Section - Mobile Optimized */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 md:mb-12 lg:mb-14 gap-4">
          <div className="max-w-xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 text-[#0F172A]">
              Explore the Full Hive
            </h2>
            <p className="text-[#64748B] font-sans text-xs sm:text-sm md:text-base leading-relaxed">
              Our entire collection of meticulously sourced volumes, ranging from history and science to the finest fiction.
            </p>
          </div>
          <Link 
            to="/books" 
            className="inline-block w-fit font-sans font-bold text-[10px] sm:text-xs uppercase tracking-widest border-b-2 border-[#0F172A] pb-1 hover:text-[#3B82F6] hover:border-[#3B82F6] transition-all"
          >
            See All Volumes
          </Link>
        </div>

        {pageLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
            {[1,2,3,4,5,6,7,8,9,10].map(i => (
              <div 
                key={i} 
                className="aspect-3/4 bg-slate-100 animate-pulse rounded-sm"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 sm:gap-x-6 md:gap-x-8 gap-y-8 sm:gap-y-10 md:gap-y-12 lg:gap-y-16">
            {pageBooks.map((book) => (
              <div 
                key={book._id} 
                className="group cursor-pointer" 
                onClick={() => navigate(`/book-rating/${book._id}`)}
              >
                <div className="relative mb-3 sm:mb-4 overflow-hidden bg-slate-200 aspect-3/4 shadow-sm transition-transform group-hover:-translate-y-1 sm:group-hover:-translate-y-2">
                  <img 
                    src={book.coverImage} 
                    alt={book.title} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                     <Bookmark className="w-4 h-4 sm:w-5 sm:h-5 text-white/50 hover:text-white" />
                  </div>
                </div>
                <div className="flex items-center gap-1 mb-1 sm:mb-1.5">
                  <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-[#3B82F6] text-[#3B82F6]" />
                  <span className="text-[9px] sm:text-[10px] font-sans font-bold text-[#2563EB]">
                    {getAvgRatingByBook(book._id)} / 5.0
                  </span>
                </div>
                <h3 className="font-bold text-xs sm:text-sm md:text-base leading-tight mb-1 group-hover:text-[#3B82F6] transition-colors text-[#0F172A] line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-[#64748B] text-[9px] sm:text-[10px] md:text-xs mb-2 sm:mb-3 italic truncate">
                  {book.author}
                </p>
                <button 
                   onClick={(e) => { e.stopPropagation(); handleAddToCart(book._id); }}
                   className="w-full bg-transparent border border-[#0F172A] py-2 sm:py-2.5 text-[9px] sm:text-[10px] font-sans font-bold uppercase tracking-widest hover:bg-[#0F172A] hover:text-white transition-all"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer CTA - Mobile Optimized */}
      <section className="bg-[#0F172A] py-12 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden">
        <Hexagon className="absolute -bottom-12 -right-12 sm:-bottom-16 sm:-right-16 md:-bottom-20 md:-right-20 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 text-white/5 opacity-[0.03]" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <h2 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 md:mb-6 leading-tight">
            Ready to grow your collection?
          </h2>
          <p className="text-slate-400 font-sans text-xs sm:text-sm md:text-base lg:text-lg mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed px-2">
            Join 5,000+ BookHive members and get access to exclusive first-editions and 
            monthly reading club discussions.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
            {user ? (
              <Link 
                to="/books" 
                className="w-full sm:w-auto bg-[#3B82F6] text-white px-8 sm:px-10 md:px-12 py-3 sm:py-4 font-sans font-bold uppercase tracking-widest text-[10px] sm:text-xs hover:bg-white hover:text-[#0F172A] transition-all text-center"
              >
                Continue Exploring
              </Link>
            ) : (
              <button 
                onClick={() => { setAuthType("register"); setIsAuthModalOpen(true); }}
                className="w-full sm:w-auto bg-[#3B82F6] text-white px-8 sm:px-10 md:px-12 py-3 sm:py-4 font-sans font-bold uppercase tracking-widest text-[10px] sm:text-xs hover:bg-white hover:text-[#0F172A] transition-all text-center"
              >
                Join the Hive
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeSection;