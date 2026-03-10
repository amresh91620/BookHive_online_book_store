import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/services/api";
import { endpoints } from "@/services/endpoints";
import { loadAuth, saveAuth, clearAuth } from "@/utils/storage";

const extractError = (error) =>
  error?.response?.data?.msg ||
  error?.response?.data?.error ||
  error?.message ||
  "Something went wrong";

const persisted = loadAuth();

export const sendRegisterOtp = createAsyncThunk(
  "auth/sendRegisterOtp",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post(endpoints.auth.sendRegisterOtp, payload);
      return data;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  }
);

export const verifyRegisterOtp = createAsyncThunk(
  "auth/verifyRegisterOtp",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post(endpoints.auth.verifyRegisterOtp, payload);
      return data;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post(endpoints.auth.register, payload);
      return data;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post(endpoints.auth.login, payload);
      const authData = { token: data.token, user: data.user };
      saveAuth(authData);
      return authData;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  }
);

export const sendForgotPasswordOtp = createAsyncThunk(
  "auth/sendForgotPasswordOtp",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post(endpoints.auth.sendForgotPasswordOtp, payload);
      return data;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post(endpoints.auth.resetPassword, payload);
      return data;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post(endpoints.auth.changePassword, payload);
      return data;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  }
);

export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      if (!auth.user || !auth.token) {
        return rejectWithValue("Not authenticated");
      }
      const { data } = await api.get(endpoints.auth.profile);
      const authData = { token: auth.token, user: data.user };
      saveAuth(authData);
      return data.user;
    } catch (error) {
      if (error?.response?.status === 401) {
        return rejectWithValue("Session expired");
      }
      return rejectWithValue(extractError(error));
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (payload, { rejectWithValue, getState }) => {
    try {
      const hasFile = payload?.profileImage instanceof File;
      let body = payload;
      let config = {};

      if (hasFile) {
        const formData = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, value);
          }
        });
        body = formData;
        config = { headers: { "Content-Type": "multipart/form-data" } };
      }

      const { data } = await api.put(endpoints.auth.profile, body, config);
      const token = getState().auth.token;
      saveAuth({ token, user: data.user });
      return data.user;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: persisted?.user || null,
    token: persisted?.token || null,
    status: "idle",
    error: null,
    otpStatus: "idle",
    passwordStatus: "idle",
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      clearAuth();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(sendRegisterOtp.pending, (state) => {
        state.otpStatus = "loading";
        state.error = null;
      })
      .addCase(sendRegisterOtp.fulfilled, (state) => {
        state.otpStatus = "succeeded";
      })
      .addCase(sendRegisterOtp.rejected, (state, action) => {
        state.otpStatus = "failed";
        state.error = action.payload;
      })
      .addCase(verifyRegisterOtp.pending, (state) => {
        state.otpStatus = "loading";
        state.error = null;
      })
      .addCase(verifyRegisterOtp.fulfilled, (state) => {
        state.otpStatus = "succeeded";
      })
      .addCase(verifyRegisterOtp.rejected, (state, action) => {
        state.otpStatus = "failed";
        state.error = action.payload;
      })
      .addCase(sendForgotPasswordOtp.pending, (state) => {
        state.passwordStatus = "loading";
        state.error = null;
      })
      .addCase(sendForgotPasswordOtp.fulfilled, (state) => {
        state.passwordStatus = "succeeded";
      })
      .addCase(sendForgotPasswordOtp.rejected, (state, action) => {
        state.passwordStatus = "failed";
        state.error = action.payload;
      })
      .addCase(resetPassword.pending, (state) => {
        state.passwordStatus = "loading";
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.passwordStatus = "succeeded";
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.passwordStatus = "failed";
        state.error = action.payload;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
