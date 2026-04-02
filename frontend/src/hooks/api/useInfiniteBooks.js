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

      // Add price range filters if provided
      if (params.minPrice !== undefined) {
        queryParams.minPrice = params.minPrice;
      }
      if (params.maxPrice !== undefined) {
        queryParams.maxPrice = params.maxPrice;
      }

      // Add sort parameter if provided
      if (params.sortBy) {
        queryParams.sortBy = params.sortBy;
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
