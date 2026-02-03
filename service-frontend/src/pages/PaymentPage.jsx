import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function PaymentPage({ orderId, vendorId }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(""); // User can type amount
  const token = localStorage.getItem("token");

  const handlePay = async () => {
    if (!amount || Number(amount) <= 0) {
      return alert("Please enter a valid amount");
    }

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:5000/api/payments",
        {
          orderId,
          amount: Number(amount),
          status: "paid",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Payment successful ✅");

      // Auto-redirect to review page
      navigate(`/reviews/${orderId}/${vendorId}`);
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={page}>
      <div style={card}>
        <h1 style={title}>Secure Payment</h1>

        <div style={amountBox}>
          <label style={label}>Enter Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            style={input}
          />
        </div>

        <button style={btn(loading)} onClick={handlePay} disabled={loading}>
          {loading ? "Processing..." : "Pay Now"}
        </button>

        <p style={note}>🔒 100% secure payment</p>
      </div>
    </div>
  );
}

/* ===== STYLES ===== */
const page = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #020617, #020024)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
};

const card = {
  background: "#020617",
  borderRadius: "16px",
  padding: "2.5rem",
  width: "100%",
  maxWidth: "420px",
  boxShadow: "0 20px 40px rgba(79,124,255,0.25)",
  border: "1px solid #1e293b",
  textAlign: "center",
};

const title = { marginBottom: "1.5rem", fontSize: "28px", fontWeight: "600" };
const amountBox = {
  background: "#020024",
  padding: "1.5rem",
  borderRadius: "12px",
  marginBottom: "2rem",
  border: "1px solid #1e293b",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
};
const label = { marginBottom: "6px", color: "#94a3b8" };
const input = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  background: "#1e293b",
  color: "white",
  border: "1px solid #334155",
  fontSize: "16px",
};

const btn = (loading) => ({
  width: "100%",
  padding: "14px",
  background: loading ? "#334155" : "#4f7cff",
  border: "none",
  borderRadius: "10px",
  color: "white",
  fontSize: "16px",
  fontWeight: "600",
  cursor: loading ? "not-allowed" : "pointer",
  transition: "0.3s",
});
const note = { marginTop: "1.5rem", fontSize: "14px", color: "#94a3b8" };
