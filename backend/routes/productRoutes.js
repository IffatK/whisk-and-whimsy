import express from "express";
import {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  toggleAvailability,
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);

router.post("/", protect, admin, addProduct);
router.patch("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);
router.patch("/:id/availability", protect, admin, toggleAvailability);

export default router;