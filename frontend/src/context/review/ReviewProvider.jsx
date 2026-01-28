import React, { useState } from "react";
import { 
    addReview, 
    getReviewsByBook, 
    updateReviewApi, 
    deleteReviewApi 
} from "../../services/reviewApi";
import toast from "react-hot-toast";
import { ReviewContext } from "./ReviewContext";


export const ReviewProvider = ({ children }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch Reviews
    const fetchReviews = async (bookId) => {
        if (!bookId) return;
        try {
            setLoading(true);
            const data = await getReviewsByBook(bookId);
            console.log("Fetched reviews:", data); // ✅ Debug log
            setReviews(data);
        } catch (error) {
            console.error("Fetch reviews error", error);
            toast.error("Failed to load reviews");
        } finally {
            setLoading(false);
        }
    };

    // Add Review
    const addNewReview = async (reviewData) => {
        try {
            setLoading(true);
            await addReview(reviewData);
            await fetchReviews(reviewData.bookId); // Refresh list
            toast.success("Review Submitted!");
            return true;
        } catch (error) {
            toast.error(error?.response?.data?.msg || "Failed to add review");
            return false;
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

    return (
        <ReviewContext.Provider 
            value={{ 
                reviews, 
                loading, 
                addNewReview, 
                fetchReviews, 
                removeReview, 
                editReview 
            }}
        >
            {children}
        </ReviewContext.Provider>
    );
};
