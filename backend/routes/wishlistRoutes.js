// wishlistRoutes.js — fully fixed

import express from "express";
import { getWishlist, removeWishlistItem, addToWishlist } from "../controllers/wishlistController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/user", protect, getWishlist);
router.post("/", protect, addToWishlist);
router.delete("/:id", protect, removeWishlistItem); 

export default router;