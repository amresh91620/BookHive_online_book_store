import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAllUser, deleteUser } from "../../services/adminApi";
import { AdminContext } from "./AdminContext";

export const AdminProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Users fetch karne ka function
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUser();
      // Backend response structure ke hisaab se data set karein
      const userData = res?.users || res?.data?.users || res?.data || [];
      setUsers(userData);
    } catch (error) {
      console.error("Fetch Users Error:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // User delete karne ka function
  const removeUser = async (id) => {
    try {
      setLoading(true);
      const res = await deleteUser(id); 

      // UI se bina refresh kiye hatane ke liye filter use karein
      setUsers((prev) => prev.filter((user) => user._id !== id));
      
      // Success message fix
      toast.success(res?.data?.msg || "User deleted successfully");
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error(error?.response?.data?.msg || "Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (token && user?.role === "admin") {
    fetchUsers();
  }
}, []);

  return (
    <AdminContext.Provider
      value={{
        users,
        loading,
        fetchUsers,
        removeUser,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export default AdminProvider;