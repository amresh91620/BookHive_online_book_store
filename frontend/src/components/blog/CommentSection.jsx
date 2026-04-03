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
    <div className="bg-white rounded-3xl border border-gray-200 shadow-lg p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-[#d97642] flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          Discussion <span className="text-[#d97642]">({total})</span>
        </h2>
      </div>

      {/* Comment Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts on this article..."
              className="mb-3 min-h-[120px] bg-white border-gray-200 focus:border-[#d97642] focus:ring-[#d97642]/20 rounded-xl resize-none"
              maxLength={1000}
            />
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 font-medium">
                {newComment.length}/1000 characters
              </span>
              <Button
                type="submit"
                disabled={!newComment.trim() || createMutation.isPending}
                className="bg-[#d97642] hover:bg-[#c26535] text-white rounded-full px-6 shadow-md"
              >
                <Send className="w-4 h-4 mr-2" />
                {createMutation.isPending ? "Posting..." : "Post Comment"}
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-700 font-medium mb-4">
            Join the conversation
          </p>
          <p className="text-gray-500 text-sm mb-6">
            Please login to share your thoughts and engage with other readers
          </p>
          <Link to="/login">
            <Button className="bg-[#d97642] hover:bg-[#c26535] text-white rounded-full px-8 shadow-md">
              Login to Comment
            </Button>
          </Link>
        </div>
      )}

      {/* Comments List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-32 bg-gray-100 rounded-2xl animate-pulse"
            ></div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No comments yet</h3>
          <p className="text-gray-500">
            Be the first to share your thoughts on this article!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => {
            // Safety check: Skip if comment or user is null/undefined
            if (!comment || !comment.user) {
              return null;
            }

            const commentUserId = typeof comment.user === 'object' ? comment.user._id : comment.user;
            const currentUserId = user?._id || user?.id;
            const isOwner = currentUserId && commentUserId && (currentUserId === commentUserId || currentUserId.toString() === commentUserId.toString());
            
            const userLiked = comment.likes?.includes(currentUserId) || false;
            const userDisliked = comment.dislikes?.includes(currentUserId) || false;

            return (
              <div key={comment._id} className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d97642] to-[#c26535] flex items-center justify-center shadow-md flex-shrink-0">
                      <span className="text-white font-bold text-sm">
                        {(typeof comment.user === 'object' ? (comment.user.name || 'U') : 'U').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 truncate">
                        {typeof comment.user === 'object' ? (comment.user.name || 'Unknown User') : 'Unknown User'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}{" "}
                        {comment.isEdited && <span className="text-gray-400">(edited)</span>}
                      </p>
                    </div>
                  </div>
                  {isOwner && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(comment._id)}
                      className="h-9 w-9 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full flex-shrink-0"
                      title="Delete comment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <p className="text-gray-700 leading-relaxed mb-4 pl-13">{comment.content}</p>

                {user && (
                  <div className="flex gap-2 pl-13">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(comment._id)}
                      className={`h-9 gap-2 rounded-full px-4 ${
                        userLiked 
                          ? "bg-blue-50 text-blue-600 hover:bg-blue-100" 
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <ThumbsUp
                        className={`w-4 h-4 ${
                          userLiked ? "fill-current" : ""
                        }`}
                      />
                      <span className="font-semibold">{comment.likes?.length || 0}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDislike(comment._id)}
                      className={`h-9 gap-2 rounded-full px-4 ${
                        userDisliked 
                          ? "bg-red-50 text-red-600 hover:bg-red-100" 
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <ThumbsDown
                        className={`w-4 h-4 ${
                          userDisliked ? "fill-current" : ""
                        }`}
                      />
                      <span className="font-semibold">{comment.dislikes?.length || 0}</span>
                    </Button>
                  </div>
                )}
              </div>
            );
          }).filter(Boolean)}
        </div>
      )}
    </div>
  );
}

