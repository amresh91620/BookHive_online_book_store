import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import { endpoints } from "@/services/endpoints";

export const useBlogComments = (blogId, params) =>
  useQuery({
    queryKey: ["blogComments", blogId, params],
    queryFn: async () => {
      const { data } = await api.get(endpoints.blogComments.list(blogId), {
        params,
      });
      return data;
    },
    enabled: !!blogId,
  });

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ blogId, content }) => {
      const { data } = await api.post(endpoints.blogComments.create(blogId), {
        content,
      });
      return data.comment;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["blogComments", variables.blogId],
      });
    },
  });
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ commentId, content }) => {
      const { data } = await api.put(
        endpoints.blogComments.update(commentId),
        { content }
      );
      return data.comment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogComments"] });
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (commentId) => {
      await api.delete(endpoints.blogComments.remove(commentId));
      return commentId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogComments"] });
    },
  });
};

export const useLikeComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (commentId) => {
      const { data } = await api.post(endpoints.blogComments.like(commentId));
      return { commentId, ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogComments"] });
    },
  });
};

export const useDislikeComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (commentId) => {
      const { data } = await api.post(
        endpoints.blogComments.dislike(commentId)
      );
      return { commentId, ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogComments"] });
    },
  });
};

// Admin hooks
export const useAdminBlogComments = (params) =>
  useQuery({
    queryKey: ["adminBlogComments", params],
    queryFn: async () => {
      const { data } = await api.get(endpoints.blogComments.adminList, {
        params,
      });
      return data;
    },
  });

export const useAdminDeleteComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (commentId) => {
      await api.delete(endpoints.blogComments.adminRemove(commentId));
      return commentId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminBlogComments"] });
      queryClient.invalidateQueries({ queryKey: ["blogComments"] });
    },
  });
};
