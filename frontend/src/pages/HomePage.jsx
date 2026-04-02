import { useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useBookStats } from "@/hooks/api/useBooks";
import { useBlogsList } from "@/hooks/api/useBlogs";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import BookCard from "@/components/common/BookCard";
import BookSkeleton from "@/components/common/BookSkeleton";
import HeroCarousel from "@/components/home/HeroCarousel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BookOpen, Sparkles, PenLine, Calendar, User, Shield, Truck, RotateCcw, Star, Quote, Heart, Zap } from "lucide-react";

export default function HomePage() {
  const { user } = useSelector((state) => state.auth);
  const { data: stats, isLoading } = useBookStats();
  const { data: blogsData, isLoading: blogsLoading } = useBlogsList({ limit: 3 });

  const featuredBooks = useMemo(() => stats?.featured ?? [], [stats]);
  const newArrivals = useMemo(() => stats?.newArrivals ?? [], [stats]);
  const blogs = useMemo(() => blogsData?.blogs ?? [], [blogsData]);

  // Scroll animation refs
  const [featuredRef, featuredVisible] = useScrollAnimation();
  const [blogsRef, blogsVisible] = useScrollAnimation();
  const [arrivalsRef, arrivalsVisible] = useScrollAnimation();
  const [testimonialsRef, testimonialsVisible] = useScrollAnimation();
  const [whyUsRef, whyUsVisible] = useScrollAnimation();

  // Sample data for testimonials
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Book Enthusiast",
      content: "BookHive has completely transformed my reading experience. The curated collections are amazing and delivery is always on time!",
      rating: 5,
      avatar: "PS"
    },
    {
      name: "Rahul Verma",
      role: "Student",
      content: "Best prices I've found online! The quality of books is excellent and customer service is top-notch.",
      rating: 5,
      avatar: "RV"
    },
    {
      name: "Anjali Patel",
      role: "Teacher",
      content: "I love the variety of books available. From classics to latest releases, BookHive has it all. Highly recommended!",
      rating: 5,
      avatar: "AP"
    }
  ];

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,rgba(255,255,255,0.45),rgba(247,245,239,0.96))]">
      <HeroCarousel />

      {/* Featured Books */}
      {isLoading ? (
        <section className="relative overflow-hidden bg-white/70 py-16 sm:py-20 lg:py-24">
          <div className="absolute inset-0 bg-noise opacity-40"></div>
          <div className="container-shell relative">
            <div className="flex items-center gap-3 mb-10 animate-fade-in-up">
              <Sparkles className="h-6 w-6 animate-pulse text-[#0b7a71]" />
              <div className="h-10 w-56 bg-gradient-to-r from-stone-200 to-stone-100 rounded-lg animate-pulse"></div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <BookSkeleton />
                </div>
              ))}
            </div>
            <p className="mt-12 text-center text-sm text-stone-400 italic font-light animate-pulse">
              Curating your perfect collection...
            </p>
          </div>
        </section>
      ) : featuredBooks.length > 0 && (
        <section ref={featuredRef} className="relative overflow-hidden bg-white/70 py-16 sm:py-20 lg:py-24">
          <div className="absolute inset-0 bg-noise opacity-40"></div>
          <div className="container-shell relative">
            <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4 transition-all duration-700 ${featuredVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="h-6 w-6 animate-float text-[#0b7a71]" />
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight">
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
                  className="group font-medium text-[#0b7a71] transition-smooth hover:bg-[#edf7f4] hover:text-[#095f59]"
                >
                  View All
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
              {featuredBooks.slice(0, 8).map((book, index) => (
                <div 
                  key={book._id} 
                  className={`transition-all duration-700 ${featuredVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <BookCard book={book} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Blog Section - Stories & Insights */}
      {blogsLoading ? (
        <section className="bg-[#f7f5ef]/80 py-16 sm:py-20 lg:py-24">
          <div className="container-shell">
            <div className="flex flex-col items-center mb-14 animate-fade-in-up">
              <div className="h-12 w-72 bg-gradient-to-r from-stone-200 to-stone-100 rounded-lg animate-pulse mb-4"></div>
              <div className="h-5 w-96 max-w-full bg-gradient-to-r from-stone-150 to-stone-100 rounded-lg animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div 
                  key={i} 
                  className="animate-fade-in-up" 
                  style={{ animationDelay: `${i * 0.15}s` }}
                >
                  <div className="h-[420px] bg-white rounded-2xl shadow-soft overflow-hidden">
                    <div className="h-56 bg-gradient-to-br from-stone-200 via-stone-100 to-stone-200 animate-pulse relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="h-6 bg-gradient-to-r from-stone-200 to-stone-100 rounded-md w-full"></div>
                      <div className="h-6 bg-gradient-to-r from-stone-200 to-stone-100 rounded-md w-3/4"></div>
                      <div className="space-y-2 pt-2">
                        <div className="h-4 bg-gradient-to-r from-stone-150 to-stone-100 rounded w-full"></div>
                        <div className="h-4 bg-gradient-to-r from-stone-150 to-stone-100 rounded w-5/6"></div>
                        <div className="h-4 bg-gradient-to-r from-stone-150 to-stone-100 rounded w-4/6"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : blogs.length > 0 && (
        <section ref={blogsRef} className="relative bg-[#f7f5ef]/80 py-16 sm:py-20 lg:py-24">
          <div className="absolute inset-0 bg-texture opacity-30"></div>
          <div className="container-shell relative">
            <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between mb-14 gap-4 transition-all duration-700 ${blogsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="flex flex-col items-start max-w-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <PenLine className="h-6 w-6 animate-float text-[#0b7a71]" />
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight">
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
                  className="group font-medium text-[#0b7a71] transition-smooth hover:bg-[#edf7f4] hover:text-[#095f59]"
                >
                  All Articles
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogs.map((blog, index) => (
                <Link 
                  key={blog._id} 
                  to={`/blog/${blog._id}`} 
                  className={`group transition-all duration-700 ${blogsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <Card className="h-full overflow-hidden border border-[#d7e4df] bg-white/90 transition-smooth hover:-translate-y-2 hover:border-[#a6d5cb] hover:shadow-medium">
                    {blog.coverImage && (
                      <div className="relative h-56 overflow-hidden bg-stone-100">
                        <img 
                          src={blog.coverImage} 
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                        <div className="absolute bottom-4 left-4">
                          <span className="inline-block rounded-full bg-[#f4e6c8] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#9d6e1c]">
                            {blog.category || "Article"}
                          </span>
                        </div>
                      </div>
                    )}
                    <CardContent className="p-6">
                      <h3 className="mb-3 line-clamp-2 text-xl font-bold leading-tight text-stone-900 transition-colors group-hover:text-[#0b7a71]">
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
                      <div className="mt-5 flex items-center text-sm font-semibold text-[#0b7a71] group-hover:text-[#095f59]">
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
        <section ref={arrivalsRef} className="relative overflow-hidden bg-white/70 py-16 sm:py-20 lg:py-24">
          <div className="absolute inset-0 bg-noise opacity-40"></div>
          <div className="container-shell relative">
            <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4 transition-all duration-700 ${arrivalsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <BookOpen className="h-6 w-6 animate-float text-[#0b7a71]" />
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight">
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
                  className="group font-medium text-[#0b7a71] transition-smooth hover:bg-[#edf7f4] hover:text-[#095f59]"
                >
                  Explore New
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
              {newArrivals.slice(0, 4).map((book, index) => (
                <div 
                  key={book._id} 
                  className={`transition-all duration-700 ${arrivalsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <BookCard book={book} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section ref={whyUsRef} className="relative bg-white/70 py-16 sm:py-20 lg:py-24">
        <div className="container-shell">
          <div className={`text-center mb-12 transition-all duration-700 ${whyUsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 mb-4">
              Why Choose BookHive?
            </h2>
            <p className="text-stone-600 text-base sm:text-lg max-w-2xl mx-auto">
              Your trusted partner for all your reading needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              {
                icon: Shield,
                title: "100% Authentic",
                description: "All books are genuine and sourced directly from publishers",
                color: "text-green-600",
                bg: "bg-green-50"
              },
              {
                icon: Truck,
                title: "Fast Delivery",
                description: "Free shipping on orders above ₹499. Delivered within 3-5 days",
                color: "text-blue-600",
                bg: "bg-blue-50"
              },
              {
                icon: RotateCcw,
                title: "Easy Returns",
                description: "7-day return policy. No questions asked if you're not satisfied",
                color: "text-purple-600",
                bg: "bg-purple-50"
              },
              {
                icon: Zap,
                title: "Best Prices",
                description: "Competitive pricing with regular deals and discounts",
                color: "text-orange-600",
                bg: "bg-orange-50"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className={`group transition-all duration-700 ${whyUsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <Card className="h-full border-2 border-gray-100 hover:border-[#0b7a71] transition-all hover:shadow-xl hover:-translate-y-2">
                  <CardContent className="p-6 sm:p-8">
                    <div className={`w-14 h-14 rounded-xl ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <feature.icon className={`w-7 h-7 ${feature.color}`} />
                    </div>
                    <h3 className="font-bold text-xl text-stone-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-stone-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section ref={testimonialsRef} className="relative bg-gradient-to-br from-[#f7f5ef] to-[#eef0ec] py-16 sm:py-20 lg:py-24">
        <div className="container-shell">
          <div className={`text-center mb-12 transition-all duration-700 ${testimonialsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="w-6 h-6 text-red-500 fill-red-500" />
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900">
                What Our Readers Say
              </h2>
            </div>
            <p className="text-stone-600 text-base sm:text-lg max-w-2xl mx-auto">
              Real stories from our amazing community
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`transition-all duration-700 ${testimonialsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <Card className="h-full border-2 border-gray-100 hover:border-[#0b7a71] transition-all hover:shadow-xl">
                  <CardContent className="p-6 sm:p-8">
                    <Quote className="w-10 h-10 text-[#0b7a71] opacity-20 mb-4" />
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-stone-700 text-sm sm:text-base leading-relaxed mb-6 italic">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0b7a71] to-[#0d8a7f] flex items-center justify-center text-white font-bold">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-bold text-stone-900">{testimonial.name}</div>
                        <div className="text-sm text-stone-600">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

