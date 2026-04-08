import { useState } from "react";
import { useAdminReviews, useDeleteAdminReview } from "@/hooks/api/useAdmin";
import { AdminSkeleton } from "@/components/admin/AdminSkeleton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Pagination } from "@/components/ui/pagination";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Search, Trash2, Star, BookOpen, Download } from "lucide-react";
import { shortDate } from "@/utils/format";
import toast from "react-hot-toast";

const ITEMS_PER_PAGE = 20;

export default function AdminReviewsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReviews, setSelectedReviews] = useState([]);
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

  // Pagination
  const totalPages = Math.ceil(filteredReviews.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedReviews = filteredReviews.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    if (selectedReviews.length === 0) {
      toast.error("Please select reviews first");
      return;
    }
    
    if (!window.confirm(`Delete ${selectedReviews.length} reviews?`)) {
      return;
    }

    try {
      let successCount = 0;
      let failCount = 0;

      for (const reviewId of selectedReviews) {
        try {
          await deleteReview.mutateAsync(reviewId);
          successCount++;
        } catch (error) {
          failCount++;
          console.error(`Failed to delete review ${reviewId}:`, error);
        }
      }

      if (successCount > 0) {
        toast.success(`${successCount} review(s) deleted successfully`);
      }
      if (failCount > 0) {
        toast.error(`${failCount} review(s) failed to delete`);
      }
      
      setSelectedReviews([]);
    } catch (error) {
      toast.error("Failed to delete reviews");
    }
  };

  // Export to CSV
  const handleExport = () => {
    const csvData = filteredReviews.map(review => ({
      User: review.user?.name || "Anonymous",
      Email: review.user?.email || "",
      Book: review.book?.title || "",
      Rating: review.rating,
      Comment: review.comment?.replace(/,/g, ";") || "",
      Date: new Date(review.createdAt).toLocaleDateString()
    }));

    const headers = Object.keys(csvData[0]).join(",");
    const rows = csvData.map(row => Object.values(row).map(v => `"${v}"`).join(","));
    const csv = [headers, ...rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reviews-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    toast.success("Reviews exported successfully");
  };

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
    <div className="admin-page p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 animate-fade-in-up">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-stone-900 via-amber-900 to-stone-800 bg-clip-text text-transparent">
            Manage Reviews
          </h1>
          <p className="text-stone-600 mt-2 font-semibold">Total: {filteredReviews.length} reviews</p>
        </div>
        <Button 
          onClick={handleExport}
          variant="outline"
          className="border-2 border-green-600 text-green-700 hover:bg-green-50"
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Bulk Actions */}
      {selectedReviews.length > 0 && (
        <Card className="mb-6 p-4 border-2 border-red-300 bg-red-50/50">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold text-stone-900">
              {selectedReviews.length} selected
            </span>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleBulkDelete}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete All
            </Button>
          </div>
        </Card>
      )}

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 sm:p-6 mb-6 border-2 border-stone-200 animate-slide-in-right stagger-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search by user, book, or comment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-2 border-stone-200 focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Rating Filter */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={ratingFilter === "" ? "default" : "outline"}
              size="sm"
              onClick={() => setRatingFilter("")}
              className={ratingFilter === "" ? "bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800" : "border-2 hover:border-amber-500"}
            >
              All Ratings
            </Button>
            {[5, 4, 3, 2, 1].map((rating) => (
              <Button
                key={rating}
                variant={ratingFilter === rating.toString() ? "default" : "outline"}
                size="sm"
                onClick={() => setRatingFilter(rating.toString())}
                className={ratingFilter === rating.toString() ? "bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800" : "border-2 hover:border-amber-500"}
              >
                {rating} ★
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {isLoading ? (
        <AdminSkeleton type="review-list" count={5} />
      ) : filteredReviews.length === 0 ? (
        <Card className="p-12 text-center border-2 border-stone-200 bg-gradient-to-br from-stone-50 to-amber-50/30 animate-scale-up stagger-2">
          <Star className="w-16 h-16 text-stone-300 mx-auto mb-4" />
          <p className="text-stone-500 font-medium">No reviews found</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {paginatedReviews.map((review) => (
            <Card 
              key={review._id} 
              className="p-4 sm:p-6 border-2 border-stone-200 hover:border-amber-300 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedReviews.includes(review._id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedReviews(prev => [...prev, review._id]);
                      } else {
                        setSelectedReviews(prev => prev.filter(id => id !== review._id));
                      }
                    }}
                    className="w-4 h-4 rounded border-stone-300 mt-1"
                  />
                  
                  {/* User Info */}
                  <Avatar className="shadow-md">
                    <AvatarFallback className="bg-gradient-to-br from-amber-100 to-amber-200 text-amber-700 font-bold text-lg">
                      {review.user?.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                      <h3 className="font-bold text-stone-900">
                        {review.user?.name || "Anonymous"}
                      </h3>
                      <span className="text-sm text-stone-500 truncate">
                        {review.user?.email}
                      </span>
                      {review.isEdited && (
                        <Badge variant="secondary" className="text-xs w-fit shadow-sm">
                          Edited
                        </Badge>
                      )}
                    </div>
                    
                    {/* Book Info */}
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <BookOpen className="w-4 h-4 text-stone-400 flex-shrink-0" />
                      <span className="text-sm text-stone-600 font-medium">
                        {review.book?.title || "Book not found"}
                      </span>
                      <span className="text-sm text-stone-400">
                        by {review.book?.author || "Unknown"}
                      </span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      {renderStars(review.rating)}
                      <span className="text-sm text-stone-500">
                        {shortDate(review.createdAt)}
                      </span>
                    </div>

                    {/* Comment */}
                    <p className="text-stone-700 leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                </div>

                {/* Delete Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteDialog({ open: true, reviewId: review._id })}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors flex-shrink-0"
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
        <DialogContent className="border-2 border-stone-200">
          <DialogHeader>
            <DialogTitle className="text-stone-900">Delete Review</DialogTitle>
            <DialogDescription className="text-stone-600">
              Are you sure you want to delete this review? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, reviewId: null })}
              className="border-2 hover:border-stone-400"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="hover:scale-105 transition-transform"
            >
              Delete Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 animate-fade-in-up">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}

