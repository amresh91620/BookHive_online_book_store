import { useParams, Link } from "react-router-dom";
import { useBlogDetails } from "@/hooks/api/useBlogs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Eye, Calendar, Tag, User } from "lucide-react";
import CommentSection from "@/components/blog/CommentSection";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function BlogDetailPage() {
  const { id } = useParams();
  const { data: blog, isLoading, isError } = useBlogDetails(id);
  
  const [headerRef, headerVisible] = useScrollAnimation();
  const [imageRef, imageVisible] = useScrollAnimation();
  const [contentRef, contentVisible] = useScrollAnimation();
  const [tagsRef, tagsVisible] = useScrollAnimation();
  const [commentsRef, commentsVisible] = useScrollAnimation();

  if (isLoading)
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container-shell py-12">
          <div className="space-y-8">
            <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="space-y-4">
              <div className="h-12 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            </div>
            <div className="h-96 bg-gray-200 rounded-2xl animate-pulse"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );

  if (isError || !blog)
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center gap-4">
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
    <article className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 md:py-12">
      <div className="container-shell ">
        {/* Top Navigation */}
        <div className="mb-8">
          <Link to="/blog">
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-4 py-2 text-sm rounded-full transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to articles
            </Button>
          </Link>
        </div>

        {/* Header Section */}
        <header
          ref={headerRef}
          className={`mb-10 transition-all duration-700 ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge className="bg-[#d97642] text-white hover:bg-[#c26535] border-0 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider">
              {blog.category}
            </Badge>
            {blog.featured && (
              <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider">
                ⭐ Featured
              </Badge>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-tight mb-8">
            {blog.title}
          </h1>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 pb-8 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#d97642] to-[#c26535] flex items-center justify-center shadow-md">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-gray-900">{blog.author}</span>
                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(blog.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            <div className="hidden sm:block w-px h-10 bg-gray-200"></div>

            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                <Clock className="w-4 h-4 text-[#d97642]" />
                <span className="font-semibold">{blog.readTime} min</span>
              </span>
              <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                <Eye className="w-4 h-4 text-[#d97642]" />
                <span className="font-semibold">{blog.views}</span>
              </span>
            </div>
          </div>
        </header>

        {/* Hero Cover */}
        <div
          ref={imageRef}
          className={`relative w-full overflow-hidden rounded-3xl shadow-xl border border-gray-200 mb-12 transition-all duration-700 ${
            imageVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-auto max-h-[600px] object-cover object-center block hover:scale-105 transition-transform duration-700"
          />
        </div>

        {/* Content */}
        <div
          ref={contentRef}
          className={`prose prose-lg md:prose-xl prose-gray max-w-none 
            prose-headings:font-bold prose-headings:text-gray-900 prose-headings:tracking-tight
            prose-p:text-gray-700 prose-p:leading-relaxed 
            prose-a:text-[#d97642] prose-a:no-underline hover:prose-a:text-[#c26535] hover:prose-a:underline
            prose-strong:text-gray-900 prose-strong:font-bold
            prose-img:rounded-2xl prose-img:shadow-lg prose-img:border prose-img:border-gray-200
            prose-blockquote:border-l-4 prose-blockquote:border-[#d97642] prose-blockquote:bg-gray-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-xl
            prose-code:text-[#d97642] prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded
            mb-12
            transition-all duration-700 ${
            contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Tags */}
        {blog.tags?.length > 0 && (
          <div
            ref={tagsRef}
            className={`mt-12 pt-8 border-t border-gray-200 transition-all duration-700 ${
              tagsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <Tag className="w-5 h-5 text-[#d97642]" />
              <h3 className="text-lg font-bold text-gray-900">Tags</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-white hover:bg-[#d97642] hover:text-white border border-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-full transition-all cursor-pointer shadow-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Comment Section */}
        <div
          ref={commentsRef}
          className={`mt-16 transition-all duration-700 ${
            commentsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <CommentSection blogId={id} />
        </div>
      </div>
    </article>
  );
}
