const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["paid", "failed"],
      default: "paid",
    },
    method: {
      type: String,
      default: "demo",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
