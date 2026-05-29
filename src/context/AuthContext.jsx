// src/context/AuthContext.jsx
import { createContext, useContext, useState, useCallback } from "react";
import {
  login as loginService,
  logout as logoutService,
  isAuthenticated,
} from "../services/auth.service";

const AuthContext = createContext(null);

// ── AuthProvider ───────────────────────────────────────────────────────────
// Wrap your entire app with this so every component can access auth state
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated);

  // Restore user and permissions from localStorage on page refresh
  const [currentUser, setCurrentUser] = useState(
    () => JSON.parse(localStorage.getItem("user")) || null,
  );
  const [permissions, setPermissions] = useState(
    () => JSON.parse(localStorage.getItem("permissions")) || [],
  );

  const [authError, setAuthError] = useState(null);
  const [loading, setLoading] = useState(false);

  // ── login ────────────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const data = await loginService(email, password);
      setIsLoggedIn(true);
      setCurrentUser(data.user);
      setPermissions(data.permissions);
      return data;
    } catch (err) {
      const message =
        err.response?.data?.message || "Invalid email or password.";
      setAuthError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ── logout ───────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    logoutService();
    setIsLoggedIn(false);
    setCurrentUser(null);
    setPermissions([]);
  }, []);

  // ── hasPermission helper ─────────────────────────────────────────────────
  // Usage: hasPermission("create_user") → true / false
  const hasPermission = useCallback(
    (permission) => permissions.includes(permission),
    [permissions],
  );

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        currentUser,
        permissions,
        hasPermission,
        login,
        logout,
        authError,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ── useAuth ────────────────────────────────────────────────────────────────
// Custom hook — import and call this in any component to access auth
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
