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
      <section className="relative min-h-[65vh] w-full flex items-center overflow-hidden py-6 sm:min-h-[75vh] sm:py-8 lg:min-h-[85vh] lg:py-0 bg-[#1F2937]">
        <div className="container-shell relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="h-8 w-48 bg-gray-700 rounded-full animate-pulse"></div>
              <div className="space-y-3">
                <div className="h-16 w-3/4 bg-gray-800 rounded-lg animate-pulse"></div>
                <div className="h-16 w-1/2 bg-gray-800 rounded-lg animate-pulse"></div>
              </div>
              <div className="h-20 w-full bg-gray-800 rounded-lg animate-pulse"></div>
              <div className="flex gap-4">
                <div className="h-14 w-40 bg-[#F59E0B]/20 rounded-xl animate-pulse"></div>
                <div className="h-14 w-40 bg-gray-700 rounded-xl animate-pulse"></div>
              </div>
            </div>
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-72 h-[420px] bg-gray-800 rounded-xl animate-pulse shadow-2xl border-4 border-gray-700"></div>
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

            <div className="inline-block">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#F59E0B]/10 rounded-full text-xs sm:text-sm font-semibold text-[#F59E0B] border border-[#F59E0B]/30">
                <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Welcome to BookHive
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.15] sm:leading-[1.1] tracking-tight">
              Discover Your Next <br className="hidden sm:block" />
              <span className="relative inline-block font-serif italic text-[#F59E0B] mt-1 sm:mt-2">
                Great Read
                <svg className="absolute -bottom-1 sm:-bottom-1.5 left-0 w-full" viewBox="0 0 300 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 15C50 5 150 5 295 15" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-gray-300 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed px-2 sm:px-0">
              Explore thousands of books across all genres. From bestsellers to hidden gems, 
              find the perfect book that speaks to your soul.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2 sm:pt-3">
              <Link to="/books" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-12 sm:h-13 lg:h-14 px-6 sm:px-7 lg:px-8 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-xl text-sm sm:text-base font-semibold group transition-all shadow-lg hover:shadow-xl">
                  Browse Books
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/books?filter=newArrival" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 sm:h-13 lg:h-14 px-6 sm:px-7 lg:px-8 rounded-xl text-white bg-transparent hover:bg-white/10 text-sm sm:text-base font-semibold border-2 border-white/30 hover:border-white/50 transition-all">
                  <Search className="mr-2 h-4 w-4" />
                  New Arrivals
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center lg:justify-start gap-4 sm:gap-6 pt-3 sm:pt-4">
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

          {/* RIGHT: Visual Stack & Floating UI */}
          <div className="lg:col-span-5 relative flex justify-center items-center h-[380px] sm:h-[420px] lg:h-[500px] mt-6 lg:mt-0">
            
            {/* Main Interactive Book Stack */}
            <div className="group relative w-full h-full flex items-center justify-center">
              
              {/* Back Book - Hidden on small mobile */}
              <div className="hidden sm:block absolute transform -translate-x-10 sm:-translate-x-14 lg:-translate-x-16 -rotate-[10deg] sm:-rotate-[12deg] transition-all duration-700 group-hover:-translate-x-24 sm:group-hover:-translate-x-36 lg:group-hover:-translate-x-40 group-hover:-rotate-[20deg] sm:group-hover:-rotate-[25deg]">
                <div className="relative">
                  <img 
                    src={featuredBooks[2]?.coverImage || placeholderCover} 
                    loading="lazy"
                    className="w-36 h-52 sm:w-44 sm:h-64 lg:w-48 lg:h-72 object-cover rounded-lg shadow-2xl border-4 border-white/20"
                    alt="Back book"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
                </div>
              </div>
              
              {/* Middle Book */}
              <div className="hidden sm:block absolute transform translate-x-10 sm:translate-x-14 lg:translate-x-16 rotate-[10deg] sm:rotate-[12deg] transition-all duration-700 group-hover:translate-x-24 sm:group-hover:translate-x-36 lg:group-hover:translate-x-40 group-hover:rotate-[20deg] sm:group-hover:rotate-[25deg] z-10">
                <div className="relative">
                  <img 
                    src={featuredBooks[1]?.coverImage || placeholderCover} 
                    loading="lazy"
                    className="w-40 h-56 sm:w-48 sm:h-68 lg:w-52 lg:h-76 object-cover rounded-lg shadow-2xl border-4 border-white/20"
                    alt="Middle book"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
                </div>
              </div>

              {/* Front Book - Main Featured */}
              <div className="relative z-20 transform transition-all duration-700 group-hover:scale-110">
                <div className="relative overflow-hidden rounded-xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8)] border-[6px] border-white">
                   <img 
                    src={featuredBooks[0]?.coverImage || placeholderCover} 
                    loading="lazy"
                    className="w-52 h-76 sm:w-60 sm:h-[340px] lg:w-72 lg:h-[420px] object-cover"
                    alt="Featured book"
                  />
                  {/* Book Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  
                  {/* Featured Badge */}
                  <div className="absolute top-4 left-4 bg-[#F59E0B] text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    FEATURED
                  </div>
                  
                  {/* Bottom Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                     <p className="text-[#F59E0B] font-serif italic text-sm font-semibold mb-1">This Week's Pick</p>
                     <p className="text-white text-xs opacity-90">Trending Now</p>
                  </div>
                </div>
                
                {/* Floating "Bestseller" Badge */}
                <div className="absolute -left-8 sm:-left-12 lg:-left-14 bottom-8 sm:bottom-10 lg:bottom-12 bg-white p-3 sm:p-4 rounded-2xl shadow-2xl flex items-center gap-2 sm:gap-3 border-2 border-[#F59E0B]/30 backdrop-blur-sm">
                  <div className="bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] p-2 rounded-full">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-[#F59E0B]" />
                  </div>
                  <div>
                    <p className="text-[9px] sm:text-[10px] text-[#92400E] font-bold uppercase tracking-wide">Bestseller</p>
                    <p className="text-xs sm:text-sm font-bold text-[#1F2937]">5,000+ Sold</p>
                  </div>
                </div>

                 {/* Floating "Free Sample" Badge */}
                 <div className="absolute -right-6 sm:-right-8 lg:-right-10 top-8 sm:top-10 lg:top-12 bg-white p-3 sm:p-4 rounded-2xl shadow-2xl flex items-center gap-2 sm:gap-3 border-2 border-[#F59E0B]/30 backdrop-blur-sm">
                  <div className="bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] p-2 rounded-full">
                    <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-[#F59E0B]" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-[#1F2937]">Free Preview</p>
                  </div>
                </div>
              </div>

              {/* Ambient Glow */}
              <div className="absolute inset-0 bg-gradient-radial from-[#F59E0B]/20 via-transparent to-transparent rounded-full blur-[100px] -z-10" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
