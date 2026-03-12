import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import { endpoints } from "@/services/endpoints";
import { useSelector } from "react-redux";

export const useWishlist = () => {
  const { user, token } = useSelector((state) => state.auth);

  return useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      if (!user || !token) {
        return [];
      }
      const { data } = await api.get(endpoints.wishlist.get);
      return data.wishlist || [];
    },
    enabled: !!user && !!token,
    initialData: [],
  });
};

export const useAddToWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (bookId) => {
      const { data } = await api.post(endpoints.wishlist.add, { bookId });
      return data.wishlist || [];
    },
    onMutate: async (bookId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["wishlist"] });

      // Snapshot the previous value
      const previousWishlist = queryClient.getQueryData(["wishlist"]);

      // Optimistically add the book
      queryClient.setQueryData(["wishlist"], (old = []) => {
        // Check if already exists
        if (old.some(item => item._id === bookId)) {
          return old;
        }
        return [...old, { _id: bookId }];
      });

      return { previousWishlist };
    },
    onError: (err, bookId, context) => {
      // Rollback on error
      if (context?.previousWishlist !== undefined) {
        queryClient.setQueryData(["wishlist"], context.previousWishlist);
      }
    },
    onSuccess: (data) => {
      // Update with actual data from server
      queryClient.setQueryData(["wishlist"], data);
    },
  });
};

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (bookId) => {
      const { data } = await api.delete(endpoints.wishlist.remove(bookId));
      return data.wishlist || [];
    },
    onMutate: async (bookId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["wishlist"] });

      // Snapshot the previous value
      const previousWishlist = queryClient.getQueryData(["wishlist"]);

      // Optimistically remove the book
      queryClient.setQueryData(["wishlist"], (old = []) => {
        return old.filter(item => item._id !== bookId);
      });

      return { previousWishlist };
    },
    onError: (err, bookId, context) => {
      // Rollback on error
      if (context?.previousWishlist !== undefined) {
        queryClient.setQueryData(["wishlist"], context.previousWishlist);
      }
    },
    onSuccess: (data) => {
      // Update with actual data from server
      queryClient.setQueryData(["wishlist"], data);
    },
  });
};
