import React, { useEffect } from 'react';
import { useReview } from '../hooks/useReview';

const ManageReviews = () => {
  const { reviews, loading, fetchAllUsersReviews, deleteUserReviewByAdmin } = useReview();

  useEffect(() => {
    fetchAllUsersReviews();
  }, []);

const handleDelete = async (reviewId) => {
  if (window.confirm("Are you sure you want to delete this review?")) {
    await deleteUserReviewByAdmin(reviewId);
  }
};

  if (loading) {
    return <div className="text-center p-8">Loading reviews...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Manage Reviews</h1>
      
      {reviews.length === 0 ? (
        <p className="text-gray-500">No reviews found</p>
      ) : (
        <div className="space-y-2">
          {reviews.map((review) => (
            <div key={review._id} className="bg-white shadow-xl shadow-slate-200/50 border p-10 border-slate-300 overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                {/* User Information */}
                <div>
                  <p className="text-sm text-gray-600">User Details:</p>
                  <p><b>Name:</b> {review.user?.name || 'N/A'}</p>
                  <p><b>Email:</b> {review.user?.email || 'N/A'}</p>
                </div>

                {/* Book Information */}
                <div>
                  <p className="text-sm text-gray-600">Book Details:</p>
                  <p><b>Title:</b> {review.book?.title || 'N/A'}</p>
                  <p><b>Author:</b> {review.book?.author || 'N/A'}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="mb-3">
                <b>Rating:</b> 
                <span className="ml-2 text-yellow-500">
                  {'⭐'.repeat(review.rating || 0)} ({review.rating || 0}/5)
                </span>
              </div>

              {/* Review Text */}
              <div className="mb-4">
                <b>Review:</b>
                <p className="mt-1 text-gray-700">{review.comment || review.text || 'No comment'}</p>
              </div>

              {/* Date */}
              <div className="mb-4 text-sm text-gray-500">
                <b>Posted on:</b> {new Date(review.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </div>

              {/* Delete Button */}
              <button 
                onClick={() => handleDelete(review._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
              >
                Delete Review
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageReviews;