import axios from "axios";

const http = axios.create({
  baseURL: "/api",
});

export const getAuthToken = () =>
  localStorage.getItem("token") || sessionStorage.getItem("token");

export const authHeader = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const withAuth = (config = {}) => ({
  ...config,
  headers: {
    ...config.headers,
    ...authHeader(),
  },
});

export default http;
