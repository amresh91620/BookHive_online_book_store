import http, { withAuth } from "./http";
const API = "/admin";

export const dashboardData = async () => {
    try {
        const res = await http.get(`${API}/Dashboard`, withAuth());
        return res.data;
    } catch (error) {
        // Silently handle 401 errors (user not admin)
        if (error?.response?.status !== 401) {
            console.error("Get Dashboard Data API error:", error);
        }
        throw error;
    }
};

export const getAllUser = async () => {
    try {
        const res = await http.get(`${API}/users`, withAuth());
        return res.data;
    } catch (error) {
        // Silently handle 401 errors (user not admin)
        if (error?.response?.status !== 401) {
            console.error("Get users API error:", error);
        }
        throw error;
    }
};

export const deleteUser = async (id) => {
    try {
        const res = await http.delete(`${API}/users/${id}`, withAuth());
        return res.data;
    } catch (error) {
        console.error("Delete Book API error:", error);
        throw error;
    }
};
