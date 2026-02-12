import http, { withAuth } from "./http";

const API = "/cart";

export const getCartService = async () => {
  const { data } = await http.get(API, withAuth());
  return data;
};

export const addToCartService = async (bookId) => {
  const { data } = await http.post(`${API}/add`, { bookId }, withAuth());
  return data;
};

export const removeFromCartService = async (itemId) => {
  const { data } = await http.delete(`${API}/${itemId}`, withAuth());
  return data;
};

export const updateCartQuantityService = async (itemId, quantity) => {
  const { data } = await http.put(`${API}/${itemId}`, { quantity }, withAuth());
  return data;
};
