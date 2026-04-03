import { Link, useNavigate } from "react-router-dom";
import { Search, ChevronRight, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBookStats } from "@/hooks/api/useBooks";
import { useState } from "react";

const placeholderCover = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=800&auto=format&fit=crop";

export default function HeroCarousel() {
  const { data: stats, isLoading } = useBookStats();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const featuredBooks = stats?.featured?.slice(0, 2) || []; 
  const trendingBooks = stats?.featured?.slice(0, 4) || []; // Showing 4 books at bottom

  const categories = ["New Arrival", "Best Trend", "Upcoming", "Top Rated"];

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append("search", searchQuery);
    if (selectedCategory) params.append("category", selectedCategory);
    navigate(`/books?${params.toString()}`);
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-[540px] lg:h-[600px] bg-[#1a2e44]">
        <div className="container-shell h-full relative z-10 py-8 lg:py-0">
          <div className="h-full grid lg:grid-cols-[40%_60%] gap-10 items-center">
            
            {/* Left - Book Stack Skeleton */}
            <div className="hidden lg:flex relative items-center justify-center h-full">
              <div className="relative w-full max-w-[340px] h-[400px]">
                {[0, 1].map((index) => (
                  <div
                    key={index}
                    className="absolute rounded-2xl overflow-hidden shadow-2xl animate-pulse"
                    style={{
                      width: "240px",
                      height: "320px",
                      left: `${index * 50}px`,
                      top: "45%",
                      marginTop: "-160px",
                      transform: `rotate(${index === 0 ? -7 : 5}deg)`,
                      zIndex: 20 - index,
                      animationDelay: `${index * 200}ms`
                    }}
                  >
                    <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-600" />
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Content Skeleton */}
            <div className="flex flex-col justify-center space-y-5 lg:space-y-7 px-4 lg:px-0">
              {/* Tag skeleton */}
              <div className="h-4 w-48 bg-gray-600 rounded-full animate-pulse" style={{ animationDelay: '100ms' }} />
              
              {/* Title skeleton */}
              <div className="space-y-3">
                <div className="h-10 lg:h-14 w-full bg-gray-600 rounded-lg animate-pulse" style={{ animationDelay: '200ms' }} />
                <div className="h-10 lg:h-14 w-4/5 bg-gray-600 rounded-lg animate-pulse" style={{ animationDelay: '300ms' }} />
              </div>
              
              {/* Description skeleton */}
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-700 rounded animate-pulse" style={{ animationDelay: '400ms' }} />
                <div className="h-4 w-3/4 bg-gray-700 rounded animate-pulse" style={{ animationDelay: '500ms' }} />
              </div>

              {/* Search bar skeleton */}
              <div className="h-14 lg:h-16 w-full bg-white/10 rounded-xl lg:rounded-2xl animate-pulse" style={{ animationDelay: '600ms' }} />

              {/* Popular books skeleton */}
              <div className="pt-4 lg:pt-5 border-t border-white/10">
                <div className="h-4 w-32 bg-gray-600 rounded mb-3 animate-pulse" style={{ animationDelay: '700ms' }} />
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[0, 1, 2, 3].map((idx) => (
                    <div key={idx} className="flex items-center gap-2 animate-pulse" style={{ animationDelay: `${800 + idx * 100}ms` }}>
                      <div className="w-10 h-14 lg:w-11 lg:h-15 bg-gray-600 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-full bg-gray-700 rounded" />
                        <div className="h-2 w-12 bg-gray-700 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="relative w-full min-h-[540px] lg:h-[600px] overflow-hidden bg-[#1a2e44]">
      {/* Decorative Gradient Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#d97642]/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-600/5 blur-[100px] rounded-full translate-y-1/4 -translate-x-1/4" />
      
      <div className="container-shell h-full relative z-10 py-8 lg:py-0">
        <div className="h-full grid lg:grid-cols-[40%_60%] gap-10 items-center">
          
          {/* Left - Hero Book Stack (Hidden on Mobile) */}
          <div className="hidden lg:flex relative items-center justify-center h-full">
            <div className="relative w-full max-w-[340px] h-[400px]" style={{ perspective: "1500px" }}>
              {featuredBooks.map((book, index) => (
                <Link
                  key={index}
                  to={`/books/${book?._id}`}
                  className="absolute transition-all duration-500 hover:scale-105 hover:-translate-y-3 group"
                  style={{
                    zIndex: 20 - index,
                    width: "240px",
                    left: `${index * 50}px`,
                    top: "45%",
                    marginTop: "-160px",
                    transform: `rotate(${index === 0 ? -7 : 5}deg) rotateY(${index === 0 ? -15 : 15}deg)`,
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* 3D Book Container */}
                  <div 
                    className="relative"
                    style={{
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {/* Front Cover */}
                    <div 
                      className="relative rounded-2xl overflow-hidden shadow-[20px_20px_50px_rgba(0,0,0,0.6)] border border-white/10"
                      style={{
                        transform: "translateZ(20px)"
                      }}
                    >
                      <img
                        src={book?.coverImage || placeholderCover}
                        alt={book?.title}
                        className="w-full aspect-[3/4.2] object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>

                    {/* Book Spine (Left Side) */}
                    <div 
                      className="absolute top-0 left-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600"
                      style={{
                        width: "40px",
                        height: "100%",
                        transform: "rotateY(-90deg) translateZ(0px)",
                        transformOrigin: "left center",
                        transformStyle: "preserve-3d",
                        boxShadow: "inset 2px 0 8px rgba(0,0,0,0.5)"
                      }}
                    >
                      <div className="h-full flex items-center justify-center p-2">
                        <p 
                          className="text-white text-[9px] font-bold line-clamp-3 text-center"
                          style={{
                            writingMode: "vertical-rl",
                            textOrientation: "mixed"
                          }}
                        >
                          {book?.title || "Book"}
                        </p>
                      </div>
                    </div>

                    {/* Book Pages (Right Side) */}
                    <div 
                      className="absolute top-0 right-0 bg-gradient-to-l from-gray-50 via-white to-gray-100 overflow-hidden"
                      style={{
                        width: "40px",
                        height: "100%",
                        transform: "rotateY(90deg) translateZ(0px)",
                        transformOrigin: "right center",
                        boxShadow: "inset -3px 0 6px rgba(0,0,0,0.15)"
                      }}
                    >
                      {/* Page lines effect */}
                      <div className="h-full flex flex-col justify-evenly px-1.5 py-2">
                        {[...Array(30)].map((_, i) => (
                          <div key={i} className="h-[1px] bg-gray-300 opacity-40" />
                        ))}
                      </div>
                    </div>

                    {/* Book Top Edge */}
                    <div 
                      className="absolute top-0 left-0 right-0 bg-gradient-to-b from-gray-200 to-gray-300"
                      style={{
                        height: "40px",
                        transform: "rotateX(90deg) translateZ(0px)",
                        transformOrigin: "top center",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                      }}
                    />

                    {/* Book Bottom Edge */}
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-300 to-gray-200"
                      style={{
                        height: "40px",
                        transform: "rotateX(-90deg) translateZ(0px)",
                        transformOrigin: "bottom center",
                        boxShadow: "0 -2px 4px rgba(0,0,0,0.2)"
                      }}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Right - Main Content Area */}
          <div className="flex flex-col justify-center space-y-5 lg:space-y-7 py-8 px-4 lg:px-0">
            <div className="space-y-3 lg:space-y-4">
              <div className="flex items-center gap-2 text-[#d97642] font-bold text-xs uppercase tracking-[0.2em]">
                <Sparkles className="w-4 h-4" /> Discover Your Next Read
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight">
                Read Novels, Journals,<br />
                and <span className="text-[#d97642]">Non-fictions</span> you like
              </h1>
              <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-xl leading-relaxed">
                Unlock a universe of knowledge and stories. Request any book you desire and we'll bring it to your doorstep.
              </p>
            </div>

            {/* Search Bar - Modern Box */}
            <form 
              onSubmit={handleSearch} 
              className="bg-white rounded-xl lg:rounded-2xl p-1 lg:p-1.5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0 shadow-2xl"
            >
              <div className="flex-1 flex items-center px-3 lg:px-4">
                <Search className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search book, author, or ISBN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-2 lg:px-3 py-2 lg:py-3 text-gray-900 outline-none focus:outline-none text-sm placeholder:text-gray-400 font-semibold"
                />
              </div>
              
              <div className="hidden sm:block w-[1px] h-8 bg-gray-100" />

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="hidden sm:block px-3 lg:px-5 py-2 text-gray-600 text-sm font-bold outline-none bg-transparent cursor-pointer"
              >
                <option value="">All Categories</option>
                <option value="fiction">Fiction</option>
                <option value="non-fiction">Non-Fiction</option>
                <option value="science">Science</option>
              </select>

              <Button 
                type="submit"
                className="bg-[#d97642] hover:bg-[#c26535] text-white px-6 lg:px-8 py-2.5 lg:py-3.5 rounded-lg lg:rounded-xl h-auto font-bold transition-all shadow-lg active:scale-95"
              >
                Find Book
              </Button>
            </form>

            {/* Bottom Section: Trending Books & View All */}
            <div className="pt-4 lg:pt-5 border-t border-white/10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white/80 text-xs lg:text-sm font-bold tracking-widest uppercase">Popular Right Now</h3>
                <Link to="/books">
                  <Button variant="link" className="text-[#d97642] hover:text-white p-0 h-auto font-bold text-xs flex items-center gap-1 group">
                    VIEW ALL <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {trendingBooks.slice(0, 4).map((book, idx) => (
                  <Link key={idx} to={`/books/${book?._id}`} className="flex items-center gap-2 group/item">
                    <div className="w-10 h-14 lg:w-11 lg:h-15 rounded-lg shadow-xl overflow-hidden flex-shrink-0 border border-white/5">
                      <img 
                        src={book?.coverImage || placeholderCover} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-125" 
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-white text-[10px] font-bold line-clamp-2 group-hover/item:text-[#d97642] transition-colors leading-tight mb-1">
                        {book?.title}
                      </p>
                      <p className="text-[#d97642] text-[9px] lg:text-[10px] font-black italic tracking-tighter">
                        ₹{book?.price}.00
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}