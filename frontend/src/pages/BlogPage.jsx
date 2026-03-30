import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useBlogCategories } from "@/hooks/api/useBlogs";
import { useInfiniteBlogs } from "@/hooks/api/useInfiniteBlogs";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BlogSkeleton from "@/components/common/BlogSkeleton";
import { Search, Clock, Eye, Calendar, X, Loader2, ChevronRight } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

const ITEMS_PER_PAGE = 9;

function BlogCard({ blog, isVisible, delay }) {
  return (
    <Link 
      to={`/blog/${blog._id}`} 
      className={`group block h-full transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 h-full flex flex-col">
        {/* Image Container */}
        <div className="relative overflow-hidden aspect-[4/3]">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {blog.featured && (
            <span className="absolute top-4 left-4 bg-gray-900/90 backdrop-blur-sm text-white text-[10px] uppercase tracking-widest font-semibold px-3 py-1.5 rounded-full">
              Featured
            </span>
          )}
        </div>
        
        {/* Content */}
        <div className="p-6 flex flex-col flex-1">
          <div className="mb-4">
            <span className="text-amber-600 text-xs font-bold uppercase tracking-wider">
              {blog.category}
            </span>
          </div>
          
          <h3 className="font-bold text-gray-900 text-xl leading-tight mb-3 group-hover:text-amber-600 transition-colors line-clamp-2">
            {blog.title}
          </h3>
          
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 flex-1 mb-6">
            {blog.excerpt}
          </p>
          
          {/* Meta Info */}
          <div className="flex items-center justify-between text-xs text-gray-400 font-medium mt-auto pt-4 border-t border-gray-50">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(blog.createdAt).toLocaleDateString("en-IN", { 
                day: "numeric", 
                month: "short", 
                year: "numeric" 
              })}
            </span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {blog.readTime} min
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                {blog.views}
              </span>
            </div>
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

  // Scroll animation refs
  const [headerRef, headerVisible] = useScrollAnimation();
  const [filtersRef, filtersVisible] = useScrollAnimation();
  const [blogsRef, blogsVisible] = useScrollAnimation();

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

  const handleSearch = (e) => {
    e.preventDefault();
    updateURL({ q: searchQuery, category });
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

  const updateURL = ({ q, category }) => {
    const params = {};
    if (q) params.q = q;
    if (category) params.category = category;
    setSearchParams(params);
  };

  const hasActiveFilters = searchQuery || category;

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-20">
      {/* Premium Editorial Header */}
      <div ref={headerRef} className={`bg-white border-b border-gray-100 pt-8 pb-10 transition-all duration-700 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="container-shell">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-gray-400 mb-6">
            <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-900">Journal</span>
          </div>
          
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
              The BookHive <span className="text-amber-600 italic font-normal">Journal</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-500 leading-relaxed">
              Explore our curated collection of {total > 0 ? total : 'insightful'} articles, literary analyses, and reading recommendations.
            </p>
          </div>
        </div>
      </div>

      <div className="container-shell py-12">
        {/* Refined Filter Section */}
        <div ref={filtersRef} className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 transition-all duration-700 ${filtersVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Categories Pill Scroller */}
          <div className="flex-1 w-full overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <div className="flex gap-2 min-w-max">
              <button
                onClick={() => handleCategoryChange("")}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  category === "" 
                    ? "bg-gray-900 text-white shadow-md" 
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                All Articles
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                    category === cat 
                      ? "bg-gray-900 text-white shadow-md" 
                      : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Minimal Search */}
          <div className="w-full md:w-auto flex items-center gap-3">
            <form onSubmit={handleSearch} className="relative w-full md:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search journal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-12 bg-white border-gray-200 rounded-full focus:border-gray-900 focus:ring-1 focus:ring-gray-900 w-full"
              />
            </form>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                title="Clear filters"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i}
                className="transition-all duration-700 opacity-100 translate-y-0"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <BlogSkeleton />
              </div>
            ))}
          </div>
        )}

        {/* Blogs Grid */}
        {!isLoading && blogs.length > 0 && (
          <>
            <div ref={blogsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog, index) => (
                <BlogCard 
                  key={blog._id} 
                  blog={blog} 
                  isVisible={blogsVisible}
                  delay={(index % 9) * 100}
                />
              ))}
            </div>

            {/* Load More Trigger */}
            {hasNextPage && (
              <div ref={loadMoreRef} className="flex justify-center mt-16">
                {isFetchingNextPage ? (
                  <div className="flex items-center gap-3 text-gray-500 bg-white px-6 py-3 rounded-full border border-gray-100 shadow-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm font-medium uppercase tracking-wider">Loading more</span>
                  </div>
                ) : (
                  <div className="h-10" /> 
                )}
              </div>
            )}

            {/* End of Results */}
            {!hasNextPage && blogs.length > 0 && (
              <div className="text-center mt-16 pt-8 border-t border-gray-200">
                <p className="text-gray-400 text-sm uppercase tracking-widest font-medium">
                  End of Journal
                </p>
              </div>
            )}
          </>
        )}

        {/* No Results */}
        {!isLoading && blogs.length === 0 && (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm mt-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No articles found</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              We couldn't find any articles matching your search criteria. Try adjusting your filters or search term.
            </p>
            {hasActiveFilters && (
              <Button 
                onClick={handleClearFilters} 
                className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-8 py-6 h-auto"
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
