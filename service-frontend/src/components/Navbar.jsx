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
        <Link to="/" style={{ color: "#4f7cff", textDecoration: "none" }}>
          ServiceHub
        </Link>
      </h2>

      <div style={links}>
        {/* ================= ADMIN ================= */}
        {role === "admin" && (
          <>
            <NavItem to="/admin/dashboard" label="Dashboard" />
            <NavItem to="/orders" label="Orders" />
          </>
        )}

        {/* ================= VENDOR ================= */}
        {role === "vendor" && (
          <>
            <NavItem to="/vendor/dashboard" label="Dashboard" />
            <NavItem to="/vendor/services" label="My Services" />
            <NavItem to="/vendor/orders" label="Orders" />
          </>
        )}

        {/* ================= USER ================= */}
        {role === "user" && (
          <>
            <NavItem to="/user/dashboard" label="Dashboard" />
            <NavItem to="/orders" label="My Orders" />
          </>
        )}

        {/* ================= PROFILE (ALL USERS) ================= */}
        <NavItem to="/profile" label="Profile" />

        {/* ================= NOTIFICATIONS ================= */}
        {role === "admin" && (
          <div style={{ position: "relative" }}>
            <button style={notifBtn} onClick={() => setShowNotif(!showNotif)}>
              🔔 {notifications.length > 0 && <span style={badge}>{notifications.length}</span>}
            </button>
            {showNotif && (
              <div style={notifDropdown}>
                {notifications.length === 0 && <p>No notifications</p>}
                {notifications.map((n, i) => (
                  <p key={i} style={notifItem}>{n}</p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= LOGOUT BUTTON ================= */}
        <button style={logoutBtn} onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

/* ===== REUSABLE NAV ITEM COMPONENT ===== */
const NavItem = ({ to, label }) => (
  <Link to={to} style={link}>
    {label}
  </Link>
);

/* ===== STYLES ===== */
const nav = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 2rem", background: "#020617", borderBottom: "1px solid #1e293b", position: "sticky", top: 0, zIndex: 100 };
const logo = { fontSize: "1.5rem", fontWeight: "bold", margin: 0, cursor: "pointer" };
const links = { display: "flex", gap: "1.5rem", alignItems: "center" };
const link = { color: "#e5e7eb", textDecoration: "none", fontWeight: "500", transition: "color 0.2s" };
const logoutBtn = { padding: "6px 14px", background: "#ef4444", border: "none", borderRadius: "6px", color: "white", cursor: "pointer", fontWeight: "500", transition: "background 0.2s" };

const notifBtn = { position: "relative", background: "#1e293b", color: "white", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer" };
const badge = { position: "absolute", top: "-5px", right: "-5px", background: "#ef4444", color: "white", borderRadius: "50%", padding: "2px 6px", fontSize: "0.7rem" };
const notifDropdown = { position: "absolute", top: "35px", right: 0, background: "#0f172a", border: "1px solid #334155", borderRadius: "6px", width: "250px", maxHeight: "300px", overflowY: "auto", padding: "0.5rem", zIndex: 300 };
const notifItem = { padding: "0.5rem", borderBottom: "1px solid #334155", cursor: "pointer", color: "white" };
