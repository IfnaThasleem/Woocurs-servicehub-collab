import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        let url = "";

        if (role === "admin") {
          url = "http://localhost:5000/api/orders";
        } else if (role === "vendor") {
          url = "http://localhost:5000/api/orders/vendororders";
        } else {
          url = "http://localhost:5000/api/orders/customerorders";
        }

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Vendor orders come grouped → flatten them
        if (role === "vendor") {
          const grouped = response.data;
          const allOrders = [
            ...(grouped.pending || []),
            ...(grouped.inProgress || []),
            ...(grouped.completed || []),
          ];
          setOrders(allOrders);
        } else {
          setOrders(response.data);
        }
      } catch (error) {
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [role, token]);

  return (
    <div style={container}>
      <Navbar role={role} />

      <div style={content}>
        <h2 style={title}>📦 Orders</h2>

        {loading && <p>Loading orders...</p>}
        {error && <p style={errorText}>{error}</p>}

        {!loading && orders.length === 0 && (
          <p style={emptyText}>No orders found</p>
        )}

        {!loading && orders.length > 0 && (
          <div style={tableWrapper}>
            <table style={table}>
              <thead>
                <tr>
                  <th style={th}>Customer</th>
                  <th style={th}>Service</th>
                  <th style={th}>Vendor</th>
                  <th style={th}>Scheduled</th>
                  <th style={th}>Price</th>
                  <th style={th}>Status</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td style={td}>
                      {order.customer?.name || "—"}
                    </td>
                    <td style={td}>
                      {order.service?.name}
                    </td>
                    <td style={td}>
                      {order.vendor?.name || "—"}
                    </td>
                    <td style={td}>
                      {new Date(order.scheduledDate).toLocaleDateString()}
                    </td>
                    <td style={td}>
                      Rs. {order.totalPrice}
                    </td>
                    <td style={td}>
                      <span style={statusBadge(order.status)}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ===================== STYLES ===================== */

const container = {
  minHeight: "100vh",
  background: "#020617",
  color: "#e5e7eb",
};

const content = {
  padding: "2rem",
};

const title = {
  fontSize: "1.6rem",
  marginBottom: "1.5rem",
};

const errorText = {
  color: "#f87171",
};

const emptyText = {
  color: "#94a3b8",
};

const tableWrapper = {
  overflowX: "auto",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  background: "#0f172a",
  borderRadius: "12px",
  overflow: "hidden",
};

const th = {
  padding: "12px",
  textAlign: "left",
  background: "#020617",
  fontSize: "0.85rem",
  color: "#94a3b8",
};

const td = {
  padding: "12px",
  borderBottom: "1px solid #1e293b",
  fontSize: "0.9rem",
};

const statusBadge = (status) => ({
  padding: "6px 12px",
  borderRadius: "999px",
  fontSize: "0.75rem",
  fontWeight: "bold",
  background:
    status === "pending"
      ? "#facc15"
      : status === "inProgress"
      ? "#38bdf8"
      : "#22c55e",
  color: "#020617",
});
