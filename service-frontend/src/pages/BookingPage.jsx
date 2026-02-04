import React, { useState } from "react";

export default function BookingPage() {
  const [service, setService] = useState("Cleaning");
  const [focusedField, setFocusedField] = useState("");

  const serviceOptions = [
    { value: "Cleaning", icon: "🧹" },
    { value: "Plumbing", icon: "🔧" },
    { value: "Electrical", icon: "⚡" }
  ];

  return (
    <div style={page}>
      <div style={bgCircle1}></div>
      <div style={bgCircle2}></div>

      <div style={container}>
        <div style={headerSection}>
          <div style={iconCircle}>
            <span style={iconLarge}>📅</span>
          </div>
          <h1 style={title}>Book a Service</h1>
          <p style={subtitle}>Schedule your service in just a few steps</p>
        </div>

        <div style={card}>
          <div style={inputGroup}>
            <label style={label}>
              <span style={labelIcon}>🛠️</span>
              Select Service
            </label>
            <div style={selectWrapper}>
              <span style={selectIcon}>
                {serviceOptions.find(s => s.value === service)?.icon}
              </span>
              <select
                style={input}
                value={service}
                onChange={(e) => setService(e.target.value)}
              >
                {serviceOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.value}
                  </option>
                ))}
              </select>
              <span style={dropdownArrow}>▼</span>
            </div>
          </div>

          <div style={inputGroup}>
            <label style={label}>
              <span style={labelIcon}>📅</span>
              Service Date
            </label>
            <input
              type="date"
              style={{
                ...input,
                ...(focusedField === "date" ? inputFocused : {})
              }}
              onFocus={() => setFocusedField("date")}
              onBlur={() => setFocusedField("")}
            />
          </div>

          <div style={inputGroup}>
            <label style={label}>
              <span style={labelIcon}>📍</span>
              Service Address
            </label>
            <div style={inputWrapper}>
              <span style={inputIconLeft}>🏠</span>
              <input
                placeholder="Enter service location"
                style={{
                  ...input,
                  paddingLeft: "3rem",
                  ...(focusedField === "address" ? inputFocused : {})
                }}
                onFocus={() => setFocusedField("address")}
                onBlur={() => setFocusedField("")}
              />
            </div>
          </div>

          <div style={featuresList}>
            <div style={featureItem}>
              <span style={featureIcon}>✓</span>
              <span style={featureText}>Verified Professionals</span>
            </div>
            <div style={featureItem}>
              <span style={featureIcon}>✓</span>
              <span style={featureText}>Flexible Scheduling</span>
            </div>
            <div style={featureItem}>
              <span style={featureIcon}>✓</span>
              <span style={featureText}>Quality Guaranteed</span>
            </div>
          </div>

          <button
            style={btn}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 25px rgba(79, 124, 255, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 15px rgba(79, 124, 255, 0.3)";
            }}
          >
            <span style={btnIcon}>✓</span>
            Confirm Booking
          </button>
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
  padding: "3rem 1.5rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  overflow: "hidden",
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
};

const bgCircle1 = {
  position: "absolute",
  width: "500px",
  height: "500px",
  borderRadius: "50%",
  background: "radial-gradient(circle, rgba(79, 124, 255, 0.15) 0%, transparent 70%)",
  top: "-250px",
  right: "-250px",
  pointerEvents: "none"
};

const bgCircle2 = {
  position: "absolute",
  width: "400px",
  height: "400px",
  borderRadius: "50%",
  background: "radial-gradient(circle, rgba(59, 91, 219, 0.1) 0%, transparent 70%)",
  bottom: "-200px",
  left: "-200px",
  pointerEvents: "none"
};

const container = {
  width: "100%",
  maxWidth: "550px",
  position: "relative",
  zIndex: 1
};

const headerSection = {
  textAlign: "center",
  marginBottom: "2.5rem"
};

const iconCircle = {
  width: "90px",
  height: "90px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, rgba(79, 124, 255, 0.2) 0%, rgba(59, 91, 219, 0.1) 100%)",
  border: "3px solid rgba(79, 124, 255, 0.3)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto 1.5rem",
  boxShadow: "0 8px 25px rgba(79, 124, 255, 0.3)"
};

const iconLarge = {
  fontSize: "3rem"
};

const title = {
  fontSize: "2.5rem",
  fontWeight: "700",
  marginBottom: "0.5rem",
  background: "linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text"
};

const subtitle = {
  color: "#94a3b8",
  fontSize: "1rem"
};

const card = {
  background: "rgba(15, 23, 42, 0.9)",
  backdropFilter: "blur(20px)",
  padding: "2.5rem",
  borderRadius: "24px",
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",
  border: "1px solid rgba(148, 163, 184, 0.1)",
  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)"
};

const inputGroup = {
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem"
};

const label = {
  fontSize: "0.9rem",
  fontWeight: "600",
  color: "#cbd5e1",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem"
};

const labelIcon = {
  fontSize: "1.1rem"
};

const selectWrapper = {
  position: "relative",
  display: "flex",
  alignItems: "center"
};

const selectIcon = {
  position: "absolute",
  left: "16px",
  fontSize: "1.2rem",
  pointerEvents: "none",
  zIndex: 1
};

const dropdownArrow = {
  position: "absolute",
  right: "16px",
  fontSize: "0.7rem",
  color: "#94a3b8",
  pointerEvents: "none"
};

const inputWrapper = {
  position: "relative",
  display: "flex",
  alignItems: "center"
};

const inputIconLeft = {
  position: "absolute",
  left: "16px",
  fontSize: "1.2rem",
  pointerEvents: "none"
};

const input = {
  width: "100%",
  padding: "14px 16px",
  paddingLeft: "3rem",
  borderRadius: "12px",
  border: "2px solid rgba(148, 163, 184, 0.2)",
  background: "rgba(2, 6, 23, 0.6)",
  color: "white",
  fontSize: "0.95rem",
  outline: "none",
  transition: "all 0.3s ease",
  appearance: "none"
};

const inputFocused = {
  border: "2px solid #4f7cff",
  background: "rgba(2, 6, 23, 0.8)",
  boxShadow: "0 0 0 3px rgba(79, 124, 255, 0.1)"
};

const featuresList = {
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
  padding: "1.5rem",
  background: "rgba(79, 124, 255, 0.05)",
  borderRadius: "12px",
  border: "1px solid rgba(79, 124, 255, 0.15)"
};

const featureItem = {
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  fontSize: "0.95rem",
  color: "#e2e8f0"
};

const featureIcon = {
  width: "24px",
  height: "24px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "0.75rem",
  fontWeight: "700"
};

const featureText = {
  flex: 1
};

const btn = {
  padding: "16px",
  background: "linear-gradient(135deg, #4f7cff 0%, #3b5bdb 100%)",
  border: "none",
  borderRadius: "12px",
  color: "white",
  cursor: "pointer",
  fontSize: "1.05rem",
  fontWeight: "700",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.5rem",
  boxShadow: "0 4px 15px rgba(79, 124, 255, 0.3)",
  transition: "all 0.3s ease"
};

const btnIcon = {
  fontSize: "1.2rem"
};