import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role"); // make sure you save this after login

  if (!token) {
    // Not logged in → redirect to login
    return <Navigate to="/login" replace />;
  }

  if (role && userRole !== role) {
    // Logged in but wrong role → redirect to home or their dashboard
    return <Navigate to="/" replace />;
  }

  return children;
}
