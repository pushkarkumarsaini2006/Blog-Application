import axios from "axios";
import { BASE_URL } from "./apiPaths";

// Retry mechanism for failed requests
const retryRequest = async (config, retryCount = 0) => {
  const maxRetries = 3;
  const baseDelay = 1000;

  try {
    return await axios(config);
  } catch (error) {
    if (retryCount < maxRetries && shouldRetry(error)) {
      const delay = baseDelay * Math.pow(2, retryCount);
      console.log(`Retrying request in ${delay}ms... (attempt ${retryCount + 1}/${maxRetries})`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryRequest(config, retryCount + 1);
    }
    throw error;
  }
};

const shouldRetry = (error) => {
  return (
    error.code === 'ECONNABORTED' ||
    error.code === 'ERR_NETWORK' ||
    error.code === 'ENOTFOUND' ||
    (error.response && error.response.status >= 500) ||
    (error.response && error.response.status === 502) ||
    (error.response && error.response.status === 503) ||
    (error.response && error.response.status === 504)
  );
};

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // Enable credentials for CORS
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Handle common errors globally
    if (error.response) {
      if (error.response.status === 401) {
        // Clear invalid token and redirect to login
        console.log("401 Unauthorized - clearing token");
        localStorage.removeItem("token");
        // Only redirect if not already on home/login page
        if (window.location.pathname.includes('/admin')) {
          window.location.href = "/";
        }
      } else if (error.response.status === 500) {
        console.error("Server error. Please try again later.");
      }
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timeout. Please try again.");
    } else if (error.code === "ERR_NETWORK") {
      console.error("Network error. Please check your connection.");
    }

    // Retry logic for certain types of errors
    if (shouldRetry(error) && !error.config._retry) {
      error.config._retry = true;
      try {
        return await retryRequest(error.config);
      } catch (retryError) {
        return Promise.reject(retryError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
