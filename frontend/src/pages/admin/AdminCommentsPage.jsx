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
      <div className="p-6">
        <LoadingSkeleton type="card" count={3} />
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-[#F59E0B]" />
              <CardTitle>Blog Comments</CardTitle>
            </div>
            <div className="text-sm text-gray-600">
              Total: {data?.total || 0}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by user or content..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Input
              placeholder="Filter by Blog ID..."
              value={blogFilter}
              onChange={(e) => setBlogFilter(e.target.value)}
              className="max-w-xs"
            />
          </div>

          {comments.length === 0 ? (
            <Card className="p-12 text-center bg-gray-50">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No comments found</p>
            </Card>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Blog
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Comment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Reactions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {comments.map((comment) => (
                    <tr key={comment._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-sm">{comment.user.name}</p>
                          <p className="text-xs text-gray-500">{comment.user.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium max-w-xs truncate">
                          {comment.blog.title}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-md">
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {comment.content}
                          </p>
                          {comment.isEdited && (
                            <span className="text-xs text-gray-500 italic">(edited)</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-3 text-sm">
                          <span className="flex items-center gap-1 text-blue-600">
                            <ThumbsUp className="w-3 h-3" />
                            {comment.likes.length}
                          </span>
                          <span className="flex items-center gap-1 text-red-600">
                            <ThumbsDown className="w-3 h-3" />
                            {comment.dislikes.length}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(comment._id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="px-4 py-2 text-sm">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
