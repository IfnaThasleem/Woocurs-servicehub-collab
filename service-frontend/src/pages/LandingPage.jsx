import React from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={page}>
      {/* HERO */}
      <div style={hero}>
        <h1 style={title}>Find Trusted Local Services</h1>
        <p style={subtitle}>
          Book electricians, cleaners, plumbers & more — instantly.
        </p>

        <div style={heroBtns}>
          <button style={primaryBtn} onClick={() => navigate("/register")}>
            Get Started
          </button>
          <button style={outlineBtn} onClick={() => navigate("/login")}>
            Login
          </button>
        </div>
      </div>

      {/* CATEGORIES */}
      <div style={section}>
        <h2>Popular Categories</h2>
        <div style={grid}>
          {["Cleaning", "Plumbing", "Electrical", "AC Repair"].map(c => (
            <div key={c} style={card}>{c}</div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div style={sectionAlt}>
        <h2>How It Works</h2>
        <div style={grid}>
          <div style={infoCard}>1️⃣ Choose a service</div>
          <div style={infoCard}>2️⃣ Book instantly</div>
          <div style={infoCard}>3️⃣ Get it done</div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={footer}>
        © 2026 ServiceHub — All rights reserved
      </div>
    </div>
  );
}

/* ===== STYLES ===== */

const page = {
  background: "#020617",
  color: "white",
  minHeight: "100vh",
  fontFamily: "sans-serif"
};

const hero = {
  padding: "5rem 2rem",
  textAlign: "center",
  animation: "fadeIn 1.2s ease"
};

const title = { fontSize: "3rem" };
const subtitle = { color: "#94a3b8", marginTop: "1rem" };

const heroBtns = {
  marginTop: "2rem",
  display: "flex",
  justifyContent: "center",
  gap: "1rem"
};

const primaryBtn = {
  padding: "12px 24px",
  background: "#4f7cff",
  border: "none",
  borderRadius: "8px",
  color: "white",
  cursor: "pointer",
  transition: "0.3s"
};

const outlineBtn = {
  padding: "12px 24px",
  background: "transparent",
  border: "1px solid #4f7cff",
  borderRadius: "8px",
  color: "white",
  cursor: "pointer"
};

const section = { padding: "3rem 2rem", textAlign: "center" };
const sectionAlt = { ...section, background: "#0f172a" };

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
  gap: "1.5rem",
  marginTop: "2rem"
};

const card = {
  background: "#0f172a",
  padding: "2rem",
  borderRadius: "12px",
  transition: "transform 0.3s",
};

const infoCard = {
  background: "#020617",
  padding: "2rem",
  borderRadius: "12px"
};

const footer = {
  padding: "1.5rem",
  textAlign: "center",
  color: "#94a3b8"
};
