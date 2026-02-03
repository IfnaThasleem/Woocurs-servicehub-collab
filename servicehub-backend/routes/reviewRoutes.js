const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const Order = require("../models/Order");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// POST: add review
router.post("/", protect, authorizeRoles("user"), async (req, res) => {
  try {
    const { order, vendor, rating, comment } = req.body;

    // 1️⃣ Check order exists
    const orderDoc = await Order.findById(order);
    if (!orderDoc) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 2️⃣ Check payment is done
    if (orderDoc.status !== "completed" && orderDoc.paymentStatus !== "paid") {
      return res.status(400).json({ message: "You can only review after payment" });
    }

    // 3️⃣ Prevent duplicate review
    const existingReview = await Review.findOne({
      user: req.user._id,
      order,
    });
    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this order" });
    }

    // 4️⃣ Create review
    const review = await Review.create({
      user: req.user._id,
      vendor,
      order,
      rating,
      comment,
    });

    res.status(201).json({ message: "Review submitted", review });
  } catch (err) {
    console.error("Review error:", err);
    res.status(500).json({ message: "Failed to submit review" });
  }
});

module.exports = router;
