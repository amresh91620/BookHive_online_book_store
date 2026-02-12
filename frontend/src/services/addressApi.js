import http, { withAuth } from "./http";

const API = "/address";

export const getAddressesApi = async () => {
  const res = await http.get(API, withAuth());
  return res.data;
};

export const addAddressApi = async (payload) => {
  const res = await http.post(API, payload, withAuth());
  return res.data;
};

export const updateAddressApi = async (id, payload) => {
  const res = await http.put(`${API}/${id}`, payload, withAuth());
  return res.data;
};

export const deleteAddressApi = async (id) => {
  const res = await http.delete(`${API}/${id}`, withAuth());
  return res.data;
};
