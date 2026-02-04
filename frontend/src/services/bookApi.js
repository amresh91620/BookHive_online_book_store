import axios from "axios";

const API = "/api/books";

const authHeader = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const addBook = async (data) => {
  try {
    const res = await axios.post(`${API}/add-book`, data, {
      headers: {
        ...authHeader(),
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Add Book API error:", error);
    throw error;
  }
};

export const getAllBooks = async (params = {}) => {
  try {
    const res = await axios.get(`${API}/`, { params });
    return res.data;
  } catch (error) {
    console.error("Get Books API error:", error);
    throw error;
  }
};

export const updateBook = async (id, data) => {
  try {
    const res = await axios.put(`${API}/update-book/${id}`, data, {
      headers: {
        ...authHeader(),
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Update Book API error:", error);
    throw error;
  }
};

export const deleteBook = async (id) => {
  try {
    const res = await axios.delete(`${API}/delete-book/${id}`, {
      headers: authHeader(),
    });
    return res.data;
  } catch (error) {
    console.error("Delete Book API error:", error);
    throw error;
  }
};
