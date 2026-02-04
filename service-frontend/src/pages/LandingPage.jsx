import React from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  // Category data with icons
  const categories = [
    { name: "Cleaning", icon: "🧹", color: "#10b981" },
    { name: "Plumbing", icon: "🔧", color: "#3b82f6" },
    { name: "Electrical", icon: "⚡", color: "#f59e0b" },
    { name: "AC Repair", icon: "❄️", color: "#06b6d4" }
  ];

  return (
    <div style={page}>
      {/* HERO */}
      <div style={hero}>
        <div style={heroBadge}>
          <span style={badgeIcon}>✨</span>
          <span>Trusted by 10,000+ customers</span>
        </div>
        
        <h1 style={title}>Find Trusted Local Services</h1>
        <p style={subtitle}>
          Book electricians, cleaners, plumbers & more — instantly.
        </p>

        <div style={heroBtns}>
          <button
            style={primaryBtn}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow =
                "0 10px 35px rgba(79,124,255,0.55)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 20px rgba(79,124,255,0.4)";
            }}
            onClick={() => navigate("/register")}
          >
            <span style={btnIcon}>🚀</span>
            Get Started
          </button>

          <button
            style={outlineBtn}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(79,124,255,0.2)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(79,124,255,0.1)";
            }}
            onClick={() => navigate("/login")}
          >
            <span style={btnIcon}>👤</span>
            Login
          </button>
        </div>

        {/* Trust indicators */}
        <div style={trustBar}>
          <div style={trustItem}>
            <span style={trustIcon}>⭐</span>
            <span>4.9/5 Rating</span>
          </div>
          <div style={trustItem}>
            <span style={trustIcon}>🛡️</span>
            <span>Verified Pros</span>
          </div>
          <div style={trustItem}>
            <span style={trustIcon}>⚡</span>
            <span>Same Day Service</span>
          </div>
        </div>
      </div>

      {/* CATEGORIES */}
      <div style={section}>
        <h2 style={sectionTitle}>Popular Categories</h2>
        <p style={sectionSubtitle}>Choose from our wide range of professional services</p>
        
        <div style={grid}>
          {categories.map(cat => (
            <div
              key={cat.name}
              style={{...card, borderColor: cat.color + '40'}}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
                e.currentTarget.style.boxShadow = `0 15px 40px ${cat.color}30`;
                e.currentTarget.style.borderColor = cat.color + '60';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.1)";
                e.currentTarget.style.borderColor = cat.color + '40';
              }}
            >
              <div style={{...categoryIcon, background: cat.color + '20'}}>
                <span style={iconEmoji}>{cat.icon}</span>
              </div>
              <div style={categoryName}>{cat.name}</div>
              <div style={categoryDesc}>Professional & Reliable</div>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div style={sectionAlt}>
        <h2 style={sectionTitle}>How It Works</h2>
        <p style={sectionSubtitle}>Get started in three simple steps</p>
        
        <div style={grid}>
          <div 
            style={infoCard}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 10px 30px rgba(79, 124, 255, 0.2)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.2)";
            }}
          >
            <div style={stepIconWrapper}>
              <span style={stepEmoji}>🔍</span>
            </div>
            <span style={stepTitle}>Choose a service</span>
            <span style={stepDesc}>Browse our categories and select what you need</span>
          </div>
          
          <div 
            style={infoCard}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 10px 30px rgba(79, 124, 255, 0.2)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.2)";
            }}
          >
            <div style={stepIconWrapper}>
              <span style={stepEmoji}>📅</span>
            </div>
            <span style={stepTitle}>Book instantly</span>
            <span style={stepDesc}>Pick your preferred time and confirm</span>
          </div>
          
          <div 
            style={infoCard}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 10px 30px rgba(79, 124, 255, 0.2)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.2)";
            }}
          >
            <div style={stepIconWrapper}>
              <span style={stepEmoji}>✅</span>
            </div>
            <span style={stepTitle}>Get it done</span>
            <span style={stepDesc}>Our verified pros will handle the rest</span>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={footer}>
        <div style={footerContent}>
          <div style={footerLogo}>
            <span style={logoIcon}>🔧</span>
            <span style={logoText}>ServiceHub</span>
          </div>
          <div style={footerCopy}>© 2026 ServiceHub — All rights reserved</div>
        </div>
      </div>
    </div>
  );
}

/* ===== ENHANCED STYLES ===== */

const page = {
  background: "linear-gradient(135deg, #0a0e1a 0%, #1a1f35 100%)",
  color: "#ffffff",
  minHeight: "100vh",
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
};

const hero = {
  padding: "4rem 2rem 5rem",
  textAlign: "center",
  maxWidth: "900px",
  margin: "0 auto"
};

const heroBadge = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
  padding: "0.5rem 1.25rem",
  background: "rgba(79, 124, 255, 0.15)",
  border: "1px solid rgba(79, 124, 255, 0.3)",
  borderRadius: "50px",
  fontSize: "0.9rem",
  color: "#a5b4fc",
  marginBottom: "2rem",
  backdropFilter: "blur(10px)"
};

const badgeIcon = {
  fontSize: "1.2rem"
};

const title = {
  fontSize: "3.5rem",
  fontWeight: "700",
  lineHeight: "1.2",
  letterSpacing: "-0.02em",
  background: "linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  marginBottom: "0.5rem"
};

const subtitle = {
  color: "#cbd5e1",
  marginTop: "1rem",
  fontSize: "1.25rem",
  lineHeight: "1.6",
  fontWeight: "400"
};

const heroBtns = {
  marginTop: "2.5rem",
  display: "flex",
  justifyContent: "center",
  gap: "1rem",
  flexWrap: "wrap"
};

const btnIcon = {
  marginRight: "0.5rem",
  fontSize: "1.1rem"
};

const primaryBtn = {
  padding: "14px 32px",
  background: "linear-gradient(135deg, #4f7cff 0%, #3b5bdb 100%)",
  border: "none",
  borderRadius: "12px",
  color: "white",
  cursor: "pointer",
  fontSize: "1rem",
  fontWeight: "600",
  boxShadow: "0 4px 20px rgba(79, 124, 255, 0.4)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  transform: "translateY(0)",
  display: "flex",
  alignItems: "center"
};

const outlineBtn = {
  padding: "14px 32px",
  background: "rgba(79, 124, 255, 0.1)",
  border: "2px solid #4f7cff",
  borderRadius: "12px",
  color: "#ffffff",
  cursor: "pointer",
  fontSize: "1rem",
  fontWeight: "600",
  backdropFilter: "blur(10px)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  display: "flex",
  alignItems: "center"
};

const trustBar = {
  display: "flex",
  justifyContent: "center",
  gap: "2.5rem",
  marginTop: "3rem",
  flexWrap: "wrap"
};

const trustItem = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  color: "#cbd5e1",
  fontSize: "0.95rem"
};

const trustIcon = {
  fontSize: "1.4rem"
};

const section = {
  padding: "5rem 2rem",
  textAlign: "center",
  maxWidth: "1200px",
  margin: "0 auto"
};

const sectionAlt = {
  ...section,
  background: "rgba(15, 23, 42, 0.5)",
  backdropFilter: "blur(10px)",
  borderTop: "1px solid rgba(148, 163, 184, 0.1)",
  borderBottom: "1px solid rgba(148, 163, 184, 0.1)"
};

const sectionTitle = {
  fontSize: "2.5rem",
  fontWeight: "700",
  marginBottom: "0.5rem",
  letterSpacing: "-0.01em"
};

const sectionSubtitle = {
  color: "#94a3b8",
  fontSize: "1.1rem",
  marginBottom: "1rem"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "2rem",
  marginTop: "3rem",
  padding: "0 1rem"
};

const card = {
  background: "linear-gradient(135deg, rgba(79, 124, 255, 0.08) 0%, rgba(59, 91, 219, 0.04) 100%)",
  padding: "2.5rem 1.5rem",
  borderRadius: "20px",
  border: "2px solid rgba(79, 124, 255, 0.2)",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  cursor: "pointer",
  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "1rem"
};

const categoryIcon = {
  width: "80px",
  height: "80px",
  borderRadius: "20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "0.5rem"
};

const iconEmoji = {
  fontSize: "2.5rem"
};

const categoryName = {
  fontSize: "1.25rem",
  fontWeight: "600",
  color: "#ffffff"
};

const categoryDesc = {
  fontSize: "0.9rem",
  color: "#94a3b8"
};

const infoCard = {
  background: "linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.7) 100%)",
  padding: "3rem 2rem",
  borderRadius: "20px",
  border: "1px solid rgba(148, 163, 184, 0.15)",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "1rem",
  transition: "all 0.3s ease"
};

const stepIconWrapper = {
  width: "90px",
  height: "90px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, rgba(79, 124, 255, 0.2) 0%, rgba(59, 91, 219, 0.1) 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "2px solid rgba(79, 124, 255, 0.3)",
  marginBottom: "0.5rem"
};

const stepEmoji = {
  fontSize: "2.8rem",
  display: "block"
};

const stepTitle = {
  fontSize: "1.3rem",
  fontWeight: "600",
  color: "#ffffff"
};

const stepDesc = {
  fontSize: "0.95rem",
  color: "#94a3b8",
  lineHeight: "1.5",
  maxWidth: "250px"
};

const footer = {
  padding: "3rem 2rem",
  textAlign: "center",
  borderTop: "1px solid rgba(148, 163, 184, 0.1)",
  marginTop: "4rem"
};

const footerContent = {
  maxWidth: "1200px",
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "1.5rem"
};

const footerLogo = {
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  fontSize: "1.5rem",
  fontWeight: "700"
};

const logoIcon = {
  fontSize: "2rem"
};

const logoText = {
  background: "linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text"
};

const footerCopy = {
  color: "#94a3b8",
  fontSize: "0.95rem"
};