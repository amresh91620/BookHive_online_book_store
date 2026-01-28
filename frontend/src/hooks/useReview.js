import { useContext } from "react";
import { ReviewContext } from "../context/review/ReviewContext";

export const useReview = () => {
  return useContext(ReviewContext);
};
