import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import { endpoints } from "@/services/endpoints";

export const useBooksList = (params) => {
  return useQuery({
    queryKey: ["books", "list", params],
    queryFn: async () => {
      const { data } = await api.get(endpoints.books.list, { params });
      return data;
    },
  });
};

export const useBookStats = () => {
  return useQuery({
    queryKey: ["books", "stats"],
    queryFn: async () => {
      const { data } = await api.get(endpoints.books.stats);
      return data;
    },
  });
};

export const useBookCategories = () => {
  return useQuery({
    queryKey: ["books", "categories"],
    queryFn: async () => {
      const { data } = await api.get(endpoints.books.categories);
      return data.categories || [];
    },
  });
};

export const useBookDetails = (id) => {
  return useQuery({
    queryKey: ["books", "detail", id],
    queryFn: async () => {
      const { data } = await api.get(endpoints.books.detail(id));
      return data.book || data;
    },
    enabled: !!id,
  });
};

export const useCreateBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        // For aboutBook and aboutAuthor, always include them (even if empty)
        if (key === 'aboutBook' || key === 'aboutAuthor') {
          formData.append(key, value || '');
        }
        // Skip undefined, null, and empty strings for other fields
        else if (value !== undefined && value !== null && value !== "") {
          // Handle boolean values properly
          if (typeof value === 'boolean') {
            formData.append(key, value.toString());
          } else {
            formData.append(key, value);
          }
        }
      });
      
      const { data } = await api.post(endpoints.books.create, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.book;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books", "list"] });
      queryClient.invalidateQueries({ queryKey: ["books", "stats"] });
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      console.error('Error response:', error?.response?.data);
    }
  });
};

export const useUpdateBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }) => {
      let body = payload;
      let config = {};
      if (payload?.coverImage instanceof File) {
        const formData = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
          // For aboutBook and aboutAuthor, always include them
          if (key === 'aboutBook' || key === 'aboutAuthor') {
            formData.append(key, value || '');
          }
          // Skip undefined, null, and empty strings for other fields
          else if (value !== undefined && value !== null && value !== "") {
            formData.append(key, value);
          }
        });
        body = formData;
        config = { headers: { "Content-Type": "multipart/form-data" } };
      }
      const { data } = await api.put(endpoints.books.update(id), body, config);
      return data.book;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["books", "list"] });
      queryClient.invalidateQueries({ queryKey: ["books", "detail", data._id] });
      queryClient.invalidateQueries({ queryKey: ["books", "stats"] });
    },
  });
};

export const useDeleteBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      await api.delete(endpoints.books.remove(id));
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books", "list"] });
      queryClient.invalidateQueries({ queryKey: ["books", "stats"] });
    },
  });
};
