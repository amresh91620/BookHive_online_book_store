import { useContext } from "react";
import { BookContext } from "../context/book/BookContext";

export const useBooks = () => {
  return useContext(BookContext);
};