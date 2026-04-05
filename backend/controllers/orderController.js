// orderController.js — fixed to match actual DB schema

import { pool } from "../db/db.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const VALID_STATUSES = [
  "pending", "confirmed", "preparing",
  "out_for_delivery", "delivered", "cancelled",
];

// GET /api/orders/my
export const getMyOrders = asyncHandler(async (req, res) => {
  const user_id = req.user.user_id;

  const result = await pool.query(
    `SELECT id, total, status, pay_status, created_at
     FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,
    [user_id]
  );

  res.json(result.rows);
});

// GET /api/orders/user — what the frontend actually calls
export const getUserOrders = asyncHandler(async (req, res) => {
  const user_id = req.user.user_id;

  const result = await pool.query(
    // FIX: order_items uses `qty` not `quantity`, joined on order_id (text)
    `SELECT
       o.id,
       o.total,
       o.status,
       o.pay_status,
       o.pay_method,
       o.created_at AS date,
       COALESCE(
         json_agg(oi.name ORDER BY oi.id) FILTER (WHERE oi.name IS NOT NULL),
         '[]'
       ) AS items
     FROM orders o
     LEFT JOIN order_items oi ON o.id = oi.order_id
     WHERE o.user_id = $1
     GROUP BY o.id
     ORDER BY o.created_at DESC`,
    [user_id]
  );

  res.json({ data: result.rows });
});

// GET /api/orders/all — Admin
export const getAllOrders = asyncHandler(async (req, res) => {
  // FIX: users live in auth.users, not public.users
  const result = await pool.query(`
    SELECT o.*, u.email AS user_email
    FROM orders o
    LEFT JOIN auth.users u ON o.user_id = u.id
    ORDER BY o.created_at DESC
  `);
  res.json(result.rows);
});

// GET /api/orders/:id — order detail with items
export const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const orderRes = await pool.query(
    `SELECT
       o.id          AS order_id,
       o.total,
       o.status,
       o.pay_status,
       o.pay_method,
       o.customer    AS user_name,
       o.email       AS user_email,
       o.delivery_address,
       o.delivery_city,
       o.delivery_pincode,
       o.delivery_phone,
       o.created_at,
       o.updated_at
     FROM orders o
     WHERE o.id = $1`,
    [id]
  );

  if (orderRes.rows.length === 0)
    return res.status(404).json({ error: "Order not found" });

  // FIX: column is `qty` (not `quantity`) and `id` (uuid) in order_items
  const itemsRes = await pool.query(
    `SELECT
       oi.id            AS order_item_id,
       oi.qty           AS quantity,
       oi.price,
       oi.name,
       oi.product_id,
       p.image_url      AS product_image
     FROM order_items oi
     LEFT JOIN products p ON oi.product_id = p.product_id
     WHERE oi.order_id = $1
     ORDER BY oi.id`,
    [id]
  );

  res.json({ ...orderRes.rows[0], items: itemsRes.rows });
});

// POST /api/orders — called by Checkout.jsx
export const createOrder = asyncHandler(async (req, res) => {
  const client = await pool.connect();
  try {
    const {
      items,
      totalAmount,
      delivery_address,
      delivery_city,
      delivery_pincode,
      delivery_phone,
      customer,
      email,
      pay_method = "cod",
    } = req.body;

    const user_id = req.user.user_id;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "No items in order." });
    }

    // FIX: `customer` and `email` are NOT NULL — provide safe fallbacks
    const customerName  = customer?.trim()  || "Guest";
    const customerEmail = email?.trim()     || `guest_${Date.now()}@order.local`;

    await client.query("BEGIN");

    // FIX: orders.id is TEXT NOT NULL with no serial default, so we generate it
    const orderRes = await client.query(
      `INSERT INTO orders
         (id, user_id, customer, email, total, status, pay_status, pay_method,
          delivery_address, delivery_city, delivery_pincode, delivery_phone)
       VALUES (gen_random_uuid()::text, $1,$2,$3,$4,'pending','pending',$5,$6,$7,$8,$9)
       RETURNING id`,
      [
        user_id,
        customerName,
        customerEmail,
        totalAmount,
        pay_method,
        delivery_address ?? null,
        delivery_city    ?? null,
        delivery_pincode ?? null,
        delivery_phone   ?? null,
      ]
    );

    const order_id = orderRes.rows[0].id;

    for (const item of items) {
      // FIX: insert into `qty` not `quantity` — that's the actual column name
      await client.query(
        `INSERT INTO order_items (order_id, product_id, name, qty, price)
         VALUES ($1, $2, $3, $4, $5)`,
        [order_id, item.product_id, item.name ?? "", item.quantity, item.price]
      );
      await client.query(
        `UPDATE products SET stock_quantity = stock_quantity - $1 WHERE product_id = $2`,
        [item.quantity, item.product_id]
      );
    }

    await client.query("COMMIT");
    res.status(201).json({ message: "Order placed successfully", order_id });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("CREATE ORDER ERROR:", error.message, error.detail ?? "");
    // Return actual error so you can see it during development
    res.status(500).json({ error: error.message, detail: error.detail ?? null });
  } finally {
    client.release();
  }
});

// POST /api/orders/checkout — checkout directly from cart
export const checkoutCart = asyncHandler(async (req, res) => {
  const user_id = req.user.user_id;
  const {
    payment_method = "cod",
    delivery_address,
    delivery_city,
    delivery_pincode,
    delivery_phone,
    customer,
    email,
  } = req.body;

  const cartRes = await pool.query(
    `SELECT ci.product_id, ci.quantity, p.price, p.stock_quantity, p.name
     FROM cart_items ci
     JOIN cart c ON ci.cart_id = c.cart_id
     JOIN products p ON ci.product_id = p.product_id
     WHERE c.user_id = $1`,
    [user_id]
  );

  const items = cartRes.rows;
  if (items.length === 0)
    return res.status(400).json({ error: "Cart is empty" });

  let totalAmount = 0;
  for (const item of items) {
    if (item.stock_quantity < item.quantity) {
      return res.status(400).json({ error: `Insufficient stock for "${item.name}"` });
    }
    totalAmount += parseFloat(item.price) * item.quantity;
  }

  const customerName  = customer?.trim()  || "Guest";
  const customerEmail = email?.trim()     || `guest_${Date.now()}@order.local`;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const orderRes = await client.query(
      `INSERT INTO orders
         (id, user_id, customer, email, total, status, pay_status, pay_method,
          delivery_address, delivery_city, delivery_pincode, delivery_phone)
       VALUES (gen_random_uuid()::text, $1,$2,$3,$4,'pending','pending',$5,$6,$7,$8,$9)
       RETURNING id`,
      [
        user_id,
        customerName,
        customerEmail,
        totalAmount,
        payment_method,
        delivery_address ?? null,
        delivery_city    ?? null,
        delivery_pincode ?? null,
        delivery_phone   ?? null,
      ]
    );

    const order_id = orderRes.rows[0].id;

    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, name, qty, price)
         VALUES ($1, $2, $3, $4, $5)`,
        [order_id, item.product_id, item.name ?? "", item.quantity, item.price]
      );
      await client.query(
        `UPDATE products SET stock_quantity = stock_quantity - $1 WHERE product_id = $2`,
        [item.quantity, item.product_id]
      );
    }

    await client.query(
      `DELETE FROM cart_items WHERE cart_id = (SELECT cart_id FROM cart WHERE user_id = $1)`,
      [user_id]
    );

    await client.query("COMMIT");
    res.status(201).json({ message: "Order placed successfully!", order_id });
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
});

// PATCH /api/orders/:id/status — Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
    });
  }

  const result = await pool.query(
    "UPDATE orders SET status = $1 WHERE id = $2 RETURNING *",
    [status, id]
  );

  if (result.rows.length === 0)
    return res.status(404).json({ error: "Order not found" });

  res.json({ message: "Order status updated", order: result.rows[0] });
});

// PATCH /api/orders/:id/payment — Admin
// FIX: no separate payments table linked — pay_status lives directly on orders
export const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { payment_status } = req.body;

  const validPaymentStatuses = ["pending", "paid", "failed"];
  if (!validPaymentStatuses.includes(payment_status)) {
    return res.status(400).json({ error: "Invalid payment status" });
  }

  const result = await pool.query(
    `UPDATE orders SET pay_status = $1 WHERE id = $2 RETURNING *`,
    [payment_status, id]
  );

  if (result.rows.length === 0)
    return res.status(404).json({ error: "Order not found" });

  res.json(result.rows[0]);
});