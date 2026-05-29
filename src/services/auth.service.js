// src/services/authService.js
import axiosInstance from "../api/axiosInstance";

// ── Login ──────────────────────────────────────────────────────────────────
// Calls POST /auth/login, saves token + user + permissions, returns all data
export const login = async (email, password) => {
  const response = await axiosInstance.post("/auth/login", { email, password });
  const { token, user, permissions } = response.data;

  if (!token) {
    throw new Error("No token received from server");
  }

  localStorage.setItem("access_token", token);
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("permissions", JSON.stringify(permissions));

  return response.data;
};

export const clearAuthData = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
  localStorage.removeItem("permissions");
};

// ── Logout ─────────────────────────────────────────────────────────────────
// Clears everything saved in localStorage
export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
  localStorage.removeItem("permissions");
};

// ── isAuthenticated ────────────────────────────────────────────────────────
// Checks if a valid (non-expired) token exists in localStorage
export const isAuthenticated = () => {
  const token = localStorage.getItem("access_token");
  if (!token) return false;

  try {
    // Decode JWT payload (middle part) without any library
    const payload = JSON.parse(atob(token.split(".")[1]));
    const isExpired = payload.exp * 1000 < Date.now();
    if (isExpired) {
      logout(); // Clean up expired token automatically
      return false;
    }
    return true;
  } catch {
    return false; // Malformed token
  }
};
