import http, { withAuth } from "./http";

const API = "/users";

export const loginApi = async (data) => {
    try {
        const res = await http.post(`${API}/login`, data);
        return res.data;
    } catch (error) {
        console.error("Login API error:", error);
        throw error;
    }
};


export const registerApi = async (data) => {
    try {
        const res = await http.post(`${API}/register`, data);
        return res.data;
    } catch (error) {
        console.error("Register API error:", error);
        throw error;
    }
};

export const sendRegisterOtpApi = async (email) => {
    try {
        const res = await http.post(`${API}/send-otp`, { email });
        return res.data;
    } catch (error) {
        console.error("Send-otp API error:", error);
        throw error;
    }
};

export const verifyRegisterOtpApi = async (email, otp) => {
    try {
        const res = await http.post(`${API}/verify-otp`, { email, otp });
        return res.data;
    } catch (error) {
        console.error("Verify-otp API error:", error);
        throw error;  
    }
};

export const sendForgotPasswordOtpApi = async (email) => {
    try {
        const res = await http.post(`${API}/forgot-password/send-otp`, { email });
        return res.data;
    } catch (error) {
        console.error("Forgot-password send-otp API error:", error);
        throw error;
    }
};

export const resetPasswordApi = async (payload) => {
    try {
        const res = await http.post(`${API}/forgot-password/reset`, payload);
        return res.data;
    } catch (error) {
        console.error("Reset-password API error:", error);
        throw error;
    }
};

export const sendMessageApi = async (formData) => {
  try {
    const res = await http.post(`${API}/send`, formData);
    return res.data;
  } catch (error) {
    const msg = error.response?.data?.msg || "Server Error";
    throw new Error(msg);
  }
};

export const getProfileApi = async () => {
  try {
    const res = await http.get(`${API}/me`, withAuth());
    return res.data;
  } catch (error) {
    console.error("Get profile API error:", error);
    throw error;
  }
};

export const updateProfileApi = async (formData) => {
  try {
    const res = await http.put(`${API}/me`, formData, withAuth());
    return res.data;
  } catch (error) {
    console.error("Update profile API error:", error);
    throw error;
  }
};


export const getUserAllMessages = async () => {
    try {
        const res = await http.get(`${API}/messages`, withAuth());
        return res.data; 
    } catch (error) {
        console.error("Get Messages Data API error:", error);
        throw error;
    }
};

export const deleteUserMessage = async (id) => {
    try {
        const res = await http.delete(`${API}/messages/${id}`, withAuth());
        return res.data;
    } catch (error) {
        console.error("Delete Message Data API error:", error);
        throw error;
    }
};
