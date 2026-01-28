// backend/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Admin-only route
router.get("/", protect, authorizeRoles("admin"), getAllUsers);

// Logged-in user routes
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

module.exports = router;
