const express = require("express");
const router = express.Router();

const {
  getVendorDashboard,
  getVendorOrders,
  getVendorServices,
  addVendorService,
  updateVendorService,
  deleteVendorService,
} = require("../controllers/vendorController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// ================= DASHBOARD =================
router.get("/dashboard", protect, authorizeRoles("vendor"), getVendorDashboard);

// ================= ORDERS =================
router.get("/orders", protect, authorizeRoles("vendor"), getVendorOrders);

// ================= SERVICES =================
// Get all services of the logged-in vendor
router.get("/services", protect, authorizeRoles("vendor"), getVendorServices);

// Add a new service
router.post("/services", protect, authorizeRoles("vendor"), addVendorService);

// Update a service by ID (owned by vendor)
router.put("/services/:id", protect, authorizeRoles("vendor"), updateVendorService);

// Delete a service by ID (owned by vendor)
router.delete("/services/:id", protect, authorizeRoles("vendor"), deleteVendorService);

module.exports = router;
