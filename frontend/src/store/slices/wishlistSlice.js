import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/services/api";
import { endpoints } from "@/services/endpoints";

const extractError = (error) =>
  error?.response?.data?.msg ||
  error?.response?.data?.error ||
  error?.message ||
  "Something went wrong";

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      if (!auth.user || !auth.token) {
        return { wishlist: [] };
      }
      const { data } = await api.get(endpoints.wishlist.get);
      return data;
    } catch (error) {
      if (error?.response?.status === 401) {
        return { wishlist: [] };
      }
      return rejectWithValue(extractError(error));
    }
  }
);

export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async (bookId, { rejectWithValue }) => {
    try {
      const { data } = await api.post(endpoints.wishlist.add, { bookId });
      return data;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (bookId, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(endpoints.wishlist.remove(bookId));
      return data;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.wishlist || action.payload.items || [];
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.items = action.payload.wishlist || action.payload.items || [];
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = action.payload.wishlist || action.payload.items || [];
      });
  },
});

export default wishlistSlice.reducer;
