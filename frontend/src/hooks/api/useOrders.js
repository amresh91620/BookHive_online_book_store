import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import { endpoints } from "@/services/endpoints";
import { useSelector } from "react-redux";

export const useOrders = () => {
  const { user, token } = useSelector((state) => state.auth);

  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data } = await api.get(endpoints.orders.list);
      return data;
    },
    enabled: !!user && !!token,
    select: (data) => data.orders || [],
  });
};

export const useOrderById = (orderId) => {
  return useQuery({
    queryKey: ["orders", orderId],
    queryFn: async () => {
      const { data } = await api.get(endpoints.orders.detail(orderId));
      return data.order || data;
    },
    enabled: !!orderId,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderData) => {
      const { data } = await api.post(endpoints.orders.create, orderData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, reason }) => {
      const { data } = await api.post(endpoints.orders.cancel(id), { reason });
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      if (data?.order?._id) {
        queryClient.invalidateQueries({ queryKey: ["orders", data.order._id] });
      }
    },
  });
};

export const useCancelOrderItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ orderId, itemId, reason }) => {
      const { data } = await api.post(`/api/orders/${orderId}/items/${itemId}/cancel`, { reason });
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["orders", variables.orderId] });
    },
  });
};
