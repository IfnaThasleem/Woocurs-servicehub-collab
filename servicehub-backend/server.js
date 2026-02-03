const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());

/* ================= DATABASE ================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB error:", err.message);
    process.exit(1);
  });

/* ================= ROUTES ================= */
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const userDashboardRoutes = require("./routes/userDashboardRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const orderRoutes = require("./routes/orderRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/users", userDashboardRoutes); // dashboard + profile
app.use("/api/services", serviceRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/payments", paymentRoutes);

/* ================= SOCKET.IO SETUP ================= */
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }, // adjust for frontend origin
});

// Attach io to app so routes/controllers can emit events
app.set("io", io);

io.on("connection", (socket) => {
  console.log("A client connected:", socket.id);

  // Listen for vendor login event from client
  socket.on("vendorLogin", (vendor) => {
    console.log("Vendor logged in:", vendor.name);
    io.emit("newVendorLogin", vendor); // broadcast to all admins
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

/* ================= ROOT ================= */
app.get("/", (req, res) => {
  res.send("ServiceHub API Running 🚀");
});

/* ================= 404 ================= */
app.use((req, res) => {
  res.status(404).json({ message: "API route not found" });
});

/* ================= SERVER ================= */
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
