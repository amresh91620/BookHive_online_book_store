import http, { withAuth } from "./http";

const API = "/wishlist";

export const getWishlist = async () => {
  const res = await http.get(API, withAuth());
  return res.data;
};

export const addToWishlistApi = async (bookId) => {
  const res = await http.post(`${API}/add`, { bookId }, withAuth());
  return res.data;
};

export const removeFromWishlistApi = async (bookId) => {
  const res = await http.delete(`${API}/remove/${bookId}`, withAuth());
  return res.data;
};
