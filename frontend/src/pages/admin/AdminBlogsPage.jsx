import { useState } from "react";
import { Link } from "react-router-dom";
import { useBlogsList, useDeleteBlog } from "@/hooks/api/useBlogs";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import { Pencil, Trash2, Plus, Search, Eye } from "lucide-react";
import toast from "react-hot-toast";

const ITEMS_PER_PAGE = 10;

export default function AdminBlogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const params = {
    limit: ITEMS_PER_PAGE,
    offset: (currentPage - 1) * ITEMS_PER_PAGE,
    admin: "true",
    ...(searchQuery && { q: searchQuery }),
  };

  const { data, isLoading } = useBlogsList(params);
  const deleteBlog = useDeleteBlog();

  const blogs = data?.blogs || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const handleDelete = (id) => {
    if (window.confirm("Delete this blog post?")) {
      deleteBlog.mutate(id, {
        onSuccess: () => toast.success("Blog deleted"),
        onError: (err) => toast.error(err?.response?.data?.msg || "Failed to delete"),
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-amber-50/30 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 animate-fade-in-up">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-stone-900 via-amber-900 to-stone-800 bg-clip-text text-transparent">
            Manage Blogs
          </h1>
          <p className="text-stone-600 mt-2">Total: {total} posts</p>
        </div>
        <Link to="/admin/blogs/add">
          <Button className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6 relative animate-slide-in-right stagger-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
        <Input
          placeholder="Search blog posts..."
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
          className="pl-10 border-2 border-stone-200 focus:border-amber-500 transition-colors bg-white/80 backdrop-blur-sm"
        />
      </div>

      {isLoading ? (
        <LoadingSkeleton type="table" count={1} />
      ) : (
        <>
          {/* Desktop Table */}
          <Card className="hidden md:block border-2 border-stone-200 shadow-lg hover:shadow-xl transition-all duration-300 animate-scale-up stagger-2 bg-white/80 backdrop-blur-sm">
            <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-stone-50 to-amber-50/50 border-b-2 border-stone-200">
                <tr>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">Post</th>
                  <th className="hidden md:table-cell px-6 py-4 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">Category</th>
                  <th className="hidden lg:table-cell px-6 py-4 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">Author</th>
                  <th className="hidden sm:table-cell px-4 sm:px-6 py-4 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">Status</th>
                  <th className="hidden lg:table-cell px-6 py-4 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">Views</th>
                  <th className="px-4 sm:px-6 py-4 text-right text-xs font-semibold text-stone-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {blogs.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-10 text-center text-stone-500">No blog posts yet.</td></tr>
                ) : blogs.map((blog) => (
                  <tr 
                    key={blog._id} 
                    className="hover:bg-gradient-to-r hover:from-amber-50/50 hover:to-stone-50 transition-all duration-200"
                  >
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-10 flex-shrink-0">
                          <img 
                            src={blog.coverImage} 
                            alt={blog.title} 
                            className="w-full h-full object-cover rounded shadow-md hover:shadow-lg transition-shadow" 
                            loading="lazy"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/160x100?text=No+Image';
                            }}
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-stone-900 line-clamp-1 max-w-xs">{blog.title}</div>
                          <div className="text-xs text-stone-400">{blog.readTime} min read</div>
                          <div className="md:hidden text-xs text-stone-500 mt-1">{blog.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-6 py-4 text-sm text-stone-700 font-medium">{blog.category}</td>
                    <td className="hidden lg:table-cell px-6 py-4 text-sm text-stone-700">{blog.author}</td>
                    <td className="hidden sm:table-cell px-4 sm:px-6 py-4">
                      <Badge className={blog.status === "published" ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 shadow-sm" : "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 shadow-sm"}>
                        {blog.status}
                      </Badge>
                    </td>
                    <td className="hidden lg:table-cell px-6 py-4 text-sm text-stone-700 font-semibold">{blog.views}</td>
                    <td className="px-4 sm:px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link to={`/blog/${blog._id}`} target="_blank">
                          <Button variant="ghost" size="sm" className="hover:bg-blue-100 hover:text-blue-700 transition-colors">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link to={`/admin/blogs/edit/${blog._id}`}>
                          <Button variant="ghost" size="sm" className="hover:bg-amber-100 hover:text-amber-700 transition-colors">
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(blog._id)} className="hover:bg-red-100 hover:text-red-700 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4 animate-scale-up stagger-2">
          {blogs.length === 0 ? (
            <Card className="p-12 text-center border-2 border-stone-200 bg-gradient-to-br from-stone-50 to-amber-50/30">
              <p className="text-stone-500">No blog posts yet.</p>
            </Card>
          ) : blogs.map((blog) => (
            <Card key={blog._id} className="p-4 border-2 border-stone-200 shadow-lg bg-white/80 backdrop-blur-sm">
              <div className="flex gap-4 mb-3">
                <div className="w-24 h-16 flex-shrink-0">
                  <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover rounded shadow-md" loading="lazy" onError={(e) => { e.target.src = 'https://via.placeholder.com/160x100?text=No+Image'; }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-stone-900 line-clamp-2 mb-1">{blog.title}</h3>
                  <p className="text-xs text-stone-500">{blog.category} • {blog.readTime} min read</p>
                  <p className="text-xs text-stone-600 mt-1">{blog.author}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mb-3">
                <Badge className={blog.status === "published" ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 shadow-sm" : "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 shadow-sm"}>
                  {blog.status}
                </Badge>
                <span className="text-sm text-stone-600 font-semibold">{blog.views} views</span>
              </div>
              <div className="flex gap-2">
                <Link to={`/blog/${blog._id}`} target="_blank" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full border-2 hover:border-blue-500">
                    <Eye className="w-4 h-4 mr-1" /> View
                  </Button>
                </Link>
                <Link to={`/admin/blogs/edit/${blog._id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full border-2 hover:border-amber-500">
                    <Pencil className="w-4 h-4 mr-1" /> Edit
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={() => handleDelete(blog._id)} className="border-2 hover:border-red-500 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </>
      )}

      {totalPages > 1 && (
        <div className="mt-6 animate-fade-in-up stagger-3">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(p) => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
        </div>
      )}
    </div>
  );
}
