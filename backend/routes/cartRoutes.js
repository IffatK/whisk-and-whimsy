import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";
import { addToCartRules, validate } from "../middleware/validators.js";

const router = express.Router();

// All cart routes require authentication
router.use(protect);

router.get("/", getCart);
router.post("/", addToCartRules, validate, addToCart);
router.patch("/:cart_item_id", updateCartItem);
router.delete("/:cart_item_id", removeFromCart);
router.delete("/", clearCart);

export default router;