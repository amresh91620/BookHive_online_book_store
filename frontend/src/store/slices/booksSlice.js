import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/services/api";
import { endpoints } from "@/services/endpoints";

const extractError = (error) =>
  error?.response?.data?.msg ||
  error?.response?.data?.error ||
  error?.message ||
  "Something went wrong";

export const fetchBooks = createAsyncThunk(
  "books/fetchBooks",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await api.get(endpoints.books.list, { params });
      return data;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  }
);

export const fetchCategories = createAsyncThunk(
  "books/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get(endpoints.books.categories);
      return data.categories || [];
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  }
);

export const fetchBookById = createAsyncThunk(
  "books/fetchBookById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(endpoints.books.detail(id));
      return data.book || data;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  }
);

export const createBook = createAsyncThunk(
  "books/createBook",
  async (payload, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          formData.append(key, value);
        }
      });
      const { data } = await api.post(endpoints.books.create, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.book;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  }
);

export const updateBook = createAsyncThunk(
  "books/updateBook",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      let body = payload;
      let config = {};
      if (payload?.coverImage instanceof File) {
        const formData = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            formData.append(key, value);
          }
        });
        body = formData;
        config = { headers: { "Content-Type": "multipart/form-data" } };
      }
      const { data } = await api.put(endpoints.books.update(id), body, config);
      return data.book;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  }
);

export const deleteBook = createAsyncThunk(
  "books/deleteBook",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(endpoints.books.remove(id));
      return id;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  }
);

const booksSlice = createSlice({
  name: "books",
  initialState: {
    items: [],
    total: 0,
    selected: null,
    categories: [],
    status: "idle",
    error: null,
  },
  reducers: {
    clearSelectedBook: (state) => {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.books || action.payload.items || [];
        state.total = action.payload.totalBooks || action.payload.total || state.items.length;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(fetchBookById.fulfilled, (state, action) => {
        state.selected = action.payload;
      })
      .addCase(createBook.fulfilled, (state, action) => {
        state.items = [action.payload, ...state.items];
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) state.items[index] = action.payload;
        if (state.selected?._id === action.payload._id) {
          state.selected = action.payload;
        }
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      });
  },
});

export const { clearSelectedBook } = booksSlice.actions;
export default booksSlice.reducer;
