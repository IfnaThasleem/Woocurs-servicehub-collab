import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminManagement() {
  const [activeTab, setActiveTab] = useState("customers");

  const [customers, setCustomers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [orders, setOrders] = useState([]);
  const [services, setServices] = useState([]);

  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [editingService, setEditingService] = useState(null);

  const [newService, setNewService] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  /* ================= FETCH ALL ================= */
  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
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
    } catch (err) {
      console.error("Admin fetch error:", err);
      alert(err.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  /* ================= VENDOR CRUD ================= */
  const toggleVendorStatus = async (vendor) => {
    try {
      await axios.put(
        `http://localhost:5000/api/users/${vendor._id}`,
        { isApproved: !vendor.isApproved },
        { headers }
      );
      alert(`Vendor ${vendor.isApproved ? "suspended" : "approved"} successfully`);
      fetchAll();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update vendor status");
    }
  };

  const handleEditVendor = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/users/${editingVendor._id}`,
        editingVendor,
        { headers }
      );
      setModalOpen(false);
      setEditingVendor(null);
      fetchAll();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to edit vendor");
    }
  };

  const handleDeleteVendor = async (id) => {
    if (!window.confirm("Delete vendor?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, { headers });
      fetchAll();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete vendor");
    }
  };

  /* ================= SERVICE CRUD ================= */
  const handleAddService = async () => {
    if (!newService.name || !newService.description || !newService.price || !newService.category) {
      return alert("Fill all service fields");
    }

    try {
      await axios.post(
        "http://localhost:5000/api/services",
        { ...newService, price: Number(newService.price), available: true },
        { headers }
      );
      alert("Service added successfully!");
      setNewService({ name: "", description: "", price: "", category: "" });
      fetchAll();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add service");
    }
  };

  const handleEditService = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/services/${editingService._id}`,
        { ...editingService, price: Number(editingService.price) },
        { headers }
      );
      alert("Service updated successfully!");
      setModalOpen(false);
      setEditingService(null);
      fetchAll();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update service");
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm("Delete service?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/services/${id}`, { headers });
      fetchAll();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete service");
    }
  };

  /* ================= ORDER STATUS ================= */
  const handleUpdateOrderStatus = async (id, status) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/orders/${id}`,
        { status },
        { headers }
      );
      setOrders(orders.map((o) => (o._id === id ? res.data : o)));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update order");
    }
  };

  if (loading) return <p style={{ padding: "2rem", color: "white" }}>Loading...</p>;

  return (
    <div style={page}>
      <h1>Admin Management</h1>
      <p style={{ color: "#94a3b8" }}>
        Customers (read), Vendors (manage), Orders, Services (manage)
      </p>

      {/* ===== TABS ===== */}
      <div style={tabs}>
        {["customers", "vendors", "orders", "services"].map((tab) => (
          <button
            key={tab}
            style={activeTab === tab ? activeTabBtn : tabBtn}
            onClick={() => setActiveTab(tab)}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

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

            <button style={smallBtn} onClick={() => toggleVendorStatus(v)}>
              {v.isApproved ? "Suspend" : "Approve"}
            </button>

            <button
              style={smallBtn}
              onClick={() => {
                setEditingVendor(v);
                setModalOpen(true);
              }}
            >
              Edit
            </button>

            <button style={smallBtnDelete} onClick={() => handleDeleteVendor(v._id)}>
              Delete
            </button>
          </div>
        ))}

      {/* ===== ORDERS ===== */}
      {activeTab === "orders" &&
        orders.map((o) => (
          <div key={o._id} style={card}>
            <p>
              <b>Service:</b> {o.serviceName}
            </p>
            <select value={o.status} onChange={(e) => handleUpdateOrderStatus(o._id, e.target.value)}>
              <option value="pending">Pending</option>
              <option value="inProgress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        ))}

      {/* ===== SERVICES ===== */}
      {activeTab === "services" && (
        <>
          <h3>Add Service</h3>
          <input
            style={input}
            placeholder="Name"
            value={newService.name}
            onChange={(e) => setNewService({ ...newService, name: e.target.value })}
          />
          <input
            style={input}
            placeholder="Description"
            value={newService.description}
            onChange={(e) => setNewService({ ...newService, description: e.target.value })}
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
            placeholder="Category"
            value={newService.category}
            onChange={(e) => setNewService({ ...newService, category: e.target.value })}
          />
          <button style={btn} onClick={handleAddService}>
            Add Service
          </button>

          {services.map((s) => (
            <div key={s._id} style={card}>
              <b>{s.name}</b>
              <p>{s.description}</p>
              <p>Price: {s.price}</p>
              <p>Category: {s.category}</p>

              <button
                style={smallBtn}
                onClick={() => {
                  setEditingService(s);
                  setModalOpen(true);
                }}
              >
                Edit
              </button>
              <button style={smallBtnDelete} onClick={() => handleDeleteService(s._id)}>
                Delete
              </button>
            </div>
          ))}
        </>
      )}

      {/* ===== EDIT MODAL ===== */}
      {modalOpen && (editingVendor || editingService) && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            {editingVendor && (
              <>
                <h3>Edit Vendor</h3>
                <input
                  style={input}
                  value={editingVendor.name}
                  onChange={(e) =>
                    setEditingVendor({ ...editingVendor, name: e.target.value })
                  }
                />
                <input
                  style={input}
                  value={editingVendor.email}
                  onChange={(e) =>
                    setEditingVendor({ ...editingVendor, email: e.target.value })
                  }
                />
                <button style={btn} onClick={handleEditVendor}>
                  Save
                </button>
              </>
            )}

            {editingService && (
              <>
                <h3>Edit Service</h3>
                <input
                  style={input}
                  value={editingService.name}
                  onChange={(e) =>
                    setEditingService({ ...editingService, name: e.target.value })
                  }
                />
                <input
                  style={input}
                  value={editingService.description}
                  onChange={(e) =>
                    setEditingService({ ...editingService, description: e.target.value })
                  }
                />
                <input
                  style={input}
                  type="number"
                  value={editingService.price}
                  onChange={(e) =>
                    setEditingService({ ...editingService, price: e.target.value })
                  }
                />
                <input
                  style={input}
                  value={editingService.category}
                  onChange={(e) =>
                    setEditingService({ ...editingService, category: e.target.value })
                  }
                />
                <button style={btn} onClick={handleEditService}>
                  Save
                </button>
              </>
            )}

            <button style={btn} onClick={() => setModalOpen(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= STYLES ================= */
const page = { minHeight: "100vh", background: "#020617", color: "white", padding: "2rem" };
const tabs = { display: "flex", gap: "1rem", marginBottom: "1.5rem" };
const tabBtn = { padding: "8px 16px", background: "#1e293b", color: "white", border: "none", borderRadius: "6px" };
const activeTabBtn = { ...tabBtn, background: "#4f7cff" };
const card = { background: "#0f172a", padding: "1rem", borderRadius: "10px", marginBottom: "1rem" };
const input = { width: "100%", padding: "8px", marginBottom: "8px", borderRadius: "6px", background: "#1e293b", color: "white", border: "1px solid #334155" };
const btn = { padding: "10px", background: "#4f7cff", border: "none", borderRadius: "6px", color: "white", marginRight: "8px" };
const smallBtn = { ...btn, padding: "6px 10px" };
const smallBtnDelete = { ...smallBtn, background: "#ef4444" };
const modalOverlay = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center", alignItems: "center" };
const modalContent = { background: "#0f172a", padding: "2rem", borderRadius: "12px", width: "400px" };
