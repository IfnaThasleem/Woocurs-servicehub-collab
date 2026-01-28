const Service = require("../models/Service");

// Create a new service (vendor/admin)
exports.createService = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    const service = await Service.create({
      name,
      description,
      price,
      category,
      vendor: req.user._id,
    });

    res.status(201).json({
      message: "Service created successfully",
      service,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all services (public)
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find()
      .populate("vendor", "name email role")
      .sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single service by ID
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate(
      "vendor",
      "name email role"
    );

    if (!service)
      return res.status(404).json({ message: "Service not found" });

    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a service (vendor/admin)
exports.updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service)
      return res.status(404).json({ message: "Service not found" });

    // Only vendor who owns it or admin can update
    if (service.vendor.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { name, description, price, category, available } = req.body;

    service.name = name || service.name;
    service.description = description || service.description;
    service.price = price !== undefined ? price : service.price;
    service.category = category || service.category;
    if (available !== undefined) service.available = available;

    const updatedService = await service.save();

    res.json({ message: "Service updated successfully", service: updatedService });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a service (vendor/admin)
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service)
      return res.status(404).json({ message: "Service not found" });

    // Only vendor who owns it or admin can delete
    if (service.vendor.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Service.deleteOne({ _id: service._id });

    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};