import http, { withAuth } from "./http";

const API = "/books";

export const addBook = async (data) => {
  try {
    const res = await http.post(
      `${API}/add-book`,
      data,
      withAuth({
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    );
    return res.data;
  } catch (error) {
    console.error("Add Book API error:", error);
    throw error;
  }
};

export const getAllBooks = async (params = {}) => {
  try {
    const res = await http.get(`${API}/`, { params });
    return res.data;
  } catch (error) {
    console.error("Get Books API error:", error);
    throw error;
  }
};

export const updateBook = async (id, data) => {
  try {
    const res = await http.put(
      `${API}/update-book/${id}`,
      data,
      withAuth({
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    );
    return res.data;
  } catch (error) {
    console.error("Update Book API error:", error);
    throw error;
  }
};

export const deleteBook = async (id) => {
  try {
    const res = await http.delete(`${API}/delete-book/${id}`, withAuth());
    return res.data;
  } catch (error) {
    console.error("Delete Book API error:", error);
    throw error;
  }
};
