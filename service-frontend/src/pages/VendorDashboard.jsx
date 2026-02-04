import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function VendorDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [vendor, setVendor] = useState(null);
  const [services, setServices] = useState([]);
  const [orders, setOrders] = useState([]);
  const [earnings, setEarnings] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  // ================= FETCH VENDOR DATA =================
  const fetchVendorData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    const headers = { Authorization: `Bearer ${token}` };

    try {
      // Fetch vendor profile
      const vendorRes = await axios.get("http://localhost:5000/api/users/me", { headers });
      setVendor(vendorRes.data);

      // Fetch services
      const servicesRes = await axios.get("http://localhost:5000/api/services/vendor/me", { headers });
      setServices(servicesRes.data);

      // Fetch orders
      const ordersRes = await axios.get("http://localhost:5000/api/orders", { headers });
      const vendorOrders = ordersRes.data.filter(
        (o) => o.service?.vendor === user._id || o.service?.vendor?._id === user._id
      );
      setOrders(vendorOrders);

      // Calculate earnings (completed orders only)
      const totalEarnings = vendorOrders
        .filter((o) => o.status === "completed")
        .reduce((sum, o) => sum + o.service.price, 0);
      setEarnings(totalEarnings);

    } catch (err) {
      console.error("Vendor dashboard error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }, [token, user._id]);

  useEffect(() => {
    fetchVendorData();
  }, [fetchVendorData]);

  // ================= NAVIGATION HANDLERS =================
  const goToServices = () => navigate("/vendor/services");
  const goToOrders = () => navigate("/vendor/orders");
  const goToProfile = () => navigate("/profile");

  if (loading) {
    return (
      <div style={loadingPage}>
        <div style={loadingSpinner}>
          <span style={spinnerIcon}>⏳</span>
          <p style={loadingText}>Loading dashboard...</p>
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
            <div style={vendorIconCircle}>
              <span style={vendorIconLarge}>👨‍🔧</span>
            </div>
            <div>
              <h2 style={pageTitle}>Vendor Dashboard</h2>
              <p style={pageSubtitle}>Manage your services and orders</p>
            </div>
          </div>
        </div>

        {/* ===== STATS ===== */}
        <div style={statsWrapper}>
          <Stat 
            title="Services" 
            value={services.length} 
            onClick={goToServices}
            icon="🛠️"
            color="#8b5cf6"
          />
          <Stat 
            title="Orders" 
            value={orders.length} 
            onClick={goToOrders}
            icon="📦"
            color="#f59e0b"
          />
          <Stat 
            title="Profile & Earnings" 
            value={`Rs ${earnings}`} 
            onClick={goToProfile}
            icon="💰"
            color="#22c55e"
          />
        </div>

        {/* ===== TABS ===== */}
        <div style={tabs}>
          {[
            { key: "overview", label: "Overview", icon: "📊" },
            { key: "services", label: "Services", icon: "🛠️" },
            { key: "orders", label: "Orders", icon: "📦" }
          ].map((tab) => (
            <button
              key={tab.key}
              style={activeTab === tab.key ? activeBtn : btn}
              onClick={() => setActiveTab(tab.key)}
              onMouseEnter={(e) => {
                if (activeTab !== tab.key) {
                  e.currentTarget.style.background = "rgba(79, 124, 255, 0.2)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.key) {
                  e.currentTarget.style.background = "rgba(15, 23, 42, 0.8)";
                  e.currentTarget.style.transform = "translateY(0)";
                }
              }}
            >
              <span style={tabIcon}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ===== OVERVIEW ===== */}
        {activeTab === "overview" && vendor && (
          <div style={overviewContainer}>
            <div style={welcomeCard}>
              <div style={welcomeIcon}>👋</div>
              <h3 style={welcomeTitle}>Welcome, <b>{vendor.name}</b>!</h3>
              <div style={vendorInfoGrid}>
                <div style={infoItem}>
                  <span style={infoIcon}>✉️</span>
                  <div>
                    <p style={infoLabel}>Email</p>
                    <p style={infoValue}>{vendor.email}</p>
                  </div>
                </div>
                <div style={infoItem}>
                  <span style={infoIcon}>👤</span>
                  <div>
                    <p style={infoLabel}>Role</p>
                    <p style={infoValue}>{vendor.role}</p>
                  </div>
                </div>
              </div>
              <p style={welcomeText}>Click the stats above to manage your services and orders.</p>
            </div>
          </div>
        )}

        {/* ===== SERVICES TAB ===== */}
        {activeTab === "services" && (
          <div style={contentSection}>
            <div style={sectionHeader}>
              <span style={sectionIcon}>🛠️</span>
              <h3 style={sectionTitle}>My Services</h3>
              <span style={countBadge}>{services.length} Total</span>
            </div>
            {services.length === 0 ? (
              <EmptyState icon="🛠️" message="No services added yet" />
            ) : (
              services.map((s) => (
                <div key={s._id} style={card}>
                  <div style={serviceCardHeader}>
                    <div style={serviceIconCircle}>
                      <span style={serviceIconSmall}>🛠️</span>
                    </div>
                    <div style={serviceCardInfo}>
                      <b style={serviceCardName}>{s.name}</b>
                      <p style={serviceCardDesc}>{s.description}</p>
                      <div style={serviceMetaRow}>
                        <span style={priceTag}>
                          <span style={priceIcon}>💰</span>
                          Rs {s.price}
                        </span>
                        <span style={categoryTag}>
                          <span style={categoryIcon}>📂</span>
                          {s.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ===== ORDERS TAB ===== */}
        {activeTab === "orders" && (
          <div style={contentSection}>
            <div style={sectionHeader}>
              <span style={sectionIcon}>📦</span>
              <h3 style={sectionTitle}>My Orders</h3>
              <span style={countBadge}>{orders.length} Total</span>
            </div>
            {orders.length === 0 ? (
              <EmptyState icon="📦" message="No orders yet" />
            ) : (
              orders.map((o) => (
                <div key={o._id} style={card}>
                  <div style={orderCardContent}>
                    <div style={orderIconCircle}>
                      <span style={orderIcon}>📦</span>
                    </div>
                    <div style={orderInfo}>
                      <b style={orderServiceName}>{o.service.name}</b>
                      <p style={customerInfo}>
                        <span style={customerIcon}>👤</span>
                        Customer: <b>{o.customer.name}</b>
                      </p>
                      <div style={statusRow}>
                        <span style={statusLabel}>Status:</span>
                        <span style={getStatusBadgeStyle(o.status)}>
                          {getStatusIcon(o.status)} {o.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ===== HELPER FUNCTIONS ===== */
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

/* ===== REUSABLE COMPONENTS ===== */
const Stat = ({ title, value, onClick, icon, color }) => (
  <div
    onClick={onClick}
    style={{...statCard, borderColor: color + "40"}}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-5px)";
      e.currentTarget.style.boxShadow = `0 10px 30px ${color}40`;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.3)";
    }}
  >
    <div style={{...statIconCircle, background: color + "20", border: `2px solid ${color}40`}}>
      <span style={statIconLarge}>{icon}</span>
    </div>
    <p style={statTitle}>{title}</p>
    <p style={{...statValue, color}}>{value}</p>
  </div>
);

const EmptyState = ({ icon, message }) => (
  <div style={emptyStateContainer}>
    <span style={emptyStateIcon}>{icon}</span>
    <p style={emptyStateText}>{message}</p>
  </div>
);

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

const vendorIconCircle = {
  width: "70px",
  height: "70px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(22, 163, 74, 0.1) 100%)",
  border: "3px solid rgba(34, 197, 94, 0.3)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 8px 25px rgba(34, 197, 94, 0.3)"
};

const vendorIconLarge = {
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

const statsWrapper = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "1.5rem",
  marginBottom: "2rem"
};

const statCard = {
  background: "rgba(15, 23, 42, 0.8)",
  backdropFilter: "blur(10px)",
  padding: "2rem",
  borderRadius: "20px",
  border: "2px solid",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
  cursor: "pointer",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "1rem",
  minHeight: "180px",
  justifyContent: "center"
};

const statIconCircle = {
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const statIconLarge = {
  fontSize: "2rem"
};

const statTitle = {
  fontSize: "1rem",
  fontWeight: "600",
  color: "#cbd5e1",
  margin: 0
};

const statValue = {
  fontSize: "2rem",
  fontWeight: "700",
  margin: 0
};

const tabs = {
  display: "flex",
  gap: "1rem",
  marginBottom: "2rem",
  flexWrap: "wrap"
};

const btn = {
  background: "rgba(15, 23, 42, 0.8)",
  color: "white",
  padding: "12px 20px",
  border: "2px solid rgba(148, 163, 184, 0.2)",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "0.95rem",
  transition: "all 0.3s ease",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem"
};

const activeBtn = {
  ...btn,
  background: "linear-gradient(135deg, #4f7cff 0%, #3b5bdb 100%)",
  border: "2px solid rgba(79, 124, 255, 0.5)",
  boxShadow: "0 4px 15px rgba(79, 124, 255, 0.3)"
};

const tabIcon = {
  fontSize: "1.1rem"
};

const overviewContainer = {
  display: "flex",
  flexDirection: "column",
  gap: "2rem"
};

const welcomeCard = {
  background: "rgba(15, 23, 42, 0.8)",
  backdropFilter: "blur(10px)",
  padding: "3rem",
  borderRadius: "20px",
  border: "2px solid rgba(34, 197, 94, 0.2)",
  textAlign: "center",
  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.4)"
};

const welcomeIcon = {
  fontSize: "4rem",
  marginBottom: "1rem"
};

const welcomeTitle = {
  fontSize: "2rem",
  marginBottom: "2rem",
  color: "#e2e8f0"
};

const vendorInfoGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "1.5rem",
  marginBottom: "2rem",
  textAlign: "left"
};

const infoItem = {
  display: "flex",
  alignItems: "flex-start",
  gap: "1rem",
  padding: "1.5rem",
  background: "rgba(79, 124, 255, 0.1)",
  borderRadius: "12px",
  border: "1px solid rgba(79, 124, 255, 0.2)"
};

const infoIcon = {
  fontSize: "1.8rem"
};

const infoLabel = {
  fontSize: "0.85rem",
  color: "#94a3b8",
  margin: "0 0 0.25rem 0"
};

const infoValue = {
  fontSize: "1.1rem",
  fontWeight: "600",
  color: "#e2e8f0",
  margin: 0
};

const welcomeText = {
  fontSize: "1.1rem",
  color: "#94a3b8",
  margin: 0
};

const contentSection = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem"
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
  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)"
};

const serviceCardHeader = {
  display: "flex",
  gap: "1rem",
  alignItems: "flex-start"
};

const serviceIconCircle = {
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(124, 58, 237, 0.1) 100%)",
  border: "2px solid rgba(139, 92, 246, 0.3)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0
};

const serviceIconSmall = {
  fontSize: "2rem"
};

const serviceCardInfo = {
  flex: 1
};

const serviceCardName = {
  fontSize: "1.3rem",
  color: "#e2e8f0",
  marginBottom: "0.5rem",
  display: "block"
};

const serviceCardDesc = {
  fontSize: "0.95rem",
  color: "#94a3b8",
  lineHeight: "1.6",
  marginBottom: "0.75rem"
};

const serviceMetaRow = {
  display: "flex",
  gap: "1rem",
  flexWrap: "wrap"
};

const priceTag = {
  padding: "0.5rem 1rem",
  background: "rgba(34, 197, 94, 0.15)",
  border: "1px solid rgba(34, 197, 94, 0.3)",
  borderRadius: "20px",
  fontSize: "0.95rem",
  fontWeight: "600",
  color: "#4ade80",
  display: "flex",
  alignItems: "center",
  gap: "0.4rem"
};

const priceIcon = {
  fontSize: "1rem"
};

const categoryTag = {
  padding: "0.5rem 1rem",
  background: "rgba(139, 92, 246, 0.15)",
  border: "1px solid rgba(139, 92, 246, 0.3)",
  borderRadius: "20px",
  fontSize: "0.95rem",
  fontWeight: "600",
  color: "#a78bfa",
  display: "flex",
  alignItems: "center",
  gap: "0.4rem"
};

const categoryIcon = {
  fontSize: "1rem"
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

const orderServiceName = {
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