import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { addToCartRules, validate } from "../middleware/validators.js";

const router = express.Router();

// All cart routes require authentication
router.use(authenticate);

router.get("/cart", getCart);
router.post("/cart", addToCartRules, validate, addToCart);
router.patch("/cart/:cart_id", updateCartItem);
router.delete("/cart/:cart_id", removeFromCart);
router.delete("/cart", clearCart);

export default router;