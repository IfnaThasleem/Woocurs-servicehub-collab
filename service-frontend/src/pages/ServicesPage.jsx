import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function ServicesPage() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const role = localStorage.getItem("role") || "";
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:5000/api/services", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setServices(res.data))
      .catch((err) => console.error(err));
  }, [token, navigate]);

  return (
    <div style={page}>
      <Navbar role={role} />

      <div style={content}>
        <h2>Services</h2>
        <div style={grid}>
          {services.map((s) => (
            <div key={s._id} style={card}>
              <h3>{s.name}</h3>
              <p>{s.description}</p>
              <p><b>Rs. {s.price}</b></p>

              {role === "user" && (
                <button
  style={btn}
  onClick={() =>
    navigate("/book-service", { state: { serviceId: s._id } })
  }
>
  Book Service
</button>

              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ===== STYLES ===== */
const page = { minHeight: "100vh", background: "#020617", color: "white" };
const content = { padding: "2rem" };
const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: "1.5rem" };
const card = { background: "#0f172a", padding: "1.5rem", borderRadius: "12px" };
const btn = { marginTop: "10px", padding: "8px", width: "100%", background: "#22c55e", border: "none", borderRadius: "6px", cursor: "pointer" };
