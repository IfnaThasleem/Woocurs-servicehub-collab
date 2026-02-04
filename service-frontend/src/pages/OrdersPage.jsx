import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get role and token safely
  const role = localStorage.getItem("role") || "customer";
  const token = localStorage.getItem("token") || "";

  // Wrap fetchOrders in useCallback to prevent ESLint warning
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      let url = "";

      if (role === "admin") url = "http://localhost:5000/api/orders";
      else if (role === "vendor") url = "http://localhost:5000/api/orders/vendor";
      else url = "http://localhost:5000/api/orders/customer";

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (role === "vendor") {
        const grouped = response.data;
        const allOrders = [
          ...(grouped.pending || []),
          ...(grouped.inProgress || []),
          ...(grouped.completed || []),
        ];
        setOrders(allOrders);
      } else {
        setOrders(response.data || []);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [role, token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div style={container}>
      <Navbar role={role} />
      <div style={content}>
        <div style={headerSection}>
          <div style={titleGroup}>
            <div style={iconCircle}>
              <span style={iconLarge}>📦</span>
            </div>
            <div>
              <h2 style={title}>Orders Management</h2>
              <p style={subtitle}>Track and manage all your orders</p>
            </div>
          </div>
          <button 
            style={refreshBtn} 
            onClick={fetchOrders}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(79, 124, 255, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 15px rgba(79, 124, 255, 0.3)";
            }}
          >
            <span style={btnIcon}>🔄</span>
            Refresh
          </button>
        </div>

        {loading && (
          <div style={loadingContainer}>
            <span style={loadingSpinner}>⏳</span>
            <p style={loadingText}>Loading orders...</p>
          </div>
        )}

        {error && (
          <div style={errorBox}>
            <span style={errorIcon}>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {!loading && orders.length === 0 && (
          <div style={emptyState}>
            <span style={emptyIcon}>📭</span>
            <h3 style={emptyTitle}>No Orders Found</h3>
            <p style={emptyText}>You don't have any orders yet</p>
          </div>
        )}

        {!loading && orders.length > 0 && (
          <div style={tableWrapper}>
            <div style={statsBar}>
              <div style={statItem}>
                <span style={statIcon}>📊</span>
                <div>
                  <span style={statValue}>{orders.length}</span>
                  <span style={statLabel}>Total Orders</span>
                </div>
              </div>
              <div style={statItem}>
                <span style={statIcon}>⏳</span>
                <div>
                  <span style={statValue}>
                    {orders.filter(o => o.status === "pending").length}
                  </span>
                  <span style={statLabel}>Pending</span>
                </div>
              </div>
              <div style={statItem}>
                <span style={statIcon}>✅</span>
                <div>
                  <span style={statValue}>
                    {orders.filter(o => o.status === "completed").length}
                  </span>
                  <span style={statLabel}>Completed</span>
                </div>
              </div>
            </div>

            <table style={table}>
              <thead>
                <tr>
                  <th style={th}>
                    <div style={thContent}>
                      <span style={thIcon}>👤</span>
                      Customer
                    </div>
                  </th>
                  <th style={th}>
                    <div style={thContent}>
                      <span style={thIcon}>🛠️</span>
                      Service
                    </div>
                  </th>
                  <th style={th}>
                    <div style={thContent}>
                      <span style={thIcon}>👨‍🔧</span>
                      Vendor
                    </div>
                  </th>
                  <th style={th}>
                    <div style={thContent}>
                      <span style={thIcon}>📅</span>
                      Scheduled
                    </div>
                  </th>
                  <th style={th}>
                    <div style={thContent}>
                      <span style={thIcon}>💰</span>
                      Price
                    </div>
                  </th>
                  <th style={th}>
                    <div style={thContent}>
                      <span style={thIcon}>📌</span>
                      Status
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr 
                    key={order._id} 
                    style={tr}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(79, 124, 255, 0.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <td style={td}>
                      <div style={cellContent}>
                        <span style={avatar}>{order.customer?.name?.charAt(0) || "?"}</span>
                        {order.customer?.name || "—"}
                      </div>
                    </td>
                    <td style={td}>{order.service?.name || "—"}</td>
                    <td style={td}>{order.vendor?.name || "—"}</td>
                    <td style={td}>
                      {order.scheduledDate 
                        ? new Date(order.scheduledDate).toLocaleDateString() 
                        : "—"}
                    </td>
                    <td style={td}>
                      <span style={priceTag}>
                        {order.totalPrice ? `Rs. ${order.totalPrice}` : "—"}
                      </span>
                    </td>
                    <td style={td}>
                      <span style={statusBadge(order.status)}>
                        {getStatusIcon(order.status)} {order.status || "—"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const getStatusIcon = (status) => {
  switch(status) {
    case "pending": return "⏳";
    case "inProgress": return "🔄";
    case "completed": return "✅";
    default: return "📌";
  }
};

/* ===================== ENHANCED STYLES ===================== */
const container = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #0a0e1a 0%, #1a1f35 100%)",
  color: "#e5e7eb",
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
};

const content = {
  padding: "2rem",
  maxWidth: "1400px",
  margin: "0 auto"
};

const headerSection = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "2rem",
  flexWrap: "wrap",
  gap: "1rem"
};

const titleGroup = {
  display: "flex",
  alignItems: "center",
  gap: "1rem"
};

const iconCircle = {
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, rgba(79, 124, 255, 0.2) 0%, rgba(59, 91, 219, 0.1) 100%)",
  border: "2px solid rgba(79, 124, 255, 0.3)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const iconLarge = {
  fontSize: "2rem"
};

const title = {
  fontSize: "2rem",
  fontWeight: "700",
  marginBottom: "0.25rem",
  background: "linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text"
};

const subtitle = {
  color: "#94a3b8",
  fontSize: "0.95rem"
};

const refreshBtn = {
  padding: "12px 24px",
  borderRadius: "12px",
  border: "none",
  background: "linear-gradient(135deg, #4f7cff 0%, #3b5bdb 100%)",
  color: "white",
  cursor: "pointer",
  fontSize: "1rem",
  fontWeight: "600",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  boxShadow: "0 4px 15px rgba(79, 124, 255, 0.3)",
  transition: "all 0.3s ease"
};

const btnIcon = {
  fontSize: "1.1rem"
};

const loadingContainer = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "4rem",
  gap: "1rem"
};

const loadingSpinner = {
  fontSize: "3rem",
  animation: "spin 1s linear infinite"
};

const loadingText = {
  color: "#cbd5e1",
  fontSize: "1.1rem"
};

const errorBox = {
  background: "rgba(239, 68, 68, 0.1)",
  border: "1px solid rgba(239, 68, 68, 0.3)",
  padding: "1.5rem",
  borderRadius: "12px",
  color: "#fca5a5",
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  fontSize: "1rem"
};

const errorIcon = {
  fontSize: "1.5rem"
};

const emptyState = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "5rem 2rem",
  textAlign: "center"
};

const emptyIcon = {
  fontSize: "5rem",
  marginBottom: "1rem",
  opacity: "0.5"
};

const emptyTitle = {
  fontSize: "1.5rem",
  fontWeight: "600",
  marginBottom: "0.5rem",
  color: "#e2e8f0"
};

const emptyText = {
  color: "#94a3b8",
  fontSize: "1rem"
};

const tableWrapper = {
  overflowX: "auto"
};

const statsBar = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "1.5rem",
  marginBottom: "2rem"
};

const statItem = {
  background: "rgba(15, 23, 42, 0.8)",
  backdropFilter: "blur(10px)",
  padding: "1.5rem",
  borderRadius: "16px",
  border: "1px solid rgba(148, 163, 184, 0.1)",
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)"
};

const statIcon = {
  fontSize: "2.5rem"
};

const statValue = {
  display: "block",
  fontSize: "2rem",
  fontWeight: "700",
  color: "#4f7cff",
  lineHeight: "1"
};

const statLabel = {
  display: "block",
  fontSize: "0.9rem",
  color: "#94a3b8",
  marginTop: "0.25rem"
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  background: "rgba(15, 23, 42, 0.6)",
  backdropFilter: "blur(10px)",
  borderRadius: "16px",
  overflow: "hidden",
  border: "1px solid rgba(148, 163, 184, 0.1)",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)"
};

const th = {
  padding: "1rem 1.25rem",
  textAlign: "left",
  background: "rgba(2, 6, 23, 0.8)",
  fontSize: "0.9rem",
  color: "#cbd5e1",
  fontWeight: "600",
  borderBottom: "2px solid rgba(79, 124, 255, 0.2)"
};

const thContent = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem"
};

const thIcon = {
  fontSize: "1.1rem"
};

const tr = {
  transition: "all 0.2s ease"
};

const td = {
  padding: "1rem 1.25rem",
  borderBottom: "1px solid rgba(30, 41, 59, 0.5)",
  fontSize: "0.95rem",
  color: "#e2e8f0"
};

const cellContent = {
  display: "flex",
  alignItems: "center",
  gap: "0.75rem"
};

const avatar = {
  width: "36px",
  height: "36px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #4f7cff 0%, #3b5bdb 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "600",
  fontSize: "0.9rem"
};

const priceTag = {
  background: "rgba(79, 124, 255, 0.15)",
  padding: "0.4rem 0.8rem",
  borderRadius: "8px",
  fontWeight: "600",
  color: "#93c5fd"
};

const statusBadge = (status) => ({
  padding: "0.5rem 1rem",
  borderRadius: "20px",
  fontSize: "0.85rem",
  fontWeight: "600",
  display: "inline-flex",
  alignItems: "center",
  gap: "0.4rem",
  background:
    status === "pending"
      ? "rgba(250, 204, 21, 0.15)"
      : status === "inProgress"
      ? "rgba(56, 189, 248, 0.15)"
      : status === "completed"
      ? "rgba(34, 197, 94, 0.15)"
      : "rgba(100, 116, 139, 0.15)",
  color:
    status === "pending"
      ? "#fbbf24"
      : status === "inProgress"
      ? "#38bdf8"
      : status === "completed"
      ? "#22c55e"
      : "#94a3b8",
  border: `1px solid ${
    status === "pending"
      ? "rgba(250, 204, 21, 0.3)"
      : status === "inProgress"
      ? "rgba(56, 189, 248, 0.3)"
      : status === "completed"
      ? "rgba(34, 197, 94, 0.3)"
      : "rgba(100, 116, 139, 0.3)"
  }`
});