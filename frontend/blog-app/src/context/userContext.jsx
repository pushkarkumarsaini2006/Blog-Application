import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export const UserContext = createContext();
const USER_STORAGE_KEY = "blogAppUser";

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openAuthForm, setOpenAuthForm] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initializeUser = async () => {
      // Only initialize once on mount
      if (initialized) return;

      const accessToken = localStorage.getItem("token");
      const cachedUser = localStorage.getItem(USER_STORAGE_KEY);

      if (cachedUser) {
        try {
          setUser(JSON.parse(cachedUser));
        } catch (parseError) {
          localStorage.removeItem(USER_STORAGE_KEY);
        }
      }
      
      if (!accessToken) {
        setLoading(false);
        setInitialized(true);
        return;
      }

      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
        setUser(response.data);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.data));
      } catch (error) {
        console.error("User authentication failed:", error);
        if (error?.response?.status === 401) {
          // Clear invalid credentials only when server confirms unauthorized.
          localStorage.removeItem("token");
          localStorage.removeItem(USER_STORAGE_KEY);
          setUser(null);
        }
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    initializeUser();
  }, [initialized]);

  const updateUser = (userData) => {
    setUser(userData);
    if (userData.token) {
      localStorage.setItem("token", userData.token);
    }
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    setLoading(false);
    setInitialized(true); // Mark as initialized to prevent useEffect from running
  };

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem(USER_STORAGE_KEY);
    setLoading(false);
    setInitialized(true);
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
