import { Link } from "react-router-dom";
import { Search, ArrowRight, Users, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBookStats } from "@/hooks/api/useBooks";

export default function EnhancedHero() {
  const { data: stats, isLoading } = useBookStats();
  
  // Use stats.featured for the hero section to match the optimized homepage fetch
  const featuredBooks = stats?.featured?.slice(0, 3) || [];
  const placeholderCover = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=800&auto=format&fit=crop";

  if (isLoading) {
    return (
      <section className="relative min-h-[65vh] w-full flex items-center overflow-hidden py-6 sm:min-h-[75vh] sm:py-8 lg:min-h-[85vh] lg:py-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(31, 41, 55, 0.85), rgba(31, 41, 55, 0.85)), url("https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Decorative Glow Elements */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-[#F59E0B]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#F59E0B]/5 rounded-full blur-3xl"></div>

        <div className="container-shell relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-center">
            
            {/* LEFT: Text Skeleton */}
            <div className="lg:col-span-7 space-y-3 sm:space-y-4 lg:space-y-5 text-center lg:text-left px-4 sm:px-0">
              {/* Welcome Badge Skeleton */}
              <div className="inline-block">
                <div className="h-8 w-48 bg-gradient-to-r from-[#F59E0B]/30 to-[#F59E0B]/20 rounded-full animate-pulse"></div>
              </div>

              {/* Title Skeleton */}
              <div className="space-y-3">
                <div className="h-12 sm:h-16 lg:h-20 w-full max-w-xl mx-auto lg:mx-0 bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg animate-pulse"></div>
                <div className="h-12 sm:h-16 lg:h-20 w-3/4 max-w-md mx-auto lg:mx-0 bg-gradient-to-r from-[#F59E0B]/40 to-[#F59E0B]/30 rounded-lg animate-pulse"></div>
              </div>

              {/* Description Skeleton */}
              <div className="space-y-2 pt-2">
                <div className="h-5 w-full max-w-xl mx-auto lg:mx-0 bg-gradient-to-r from-gray-700 to-gray-600 rounded animate-pulse"></div>
                <div className="h-5 w-5/6 max-w-lg mx-auto lg:mx-0 bg-gradient-to-r from-gray-700 to-gray-600 rounded animate-pulse"></div>
              </div>

              {/* Buttons Skeleton */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2 sm:pt-3">
                <div className="h-12 sm:h-13 lg:h-14 w-full sm:w-40 bg-gradient-to-r from-[#F59E0B]/40 to-[#F59E0B]/30 rounded-xl animate-pulse"></div>
                <div className="h-12 sm:h-13 lg:h-14 w-full sm:w-40 bg-gradient-to-r from-gray-700 to-gray-600 rounded-xl animate-pulse"></div>
              </div>

              {/* Stats Skeleton */}
              <div className="flex items-center justify-center lg:justify-start gap-4 sm:gap-6 pt-3 sm:pt-4">
                <div className="space-y-2 text-center lg:text-left">
                  <div className="h-8 w-20 bg-gradient-to-r from-[#F59E0B]/40 to-[#F59E0B]/30 rounded animate-pulse"></div>
                  <div className="h-4 w-24 bg-gray-700 rounded animate-pulse"></div>
                </div>
                <div className="w-px h-10 bg-white/20"></div>
                <div className="space-y-2 text-center lg:text-left">
                  <div className="h-8 w-20 bg-gradient-to-r from-[#F59E0B]/40 to-[#F59E0B]/30 rounded animate-pulse"></div>
                  <div className="h-4 w-24 bg-gray-700 rounded animate-pulse"></div>
                </div>
                <div className="w-px h-10 bg-white/20"></div>
                <div className="space-y-2 text-center lg:text-left">
                  <div className="h-8 w-16 bg-gradient-to-r from-[#F59E0B]/40 to-[#F59E0B]/30 rounded animate-pulse"></div>
                  <div className="h-4 w-20 bg-gray-700 rounded animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* RIGHT: Book Skeleton */}
            <div className="lg:col-span-5 relative flex justify-center items-center h-[400px] sm:h-[480px] lg:h-[550px] mt-8 lg:mt-0 px-4 sm:px-0">
              <div className="relative w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[380px] h-full flex items-center justify-center">
                
                {/* Book Skeleton with 3D effect */}
                <div className="relative" style={{ 
                  transform: 'rotateY(-20deg) rotateX(5deg)',
                  transformStyle: 'preserve-3d'
                }}>
                  {/* Back Pages Skeleton */}
                  <div className="absolute inset-0 w-56 h-80 sm:w-64 sm:h-[380px] lg:w-80 lg:h-[480px] rounded-xl bg-gradient-to-r from-gray-200 to-gray-100 animate-pulse" style={{
                    transform: 'translateZ(-25px)'
                  }}></div>

                  {/* Main Book Cover Skeleton */}
                  <div className="relative w-56 h-80 sm:w-64 sm:h-[380px] lg:w-80 lg:h-[480px] bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 rounded-xl animate-pulse shadow-2xl overflow-hidden" style={{
                    transform: 'translateZ(25px)'
                  }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
                    
                    {/* Featured Badge Skeleton */}
                    <div className="absolute top-4 left-4 h-7 w-24 bg-gradient-to-r from-[#F59E0B]/40 to-[#F59E0B]/30 rounded-full animate-pulse"></div>
                    
                    {/* Bottom Info Skeleton */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-5 bg-gradient-to-t from-black/90 to-transparent">
                      <div className="h-5 w-32 bg-gradient-to-r from-[#F59E0B]/40 to-[#F59E0B]/30 rounded mb-2 animate-pulse"></div>
                      <div className="h-4 w-24 bg-gray-600 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>

                {/* Floating Badges Skeleton */}
                <div className="absolute right-0 top-16 sm:top-20 lg:top-24 h-12 w-36 bg-white/10 backdrop-blur-sm rounded-xl animate-pulse"></div>
                <div className="absolute left-0 bottom-20 sm:bottom-24 lg:bottom-28 h-16 w-32 bg-white/10 backdrop-blur-sm rounded-xl animate-pulse"></div>

                {/* Ambient Glow */}
                <div className="absolute inset-0 bg-gradient-radial from-[#F59E0B]/20 via-[#F59E0B]/5 to-transparent rounded-full blur-[120px] -z-10 animate-pulse" style={{ animationDuration: '3s' }}></div>
              </div>
            </div>

          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-[65vh] w-full flex items-center overflow-hidden py-6 sm:min-h-[75vh] sm:py-8 lg:min-h-[85vh] lg:py-0"
      style={{
        backgroundImage: 'linear-gradient(rgba(31, 41, 55, 0.85), rgba(31, 41, 55, 0.85)), url("https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000&auto=format&fit=crop")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Subtle Overlay Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1F2937]/50 via-transparent to-[#1F2937]/50"></div>

      {/* Decorative Glow Elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-[#F59E0B]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#F59E0B]/5 rounded-full blur-3xl"></div>

      <div className="container-shell relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-center">
          
          {/* LEFT: Copywriting & Actions */}
          <div className="lg:col-span-7 space-y-3 sm:space-y-4 lg:space-y-5 text-center lg:text-left px-4 sm:px-0">

            <div className="inline-block animate-fade-in-up">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#F59E0B]/10 rounded-full text-xs sm:text-sm font-semibold text-[#F59E0B] border border-[#F59E0B]/30">
                <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Welcome to BookHive
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.15] sm:leading-[1.1] tracking-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Discover Your Next <br className="hidden sm:block" />
              <span className="relative inline-block font-serif italic text-[#F59E0B] mt-1 sm:mt-2">
                Great Read
                <svg className="absolute -bottom-1 sm:-bottom-1.5 left-0 w-full" viewBox="0 0 300 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 15C50 5 150 5 295 15" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-gray-300 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed px-2 sm:px-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Explore thousands of books across all genres. From bestsellers to hidden gems, 
              find the perfect book that speaks to your soul.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2 sm:pt-3 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <Link to="/books" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-12 sm:h-13 lg:h-14 px-6 sm:px-7 lg:px-8 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-xl text-sm sm:text-base font-semibold group transition-all shadow-lg hover:shadow-xl hover:scale-105">
                  Browse Books
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/books?filter=newArrival" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 sm:h-13 lg:h-14 px-6 sm:px-7 lg:px-8 rounded-xl text-white bg-transparent hover:bg-white/10 text-sm sm:text-base font-semibold border-2 border-white/30 hover:border-white/50 transition-all hover:scale-105">
                  <Search className="mr-2 h-4 w-4" />
                  New Arrivals
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center lg:justify-start gap-4 sm:gap-6 pt-3 sm:pt-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="text-center lg:text-left">
                <p className="text-xl sm:text-2xl font-bold text-[#F59E0B]">10,000+</p>
                <p className="text-[10px] sm:text-xs text-gray-400 font-medium">Books Available</p>
              </div>
              <div className="w-px h-10 bg-white/20"></div>
              <div className="text-center lg:text-left">
                <p className="text-xl sm:text-2xl font-bold text-[#F59E0B]">5,000+</p>
                <p className="text-[10px] sm:text-xs text-gray-400 font-medium">Happy Readers</p>
              </div>
              <div className="w-px h-10 bg-white/20"></div>
              <div className="text-center lg:text-left">
                <p className="text-xl sm:text-2xl font-bold text-[#F59E0B]">50+</p>
                <p className="text-[10px] sm:text-xs text-gray-400 font-medium">Categories</p>
              </div>
            </div>

          </div>

          {/* RIGHT: 3D Book Display */}
          <div className="lg:col-span-5 relative flex justify-center items-center h-[400px] sm:h-[480px] lg:h-[550px] mt-8 lg:mt-0 px-4 sm:px-0">
            
            {/* 3D Book Container with Perspective */}
            <div className="relative w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[380px] h-full flex items-center justify-center animate-fade-in-up" style={{ 
              perspective: '2000px',
              animationDelay: '0.5s' 
            }}>
              
              {/* Main 3D Book Wrapper */}
              <div className="relative group transition-all duration-700 hover:scale-105" style={{ 
                transformStyle: 'preserve-3d',
                transform: 'rotateY(-20deg) rotateX(5deg)',
              }}>
                
                {/* Book Back Cover (White Pages) - Behind but visible */}
                <div className="absolute inset-0 rounded-xl" style={{
                  transformStyle: 'preserve-3d',
                  transform: 'translateZ(-25px)',
                  background: 'linear-gradient(to right, #fafaf9, #f5f5f4, #e7e5e4)',
                  boxShadow: 'inset 0 0 30px rgba(0,0,0,0.1), 0 10px 40px rgba(0,0,0,0.3)'
                }}>
                  {/* Page Lines on Back */}
                  <div className="h-full flex flex-col justify-evenly px-4 py-4">
                    {[...Array(15)].map((_, i) => (
                      <div key={i} className="w-full h-px bg-stone-300/40"></div>
                    ))}
                  </div>
                </div>

                {/* Book Cover (Front) */}
                <div className="relative rounded-xl overflow-hidden shadow-[0_30px_90px_-20px_rgba(0,0,0,0.9)]" style={{
                  transformStyle: 'preserve-3d',
                  transform: 'translateZ(25px)'
                }}>
                  <img 
                    src={featuredBooks[0]?.coverImage || placeholderCover} 
                    loading="eager"
                    crossOrigin="anonymous"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = placeholderCover;
                    }}
                    className="w-56 h-80 sm:w-64 sm:h-[380px] lg:w-80 lg:h-[480px] object-cover"
                    alt={featuredBooks[0]?.title || "Featured book"}
                  />
                  
                  {/* Glossy Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-40 pointer-events-none"></div>
                  
                  {/* Left Edge Shadow (Spine Shadow) */}
                  <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/60 via-black/30 to-transparent pointer-events-none"></div>
                  
                  {/* Featured Badge */}
                  <div className="absolute top-4 left-4 bg-[#F59E0B] text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg z-10 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                    FEATURED
                  </div>
                  
                  {/* Bottom Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-5 bg-gradient-to-t from-black/95 via-black/70 to-transparent">
                     <p className="text-[#F59E0B] font-serif italic text-sm lg:text-base font-semibold mb-1">This Week's Pick</p>
                     <p className="text-white text-xs lg:text-sm opacity-90">Trending Now</p>
                  </div>
                </div>
              </div>

              {/* Floating "Free Preview" Badge - OUTSIDE the book wrapper */}
              <div className="absolute right-0 top-16 sm:top-20 lg:top-24 bg-white p-2.5 sm:p-3 lg:p-3.5 rounded-xl sm:rounded-2xl shadow-2xl flex items-center gap-2 sm:gap-2.5 border-2 border-[#F59E0B]/30 backdrop-blur-sm animate-float" style={{ 
                zIndex: 100,
                animation: 'fadeInUp 0.6s ease-out 0.7s both, float 3s ease-in-out infinite'
              }}>
                <div className="bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] p-1.5 sm:p-2 rounded-full">
                  <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-[#F59E0B]" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-[#1F2937]">Free Preview</p>
                </div>
              </div>

              {/* Floating "Bestseller" Badge - OUTSIDE the book wrapper */}
              <div className="absolute left-0 bottom-20 sm:bottom-24 lg:bottom-28 bg-white p-2.5 sm:p-3 lg:p-3.5 rounded-xl sm:rounded-2xl shadow-2xl flex items-center gap-2 sm:gap-2.5 border-2 border-[#F59E0B]/30 backdrop-blur-sm animate-float" style={{ 
                zIndex: 100,
                animation: 'fadeInUp 0.6s ease-out 0.8s both, float 3s ease-in-out 1.5s infinite'
              }}>
                <div className="bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] p-1.5 sm:p-2 rounded-full">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-[#F59E0B]" />
                </div>
                <div>
                  <p className="text-[9px] sm:text-[10px] text-[#92400E] font-bold uppercase tracking-wide">Bestseller</p>
                  <p className="text-xs sm:text-sm font-bold text-[#1F2937]">5,000+ Sold</p>
                </div>
              </div>

              {/* Enhanced Ambient Glow with Pulse */}
              <div className="absolute inset-0 bg-gradient-radial from-[#F59E0B]/30 via-[#F59E0B]/10 to-transparent rounded-full blur-[120px] -z-10 animate-pulse" style={{ animationDuration: '4s' }}></div>
              
              {/* Floor Reflection/Shadow */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-32 bg-gradient-to-t from-black/20 via-black/5 to-transparent blur-2xl -z-10 rounded-full"></div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
