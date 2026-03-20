import { useInfiniteQuery } from "@tanstack/react-query";
import api from "@/services/api";
import { endpoints } from "@/services/endpoints";

export const useInfiniteBlogs = (params = {}) => {
  return useInfiniteQuery({
    queryKey: ["blogs", "infinite", params],
    queryFn: async ({ pageParam }) => {
      const queryParams = {
        ...params,
        cursor: true,
        limit: params.limit || 9,
      };
      
      if (pageParam) {
        queryParams.cursor = pageParam;
      }
      
      const { data } = await api.get(endpoints.blogs.list, { params: queryParams });
      return data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextCursor : undefined;
    },
    initialPageParam: null,
  });
};
