import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/services/api";
import { endpoints } from "@/services/endpoints";

const extractError = (error) =>
  error?.response?.data?.msg ||
  error?.response?.data?.error ||
  error?.message ||
  "Something went wrong";

export const fetchAddresses = createAsyncThunk(
  "address/fetchAddresses",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      if (!auth.user || !auth.token) {
        return { addresses: [] };
      }
      const { data } = await api.get(endpoints.address.get);
      return data;
    } catch (error) {
      if (error?.response?.status === 401) {
        return { addresses: [] };
      }
      return rejectWithValue(extractError(error));
    }
  }
);

export const addAddress = createAsyncThunk(
  "address/addAddress",
  async (addressData, { rejectWithValue }) => {
    try {
      const { data } = await api.post(endpoints.address.add, addressData);
      return data;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  }
);

export const updateAddress = createAsyncThunk(
  "address/updateAddress",
  async ({ id, addressData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(endpoints.address.update(id), addressData);
      return data;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  }
);

export const deleteAddress = createAsyncThunk(
  "address/deleteAddress",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(endpoints.address.remove(id));
      return data;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState: {
    addresses: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddresses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.addresses = action.payload.addresses || [];
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.addresses = action.payload.addresses || [];
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.addresses = action.payload.addresses || [];
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.addresses = action.payload.addresses || [];
      });
  },
});

export default addressSlice.reducer;
