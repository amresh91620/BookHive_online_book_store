import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import { endpoints } from "@/services/endpoints";

export const useBlogsList = (params) =>
  useQuery({
    queryKey: ["blogs", "list", params],
    queryFn: async () => {
      const { data } = await api.get(endpoints.blogs.list, { params });
      return data;
    },
  });

export const useBlogCategories = () =>
  useQuery({
    queryKey: ["blogs", "categories"],
    queryFn: async () => {
      const { data } = await api.get(endpoints.blogs.categories);
      return data.categories || [];
    },
  });

export const useBlogDetails = (id) =>
  useQuery({
    queryKey: ["blogs", "detail", id],
    queryFn: async () => {
      const { data } = await api.get(endpoints.blogs.detail(id));
      return data.blog;
    },
    enabled: !!id,
  });

export const useCreateBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          formData.append(key, value);
        }
      });
      const { data } = await api.post(endpoints.blogs.create, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.blog;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["blogs"] }),
  });
};

export const useUpdateBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }) => {
      let body = payload;
      let config = {};
      if (payload?.coverImage instanceof File) {
        const formData = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            formData.append(key, value);
          }
        });
        body = formData;
        config = { headers: { "Content-Type": "multipart/form-data" } };
      }
      const { data } = await api.put(endpoints.blogs.update(id), body, config);
      return data.blog;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["blogs"] }),
  });
};

export const useDeleteBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      await api.delete(endpoints.blogs.remove(id));
      return id;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["blogs"] }),
  });
};
