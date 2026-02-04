import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [servicesCount, setServicesCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [earnings, setEarnings] = useState(0);

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalVendors, setTotalVendors] = useState(0);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      const token = localStorage.getItem("token");
      if (!token) return;

      const headers = { Authorization: `Bearer ${token}` };

      try {
        /* ================= VENDOR (DO NOT TOUCH LOGIC) ================= */
        if (user.role === "vendor") {
          const servicesRes = await axios.get(
            "http://localhost:5000/api/services",
            { headers }
          );
          const vendorServices = servicesRes.data.filter(
            (s) => s.vendor?._id === user._id
          );
          setServicesCount(vendorServices.length);

          const ordersRes = await axios.get(
            "http://localhost:5000/api/orders",
            { headers }
          );
          const vendorOrders = ordersRes.data.filter(
            (o) => o.service?.vendor?._id === user._id
          );
          setOrdersCount(vendorOrders.length);

          const totalEarnings = vendorOrders
            .filter((o) => o.status === "completed")
            .reduce((sum, o) => sum + o.service.price, 0);

          setEarnings(totalEarnings);
        }

        /* ================= ADMIN ================= */
        if (user.role === "admin") {
          const usersRes = await axios.get(
            "http://localhost:5000/api/users",
            { headers }
          );
          setTotalUsers(
            usersRes.data.filter((u) => u.role === "user").length
          );
          setTotalVendors(
            usersRes.data.filter((u) => u.role === "vendor").length
          );
        }

        /* ================= USER ================= */
        if (user.role === "user") {
          const ordersRes = await axios.get(
            "http://localhost:5000/api/orders",
            { headers }
          );
          const userOrders = ordersRes.data.filter(
            (o) => o.user?._id === user._id
          );
          setOrdersCount(userOrders.length);
        }
      } catch (err) {
        console.error("Profile fetch error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (!user)
    return (
      <div style={errorContainer}>
        <span style={errorIconLarge}>❌</span>
        <p style={errorTextLarge}>No user found.</p>
      </div>
    );

  if (loading)
    return (
      <div style={loadingContainer}>
        <span style={loadingSpinner}>⏳</span>
        <p style={loadingText}>Loading profile…</p>
      </div>
    );

  const getRoleIcon = (role) => {
    switch(role) {
      case "admin": return "👑";
      case "vendor": return "🛠️";
      case "user": return "👤";
      default: return "👤";
    }
  };

  return (
    <>
      <Navbar role={user.role} />
      <div style={page}>
        <div style={headerSection}>
          <div style={avatarSection}>
            <div style={avatarLarge}>
              <span style={avatarIcon}>{getRoleIcon(user.role)}</span>
            </div>
            <div>
              <h2 style={pageTitle}>My Profile</h2>
              <p style={pageSubtitle}>Manage your account and view statistics</p>
            </div>
          </div>
        </div>

        {/* ===== PROFILE INFO ===== */}
        <div style={profileCard}>
          <div style={profileHeader}>
            <span style={profileHeaderIcon}>👤</span>
            <h3 style={profileHeaderTitle}>Personal Information</h3>
          </div>
          
          <div style={infoGrid}>
            <div style={infoItem}>
              <span style={infoIcon}>📝</span>
              <div>
                <p style={infoLabel}>Name</p>
                <p style={infoValue}>{user.name}</p>
              </div>
            </div>

            <div style={infoItem}>
              <span style={infoIcon}>✉️</span>
              <div>
                <p style={infoLabel}>Email</p>
                <p style={infoValue}>{user.email}</p>
              </div>
            </div>

            <div style={infoItem}>
              <span style={infoIcon}>{getRoleIcon(user.role)}</span>
              <div>
                <p style={infoLabel}>Role</p>
                <p style={infoValue}>
                  <span style={roleBadge(user.role)}>{user.role}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ===== ADMIN STATS ===== */}
        {user.role === "admin" && (
          <>
            <div style={sectionHeader}>
              <span style={sectionIcon}>📊</span>
              <h3 style={sectionTitle}>Platform Statistics</h3>
            </div>
            <div style={statsGrid}>
              <StatCard title="Total Users" value={totalUsers} icon="👥" color="#4f7cff" />
              <StatCard title="Total Vendors" value={totalVendors} icon="🛠️" color="#10b981" />
            </div>
          </>
        )}

        {/* ===== VENDOR STATS ===== */}
        {user.role === "vendor" && (
          <>
            <div style={sectionHeader}>
              <span style={sectionIcon}>📊</span>
              <h3 style={sectionTitle}>Business Analytics</h3>
            </div>
            <div style={statsGrid}>
              <StatCard title="My Services" value={servicesCount} icon="🛠️" color="#4f7cff" />
              <StatCard title="Total Orders" value={ordersCount} icon="📦" color="#f59e0b" />
              <StatCard title="Earnings" value={`Rs ${earnings}`} icon="💰" color="#10b981" />
            </div>
          </>
        )}

        {/* ===== USER STATS ===== */}
        {user.role === "user" && (
          <>
            <div style={sectionHeader}>
              <span style={sectionIcon}>📊</span>
              <h3 style={sectionTitle}>My Activity</h3>
            </div>
            <div style={statsGrid}>
              <StatCard title="My Orders" value={ordersCount} icon="📦" color="#4f7cff" />
            </div>
          </>
        )}
      </div>
    </>
  );
}

/* ================= COMPONENTS ================= */
const StatCard = ({ title, value, icon, color }) => (
  <div 
    style={statCard}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-5px)";
      e.currentTarget.style.boxShadow = `0 10px 30px ${color}30`;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.2)";
    }}
  >
    <div style={{...statIconCircle, background: color + "20", border: `2px solid ${color}40`}}>
      <span style={statIconEmoji}>{icon}</span>
    </div>
    <h4 style={statTitle}>{title}</h4>
    <p style={{...statValue, color: color}}>{value}</p>
  </div>
);

/* ================= ENHANCED STYLES ================= */
const page = {
  minHeight: "100vh",
  padding: "2rem",
  background: "linear-gradient(135deg, #0a0e1a 0%, #1a1f35 100%)",
  color: "white",
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  maxWidth: "1200px",
  margin: "0 auto"
};

const errorContainer = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "1rem",
  background: "linear-gradient(135deg, #0a0e1a 0%, #1a1f35 100%)"
};

const errorIconLarge = {
  fontSize: "5rem"
};

const errorTextLarge = {
  color: "#f87171",
  fontSize: "1.5rem"
};

const loadingContainer = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "1rem",
  background: "linear-gradient(135deg, #0a0e1a 0%, #1a1f35 100%)"
};

const loadingSpinner = {
  fontSize: "4rem",
  animation: "spin 1s linear infinite"
};

const loadingText = {
  color: "#cbd5e1",
  fontSize: "1.2rem"
};

const headerSection = {
  marginBottom: "2.5rem"
};

const avatarSection = {
  display: "flex",
  alignItems: "center",
  gap: "1.5rem"
};

const avatarLarge = {
  width: "100px",
  height: "100px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, rgba(79, 124, 255, 0.2) 0%, rgba(59, 91, 219, 0.1) 100%)",
  border: "3px solid rgba(79, 124, 255, 0.3)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 8px 25px rgba(79, 124, 255, 0.3)"
};

const avatarIcon = {
  fontSize: "3.5rem"
};

const pageTitle = {
  fontSize: "2.5rem",
  fontWeight: "700",
  marginBottom: "0.5rem",
  background: "linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text"
};

const pageSubtitle = {
  color: "#94a3b8",
  fontSize: "1.05rem"
};

const profileCard = {
  background: "rgba(15, 23, 42, 0.8)",
  backdropFilter: "blur(10px)",
  padding: "2rem",
  borderRadius: "20px",
  marginBottom: "2.5rem",
  border: "1px solid rgba(148, 163, 184, 0.1)",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)"
};

const profileHeader = {
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  marginBottom: "1.5rem",
  paddingBottom: "1rem",
  borderBottom: "1px solid rgba(148, 163, 184, 0.1)"
};

const profileHeaderIcon = {
  fontSize: "1.8rem"
};

const profileHeaderTitle = {
  fontSize: "1.4rem",
  fontWeight: "600",
  color: "#e2e8f0"
};

const infoGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "1.5rem"
};

const infoItem = {
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  padding: "1.25rem",
  background: "rgba(2, 6, 23, 0.4)",
  borderRadius: "12px",
  border: "1px solid rgba(148, 163, 184, 0.05)"
};

const infoIcon = {
  fontSize: "2rem",
  width: "50px",
  height: "50px",
  borderRadius: "12px",
  background: "rgba(79, 124, 255, 0.15)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const infoLabel = {
  fontSize: "0.85rem",
  color: "#94a3b8",
  marginBottom: "0.25rem"
};

const infoValue = {
  fontSize: "1.1rem",
  fontWeight: "600",
  color: "#e2e8f0"
};

const roleBadge = (role) => ({
  padding: "0.4rem 1rem",
  borderRadius: "20px",
  fontSize: "0.9rem",
  fontWeight: "600",
  background: 
    role === "admin" 
      ? "rgba(168, 85, 247, 0.15)" 
      : role === "vendor" 
      ? "rgba(34, 197, 94, 0.15)" 
      : "rgba(79, 124, 255, 0.15)",
  color: 
    role === "admin" 
      ? "#c084fc" 
      : role === "vendor" 
      ? "#4ade80" 
      : "#60a5fa",
  border: `1px solid ${
    role === "admin" 
      ? "rgba(168, 85, 247, 0.3)" 
      : role === "vendor" 
      ? "rgba(34, 197, 94, 0.3)" 
      : "rgba(79, 124, 255, 0.3)"
  }`,
  textTransform: "capitalize"
});

const sectionHeader = {
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  marginBottom: "1.5rem"
};

const sectionIcon = {
  fontSize: "1.8rem"
};

const sectionTitle = {
  fontSize: "1.5rem",
  fontWeight: "600",
  color: "#e2e8f0"
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "1.5rem",
  marginBottom: "2rem"
};

const statCard = {
  background: "rgba(15, 23, 42, 0.8)",
  backdropFilter: "blur(10px)",
  padding: "2rem",
  borderRadius: "20px",
  textAlign: "center",
  border: "1px solid rgba(148, 163, 184, 0.1)",
  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
  transition: "all 0.3s ease",
  cursor: "pointer"
};

const statIconCircle = {
  width: "70px",
  height: "70px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto 1rem"
};

const statIconEmoji = {
  fontSize: "2.2rem"
};

const statTitle = {
  fontSize: "1rem",
  color: "#94a3b8",
  marginBottom: "0.75rem",
  fontWeight: "500"
};

const statValue = {
  fontSize: "2.5rem",
  fontWeight: "700",
  lineHeight: "1"
};