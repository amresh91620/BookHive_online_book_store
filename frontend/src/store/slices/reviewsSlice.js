import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/services/api";
import { endpoints } from "@/services/endpoints";

const extractError = (error) =>
  error?.response?.data?.msg ||
  error?.response?.data?.error ||
  error?.message ||
  "Something went wrong";

export const fetchReviewsByBook = createAsyncThunk(
  "reviews/fetchReviewsByBook",
  async (bookId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(endpoints.reviews.byBook(bookId));
      return data;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  }
);

export const addReview = createAsyncThunk(
  "reviews/addReview",
  async (reviewData, { rejectWithValue }) => {
    try {
      const { data } = await api.post(endpoints.reviews.add, reviewData);
      return data;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  }
);

export const updateReview = createAsyncThunk(
  "reviews/updateReview",
  async ({ id, reviewData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(endpoints.reviews.update(id), reviewData);
      return data;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  }
);

export const deleteReview = createAsyncThunk(
  "reviews/deleteReview",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(endpoints.reviews.remove(id));
      return data;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  }
);

const reviewsSlice = createSlice({
  name: "reviews",
  initialState: {
    reviews: [],
    stats: {
      avgRating: 0,
      totalRatings: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    },
    loading: false,
    status: "idle",
    error: null,
  },
  reducers: {
    clearReviews: (state) => {
      state.reviews = [];
      state.stats = {
        avgRating: 0,
        totalRatings: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviewsByBook.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(fetchReviewsByBook.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.reviews = action.payload.reviews || [];
        state.stats = {
          avgRating: parseFloat(action.payload.avgRating) || 0,
          totalRatings: action.payload.totalRatings || 0,
          ratingDistribution: action.payload.ratingDistribution || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        };
      })
      .addCase(fetchReviewsByBook.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.review) {
          state.reviews.unshift(action.payload.review);
        }
      })
      .addCase(addReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        const index = state.reviews.findIndex(r => r._id === action.payload.review._id);
        if (index !== -1) {
          state.reviews[index] = action.payload.review;
        }
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter(r => r._id !== action.meta.arg);
      });
  },
});

export const { clearReviews } = reviewsSlice.actions;
export default reviewsSlice.reducer;
