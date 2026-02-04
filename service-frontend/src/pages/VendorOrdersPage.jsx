import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!token || !user?._id) return;

    const headers = { Authorization: `Bearer ${token}` };
    setLoading(true);

    try {
      const res = await axios.get("http://localhost:5000/api/orders", { headers });
      
      // Adjust according to your backend structure
      const vendorId = user._id;
      const vendorOrders = res.data.filter(
        (o) => o.service?.vendor === vendorId || o.service?.vendor?._id === vendorId
      );

      setOrders(vendorOrders);
    } catch (err) {
      console.error("Fetch orders error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const acceptOrder = async (order) => {
    if (!order.service.available) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };

    try {
      await axios.put(
        `http://localhost:5000/api/orders/${order._id}`,
        { status: "inProgress" },
        { headers }
      );
      fetchOrders();
    } catch (err) {
      console.error("Accept order error:", err.response?.data || err.message);
    }
  };

  const getStatusIcon = (status) => {
    if (status === "pending") return "⏳";
    if (status === "inProgress") return "🔄";
    if (status === "completed") return "✅";
    return "📋";
  };

  const getStatusBadgeStyle = (status) => {
    const base = {
      padding: "0.4rem 0.8rem",
      borderRadius: "20px",
      fontSize: "0.85rem",
      fontWeight: "600",
      display: "inline-flex",
      alignItems: "center",
      gap: "0.3rem"
    };

    if (status === "pending") {
      return { ...base, background: "rgba(245, 158, 11, 0.2)", border: "1px solid rgba(245, 158, 11, 0.3)", color: "#fbbf24" };
    }
    if (status === "inProgress") {
      return { ...base, background: "rgba(79, 124, 255, 0.2)", border: "1px solid rgba(79, 124, 255, 0.3)", color: "#93c5fd" };
    }
    if (status === "completed") {
      return { ...base, background: "rgba(34, 197, 94, 0.2)", border: "1px solid rgba(34, 197, 94, 0.3)", color: "#4ade80" };
    }
    return base;
  };

  if (loading) {
    return (
      <div style={loadingPage}>
        <div style={loadingSpinner}>
          <span style={spinnerIcon}>⏳</span>
          <p style={loadingText}>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={page}>
      <Navbar role="vendor" />

      <div style={container}>
        <div style={headerSection}>
          <div style={titleGroup}>
            <div style={iconCircle}>
              <span style={iconLarge}>📦</span>
            </div>
            <div>
              <h2 style={pageTitle}>My Orders</h2>
              <p style={pageSubtitle}>Manage your service requests</p>
            </div>
          </div>
        </div>

        <div style={sectionHeader}>
          <span style={sectionIcon}>📋</span>
          <h3 style={sectionTitle}>Order List</h3>
          <span style={countBadge}>{orders.length} Total</span>
        </div>

        {orders.length === 0 ? (
          <div style={emptyStateContainer}>
            <span style={emptyStateIcon}>📦</span>
            <p style={emptyStateText}>No orders found</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order._id} style={card}>
              <div style={orderCardContent}>
                <div style={orderIconCircle}>
                  <span style={orderIcon}>📦</span>
                </div>
                <div style={orderInfo}>
                  <b style={serviceName}>{order.service.name}</b>
                  <p style={customerInfo}>
                    <span style={customerIcon}>👤</span>
                    Customer: <b>{order.customer.name}</b>
                  </p>
                  <div style={statusRow}>
                    <span style={statusLabel}>Status:</span>
                    <span style={getStatusBadgeStyle(order.status)}>
                      {getStatusIcon(order.status)} {order.status}
                    </span>
                  </div>
                </div>
              </div>
              {order.status === "pending" && order.service.available && (
                <button
                  style={acceptBtn}
                  onClick={() => acceptOrder(order)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 8px 25px rgba(34, 197, 94, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 15px rgba(34, 197, 94, 0.3)";
                  }}
                >
                  <span style={btnIcon}>✓</span>
                  Accept Order
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ===== ENHANCED STYLES ===== */
const page = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #0a0e1a 0%, #1a1f35 100%)",
  color: "white",
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
};

const loadingPage = {
  ...page,
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const loadingSpinner = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "1rem"
};

const spinnerIcon = {
  fontSize: "4rem",
  animation: "spin 2s linear infinite"
};

const loadingText = {
  fontSize: "1.2rem",
  color: "#94a3b8"
};

const container = {
  padding: "2rem",
  maxWidth: "1400px",
  margin: "0 auto"
};

const headerSection = {
  marginBottom: "2.5rem"
};

const titleGroup = {
  display: "flex",
  alignItems: "center",
  gap: "1rem"
};

const iconCircle = {
  width: "70px",
  height: "70px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.1) 100%)",
  border: "3px solid rgba(245, 158, 11, 0.3)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 8px 25px rgba(245, 158, 11, 0.3)"
};

const iconLarge = {
  fontSize: "2.5rem"
};

const pageTitle = {
  fontSize: "2.5rem",
  fontWeight: "700",
  marginBottom: "0.25rem",
  background: "linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text"
};

const pageSubtitle = {
  color: "#94a3b8",
  fontSize: "1rem",
  margin: 0
};

const sectionHeader = {
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  marginBottom: "1rem",
  padding: "1rem",
  background: "rgba(15, 23, 42, 0.6)",
  borderRadius: "12px",
  border: "2px solid rgba(148, 163, 184, 0.2)"
};

const sectionIcon = {
  fontSize: "2rem"
};

const sectionTitle = {
  fontSize: "1.5rem",
  fontWeight: "700",
  color: "#e2e8f0",
  margin: 0,
  flex: 1
};

const countBadge = {
  padding: "0.5rem 1rem",
  background: "rgba(79, 124, 255, 0.2)",
  border: "1px solid rgba(79, 124, 255, 0.3)",
  borderRadius: "20px",
  fontSize: "0.9rem",
  fontWeight: "600",
  color: "#93c5fd"
};

const card = {
  background: "rgba(15, 23, 42, 0.8)",
  backdropFilter: "blur(10px)",
  padding: "1.5rem",
  borderRadius: "16px",
  border: "2px solid rgba(148, 163, 184, 0.1)",
  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
  marginBottom: "1rem",
  display: "flex",
  flexDirection: "column",
  gap: "1rem"
};

const orderCardContent = {
  display: "flex",
  gap: "1rem"
};

const orderIconCircle = {
  width: "50px",
  height: "50px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.1) 100%)",
  border: "2px solid rgba(245, 158, 11, 0.3)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0
};

const orderIcon = {
  fontSize: "1.5rem"
};

const orderInfo = {
  flex: 1
};

const serviceName = {
  fontSize: "1.2rem",
  color: "#e2e8f0",
  marginBottom: "0.5rem",
  display: "block"
};

const customerInfo = {
  fontSize: "0.95rem",
  color: "#94a3b8",
  margin: "0 0 0.75rem 0",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem"
};

const customerIcon = {
  fontSize: "1rem"
};

const statusRow = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem"
};

const statusLabel = {
  fontSize: "0.95rem",
  color: "#cbd5e1",
  fontWeight: "600"
};

const acceptBtn = {
  padding: "12px 18px",
  background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
  border: "none",
  borderRadius: "10px",
  color: "white",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.3s ease",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  alignSelf: "flex-start",
  boxShadow: "0 4px 15px rgba(34, 197, 94, 0.3)",
  fontSize: "0.95rem"
};

const btnIcon = {
  fontSize: "1.1rem"
};

const emptyStateContainer = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "4rem 2rem",
  background: "rgba(15, 23, 42, 0.6)",
  borderRadius: "16px",
  border: "2px dashed rgba(148, 163, 184, 0.3)"
};

const emptyStateIcon = {
  fontSize: "4rem",
  opacity: 0.5,
  marginBottom: "1rem"
};

const emptyStateText = {
  fontSize: "1.1rem",
  color: "#64748b",
  margin: 0
};