const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    scheduledDate: {
      type: Date,
      required: true,
    },

    /* ===== ORDER STATUS ===== */
    status: {
      type: String,
      enum: ["pending", "inProgress", "completed", "cancelled"],
      default: "pending",
    },

    /* ===== PAYMENT STATUS ===== */
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },

    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
