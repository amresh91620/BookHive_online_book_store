import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/services/api";
import { endpoints } from "@/services/endpoints";

const extractError = (error) =>
  error?.response?.data?.msg ||
  error?.response?.data?.error ||
  error?.message ||
  "Something went wrong";

export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const { data } = await api.post(endpoints.orders.create, orderData);
      return data;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  }
);

export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get(endpoints.orders.list);
      return data;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  "orders/fetchOrderById",
  async (orderId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(endpoints.orders.detail(orderId));
      return data;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  }
);

export const cancelOrder = createAsyncThunk(
  "orders/cancelOrder",
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(endpoints.orders.cancel(id), { reason });
      return data;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    currentOrder: null,
    status: "idle",
    error: null,
  },
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentOrder = action.payload.order;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchOrders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders = action.payload.orders || [];
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.currentOrder = action.payload.order;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.currentOrder = action.payload.order;
        const index = state.orders.findIndex(o => o._id === action.payload.order._id);
        if (index !== -1) {
          state.orders[index] = action.payload.order;
        }
      });
  },
});

export const { clearCurrentOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
