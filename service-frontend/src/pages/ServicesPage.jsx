import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function ServicesPage() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const role = localStorage.getItem("role") || "";
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:5000/api/services", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setServices(res.data))
      .catch((err) => console.error(err));
  }, [token, navigate]);

  const getServiceIcon = (name) => {
    const lowercaseName = name?.toLowerCase() || "";
    if (lowercaseName.includes("clean")) return "🧹";
    if (lowercaseName.includes("plumb")) return "🔧";
    if (lowercaseName.includes("electric")) return "⚡";
    if (lowercaseName.includes("ac") || lowercaseName.includes("air")) return "❄️";
    if (lowercaseName.includes("paint")) return "🎨";
    if (lowercaseName.includes("carpenter")) return "🪚";
    return "🛠️";
  };

  return (
    <div style={page}>
      <Navbar role={role} />

      <div style={content}>
        <div style={headerSection}>
          <div style={titleGroup}>
            <div style={iconCircle}>
              <span style={iconLarge}>🛠️</span>
            </div>
            <div>
              <h2 style={title}>Available Services</h2>
              <p style={subtitle}>Browse and book professional services</p>
            </div>
          </div>
          <div style={statsBox}>
            <span style={statsIcon}>📊</span>
            <span style={statsText}>{services.length} Services Available</span>
          </div>
        </div>

        <div style={grid}>
          {services.map((s) => (
            <div 
              key={s._id} 
              style={card}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 15px 40px rgba(79, 124, 255, 0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.3)";
              }}
            >
              <div style={cardHeader}>
                <div style={serviceIconCircle}>
                  <span style={serviceIcon}>{getServiceIcon(s.name)}</span>
                </div>
                <div style={vendorBadge}>
                  <span style={vendorIcon}>👨‍🔧</span>
                  <span style={vendorText}>Verified</span>
                </div>
              </div>

              <h3 style={serviceName}>{s.name}</h3>
              <p style={serviceDesc}>{s.description}</p>

              <div style={priceSection}>
                <span style={priceLabel}>Price</span>
                <div style={priceBox}>
                  <span style={currencySymbol}>Rs</span>
                  <span style={priceAmount}>{s.price}</span>
                </div>
              </div>

              {role === "user" && (
                <button
                  style={btn}
                  onClick={() =>
                    navigate("/book-service", { state: { serviceId: s._id } })
                  }
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(34, 197, 94, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 15px rgba(34, 197, 94, 0.3)";
                  }}
                >
                  <span style={btnIcon}>📅</span>
                  Book Service
                </button>
              )}
            </div>
          ))}
        </div>
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

const content = {
  padding: "2rem",
  maxWidth: "1400px",
  margin: "0 auto"
};

const headerSection = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "2.5rem",
  flexWrap: "wrap",
  gap: "1.5rem"
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
  background: "linear-gradient(135deg, rgba(79, 124, 255, 0.2) 0%, rgba(59, 91, 219, 0.1) 100%)",
  border: "2px solid rgba(79, 124, 255, 0.3)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 8px 25px rgba(79, 124, 255, 0.3)"
};

const iconLarge = {
  fontSize: "2.5rem"
};

const title = {
  fontSize: "2.5rem",
  fontWeight: "700",
  marginBottom: "0.25rem",
  background: "linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text"
};

const subtitle = {
  color: "#94a3b8",
  fontSize: "1rem"
};

const statsBox = {
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  padding: "1rem 1.5rem",
  background: "rgba(79, 124, 255, 0.15)",
  borderRadius: "12px",
  border: "1px solid rgba(79, 124, 255, 0.3)"
};

const statsIcon = {
  fontSize: "1.5rem"
};

const statsText = {
  fontSize: "1rem",
  fontWeight: "600",
  color: "#93c5fd"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gap: "2rem"
};

const card = {
  background: "rgba(15, 23, 42, 0.8)",
  backdropFilter: "blur(10px)",
  padding: "2rem",
  borderRadius: "20px",
  border: "1px solid rgba(148, 163, 184, 0.1)",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  display: "flex",
  flexDirection: "column"
};

const cardHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "1.5rem"
};

const serviceIconCircle = {
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, rgba(79, 124, 255, 0.15) 0%, rgba(59, 91, 219, 0.1) 100%)",
  border: "2px solid rgba(79, 124, 255, 0.2)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const serviceIcon = {
  fontSize: "2rem"
};

const vendorBadge = {
  display: "flex",
  alignItems: "center",
  gap: "0.4rem",
  padding: "0.4rem 0.8rem",
  background: "rgba(34, 197, 94, 0.15)",
  border: "1px solid rgba(34, 197, 94, 0.3)",
  borderRadius: "20px"
};

const vendorIcon = {
  fontSize: "1rem"
};

const vendorText = {
  fontSize: "0.8rem",
  fontWeight: "600",
  color: "#4ade80"
};

const serviceName = {
  fontSize: "1.5rem",
  fontWeight: "700",
  marginBottom: "0.75rem",
  color: "#e2e8f0"
};

const serviceDesc = {
  fontSize: "0.95rem",
  color: "#94a3b8",
  lineHeight: "1.6",
  marginBottom: "1.5rem",
  flexGrow: "1"
};

const priceSection = {
  marginBottom: "1.5rem"
};

const priceLabel = {
  fontSize: "0.85rem",
  color: "#94a3b8",
  display: "block",
  marginBottom: "0.5rem",
  fontWeight: "500"
};

const priceBox = {
  display: "flex",
  alignItems: "baseline",
  gap: "0.5rem",
  padding: "1rem 1.25rem",
  background: "rgba(79, 124, 255, 0.1)",
  borderRadius: "12px",
  border: "1px solid rgba(79, 124, 255, 0.2)"
};

const currencySymbol = {
  fontSize: "1.2rem",
  fontWeight: "700",
  color: "#93c5fd"
};

const priceAmount = {
  fontSize: "2rem",
  fontWeight: "700",
  color: "#4f7cff"
};

const btn = {
  marginTop: "auto",
  padding: "14px",
  width: "100%",
  background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  color: "white",
  fontSize: "1rem",
  fontWeight: "600",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.5rem",
  boxShadow: "0 4px 15px rgba(34, 197, 94, 0.3)",
  transition: "all 0.3s ease"
};

const btnIcon = {
  fontSize: "1.2rem"
};