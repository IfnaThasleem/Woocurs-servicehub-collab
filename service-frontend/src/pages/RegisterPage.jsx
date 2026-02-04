// src/pages/RegisterPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    role: "user", // backend enum: user | vendor | admin
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError("All fields are required");
      return;
    }

    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });

      alert(res.data.message); // "User registered successfully"
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: "user", label: "Customer", icon: "👤", desc: "Book services" },
    { value: "vendor", label: "Vendor", icon: "🛠️", desc: "Provide services" },
    { value: "admin", label: "Admin", icon: "👑", desc: "Manage platform" }
  ];

  return (
    <div style={authContainer}>
      {/* Background decorative elements */}
      <div style={bgCircle1}></div>
      <div style={bgCircle2}></div>
      
      <div style={authWrapper}>
        {/* Left side - Branding */}
        <div style={brandingSide}>
          <div style={logoSection}>
            <span style={logoIcon}>🔧</span>
            <span style={logoText}>ServiceHub</span>
          </div>
          
          <h1 style={brandingTitle}>Join Our Platform</h1>
          <p style={brandingSubtitle}>
            Connect with trusted professionals or offer your services to thousands of customers
          </p>
          
          <div style={featuresList}>
            <div style={featureItem}>
              <span style={featureIcon}>✓</span>
              <span>Verified professionals</span>
            </div>
            <div style={featureItem}>
              <span style={featureIcon}>✓</span>
              <span>Secure payments</span>
            </div>
            <div style={featureItem}>
              <span style={featureIcon}>✓</span>
              <span>24/7 support</span>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <form style={authBox} onSubmit={handleSubmit}>
          <div style={formHeader}>
            <h2 style={formTitle}>Create Account</h2>
            <p style={formSubtitle}>Start your journey with us today</p>
          </div>

          {error && (
            <div style={errorBox}>
              <span style={errorIcon}>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div style={inputGroup}>
            <label style={inputLabel}>
              <span style={labelIcon}>👤</span>
              Full Name
            </label>
            <input
              style={{
                ...input,
                ...(focusedField === "name" ? inputFocused : {})
              }}
              placeholder="Enter your full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              onFocus={() => setFocusedField("name")}
              onBlur={() => setFocusedField("")}
            />
          </div>

          <div style={inputGroup}>
            <label style={inputLabel}>
              <span style={labelIcon}>✉️</span>
              Email Address
            </label>
            <input
              style={{
                ...input,
                ...(focusedField === "email" ? inputFocused : {})
              }}
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField("")}
            />
          </div>

          <div style={inputGroup}>
            <label style={inputLabel}>
              <span style={labelIcon}>🔒</span>
              Password
            </label>
            <input
              type="password"
              style={{
                ...input,
                ...(focusedField === "password" ? inputFocused : {})
              }}
              placeholder="Create a strong password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField("")}
            />
          </div>

          <div style={inputGroup}>
            <label style={inputLabel}>
              <span style={labelIcon}>🔑</span>
              Confirm Password
            </label>
            <input
              type="password"
              style={{
                ...input,
                ...(focusedField === "confirm" ? inputFocused : {})
              }}
              placeholder="Re-enter your password"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              onFocus={() => setFocusedField("confirm")}
              onBlur={() => setFocusedField("")}
            />
          </div>

          <div style={inputGroup}>
            <label style={inputLabel}>
              <span style={labelIcon}>🎭</span>
              Account Type
            </label>
            <div style={roleSelector}>
              {roleOptions.map(option => (
                <div
                  key={option.value}
                  style={{
                    ...roleCard,
                    ...(form.role === option.value ? roleCardActive : {})
                  }}
                  onClick={() => setForm({ ...form, role: option.value })}
                >
                  <span style={roleCardIcon}>{option.icon}</span>
                  <span style={roleCardLabel}>{option.label}</span>
                  <span style={roleCardDesc}>{option.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <button 
            style={{
              ...btnPrimary,
              ...(loading ? btnDisabled : {})
            }}
            disabled={loading}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(79, 124, 255, 0.4)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(79, 124, 255, 0.3)";
              }
            }}
          >
            {loading ? (
              <>
                <span style={spinner}>⏳</span>
                Registering...
              </>
            ) : (
              <>
                <span style={btnIcon}>🚀</span>
                Create Account
              </>
            )}
          </button>

          <div style={footerText}>
            Already have an account?{" "}
            <span 
              style={linkText}
              onClick={() => navigate("/login")}
            >
              Login here
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ===== ENHANCED STYLES ===== */

const authContainer = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #0a0e1a 0%, #1a1f35 100%)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "2rem",
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

const authWrapper = {
  display: "flex",
  maxWidth: "1100px",
  width: "100%",
  gap: "3rem",
  alignItems: "center",
  position: "relative",
  zIndex: 1
};

const brandingSide = {
  flex: "1",
  color: "white",
  display: "flex",
  flexDirection: "column",
  gap: "2rem"
};

const logoSection = {
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  marginBottom: "1rem"
};

const logoIcon = {
  fontSize: "2.5rem"
};

const logoText = {
  fontSize: "2rem",
  fontWeight: "700",
  background: "linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text"
};

const brandingTitle = {
  fontSize: "3rem",
  fontWeight: "700",
  lineHeight: "1.2",
  marginBottom: "0.5rem"
};

const brandingSubtitle = {
  fontSize: "1.15rem",
  color: "#cbd5e1",
  lineHeight: "1.6"
};

const featuresList = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  marginTop: "1rem"
};

const featureItem = {
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  fontSize: "1.05rem",
  color: "#e2e8f0"
};

const featureIcon = {
  width: "28px",
  height: "28px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #4f7cff 0%, #3b5bdb 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "0.85rem",
  fontWeight: "700"
};

const authBox = {
  background: "rgba(18, 26, 58, 0.8)",
  backdropFilter: "blur(20px)",
  padding: "3rem",
  borderRadius: "24px",
  width: "100%",
  maxWidth: "480px",
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",
  color: "white",
  border: "1px solid rgba(148, 163, 184, 0.1)",
  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)"
};

const formHeader = {
  textAlign: "center",
  marginBottom: "0.5rem"
};

const formTitle = {
  fontSize: "2rem",
  fontWeight: "700",
  marginBottom: "0.5rem",
  background: "linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text"
};

const formSubtitle = {
  color: "#94a3b8",
  fontSize: "0.95rem"
};

const errorBox = {
  background: "rgba(239, 68, 68, 0.1)",
  border: "1px solid rgba(239, 68, 68, 0.3)",
  padding: "1rem",
  borderRadius: "12px",
  color: "#fca5a5",
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  fontSize: "0.9rem"
};

const errorIcon = {
  fontSize: "1.2rem"
};

const inputGroup = {
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem"
};

const inputLabel = {
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

const input = {
  padding: "14px 16px",
  borderRadius: "12px",
  border: "2px solid rgba(148, 163, 184, 0.2)",
  background: "rgba(15, 23, 42, 0.6)",
  color: "white",
  fontSize: "0.95rem",
  transition: "all 0.3s ease",
  outline: "none"
};

const inputFocused = {
  border: "2px solid #4f7cff",
  background: "rgba(15, 23, 42, 0.8)",
  boxShadow: "0 0 0 3px rgba(79, 124, 255, 0.1)"
};

const roleSelector = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "0.75rem"
};

const roleCard = {
  padding: "1.25rem 0.75rem",
  borderRadius: "12px",
  border: "2px solid rgba(148, 163, 184, 0.2)",
  background: "rgba(15, 23, 42, 0.4)",
  cursor: "pointer",
  transition: "all 0.3s ease",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "0.4rem",
  textAlign: "center"
};

const roleCardActive = {
  border: "2px solid #4f7cff",
  background: "rgba(79, 124, 255, 0.15)",
  boxShadow: "0 4px 15px rgba(79, 124, 255, 0.2)"
};

const roleCardIcon = {
  fontSize: "2rem",
  display: "block"
};

const roleCardLabel = {
  fontSize: "0.9rem",
  fontWeight: "600",
  color: "#ffffff"
};

const roleCardDesc = {
  fontSize: "0.75rem",
  color: "#94a3b8"
};

const btnPrimary = {
  padding: "16px",
  background: "linear-gradient(135deg, #4f7cff 0%, #3b5bdb 100%)",
  border: "none",
  borderRadius: "12px",
  color: "white",
  cursor: "pointer",
  fontSize: "1.05rem",
  fontWeight: "600",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.5rem",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  boxShadow: "0 4px 15px rgba(79, 124, 255, 0.3)",
  marginTop: "0.5rem"
};

const btnDisabled = {
  opacity: "0.6",
  cursor: "not-allowed"
};

const btnIcon = {
  fontSize: "1.2rem"
};

const spinner = {
  fontSize: "1.2rem",
  animation: "spin 1s linear infinite"
};

const footerText = {
  textAlign: "center",
  fontSize: "0.9rem",
  color: "#94a3b8"
};

const linkText = {
  color: "#4f7cff",
  fontWeight: "600",
  cursor: "pointer",
  textDecoration: "none",
  transition: "color 0.2s"
};