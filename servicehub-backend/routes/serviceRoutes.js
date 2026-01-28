const express = require("express");
const router = express.Router();
const {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
} = require("../controllers/serviceController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Public route
router.get("/", getAllServices);
router.get("/:id", getServiceById);

// Protected routes (vendor/admin)
router.post("/", protect, authorizeRoles("vendor", "admin"), createService);
router.put("/:id", protect, authorizeRoles("vendor", "admin"), updateService);
router.delete("/:id", protect, authorizeRoles("vendor", "admin"), deleteService);

module.exports = router;
