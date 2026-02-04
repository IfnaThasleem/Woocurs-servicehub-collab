import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function BookService() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const serviceId = location.state?.serviceId;

  const [form, setForm] = useState({
    date: "",
    address: "",
    contact: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState("");

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

      const payload = {
        serviceId,
        scheduledDate: form.date,
        notes: form.notes,
        address: form.address,
        contact: form.contact,
      };

      const response = await axios.post(
        "http://localhost:5000/api/orders",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201 || response.status === 200) {
        alert("Service booked successfully!");
        navigate("/orders");
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
        <div style={bgCircle1}></div>
        <div style={bgCircle2}></div>

        <div style={container}>
          <div style={headerSection}>
            <div style={iconCircle}>
              <span style={iconLarge}>📅</span>
            </div>
            <h2 style={title}>Book Service</h2>
            <p style={subtitle}>Fill in the details to schedule your service</p>
          </div>

          <form style={formStyle} onSubmit={handleSubmit}>
            <div style={inputGroup}>
              <label style={label}>
                <span style={labelIcon}>📅</span>
                Service Date
              </label>
              <input
                type="date"
                name="date"
                required
                value={form.date}
                onChange={handleChange}
                onFocus={() => setFocusedField("date")}
                onBlur={() => setFocusedField("")}
                style={{
                  ...input,
                  ...(focusedField === "date" ? inputFocused : {})
                }}
              />
            </div>

            <div style={inputGroup}>
              <label style={label}>
                <span style={labelIcon}>📞</span>
                Contact Number
              </label>
              <div style={inputWrapper}>
                <span style={inputIconLeft}>☎️</span>
                <input
                  type="text"
                  name="contact"
                  placeholder="Enter your contact number"
                  required
                  value={form.contact}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("contact")}
                  onBlur={() => setFocusedField("")}
                  style={{
                    ...input,
                    paddingLeft: "3rem",
                    ...(focusedField === "contact" ? inputFocused : {})
                  }}
                />
              </div>
            </div>

            <div style={inputGroup}>
              <label style={label}>
                <span style={labelIcon}>📍</span>
                Service Address
              </label>
              <div style={inputWrapper}>
                <span style={inputIconLeft}>🏠</span>
                <input
                  type="text"
                  name="address"
                  placeholder="Enter service location"
                  required
                  value={form.address}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("address")}
                  onBlur={() => setFocusedField("")}
                  style={{
                    ...input,
                    paddingLeft: "3rem",
                    ...(focusedField === "address" ? inputFocused : {})
                  }}
                />
              </div>
            </div>

            <div style={inputGroup}>
              <label style={label}>
                <span style={labelIcon}>📝</span>
                Additional Notes (Optional)
              </label>
              <div style={inputWrapper}>
                <span style={textareaIcon}>💬</span>
                <textarea
                  name="notes"
                  placeholder="Any special requirements or instructions..."
                  value={form.notes}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("notes")}
                  onBlur={() => setFocusedField("")}
                  style={{
                    ...textarea,
                    paddingLeft: "3rem",
                    ...(focusedField === "notes" ? inputFocused : {})
                  }}
                />
              </div>
            </div>

            <div style={infoBox}>
              <span style={infoIcon}>ℹ️</span>
              <span style={infoText}>
                A professional will contact you within 24 hours
              </span>
            </div>

            <button
              type="submit"
              style={{
                ...btn,
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
                  Booking...
                </>
              ) : (
                <>
                  <span style={btnIcon}>✓</span>
                  Confirm Booking
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

/* ===== ENHANCED STYLES ===== */
const page = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #0a0e1a 0%, #1a1f35 100%)",
  color: "white",
  padding: "2rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
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
  maxWidth: "600px",
  position: "relative",
  zIndex: 1
};

const headerSection = {
  textAlign: "center",
  marginBottom: "2.5rem"
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
  fontSize: "1rem"
};

const formStyle = {
  background: "rgba(15, 23, 42, 0.9)",
  backdropFilter: "blur(20px)",
  padding: "2.5rem",
  borderRadius: "24px",
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",
  border: "1px solid rgba(148, 163, 184, 0.1)",
  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)"
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
  pointerEvents: "none",
  top: "50%",
  transform: "translateY(-50%)"
};

const textareaIcon = {
  position: "absolute",
  left: "16px",
  top: "16px",
  fontSize: "1.2rem",
  pointerEvents: "none"
};

const input = {
  width: "100%",
  padding: "14px 16px",
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

const textarea = {
  ...input,
  minHeight: "100px",
  resize: "vertical",
  fontFamily: "inherit"
};

const infoBox = {
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  padding: "1rem",
  background: "rgba(79, 124, 255, 0.1)",
  border: "1px solid rgba(79, 124, 255, 0.2)",
  borderRadius: "12px"
};

const infoIcon = {
  fontSize: "1.3rem"
};

const infoText = {
  fontSize: "0.9rem",
  color: "#93c5fd"
};

const btn = {
  width: "100%",
  padding: "16px",
  background: "linear-gradient(135deg, #4f7cff 0%, #3b5bdb 100%)",
  border: "none",
  borderRadius: "12px",
  color: "white",
  fontWeight: "600",
  cursor: "pointer",
  marginTop: "0.5rem",
  fontSize: "1.05rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.5rem",
  boxShadow: "0 4px 15px rgba(79, 124, 255, 0.3)",
  transition: "all 0.3s ease"
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