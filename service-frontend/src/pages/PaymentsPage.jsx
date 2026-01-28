import React from "react";

export default function PaymentsPage() {
  return (
    <div style={page}>
      <h1>Payments & Plans</h1>

      <div style={grid}>
        <div style={card}>
          <h3>Free</h3>
          <p>✔ Browse services</p>
          <p>✔ Basic support</p>
          <button style={btn}>Current Plan</button>
        </div>

        <div style={cardPro}>
          <h3>Pro</h3>
          <p>✔ Priority booking</p>
          <p>✔ Featured listing</p>
          <button style={btn}>Upgrade</button>
        </div>
      </div>
    </div>
  );
}

const page = {
  minHeight: "100vh",
  background: "#020617",
  color: "white",
  padding: "3rem"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
  gap: "2rem"
};

const card = {
  background: "#0f172a",
  padding: "2rem",
  borderRadius: "12px"
};

const cardPro = {
  ...card,
  border: "2px solid #4f7cff"
};

const btn = {
  marginTop: "1rem",
  padding: "10px",
  background: "#4f7cff",
  border: "none",
  borderRadius: "6px",
  color: "white"
};
