import React, { useState } from "react";
import {
  addReview,
  getReviewsByBook,
  updateReviewApi,
  deleteReviewApi,
  getAllReviews,
  deleteUserReview,
} from "../../services/reviewApi";
import toast from "react-hot-toast";
import { ReviewContext } from "./ReviewContext";

export const ReviewProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

   const fetchAllUsersReviews = async () => {
    try {
      setLoading(true);
      const data = await getAllReviews();
      setReviews(data);
    } catch (error) {
      console.error("Fetch reviews error", error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch Reviews - REPLACE instead of accumulate for single book page
  const fetchReviews = async (bookId) => {
    if (!bookId) return;
    try {
      setLoading(true);
      const data = await getReviewsByBook(bookId);
      // ✅ For single book page - just replace the reviews
      setReviews(data?.reviews || data || []);
    } catch (error) {
      console.error("Fetch reviews error", error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEW: Fetch ALL reviews for homepage (accumulate mode)
  const fetchAllReviews = async (bookIds) => {
    if (!bookIds || bookIds.length === 0) return;
    try {
      setLoading(true);
      let allReviews = [];
      for (const bookId of bookIds.filter(Boolean)) {
        try {
          const data = await getReviewsByBook(bookId);
          const list = data?.reviews || data || [];
          allReviews = [...allReviews, ...list];
        } catch (err) {
          // skip failed book review request to avoid breaking the whole load
        }
      }
      setReviews(allReviews);
    } catch (error) {
      console.error("Fetch all reviews error", error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviewsPage = async (
    bookId,
    { cursor = null, limit = 5 } = {},
  ) => {
    if (!bookId) return null;
    const data = await getReviewsByBook(bookId, { cursor, limit });
    return data;
  };

  // Add Review
  const addNewReview = async (reviewData) => {
    try {
      setLoading(true);
      await addReview(reviewData);
      await fetchReviews(reviewData.bookId); // Refresh list for that book only
      toast.success("Review Submitted!");
      return { ok: true };
    } catch (error) {
      const msg = error?.response?.data?.msg || "Failed to add review";
      toast.error(msg);
      return { ok: false, errorMsg: msg };
    } finally {
      setLoading(false);
    }
  };

  // Delete Review
  const removeReview = async (reviewId, bookId) => {
    try {
      setLoading(true);
      await deleteReviewApi(reviewId);
      // Optimistically update UI
      setReviews((prev) => prev.filter((rev) => rev._id !== reviewId));
      toast.success("Review deleted successfully");
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Could not delete review");
      // Refetch to ensure consistency
      await fetchReviews(bookId);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update Review
  const editReview = async (reviewId, bookId, updatedData) => {
    try {
      setLoading(true);
      await updateReviewApi(reviewId, updatedData);
      await fetchReviews(bookId); // Refresh to get populated user data
      toast.success("Review updated!");
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Update failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Get Average Rating by Book
  const getAvgRatingByBook = (bookId) => {
    if (!reviews || reviews.length === 0) return "0.0";

    // Filter reviews belonging to this book
    const bookReviews = reviews.filter((r) => {
      const rBookId = r.book?._id || r.book;
      return String(rBookId) === String(bookId);
    });

    if (bookReviews.length === 0) return "0.0";

    const total = bookReviews.reduce(
      (sum, r) => sum + (Number(r.rating) || 0),
      0,
    );
    return (total / bookReviews.length).toFixed(1);
  };

const deleteUserReviewByAdmin = async (reviewId) => {
  try {
    await deleteUserReview(reviewId);
    toast.success("Review deleted successfully");
    await fetchAllUsersReviews(); 
  } catch (error) {
    console.error("Delete review full error:", error);
    console.error("Error response:", error.response); // Full error dekho
  }
};

  return (
    <ReviewContext.Provider
      value={{
        reviews,
        loading,
        addNewReview,
        fetchReviews,
        fetchReviewsPage,
        fetchAllReviews, // ✅ Export new function
        removeReview,
        editReview,
        getAvgRatingByBook,
        fetchAllUsersReviews,
        deleteUserReviewByAdmin,
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
};
