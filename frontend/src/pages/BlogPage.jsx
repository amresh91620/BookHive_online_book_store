import { useState } from "react";
import { Link } from "react-router-dom";
import { useBlogsList, useBlogCategories } from "@/hooks/api/useBlogs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import BookSkeleton from "@/components/common/BookSkeleton";
import { Search, Clock, Eye, Calendar } from "lucide-react";

const ITEMS_PER_PAGE = 9;

function BlogCard({ blog }) {
  return (
    <Link to={`/blog/${blog._id}`} className="group block">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-full flex flex-col">
        <div className="relative overflow-hidden aspect-[16/9]">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {blog.featured && (
            <span className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
              Featured
            </span>
          )}
        </div>
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary" className="text-xs">{blog.category}</Badge>
          </div>
          <h3 className="font-semibold text-gray-900 text-lg leading-snug mb-2 group-hover:text-amber-600 transition-colors line-clamp-2">
            {blog.title}
          </h3>
          <p className="text-gray-500 text-sm line-clamp-2 flex-1 mb-4">{blog.excerpt}</p>
          <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-3 border-t border-gray-100">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(blog.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {blog.readTime} min read
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {blog.views}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function BlogPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const params = {
    limit: ITEMS_PER_PAGE,
    offset: (currentPage - 1) * ITEMS_PER_PAGE,
    ...(search && { q: search }),
    ...(activeCategory && { category: activeCategory }),
  };

  const { data, isLoading } = useBlogsList(params);
  const { data: categories = [] } = useBlogCategories();

  const blogs = data?.blogs || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat === activeCategory ? "" : cat);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-b border-amber-100 py-14 text-center">
        <div className="container-shell">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">BookHive Blog</h1>
          <p className="text-gray-600 max-w-xl mx-auto mb-6">
            Book reviews, reading tips, author spotlights, and everything in between.
          </p>
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search articles..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="pl-9 bg-white"
            />
          </div>
        </div>
      </div>

      <div className="container-shell py-10">
        {/* Category filters */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <Button
              variant={activeCategory === "" ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryClick("")}
              className={activeCategory === "" ? "bg-amber-600 hover:bg-amber-700" : ""}
            >
              All
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryClick(cat)}
                className={activeCategory === cat ? "bg-amber-600 hover:bg-amber-700" : ""}
              >
                {cat}
              </Button>
            ))}
          </div>
        )}

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <BookSkeleton key={i} />)}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No articles found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-10">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(p) => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
