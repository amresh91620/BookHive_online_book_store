import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAllUser, deleteUser,dashboardData } from "../../services/adminApi";
import { getUserAllMessages,deleteUserMessage } from "../../services/authApi";
import { AdminContext } from "./AdminContext";

export const AdminProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statsData, setStatsData] = useState({
  totalUsers: 0,
  totalBooks: 0,
  totalReviews: 0
});

  const fetchDashboardStats = async () => {
  try {
    setLoading(true);
    const data = await dashboardData(); 
    setStatsData(data); 
  } catch (error) {
    console.error("Fetch Error:", error);
  } finally {
    setLoading(false);
  }
};

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
  
  const fetchAllMessages = async () => {
  try {
    setLoading(true);
    const res = await getUserAllMessages();
    const messagesData = res?.messages || res?.data?.messages || res?.data || [];
    setMessages(messagesData);
  } catch (error) {
    console.error("Fetch Messages Error:", error);
  } finally {
    setLoading(false);
  }
};

const removeMessage = async(id) => {
  try {
    setLoading(true);
    await deleteUserMessage(id);
    setMessages(prev => prev.filter(msg => msg._id !== id));
    toast.success("Message deleted successfully");
  } catch (error) {
    console.error("Delete Message Error:", error);
    toast.error(error?.response?.data?.msg || "Failed to delete message");
  } finally {
    setLoading(false);
  }
};

 useEffect(() => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (token && user?.role === "admin") {
    fetchUsers();
    fetchDashboardStats();
  }
}, []);

  return (
    <AdminContext.Provider
      value={{
        users,
        loading,
        fetchUsers,
        removeUser,
        fetchDashboardStats,
        statsData,
        fetchAllMessages,
        removeMessage,
        messages
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export default AdminProvider;