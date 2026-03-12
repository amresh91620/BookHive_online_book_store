import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import { endpoints } from "@/services/endpoints";
import { useSelector } from "react-redux";

export const useCart = () => {
  const { user, token } = useSelector((state) => state.auth);
  
  return useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      if (!user || !token) {
        return { items: [] };
      }
      const { data } = await api.get(endpoints.cart.get);
      return data;
    },
    // Only fetch if authenticated
    enabled: !!user && !!token,
    // Provide initial empty cart if not authenticated to avoid loading states
    initialData: !user || !token ? { items: [] } : undefined,
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (bookId) => {
      const { data } = await api.post(endpoints.cart.add, { bookId });
      return data;
    },
    onMutate: async (bookId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["cart"] });

      // Snapshot the previous value
      const previousCart = queryClient.getQueryData(["cart"]);

      // Optimistically update to the new value
      queryClient.setQueryData(["cart"], (old) => {
        if (!old || !old.items) return old;
        
        // Check if item already exists
        const existingItem = old.items.find(item => item.book._id === bookId);
        
        if (existingItem) {
          // Increment quantity if exists
          return {
            ...old,
            items: old.items.map(item =>
              item.book._id === bookId
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          };
        } else {
          // Add new item (we don't have full book data, server will return it)
          return old;
        }
      });

      return { previousCart };
    },
    onError: (err, bookId, context) => {
      // Rollback to the previous value on error
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
    },
    onSuccess: (data) => {
      // Update with server response
      queryClient.setQueryData(["cart"], data);
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (itemId) => {
      const { data } = await api.delete(endpoints.cart.remove(itemId));
      return data;
    },
    onMutate: async (itemId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["cart"] });

      // Snapshot the previous value
      const previousCart = queryClient.getQueryData(["cart"]);

      // Optimistically remove the item
      queryClient.setQueryData(["cart"], (old) => {
        if (!old || !old.items) return old;
        return {
          ...old,
          items: old.items.filter(item => item._id !== itemId)
        };
      });

      return { previousCart };
    },
    onError: (err, itemId, context) => {
      // Rollback on error
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["cart"], data);
    },
  });
};

export const useUpdateCartQuantity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ itemId, quantity }) => {
      const { data } = await api.put(endpoints.cart.update(itemId), { quantity });
      return data;
    },
    onMutate: async ({ itemId, quantity }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["cart"] });

      // Snapshot the previous value
      const previousCart = queryClient.getQueryData(["cart"]);

      // Optimistically update the quantity
      queryClient.setQueryData(["cart"], (old) => {
        if (!old || !old.items) return old;
        return {
          ...old,
          items: old.items.map(item =>
            item._id === itemId
              ? { ...item, quantity }
              : item
          )
        };
      });

      return { previousCart };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["cart"], data);
    },
  });
};
