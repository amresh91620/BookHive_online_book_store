import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import { endpoints } from "@/services/endpoints";
import { useSelector } from "react-redux";

const getWishlistQueryKey = (userId) => ["wishlist", userId || "guest"];

export const useWishlist = () => {
  const { user, token } = useSelector((state) => state.auth);
  const isAuthenticated = Boolean(user && token);

  return useQuery({
    queryKey: getWishlistQueryKey(user?._id),
    queryFn: async () => {
      const { data } = await api.get(endpoints.wishlist.get);
      return data.wishlist || [];
    },
    enabled: isAuthenticated,
    initialData: isAuthenticated ? undefined : [],
  });
};

export const useAddToWishlist = () => {
  const { user } = useSelector((state) => state.auth);
  const queryClient = useQueryClient();
  const wishlistQueryKey = getWishlistQueryKey(user?._id);

  return useMutation({
    mutationFn: async (bookId) => {
      const { data } = await api.post(endpoints.wishlist.add, { bookId });
      return data.wishlist || [];
    },
    onSuccess: (data) => {
      queryClient.setQueryData(wishlistQueryKey, data);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: wishlistQueryKey });
    },
  });
};

export const useRemoveFromWishlist = () => {
  const { user } = useSelector((state) => state.auth);
  const queryClient = useQueryClient();
  const wishlistQueryKey = getWishlistQueryKey(user?._id);

  return useMutation({
    mutationFn: async (bookId) => {
      const { data } = await api.delete(endpoints.wishlist.remove(bookId));
      return data.wishlist || [];
    },
    onSuccess: (data) => {
      queryClient.setQueryData(wishlistQueryKey, data);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: wishlistQueryKey });
    },
  });
};
