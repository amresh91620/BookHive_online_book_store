import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  useBlogComments,
  useCreateComment,
  useDeleteComment,
  useLikeComment,
  useDislikeComment,
} from "@/hooks/api/useBlogComments";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  ThumbsUp,
  ThumbsDown,
  Trash2,
  Send,
  MessageSquare,
} from "lucide-react";
import toast from "react-hot-toast";

export default function CommentSection({ blogId }) {
  const { user } = useSelector((state) => state.auth);
  const [newComment, setNewComment] = useState("");

  const { data, isLoading } = useBlogComments(blogId);
  const createMutation = useCreateComment();
  const deleteMutation = useDeleteComment();
  const likeMutation = useLikeComment();
  const dislikeMutation = useDislikeComment();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await createMutation.mutateAsync({ blogId, content: newComment });
      setNewComment("");
      toast.success("Comment posted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post comment");
    }
  };

  const handleDelete = async (commentId) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      await deleteMutation.mutateAsync(commentId);
      toast.success("Comment deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete comment");
    }
  };

  const handleLike = async (commentId) => {
    try {
      await likeMutation.mutateAsync(commentId);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to like comment");
    }
  };

  const handleDislike = async (commentId) => {
    try {
      await dislikeMutation.mutateAsync(commentId);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to dislike comment"
      );
    }
  };

  const comments = data?.comments || [];
  const total = data?.total || 0;

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-5 h-5 text-gray-600" />
        <h2 className="text-2xl font-bold text-gray-900">
          Comments ({total})
        </h2>
      </div>

      {/* Comment Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="mb-3 min-h-[100px]"
            maxLength={1000}
          />
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {newComment.length}/1000
            </span>
            <Button
              type="submit"
              disabled={!newComment.trim() || createMutation.isPending}
              className="bg-[#F59E0B] hover:bg-[#D97706]"
            >
              <Send className="w-4 h-4 mr-2" />
              {createMutation.isPending ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </form>
      ) : (
        <Card className="mb-8 bg-gray-50">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600 mb-4">
              Please login to leave a comment
            </p>
            <Link to="/login">
              <Button className="bg-[#F59E0B] hover:bg-[#D97706]">
                Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Comments List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-32 bg-gray-100 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <Card className="bg-gray-50">
          <CardContent className="p-8 text-center">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              No comments yet. Be the first to comment!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => {
            // Safety check: Skip if comment or user is null/undefined
            if (!comment || !comment.user) {
              // Silently skip comments with deleted users
              return null;
            }

            // Handle both cases: comment.user as object or string ID
            const commentUserId = typeof comment.user === 'object' ? comment.user._id : comment.user;
            // Check both _id and id fields for current user
            const currentUserId = user?._id || user?.id;
            const isOwner = currentUserId && commentUserId && (currentUserId === commentUserId || currentUserId.toString() === commentUserId.toString());
            
            const userLiked = comment.likes?.includes(currentUserId) || false;
            const userDisliked = comment.dislikes?.includes(currentUserId) || false;

            return (
              <Card key={comment._id} className="border border-gray-200">
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {typeof comment.user === 'object' ? (comment.user.name || 'Unknown User') : 'Unknown User'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()}{" "}
                        {comment.isEdited && "(edited)"}
                      </p>
                    </div>
                    {isOwner && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(comment._id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Delete comment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <p className="text-gray-700 mb-4">{comment.content}</p>

                  {user && (
                    <div className="flex gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(comment._id)}
                        className={`h-8 gap-1 ${
                          userLiked ? "text-blue-600" : "text-gray-600"
                        }`}
                      >
                        <ThumbsUp
                          className={`w-4 h-4 ${
                            userLiked ? "fill-current" : ""
                          }`}
                        />
                        <span>{comment.likes?.length || 0}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDislike(comment._id)}
                        className={`h-8 gap-1 ${
                          userDisliked ? "text-red-600" : "text-gray-600"
                        }`}
                      >
                        <ThumbsDown
                          className={`w-4 h-4 ${
                            userDisliked ? "fill-current" : ""
                          }`}
                        />
                        <span>{comment.dislikes?.length || 0}</span>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          }).filter(Boolean)}
        </div>
      )}
    </div>
  );
}

