import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";

export const useActivityLogs = (params = {}) => {
  return useQuery({
    queryKey: ["activityLogs", params],
    queryFn: async () => {
      const { data } = await api.get("/api/activity-logs", { params });
      return data;
    },
  });
};

export const useActivityStats = () => {
  return useQuery({
    queryKey: ["activityStats"],
    queryFn: async () => {
      const { data } = await api.get("/api/activity-logs/stats");
      return data;
    },
  });
};
