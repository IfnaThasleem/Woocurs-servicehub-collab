import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function ReviewsPage() {
  const { orderId, vendorId } = useParams();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const submitReview = async () => {
    try {
      setLoading(true);
      await axios.post(
  "http://localhost:5000/api/reviews",
  {
    order: orderId,   
    vendor: vendorId,
    rating,
    comment,
  },
  { headers: { Authorization: `Bearer ${token}` } }
);

      alert("Review submitted ⭐");
      setRating(0);
      setComment("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", color: "white" }}>
      <h1>Leave a Review</h1>
      <div style={{ margin: "1rem 0" }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => setRating(star)}
            style={{
              fontSize: "32px",
              cursor: "pointer",
              color: star <= rating ? "#facc15" : "#475569",
            }}
          >
            ★
          </span>
        ))}
      </div>
      <textarea
        placeholder="Write your review..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "8px",
          background: "#1e293b",
          color: "white",
          border: "1px solid #334155",
          marginBottom: "12px",
        }}
      />
      <button
        style={{
          padding: "12px 20px",
          background: "#4f7cff",
          color: "white",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
        }}
        onClick={submitReview}
        disabled={loading || rating === 0}
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </div>
  );
}
