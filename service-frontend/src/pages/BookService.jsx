import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function BookService() {
  const navigate = useNavigate();
  const location = useLocation(); // get data passed via navigate
  const token = localStorage.getItem("token");

  // Get serviceId from location state
  const serviceId = location.state?.serviceId;

  const [form, setForm] = useState({
    date: "",
    address: "",
    contact: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.date || !form.address || !form.contact) {
      alert("Date, Address, and Contact are required!");
      return;
    }

    if (!serviceId) {
      alert("No service selected!");
      return;
    }

    try {
      setLoading(true);

      // payload for backend
      const payload = {
        serviceId, // required by backend
        scheduledDate: form.date,
        notes: form.notes,
        address: form.address, // optional
        contact: form.contact, // optional
      };

      const response = await axios.post(
        "http://localhost:5000/api/orders", // ✅ correct endpoint
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Booking success
      if (response.status === 201 || response.status === 200) {
        alert("Service booked successfully!");
        navigate("/orders"); // go to Orders page
      } else {
        alert("Booking failed! Please try again.");
      }
    } catch (err) {
      console.error("Booking error:", err.response?.data || err.message);
      alert("Booking failed! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar role="user" />
      <div style={page}>
        <h2>Book Service</h2>

        <form style={formStyle} onSubmit={handleSubmit}>
          <input
            type="date"
            name="date"
            required
            value={form.date}
            onChange={handleChange}
            style={input}
          />

          <input
            type="text"
            name="contact"
            placeholder="Contact Number"
            required
            value={form.contact}
            onChange={handleChange}
            style={input}
          />

          <input
            type="text"
            name="address"
            placeholder="Service Address"
            required
            value={form.address}
            onChange={handleChange}
            style={input}
          />

          <textarea
            name="notes"
            placeholder="Additional notes"
            value={form.notes}
            onChange={handleChange}
            style={textarea}
          />

          <button type="submit" style={btn} disabled={loading}>
            {loading ? "Booking..." : "Confirm Booking"}
          </button>
        </form>
      </div>
    </>
  );
}

/* ===== STYLES ===== */
const page = {
  minHeight: "100vh",
  background: "#020617",
  color: "white",
  padding: "2rem",
};

const formStyle = {
  maxWidth: "450px",
  background: "#0f172a",
  padding: "1.5rem",
  borderRadius: "12px",
  display: "flex",
  flexDirection: "column",
};

const input = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  background: "#1e293b",
  border: "1px solid #334155",
  color: "white",
  borderRadius: "6px",
};

const textarea = {
  ...input,
  minHeight: "80px",
};

const btn = {
  width: "100%",
  padding: "10px",
  background: "#4f7cff",
  border: "none",
  borderRadius: "8px",
  color: "white",
  fontWeight: "600",
  cursor: "pointer",
  marginTop: "10px",
};
