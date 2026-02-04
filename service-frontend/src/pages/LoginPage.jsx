import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user.role === "vendor") {
        navigate("/vendor/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={authContainer}>
      {/* Background decorative elements */}
      <div style={bgCircle1}></div>
      <div style={bgCircle2}></div>
      <div style={bgCircle3}></div>

      <div style={contentWrapper}>
        {/* Left side - Welcome Section */}
        <div style={welcomeSection}>
          <div style={logoSection}>
            <span style={logoIcon}>🔧</span>
            <span style={logoText}>ServiceHub</span>
          </div>

          <div style={welcomeContent}>
            <h1 style={welcomeTitle}>Welcome Back!</h1>
            <p style={welcomeSubtitle}>
              Login to access your dashboard and manage your services seamlessly
            </p>

            <div style={statsContainer}>
              <div style={statItem}>
                <span style={statNumber}>10K+</span>
                <span style={statLabel}>Active Users</span>
              </div>
              <div style={statItem}>
                <span style={statNumber}>5K+</span>
                <span style={statLabel}>Verified Vendors</span>
              </div>
              <div style={statItem}>
                <span style={statNumber}>50K+</span>
                <span style={statLabel}>Services Completed</span>
              </div>
            </div>

            <div style={illustrationArea}>
              <span style={illustration}>🎯</span>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <form style={authBox} onSubmit={handleLogin}>
          <div style={formHeader}>
            <div style={avatarCircle}>
              <span style={avatarIcon}>👋</span>
            </div>
            <h2 style={formTitle}>Sign In</h2>
            <p style={formSubtitle}>Enter your credentials to continue</p>
          </div>

          {error && (
            <div style={errorBox}>
              <span style={errorIcon}>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Email Input */}
          <div style={inputGroup}>
            <label style={inputLabel}>
              <span style={labelIcon}>✉️</span>
              Email Address
            </label>
            <div style={inputWrapper}>
              <span style={inputIconLeft}>📧</span>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField("")}
                style={{
                  ...input,
                  ...(focusedField === "email" ? inputFocused : {})
                }}
              />
            </div>
          </div>

          {/* Password Input */}
          <div style={inputGroup}>
            <label style={inputLabel}>
              <span style={labelIcon}>🔒</span>
              Password
            </label>
            <div style={inputWrapper}>
              <span style={inputIconLeft}>🔑</span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField("")}
                style={{
                  ...input,
                  ...(focusedField === "password" ? inputFocused : {})
                }}
              />
              <span
                style={inputIconRight}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </span>
            </div>
          </div>

          {/* Remember & Forgot */}
          <div style={optionsRow}>
            <label style={checkboxLabel}>
              <input type="checkbox" style={checkbox} />
              <span style={checkboxText}>Remember me</span>
            </label>
            <p
              style={forgotLink}
              onClick={() => navigate("/forgot-password")}
            >
              Forgot password?
            </p>
          </div>

          {/* Login Button */}
          <button
            type="submit"
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
                Logging in...
              </>
            ) : (
              <>
                <span style={btnIcon}>🚀</span>
                Sign In
              </>
            )}
          </button>

          
        </form>
      </div>
    </div>
  );
}

/* ================= ENHANCED STYLES ================= */

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
  width: "600px",
  height: "600px",
  borderRadius: "50%",
  background: "radial-gradient(circle, rgba(79, 124, 255, 0.15) 0%, transparent 70%)",
  top: "-300px",
  right: "-300px",
  pointerEvents: "none"
};

const bgCircle2 = {
  position: "absolute",
  width: "500px",
  height: "500px",
  borderRadius: "50%",
  background: "radial-gradient(circle, rgba(59, 91, 219, 0.1) 0%, transparent 70%)",
  bottom: "-250px",
  left: "-250px",
  pointerEvents: "none"
};

const bgCircle3 = {
  position: "absolute",
  width: "300px",
  height: "300px",
  borderRadius: "50%",
  background: "radial-gradient(circle, rgba(165, 180, 252, 0.08) 0%, transparent 70%)",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  pointerEvents: "none"
};

const contentWrapper = {
  display: "flex",
  maxWidth: "1200px",
  width: "100%",
  gap: "4rem",
  alignItems: "center",
  position: "relative",
  zIndex: 1
};

const welcomeSection = {
  flex: "1",
  color: "white",
  display: "flex",
  flexDirection: "column",
  gap: "2rem"
};

const logoSection = {
  display: "flex",
  alignItems: "center",
  gap: "0.75rem"
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

const welcomeContent = {
  marginTop: "2rem"
};

const welcomeTitle = {
  fontSize: "3.5rem",
  fontWeight: "700",
  lineHeight: "1.2",
  marginBottom: "1rem",
  background: "linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text"
};

const welcomeSubtitle = {
  fontSize: "1.2rem",
  color: "#cbd5e1",
  lineHeight: "1.6",
  marginBottom: "2rem"
};

const statsContainer = {
  display: "flex",
  gap: "2rem",
  marginTop: "2rem",
  flexWrap: "wrap"
};

const statItem = {
  display: "flex",
  flexDirection: "column",
  gap: "0.3rem"
};

const statNumber = {
  fontSize: "2rem",
  fontWeight: "700",
  color: "#4f7cff"
};

const statLabel = {
  fontSize: "0.9rem",
  color: "#94a3b8"
};

const illustrationArea = {
  marginTop: "3rem",
  display: "flex",
  justifyContent: "center"
};

const illustration = {
  fontSize: "10rem",
  opacity: "0.3"
};

const authBox = {
  background: "rgba(18, 26, 58, 0.9)",
  backdropFilter: "blur(20px)",
  padding: "3rem",
  borderRadius: "24px",
  width: "100%",
  maxWidth: "460px",
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",
  color: "white",
  border: "1px solid rgba(148, 163, 184, 0.1)",
  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)"
};

const formHeader = {
  textAlign: "center",
  marginBottom: "1rem"
};

const avatarCircle = {
  width: "80px",
  height: "80px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, rgba(79, 124, 255, 0.2) 0%, rgba(59, 91, 219, 0.1) 100%)",
  border: "3px solid rgba(79, 124, 255, 0.3)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto 1.5rem",
  fontSize: "2.5rem"
};

const avatarIcon = {
  fontSize: "2.5rem"
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

const inputIconRight = {
  position: "absolute",
  right: "16px",
  fontSize: "1.2rem",
  cursor: "pointer",
  opacity: "0.7",
  transition: "opacity 0.2s"
};

const input = {
  padding: "14px 50px",
  borderRadius: "12px",
  border: "2px solid rgba(148, 163, 184, 0.2)",
  background: "rgba(15, 23, 42, 0.6)",
  color: "white",
  fontSize: "0.95rem",
  transition: "all 0.3s ease",
  outline: "none",
  width: "100%"
};

const inputFocused = {
  border: "2px solid #4f7cff",
  background: "rgba(15, 23, 42, 0.8)",
  boxShadow: "0 0 0 3px rgba(79, 124, 255, 0.1)"
};

const optionsRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "-0.5rem"
};

const checkboxLabel = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  cursor: "pointer"
};

const checkbox = {
  width: "18px",
  height: "18px",
  cursor: "pointer"
};

const checkboxText = {
  fontSize: "0.9rem",
  color: "#cbd5e1"
};

const forgotLink = {
  color: "#4f7cff",
  cursor: "pointer",
  fontSize: "0.9rem",
  fontWeight: "500",
  transition: "color 0.2s"
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

const divider = {
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  margin: "0.5rem 0"
};

const dividerLine = {
  flex: "1",
  height: "1px",
  background: "rgba(148, 163, 184, 0.2)"
};

const dividerText = {
  fontSize: "0.85rem",
  color: "#94a3b8",
  fontWeight: "500"
};

const socialButtons = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "1rem"
};

const socialBtn = {
  padding: "12px",
  background: "rgba(15, 23, 42, 0.6)",
  border: "2px solid rgba(148, 163, 184, 0.2)",
  borderRadius: "12px",
  color: "white",
  cursor: "pointer",
  fontSize: "0.9rem",
  fontWeight: "600",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.5rem",
  transition: "all 0.3s ease"
};

const socialIcon = {
  fontSize: "1.3rem"
};

const footerText = {
  textAlign: "center",
  fontSize: "0.9rem",
  color: "#94a3b8",
  marginTop: "0.5rem"
};

const linkText = {
  color: "#4f7cff",
  fontWeight: "600",
  cursor: "pointer",
  textDecoration: "none",
  transition: "color 0.2s"
};