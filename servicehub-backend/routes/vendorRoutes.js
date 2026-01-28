import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getVendorDashboard, getVendorOrders } from "../controllers/vendorController.js";

const router = express.Router();

router.get("/dashboard", protect, getVendorDashboard);
router.get("/orders", protect, getVendorOrders);

export default router;
