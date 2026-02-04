import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar({ role, notifications = [] }) {
  const navigate = useNavigate();
  const [showNotif, setShowNotif] = useState(false);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav style={nav}>
      {/* ===== LOGO ===== */}
      <h2 style={logo}>
        <Link to="/" style={logoLink}>
          <span style={logoIcon}>🛠️</span>
          <span style={logoText}>ServiceHub</span>
        </Link>
      </h2>

      <div style={links}>
        {/* ================= ADMIN ================= */}
        {role === "admin" && (
          <>
            <NavItem to="/admin/dashboard" label="Dashboard" icon="📊" />
            <NavItem to="/orders" label="Orders" icon="📦" />
          </>
        )}

        {/* ================= VENDOR ================= */}
        {role === "vendor" && (
          <>
            <NavItem to="/vendor/dashboard" label="Dashboard" icon="📊" />
            <NavItem to="/vendor/services" label="My Services" icon="🛠️" />
            <NavItem to="/vendor/orders" label="Orders" icon="📦" />
          </>
        )}

        {/* ================= USER ================= */}
        {role === "user" && (
          <>
            <NavItem to="/user/dashboard" label="Dashboard" icon="🏠" />
            <NavItem to="/orders" label="My Orders" icon="📋" />
          </>
        )}

        {/* ================= PROFILE (ALL USERS) ================= */}
        <NavItem to="/profile" label="Profile" icon="👤" />

        {/* ================= NOTIFICATIONS ================= */}
        {role === "admin" && (
          <div style={{ position: "relative" }}>
            <button 
              style={notifBtn} 
              onClick={() => setShowNotif(!showNotif)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(79, 124, 255, 0.15)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(79, 124, 255, 0.1)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <span style={bellIcon}>🔔</span>
              {notifications.length > 0 && (
                <span style={badge}>{notifications.length}</span>
              )}
            </button>
            {showNotif && (
              <div style={notifDropdown}>
                <div style={notifHeader}>
                  <span style={notifHeaderIcon}>📬</span>
                  <span style={notifHeaderText}>Notifications</span>
                </div>
                {notifications.length === 0 ? (
                  <div style={emptyNotif}>
                    <span style={emptyIcon}>📭</span>
                    <p style={emptyText}>No notifications</p>
                  </div>
                ) : (
                  notifications.map((n, i) => (
                    <div 
                      key={i} 
                      style={notifItem}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(79, 124, 255, 0.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <span style={notifDot}>•</span>
                      <p style={notifText}>{n}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* ================= LOGOUT BUTTON ================= */}
        <button 
          style={logoutBtn} 
          onClick={logout}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)";
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(239, 68, 68, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 15px rgba(239, 68, 68, 0.3)";
          }}
        >
          <span style={logoutIcon}>🚪</span>
          Logout
        </button>
      </div>
    </nav>
  );
}

/* ===== REUSABLE NAV ITEM COMPONENT ===== */
const NavItem = ({ to, label, icon }) => (
  <Link 
    to={to} 
    style={link}
    onMouseEnter={(e) => {
      e.currentTarget.style.color = "#4f7cff";
      e.currentTarget.style.transform = "translateY(-2px)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.color = "#e5e7eb";
      e.currentTarget.style.transform = "translateY(0)";
    }}
  >
    <span style={navIcon}>{icon}</span>
    <span>{label}</span>
  </Link>
);

/* ===== ENHANCED STYLES ===== */
const nav = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "1rem 2rem",
  background: "linear-gradient(135deg, #020617 0%, #0f172a 100%)",
  borderBottom: "2px solid rgba(79, 124, 255, 0.2)",
  position: "sticky",
  top: 0,
  zIndex: 100,
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
  backdropFilter: "blur(10px)"
};

const logo = {
  fontSize: "1.5rem",
  fontWeight: "bold",
  margin: 0,
  cursor: "pointer"
};

const logoLink = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  textDecoration: "none",
  transition: "all 0.3s ease"
};

const logoIcon = {
  fontSize: "1.8rem",
  filter: "drop-shadow(0 2px 8px rgba(79, 124, 255, 0.5))"
};

const logoText = {
  background: "linear-gradient(135deg, #4f7cff 0%, #3b5bdb 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  fontWeight: "800",
  letterSpacing: "-0.5px"
};

const links = {
  display: "flex",
  gap: "1.5rem",
  alignItems: "center"
};

const link = {
  color: "#e5e7eb",
  textDecoration: "none",
  fontWeight: "600",
  transition: "all 0.3s ease",
  display: "flex",
  alignItems: "center",
  gap: "0.4rem",
  padding: "0.5rem 0.75rem",
  borderRadius: "8px",
  position: "relative"
};

const navIcon = {
  fontSize: "1.2rem",
  display: "inline-flex",
  alignItems: "center"
};

const logoutBtn = {
  padding: "10px 18px",
  background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
  border: "none",
  borderRadius: "10px",
  color: "white",
  cursor: "pointer",
  fontWeight: "600",
  transition: "all 0.3s ease",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  boxShadow: "0 4px 15px rgba(239, 68, 68, 0.3)",
  fontSize: "0.95rem"
};

const logoutIcon = {
  fontSize: "1.1rem"
};

const notifBtn = {
  position: "relative",
  background: "rgba(79, 124, 255, 0.1)",
  color: "white",
  border: "2px solid rgba(79, 124, 255, 0.3)",
  padding: "10px 14px",
  borderRadius: "10px",
  cursor: "pointer",
  transition: "all 0.3s ease",
  display: "flex",
  alignItems: "center",
  gap: "0.3rem",
  fontSize: "1.2rem"
};

const bellIcon = {
  fontSize: "1.3rem",
  display: "inline-flex",
  alignItems: "center"
};

const badge = {
  position: "absolute",
  top: "-8px",
  right: "-8px",
  background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
  color: "white",
  borderRadius: "50%",
  padding: "4px 8px",
  fontSize: "0.7rem",
  fontWeight: "700",
  border: "2px solid #020617",
  minWidth: "22px",
  textAlign: "center",
  boxShadow: "0 2px 8px rgba(239, 68, 68, 0.5)"
};

const notifDropdown = {
  position: "absolute",
  top: "45px",
  right: 0,
  background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
  border: "2px solid rgba(79, 124, 255, 0.3)",
  borderRadius: "12px",
  width: "300px",
  maxHeight: "400px",
  overflowY: "auto",
  zIndex: 300,
  boxShadow: "0 10px 40px rgba(0, 0, 0, 0.6)",
  backdropFilter: "blur(10px)"
};

const notifHeader = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  padding: "1rem",
  borderBottom: "2px solid rgba(79, 124, 255, 0.2)",
  background: "rgba(79, 124, 255, 0.1)"
};

const notifHeaderIcon = {
  fontSize: "1.3rem"
};

const notifHeaderText = {
  fontSize: "1rem",
  fontWeight: "700",
  color: "#93c5fd"
};

const emptyNotif = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "2rem",
  gap: "0.5rem"
};

const emptyIcon = {
  fontSize: "3rem",
  opacity: 0.5
};

const emptyText = {
  color: "#64748b",
  fontSize: "0.9rem",
  margin: 0
};

const notifItem = {
  padding: "1rem",
  borderBottom: "1px solid rgba(148, 163, 184, 0.1)",
  cursor: "pointer",
  display: "flex",
  alignItems: "flex-start",
  gap: "0.75rem",
  transition: "all 0.2s ease"
};

const notifDot = {
  color: "#4f7cff",
  fontSize: "1.5rem",
  lineHeight: "1",
  marginTop: "-5px"
};

const notifText = {
  color: "#e2e8f0",
  fontSize: "0.9rem",
  margin: 0,
  lineHeight: "1.5",
  flex: 1
};