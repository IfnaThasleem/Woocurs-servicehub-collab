// src/pages/UserDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function UserDashboard() {
  const [user, setUser] = useState({ name: "", email: "", role: "", password: "" });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [profileModal, setProfileModal] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch user info
        const userRes = await axios.get("http://localhost:5000/api/users/me", { headers });
        if (isMounted) setUser({ ...userRes.data, password: "" });

        // Fetch orders
        const ordersRes = await axios.get("http://localhost:5000/api/orders/customerorders", { headers });
        if (isMounted) {
          setOrders(ordersRes.data);

          // Notifications: new/pending orders
          const newOrders = ordersRes.data.filter(o => o.status === "pending");
          setNotifications(newOrders.map(o => `New order: ${o._id} - ${o.serviceName || "Service"}`));
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => { isMounted = false; };
  }, []);

  const handleProfileUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const body = { name: user.name, email: user.email };
      if (user.password) body.password = user.password;

      const res = await axios.put("http://localhost:5000/api/users/me", body, { headers });
      alert("Profile updated successfully");
      setProfileModal(false);
      setUser({ ...res.data, password: "" });
    } catch (err) {
      console.error(err.message);
      alert("Failed to update profile");
    }
  };

  // Count orders by status
  const pendingCount = orders.filter(o => o.status === "pending").length;
  const inProgressCount = orders.filter(o => o.status === "inProgress").length;
  const completedCount = orders.filter(o => o.status === "completed").length;

  if (loading) return <p style={{ padding: "2rem" }}>Loading dashboard...</p>;

  return (
    <div style={container}>
      <Navbar />
      <div style={content}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1>Welcome, {user.name}</h1>
          <button style={btn} onClick={() => setProfileModal(true)}>Edit Profile</button>
        </div>
        <p style={{ color: "#94a3b8" }}>{user.email} | Role: {user.role}</p>

        <div style={grid}>
          <StatCard title="Pending Orders" value={pendingCount} />
          <StatCard title="In Progress" value={inProgressCount} />
          <StatCard title="Completed Orders" value={completedCount} />
          <StatCard title="Total Orders" value={orders.length} />
        </div>

        {notifications.length > 0 && (
          <div style={{ marginTop: "2rem" }}>
            <h3>Notifications</h3>
            <ul>
              {notifications.map((n, idx) => (
                <li key={idx} style={notificationItem}>{n}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* ===== Profile Modal ===== */}
      {profileModal && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h3>Edit Profile</h3>
            <input
              style={input}
              value={user.name}
              placeholder="Name"
              onChange={(e) => setUser({ ...user, name: e.target.value })}
            />
            <input
              style={input}
              value={user.email}
              placeholder="Email"
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
            <input
              style={input}
              value={user.password}
              type="password"
              placeholder="New Password (optional)"
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
            <div style={{ display: "flex", gap: "1rem" }}>
              <button style={btn} onClick={handleProfileUpdate}>Save</button>
              <button style={{ ...btn, background: "#ef4444" }} onClick={() => setProfileModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===== Components ===== */
function StatCard({ title, value }) {
  return (
    <div style={card}>
      <h3>{title}</h3>
      <p style={statValue}>{value}</p>
    </div>
  );
}

/* ===== Styles ===== */
const container = { minHeight: "100vh", background: "#020617", color: "white" };
const content = { padding: "2rem" };
const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginTop: "1rem" };
const card = { background: "#0f172a", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 5px 15px rgba(0,0,0,0.3)" };
const statValue = { fontSize: "1.8rem", fontWeight: "bold" };
const btn = { marginTop: "8px", padding: "8px 12px", borderRadius: "6px", border: "none", background: "#4f7cff", color: "white", cursor: "pointer" };
const modalOverlay = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center", alignItems: "center" };
const modalContent = { background: "#0f172a", padding: "2rem", borderRadius: "10px", width: "400px", display: "flex", flexDirection: "column", gap: "1rem" };
const input = { padding: "8px", borderRadius: "6px", border: "1px solid #555", background: "#1e293b", color: "white", width: "100%", marginBottom: "0.5rem" };
const notificationItem = { background: "#1e293b", padding: "8px", borderRadius: "6px", marginBottom: "6px" };
