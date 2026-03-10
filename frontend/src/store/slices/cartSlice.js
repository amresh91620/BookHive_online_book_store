import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/services/api";
import { endpoints } from "@/services/endpoints";

const extractError = (error) =>
  error?.response?.data?.msg ||
  error?.response?.data?.error ||
  error?.message ||
  "Something went wrong";

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      if (!auth.user || !auth.token) {
        return { items: [] };
      }
      const { data } = await api.get(endpoints.cart.get);
      return data;
    } catch (error) {
      if (error?.response?.status === 401) {
        return { items: [] };
      }
      return rejectWithValue(extractError(error));
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (bookId, { rejectWithValue }) => {
    try {
      const { data } = await api.post(endpoints.cart.add, { bookId });
      return data;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (itemId, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(endpoints.cart.remove(itemId));
      return data;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  }
);

export const updateCartQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(endpoints.cart.update(itemId), { quantity });
      return data;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.items || [];
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
