import http, { withAuth } from "./http";
const API = "/reviews";


export const getAllReviews = async () => {
  try {
    const res = await http.get(`${API}/`, withAuth());
    return res.data;
  } catch (error) {
    console.error("Get all review error:", error);
    throw error;
  }
};

// 1. Add New Review
export const addReview = async (data) => {
    try {
        const res = await http.post(`${API}/`, data, withAuth());
        return res.data;
    } catch (error) {
        console.error("Add review error:", error);
        throw error;
    }
};

// 2. Get Reviews by Book ID
export const getReviewsByBook = async (bookId, params = {}) => {
    try {
        const res = await http.get(`${API}/book/${bookId}`, { params });
        return res.data;
    } catch (error) {
        console.error("API error fetching reviews:", error);
        throw error;
    }
};

// 3. Update Review (Own)
export const updateReviewApi = async (reviewId, data) => {
    try {
        const res = await http.put(`${API}/${reviewId}`, data, withAuth());
        return res.data;
    } catch (error) {
        console.error("Update review error:", error);
        throw error;
    }
};

// 4. Delete Review (Own)
export const deleteReviewApi = async (reviewId) => {
    try {
        const res = await http.delete(`${API}/${reviewId}`, withAuth());
        return res.data;
    } catch (error) {
        console.error("Delete review error:", error);
        throw error;
    }
};

export const deleteUserReview = async (reviewId) => {
  try {
    const res = await http.delete(`${API}/delete/${reviewId}`, withAuth());
    return res.data;
  } catch (error) {
    console.error("Delete review error:", error);
    throw error;
  }
};
