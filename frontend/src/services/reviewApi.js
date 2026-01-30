import axios from "axios";
const API = "/api/reviews";

const authHeader = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
};


export const getAllReviews = async () => {
  try {
    const res = await axios.get(`${API}/`, {
      headers: { ...authHeader() },
    });
    return res.data;
  } catch (error) {
    console.error("Get all review error:", error);
    throw error;
  }
};

// 1. Add New Review
export const addReview = async (data) => {
    try {
        const res = await axios.post(`${API}/`, data, {
            headers: { ...authHeader() },
        });
        return res.data;
    } catch (error) {
        console.error("Add review error:", error);
        throw error;
    }
};

// 2. Get Reviews by Book ID
export const getReviewsByBook = async (bookId) => {
    try {
        const res = await axios.get(`${API}/book/${bookId}`);
        return res.data;
    } catch (error) {
        console.error("API error fetching reviews:", error);
        throw error;
    }
};

// 3. Update Review (Own)
export const updateReviewApi = async (reviewId, data) => {
    try {
        const res = await axios.put(`${API}/${reviewId}`, data, {
            headers: { ...authHeader() },
        });
        return res.data;
    } catch (error) {
        console.error("Update review error:", error);
        throw error;
    }
};

// 4. Delete Review (Own)
export const deleteReviewApi = async (reviewId) => {
    try {
        const res = await axios.delete(`${API}/${reviewId}`, {
            headers: { ...authHeader() },
        });
        return res.data;
    } catch (error) {
        console.error("Delete review error:", error);
        throw error;
    }
};

export const deleteUserReview = async (reviewId) => {
  try {
    const res = await axios.delete(`${API}/delete/${reviewId}`, {
      headers: { ...authHeader() },
    });
    return res.data;
  } catch (error) {
    console.error("Delete review error:", error);
    throw error;
  }
};