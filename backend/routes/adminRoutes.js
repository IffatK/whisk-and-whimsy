import express from "express";
import { 
  getDashboardStats,
  getAllReviews,
  deleteReviewAdmin,
  getReviewStats
} from "../controllers/adminController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// All admin routes require authentication + admin role
router.use(protect, admin);

// Dashboard stats
router.get("/stats", getDashboardStats);

// Review moderation
router.get("/reviews", getAllReviews);
router.get("/reviews/stats", getReviewStats);
router.delete("/reviews/:review_id", deleteReviewAdmin);

export default router;
