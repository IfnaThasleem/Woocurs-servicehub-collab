const Order = require("../models/Order");
const Service = require("../models/Service");

// ================= DASHBOARD =================
exports.getVendorDashboard = async (req, res) => {
  try {
    const vendorId = req.user._id;

    const totalOrders = await Order.countDocuments({ vendor: vendorId });
    const completedOrders = await Order.countDocuments({ vendor: vendorId, status: "completed" });
    const earningsAgg = await Order.aggregate([
      { $match: { vendor: vendorId, status: "completed" } },
      { $group: { _id: null, total: { $sum: "$price" } } },
    ]);

    res.json({
      totalOrders,
      completedOrders,
      totalEarnings: earningsAgg[0]?.total || 0,
    });
  } catch (err) {
    console.error("Vendor dashboard error:", err);
    res.status(500).json({ message: "Vendor dashboard error" });
  }
};

// ================= ORDERS =================
exports.getVendorOrders = async (req, res) => {
  try {
    const orders = await Order.find({ vendor: req.user._id })
      .sort({ createdAt: -1 })
      .populate("service", "name price");
    res.json(orders);
  } catch (err) {
    console.error("Vendor orders error:", err);
    res.status(500).json({ message: "Failed to load vendor orders" });
  }
};

// ================= SERVICES =================
exports.getVendorServices = async (req, res) => {
  try {
    const services = await Service.find({ vendor: req.user._id }).sort({ createdAt: -1 });
    res.json(services);
  } catch (err) {
    console.error("Failed to load vendor services:", err);
    res.status(500).json({ message: "Failed to load vendor services" });
  }
};

exports.addVendorService = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    if (!name || !description || !price || !category)
      return res.status(400).json({ message: "All fields are required" });

    const service = await Service.create({
      name,
      description,
      price,
      category,
      vendor: req.user._id,
    });

    res.status(201).json({ message: "Service added successfully", service });
  } catch (err) {
    console.error("Add service error:", err);
    res.status(500).json({ message: "Failed to add service" });
  }
};

exports.updateVendorService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });
    if (service.vendor.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    Object.assign(service, req.body);
    await service.save();

    res.json({ message: "Service updated successfully", service });
  } catch (err) {
    console.error("Update service error:", err);
    res.status(500).json({ message: "Failed to update service" });
  }
};

exports.deleteVendorService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });
    if (service.vendor.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    await Service.deleteOne({ _id: service._id });
    res.json({ message: "Service deleted successfully" });
  } catch (err) {
    console.error("Delete service error:", err);
    res.status(500).json({ message: "Failed to delete service" });
  }
};
