// controllers/authController.js

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Helper function: generate JWT
const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// ---------------------- REGISTER USER ----------------------
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // Exclude password in response
    const { password: pwd, ...userData } = user._doc;

    res.status(201).json({
      message: "User registered successfully",
      user: userData,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------------- LOGIN USER ----------------------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // 🚫 Vendor approval check
    if (user.role === "vendor" && !user.isApproved) {
      return res.status(403).json({
        message: "Vendor account pending admin approval",
      });
    }

    const { password: pwd, ...userData } = user._doc;
    const token = generateToken(user._id, user.role);

     // ===== REAL-TIME VENDOR LOGIN NOTIFICATION =====
    if (user.role === "vendor" && req.app.get("io")) {
      const io = req.app.get("io");
      io.emit("newVendorLogin", { _id: user._id, name: user.name });
    }

    res.status(200).json({
      message: "Login successful",
      user: userData,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


