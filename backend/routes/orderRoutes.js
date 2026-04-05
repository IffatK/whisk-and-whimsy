// orderRoutes.js — fixed

import express from "express";
import {
  // getAllOrders,
  // getMyOrders,
  getPendingCount,
  getUserOrders,
  createOrder,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import { getAllOrders } from "../controllers/orderController.js";
const router = express.Router();

// router.get("/all", protect, admin, getAllOrders);
// router.get("/my", protect, getMyOrders);
router.get("/all", protect, admin, getAllOrders);
router.get("/user", protect, getUserOrders);
router.post("/", protect, createOrder);
router.patch("/:id/status", protect, admin, updateOrderStatus); // ✅ was missing protect + admin
router.get("/pending-count", protect, admin, getPendingCount);

export default router;