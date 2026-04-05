// orderRoutes.js — fixed

import express from "express";
import {
  getAllOrders,
  getMyOrders,
  getUserOrders,
  createOrder,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/all", protect, admin, getAllOrders);
router.get("/my", protect, getMyOrders);
router.get("/user", protect, getUserOrders);
router.post("/", protect, createOrder);
router.patch("/:id/status", protect, admin, updateOrderStatus); // ✅ was missing protect + admin
export default router;