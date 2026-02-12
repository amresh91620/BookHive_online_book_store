import { useContext } from "react";
import { WishlistContext } from "../context/wishlist/WishlistContext";

export const useWishlist = () => {
  return useContext(WishlistContext);
};
