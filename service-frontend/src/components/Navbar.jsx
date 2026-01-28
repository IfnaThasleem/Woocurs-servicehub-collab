import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  // ✅ Get role safely
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav style={nav}>
      <h3 style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
        ServiceHub
      </h3>

      <div style={links}>
        {/* ROLE BASED DASHBOARD LINKS */}
        {role === "admin" && (
          <Link to="/admin/dashboard" style={link}>
            Admin Dashboard
          </Link>
        )}

        {role === "vendor" && (
          <Link to="/vendor/dashboard" style={link}>
            Vendor Dashboard
          </Link>
        )}

        {role === "user" && (
          <Link to="/user/dashboard" style={link}>
            Dashboard
          </Link>
        )}

        {/* SHARED LINKS */}
        <Link to="/orders" style={link}>
          Orders
        </Link>

        <Link to="/services" style={link}>
          Services
        </Link>

        <button onClick={handleLogout} style={logoutBtn}>
          Logout
        </button>
      </div>
    </nav>
  );
}

/* ================= STYLES ================= */

const nav = {
  background: "#020617",
  padding: "1rem 2rem",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  color: "white",
};

const links = {
  display: "flex",
  alignItems: "center",
  gap: "1rem",
};

const link = {
  color: "white",
  textDecoration: "none",
};

const logoutBtn = {
  background: "#ef4444",
  border: "none",
  padding: "6px 12px",
  borderRadius: "6px",
  color: "white",
  cursor: "pointer",
};
