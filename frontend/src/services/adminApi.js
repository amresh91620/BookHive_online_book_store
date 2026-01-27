import axios from "axios";
const API = "http://localhost:5000/api/admin";

const authHeader = () => {
    const token = localStorage.getItem("token");
    return {
        Authorization: `Bearer ${token}`,
    };
};


export const getAllUser = async () => {
    try {
        const res = await axios.get(`${API}/users`,{
      headers: authHeader(),
    });
        return res.data;
    } catch (error) {
        console.error("Get Books API error:", error);
        throw error;
    }
};
