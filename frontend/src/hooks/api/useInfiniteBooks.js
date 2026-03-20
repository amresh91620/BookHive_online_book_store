import { useInfiniteQuery } from "@tanstack/react-query";
import api from "@/services/api";
import { endpoints } from "@/services/endpoints";

export const useInfiniteBooks = (params = {}) => {
  return useInfiniteQuery({
    queryKey: ["books", "infinite", params],
    queryFn: async ({ pageParam }) => {
      const queryParams = {
        ...params,
        cursor: true,
        limit: params.limit || 12,
      };
      
      if (pageParam) {
        queryParams.cursor = pageParam;
      }
      
      const { data } = await api.get(endpoints.books.list, { params: queryParams });
      return data;
    },
    getNextPageParam: (lastPage) => {
      // Return nextCursor if hasMore is true, otherwise undefined to stop fetching
      return lastPage.hasMore ? lastPage.nextCursor : undefined;
    },
    initialPageParam: null,
  });
};
