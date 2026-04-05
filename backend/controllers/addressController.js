import { pool } from "../db/db.js";
import { asyncHandler } from "../middleware/errorHandler.js";

// ── Helpers ───────────────────────────────────────────────────────────────────

const validateAddressFields = (fields) => {
  const { address_line, city, state, pincode } = fields;
  const errors = [];

  if (address_line !== undefined && address_line.trim().length === 0)
    errors.push("Address line cannot be empty.");
  if (city !== undefined && city.trim().length === 0)
    errors.push("City cannot be empty.");
  if (state !== undefined && state.trim().length === 0)
    errors.push("State cannot be empty.");
  if (pincode !== undefined && !/^\d{6}$/.test(pincode))
    errors.push("Pincode must be a 6-digit number.");

  return errors;
};

// ── Controllers ───────────────────────────────────────────────────────────────

// GET /api/address
export const getAddresses = asyncHandler(async (req, res) => {
  const { user_id } = req.user;

  const result = await pool.query(
    `SELECT id, address_line, city, state, pincode, is_default, created_at
     FROM addresses
     WHERE user_id = $1
     ORDER BY is_default DESC, created_at DESC`,
    [user_id]
  );

  res.json(result.rows);
});

// POST /api/address
export const addAddress = asyncHandler(async (req, res) => {
  const { user_id } = req.user;
  const { address_line, city, state, pincode, is_default = false } = req.body;

  // All fields required on create
  if (!address_line || !city || !state || !pincode) {
    return res.status(400).json({ error: "address_line, city, state, and pincode are required." });
  }

  const errors = validateAddressFields({ address_line, city, state, pincode });
  if (errors.length) return res.status(400).json({ errors });

  // Transaction: if setting as default, clear existing default first
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    if (is_default) {
      await client.query(
        "UPDATE addresses SET is_default = FALSE WHERE user_id = $1",
        [user_id]
      );
    }

    // If this is the user's first address, make it default automatically
    const count = await client.query(
      "SELECT COUNT(*) FROM addresses WHERE user_id = $1",
      [user_id]
    );
    const makeDefault = is_default || parseInt(count.rows[0].count) === 0;

    if (makeDefault && !is_default) {
      await client.query(
        "UPDATE addresses SET is_default = FALSE WHERE user_id = $1",
        [user_id]
      );
    }

    const result = await client.query(
      `INSERT INTO addresses (user_id, address_line, city, state, pincode, is_default)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [user_id, address_line.trim(), city.trim(), state.trim(), pincode, makeDefault]
    );

    await client.query("COMMIT");
    res.status(201).json(result.rows[0]);
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
});

// PATCH /api/address/:id
export const updateAddress = asyncHandler(async (req, res) => {
  const { user_id } = req.user;
  const { id } = req.params;
  const { address_line, city, state, pincode, is_default } = req.body;

  // Verify ownership
  const existing = await pool.query(
    "SELECT * FROM addresses WHERE id = $1 AND user_id = $2",
    [id, user_id]
  );
  if (existing.rows.length === 0) {
    return res.status(404).json({ error: "Address not found." });
  }

  const errors = validateAddressFields({ address_line, city, state, pincode });
  if (errors.length) return res.status(400).json({ errors });

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    if (is_default === true) {
      await client.query(
        "UPDATE addresses SET is_default = FALSE WHERE user_id = $1",
        [user_id]
      );
    }

    const result = await client.query(
      `UPDATE addresses
       SET address_line = COALESCE($1, address_line),
           city         = COALESCE($2, city),
           state        = COALESCE($3, state),
           pincode      = COALESCE($4, pincode),
           is_default   = COALESCE($5, is_default)
       WHERE id = $6 AND user_id = $7
       RETURNING *`,
      [
        address_line?.trim() || null,
        city?.trim() || null,
        state?.trim() || null,
        pincode || null,
        is_default ?? null,
        id,
        user_id,
      ]
    );

    await client.query("COMMIT");
    res.json(result.rows[0]);
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
});

// DELETE /api/address/:id
export const deleteAddress = asyncHandler(async (req, res) => {
  const { user_id } = req.user;
  const { id } = req.params;

  const result = await pool.query(
    "DELETE FROM addresses WHERE id = $1 AND user_id = $2 RETURNING id, is_default",
    [id, user_id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: "Address not found." });
  }

  // If deleted address was default, promote the most recent remaining address
  if (result.rows[0].is_default) {
    await pool.query(
      `UPDATE addresses SET is_default = TRUE
       WHERE id = (
         SELECT id FROM addresses WHERE user_id = $1
         ORDER BY created_at DESC LIMIT 1
       )`,
      [user_id]
    );
  }

  res.json({ message: "Address deleted successfully." });
});
