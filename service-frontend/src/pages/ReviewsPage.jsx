import React from "react";

export default function ReviewsPage() {
  const reviews = [
    { name: "Ahamed", rating: "⭐⭐⭐⭐⭐", comment: "Excellent service!" },
    { name: "Sara", rating: "⭐⭐⭐⭐", comment: "Very professional" }
  ];

  return (
    <div style={page}>
      <h1>Customer Reviews</h1>

      <div style={grid}>
        {reviews.map((r, i) => (
          <div key={i} style={card}>
            <h3>{r.name}</h3>
            <p>{r.rating}</p>
            <p style={{ color: "#94a3b8" }}>{r.comment}</p>
          </div>
        ))}
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
  gap: "1.5rem"
};

const card = {
  background: "#0f172a",
  padding: "1.5rem",
  borderRadius: "12px"
};
