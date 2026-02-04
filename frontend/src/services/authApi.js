import axios from "axios";
const API = "/api/users";


const authHeader = () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    return {
        Authorization: `Bearer ${token}`,
    };
};

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

export const sendRegisterOtpApi = async (email) => {
    try {
        const res = await axios.post(`${API}/send-otp`, { email });
        return res.data;
    } catch (error) {
        console.error("Send-otp API error:", error);
        throw error;
    }
};

export const verifyRegisterOtpApi = async (email, otp) => {
    try {
        const res = await axios.post(`${API}/verify-otp`, { email, otp });
        return res.data;
    } catch (error) {
        console.error("Verify-otp API error:", error);
        throw error;  
    }
};

export const sendForgotPasswordOtpApi = async (email) => {
    try {
        const res = await axios.post(`${API}/forgot-password/send-otp`, { email });
        return res.data;
    } catch (error) {
        console.error("Forgot-password send-otp API error:", error);
        throw error;
    }
};

export const resetPasswordApi = async (payload) => {
    try {
        const res = await axios.post(`${API}/forgot-password/reset`, payload);
        return res.data;
    } catch (error) {
        console.error("Reset-password API error:", error);
        throw error;
    }
};

export const sendMessageApi = async (formData) => {
  try {
    const res = await axios.post(`${API}/send`, formData);
    return res.data;
  } catch (error) {
    const msg = error.response?.data?.msg || "Server Error";
    throw new Error(msg);
  }
};


export const getUserAllMessages = async () => {
    try {
        const res = await axios.get(`${API}/messages`, {
            headers: authHeader(),
        });
        return res.data; 
    } catch (error) {
        console.error("Get Messages Data API error:", error);
        throw error;
    }
};

export const deleteUserMessage = async (id) => {
    try {
        const res = await axios.delete(`${API}/messages/${id}`, {
            headers: authHeader(),
        });
        return res.data;
    } catch (error) {
        console.error("Delete Message Data API error:", error);
        throw error;
    }
};
