import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";

const store = configureStore({
  reducer: {
    // CLIENT-SIDE state — managed by Redux
    auth: authReducer,
    // SERVER-SIDE state is now managed by React Query hooks in @/hooks/api/*
  },
});

export default store;
