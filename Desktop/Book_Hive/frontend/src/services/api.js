import axios from "axios";
import { API_BASE } from "./endpoints";
import { getToken, clearAuth } from "@/utils/storage";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      // Only clear auth if it's not a fetch cart/wishlist/orders/profile request
      const url = error?.config?.url || "";
      const isProtectedFetch = url.includes("/cart") || 
                               url.includes("/wishlist") || 
                               url.includes("/orders") ||
                               url.includes("/profile") ||
                               url.includes("/address");
      
      if (!isProtectedFetch) {
        clearAuth();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
