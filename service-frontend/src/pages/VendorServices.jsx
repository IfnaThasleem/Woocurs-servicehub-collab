import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function VendorServices() {
  const token = localStorage.getItem("token");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newService, setNewService] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    available: true,
  });

  // ================= FETCH SERVICES =================
  const fetchServices = useCallback(async () => {
    if (!token) return;
    setLoading(true);

    try {
      const res = await axios.get(
        "http://localhost:5000/api/vendor/services",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setServices(res.data);
    } catch (err) {
      console.error("Fetch services error:", err.response?.data || err.message);
      alert("Failed to fetch services");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // ================= ADD SERVICE =================
  const addService = async () => {
    const { name, price, description, category } = newService;
    if (!name || !price || !description || !category) {
      return alert("All fields are required");
    }

    try {
      await axios.post(
        "http://localhost:5000/api/vendor/services",
        { name, price: Number(price), description, category },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewService({ name: "", price: "", description: "", category: "", available: true });
      fetchServices();
    } catch (err) {
      console.error("Add service error:", err.response?.data || err.message);
      alert("Failed to add service");
    }
  };

  // ================= DELETE SERVICE =================
  const deleteService = async (id) => {
    if (!window.confirm("Delete this service?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/vendor/services/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchServices();
    } catch (err) {
      console.error("Delete service error:", err.response?.data || err.message);
      alert("Failed to delete service");
    }
  };

  // ================= TOGGLE AVAILABILITY =================
  const toggleAvailability = async (service) => {
    try {
      await axios.put(
        `http://localhost:5000/api/vendor/services/${service._id}`,
        { available: !service.available },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchServices();
    } catch (err) {
      console.error("Toggle availability error:", err.response?.data || err.message);
      alert("Failed to update service availability");
    }
  };

  if (loading) return <p style={{ padding: "2rem", color: "white" }}>Loading services...</p>;

  return (
    <div style={page}>
      <Navbar role="vendor" />
      <h2>My Services</h2>

      {/* ===== ADD NEW SERVICE ===== */}
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

      {/* ===== SERVICE LIST ===== */}
      {services.length === 0 && <p>No services found.</p>}
      {services.map((s) => (
        <div key={s._id} style={card}>
          <b>{s.name}</b>
          <p>{s.description}</p>
          <p>Rs {s.price}</p>
          <p>Category: {s.category}</p>
          <p>Available: {s.available ? "✅" : "⛔"}</p>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "5px" }}>
            <button style={actionBtn} onClick={() => toggleAvailability(s)}>
              {s.available ? "Set Unavailable" : "Set Available"}
            </button>
            <button style={deleteBtn} onClick={() => deleteService(s._id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ===== STYLES ===== */
const page = { background: "#020617", minHeight: "100vh", padding: "2rem", color: "white" };
const card = { background: "#0f172a", padding: "1rem", borderRadius: "10px", marginBottom: "1rem" };
const actionBtn = { background: "#4f7cff", padding: "6px 10px", border: "none", color: "white", cursor: "pointer" };
const deleteBtn = { ...actionBtn, background: "#ef4444" };
const input = { width: "100%", marginBottom: "8px", padding: "8px", background: "#1e293b", border: "1px solid #334155", color: "white", borderRadius: "6px" };
