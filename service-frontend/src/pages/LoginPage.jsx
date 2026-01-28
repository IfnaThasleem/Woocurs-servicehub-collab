import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      <form style={authBox} onSubmit={handleLogin}>
        <h2 style={{ textAlign: "center" }}>Login</h2>

        {error && <p style={{ color: "#f87171", textAlign: "center" }}>{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={input}
        />

        <button type="submit" style={btnPrimary} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* 🔗 Forgot password */}
        <p
          style={forgotLink}
          onClick={() => navigate("/forgot-password")}
        >
          Forgot password?
        </p>
      </form>
    </div>
  );
}

/* ================= STYLES ================= */

const authContainer = {
  minHeight: "100vh",
  background: "#0b1020",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const authBox = {
  background: "#121a3a",
  padding: "2.5rem",
  borderRadius: "10px",
  width: "320px",
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  color: "white",
};

const input = {
  padding: "10px",
  borderRadius: "6px",
  border: "none",
  outline: "none",
};

const btnPrimary = {
  padding: "12px",
  background: "#4f7cff",
  border: "none",
  borderRadius: "6px",
  color: "white",
  cursor: "pointer",
};

const forgotLink = {
  marginTop: "10px",
  textAlign: "center",
  color: "#93c5fd",
  cursor: "pointer",
  fontSize: "14px",
};
