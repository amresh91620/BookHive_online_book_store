import http, { withAuth } from "./http";

const API = "/orders";

export const createOrderApi = async (payload) => {
  try {
    const res = await http.post(API, payload, withAuth());
    return res.data;
  } catch (error) {
    console.error("Create order API error:", error);
    throw error;
  }
};

export const getMyOrdersApi = async () => {
  try {
    const res = await http.get(API, withAuth());
    return res.data;
  } catch (error) {
    console.error("Get orders API error:", error);
    throw error;
  }
};

export const getOrderByIdApi = async (id) => {
  try {
    const res = await http.get(`${API}/${id}`, withAuth());
    return res.data;
  } catch (error) {
    console.error("Get order API error:", error);
    throw error;
  }
};

export const cancelOrderApi = async (id) => {
  try {
    const res = await http.put(`${API}/${id}/cancel`, {}, withAuth());
    return res.data;
  } catch (error) {
    console.error("Cancel order API error:", error);
    throw error;
  }
};
