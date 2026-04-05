import { pool } from "../db/db.js";
import { asyncHandler } from "../middleware/errorHandler.js";

// GET /api/products
export const getProducts = asyncHandler(async (req, res) => {
  const { category, search, sort = "product_id", order = "ASC", page = 1, limit = 20 } = req.query;

  const allowedSort = ["product_id", "name", "price", "stock_quantity"];
  const allowedOrder = ["ASC", "DESC"];

  const sortCol = allowedSort.includes(sort) ? sort : "product_id";
  const sortOrder = allowedOrder.includes(order.toUpperCase()) ? order.toUpperCase() : "ASC";

  const offset = (parseInt(page) - 1) * parseInt(limit);
  const values = [];
  const conditions = [];

  if (category && category !== "All") {
    values.push(category);
    // Join category name to fetch, or use category_id
    conditions.push(`c.name = $${values.length}`);
  }

  if (search) {
    values.push(`%${search}%`);
    conditions.push(`(p.name ILIKE $${values.length} OR p.description ILIKE $${values.length})`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  // Count total for pagination
  const countResult = await pool.query(
    `SELECT COUNT(*) FROM products p LEFT JOIN categories c ON p.category_id = c.category_id ${where}`,
    values
  );
  const total = parseInt(countResult.rows[0].count);

  values.push(parseInt(limit));
  values.push(offset);

const result = await pool.query(
  `
  SELECT 
    p.product_id,
    p.name,
    p.description,
    p.price,
    p.image_url AS image,
    c.name AS category
  FROM products p
  LEFT JOIN categories c ON p.category_id = c.category_id
  ${where}
  ORDER BY ${sortCol} ${sortOrder}
  LIMIT $${values.length - 1}
  OFFSET $${values.length}
  `,
  values
);

  res.json({
    data: result.rows,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    },
  });
});

// GET /api/product/:id
export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    `SELECT 
       p.product_id, 
       p.name, 
       c.name AS category,
       p.category_id,
       p.price, 
       p.stock_quantity, 
       p.description, 
       p.image_url AS image,
       p.is_available 
     FROM products p
     LEFT JOIN categories c ON p.category_id = c.category_id
     WHERE p.product_id = $1`,
    [id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: "Product not found." });
  }

  res.json(result.rows[0]);
});

// POST /api/product (Admin only)
export const addProduct = asyncHandler(async (req, res) => {
 const { name, category, price, stock_quantity, description, image } = req.body;

  // Find category_id by category name
  let category_id = null;
  if (category) {
    const catRes = await pool.query("SELECT category_id FROM categories WHERE name = $1", [category]);
    if (catRes.rows.length > 0) category_id = catRes.rows[0].category_id;
  }

  const result = await pool.query(
    `INSERT INTO products (name, category_id, price, stock_quantity, description, image_url)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
  [name, category_id, price, stock_quantity, description || null, image || null]
  );

  res.status(201).json(result.rows[0]);
});

// PATCH /api/product/:id (Admin only)
export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { product_name, category, price, stock_quantity, description, image } = req.body;

  let category_id = req.body.category_id;
  if (category && !category_id) {
    const catRes = await pool.query("SELECT category_id FROM categories WHERE name = $1", [category]);
    if (catRes.rows.length > 0) category_id = catRes.rows[0].category_id;
  }

  const existing = await pool.query("SELECT * FROM products WHERE product_id = $1", [id]);
  if (existing.rows.length === 0) {
    return res.status(404).json({ error: "Product not found." });
  }

  const nameVal = product_name || req.body.name;

  const result = await pool.query(
    `UPDATE products
     SET name            = COALESCE($1, name),
         category_id     = COALESCE($2, category_id),
         price           = COALESCE($3, price),
         stock_quantity  = COALESCE($4, stock_quantity),
         description     = COALESCE($5, description),
         image_url       = COALESCE($6, image_url)
     WHERE product_id = $7
     RETURNING *`,
    [nameVal, category_id, price, stock_quantity, description, image, id]
  );

  res.json(result.rows[0]);
});

// DELETE /api/products/:id (Admin only)
export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    "DELETE FROM products WHERE product_id = $1 RETURNING product_id",
    [id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: "Product not found." });
  }

  res.json({ message: "Product deleted successfully." });
});

// PATCH /api/products/:id/availability (Admin only)
export const toggleAvailability = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    `UPDATE products
     SET is_available = NOT is_available
     WHERE product_id = $1
     RETURNING product_id, name, is_available, stock_quantity`,
    [id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: "Product not found." });
  }

  const p = result.rows[0];
  res.json({ message: `Product ${p.is_available ? 'marked available' : 'marked unavailable'}.`, product: p });
});