import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  /* ================= FETCH SERVICES ================= */

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/services");
        setServices(res.data);
      } catch {
        setError("Failed to load services");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  /* ================= CREATE SERVICE ================= */

  const createService = async () => {
    if (!form.name || !form.description || !form.price || !form.category) {
      alert("All fields required");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/services",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setServices([res.data.service, ...services]);
      setForm({ name: "", description: "", price: "", category: "" });
    } catch {
      alert("Failed to create service");
    }
  };

  /* ================= DELETE SERVICE ================= */

  const deleteService = async (id) => {
    if (!window.confirm("Delete this service?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/services/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setServices(services.filter((s) => s._id !== id));
    } catch {
      alert("Failed to delete service");
    }
  };

  return (
    <div style={container}>
      <Navbar role={role} />

      <div style={content}>
        <h2>🛠 Services</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {loading && <p>Loading services...</p>}

        {/* ===== CREATE SERVICE ===== */}
        {(role === "vendor" || role === "admin") && (
          <div style={card}>
            <h3>Add New Service</h3>

            <input
              placeholder="Service Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={input}
            />

            <input
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              style={input}
            />

            <input
              placeholder="Price"
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              style={input}
            />

            <input
              placeholder="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              style={input}
            />

            <button onClick={createService} style={btnPrimary}>
              Create Service
            </button>
          </div>
        )}

        {/* ===== SERVICES LIST ===== */}
        <div style={grid}>
          {services.map((service) => (
            <div key={service._id} style={serviceCard}>
              <h3>{service.name}</h3>
              <p style={muted}>{service.description}</p>
              <p>
                <b>Rs. {service.price}</b>
              </p>
              <p style={badge}>{service.category}</p>

              {role === "user" && (
                <button style={btnSecondary}>Book Service</button>
              )}

              {(role === "vendor" || role === "admin") && (
                <button
                  style={btnDanger}
                  onClick={() => deleteService(service._id)}
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const container = {
  minHeight: "100vh",
  background: "#020617",
  color: "white",
};

const content = {
  padding: "2rem",
};

const card = {
  background: "#0f172a",
  padding: "1.5rem",
  borderRadius: "12px",
  marginBottom: "2rem",
  maxWidth: "500px",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
  gap: "1.5rem",
};

const serviceCard = {
  background: "#0f172a",
  padding: "1.5rem",
  borderRadius: "12px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
};

const input = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "6px",
  border: "none",
};

const btnPrimary = {
  padding: "10px",
  width: "100%",
  background: "#4f7cff",
  border: "none",
  borderRadius: "6px",
  color: "white",
  cursor: "pointer",
};

const btnSecondary = {
  padding: "8px",
  marginTop: "10px",
  width: "100%",
  background: "#22c55e",
  border: "none",
  borderRadius: "6px",
  color: "#020617",
  cursor: "pointer",
};

const btnDanger = {
  padding: "8px",
  marginTop: "10px",
  width: "100%",
  background: "#ef4444",
  border: "none",
  borderRadius: "6px",
  color: "white",
  cursor: "pointer",
};

const badge = {
  display: "inline-block",
  background: "#38bdf8",
  color: "#020617",
  padding: "4px 10px",
  borderRadius: "20px",
  fontSize: "0.75rem",
  marginTop: "6px",
};

const muted = {
  color: "#94a3b8",
};
