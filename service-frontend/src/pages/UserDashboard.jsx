import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function UserDashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  return (
    <div style={page}>
      <Navbar role={role} />

      <div style={content}>
        <div style={headerSection}>
          <div style={titleGroup}>
            <div style={userIconCircle}>
              <span style={userIconLarge}>👤</span>
            </div>
            <div>
              <h2 style={pageTitle}>User Dashboard</h2>
              <p style={pageSubtitle}>
                Manage your services, orders, payments & profile
              </p>
            </div>
          </div>
        </div>

        <div style={grid}>
          <Card
            icon="🛠️"
            title="Browse Services"
            desc="Explore available services"
            onClick={() => navigate("/services")}
            color="#8b5cf6"
          />

          <Card
            icon="📦"
            title="My Orders"
            desc="Track your bookings"
            onClick={() => navigate("/orders")}
            color="#f59e0b"
          />

          <Card
            icon="💳"
            title="Payments"
            desc="View payment history"
            onClick={() => navigate("/payments")}
            color="#22c55e"
          />

          <Card
            icon="⭐"
            title="My Reviews"
            desc="Manage your reviews"
            onClick={() => navigate("/reviews")}
            color="#facc15"
          />

          <Card
            icon="👤"
            title="Profile"
            desc="Edit your profile"
            onClick={() => navigate("/profile")}
            highlight
          />
        </div>
      </div>
    </div>
  );
}

/* ================= CARD COMPONENT ================= */
const Card = ({ icon, title, desc, onClick, highlight, color }) => (
  <div
    style={{
      ...card,
      background: highlight
        ? "linear-gradient(135deg, #4f7cff 0%, #3b5bdb 100%)"
        : card.background,
      border: highlight 
        ? "2px solid rgba(79, 124, 255, 0.5)" 
        : `2px solid ${color}40`,
    }}
    onClick={onClick}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-8px)";
      e.currentTarget.style.boxShadow = highlight
        ? "0 15px 40px rgba(79, 124, 255, 0.4)"
        : `0 15px 40px ${color}40`;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.3)";
    }}
  >
    <div style={cardIconCircle}>
      <span style={{...cardIcon, background: highlight ? "rgba(255, 255, 255, 0.2)" : `${color}20`, border: highlight ? "2px solid rgba(255, 255, 255, 0.3)" : `2px solid ${color}40`}}>
        {icon}
      </span>
    </div>
    <div style={cardContent}>
      <h3 style={cardTitle}>
        {title}
      </h3>
      <p style={{...cardDesc, color: highlight ? "#e0e7ff" : "#cbd5e1"}}>
        {desc}
      </p>
    </div>
    <div style={{...cardArrow, color: highlight ? "#ffffff" : color}}>
      →
    </div>
  </div>
);

/* ================= ENHANCED STYLES ================= */
const page = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #0a0e1a 0%, #1a1f35 100%)",
  color: "white",
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
};

const content = {
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

const userIconCircle = {
  width: "70px",
  height: "70px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, rgba(79, 124, 255, 0.2) 0%, rgba(59, 91, 219, 0.1) 100%)",
  border: "3px solid rgba(79, 124, 255, 0.3)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 8px 25px rgba(79, 124, 255, 0.3)"
};

const userIconLarge = {
  fontSize: "2.5rem"
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
  fontSize: "1rem",
  margin: 0
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "1.5rem"
};

const card = {
  background: "rgba(15, 23, 42, 0.8)",
  backdropFilter: "blur(10px)",
  padding: "2rem",
  borderRadius: "20px",
  cursor: "pointer",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",
  position: "relative",
  overflow: "hidden"
};

const cardIconCircle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const cardIcon = {
  fontSize: "3rem",
  width: "80px",
  height: "80px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.3s ease"
};

const cardContent = {
  flex: 1
};

const cardTitle = {
  fontSize: "1.4rem",
  fontWeight: "700",
  marginBottom: "0.5rem",
  color: "#e2e8f0"
};

const cardDesc = {
  fontSize: "0.95rem",
  lineHeight: "1.6",
  margin: 0
};

const cardArrow = {
  fontSize: "1.8rem",
  fontWeight: "700",
  alignSelf: "flex-end",
  transition: "all 0.3s ease"
};