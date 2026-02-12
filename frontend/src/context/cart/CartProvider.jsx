import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getAuthToken } from "../../services/http";
import {
  getCartService,
  addToCartService,
  removeFromCartService,
  updateCartQuantityService,
} from "../../services/cartService";
import { CartContext } from "./CartContext";

export const CartProvider = ({ children }) => {
  const { user, logout } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    const token = getAuthToken();
    if (!user || !token) {
      setCart({ items: [] });
      return;
    }
    
    try {
      setLoading(true);
      const data = await getCartService();

      const safeItems = Array.isArray(data?.items) 
        ? data.items.map(item => ({
            ...item,
            quantity: item.quantity || 1,
            book: item.book ? {
              _id: item.book._id,
              title: item.book.title || "Untitled",
              author: item.book.author || "Unknown",
              price: Number(item.book.price) || 0,
              coverImage: item.book.coverImage || "/placeholder.png",
              description: item.book.description || "",
              pages: Number(item.book.pages) || 0,
              categories: item.book.categories || "N/A",
              publishedDate: item.book.publishedDate || new Date().toISOString(),
              isbn: item.book.isbn || "N/A",
              publisher: item.book.publisher || "Unknown Publisher",
              language: item.book.language || "English",
              rating: Number(item.book.rating) || 0,
              stock: Number(item.book.stock) || 0,
            } : null
          }))
        : [];

      setCart({ items: safeItems });
    } catch (err) {
      // Silently handle 401 errors (user not logged in)
      if (err?.response?.status === 401) {
        setCart({ items: [] });
        logout();
        return;
      }
      console.error("Error fetching cart:", err);
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  }, [user, logout]);

  useEffect(() => {
    // Only fetch cart if user is logged in
    const token = getAuthToken();
    if (user && token) {
      fetchCart();
    } else {
      // Clear cart when user logs out
      setCart({ items: [] });
    }
  }, [user, fetchCart]);

  const addToCart = useCallback(async (bookId) => {
    try {
      setLoading(true);
      const data = await addToCartService(bookId);
      
      const safeItems = Array.isArray(data?.items) 
        ? data.items.map(item => ({
            ...item,
            quantity: item.quantity || 1,
            book: item.book ? {
              _id: item.book._id,
              title: item.book.title || "Untitled",
              author: item.book.author || "Unknown",
              price: Number(item.book.price) || 0,
              coverImage: item.book.coverImage || "/placeholder.png",
              description: item.book.description || "",
              pages: Number(item.book.pages) || 0,
              categories: item.book.categories || "N/A",
              publishedDate: item.book.publishedDate || new Date().toISOString(),
              isbn: item.book.isbn || "N/A",
              publisher: item.book.publisher || "Unknown Publisher",
              language: item.book.language || "English",
              rating: Number(item.book.rating) || 0,
              stock: Number(item.book.stock) || 0,
            } : null
          }))
        : [];

      setCart({ items: safeItems });
    } catch (err) {
      console.error("Error adding to cart:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const removeFromCart = useCallback(async (itemId) => {
    try {
      setLoading(true);
      const data = await removeFromCartService(itemId);
      
      const safeItems = Array.isArray(data?.items) 
        ? data.items.map(item => ({
            ...item,
            quantity: item.quantity || 1,
            book: item.book || {}
          }))
        : [];

      setCart({ items: safeItems });
    } catch (err) {
      console.error("Error removing from cart:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateQuantity = useCallback(async (itemId, quantity) => {
    if (quantity < 1) return;
    
    try {
      setLoading(true);
      const data = await updateCartQuantityService(itemId, quantity);
      
      const safeItems = Array.isArray(data?.items) 
        ? data.items.map(item => ({
            ...item,
            quantity: item.quantity || 1,
            book: item.book || {}
          }))
        : [];

      setCart({ items: safeItems });
    } catch (err) {
      console.error("Error updating quantity:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const items = cart?.items || [];

  const cartCount = items.reduce(
    (total, item) => total + (item.quantity || 0),
    0
  );

  const cartTotal = items.reduce(
    (total, item) =>
      total + (item.book?.price || 0) * (item.quantity || 0),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart: { items },
        cartCount,
        cartTotal,
        loading,
        fetchCart,
        addToCart,
        removeFromCart,
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
