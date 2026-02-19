import { useState } from "react";
import { 
  loginApi, 
  registerApi, 
  sendMessageApi,
  sendRegisterOtpApi,
  verifyRegisterOtpApi,
  sendForgotPasswordOtpApi,
  resetPasswordApi,
  getProfileApi,
  updateProfileApi,
} from "../../services/authApi";
import { AuthContext } from "./AuthContext";

const getInitialUser = () => {
  const readUser = (storage) => {
    const storedUser = storage.getItem("user");
    const storedToken = storage.getItem("token");
    if (!storedUser || !storedToken) {
      storage.removeItem("user");
      storage.removeItem("token");
      return null;
    }
    try {
      return JSON.parse(storedUser);
    } catch (error) {
      storage.removeItem("user");
      storage.removeItem("token");
      return null;
    }
  };

  return readUser(localStorage) || readUser(sessionStorage);
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getInitialUser);

  const updateStoredUser = (nextUser) => {
    setUser(nextUser);
    const hasLocal = localStorage.getItem("token");
    const hasSession = sessionStorage.getItem("token");
    if (hasLocal) {
      localStorage.setItem("user", JSON.stringify(nextUser));
    }
    if (hasSession) {
      sessionStorage.setItem("user", JSON.stringify(nextUser));
    }
  };

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

  const refreshProfile = async () => {
    const res = await getProfileApi();
    updateStoredUser(res.user);
    return res;
  };

  const updateProfile = async (formData) => {
    const res = await updateProfileApi(formData);
    updateStoredUser(res.user);
    return res;
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
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
        refreshProfile,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
