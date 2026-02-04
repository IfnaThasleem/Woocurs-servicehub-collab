import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email) {
      setError("Please enter your email");
      return;
    }

    setMessage(`Password reset link sent to ${email}`);
    setEmail("");

    // ✅ Go to reset page after short delay
    setTimeout(() => {
      navigate("/reset-password");
    }, 2000);
  };

  return (
    <div style={page}>
      <div style={bgCircle1}></div>
      <div style={bgCircle2}></div>

      <div style={container}>
        <div style={iconSection}>
          <div style={iconCircle}>
            <span style={iconLarge}>🔒</span>
          </div>
          <h2 style={title}>Forgot Password</h2>
          <p style={subtitle}>Enter your email to receive a reset link</p>
        </div>

        <form style={formCard} onSubmit={handleSubmit}>
          {message && (
            <div style={successMessage}>
              <span style={messageIcon}>✓</span>
              <p style={messageText}>{message}</p>
            </div>
          )}
          
          {error && (
            <div style={errorMessage}>
              <span style={messageIcon}>⚠️</span>
              <p style={messageText}>{error}</p>
            </div>
          )}

          <div style={inputGroup}>
            <label style={label}>
              <span style={labelIcon}>✉️</span>
              Email Address
            </label>
            <div style={inputWrapper}>
              <span style={inputIconLeft}>📧</span>
              <input
                type="email"
                style={{
                  ...input,
                  ...(focusedField === "email" ? inputFocused : {})
                }}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField("")}
              />
            </div>
          </div>

          <button
            type="submit"
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
            <span style={btnIcon}>📨</span>
            Send Reset Link
          </button>

          <div style={backLink}>
            <button
              type="button"
              style={linkButton}
              onClick={() => navigate("/login")}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#4f7cff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#93c5fd";
              }}
            >
              <span style={backIcon}>←</span>
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ===== ENHANCED STYLES ===== */
const page = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #0a0e1a 0%, #1a1f35 100%)",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
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

const container = {
  width: "100%",
  maxWidth: "480px",
  position: "relative",
  zIndex: 1
};

const iconSection = {
  textAlign: "center",
  marginBottom: "2rem"
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
  fontSize: "1rem",
  margin: 0
};

const formCard = {
  background: "rgba(15, 23, 42, 0.9)",
  backdropFilter: "blur(20px)",
  padding: "2.5rem",
  borderRadius: "24px",
  border: "2px solid rgba(148, 163, 184, 0.1)",
  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)",
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem"
};

const successMessage = {
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  padding: "1rem",
  background: "rgba(34, 197, 94, 0.1)",
  border: "2px solid rgba(34, 197, 94, 0.3)",
  borderRadius: "12px"
};

const errorMessage = {
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  padding: "1rem",
  background: "rgba(239, 68, 68, 0.1)",
  border: "2px solid rgba(239, 68, 68, 0.3)",
  borderRadius: "12px"
};

const messageIcon = {
  fontSize: "1.3rem"
};

const messageText = {
  fontSize: "0.95rem",
  margin: 0,
  color: "#e2e8f0",
  flex: 1
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
  padding: "14px 14px 14px 3rem",
  background: "rgba(2, 6, 23, 0.6)",
  border: "2px solid rgba(148, 163, 184, 0.2)",
  color: "white",
  borderRadius: "12px",
  fontSize: "0.95rem",
  transition: "all 0.3s ease",
  outline: "none"
};

const inputFocused = {
  border: "2px solid #4f7cff",
  background: "rgba(2, 6, 23, 0.8)",
  boxShadow: "0 0 0 3px rgba(79, 124, 255, 0.1)"
};

const btn = {
  width: "100%",
  padding: "16px",
  background: "linear-gradient(135deg, #4f7cff 0%, #3b5bdb 100%)",
  border: "none",
  borderRadius: "12px",
  color: "white",
  fontWeight: "700",
  fontSize: "1.05rem",
  cursor: "pointer",
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

const backLink = {
  textAlign: "center",
  marginTop: "0.5rem"
};

const linkButton = {
  background: "none",
  border: "none",
  color: "#93c5fd",
  fontSize: "0.95rem",
  cursor: "pointer",
  transition: "color 0.3s ease",
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
  fontWeight: "600"
};

const backIcon = {
  fontSize: "1.1rem"
};