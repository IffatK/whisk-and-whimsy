import { pool } from "../db/db.js";
import { asyncHandler } from "../middleware/errorHandler.js";

// GET /api/categories
export const getCategories = asyncHandler(async (req, res) => {
  const result = await pool.query(
    "SELECT category_id, name, description, created_at FROM categories ORDER BY name ASC"
  );
  res.json(result.rows);
});

// POST /api/categories (Admin only)
export const addCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: "Category name is required" });

  const result = await pool.query(
    `INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *`,
    [name, description || null]
  );
  
  res.status(201).json(result.rows[0]);
});

// PATCH /api/categories/:id (Admin only)
export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const result = await pool.query(
    `UPDATE categories 
     SET name = COALESCE($1, name), description = COALESCE($2, description)
     WHERE category_id = $3
     RETURNING *`,
    [name || null, description || null, id]
  );

  if (result.rows.length === 0) return res.status(404).json({ error: "Category not found" });
  res.json(result.rows[0]);
});

// DELETE /api/categories/:id (Admin only)
export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const result = await pool.query(
    "DELETE FROM categories WHERE category_id = $1 RETURNING category_id",
    [id]
  );

  if (result.rows.length === 0) return res.status(404).json({ error: "Category not found" });
  res.json({ message: "Category deleted successfully" });
});
