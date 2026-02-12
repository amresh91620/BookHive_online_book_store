import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { WishlistContext } from "./WishlistContext";
import {
  addToWishlistApi,
  getWishlist,
  removeFromWishlistApi,
} from "../../services/wishlistApi";
import { useAuth } from "../../hooks/useAuth";
import { getAuthToken } from "../../services/http";

export const WishlistProvider = ({ children }) => {
  const { user, logout } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const syncItems = useCallback((data) => {
    setItems(Array.isArray(data?.items) ? data.items : []);
  }, []);

  const fetchWishlist = useCallback(async () => {
    const token = getAuthToken();
    if (!user || !token) {
      setItems([]);
      return;
    }
    try {
      setLoading(true);
      const data = await getWishlist();
      syncItems(data);
    } catch (error) {
      if (error?.response?.status === 401) {
        setItems([]);
        logout();
        return;
      }
      console.error("Fetch wishlist error:", error);
    } finally {
      setLoading(false);
    }
  }, [user, logout, syncItems]);

  const addToWishlist = useCallback(
    async (bookId) => {
      const token = getAuthToken();
      if (!user || !token) {
        toast.error("Please login to use wishlist.");
        return { ok: false };
      }
      try {
        const data = await addToWishlistApi(bookId);
        syncItems(data);
        toast.success("Added to wishlist!");
        return { ok: true };
      } catch (error) {
        const msg = error?.response?.data?.msg || "Failed to add to wishlist";
        toast.error(msg);
        return { ok: false, msg };
      }
    },
    [user, syncItems],
  );

  const removeFromWishlist = useCallback(
    async (bookId, { silent = false } = {}) => {
      const token = getAuthToken();
      if (!user || !token) {
        setItems([]);
        return { ok: false };
      }
      try {
        const data = await removeFromWishlistApi(bookId);
        syncItems(data);
        if (!silent) toast.success("Removed from wishlist");
        return { ok: true };
      } catch (error) {
        const msg = error?.response?.data?.msg || "Failed to remove from wishlist";
        if (!silent) toast.error(msg);
        return { ok: false, msg };
      }
    },
    [user, syncItems],
  );

  const toggleWishlist = useCallback(
    async (bookId) => {
      const exists = items.some((item) => String(item._id) === String(bookId));
      if (exists) {
        return await removeFromWishlist(bookId);
      }
      return await addToWishlist(bookId);
    },
    [items, addToWishlist, removeFromWishlist],
  );

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const wishlistIds = useMemo(
    () => new Set(items.map((item) => String(item._id))),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      loading,
      fetchWishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      wishlistIds,
    }),
    [
      items,
      loading,
      fetchWishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      wishlistIds,
    ],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export default WishlistProvider;
