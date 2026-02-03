// backend/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");

const {
  getAllUsers,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

/* ================= ADMIN ================= */

// Get all users
router.get("/", protect, authorizeRoles("admin"), getAllUsers);

// Approve / Suspend vendor
router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user)
        return res.status(404).json({ message: "User not found" });

      if (user.role !== "vendor")
        return res
          .status(400)
          .json({ message: "Only vendors can be approved" });

      user.isApproved = req.body.isApproved;
      await user.save();

      res.json(user);
    } catch (err) {
      res.status(500).json({ message: "Failed to update vendor status" });
    }
  }
);

/* ================= USER ================= */

// Logged-in user profile
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

module.exports = router;
