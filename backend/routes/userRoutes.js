import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
  updateMe,
  getAllUsers,
  toggleBlockUser,
  deleteUser,


} from "../controllers/userController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ───── AUTH ─────
router.post("/register", registerUser);
router.post("/login", loginUser);

// ───── USER ─────
router.get("/profile", protect, getMe);
router.patch("/profile", protect, updateMe);

// ───── ADMIN ─────
router.get("/all", protect, admin, getAllUsers);
router.patch("/:id/block", protect, admin, toggleBlockUser);
router.delete("/:id", protect, admin, deleteUser);

export default router;