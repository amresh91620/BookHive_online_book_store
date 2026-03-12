import { useState } from "react";
import { useAdminReviews, useDeleteAdminReview } from "@/hooks/api/useAdmin";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Search, Trash2, Star, BookOpen } from "lucide-react";
import { shortDate } from "@/utils/format";
import toast from "react-hot-toast";

export default function AdminReviewsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [deleteDialog, setDeleteDialog] = useState({ open: false, reviewId: null });
  
  const { data: reviewsData, isLoading } = useAdminReviews();
  const deleteReview = useDeleteAdminReview();

  const reviews = reviewsData?.reviews || [];

  const handleDelete = async () => {
    if (!deleteDialog.reviewId) return;
    
    deleteReview.mutate(deleteDialog.reviewId, {
      onSuccess: () => {
        toast.success("Review deleted successfully");
        setDeleteDialog({ open: false, reviewId: null });
      },
      onError: (error) => toast.error(error?.response?.data?.msg || "Failed to delete review"),
    });
  };

  const filteredReviews = Array.isArray(reviews) ? reviews.filter((review) => {
    const matchesSearch =
      review.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.book?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.comment?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRating = ratingFilter ? review.rating === parseInt(ratingFilter) : true;
    
    return matchesSearch && matchesRating;
  }) : [];

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "fill-amber-500 text-amber-500" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Manage Reviews</h1>
        <p className="text-gray-600 mt-1">Total: {Array.isArray(reviews) ? reviews.length : 0} reviews</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search by user, book, or comment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Rating Filter */}
          <div className="flex gap-2">
            <Button
              variant={ratingFilter === "" ? "default" : "outline"}
              size="sm"
              onClick={() => setRatingFilter("")}
            >
              All Ratings
            </Button>
            {[5, 4, 3, 2, 1].map((rating) => (
              <Button
                key={rating}
                variant={ratingFilter === rating.toString() ? "default" : "outline"}
                size="sm"
                onClick={() => setRatingFilter(rating.toString())}
              >
                {rating} ★
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {isLoading ? (
        <LoadingSkeleton type="list" count={5} />
      ) : filteredReviews.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-500">No reviews found</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <Card key={review._id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  {/* User Info */}
                  <Avatar>
                    <AvatarFallback className="bg-amber-100 text-amber-700">
                      {review.user?.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {review.user?.name || "Anonymous"}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {review.user?.email}
                      </span>
                      {review.isEdited && (
                        <Badge variant="secondary" className="text-xs">
                          Edited
                        </Badge>
                      )}
                    </div>
                    
                    {/* Book Info */}
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {review.book?.title || "Book not found"}
                      </span>
                      <span className="text-sm text-gray-400">
                        by {review.book?.author || "Unknown"}
                      </span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-500">
                        {shortDate(review.createdAt)}
                      </span>
                    </div>

                    {/* Comment */}
                    <p className="text-gray-700 leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                </div>

                {/* Delete Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteDialog({ open: true, reviewId: review._id })}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

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
              onClick={handleDelete}
            >
              Delete Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
