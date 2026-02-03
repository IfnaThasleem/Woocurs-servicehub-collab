const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");

// POST: Demo payment
router.post("/", protect, async (req, res) => {
  try {
    const { orderId, amount, status } = req.body;

    // Save payment
    const payment = await Payment.create({
      user: req.user._id,
      order: orderId || null,
      amount: amount || 5000,
      status: status || "paid",
    });

    // Update order status if order exists
    if (orderId) {
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "paid",
        status: "confirmed",
      });
    }

    res.status(201).json({
      message: "Payment successful",
      payment,
    });
  } catch (err) {
    console.error("Payment error:", err);
    res.status(500).json({ message: "Payment failed" });
  }
});

module.exports = router;
