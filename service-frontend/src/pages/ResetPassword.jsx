import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!password || !confirmPassword) {
      setError("Please fill in both fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setMessage("Password successfully reset! Redirecting to login...");
    setPassword("");
    setConfirmPassword("");

    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  return (
    <div className="center-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2 style={{ textAlign: "center" }}>Reset Password</h2>

        {message && <p style={{ color: "green", textAlign: "center" }}>{message}</p>}
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        <input
          type="password"
          className="auth-input"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          className="auth-input"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button type="submit" className="btn-primary">
          Reset Password
        </button>
      </form>
    </div>
  );
}
