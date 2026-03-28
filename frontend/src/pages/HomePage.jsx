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
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-50">
      <HeroCarousel />

      {/* Featured Books */}
      {isLoading ? (
        <section className="py-16 sm:py-20 lg:py-24 bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-noise opacity-40"></div>
          <div className="container-shell relative">
            <div className="flex items-center gap-3 mb-10">
              <Sparkles className="w-6 h-6 text-stone-200 animate-pulse" />
              <div className="h-10 w-56 bg-stone-100 rounded animate-pulse"></div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {[...Array(4)].map((_, i) => (
                <BookSkeleton key={i} />
              ))}
            </div>
            <p className="mt-12 text-center text-sm text-stone-400 italic font-light">
              Curating your perfect collection...
            </p>
          </div>
        </section>
      ) : featuredBooks.length > 0 && (
        <section className="py-16 sm:py-20 lg:py-24 bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-noise opacity-40"></div>
          <div className="container-shell relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="w-6 h-6 text-amber-600" />
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-stone-900 tracking-tight">
                    Featured Collection
                  </h2>
                </div>
                <p className="text-stone-600 text-sm sm:text-base font-light mt-2">
                  Handpicked titles curated by our literary experts
                </p>
              </div>
              <Link to="/books?filter=featured">
                <Button 
                  variant="ghost" 
                  size="lg" 
                  className="text-amber-700 hover:text-amber-800 hover:bg-amber-50 font-medium group transition-smooth"
                >
                  View All
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {featuredBooks.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Blog Section - Stories & Insights */}
      {blogsLoading ? (
        <section className="py-16 sm:py-20 lg:py-24 bg-stone-50">
          <div className="container-shell">
            <div className="flex flex-col items-center mb-14">
              <div className="h-12 w-72 bg-stone-200 rounded animate-pulse mb-4"></div>
              <div className="h-5 w-96 bg-stone-100 rounded animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-[420px] bg-white rounded-2xl shadow-soft animate-pulse"></div>
              ))}
            </div>
          </div>
        </section>
      ) : blogs.length > 0 && (
        <section className="py-16 sm:py-20 lg:py-24 bg-stone-50 relative">
          <div className="absolute inset-0 bg-texture opacity-30"></div>
          <div className="container-shell relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-14 gap-4">
              <div className="flex flex-col items-start max-w-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <PenLine className="w-6 h-6 text-amber-700" />
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-stone-900 tracking-tight">
                    Literary Journal
                  </h2>
                </div>
                <p className="text-stone-600 text-base sm:text-lg font-light leading-relaxed">
                  Thoughtful essays, author interviews, and deep dives into the world of books
                </p>
              </div>
              <Link to="/blog">
                <Button 
                  variant="ghost" 
                  size="lg" 
                  className="text-amber-700 hover:text-amber-800 hover:bg-amber-50 font-medium group transition-smooth"
                >
                  All Articles
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <Link key={blog._id} to={`/blog/${blog._id}`} className="group">
                  <Card className="h-full bg-white border border-stone-200 hover:border-amber-300 transition-smooth hover:shadow-medium hover:-translate-y-2 overflow-hidden">
                    {blog.coverImage && (
                      <div className="relative h-56 overflow-hidden bg-stone-100">
                        <img 
                          src={blog.coverImage} 
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                        <div className="absolute bottom-4 left-4">
                          <span className="inline-block px-4 py-1.5 bg-amber-600 text-white text-xs font-semibold rounded-full uppercase tracking-wider">
                            {blog.category || "Article"}
                          </span>
                        </div>
                      </div>
                    )}
                    <CardContent className="p-6">
                      <h3 className="text-xl font-display font-bold text-stone-900 mb-3 line-clamp-2 group-hover:text-amber-700 transition-colors leading-tight">
                        {blog.title}
                      </h3>
                      <p className="text-stone-600 text-sm leading-relaxed mb-5 line-clamp-3 font-light">
                        {blog.excerpt || blog.content?.substring(0, 120) + "..."}
                      </p>
                      <div className="flex items-center justify-between text-xs text-stone-500 pt-4 border-t border-stone-100">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5" />
                          <span className="font-medium">{blog.author?.name || "BookHive"}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </div>
                      </div>
                      <div className="mt-5 flex items-center text-amber-700 font-semibold text-sm group-hover:text-amber-800">
                        <span>Continue Reading</span>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
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
        <section className="py-16 sm:py-20 lg:py-24 bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-noise opacity-40"></div>
          <div className="container-shell relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <BookOpen className="w-6 h-6 text-amber-600" />
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-stone-900 tracking-tight">
                    Fresh Arrivals
                  </h2>
                </div>
                <p className="text-stone-600 text-sm sm:text-base font-light mt-2">
                  The latest additions to our ever-growing collection
                </p>
              </div>
              <Link to="/books?filter=newArrival">
                <Button 
                  variant="ghost" 
                  size="lg" 
                  className="text-amber-700 hover:text-amber-800 hover:bg-amber-50 font-medium group transition-smooth"
                >
                  Explore New
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {newArrivals.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
