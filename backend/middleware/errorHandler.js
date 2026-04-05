export const errorHandler = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ERROR:`, err.stack);

  // Postgres unique violation
  if (err.code === "23505") {
    return res.status(409).json({ error: "A record with this value already exists." });
  }

  // Postgres foreign key violation
  if (err.code === "23503") {
    return res.status(400).json({ error: "Referenced record does not exist." });
  }

  // Postgres not null violation
  if (err.code === "23502") {
    return res.status(400).json({ error: `Field '${err.column}' is required.` });
  }

  const status = err.status || err.statusCode || 500;
  const message =
    process.env.NODE_ENV === "production"
      ? status === 500
        ? "Internal server error"
        : err.message
      : err.message;

  res.status(status).json({ error: message });
};

// Wrap async route handlers to forward errors to errorHandler
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};