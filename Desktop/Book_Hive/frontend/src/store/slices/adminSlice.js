import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/services/api";
import { endpoints } from "@/services/endpoints";

const extractError = (error) =>
  error?.response?.data?.msg ||
  error?.response?.data?.error ||
  error?.message ||
  "Something went wrong";

export const fetchAdminStats = createAsyncThunk(
  "admin/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get(endpoints.admin.dashboard);
      return data;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  }
);

export const fetchAdminUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get(endpoints.admin.users, { params });
      return data;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  }
);

export const toggleUserBlock = createAsyncThunk(
  "admin/toggleUserBlock",
  async ({ userId, isBlocked }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(endpoints.admin.toggleBlock(userId), { isBlocked });
      return data;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  }
);

export const fetchAdminOrders = createAsyncThunk(
  "admin/fetchOrders",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get(endpoints.admin.orders, { params });
      return data;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  }
);

export const fetchAdminReviews = createAsyncThunk(
  "admin/fetchReviews",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get(endpoints.admin.reviews, { params });
      return data;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  }
);

export const deleteAdminReview = createAsyncThunk(
  "admin/deleteReview",
  async (reviewId, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(endpoints.admin.removeReview(reviewId));
      return data;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  }
);

export const fetchAdminMessages = createAsyncThunk(
  "admin/fetchMessages",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get(endpoints.admin.messages, { params });
      return data;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  }
);

export const deleteAdminMessage = createAsyncThunk(
  "admin/deleteMessage",
  async (messageId, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(endpoints.admin.deleteMessage(messageId));
      return data;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "admin/updateOrderStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(endpoints.admin.updateOrderStatus(orderId), { status });
      return data;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    stats: null,
    users: [],
    usersTotal: 0,
    orders: [],
    ordersTotal: 0,
    reviews: [],
    reviewsTotal: 0,
    messages: [],
    messagesTotal: 0,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminStats.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.stats = action.payload;
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.users = action.payload.users || [];
        state.usersTotal = action.payload.total || 0;
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.orders = action.payload.orders || [];
        state.ordersTotal = action.payload.total || 0;
      })
      .addCase(fetchAdminReviews.fulfilled, (state, action) => {
        state.reviews = action.payload.reviews || [];
        state.reviewsTotal = action.payload.total || 0;
      })
      .addCase(fetchAdminMessages.fulfilled, (state, action) => {
        state.messages = action.payload.messages || [];
        state.messagesTotal = action.payload.total || 0;
      })
      .addCase(toggleUserBlock.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u._id === action.payload.user._id);
        if (index !== -1) {
          state.users[index] = action.payload.user;
        }
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex(o => o._id === action.payload.order._id);
        if (index !== -1) {
          state.orders[index] = action.payload.order;
        }
      });
  },
});

export default adminSlice.reducer;
