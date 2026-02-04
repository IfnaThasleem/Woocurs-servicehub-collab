import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function ReviewsPage() {
  const { orderId, vendorId } = useParams();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [focusedField, setFocusedField] = useState("");

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

  const getRatingLabel = (stars) => {
    const labels = {
      1: "Poor",
      2: "Fair",
      3: "Good",
      4: "Very Good",
      5: "Excellent"
    };
    return labels[stars] || "Rate your experience";
  };

  return (
    <div style={page}>
      <div style={bgCircle1}></div>
      <div style={bgCircle2}></div>

      <div style={container}>
        <div style={headerSection}>
          <div style={iconCircle}>
            <span style={iconLarge}>⭐</span>
          </div>
          <h1 style={title}>Leave a Review</h1>
          <p style={subtitle}>Share your experience with us</p>
        </div>

        <div style={card}>
          {/* Rating Section */}
          <div style={ratingSection}>
            <label style={label}>
              <span style={labelIcon}>⭐</span>
              Your Rating
            </label>
            
            <div style={starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  style={{
                    ...starStyle,
                    color: star <= (hoveredStar || rating) ? "#facc15" : "#475569",
                    transform: star <= (hoveredStar || rating) ? "scale(1.1)" : "scale(1)",
                  }}
                >
                  ★
                </span>
              ))}
            </div>

            <div style={ratingLabel}>
              <span style={ratingLabelIcon}>
                {rating > 0 ? "✓" : "○"}
              </span>
              <span style={ratingLabelText}>
                {getRatingLabel(rating)}
              </span>
            </div>
          </div>

          {/* Comment Section */}
          <div style={inputGroup}>
            <label style={label}>
              <span style={labelIcon}>💬</span>
              Your Feedback
            </label>
            <div style={textareaWrapper}>
              <span style={textareaIcon}>✍️</span>
              <textarea
                placeholder="Tell us about your experience with the service..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onFocus={() => setFocusedField("comment")}
                onBlur={() => setFocusedField("")}
                style={{
                  ...textarea,
                  ...(focusedField === "comment" ? textareaFocused : {})
                }}
              />
            </div>
            <span style={charCount}>
              {comment.length} characters
            </span>
          </div>

          {/* Info Box */}
          <div style={infoBox}>
            <span style={infoIcon}>ℹ️</span>
            <span style={infoText}>
              Your review helps us improve our service quality
            </span>
          </div>

          {/* Submit Button */}
          <button
            style={{
              ...btn,
              ...(loading || rating === 0 ? btnDisabled : {})
            }}
            onClick={submitReview}
            disabled={loading || rating === 0}
            onMouseEnter={(e) => {
              if (!loading && rating > 0) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(250, 204, 21, 0.4)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading && rating > 0) {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(250, 204, 21, 0.3)";
              }
            }}
          >
            {loading ? (
              <>
                <span style={spinner}>⏳</span>
                Submitting...
              </>
            ) : (
              <>
                <span style={btnIcon}>✓</span>
                Submit Review
              </>
            )}
          </button>

          {rating === 0 && (
            <div style={warningBox}>
              <span style={warningIcon}>⚠️</span>
              <span style={warningText}>
                Please select a rating before submitting
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
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
  background: "radial-gradient(circle, rgba(250, 204, 21, 0.15) 0%, transparent 70%)",
  top: "-250px",
  right: "-250px",
  pointerEvents: "none"
};

const bgCircle2 = {
  position: "absolute",
  width: "400px",
  height: "400px",
  borderRadius: "50%",
  background: "radial-gradient(circle, rgba(79, 124, 255, 0.1) 0%, transparent 70%)",
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
  background: "linear-gradient(135deg, rgba(250, 204, 21, 0.2) 0%, rgba(234, 179, 8, 0.1) 100%)",
  border: "3px solid rgba(250, 204, 21, 0.3)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto 1.5rem",
  boxShadow: "0 8px 25px rgba(250, 204, 21, 0.3)"
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

const card = {
  background: "rgba(15, 23, 42, 0.9)",
  backdropFilter: "blur(20px)",
  padding: "2.5rem",
  borderRadius: "24px",
  display: "flex",
  flexDirection: "column",
  gap: "2rem",
  border: "1px solid rgba(148, 163, 184, 0.1)",
  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)"
};

const ratingSection = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  alignItems: "center",
  padding: "1.5rem",
  background: "rgba(250, 204, 21, 0.05)",
  borderRadius: "16px",
  border: "1px solid rgba(250, 204, 21, 0.15)"
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

const starsContainer = {
  display: "flex",
  gap: "0.5rem",
  padding: "0.5rem"
};

const starStyle = {
  fontSize: "3rem",
  cursor: "pointer",
  transition: "all 0.2s ease",
  textShadow: "0 2px 8px rgba(0, 0, 0, 0.3)"
};

const ratingLabel = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  padding: "0.75rem 1.5rem",
  background: "rgba(250, 204, 21, 0.1)",
  borderRadius: "20px",
  border: "1px solid rgba(250, 204, 21, 0.2)"
};

const ratingLabelIcon = {
  fontSize: "1rem",
  color: "#facc15"
};

const ratingLabelText = {
  fontSize: "1rem",
  fontWeight: "600",
  color: "#fde047"
};

const inputGroup = {
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem"
};

const textareaWrapper = {
  position: "relative",
  display: "flex",
  alignItems: "flex-start"
};

const textareaIcon = {
  position: "absolute",
  left: "16px",
  top: "16px",
  fontSize: "1.2rem",
  pointerEvents: "none"
};

const textarea = {
  width: "100%",
  minHeight: "140px",
  padding: "14px 16px",
  paddingLeft: "3rem",
  background: "rgba(2, 6, 23, 0.6)",
  border: "2px solid rgba(148, 163, 184, 0.2)",
  color: "white",
  borderRadius: "12px",
  fontSize: "0.95rem",
  transition: "all 0.3s ease",
  outline: "none",
  resize: "vertical",
  fontFamily: "inherit",
  lineHeight: "1.6"
};

const textareaFocused = {
  border: "2px solid #facc15",
  background: "rgba(2, 6, 23, 0.8)",
  boxShadow: "0 0 0 3px rgba(250, 204, 21, 0.1)"
};

const charCount = {
  fontSize: "0.8rem",
  color: "#64748b",
  textAlign: "right"
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
  background: "linear-gradient(135deg, #facc15 0%, #eab308 100%)",
  border: "none",
  borderRadius: "12px",
  color: "#1a1f35",
  fontWeight: "700",
  cursor: "pointer",
  fontSize: "1.05rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.5rem",
  boxShadow: "0 4px 15px rgba(250, 204, 21, 0.3)",
  transition: "all 0.3s ease"
};

const btnDisabled = {
  opacity: "0.5",
  cursor: "not-allowed"
};

const btnIcon = {
  fontSize: "1.2rem"
};

const spinner = {
  fontSize: "1.2rem",
  animation: "spin 1s linear infinite"
};

const warningBox = {
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  padding: "1rem",
  background: "rgba(239, 68, 68, 0.1)",
  border: "1px solid rgba(239, 68, 68, 0.2)",
  borderRadius: "12px"
};

const warningIcon = {
  fontSize: "1.3rem"
};

const warningText = {
  fontSize: "0.9rem",
  color: "#fca5a5"
};