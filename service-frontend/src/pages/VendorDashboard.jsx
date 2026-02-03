import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function VendorDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [vendor, setVendor] = useState(null);
  const [services, setServices] = useState([]);
  const [orders, setOrders] = useState([]);
  const [earnings, setEarnings] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  // ================= FETCH VENDOR DATA =================
  const fetchVendorData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    const headers = { Authorization: `Bearer ${token}` };

    try {
      // Fetch vendor profile
      const vendorRes = await axios.get("http://localhost:5000/api/users/me", { headers });
      setVendor(vendorRes.data);

      // Fetch services
      const servicesRes = await axios.get("http://localhost:5000/api/services/vendor/me", { headers });
      setServices(servicesRes.data);

      // Fetch orders
      const ordersRes = await axios.get("http://localhost:5000/api/orders", { headers });
      const vendorOrders = ordersRes.data.filter(
        (o) => o.service?.vendor === user._id || o.service?.vendor?._id === user._id
      );
      setOrders(vendorOrders);

      // Calculate earnings (completed orders only)
      const totalEarnings = vendorOrders
        .filter((o) => o.status === "completed")
        .reduce((sum, o) => sum + o.service.price, 0);
      setEarnings(totalEarnings);

    } catch (err) {
      console.error("Vendor dashboard error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }, [token, user._id]);

  useEffect(() => {
    fetchVendorData();
  }, [fetchVendorData]);

  // ================= NAVIGATION HANDLERS =================
  const goToServices = () => navigate("/vendor/services");
  const goToOrders = () => navigate("/vendor/orders");
  const goToProfile = () => navigate("/profile");

  if (loading) return <p style={{ padding: "2rem", color: "white" }}>Loading dashboard...</p>;

  return (
    <div style={{ minHeight: "100vh", background: "#020617", color: "white", padding: "2rem" }}>
      <Navbar role="vendor" />

      {/* ===== STATS ===== */}
      <div style={statsWrapper}>
        <Stat title="Services" value={services.length} onClick={goToServices} />
        <Stat title="Orders" value={orders.length} onClick={goToOrders} />
        <Stat title="Profile & Earnings" value={`Rs ${earnings}`} onClick={goToProfile} />
      </div>

      {/* ===== TABS ===== */}
      <div style={tabs}>
        <button style={activeTab === "overview" ? activeBtn : btn} onClick={() => setActiveTab("overview")}>
          OVERVIEW
        </button>
        <button style={activeTab === "services" ? activeBtn : btn} onClick={() => setActiveTab("services")}>
          SERVICES
        </button>
        <button style={activeTab === "orders" ? activeBtn : btn} onClick={() => setActiveTab("orders")}>
          ORDERS
        </button>
      </div>

      {/* ===== OVERVIEW ===== */}
      {activeTab === "overview" && vendor && (
        <div style={{ marginTop: "1rem" }}>
          <p>Welcome, <b>{vendor.name}</b>!</p>
          <p>Email: {vendor.email}</p>
          <p>Role: {vendor.role}</p>
          <p>Click the stats above to manage your services and orders.</p>
        </div>
      )}

      {/* ===== SERVICES TAB ===== */}
      {activeTab === "services" && (
        <div style={{ marginTop: "1rem" }}>
          {services.length === 0 ? <p>No services added yet.</p> : services.map((s) => (
            <div key={s._id} style={card}>
              <b>{s.name}</b>
              <p>{s.description}</p>
              <p>Rs {s.price}</p>
              <p>Category: {s.category}</p>
            </div>
          ))}
        </div>
      )}

      {/* ===== ORDERS TAB ===== */}
      {activeTab === "orders" && (
        <div style={{ marginTop: "1rem" }}>
          {orders.length === 0 ? <p>No orders yet.</p> : orders.map((o) => (
            <div key={o._id} style={card}>
              <b>{o.service.name}</b>
              <p>Customer: {o.customer.name}</p>
              <p>Status: {o.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ===== STYLES ===== */
const statsWrapper = { display: "flex", gap: "2rem", marginBottom: "1rem" };
const tabs = { display: "flex", gap: "1rem", marginBottom: "1rem" };
const btn = { padding: "6px 12px", background: "#1e293b", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" };
const activeBtn = { ...btn, background: "#4f7cff" };
const card = { background: "#0f172a", padding: "1rem", borderRadius: "10px", marginBottom: "1rem" };

/* ===== REUSABLE STAT COMPONENT ===== */
const Stat = ({ title, value, onClick }) => (
  <div
    onClick={onClick}
    style={{
      background: "#1e293b",
      padding: "0.8rem 1rem",  
      borderRadius: "8px",
      cursor: "pointer",
      textAlign: "center",
      height: "180px",         
      width: "500px",          
      minWidth: "100px",       
    }}
  >
    <p style={{ margin: 0, fontSize: "1.5rem", color: "#aaa" , fontWeight: "bold" }}>{title}</p>
    <p style={{ margin: 0, fontSize: "1rem", fontWeight: "bold" }}>{value}</p>
  </div>
);




