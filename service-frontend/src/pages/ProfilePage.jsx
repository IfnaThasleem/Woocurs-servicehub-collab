import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [servicesCount, setServicesCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [earnings, setEarnings] = useState(0);

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalVendors, setTotalVendors] = useState(0);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      const token = localStorage.getItem("token");
      if (!token) return;

      const headers = { Authorization: `Bearer ${token}` };

      try {
        /* ================= VENDOR (DO NOT TOUCH LOGIC) ================= */
        if (user.role === "vendor") {
          const servicesRes = await axios.get(
            "http://localhost:5000/api/services",
            { headers }
          );
          const vendorServices = servicesRes.data.filter(
            (s) => s.vendor?._id === user._id
          );
          setServicesCount(vendorServices.length);

          const ordersRes = await axios.get(
            "http://localhost:5000/api/orders",
            { headers }
          );
          const vendorOrders = ordersRes.data.filter(
            (o) => o.service?.vendor?._id === user._id
          );
          setOrdersCount(vendorOrders.length);

          const totalEarnings = vendorOrders
            .filter((o) => o.status === "completed")
            .reduce((sum, o) => sum + o.service.price, 0);

          setEarnings(totalEarnings);
        }

        /* ================= ADMIN ================= */
        if (user.role === "admin") {
          const usersRes = await axios.get(
            "http://localhost:5000/api/users",
            { headers }
          );
          setTotalUsers(
            usersRes.data.filter((u) => u.role === "user").length
          );
          setTotalVendors(
            usersRes.data.filter((u) => u.role === "vendor").length
          );
        }

        /* ================= USER ================= */
        if (user.role === "user") {
          const ordersRes = await axios.get(
            "http://localhost:5000/api/orders",
            { headers }
          );
          const userOrders = ordersRes.data.filter(
            (o) => o.user?._id === user._id
          );
          setOrdersCount(userOrders.length);
        }
      } catch (err) {
        console.error("Profile fetch error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]); // ✅ ESLint fixed

  if (!user)
    return <p style={{ color: "white", padding: "2rem" }}>No user found.</p>;

  if (loading)
    return <p style={{ color: "white", padding: "2rem" }}>Loading profile…</p>;

  return (
    <>
      <Navbar role={user.role} />
      <div style={page}>
        <h2>My Profile</h2>

        {/* ===== PROFILE INFO ===== */}
        <div style={profileCard}>
          <p><b>Name:</b> {user.name}</p>
          <p><b>Email:</b> {user.email}</p>
          <p><b>Role:</b> {user.role}</p>
        </div>

        {/* ===== ADMIN STATS ===== */}
        {user.role === "admin" && (
          <div style={statsGrid}>
            <StatCard title="Users" value={totalUsers} />
            <StatCard title="Vendors" value={totalVendors} />
          </div>
        )}

        {/* ===== VENDOR STATS ===== */}
        {user.role === "vendor" && (
          <div style={statsGrid}>
            <StatCard title="Services" value={servicesCount} />
            <StatCard title="Orders" value={ordersCount} />
            <StatCard title="Earnings" value={`Rs ${earnings}`} />
          </div>
        )}

        {/* ===== USER STATS ===== */}
        {user.role === "user" && (
          <div style={statsGrid}>
            <StatCard title="My Orders" value={ordersCount} />
          </div>
        )}
      </div>
    </>
  );
}

/* ================= COMPONENTS ================= */
const StatCard = ({ title, value }) => (
  <div style={statCard}>
    <h4>{title}</h4>
    <p style={{ fontSize: 26 }}>{value}</p>
  </div>
);

/* ================= STYLES ================= */
const page = {
  minHeight: "100vh",
  padding: "2rem",
  background: "#020617",
  color: "white",
};

const profileCard = {
  background: "#0f172a",
  padding: "1.5rem",
  borderRadius: "12px",
  marginBottom: "2rem",
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
  gap: "1rem",
};

const statCard = {
  background: "#0f172a",
  padding: "1.2rem",
  borderRadius: "12px",
  textAlign: "center",
};
