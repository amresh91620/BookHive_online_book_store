import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { AddressContext } from "./AddressContext";
import {
  addAddressApi,
  deleteAddressApi,
  getAddressesApi,
  updateAddressApi,
} from "../../services/addressApi";
import { useAuth } from "../../hooks/useAuth";
import { getAuthToken } from "../../services/http";

export const AddressProvider = ({ children }) => {
  const { user, logout } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);

  const syncAddresses = useCallback((data) => {
    setAddresses(Array.isArray(data?.addresses) ? data.addresses : []);
  }, []);

  const fetchAddresses = useCallback(async () => {
    const token = getAuthToken();
    if (!user || !token) {
      setAddresses([]);
      return;
    }
    try {
      setLoading(true);
      const data = await getAddressesApi();
      syncAddresses(data);
    } catch (error) {
      if (error?.response?.status === 401) {
        setAddresses([]);
        logout();
        return;
      }
      console.error("Fetch addresses error:", error);
    } finally {
      setLoading(false);
    }
  }, [user, logout, syncAddresses]);

  const addAddress = useCallback(async (payload) => {
    try {
      setLoading(true);
      const data = await addAddressApi(payload);
      syncAddresses(data);
      toast.success(data?.msg || "Address added");
      return { ok: true };
    } catch (error) {
      const msg = error?.response?.data?.msg || "Failed to add address";
      toast.error(msg);
      return { ok: false, msg };
    } finally {
      setLoading(false);
    }
  }, [syncAddresses]);

  const updateAddress = useCallback(async (id, payload) => {
    try {
      setLoading(true);
      const data = await updateAddressApi(id, payload);
      syncAddresses(data);
      toast.success(data?.msg || "Address updated");
      return { ok: true };
    } catch (error) {
      const msg = error?.response?.data?.msg || "Failed to update address";
      toast.error(msg);
      return { ok: false, msg };
    } finally {
      setLoading(false);
    }
  }, [syncAddresses]);

  const deleteAddress = useCallback(async (id) => {
    try {
      setLoading(true);
      const data = await deleteAddressApi(id);
      syncAddresses(data);
      toast.success(data?.msg || "Address removed");
      return { ok: true };
    } catch (error) {
      const msg = error?.response?.data?.msg || "Failed to delete address";
      toast.error(msg);
      return { ok: false, msg };
    } finally {
      setLoading(false);
    }
  }, [syncAddresses]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const value = useMemo(
    () => ({
      addresses,
      loading,
      fetchAddresses,
      addAddress,
      updateAddress,
      deleteAddress,
    }),
    [addresses, loading, fetchAddresses, addAddress, updateAddress, deleteAddress],
  );

  return <AddressContext.Provider value={value}>{children}</AddressContext.Provider>;
};

export default AddressProvider;
