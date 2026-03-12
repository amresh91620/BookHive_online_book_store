import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import { endpoints } from "@/services/endpoints";
import { useSelector, useDispatch } from "react-redux";
import { saveAuth } from "@/utils/storage";
import { logout as reduxLogout } from "@/store/slices/authSlice";

/**
 * Hook to fetch the current user's profile from the server.
 * The auth token/user identity is still kept in Redux for quick "is logged in" checks.
 */
export const useProfile = () => {
  const { user, token } = useSelector((state) => state.auth);

  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await api.get(endpoints.auth.profile);
      // Keep localStorage in sync
      saveAuth({ token, user: data.user });
      return data.user;
    },
    enabled: !!user && !!token,
    // Avoid unnecessary re-fetches; auth data rarely changes
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { token } = useSelector((state) => state.auth);

  return useMutation({
    mutationFn: async (payload) => {
      const hasFile = payload?.profileImage instanceof File;
      let body = payload;
      let config = {};
      if (hasFile) {
        const formData = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, value);
          }
        });
        body = formData;
        config = { headers: { "Content-Type": "multipart/form-data" } };
      }
      const { data } = await api.put(endpoints.auth.profile, body, config);
      saveAuth({ token, user: data.user });
      return data.user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post(endpoints.auth.changePassword, payload);
      return data;
    },
  });
};

export const useLogout = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return () => {
    dispatch(reduxLogout());
    // Clear all server-side cached data on logout
    queryClient.clear();
  };
};
