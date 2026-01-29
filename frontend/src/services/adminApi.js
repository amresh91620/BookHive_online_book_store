import axios from "axios";
const API = "http://localhost:5000/api/admin";

const authHeader = () => {
    const token = localStorage.getItem("token");
    return {
        Authorization: `Bearer ${token}`,
    };
};

export const dashboardData = async () => {
    try {
        const res = await axios.get(`${API}/Dashboard`, {
            headers: authHeader(),
        });
        return res.data;
    } catch (error) {
        console.error("Get Dashboard Data API error:", error);
        throw error;
    }
};

export const getAllUser = async () => {
    try {
        const res = await axios.get(`${API}/users`, {
            headers: authHeader(),
        });
        return res.data;
    } catch (error) {
        console.error("Get users API error:", error);
        throw error;
    }
};

export const deleteUser = async (id) => {
    try {
        const res = await axios.delete(`${API}/users/${id}`, {
            headers: authHeader(),
        });
        return res.data;
    } catch (error) {
        console.error("Delete Book API error:", error);
        throw error;
    }
};