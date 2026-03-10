import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviewsByBook, addReview, updateReview, deleteReview } from "@/store/slices/reviewsSlice";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Star, Edit, Trash2, Send } from "lucide-react";
import toast from "react-hot-toast";

export default function ReviewSection({ bookId }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { reviews, stats, loading } = useSelector((state) => state.reviews);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, reviewId: null });

  useEffect(() => {
    if (bookId) {
      dispatch(fetchReviewsByBook(bookId));
    }
  }, [dispatch, bookId]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please login to write a review");
      return;
    }

    try {
      if (editingReview) {
        await dispatch(updateReview({ 
          id: editingReview._id, 
          reviewData: { rating, comment } 
        })).unwrap();
        toast.success("Review updated successfully");
      } else {
        await dispatch(addReview({ bookId, rating, comment })).unwrap();
        toast.success("Review added successfully");
      }
      
      setShowReviewForm(false);
      setEditingReview(null);
      setRating(5);
      setComment("");
    } catch (error) {
      toast.error(error || "Failed to submit review");
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setRating(review.rating);
    setComment(review.comment);
    setShowReviewForm(true);
  };

  const handleDeleteReview = async () => {
    if (!deleteDialog.reviewId) return;
    
    try {
      await dispatch(deleteReview(deleteDialog.reviewId)).unwrap();
      toast.success("Review deleted successfully");
      setDeleteDialog({ open: false, reviewId: null });
    } catch (error) {
      toast.error(error || "Failed to delete review");
    }
  };

  const renderStars = (count, interactive = false, size = "w-5 h-5") => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= (interactive ? (hoverRating || rating) : count)
                ? "fill-amber-500 text-amber-500"
                : "text-gray-300"
            } ${interactive ? "cursor-pointer transition-colors" : ""}`}
            onClick={() => interactive && setRating(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
          />
        ))}
      </div>
    );
  };

  const userHasReviewed = reviews.some(
    (review) => review.user?._id === user?._id || review.user?._id === user?.id
  );

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Average Rating */}
            <div className="flex flex-col items-center justify-center p-6 bg-amber-50 rounded-lg">
              <div className="text-5xl font-bold text-amber-600 mb-2">
                {stats?.avgRating || "0.0"}
              </div>
              <div className="mb-2">{renderStars(Math.round(stats?.avgRating || 0))}</div>
              <p className="text-gray-600 text-sm">
                Based on {stats?.totalRatings || 0} reviews
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = stats?.ratingDistribution?.[star] || 0;
                const percentage = stats?.totalRatings
                  ? (count / stats.totalRatings) * 100
                  : 0;
                return (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-sm font-medium w-8">{star} ★</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Write Review Button */}
          {user && !userHasReviewed && !showReviewForm && (
            <div className="mt-6">
              <Button
                onClick={() => setShowReviewForm(true)}
                className="bg-amber-600 hover:bg-amber-700"
              >
                <Edit className="w-4 h-4 mr-2" />
                Write a Review
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Form */}
      {showReviewForm && (
        <Card className="border-2 border-amber-200">
          <CardHeader>
            <CardTitle>
              {editingReview ? "Edit Your Review" : "Write a Review"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Your Rating *
                </label>
                {renderStars(rating, true, "w-8 h-8")}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Your Review *
                </label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts about this book..."
                  rows={4}
                  required
                  maxLength={1000}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {comment.length}/1000 characters
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700"
                  disabled={loading}
                >
                  <Send className="w-4 h-4 mr-2" />
                  {editingReview ? "Update Review" : "Submit Review"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowReviewForm(false);
                    setEditingReview(null);
                    setRating(5);
                    setComment("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">No reviews yet. Be the first to review!</p>
            </CardContent>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review._id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-amber-100 text-amber-700">
                        {review.user?.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {review.user?.name || "Anonymous"}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {renderStars(review.rating, false, "w-4 h-4")}
                        <span className="text-xs text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                        {review.isEdited && (
                          <span className="text-xs text-gray-500">(edited)</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Edit/Delete buttons for own reviews */}
                  {user && (review.user?._id === user._id || review.user?._id === user.id) && (
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditReview(review)}
                        className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                        title="Edit review"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteDialog({ open: true, reviewId: review._id })}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Delete review"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <Separator className="my-3" />

                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, reviewId: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Review</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this review? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, reviewId: null })}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteReview}
            >
              Delete Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
