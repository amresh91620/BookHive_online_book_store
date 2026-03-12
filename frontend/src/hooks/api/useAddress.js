import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import { endpoints } from "@/services/endpoints";
import { useSelector } from "react-redux";

export const useAddresses = () => {
  const { user, token } = useSelector((state) => state.auth);

  return useQuery({
    queryKey: ["addresses"],
    queryFn: async () => {
      const { data } = await api.get(endpoints.address.get);
      return data.addresses || [];
    },
    enabled: !!user && !!token,
    initialData: !user || !token ? [] : undefined,
  });
};

export const useAddAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (addressData) => {
      const { data } = await api.post(endpoints.address.add, addressData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, addressData }) => {
      const { data } = await api.put(endpoints.address.update(id), addressData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.delete(endpoints.address.remove(id));
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });
};
