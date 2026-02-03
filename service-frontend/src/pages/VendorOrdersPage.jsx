import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!token || !user?._id) return;

    const headers = { Authorization: `Bearer ${token}` };
    setLoading(true);

    try {
      const res = await axios.get("http://localhost:5000/api/orders", { headers });
      
      // Adjust according to your backend structure
      const vendorId = user._id;
      const vendorOrders = res.data.filter(
        (o) => o.service?.vendor === vendorId || o.service?.vendor?._id === vendorId
      );

      setOrders(vendorOrders);
    } catch (err) {
      console.error("Fetch orders error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const acceptOrder = async (order) => {
    if (!order.service.available) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };

    try {
      await axios.put(
        `http://localhost:5000/api/orders/${order._id}`,
        { status: "inProgress" },
        { headers }
      );
      fetchOrders();
    } catch (err) {
      console.error("Accept order error:", err.response?.data || err.message);
    }
  };

  if (loading) return <p style={{ padding: "2rem", color: "white" }}>Loading orders...</p>;

  return (
    <div style={{ minHeight: "100vh", background: "#020617", color: "white", padding: "2rem" }}>
      <Navbar role="vendor" />
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            style={{ background: "#0f172a", padding: "1rem", borderRadius: "10px", marginBottom: "1rem" }}
          >
            <b>{order.service.name}</b>
            <p>Customer: {order.customer.name}</p>
            <p>Status: {order.status}</p>
            {order.status === "pending" && order.service.available && (
              <button
                style={{ background: "#4f7cff", color: "white", padding: "6px 10px", border: "none", marginTop: "5px" }}
                onClick={() => acceptOrder(order)}
              >
                Accept
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
