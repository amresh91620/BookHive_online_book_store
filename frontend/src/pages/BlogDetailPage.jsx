import { useParams, Link } from "react-router-dom";
import { useBlogDetails } from "@/hooks/api/useBlogs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Eye, Calendar, Tag } from "lucide-react";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import CommentSection from "@/components/blog/CommentSection";

export default function BlogDetailPage() {
  const { id } = useParams();
  const { data: blog, isLoading, isError } = useBlogDetails(id);

  if (isLoading)
    return (
      <div className="container-shell py-10">
        <LoadingSkeleton type="card" count={3} />
      </div>
    );
  if (isError || !blog)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-lg">Article not found.</p>
        <Link to="/blog">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </Link>
      </div>
    );

  return (
    <div className="container-shell  bg-white">
      {/* Hero Cover */}
      <div className="relative w-full overflow-hidden rounded-xl shadow-md">
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="w-full h-auto max-h-[520px] object-cover object-center block"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/30 pointer-events-none" />
        {/* Back Button */}
        <div className="absolute top-4 left-4">
          <Link to="/blog">
            <Button
              variant="ghost"
              className="text-white bg-black/30 hover:bg-black/50 hover:text-white backdrop-blur-sm px-3 py-1.5 text-sm rounded-full"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to Blog
            </Button>
          </Link>
        </div>
        {/* Title overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-6 py-5">
          <div className="flex flex-wrap gap-2 mb-2">
            <Badge variant="secondary" className="bg-white/20 text-white border-0 backdrop-blur-sm">{blog.category}</Badge>
            {blog.featured && <Badge className="bg-amber-500 text-white">Featured</Badge>}
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight drop-shadow">
            {blog.title}
          </h1>
        </div>
      </div>

      <div className="py-8">
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
          <span className="font-medium text-gray-700">By {blog.author}</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {new Date(blog.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {blog.readTime} min read
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {blog.views} views
          </span>
        </div>

        {/* Content */}
        <div
          className="prose prose-gray max-w-none prose-headings:font-semibold prose-a:text-amber-600 prose-img:rounded-lg"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Tags */}
        {blog.tags?.length > 0 && (
          <div className="mt-10 pt-6 border-t border-gray-100 flex flex-wrap gap-2 items-center">
            <Tag className="w-4 h-4 text-gray-400" />
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Comment Section */}
        <CommentSection blogId={id} />
      </div>
    </div>
  );
}
