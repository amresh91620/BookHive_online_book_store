import { useState} from "react";
import { 
  loginApi, 
  registerApi, 
  sendMessageApi, 
} from "../../services/authApi";
import { AuthContext } from "./AuthContext";

const getInitialUser = () => {
  const storedUser = localStorage.getItem("user");
  return storedUser ? JSON.parse(storedUser) : null;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getInitialUser);

  const login = async (data) => {
    const res = await loginApi(data);
    setUser(res.user);
    localStorage.setItem("user", JSON.stringify(res.user));
    localStorage.setItem("token", res.token);
    return res;
  };

  const register = async (data) => {
    return await registerApi(data);
  };

  const logout = () => {
    setUser(null);
    localStorage.clear();
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;