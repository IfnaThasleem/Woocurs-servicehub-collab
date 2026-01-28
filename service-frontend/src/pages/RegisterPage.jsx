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

  return (
    <div style={authContainer}>
      <form style={authBox} onSubmit={handleSubmit}>
        <h2 style={{ textAlign: "center" }}>Register</h2>

        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        <input
          style={input}
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          style={input}
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          style={input}
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <input
          type="password"
          style={input}
          placeholder="Confirm Password"
          value={form.confirm}
          onChange={(e) => setForm({ ...form, confirm: e.target.value })}
        />

        <select
          style={input}
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="user">Customer</option>
          <option value="vendor">Vendor</option>
          <option value="admin">Admin</option>
        </select>

        <button style={btnPrimary} disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}

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
};

const btnPrimary = {
  padding: "12px",
  background: "#4f7cff",
  border: "none",
  borderRadius: "6px",
  color: "white",
  cursor: "pointer",
};
