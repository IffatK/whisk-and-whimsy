// wishlistController.js — fixed

import { pool } from "../db/db.js";
import { asyncHandler } from "../middleware/errorHandler.js";

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/wishlist/user
// FIX: was aliasing wishlist_id AS id — frontend now uses wishlist_id directly
// ─────────────────────────────────────────────────────────────────────────────
export const getWishlist = asyncHandler(async (req, res) => {
  const result = await pool.query(
    `SELECT
       w.wishlist_id,
       p.product_id,
       p.name,
       p.price,
       p.image_url AS image,
       p.description,
       w.created_at
     FROM wishlist w
     JOIN products p ON w.product_id = p.product_id
     WHERE w.user_id = $1
     ORDER BY w.created_at DESC`,
    [req.user.user_id]
  );

  res.json({ data: result.rows });
});

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/wishlist/:id
// :id is wishlist_id — scoped to user_id for safety
// ─────────────────────────────────────────────────────────────────────────────
export const removeWishlistItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.user_id;

  const result = await pool.query(
    `DELETE FROM wishlist
     WHERE wishlist_id = $1 AND user_id = $2
     RETURNING wishlist_id`,
    [id, user_id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: "Wishlist item not found." });
  }

  res.json({ message: "Item removed from wishlist." });
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/wishlist
// ─────────────────────────────────────────────────────────────────────────────
export const addToWishlist = asyncHandler(async (req, res) => {
  const { product_id } = req.body;
  const user_id = req.user.user_id;

  if (!product_id) {
    return res.status(400).json({ error: "product_id is required." });
  }

  // Verify product exists
  const productCheck = await pool.query(
    "SELECT product_id FROM products WHERE product_id = $1",
    [product_id]
  );
  if (productCheck.rows.length === 0) {
    return res.status(404).json({ error: "Product not found." });
  }

  const result = await pool.query(
    `INSERT INTO wishlist (user_id, product_id)
     VALUES ($1, $2)
     ON CONFLICT (user_id, product_id) DO NOTHING
     RETURNING wishlist_id`,
    [user_id, product_id]
  );

  if (result.rows.length === 0) {
    return res.status(409).json({ message: "Item already in wishlist." });
  }

  res.status(201).json({
    message: "Added to wishlist.",
    wishlist_id: result.rows[0].wishlist_id,
  });
});