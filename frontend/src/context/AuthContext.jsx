import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import BACKEND_URL from "../config";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("gymUser");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("gymToken") || null);

  const authHeader = () => ({ Authorization: `Bearer ${token}` });

  const register = async (name, email, password) => {
    const { data } = await axios.post(`${BACKEND_URL}/api/auth/register`, { name, email, password });
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("gymToken", data.token);
    localStorage.setItem("gymUser", JSON.stringify(data.user));
    return data;
  };

  const login = async (email, password) => {
    const { data } = await axios.post(`${BACKEND_URL}/api/auth/login`, { email, password });
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("gymToken", data.token);
    localStorage.setItem("gymUser", JSON.stringify(data.user));
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("gymToken");
    localStorage.removeItem("gymUser");
  };

  return (
    <AuthContext.Provider value={{ user, token, authHeader, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
