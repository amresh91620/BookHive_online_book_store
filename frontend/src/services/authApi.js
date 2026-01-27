import axios from "axios";
const API = "http://localhost:5000/api/users";

export const loginApi = async (data) => {
    try {
        const res = await axios.post(`${API}/login`, data);
        return res.data;
    } catch (error) {
        console.error("Login API error:", error);
        throw error;
    }
};


export const registerApi = async (data) => {
    try {
        const res = await axios.post(`${API}/register`, data);
        return res.data;
    } catch (error) {
        console.error("Register API error:", error);
        throw error;
    }
};