import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function PaymentPage({ orderId, vendorId }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
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
      <div style={backgroundDecor1}></div>
      <div style={backgroundDecor2}></div>

      <div style={card}>
        <div style={iconHeader}>
          <div style={iconCircle}>
            <span style={icon}>💳</span>
          </div>
        </div>

        <h1 style={title}>Secure Payment</h1>
        <p style={subtitle}>Complete your transaction safely</p>

        <div style={amountBox}>
          <label style={label}>
            <span style={labelIcon}>💰</span>
            Enter Amount
          </label>
          <div style={inputWrapper}>
            <span style={currencySymbol}>Rs</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              style={input}
            />
          </div>
        </div>

        <div style={paymentMethods}>
          <p style={methodsTitle}>Payment Methods</p>
          <div style={methodsGrid}>
            <div style={methodCard}>
              <span style={methodIcon}>💳</span>
              <span style={methodText}>Card</span>
            </div>
            <div style={methodCard}>
              <span style={methodIcon}>🏦</span>
              <span style={methodText}>Bank</span>
            </div>
            <div style={methodCard}>
              <span style={methodIcon}>📱</span>
              <span style={methodText}>Mobile</span>
            </div>
          </div>
        </div>

        <button 
          style={btn(loading)} 
          onClick={handlePay} 
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
              Processing...
            </>
          ) : (
            <>
              <span style={btnIcon}>✓</span>
              Pay Now
            </>
          )}
        </button>

        <div style={securityBadges}>
          <div style={badge}>
            <span style={badgeIcon}>🔒</span>
            <span style={badgeText}>256-bit Encryption</span>
          </div>
          <div style={badge}>
            <span style={badgeIcon}>✓</span>
            <span style={badgeText}>PCI Compliant</span>
          </div>
        </div>

        <p style={note}>
          <span style={noteIcon}>🛡️</span>
          100% secure payment guaranteed
        </p>
      </div>
    </div>
  );
}

/* ===== ENHANCED STYLES ===== */
const page = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #0a0e1a 0%, #1a1f35 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  padding: "2rem",
  position: "relative",
  overflow: "hidden",
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
};

const backgroundDecor1 = {
  position: "absolute",
  width: "500px",
  height: "500px",
  borderRadius: "50%",
  background: "radial-gradient(circle, rgba(79, 124, 255, 0.15) 0%, transparent 70%)",
  top: "-250px",
  right: "-250px",
  pointerEvents: "none"
};

const backgroundDecor2 = {
  position: "absolute",
  width: "400px",
  height: "400px",
  borderRadius: "50%",
  background: "radial-gradient(circle, rgba(59, 91, 219, 0.1) 0%, transparent 70%)",
  bottom: "-200px",
  left: "-200px",
  pointerEvents: "none"
};

const card = {
  background: "rgba(18, 26, 58, 0.9)",
  backdropFilter: "blur(20px)",
  borderRadius: "24px",
  padding: "3rem",
  width: "100%",
  maxWidth: "500px",
  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)",
  border: "1px solid rgba(148, 163, 184, 0.1)",
  textAlign: "center",
  position: "relative",
  zIndex: 1
};

const iconHeader = {
  display: "flex",
  justifyContent: "center",
  marginBottom: "1.5rem"
};

const iconCircle = {
  width: "100px",
  height: "100px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, rgba(79, 124, 255, 0.2) 0%, rgba(59, 91, 219, 0.1) 100%)",
  border: "3px solid rgba(79, 124, 255, 0.3)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 8px 25px rgba(79, 124, 255, 0.3)"
};

const icon = {
  fontSize: "3.5rem"
};

const title = {
  marginBottom: "0.5rem",
  fontSize: "2.5rem",
  fontWeight: "700",
  background: "linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text"
};

const subtitle = {
  color: "#94a3b8",
  fontSize: "1rem",
  marginBottom: "2.5rem"
};

const amountBox = {
  background: "rgba(15, 23, 42, 0.6)",
  padding: "2rem",
  borderRadius: "16px",
  marginBottom: "2rem",
  border: "1px solid rgba(148, 163, 184, 0.1)",
  textAlign: "left"
};

const label = {
  marginBottom: "1rem",
  color: "#cbd5e1",
  fontSize: "0.95rem",
  fontWeight: "600",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem"
};

const labelIcon = {
  fontSize: "1.2rem"
};

const inputWrapper = {
  position: "relative",
  display: "flex",
  alignItems: "center"
};

const currencySymbol = {
  position: "absolute",
  left: "20px",
  fontSize: "1.5rem",
  fontWeight: "700",
  color: "#4f7cff"
};

const input = {
  width: "100%",
  padding: "1rem 1rem 1rem 60px",
  borderRadius: "12px",
  background: "rgba(2, 6, 23, 0.6)",
  color: "white",
  border: "2px solid rgba(148, 163, 184, 0.2)",
  fontSize: "1.5rem",
  fontWeight: "700",
  outline: "none",
  transition: "all 0.3s ease"
};

const paymentMethods = {
  marginBottom: "2rem"
};

const methodsTitle = {
  fontSize: "0.9rem",
  color: "#94a3b8",
  marginBottom: "1rem",
  textAlign: "left",
  fontWeight: "600"
};

const methodsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "1rem"
};

const methodCard = {
  background: "rgba(15, 23, 42, 0.6)",
  padding: "1rem",
  borderRadius: "12px",
  border: "2px solid rgba(148, 163, 184, 0.2)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "0.5rem",
  cursor: "pointer",
  transition: "all 0.3s ease"
};

const methodIcon = {
  fontSize: "2rem"
};

const methodText = {
  fontSize: "0.85rem",
  color: "#cbd5e1",
  fontWeight: "500"
};

const btn = (loading) => ({
  width: "100%",
  padding: "1rem",
  background: loading 
    ? "rgba(100, 116, 139, 0.5)" 
    : "linear-gradient(135deg, #4f7cff 0%, #3b5bdb 100%)",
  border: "none",
  borderRadius: "12px",
  color: "white",
  fontSize: "1.1rem",
  fontWeight: "700",
  cursor: loading ? "not-allowed" : "pointer",
  transition: "all 0.3s ease",
  boxShadow: loading ? "none" : "0 4px 15px rgba(79, 124, 255, 0.3)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.5rem"
});

const btnIcon = {
  fontSize: "1.3rem"
};

const spinner = {
  fontSize: "1.3rem",
  animation: "spin 1s linear infinite"
};

const securityBadges = {
  display: "flex",
  justifyContent: "center",
  gap: "1.5rem",
  marginTop: "2rem",
  marginBottom: "1.5rem",
  flexWrap: "wrap"
};

const badge = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  padding: "0.5rem 1rem",
  background: "rgba(79, 124, 255, 0.1)",
  borderRadius: "20px",
  border: "1px solid rgba(79, 124, 255, 0.2)"
};

const badgeIcon = {
  fontSize: "1rem"
};

const badgeText = {
  fontSize: "0.85rem",
  color: "#93c5fd",
  fontWeight: "500"
};

const note = {
  marginTop: "1.5rem",
  fontSize: "0.95rem",
  color: "#94a3b8",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.5rem"
};

const noteIcon = {
  fontSize: "1.2rem"
};