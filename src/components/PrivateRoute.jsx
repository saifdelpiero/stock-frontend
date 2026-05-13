// src/components/PrivateRoute.jsx
import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

// Wrap any route that requires login.
// If the user is not logged in, they get redirected to /signin automatically.
//
// Usage in App.jsx:
//   <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/signin" replace />;
};

export default PrivateRoute;