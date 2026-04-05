import { pool } from "../db/db.js";
import { asyncHandler } from "../middleware/errorHandler.js";

// GET /api/admin/stats
// Returns everything the dashboard needs in a single efficient query
export const getDashboardStats = asyncHandler(async (req, res) => {
  // Run all queries in parallel for speed
  const [
    orderStats,
    revenueStats,
    userCount,
    recentOrders,
    topProducts,
    dailyRevenue,
    orderStatusBreakdown,
    paymentStats,
  ] = await Promise.all([
    // Order counts by status
    pool.query(`
      SELECT
        COUNT(*) AS total_orders,
        COUNT(*) FILTER (WHERE status = 'pending')           AS pending,
        COUNT(*) FILTER (WHERE status = 'confirmed')         AS confirmed,
        COUNT(*) FILTER (WHERE status = 'preparing')         AS preparing,
        COUNT(*) FILTER (WHERE status = 'out_for_delivery')  AS out_for_delivery,
        COUNT(*) FILTER (WHERE status = 'delivered')         AS delivered,
        COUNT(*) FILTER (WHERE status = 'cancelled')         AS cancelled
      FROM orders
    `),

    // Total revenue (exclude cancelled)
    pool.query(`
      SELECT COALESCE(SUM(total_amount), 0) AS total_revenue
      FROM orders
      WHERE status != 'cancelled'
    `),

    // User count
    pool.query(`SELECT COUNT(*) AS total_users FROM users WHERE role = 'user'`),

    // Recent 10 orders with user info
    pool.query(`
      SELECT
        o.order_id, o.total_amount, o.status, o.created_at,
        u.name  AS user_name,
        u.email AS user_email,
        p.status AS payment_status,
        p.payment_method,
        (SELECT COUNT(*) FROM order_items oi WHERE oi.order_id = o.order_id) AS item_count
      FROM orders o
      JOIN users u ON o.user_id = u.user_id
      LEFT JOIN payments p ON o.payment_id = p.payment_id
      ORDER BY o.created_at DESC
      LIMIT 10
    `),

    // Top 5 products by total units sold
    pool.query(`
      SELECT
        p.product_id,
        p.name,
        p.price,
        p.image_url,
        COALESCE(SUM(oi.quantity), 0)          AS total_sold,
        COALESCE(SUM(oi.quantity * oi.price), 0) AS total_revenue
      FROM products p
      LEFT JOIN order_items oi ON p.product_id = oi.product_id
      LEFT JOIN orders o ON oi.order_id = o.order_id AND o.status != 'cancelled'
      GROUP BY p.product_id, p.name, p.price, p.image_url
      ORDER BY total_sold DESC
      LIMIT 5
    `),

    // Last 7 days revenue breakdown
    pool.query(`
      SELECT
        DATE(created_at) AS day,
        COALESCE(SUM(total_amount), 0) AS revenue,
        COUNT(*) AS orders
      FROM orders
      WHERE created_at >= NOW() - INTERVAL '7 days'
        AND status != 'cancelled'
      GROUP BY DATE(created_at)
      ORDER BY day ASC
    `),

    // Order status breakdown for donut chart
    pool.query(`
      SELECT status, COUNT(*) AS count
      FROM orders
      GROUP BY status
    `),

    // Payment status breakdown
    pool.query(`
      SELECT status, COUNT(*) AS count, COALESCE(SUM(amount), 0) AS total
      FROM payments
      GROUP BY status
    `),
  ]);

  res.json({
    orders: {
      ...orderStats.rows[0],
      total_orders: parseInt(orderStats.rows[0].total_orders),
    },
    revenue: {
      total: parseFloat(revenueStats.rows[0].total_revenue),
    },
    users: {
      total: parseInt(userCount.rows[0].total_users),
    },
    recentOrders: recentOrders.rows,
    topProducts: topProducts.rows,
    dailyRevenue: dailyRevenue.rows,
    orderStatusBreakdown: orderStatusBreakdown.rows,
    paymentStats: paymentStats.rows,
  });
});

export const getReviewStats = asyncHandler(async (req, res) => {
  const stats = await pool.query(`
    SELECT
      COUNT(*) AS total_reviews,
      AVG(rating) AS avg_rating,
      COUNT(*) FILTER (WHERE rating = 5) AS five_star,
      COUNT(*) FILTER (WHERE rating = 4) AS four_star,
      COUNT(*) FILTER (WHERE rating <= 3) AS low_rated
    FROM reviews
  `);

  res.json({
    reviews: {
      total: parseInt(stats.rows[0].total_reviews),
      avgRating: parseFloat(stats.rows[0].avg_rating),
      breakdown: {
        five_star: parseInt(stats.rows[0].five_star),
        four_star: parseInt(stats.rows[0].four_star),
        low_rated: parseInt(stats.rows[0].low_rated),
      },
    },
  });
});
export const deleteReviewAdmin = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;

  const result = await pool.query(
    "DELETE FROM reviews WHERE review_id = $1 RETURNING *",
    [reviewId]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({
      success: false,
      message: "Review not found",
    });
  }

  res.json({
    success: true,
    message: "Review deleted successfully",
    review: result.rows[0],
  });
});

export const getAllReviews = asyncHandler(async (req, res) => {
  const result = await pool.query(`
    SELECT 
      r.review_id,
      r.rating,
      r.comment,
      r.created_at,
      u.name AS user_name,
      p.name AS product_name
    FROM reviews r
    JOIN users u ON r.user_id = u.user_id
    JOIN products p ON r.product_id = p.product_id
    ORDER BY r.created_at DESC
  `);

  res.json({ reviews: result.rows });
});
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("users")
      .delete()
      .eq("id", id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};