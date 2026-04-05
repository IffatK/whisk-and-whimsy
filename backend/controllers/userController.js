// userController.js

import jwt from "jsonwebtoken";
import { pool } from "../db/db.js";
import bcrypt from "bcrypt";
import { asyncHandler } from "../middleware/errorHandler.js";

// ── Helpers ───────────────────────────────────────────────────────────────────

function sanitiseUser(row) {
  return {
    id:         row.user_id ?? row.id,
    name:       row.name       ?? null,
    email:      row.email      ?? null,
    phone:      row.phone      ?? null,
    address:    row.address    ?? null,
    avatar_url: row.avatar_url ?? null,
    role:       row.role       ?? "user",
    created_at: row.created_at ?? null,
  };
}

function validateUpdatePayload(body) {
  const errors = [];

  if (body.name !== undefined) {
    if (typeof body.name !== "string" || body.name.trim().length === 0)
      errors.push("name must be a non-empty string.");
    if (body.name.trim().length > 100)
      errors.push("name must be 100 characters or fewer.");
  }

  if (body.phone !== undefined) {
    if (typeof body.phone !== "string")
      errors.push("phone must be a string.");
    else if (body.phone.trim().length > 0 && !/^\+?[\d\s\-]{7,20}$/.test(body.phone.trim()))
      errors.push("phone must be a valid phone number (7–20 digits).");
  }

  if (body.address !== undefined) {
    if (typeof body.address !== "string")
      errors.push("address must be a string.");
    if (body.address.length > 300)
      errors.push("address must be 300 characters or fewer.");
  }

  if (body.avatar_url !== undefined && body.avatar_url !== null) {
    if (typeof body.avatar_url !== "string" || body.avatar_url.trim().length === 0)
      errors.push("avatar_url must be a non-empty string or null.");
  }

  return { valid: errors.length === 0, errors };
}

// ── Controllers ───────────────────────────────────────────────────────────────

// GET /api/user/profile
export const getMe = asyncHandler(async (req, res) => {
  const userId = req.user.user_id;

  const result = await pool.query(
    `SELECT
       id                              AS user_id,
       email,
       raw_user_meta_data->>'name'       AS name,
       phone,
       raw_user_meta_data->>'avatar_url' AS avatar_url,
       raw_user_meta_data->>'address'    AS address,
       raw_app_meta_data->>'role'        AS role,
       created_at
     FROM auth.users
     WHERE id = $1`,
    [userId]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ success: false, message: "User not found." });
  }

  return res.status(200).json({ success: true, data: sanitiseUser(result.rows[0]) });
});

// PATCH /api/user/profile
export const updateMe = asyncHandler(async (req, res) => {
  const userId = req.user.user_id;

  if (req.body.email !== undefined) {
    return res.status(400).json({ success: false, message: "Email cannot be updated here." });
  }

  const { valid, errors } = validateUpdatePayload(req.body);
  if (!valid) {
    return res.status(400).json({ success: false, message: "Validation failed.", errors });
  }

  const allowedFields = ["name", "phone", "address", "avatar_url"];
  const updates = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = typeof req.body[field] === "string"
        ? req.body[field].trim()
        : req.body[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ success: false, message: "No valid fields provided." });
  }

  // name, address, avatar_url → raw_user_meta_data (jsonb)
  // phone → direct column
  const metaFields = ["name", "address", "avatar_url"];
  const metaUpdates = {};
  const directUpdates = {};

  for (const [k, v] of Object.entries(updates)) {
    if (metaFields.includes(k)) metaUpdates[k] = v;
    else directUpdates[k] = v;
  }

  const returning = `
    RETURNING
      id                              AS user_id,
      email,
      phone,
      raw_user_meta_data->>'name'       AS name,
      raw_user_meta_data->>'avatar_url' AS avatar_url,
      raw_user_meta_data->>'address'    AS address,
      raw_app_meta_data->>'role'        AS role,
      created_at
  `;

  let query, values;
  const hasMeta   = Object.keys(metaUpdates).length > 0;
  const hasDirect = Object.keys(directUpdates).length > 0;

  if (hasMeta && hasDirect) {
    query  = `UPDATE auth.users SET raw_user_meta_data = raw_user_meta_data || $1::jsonb, phone = $2 WHERE id = $3 ${returning}`;
    values = [JSON.stringify(metaUpdates), directUpdates.phone, userId];
  } else if (hasMeta) {
    query  = `UPDATE auth.users SET raw_user_meta_data = raw_user_meta_data || $1::jsonb WHERE id = $2 ${returning}`;
    values = [JSON.stringify(metaUpdates), userId];
  } else {
    query  = `UPDATE auth.users SET phone = $1 WHERE id = $2 ${returning}`;
    values = [directUpdates.phone, userId];
  }

  const result = await pool.query(query, values);

  if (result.rows.length === 0) {
    return res.status(404).json({ success: false, message: "User not found." });
  }

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully.",
    data: sanitiseUser(result.rows[0]),
  });
});

// GET /api/user/all — Admin
export const getAllUsers = asyncHandler(async (req, res) => {
  const result = await pool.query(`
    SELECT
      id                            AS user_id,
      email,
      raw_user_meta_data->>'name'   AS name,
      raw_app_meta_data->>'role'    AS role,
      created_at
    FROM auth.users
    ORDER BY created_at DESC
  `);
  res.json(result.rows);
});

// POST /api/user/register
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "name, email, and password are required." });
  }

  // Check duplicate in auth.users
  const existing = await pool.query(
    "SELECT id FROM auth.users WHERE email = $1",
    [email]
  );
  if (existing.rows.length > 0) {
    return res.status(409).json({ message: "An account with this email already exists." });
  }

  const hashed = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO auth.users (id, email, encrypted_password, raw_user_meta_data, raw_app_meta_data, aud, role)
     VALUES (gen_random_uuid(), $1, $2, $3::jsonb, '{"role":"user"}'::jsonb, 'authenticated', 'authenticated')
     RETURNING id, email, raw_user_meta_data->>'name' AS name, created_at`,
    [email, hashed, JSON.stringify({ name })]
  );

  const user = result.rows[0];

  // ✅ Create matching profiles row — required by FK on orders.user_id
  await pool.query(
    `INSERT INTO profiles (id, name, email)
     VALUES ($1, $2, $3)
     ON CONFLICT (id) DO NOTHING`,
    [user.id, name, email]
  );

  const token = jwt.sign(
    { user_id: user.id, role: "user", email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.status(201).json({
    token,
    user: sanitiseUser({ ...user, user_id: user.id, role: "user" }),
  });
});

// POST /api/user/login
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const result = await pool.query(
    `SELECT
       id                           AS user_id,
       email,
       encrypted_password           AS password,
       phone,
       raw_user_meta_data->>'name'    AS name,
       raw_user_meta_data->>'address' AS address,
       raw_user_meta_data->>'avatar_url' AS avatar_url,
       raw_app_meta_data->>'role'    AS role,
       created_at
     FROM auth.users
     WHERE email = $1`,
    [email]
  );

  if (result.rows.length === 0) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const user = result.rows[0];
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const token = jwt.sign(
    { user_id: user.user_id, role: user.role ?? "user", email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token, user: sanitiseUser(user) });
});

// DELETE /api/user/:id — Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    "DELETE FROM auth.users WHERE id = $1 RETURNING id",
    [id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: "User not found." });
  }

  res.json({ message: "User deleted successfully." });
});

// PATCH /api/user/:id/block — Admin
export const toggleBlockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    `UPDATE auth.users
     SET raw_app_meta_data = 
       CASE 
         WHEN raw_app_meta_data->>'is_blocked' = 'true'
         THEN raw_app_meta_data || '{"is_blocked": false}'::jsonb
         ELSE raw_app_meta_data || '{"is_blocked": true}'::jsonb
       END
     WHERE id = $1
     RETURNING id, email, raw_app_meta_data->>'is_blocked' AS is_blocked`,
    [id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: "User not found." });
  }

  const blocked = result.rows[0].is_blocked === "true";
  res.json({ message: `User ${blocked ? "blocked" : "unblocked"} successfully.`, ...result.rows[0] });
});