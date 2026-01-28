import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    customers: 0,
    vendors: 0,
    services: 0,
    orders: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [usersRes, servicesRes, ordersRes] = await Promise.all([
          axios.get("http://localhost:5000/api/users", { headers }),
          axios.get("http://localhost:5000/api/services", { headers }),
          axios.get("http://localhost:5000/api/orders", { headers }),
        ]);

        const users = usersRes.data;

        setStats({
          customers: users.filter((u) => u.role === "user").length,
          vendors: users.filter((u) => u.role === "vendor").length,
          services: servicesRes.data.filter((s) => s.status !== "disabled").length,
          orders: ordersRes.data.filter(
            (o) => o.status === "pending" || o.status === "inProgress"
          ).length,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div style={container}>
      <Navbar role="admin" />

      <div style={content}>
        <h1>Admin Dashboard</h1>
        <p style={{ color: "#94a3b8" }}>System overview</p>

        {loading ? (
          <p>Loading stats...</p>
        ) : (
          <>
            <div style={grid}>
              <StatCard title="Active Customers" value={stats.customers} />
              <StatCard title="Approved Vendors" value={stats.vendors} />
              <StatCard title="Live Services" value={stats.services} />
              <StatCard title="Open Orders" value={stats.orders} />
            </div>

            <button style={manageBtn} onClick={() => navigate("/admin/manage")}>
              Go to Admin Management →
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ===== Components ===== */

function StatCard({ title, value }) {
  return (
    <div style={card}>
      <h3>{title}</h3>
      <p style={stat}>{value}</p>
    </div>
  );
}

/* ===== Styles ===== */

const container = {
  minHeight: "100vh",
  background: "#020617",
  color: "white",
};

const content = { padding: "2rem" };

const grid = {
  marginTop: "2rem",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "1.5rem",
};

const card = {
  background: "#0f172a",
  padding: "1.5rem",
  borderRadius: "14px",
};

const stat = {
  fontSize: "2.2rem",
  fontWeight: "bold",
};

const manageBtn = {
  marginTop: "2rem",
  padding: "14px 20px",
  background: "#4f7cff",
  border: "none",
  borderRadius: "8px",
  color: "white",
  cursor: "pointer",
};
