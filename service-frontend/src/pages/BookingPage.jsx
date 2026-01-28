import React, { useState } from "react";

export default function BookingPage() {
  const [service, setService] = useState("Cleaning");

  return (
    <div style={page}>
      <h1>Book a Service</h1>

      <div style={card}>
        <label>Service</label>
        <select style={input} value={service} onChange={(e) => setService(e.target.value)}>
          <option>Cleaning</option>
          <option>Plumbing</option>
          <option>Electrical</option>
        </select>

        <label>Date</label>
        <input type="date" style={input} />

        <label>Address</label>
        <input placeholder="Enter service location" style={input} />

        <button style={btn}>Confirm Booking</button>
      </div>
    </div>
  );
}

const page = {
  minHeight: "100vh",
  background: "#020617",
  color: "white",
  padding: "3rem",
  animation: "fadeIn 0.8s ease"
};

const card = {
  maxWidth: "420px",
  background: "#0f172a",
  padding: "2rem",
  borderRadius: "12px",
  display: "flex",
  flexDirection: "column",
  gap: "1rem"
};

const input = {
  padding: "10px",
  borderRadius: "6px",
  border: "none"
};

const btn = {
  padding: "12px",
  background: "#4f7cff",
  border: "none",
  borderRadius: "6px",
  color: "white",
  cursor: "pointer"
};
