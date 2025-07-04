import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openAuthForm, setOpenAuthForm] = useState(false);

  useEffect(() => {
    const initializeUser = async () => {
      const accessToken = localStorage.getItem("token");
      
      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
        console.log("User profile fetched:", response.data); // Debug log
        setUser(response.data);
      } catch (error) {
        console.error("User authentication failed:", error);
        // Clear invalid token
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, []);

  const updateUser = (userData) => {
    console.log("Updating user context with:", userData); // Debug log
    setUser(userData);
    if (userData.token) {
      localStorage.setItem("token", userData.token);
    }
    setLoading(false);
  };

  const clearUser = () => {
    console.log("Clearing user context"); // Debug log
    setUser(null);
    localStorage.removeItem("token");
    setLoading(false);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        loading,
        updateUser,
        clearUser,
        openAuthForm,
        setOpenAuthForm,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
