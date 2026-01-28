const Order = require("../models/Order");
const Service = require("../models/Service");

// ========================
// Customer: Create Order
// ========================
exports.createOrder = async (req, res) => {
  try {
    const { serviceId, scheduledDate, notes } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ message: "Service not found" });

    const order = await Order.create({
      customer: req.user._id,
      service: service._id,
      vendor: service.vendor,
      totalPrice: service.price,
      scheduledDate,
      notes,
    });

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ========================
// Vendor: Get Orders by Vendor
// ========================
exports.getVendorOrders = async (req, res) => {
  try {
    const vendorId = req.user._id;

    const orders = await Order.find({ vendor: vendorId })
      .populate("customer", "name email")
      .populate("service", "name price category")
      .sort({ scheduledDate: 1 });

    const grouped = {
      pending: [],
      inProgress: [],
      completed: [],
    };

    orders.forEach(order => {
      grouped[order.status].push(order);
    });

    res.json(grouped);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ========================
// Customer: Get their own Orders
// ========================
exports.getCustomerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .populate("service", "name price category")
      .populate("vendor", "name email")
      .sort({ scheduledDate: 1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ========================
// Vendor/Admin: Update Order Status
// ========================
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Vendor can only update their own orders
    if (req.user.role === "vendor" && order.vendor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden: No permission" });
    }

    order.status = status || order.status;
    const updatedOrder = await order.save();

    res.json({
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ========================
// Admin: Get All Orders
// ========================
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer", "name email")
      .populate("vendor", "name email")
      .populate("service", "name price category")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
