import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* ===== PUBLIC PAGES ===== */
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

/* ===== ADMIN ===== */
import AdminDashboard from "./pages/AdminDashboard";
import AdminManagement from "./pages/AdminManagement";

/* ===== VENDOR ===== */
import VendorDashboard from "./pages/VendorDashboard";
import VendorEarnings from "./pages/VendorEarnings";

/* ===== USER ===== */
import UserDashboard from "./pages/UserDashboard";

/* ===== SHARED ===== */
import OrdersPage from "./pages/OrdersPage";
import ServicesPage from "./pages/ServicesPage";

/* ===== AUTH ===== */
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ================= ADMIN ================= */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/manage"
          element={
            <ProtectedRoute role="admin">
              <AdminManagement />
            </ProtectedRoute>
          }
        />

        {/* ================= VENDOR ================= */}
        <Route
          path="/vendor/dashboard"
          element={
            <ProtectedRoute role="vendor">
              <VendorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vendor/earnings"
          element={
            <ProtectedRoute role="vendor">
              <VendorEarnings />
            </ProtectedRoute>
          }
        />

        {/* ================= USER ================= */}
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute role="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* ================= SHARED ================= */}
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/services"
          element={
            <ProtectedRoute>
              <ServicesPage />
            </ProtectedRoute>
          }
        />

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
