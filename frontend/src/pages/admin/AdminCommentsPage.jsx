import { useState } from "react";
import { useAdminBlogComments, useAdminDeleteComment } from "@/hooks/api/useBlogComments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { Trash2, MessageSquare, ThumbsUp, ThumbsDown, Search } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminCommentsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [blogFilter, setBlogFilter] = useState("");

  const { data, isLoading } = useAdminBlogComments({
    page,
    limit: 20,
    blogId: blogFilter,
  });
  const deleteMutation = useAdminDeleteComment();

  const handleDelete = async (commentId) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      await deleteMutation.mutateAsync(commentId);
      toast.success("Comment deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete comment");
    }
  };

  const comments = data?.comments || [];
  const totalPages = data?.totalPages || 1;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-amber-50/30 p-4 sm:p-6 lg:p-8">
        <LoadingSkeleton type="card" count={3} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-amber-50/30 p-4 sm:p-6 lg:p-8">
      <Card className="border-2 border-stone-200 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg shadow-md">
                <MessageSquare className="w-6 h-6 text-amber-700" />
              </div>
              <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-stone-900 via-amber-900 to-stone-800 bg-clip-text text-transparent">
                Blog Comments
              </CardTitle>
            </div>
            <div className="text-sm text-stone-600 font-semibold">
              Total: {data?.total || 0}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col sm:flex-row gap-4 animate-slide-in-right stagger-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
              <Input
                placeholder="Search by user or content..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 border-2 border-stone-200 focus:border-amber-500 transition-colors bg-white"
              />
            </div>
            <Input
              placeholder="Filter by Blog ID..."
              value={blogFilter}
              onChange={(e) => setBlogFilter(e.target.value)}
              className="max-w-xs border-2 border-stone-200 focus:border-amber-500 transition-colors bg-white"
            />
          </div>

          {comments.length === 0 ? (
            <Card className="p-12 text-center bg-gradient-to-br from-stone-50 to-amber-50/30 border-2 border-stone-200 animate-scale-up stagger-2">
              <MessageSquare className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <p className="text-stone-500 font-medium">No comments found</p>
            </Card>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto animate-scale-up stagger-2">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-stone-50 to-amber-50/50 border-b-2 border-stone-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">User</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">Blog</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">Comment</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">Reactions</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-stone-100">
                    {comments.map((comment) => (
                      <tr key={comment._id} className="hover:bg-gradient-to-r hover:from-amber-50/50 hover:to-stone-50 transition-all duration-200">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-sm text-stone-900">{comment.user.name}</p>
                            <p className="text-xs text-stone-500 truncate max-w-[150px]">{comment.user.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium max-w-xs truncate text-stone-900">{comment.blog.title}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-md">
                            <p className="text-sm text-stone-700 line-clamp-2">{comment.content}</p>
                            {comment.isEdited && <span className="text-xs text-stone-500 italic">(edited)</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-3 text-sm">
                            <span className="flex items-center gap-1 text-blue-600 font-semibold">
                              <ThumbsUp className="w-3 h-3" />{comment.likes.length}
                            </span>
                            <span className="flex items-center gap-1 text-red-600 font-semibold">
                              <ThumbsDown className="w-3 h-3" />{comment.dislikes.length}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-stone-600">{new Date(comment.createdAt).toLocaleDateString()}</span>
                        </td>
                        <td className="px-6 py-4">
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(comment._id)} className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4 animate-scale-up stagger-2">
                {comments.map((comment) => (
                  <Card key={comment._id} className="p-4 border-2 border-stone-200 shadow-lg bg-white">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-stone-900">{comment.user.name}</h3>
                        <p className="text-xs text-stone-500 truncate">{comment.user.email}</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(comment._id)} className="text-red-600 hover:bg-red-50 flex-shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm font-medium text-stone-900 mb-2 line-clamp-1">{comment.blog.title}</p>
                    <p className="text-sm text-stone-700 mb-3">{comment.content}</p>
                    {comment.isEdited && <span className="text-xs text-stone-500 italic block mb-2">(edited)</span>}
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex gap-3">
                        <span className="flex items-center gap-1 text-blue-600 font-semibold">
                          <ThumbsUp className="w-3 h-3" />{comment.likes.length}
                        </span>
                        <span className="flex items-center gap-1 text-red-600 font-semibold">
                          <ThumbsDown className="w-3 h-3" />{comment.dislikes.length}
                        </span>
                      </div>
                      <span className="text-stone-600">{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center gap-2 animate-fade-in-up stagger-3">
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="border-2 hover:border-amber-500 transition-colors">
                Previous
              </Button>
              <span className="px-4 py-2 text-sm font-semibold text-stone-700">
                Page {page} of {totalPages}
              </span>
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="border-2 hover:border-amber-500 transition-colors">
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
