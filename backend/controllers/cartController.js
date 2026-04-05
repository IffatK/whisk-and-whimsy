import { pool } from "../db/db.js";
import { asyncHandler } from "../middleware/errorHandler.js";

// Helper: Ensure cart exists for user
const getOrCreateCart = async (user_id) => {
  const result = await pool.query("SELECT cart_id FROM cart WHERE user_id = $1", [user_id]);
  if (result.rows.length > 0) return result.rows[0].cart_id;
  
  const newCart = await pool.query(
    "INSERT INTO cart (user_id) VALUES ($1) RETURNING cart_id",
    [user_id]
  );
  return newCart.rows[0].cart_id;
};

// GET /api/cart  (protected)
export const getCart = asyncHandler(async (req, res) => {
  const user_id = req.user.user_id;

  const result = await pool.query(
    `SELECT
       ci.cart_item_id as id,
       c.cart_id,
       p.product_id,
       p.name,
       p.price,
       p.image_url AS image,
       ci.quantity,
       (p.price * ci.quantity) AS subtotal
     FROM cart c
     JOIN cart_items ci ON c.cart_id = ci.cart_id
     JOIN products p ON ci.product_id = p.product_id
     WHERE c.user_id = $1
     ORDER BY ci.created_at DESC`,
    [user_id]
  );

  const items = result.rows;
  const total = items.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);

  res.json({ items, total: total.toFixed(2) });
});

// POST /api/cart  (protected) — add or increment item
export const addToCart = asyncHandler(async (req, res) => {
  const user_id = req.user.user_id;
  const { product_id, quantity } = req.body;

  const cart_id = await getOrCreateCart(user_id);

  // Check product exists and has stock
  const product = await pool.query("SELECT product_id, stock_quantity FROM products WHERE product_id = $1", [product_id]);
  if (product.rows.length === 0) return res.status(404).json({ error: "Product not found." });
  
  if (product.rows[0].stock_quantity < quantity) return res.status(400).json({ error: "Insufficient stock." });

  // Upsert: if item already in cart_items, increment quantity
  const result = await pool.query(
    `INSERT INTO cart_items (cart_id, product_id, quantity)
     VALUES ($1, $2, $3)
     ON CONFLICT (cart_id, product_id)
     DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
     RETURNING *`,
    [cart_id, product_id, quantity]
  );

  res.status(201).json(result.rows[0]);
});

// PATCH /api/cart/:cart_item_id  (protected) — set exact quantity
export const updateCartItem = asyncHandler(async (req, res) => {
  const user_id = req.user.user_id;
  const { cart_item_id } = req.params;
  const { quantity } = req.body;

  if (!Number.isInteger(quantity) || quantity < 1) return res.status(400).json({ error: "Quantity must be a positive integer." });

  const cart_id = await getOrCreateCart(user_id);

  const result = await pool.query(
    `UPDATE cart_items SET quantity = $1
     WHERE cart_item_id = $2 AND cart_id = $3
     RETURNING *`,
    [quantity, cart_item_id, cart_id]
  );

  if (result.rows.length === 0) return res.status(404).json({ error: "Cart item not found." });
  res.json(result.rows[0]);
});

// DELETE /api/cart/:cart_item_id  (protected)
export const removeFromCart = asyncHandler(async (req, res) => {
  const user_id = req.user.user_id;
  const { cart_item_id } = req.params;

  const cart_id = await getOrCreateCart(user_id);

  const result = await pool.query(
    "DELETE FROM cart_items WHERE cart_item_id = $1 AND cart_id = $2 RETURNING cart_item_id",
    [cart_item_id, cart_id]
  );

  if (result.rows.length === 0) return res.status(404).json({ error: "Cart item not found." });
  res.json({ message: "Item removed from cart." });
});

// DELETE /api/cart  (protected) — clear entire cart
export const clearCart = asyncHandler(async (req, res) => {
  const user_id = req.user.user_id;
  const cart_id = await getOrCreateCart(user_id);

  await pool.query("DELETE FROM cart_items WHERE cart_id = $1", [cart_id]);
  res.json({ message: "Cart cleared." });
});