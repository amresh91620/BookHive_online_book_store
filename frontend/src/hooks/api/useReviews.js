import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import { endpoints } from "@/services/endpoints";

export const useReviews = () => {
  return useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const { data } = await api.get(endpoints.reviews.list);
      return data;
    },
  });
};

export const useBookReviews = (bookId) => {
  return useQuery({
    queryKey: ["reviews", "book", bookId],
    queryFn: async () => {
      const { data } = await api.get(endpoints.reviews.byBook(bookId));
      return data;
    },
    enabled: !!bookId,
  });
};

export const useAddReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post(endpoints.reviews.add, payload);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      if (variables?.bookId) {
        queryClient.invalidateQueries({ queryKey: ["reviews", "book", variables.bookId] });
      }
    },
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }) => {
      const { data } = await api.put(endpoints.reviews.update(id), payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      await api.delete(endpoints.reviews.remove(id));
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
};
