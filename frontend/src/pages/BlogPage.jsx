import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useBlogCategories } from "@/hooks/api/useBlogs";
import { useInfiniteBlogs } from "@/hooks/api/useInfiniteBlogs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BlogSkeleton from "@/components/common/BlogSkeleton";
import { Search, Clock, Eye, Calendar, TrendingUp, Sparkles, BookOpen } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 9;

// Featured Blog Card - Large Hero Style
function FeaturedBlogCard({ blog }) {
  return (
    <Link 
      to={`/blog/${blog._id}`} 
      className="group block col-span-full lg:col-span-2 row-span-2"
    >
      <div className="relative h-full min-h-[500px] rounded-3xl overflow-hidden bg-gray-900">
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
        
        <div className="absolute inset-0 p-8 flex flex-col justify-end">
          <div className="mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#d97642]/90 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              Featured
            </span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight group-hover:text-[#deb05a] transition-colors">
            {blog.title}
          </h2>
          
          <p className="text-white/90 text-lg mb-6 line-clamp-2 max-w-2xl">
            {blog.excerpt}
          </p>
          
          <div className="flex items-center gap-6 text-white/80 text-sm">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(blog.createdAt).toLocaleDateString("en-IN", { 
                day: "numeric", 
                month: "short", 
                year: "numeric" 
              })}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {blog.readTime} min read
            </span>
            <span className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              {blog.views} views
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Regular Blog Card - Magazine Style
function BlogCard({ blog, variant = "default" }) {
  const isLarge = variant === "large";
  
  return (
    <Link 
      to={`/blog/${blog._id}`} 
      className={cn(
        "group block h-full",
        isLarge && "lg:col-span-2"
      )}
    >
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 h-full flex flex-col">
        <div className={cn(
          "relative overflow-hidden",
          isLarge ? "aspect-[16/9]" : "aspect-[4/3]"
        )}>
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm text-[#d97642] text-xs font-bold uppercase tracking-wider">
              {blog.category}
            </span>
          </div>
        </div>
        
        <div className={cn("p-6 flex flex-col flex-1", isLarge && "lg:p-8")}>
          <h3 className={cn(
            "font-bold text-gray-900 leading-tight mb-3 group-hover:text-[#d97642] transition-colors line-clamp-2",
            isLarge ? "text-2xl lg:text-3xl" : "text-xl"
          )}>
            {blog.title}
          </h3>
          
          <p className={cn(
            "text-gray-600 leading-relaxed line-clamp-2 flex-1 mb-4",
            isLarge ? "text-base" : "text-sm"
          )}>
            {blog.excerpt}
          </p>
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {blog.readTime}m
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                {blog.views}
              </span>
            </div>
            <span className="text-xs text-gray-400">
              {new Date(blog.createdAt).toLocaleDateString("en-IN", { 
                month: "short", 
                day: "numeric" 
              })}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function BlogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const loadMoreRef = useRef(null);

  const debouncedSearch = useDebounce(searchQuery, 500);

  const params = {
    limit: ITEMS_PER_PAGE,
  };
  if (debouncedSearch) params.q = debouncedSearch;
  if (category) params.category = category;

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteBlogs(params);

  const { data: categories = [] } = useBlogCategories();

  const blogs = data?.pages.flatMap(page => page.blogs || []) || [];
  const total = data?.pages[0]?.total || 0;
  
  const hasActiveFilters = Boolean(searchQuery || category);
  
  // Separate featured and regular blogs only when no filters are active
  const shouldShowFeatured = !hasActiveFilters && blogs.some(blog => blog.featured);
  const mainFeatured = shouldShowFeatured ? blogs.find(blog => blog.featured) : null;
  const otherBlogs = mainFeatured ? blogs.filter(blog => blog._id !== mainFeatured._id) : blogs;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const updateURL = ({ q, category: nextCategory }) => {
    const nextParams = {};
    if (q) nextParams.q = q;
    if (nextCategory) nextParams.category = nextCategory;
    setSearchParams(nextParams);
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    updateURL({ q: searchQuery, category: newCategory });
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setCategory("");
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Elegant Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-shell py-8 md:py-12">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4 tracking-tight">
              The BookHive <span className="text-[#d97642] italic font-serif">Chronicle</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Curated stories, insights, and conversations from the world of books and literature
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search articles, authors, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 pl-14 pr-6 rounded-full border-gray-300 bg-gray-50 text-base focus:bg-white focus:border-[#d97642] focus:ring-[#d97642]/20 shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="container-shell">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3 overflow-x-auto pb-1 flex-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <style>{`
                .overflow-x-auto::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              <button
                onClick={() => handleCategoryChange("")}
                className={cn(
                  "px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all",
                  category === ""
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                )}
              >
                All Stories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={cn(
                    "px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all",
                    category === cat
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-2 ml-4">
              <span className="text-sm text-gray-500 hidden md:block">{total} articles</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container-shell py-8 md:py-12">
        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className="animate-fade-in-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <BlogSkeleton />
              </div>
            ))}
          </div>
        )}

        {/* Content */}
        {!isLoading && blogs.length > 0 && (
          <>
            {/* Featured Section - Only show if there's a featured blog and no filters */}
            {mainFeatured && (
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <TrendingUp className="w-5 h-5 text-[#d97642]" />
                  <h2 className="text-2xl font-bold text-gray-900">Featured Story</h2>
                </div>
                <div className="animate-fade-in-up">
                  <FeaturedBlogCard blog={mainFeatured} />
                </div>
              </div>
            )}

            {/* Latest Articles Section */}
            {otherBlogs.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {hasActiveFilters ? "Search Results" : "Latest Articles"}
                  </h2>
                  {hasActiveFilters && (
                    <Button
                      onClick={handleClearFilters}
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>

                {/* Two Column Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {otherBlogs.map((blog, index) => (
                    <div 
                      key={blog._id}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${(index % 6) * 30}ms` }}
                    >
                      <BlogCard blog={blog} variant="default" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Load More */}
            {hasNextPage && (
              <div ref={loadMoreRef} className="flex justify-center mt-8 mb-4">
                {isFetchingNextPage && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
                        <BlogSkeleton />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* End Message */}
            {!hasNextPage && blogs.length > 0 && (
              <div className="mt-12 text-center">
                <p className="text-sm text-gray-500">
                  You've reached the end of articles
                </p>
              </div>
            )}
          </>
        )}

        {/* No Results */}
        {!isLoading && blogs.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
              <BookOpen className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No articles found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              We couldn't find any articles matching your criteria. Try adjusting your search or filters.
            </p>
            {hasActiveFilters && (
              <Button
                onClick={handleClearFilters}
                className="rounded-full bg-gray-900 hover:bg-gray-800 text-white px-8"
              >
                Clear All Filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
