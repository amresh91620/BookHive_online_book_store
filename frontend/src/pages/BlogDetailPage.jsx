import { useParams, Link } from "react-router-dom";
import { useBlogDetails } from "@/hooks/api/useBlogs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Eye, Calendar, Tag, User } from "lucide-react";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import CommentSection from "@/components/blog/CommentSection";

export default function BlogDetailPage() {
  const { id } = useParams();
  const { data: blog, isLoading, isError } = useBlogDetails(id);

  if (isLoading)
    return (
      <div className="container-shell py-12">
        <LoadingSkeleton type="card" count={1} />
        <div className="mt-8 space-y-4">
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse"></div>
        </div>
      </div>
    );

  if (isError || !blog)
    return (
      <div className=" flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-lg font-medium">Article not found.</p>
        <Link to="/blog">
          <Button variant="outline" className="rounded-full">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </Link>
      </div>
    );

  return (
    <article className="  py-8 md:py-10 bg-white min-h-screen">
      <div className=" container-shell">
        {/* Top Navigation */}
        <div className="mb-8">
          <Link to="/blog">
            <Button
              variant="ghost"
              className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 px-3 py-1.5 text-sm rounded-full transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to articles
            </Button>
          </Link>
        </div>

        {/* Header Section */}
        <header className="mb-10">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-0 rounded-full px-3 py-1">
              {blog.category}
            </Badge>
            {blog.featured && (
              <Badge className="bg-gray-900 text-white border-0 rounded-full px-3 py-1">
                Featured
              </Badge>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
            {blog.title}
          </h1>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-y-4 gap-x-6 text-sm text-gray-600 border-b border-gray-100 pb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                <User className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-gray-900">{blog.author}</span>
                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(blog.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            <div className="hidden sm:block w-px h-8 bg-gray-200"></div>

            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
                <Clock className="w-4 h-4 text-gray-400" />
                {blog.readTime} min read
              </span>
              <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
                <Eye className="w-4 h-4 text-gray-400" />
                {blog.views} views
              </span>
            </div>
          </div>
        </header>

        {/* Hero Cover */}
        <div className="relative w-full overflow-hidden rounded-2xl shadow-sm border border-gray-100 mb-10">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-auto max-h-[500px] object-cover object-center block hover:scale-105 transition-transform duration-700"
          />
        </div>

        {/* Article Body Container - Constrained width for optimal reading */}
          {/* Content */}
          <div
            className="prose prose-lg md:prose-xl prose-gray max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-amber-600 hover:prose-a:text-amber-700 prose-img:rounded-xl prose-img:shadow-md"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Tags */}
          {blog.tags?.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-100 flex flex-wrap gap-2 items-center">
              <Tag className="w-4 h-4 text-gray-400 mr-2" />
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-50 hover:bg-gray-100 border border-gray-100 text-gray-600 text-sm px-4 py-1.5 rounded-full transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Comment Section */}
          <div className="mt-16 bg-gray-50 rounded-2xl p-6 sm:p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Discussion</h3>
            <CommentSection blogId={id} />
          </div>
        </div>
    </article>
  );
}