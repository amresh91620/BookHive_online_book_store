import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import { endpoints } from "@/services/endpoints";

export const useAdminStats = () => {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const { data } = await api.get(endpoints.admin.dashboard);
      return data;
    },
  });
};

export const useAdminUsers = (params = {}) => {
  return useQuery({
    queryKey: ["admin", "users", params],
    queryFn: async () => {
      const { data } = await api.get(endpoints.admin.users, { params });
      return data;
    },
  });
};

export const useToggleUserBlock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, isBlocked }) => {
      const { data } = await api.put(endpoints.admin.toggleBlock(userId), { isBlocked });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
};

export const useAdminOrders = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["admin", "orders", params],
    queryFn: async () => {
      const { data } = await api.get(endpoints.admin.orders, { params });
      return data;
    },
    ...options,
  });
};

export const useUpdateAdminOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ orderId, status, note, trackingNumber, carrier, trackingUrl }) => {
      const payload = { status };
      if (note) payload.note = note;
      if (trackingNumber) payload.trackingNumber = trackingNumber;
      if (carrier) payload.carrier = carrier;
      if (trackingUrl) payload.trackingUrl = trackingUrl;
      
      const { data } = await api.put(endpoints.admin.updateOrderStatus(orderId), payload);
      return data;
    },
    onMutate: async ({ orderId, status }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["admin", "orders"] });

      // Snapshot previous value
      const previousOrders = queryClient.getQueryData(["admin", "orders", {}]);

      // Optimistically update
      queryClient.setQueryData(["admin", "orders", {}], (old) => {
        if (!old || !old.orders) return old;
        return {
          ...old,
          orders: old.orders.map(order =>
            order._id === orderId ? { ...order, status } : order
          )
        };
      });

      return { previousOrders };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousOrders) {
        queryClient.setQueryData(["admin", "orders", {}], context.previousOrders);
      }
    },
    onSuccess: () => {
      // Refetch to get updated data from server
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
    },
  });
};

export const useAdminReviews = (params = {}) => {
  return useQuery({
    queryKey: ["admin", "reviews", params],
    queryFn: async () => {
      const { data } = await api.get(endpoints.admin.reviews, { params });
      return data;
    },
  });
};

export const useDeleteAdminReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reviewId) => {
      const { data } = await api.delete(endpoints.admin.removeReview(reviewId));
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
    },
  });
};

export const useAdminMessages = (params = {}) => {
  return useQuery({
    queryKey: ["admin", "messages", params],
    queryFn: async () => {
      const { data } = await api.get(endpoints.admin.messages, { params });
      return data;
    },
  });
};

export const useDeleteAdminMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (messageId) => {
      const { data } = await api.delete(endpoints.admin.deleteMessage(messageId));
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "messages"] });
    },
  });
};
