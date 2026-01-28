import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function VendorDashboard() {
  const [stats, setStats] = useState({ pending: 0, inProgress: 0, completed: 0 });
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [newService, setNewService] = useState({ name: "", description: "", price: "", category: "" });

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

        // Orders stats
        const ordersRes = await axios.get("http://localhost:5000/api/orders/vendororders", { headers });
        // Vendor services
        const servicesRes = await axios.get("http://localhost:5000/api/services");

        if (isMounted) {
          setStats({
            pending: ordersRes.data.pending.length,
            inProgress: ordersRes.data.inProgress.length,
            completed: ordersRes.data.completed.length,
          });

          const vendorId = JSON.parse(atob(token.split(".")[1])).id;
          setServices(servicesRes.data.filter((s) => s.vendor._id === vendorId));
        }
      } catch (err) {
        console.error(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAdd = async () => {
    if (!newService.name || !newService.description || !newService.price || !newService.category) {
      alert("Please fill all fields");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
      const res = await axios.post("http://localhost:5000/api/services", newService, { headers });
      setServices([...services, res.data.service]);
      setNewService({ name: "", description: "", price: "", category: "" });
    } catch (err) {
      console.error(err.message);
    }
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setModalOpen(true);
  };

  const handleEdit = async () => {
    if (!editingService.name || !editingService.description || !editingService.price || !editingService.category) {
      alert("Please fill all fields");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
      const res = await axios.put(`http://localhost:5000/api/services/${editingService._id}`, editingService, { headers });
      setServices(services.map((s) => (s._id === editingService._id ? res.data.service : s)));
      setModalOpen(false);
      setEditingService(null);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(`http://localhost:5000/api/services/${id}`, { headers });
      setServices(services.filter((s) => s._id !== id));
    } catch (err) {
      console.error(err.message);
    }
  };

  if (loading) return <p style={{ padding: "2rem" }}>Loading dashboard...</p>;

  return (
    <div style={{ background: "#020617", minHeight: "100vh", color: "white" }}>
      <Navbar />
      <div style={{ padding: "2rem" }}>
        <h1>Vendor Dashboard</h1>
        <div style={grid}>
          <StatCard title="Pending Orders" value={stats.pending} />
          <StatCard title="In Progress" value={stats.inProgress} />
          <StatCard title="Completed Orders" value={stats.completed} />
        </div>

        <hr style={{ margin: "2rem 0", borderColor: "#333" }} />

        <h2>My Services</h2>
        <div style={{ marginBottom: "1rem" }}>
          <input placeholder="Name" value={newService.name} onChange={(e) => setNewService({ ...newService, name: e.target.value })} style={input} />
          <input placeholder="Description" value={newService.description} onChange={(e) => setNewService({ ...newService, description: e.target.value })} style={input} />
          <input placeholder="Price" type="number" value={newService.price} onChange={(e) => setNewService({ ...newService, price: e.target.value })} style={input} />
          <input placeholder="Category" value={newService.category} onChange={(e) => setNewService({ ...newService, category: e.target.value })} style={input} />
          <button style={btn} onClick={handleAdd}>Add Service</button>
        </div>

        {services.map((s) => (
          <div key={s._id} style={serviceCard}>
            <h4>{s.name}</h4>
            <p>{s.description}</p>
            <p>Price: ₹ {s.price}</p>
            <p>Category: {s.category}</p>
            <button style={smallBtn} onClick={() => openEditModal(s)}>Edit</button>
            <button style={smallBtnDelete} onClick={() => handleDelete(s._id)}>Delete</button>
          </div>
        ))}

        {modalOpen && (
          <div style={modalStyle}>
            <div style={modalContent}>
              <h3>Edit Service</h3>
              <input value={editingService.name} onChange={(e) => setEditingService({ ...editingService, name: e.target.value })} style={input} />
              <input value={editingService.description} onChange={(e) => setEditingService({ ...editingService, description: e.target.value })} style={input} />
              <input type="number" value={editingService.price} onChange={(e) => setEditingService({ ...editingService, price: e.target.value })} style={input} />
              <input value={editingService.category} onChange={(e) => setEditingService({ ...editingService, category: e.target.value })} style={input} />
              <button style={btn} onClick={handleEdit}>Save</button>
              <button style={btn} onClick={() => setModalOpen(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div style={card}>
      <h3>{title}</h3>
      <p style={statValue}>{value}</p>
    </div>
  );
}

const grid = { marginTop: "2rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "1.5rem" };
const card = { background: "#0f172a", padding: "1.5rem", borderRadius: "14px", boxShadow: "0 10px 25px rgba(0,0,0,0.4)" };
const statValue = { fontSize: "2rem", fontWeight: "bold" };
const btn = { marginTop: "8px", padding: "10px", borderRadius: "6px", border: "none", background: "#4f7cff", color: "white", cursor: "pointer" };
const smallBtn = { marginRight: "0.5rem", padding: "6px 10px", borderRadius: "6px", border: "none", background: "#4f7cff", color: "white", cursor: "pointer" };
const smallBtnDelete = { padding: "6px 10px", borderRadius: "6px", border: "none", background: "#ef4444", color: "white", cursor: "pointer" };
const input = { padding: "8px", borderRadius: "6px", border: "1px solid #555", marginBottom: "0.5rem", background: "#1e293b", color: "white" };
const serviceCard = { background: "#1e293b", padding: "1rem", marginBottom: "1rem", borderRadius: "10px" };
const modalStyle = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center", alignItems: "center" };
const modalContent = { background: "#0f172a", padding: "2rem", borderRadius: "10px", width: "400px", display: "flex", flexDirection: "column", gap: "1rem" };
