import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchStatsBooks } from "@/store/slices/booksSlice";
import BookCard from "@/components/common/BookCard";
import BookSkeleton from "@/components/common/BookSkeleton";
import HeroCarousel from "@/components/home/HeroCarousel";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Truck, ShieldCheck, Zap, Sparkles } from "lucide-react";

export default function HomePage() {
  const dispatch = useDispatch();
  const { stats, status } = useSelector((state) => state.books);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchStatsBooks());
  }, [dispatch]);

  const featuredBooks = useMemo(() => stats.featured, [stats]);
  const bestsellers = useMemo(() => stats.bestsellers, [stats]);
  const newArrivals = useMemo(() => stats.newArrivals, [stats]);

  return (
    <div className="min-h-screen bg-white">
      <HeroCarousel />

      {/* Featured Books */}
      {status === "loading" ? (
        <section className="py-10 sm:py-12 lg:py-16 bg-[#F9FAFB]">
          <div className="container-shell">
            <div className="flex items-center gap-2 mb-8">
              <Sparkles className="w-6 h-6 text-gray-200 animate-pulse" />
              <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <BookSkeleton key={i} />
              ))}
            </div>
            {/* Friendly message for cold starts */}
            <p className="mt-8 text-center text-sm text-gray-400 italic">
              Our servers are waking up, please wait a moment...
            </p>
          </div>
        </section>
      ) : featuredBooks.length > 0 && (
        <section className="py-10 sm:py-12 lg:py-16 bg-[#F9FAFB]">
          <div className="container-shell">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-3 sm:gap-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-[#F59E0B]" />
                <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2937]">Featured Books</h2>
              </div>
              <Link to="/books?filter=featured">
                <Button variant="ghost" size="sm" className="text-sm sm:text-base text-[#F59E0B] hover:text-[#D97706] hover:bg-[#FEF3C7]">View All</Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
              {featuredBooks.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bestsellers - Classic Design */}
      {status === "loading" ? (
        <section className="py-12 bg-white">
          <div className="container-shell">
            <div className="flex flex-col items-center mb-12">
              <div className="h-10 w-64 bg-gray-100 rounded animate-pulse mb-4"></div>
              <div className="h-4 w-96 bg-gray-50 rounded animate-pulse"></div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <BookSkeleton key={i} />
              ))}
            </div>
          </div>
        </section>
      ) : bestsellers.length > 0 && (
        <section className="py-12 sm:py-16 lg:py-20 bg-[#FAF9F6] border-y border-[#E5E5E5] relative">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2378350f' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`}}></div>
          <div className="container-shell relative z-10">
            <div className="flex flex-col items-center justify-center mb-10 sm:mb-12 text-center">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="h-[1px] w-12 sm:w-24 bg-[#D97706]"></div>
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-[#D97706]" />
                <div className="h-[1px] w-12 sm:w-24 bg-[#D97706]"></div>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#451a03] tracking-tight">
                Our Best Sellers
              </h2>
              <p className="text-gray-600 mt-4 max-w-2xl font-serif italic text-lg sm:text-xl text-[#78350F]">
                Discover the most celebrated and beloved books chosen by our readers.
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
              {bestsellers.map((book) => (
                <div key={book._id} className="transform transition-transform duration-300 hover:-translate-y-2">
                  <BookCard book={book} />
                </div>
              ))}
            </div>
            
            <div className="mt-10 sm:mt-12 flex justify-center">
              <Link to="/books?filter=bestseller">
                <Button className="bg-[#78350F] hover:bg-[#92400E] text-[#FEF3C7] h-12 px-8 rounded-sm shadow-md font-serif text-lg transition-all hover:shadow-lg uppercase tracking-wide">
                  Explore All Best Sellers
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {status === "loading" ? null : newArrivals.length > 0 && (
        <section className="py-10 sm:py-12 lg:py-16 bg-[#F9FAFB]">
          <div className="container-shell">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-3 sm:gap-0">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-[#F59E0B]" />
                <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2937]">New Arrivals</h2>
              </div>
              <Link to="/books?filter=newArrival">
                <Button variant="ghost" size="sm" className="text-sm sm:text-base text-[#F59E0B] hover:text-[#D97706] hover:bg-[#FEF3C7]">View All</Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
              {newArrivals.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-12 sm:py-14 lg:py-16 bg-[#1F2937] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        <div className="container-shell text-center px-4 relative z-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Start Your Reading Journey Today</h2>
          <p className="text-base sm:text-lg mb-6 sm:mb-8 text-gray-300 max-w-2xl mx-auto">
            {user 
              ? "Welcome back! Ready to find your next favorite story?" 
              : "Join thousands of book lovers and discover your next great read"}
          </p>
          <Link to={user ? "/books" : "/register"}>
            <Button size="lg" className="bg-[#F59E0B] text-white hover:bg-[#D97706] h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all">
              {user ? "Explore the Catalog" : "Sign Up Now"}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
