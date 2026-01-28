import { useState } from "react";
import { loginApi, registerApi } from "../../services/authApi";
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

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
