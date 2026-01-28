import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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
    <div className="center-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2 style={{ textAlign: "center" }}>Forgot Password</h2>

        {message && <p style={{ color: "green", textAlign: "center" }}>{message}</p>}
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        <input
          type="email"
          className="auth-input"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="submit" className="btn-primary">
          Send Reset Link
        </button>
      </form>
    </div>
  );
}
