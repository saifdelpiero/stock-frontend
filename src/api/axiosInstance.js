// src/api/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

// ── Request Interceptor ────────────────────────────────────────────────────
// Automatically attaches the JWT token to every outgoing request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response Interceptor ───────────────────────────────────────────────────
// If backend returns 401 (token expired / invalid), clear storage and redirect
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      localStorage.removeItem("permissions");
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
