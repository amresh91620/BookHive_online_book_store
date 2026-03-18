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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Blogs</h1>
          <p className="text-gray-600 mt-1">Total: {total} posts</p>
        </div>
        <Link to="/admin/blogs/add">
          <Button className="bg-amber-600 hover:bg-amber-700">
            <Plus className="w-4 h-4 mr-2" />New Post
          </Button>
        </Link>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          placeholder="Search blog posts..."
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
          className="pl-10"
        />
      </div>

      {isLoading ? (
        <LoadingSkeleton type="table" count={1} />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Post</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {blogs.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-10 text-center text-gray-500">No blog posts yet.</td></tr>
                ) : blogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={blog.coverImage} alt={blog.title} className="w-16 h-10 object-cover rounded" />
                        <div>
                          <div className="font-medium text-gray-900 line-clamp-1 max-w-xs">{blog.title}</div>
                          <div className="text-xs text-gray-400">{blog.readTime} min read</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{blog.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{blog.author}</td>
                    <td className="px-6 py-4">
                      <Badge className={blog.status === "published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                        {blog.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{blog.views}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link to={`/blog/${blog._id}`} target="_blank">
                          <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                        </Link>
                        <Link to={`/admin/blogs/edit/${blog._id}`}>
                          <Button variant="ghost" size="sm"><Pencil className="w-4 h-4" /></Button>
                        </Link>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(blog._id)}>
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(p) => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
        </div>
      )}
    </div>
  );
}
