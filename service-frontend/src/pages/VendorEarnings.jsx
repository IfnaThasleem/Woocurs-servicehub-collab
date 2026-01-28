import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function VendorEarnings() {
  const [completedOrders, setCompletedOrders] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        const res = await axios.get(
          "http://localhost:5000/api/orders/vendororders",
          { headers }
        );

        // Only completed orders
        const completed = res.data.completed;
        setCompletedOrders(completed);

        // Sum total earnings
        const total = completed.reduce((acc, order) => acc + order.price, 0);
        setTotalEarnings(total);
      } catch (err) {
        console.error("Failed to load earnings:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, []);

  return (
    <div style={container}>
      <Navbar />
      <div style={content}>
        <h1>Vendor Earnings</h1>
        {loading ? (
          <p>Loading earnings...</p>
        ) : (
          <>
            <div style={earningCard}>
              <h2>Total Earnings</h2>
              <p style={{ fontSize: "2rem", fontWeight: "bold" }}>₹ {totalEarnings}</p>
            </div>

            <h2>Completed Orders</h2>
            {completedOrders.length === 0 ? (
              <p>No completed orders yet.</p>
            ) : (
              <table style={table}>
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Customer</th>
                    <th>Price</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {completedOrders.map((order) => (
                    <tr key={order._id}>
                      <td>{order.serviceName || order.service.name}</td>
                      <td>{order.customer.name}</td>
                      <td>₹ {order.price}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* =========================
   STYLES
========================= */
const container = { minHeight: "100vh", background: "#020617", color: "white" };
const content = { padding: "2rem" };

const earningCard = {
  background: "#0f172a",
  padding: "1.5rem",
  borderRadius: "14px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
  marginBottom: "2rem",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

table.th = {
  borderBottom: "1px solid #555",
  padding: "10px",
  textAlign: "left",
};

table.td = {
  borderBottom: "1px solid #555",
  padding: "10px",
};
