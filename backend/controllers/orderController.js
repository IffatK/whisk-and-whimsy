import { pool } from "../db/db.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const VALID_STATUSES = [
  "pending", "confirmed", "preparing",
  "out_for_delivery", "delivered", "cancelled",
];


// ✅ COMMON QUERY (reuse logic mentally everywhere)
const ORDER_SELECT = `
SELECT
  o.id,
  o.total,
  o.status,
  o.pay_status,
  o.pay_method,
  o.created_at AS date,

  json_build_object(
    'name', o.customer,
    'email', o.email
  ) AS customer,

  COALESCE(
    json_agg(
      json_build_object(
        'product_id', oi.product_id,
        'name', oi.name,
        'price', oi.price,
        'quantity', oi.qty,
        'image', p.image_url
      )
      ORDER BY oi.id
    ) FILTER (WHERE oi.product_id IS NOT NULL),
    '[]'
  ) AS items

FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
LEFT JOIN products p ON oi.product_id = p.product_id
`;


// =========================
// ✅ GET USER ORDERS
// =========================
export const getUserOrders = asyncHandler(async (req, res) => {
  const user_id = req.user.user_id;

  const result = await pool.query(
    `${ORDER_SELECT}
     WHERE o.user_id = $1
     GROUP BY o.id
     ORDER BY o.created_at DESC`,
    [user_id]
  );

  res.json({ data: result.rows });
});


// =========================
// ✅ GET ALL ORDERS (ADMIN)
// =========================
export const getAllOrders = asyncHandler(async (req, res) => {
  const result = await pool.query(
    `${ORDER_SELECT}
     GROUP BY o.id
     ORDER BY o.created_at DESC`
  );

  res.json({ data: result.rows });
});


// =========================
// ✅ GET SINGLE ORDER
// =========================
export const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    `${ORDER_SELECT}
     WHERE o.id = $1
     GROUP BY o.id`,
    [id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: "Order not found" });
  }

  res.json(result.rows[0]);
});


// =========================
// ✅ CREATE ORDER
// =========================
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

    const customerName = customer?.trim() || "Guest";
    const customerEmail = email?.trim() || `guest_${Date.now()}@order.local`;

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
        pay_method,
        delivery_address ?? null,
        delivery_city ?? null,
        delivery_pincode ?? null,
        delivery_phone ?? null,
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
        `UPDATE products
         SET stock_quantity = stock_quantity - $1
         WHERE product_id = $2`,
        [item.quantity, item.product_id]
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      message: "Order placed successfully",
      order_id
    });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("CREATE ORDER ERROR:", error.message);
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});


// =========================
// ✅ UPDATE ORDER STATUS
// =========================
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
      received: status,
    });
  }

  const result = await pool.query(
    "UPDATE orders SET status = $1 WHERE id = $2 RETURNING *",
    [status, id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: "Order not found" });
  }

  res.json({ data: result.rows[0] });
});


// =========================
// ✅ UPDATE PAYMENT STATUS
// =========================
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

  if (result.rows.length === 0) {
    return res.status(404).json({ error: "Order not found" });
  }

  res.json({ data: result.rows[0] });
});
// GET /api/orders/pending-count (Admin)
export const getPendingCount = asyncHandler(async (req, res) => {
  const result = await pool.query(
    "SELECT COUNT(*) FROM orders WHERE status = 'pending'"
  );
  res.json({ count: parseInt(result.rows[0].count) });
});