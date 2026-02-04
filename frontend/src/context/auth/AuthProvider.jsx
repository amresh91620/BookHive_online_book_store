import { useState} from "react";
import { 
  loginApi, 
  registerApi, 
  sendMessageApi,
  sendRegisterOtpApi,
  verifyRegisterOtpApi,
  sendForgotPasswordOtpApi,
  resetPasswordApi,
} from "../../services/authApi";
import { AuthContext } from "./AuthContext";

const getInitialUser = () => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) return JSON.parse(storedUser);
  const sessionUser = sessionStorage.getItem("user");
  return sessionUser ? JSON.parse(sessionUser) : null;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getInitialUser);

  const login = async (data, rememberMe = true) => {
    const res = await loginApi(data);
    setUser(res.user);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("user", JSON.stringify(res.user));
    storage.setItem("token", res.token);
    return res;
  };

  const register = async (data) => {
    return await registerApi(data);
  };

  const sendRegisterOtp = async (email) => {
    return await sendRegisterOtpApi(email);
  };

  const verifyRegisterOtp = async (email, otp) => {
     return await verifyRegisterOtpApi(email, otp);
  };

  const sendForgotPasswordOtp = async (email) => {
    return await sendForgotPasswordOtpApi(email);
  };

  const resetPassword = async (payload) => {
    return await resetPasswordApi(payload);
  };
  
  const logout = () => {
    setUser(null);
    localStorage.clear();
    sessionStorage.clear();
  };

  const sendMessge = async (data) => {
    return await sendMessageApi(data);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        register, 
        logout, 
        sendMessge, 
        sendRegisterOtp,
        verifyRegisterOtp,
        sendForgotPasswordOtp,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
