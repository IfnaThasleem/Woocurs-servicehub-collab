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

  if (loading) {
    return (
      <div style={loadingPage}>
        <div style={loadingSpinner}>
          <span style={spinnerIcon}>⏳</span>
          <p style={loadingText}>Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={page}>
      <Navbar role="vendor" />
      
      <div style={container}>
        <div style={headerSection}>
          <div style={titleGroup}>
            <div style={iconCircle}>
              <span style={iconLarge}>🛠️</span>
            </div>
            <div>
              <h2 style={pageTitle}>My Services</h2>
              <p style={pageSubtitle}>Manage your service offerings</p>
            </div>
          </div>
        </div>

        {/* ===== ADD NEW SERVICE ===== */}
        <div style={addServiceCard}>
          <div style={formHeader}>
            <span style={formIcon}>➕</span>
            <h4 style={formTitle}>Add New Service</h4>
          </div>
          <div style={formGrid}>
            <div style={inputGroup}>
              <label style={inputLabel}>
                <span style={labelIcon}>🏷️</span>
                Service Name
              </label>
              <input
                style={input}
                placeholder="e.g., House Cleaning"
                value={newService.name}
                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
              />
            </div>
            <div style={inputGroup}>
              <label style={inputLabel}>
                <span style={labelIcon}>💰</span>
                Price
              </label>
              <input
                style={input}
                placeholder="e.g., 500"
                type="number"
                value={newService.price}
                onChange={(e) => setNewService({ ...newService, price: e.target.value })}
              />
            </div>
            <div style={inputGroup}>
              <label style={inputLabel}>
                <span style={labelIcon}>📝</span>
                Description
              </label>
              <input
                style={input}
                placeholder="Service description"
                value={newService.description}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
              />
            </div>
            <div style={inputGroup}>
              <label style={inputLabel}>
                <span style={labelIcon}>📂</span>
                Category
              </label>
              <input
                style={input}
                placeholder="e.g., Cleaning"
                value={newService.category}
                onChange={(e) => setNewService({ ...newService, category: e.target.value })}
              />
            </div>
          </div>
          <button 
            style={addServiceBtn} 
            onClick={addService}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 25px rgba(34, 197, 94, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 15px rgba(34, 197, 94, 0.3)";
            }}
          >
            <span style={btnIconLarge}>➕</span>
            Add Service
          </button>
        </div>

        {/* ===== SERVICE LIST ===== */}
        <div style={sectionHeader}>
          <span style={sectionIcon}>📋</span>
          <h3 style={sectionTitle}>Your Services</h3>
          <span style={countBadge}>{services.length} Total</span>
        </div>

        {services.length === 0 ? (
          <div style={emptyStateContainer}>
            <span style={emptyStateIcon}>🛠️</span>
            <p style={emptyStateText}>No services found</p>
          </div>
        ) : (
          services.map((s) => (
            <div key={s._id} style={serviceCard}>
              <div style={serviceCardHeader}>
                <div style={serviceIconCircle}>
                  <span style={serviceIconLarge}>🛠️</span>
                </div>
                <div style={serviceCardInfo}>
                  <b style={serviceCardName}>{s.name}</b>
                  <p style={serviceCardDesc}>{s.description}</p>
                  <div style={serviceMetaRow}>
                    <span style={priceTag}>
                      <span style={priceIcon}>💰</span>
                      Rs {s.price}
                    </span>
                    <span style={categoryTag}>
                      <span style={categoryIcon}>📂</span>
                      {s.category}
                    </span>
                    <span style={s.available ? availableBadge : unavailableBadge}>
                      {s.available ? "✅ Available" : "⛔ Unavailable"}
                    </span>
                  </div>
                </div>
              </div>
              <div style={buttonRow}>
                <button 
                  style={s.available ? unavailableBtn : availableBtn}
                  onClick={() => toggleAvailability(s)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.opacity = "0.9";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.opacity = "1";
                  }}
                >
                  <span style={btnIconSmall}>
                    {s.available ? "⛔" : "✅"}
                  </span>
                  {s.available ? "Set Unavailable" : "Set Available"}
                </button>
                <button 
                  style={deleteBtn} 
                  onClick={() => deleteService(s._id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(239, 68, 68, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 15px rgba(239, 68, 68, 0.3)";
                  }}
                >
                  <span style={btnIconSmall}>🗑️</span>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ===== ENHANCED STYLES ===== */
const page = {
  background: "linear-gradient(135deg, #0a0e1a 0%, #1a1f35 100%)",
  minHeight: "100vh",
  color: "white",
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
};

const loadingPage = {
  ...page,
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const loadingSpinner = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "1rem"
};

const spinnerIcon = {
  fontSize: "4rem",
  animation: "spin 2s linear infinite"
};

const loadingText = {
  fontSize: "1.2rem",
  color: "#94a3b8"
};

const container = {
  padding: "2rem",
  maxWidth: "1400px",
  margin: "0 auto"
};

const headerSection = {
  marginBottom: "2.5rem"
};

const titleGroup = {
  display: "flex",
  alignItems: "center",
  gap: "1rem"
};

const iconCircle = {
  width: "70px",
  height: "70px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(124, 58, 237, 0.1) 100%)",
  border: "3px solid rgba(139, 92, 246, 0.3)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 8px 25px rgba(139, 92, 246, 0.3)"
};

const iconLarge = {
  fontSize: "2.5rem"
};

const pageTitle = {
  fontSize: "2.5rem",
  fontWeight: "700",
  marginBottom: "0.25rem",
  background: "linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text"
};

const pageSubtitle = {
  color: "#94a3b8",
  fontSize: "1rem",
  margin: 0
};

const addServiceCard = {
  background: "rgba(15, 23, 42, 0.8)",
  backdropFilter: "blur(10px)",
  padding: "2rem",
  borderRadius: "20px",
  border: "2px solid rgba(34, 197, 94, 0.2)",
  marginBottom: "2rem",
  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.4)"
};

const formHeader = {
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  marginBottom: "1.5rem"
};

const formIcon = {
  fontSize: "1.8rem"
};

const formTitle = {
  fontSize: "1.5rem",
  fontWeight: "700",
  color: "#e2e8f0",
  margin: 0
};

const formGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "1rem",
  marginBottom: "1.5rem"
};

const inputGroup = {
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem"
};

const inputLabel = {
  fontSize: "0.9rem",
  fontWeight: "600",
  color: "#cbd5e1",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem"
};

const labelIcon = {
  fontSize: "1rem"
};

const input = {
  width: "100%",
  padding: "12px 14px",
  background: "rgba(2, 6, 23, 0.6)",
  border: "2px solid rgba(148, 163, 184, 0.2)",
  color: "white",
  borderRadius: "10px",
  fontSize: "0.95rem",
  outline: "none",
  transition: "all 0.3s ease"
};

const addServiceBtn = {
  width: "100%",
  padding: "14px",
  background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
  border: "none",
  borderRadius: "12px",
  color: "white",
  fontWeight: "700",
  fontSize: "1.05rem",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.5rem",
  boxShadow: "0 4px 15px rgba(34, 197, 94, 0.3)",
  transition: "all 0.3s ease"
};

const btnIconLarge = {
  fontSize: "1.3rem"
};

const sectionHeader = {
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  marginBottom: "1rem",
  padding: "1rem",
  background: "rgba(15, 23, 42, 0.6)",
  borderRadius: "12px",
  border: "2px solid rgba(148, 163, 184, 0.2)"
};

const sectionIcon = {
  fontSize: "2rem"
};

const sectionTitle = {
  fontSize: "1.5rem",
  fontWeight: "700",
  color: "#e2e8f0",
  margin: 0,
  flex: 1
};

const countBadge = {
  padding: "0.5rem 1rem",
  background: "rgba(79, 124, 255, 0.2)",
  border: "1px solid rgba(79, 124, 255, 0.3)",
  borderRadius: "20px",
  fontSize: "0.9rem",
  fontWeight: "600",
  color: "#93c5fd"
};

const serviceCard = {
  background: "rgba(15, 23, 42, 0.8)",
  backdropFilter: "blur(10px)",
  padding: "1.5rem",
  borderRadius: "16px",
  border: "2px solid rgba(148, 163, 184, 0.1)",
  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
  marginBottom: "1rem",
  display: "flex",
  flexDirection: "column",
  gap: "1rem"
};

const serviceCardHeader = {
  display: "flex",
  gap: "1rem",
  alignItems: "flex-start"
};

const serviceIconCircle = {
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(124, 58, 237, 0.1) 100%)",
  border: "2px solid rgba(139, 92, 246, 0.3)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0
};

const serviceIconLarge = {
  fontSize: "2rem"
};

const serviceCardInfo = {
  flex: 1
};

const serviceCardName = {
  fontSize: "1.3rem",
  color: "#e2e8f0",
  marginBottom: "0.5rem",
  display: "block"
};

const serviceCardDesc = {
  fontSize: "0.95rem",
  color: "#94a3b8",
  lineHeight: "1.6",
  marginBottom: "0.75rem"
};

const serviceMetaRow = {
  display: "flex",
  gap: "0.75rem",
  flexWrap: "wrap"
};

const priceTag = {
  padding: "0.5rem 1rem",
  background: "rgba(34, 197, 94, 0.15)",
  border: "1px solid rgba(34, 197, 94, 0.3)",
  borderRadius: "20px",
  fontSize: "0.95rem",
  fontWeight: "600",
  color: "#4ade80",
  display: "flex",
  alignItems: "center",
  gap: "0.4rem"
};

const priceIcon = {
  fontSize: "1rem"
};

const categoryTag = {
  padding: "0.5rem 1rem",
  background: "rgba(139, 92, 246, 0.15)",
  border: "1px solid rgba(139, 92, 246, 0.3)",
  borderRadius: "20px",
  fontSize: "0.95rem",
  fontWeight: "600",
  color: "#a78bfa",
  display: "flex",
  alignItems: "center",
  gap: "0.4rem"
};

const categoryIcon = {
  fontSize: "1rem"
};

const availableBadge = {
  padding: "0.5rem 1rem",
  background: "rgba(34, 197, 94, 0.15)",
  border: "1px solid rgba(34, 197, 94, 0.3)",
  borderRadius: "20px",
  fontSize: "0.85rem",
  fontWeight: "600",
  color: "#4ade80"
};

const unavailableBadge = {
  padding: "0.5rem 1rem",
  background: "rgba(239, 68, 68, 0.15)",
  border: "1px solid rgba(239, 68, 68, 0.3)",
  borderRadius: "20px",
  fontSize: "0.85rem",
  fontWeight: "600",
  color: "#f87171"
};

const buttonRow = {
  display: "flex",
  gap: "0.75rem",
  flexWrap: "wrap"
};

const availableBtn = {
  padding: "10px 16px",
  background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
  border: "none",
  borderRadius: "10px",
  color: "white",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.3s ease",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  boxShadow: "0 4px 15px rgba(34, 197, 94, 0.3)"
};

const unavailableBtn = {
  padding: "10px 16px",
  background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
  border: "none",
  borderRadius: "10px",
  color: "white",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.3s ease",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  boxShadow: "0 4px 15px rgba(245, 158, 11, 0.3)"
};

const deleteBtn = {
  padding: "10px 16px",
  background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
  border: "none",
  borderRadius: "10px",
  color: "white",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.3s ease",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  boxShadow: "0 4px 15px rgba(239, 68, 68, 0.3)"
};

const btnIconSmall = {
  fontSize: "1rem"
};

const emptyStateContainer = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "4rem 2rem",
  background: "rgba(15, 23, 42, 0.6)",
  borderRadius: "16px",
  border: "2px dashed rgba(148, 163, 184, 0.3)"
};

const emptyStateIcon = {
  fontSize: "4rem",
  opacity: 0.5,
  marginBottom: "1rem"
};

const emptyStateText = {
  fontSize: "1.1rem",
  color: "#64748b",
  margin: 0
};