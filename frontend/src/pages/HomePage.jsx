import { useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useBookStats } from "@/hooks/api/useBooks";
import { useBlogsList } from "@/hooks/api/useBlogs";
import BookCard from "@/components/common/BookCard";
import BookSkeleton from "@/components/common/BookSkeleton";
import HeroCarousel from "@/components/home/HeroCarousel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BookOpen, Sparkles, PenLine, Calendar, User } from "lucide-react";

export default function HomePage() {
  const { user } = useSelector((state) => state.auth);
  const { data: stats, isLoading } = useBookStats();
  const { data: blogsData, isLoading: blogsLoading } = useBlogsList({ limit: 3 });

  const featuredBooks = useMemo(() => stats?.featured ?? [], [stats]);
  const newArrivals = useMemo(() => stats?.newArrivals ?? [], [stats]);
  const blogs = useMemo(() => blogsData?.blogs ?? [], [blogsData]);

  return (
    <div className="min-h-screen bg-white">
      <HeroCarousel />

      {/* Featured Books */}
      {isLoading ? (
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

      {/* Blog Section - Stories & Insights */}
      {blogsLoading ? (
        <section className="py-12 bg-white">
          <div className="container-shell">
            <div className="flex flex-col items-center mb-12">
              <div className="h-10 w-64 bg-gray-100 rounded animate-pulse mb-4"></div>
              <div className="h-4 w-96 bg-gray-50 rounded animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-96 bg-gray-100 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
        </section>
      ) : blogs.length > 0 && (
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="container-shell">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 sm:mb-12 gap-4">
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-2 mb-3">
                  <PenLine className="w-5 h-5 sm:w-6 sm:h-6 text-[#D97706]" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2937]">Stories & Insights</h2>
                </div>
                <p className="text-gray-600 text-sm sm:text-base">
                  Dive into the world of literature with our curated articles, reviews, and bookish musings
                </p>
              </div>
              <Link to="/blog">
                <Button variant="ghost" size="sm" className="text-sm sm:text-base text-[#F59E0B] hover:text-[#D97706] hover:bg-[#FEF3C7]">
                  View All
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {blogs.map((blog) => (
                <Link key={blog._id} to={`/blog/${blog._id}`}>
                  <Card className="group h-full bg-white border border-gray-200 hover:border-[#D97706] transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden">
                    {blog.coverImage && (
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={blog.coverImage} 
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute bottom-3 left-3 right-3">
                          <span className="inline-block px-3 py-1 bg-[#F59E0B] text-white text-xs font-semibold rounded-full">
                            {blog.category || "Article"}
                          </span>
                        </div>
                      </div>
                    )}
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-[#1F2937] mb-3 line-clamp-2 group-hover:text-[#D97706] transition-colors">
                        {blog.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {blog.excerpt || blog.content?.substring(0, 120) + "..."}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{blog.author?.name || "BookHive"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center text-[#D97706] font-semibold text-sm">
                        <span>Read More</span>
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {!isLoading && newArrivals.length > 0 && (
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
