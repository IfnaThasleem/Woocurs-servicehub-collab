import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [customers, setCustomers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [orders, setOrders] = useState([]);
  const [services, setServices] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newService, setNewService] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
  });

  /* ================= FETCH ALL ================= */
  const fetchAll = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };
    setLoading(true);

    try {
      const [usersRes, ordersRes, servicesRes] = await Promise.all([
        axios.get("http://localhost:5000/api/users", { headers }),
        axios.get("http://localhost:5000/api/orders", { headers }),
        axios.get("http://localhost:5000/api/services", { headers }),
      ]);

      const users = usersRes.data;
      setCustomers(users.filter((u) => u.role === "user"));
      setVendors(users.filter((u) => u.role === "vendor"));
      setOrders(ordersRes.data);
      setServices(servicesRes.data);

      // Notifications for newly logged-in vendors
      users.filter(u => u.role === "vendor" && u.isLoggedIn).forEach(v => {
        setNotifications(prev => [...prev, `${v.name} just logged in.`]);
      });

    } catch (err) {
      console.error(err);
      alert("Failed loading data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  /* ================= VENDOR ================= */
  const toggleVendorStatus = async (vendor) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };

    await axios.put(
      `http://localhost:5000/api/users/${vendor._id}`,
      { isApproved: !vendor.isApproved },
      { headers }
    );
    fetchAll();
  };

  /* ================= SERVICES ================= */
  const addService = async () => {
    const { name, price, description, category } = newService;
    if (!name || !price || !description || !category)
      return alert("All fields are required");

    const token = localStorage.getItem("token");
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };

    await axios.post(
      "http://localhost:5000/api/services",
      { name, price: Number(price), description, category },
      { headers }
    );

    setNewService({ name: "", price: "", description: "", category: "" });
    fetchAll();
  };

  const deleteService = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };

    if (!window.confirm("Delete service?")) return;
    await axios.delete(`http://localhost:5000/api/services/${id}`, { headers });
    fetchAll();
  };

  /* ================= ORDERS ================= */
  const updateOrderStatus = async (id, status) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };

    await axios.put(`http://localhost:5000/api/orders/${id}`, { status }, { headers });
    fetchAll();
  };

  if (loading) return <p style={{ color: "white", padding: "2rem" }}>Loading...</p>;

  const goToTab = (tab) => setActiveTab(tab);

  return (
    <div style={page}>
      <Navbar role="admin" notifications={notifications} />

      <h2>Admin Dashboard</h2>

      <div style={statsGrid}>
        <Stat title="Customers" value={customers.length} onClick={() => goToTab("customers")} />
        <Stat title="Vendors" value={vendors.length} onClick={() => goToTab("vendors")} />
        <Stat title="Orders" value={orders.length} onClick={() => goToTab("orders")} />
        <Stat title="Services" value={services.length} onClick={() => goToTab("services")} />
      </div>

      <div style={tabs}>
        {["overview", "customers", "vendors", "orders", "services"].map((tab) => (
          <button
            key={tab}
            style={activeTab === tab ? activeBtn : btn}
            onClick={() => setActiveTab(tab)}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ===== OVERVIEW ===== */}
      {activeTab === "overview" && (
        <div>
          <p>Welcome, <b>Admin</b>!</p>
          <p>Click stats above to manage users, orders, and services.</p>
        </div>
      )}

      {/* ===== CUSTOMERS ===== */}
      {activeTab === "customers" &&
        customers.map((c) => (
          <div key={c._id} style={card}>
            <b>{c.name}</b>
            <p>{c.email}</p>
          </div>
        ))}

      {/* ===== VENDORS ===== */}
      {activeTab === "vendors" &&
        vendors.map((v) => (
          <div key={v._id} style={card}>
            <b>{v.name}</b>
            <p>{v.email}</p>
            <p>Status: {v.isApproved ? "✅ Approved" : "⛔ Suspended"}</p>
            <button style={actionBtn} onClick={() => toggleVendorStatus(v)}>
              {v.isApproved ? "Suspend" : "Approve"}
            </button>
          </div>
        ))}

      {/* ===== ORDERS ===== */}
      {activeTab === "orders" &&
        orders.map((o) => (
          <div key={o._id} style={card}>
            <b>{o.service?.name}</b>
            <p>Customer: {o.customer.name}</p>
            <p>Status: 
              <select
                value={o.status}
                onChange={(e) => updateOrderStatus(o._id, e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="inProgress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </p>
          </div>
        ))}

      {/* ===== SERVICES ===== */}
      {activeTab === "services" && (
        <>
          <div style={card}>
            <input
              style={input}
              placeholder="Service Name"
              value={newService.name}
              onChange={(e) => setNewService({ ...newService, name: e.target.value })}
            />
            <input
              style={input}
              placeholder="Price"
              type="number"
              value={newService.price}
              onChange={(e) => setNewService({ ...newService, price: e.target.value })}
            />
            <input
              style={input}
              placeholder="Description"
              value={newService.description}
              onChange={(e) => setNewService({ ...newService, description: e.target.value })}
            />
            <input
              style={input}
              placeholder="Category"
              value={newService.category}
              onChange={(e) => setNewService({ ...newService, category: e.target.value })}
            />
            <button style={actionBtn} onClick={addService}>Add Service</button>
          </div>

          {services.map((s) => (
            <div key={s._id} style={card}>
              <b>{s.name}</b>
              <p>{s.description}</p>
              <p>Rs {s.price}</p>
              <p>Category: {s.category}</p>
              <button style={deleteBtn} onClick={() => deleteService(s._id)}>Delete</button>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

/* ===== STYLES ===== */
const Stat = ({ title, value, onClick }) => (
  <div style={statCard} onClick={onClick}>
    <h3>{title}</h3>
    <p style={{ fontSize: 28 }}>{value}</p>
  </div>
);

const page = { background: "#020617", minHeight: "100vh", padding: "2rem", color: "white" };
const statsGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "1rem", marginBottom: "1.5rem" };
const statCard = { background: "#0f172a", padding: "1.5rem", borderRadius: "12px", cursor: "pointer", transition: "0.2s", textAlign: "center" };
const tabs = { display: "flex", gap: "1rem", marginBottom: "1rem" };
const btn = { background: "#1e293b", color: "white", padding: "8px 14px", border: "none" };
const activeBtn = { ...btn, background: "#4f7cff" };
const card = { background: "#0f172a", padding: "1rem", borderRadius: "10px", marginBottom: "1rem" };
const actionBtn = { background: "#4f7cff", padding: "6px 10px", border: "none", color: "white", marginTop: "5px" };
const deleteBtn = { ...actionBtn, background: "#ef4444" };
const input = { width: "100%", marginBottom: "8px", padding: "8px", background: "#1e293b", border: "1px solid #334155", color: "white", borderRadius: "6px" };
