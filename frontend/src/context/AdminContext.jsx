import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAllUser } from "../services/adminApi";

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUser();
      setUsers(res?.users || res?.data?.users || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
useEffect(() => {
    fetchUsers(); 
  }, []);

  return (
    <AdminContext.Provider
      value={{
        users,
        loading,
        fetchUsers 
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  return useContext(AdminContext);
};
