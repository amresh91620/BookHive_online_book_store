import { useEffect, useState } from "react";
import { addBook, getAllBooks, deleteBook, updateBook } from "../../services/bookApi";
import toast from "react-hot-toast";
import { BookContext } from "./BookContext";



export const BookProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);


const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await getAllBooks();
      // Ensure we always set an array
      setBooks(res?.books || res?.data?.books || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


const createBook = async (bookData) => {
    try {
      setLoading(true);
      const res = await addBook(bookData);
      setBooks((prev) => [res.book, ...prev]);
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Failed to add book");
      return false;
    } finally {
      setLoading(false);
    }
  };


  const editBook = async (id, data) => {
    try {
      setLoading(true);
      const res = await updateBook(id, data);
      setBooks((prev) =>
        prev.map((book) => (book._id === id ? res.book : book))
      );
      toast.success("Book updated successfully");
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Failed to update book");
    } finally {
      setLoading(false);
    }
  };

  const removeBook = async (id) => {
    try {
      setLoading(true);
      await deleteBook(id);
      setBooks((prev) => prev.filter((book) => book._id !== id));
      toast.success("Book deleted");
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Failed to delete book");
    } finally {
      setLoading(false);
    }
  };

  // Auto fetch on mount
  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <BookContext.Provider
      value={{
        books,
        loading,
        fetchBooks,
        createBook,
        editBook,
        removeBook,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};
