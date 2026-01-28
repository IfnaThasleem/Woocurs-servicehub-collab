import Order from "../models/Order.js";

// Get dashboard summary
export const getVendorDashboard = async (req, res) => {
  try {
    if (req.user.role !== "vendor") {
      return res.status(403).json({ message: "Access denied" });
    }

    const totalOrders = await Order.countDocuments({ vendor: req.user.id });
    const completedOrders = await Order.countDocuments({ vendor: req.user.id, status: "completed" });

    const earnings = await Order.aggregate([
      { $match: { vendor: req.user.id, status: "completed" } },
      { $group: { _id: null, total: { $sum: "$price" } } },
    ]);

    res.json({ totalOrders, completedOrders, totalEarnings: earnings[0]?.total || 0 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Vendor dashboard error" });
  }
};

// Get all orders for vendor
export const getVendorOrders = async (req, res) => {
  try {
    const orders = await Order.find({ vendor: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load orders" });
  }
};
