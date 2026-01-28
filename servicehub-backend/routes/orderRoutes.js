const express = require("express");
const router = express.Router();
const {
  createOrder,
  getVendorOrders,
  getCustomerOrders,
  updateOrderStatus,
  getAllOrders
} = require("../controllers/orderController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Customer routes
router.post("/", protect, authorizeRoles("user"), createOrder);
router.get("/customerorders", protect, authorizeRoles("user"), getCustomerOrders);

// Vendor routes
router.get("/vendororders", protect, authorizeRoles("vendor"), getVendorOrders);
router.put("/:id/status", protect, authorizeRoles("vendor", "admin"), updateOrderStatus);

// Admin route
router.get("/", protect, authorizeRoles("admin"), getAllOrders);

module.exports = router;
