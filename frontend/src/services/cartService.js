import axios from "axios"; 

const API = "/api/cart";

const authHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getCartService = async () => {
  const { data } = await axios.get(API, authHeader());
  return data;
};

export const addToCartService = async (bookId) => {
  const { data } = await axios.post(
    `${API}/add`,
    { bookId },
    authHeader()
  );
  return data;
};

export const removeFromCartService = async (itemId) => {
  const { data } = await axios.delete(
    `${API}/${itemId}`,
    authHeader()
  );
  return data;
};

export const updateCartQuantityService = async (itemId, quantity) => {
  const { data } = await axios.put(
    `${API}/${itemId}`,
    { quantity },
    authHeader()
  );
  return data;
};
