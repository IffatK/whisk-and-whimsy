import { useState } from "react";

const STATUS_CONFIG = {
  delivered:  { bg: "#d4f4e2", color: "#1e7e4a", dot: "#2ecc71" },
  pending:    { bg: "#fff3cd", color: "#8a6200", dot: "#f0a500" },
  shipped:    { bg: "#d4eeff", color: "#1556a0", dot: "#3b9eed" },
  processing: { bg: "#e8d4ff", color: "#6b21a8", dot: "#a855f7" },
  cancelled:  { bg: "#fde8e8", color: "#b91c1c", dot: "#ef4444" },
};

// Format ISO date → "12 Apr 2026, 04:30 PM"
function fmtDate(iso) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  }).format(new Date(iso));
}

/**
 * OrderHistory
 * Props:
 *   orders  — array from backend:
 *             { order_id, status, total_amount, created_at, items: [{ name, quantity, price, image }] }
 *   loading — boolean
 */
export default function OrderHistory({ orders = [], loading }) {
  const [expanded, setExpanded] = useState(null);

  const toggle = (id) => setExpanded((prev) => (prev === id ? null : id));

  return (
    <div className="ww-card">
      <div className="ww-card-header">
        <h3 className="ww-card-title">
          <span className="ww-card-title-icon">📦</span> Order History
        </h3>
        <p className="ww-card-subtitle">
          {loading
            ? "Loading orders…"
            : orders.length === 0
            ? "No orders yet."
            : `${orders.length} order${orders.length !== 1 ? "s" : ""} placed`}
        </p>
      </div>

      {/* Skeletons */}
      {loading && (
        <div className="ww-skeleton-list">
          {[1, 2].map((n) => <div key={n} className="ww-skeleton ww-skeleton--row" />)}
        </div>
      )}

      {/* Empty */}
      {!loading && orders.length === 0 && (
        <div className="ww-empty">
          <span className="ww-empty-icon">🛒</span>
          <p>You haven't placed any orders yet.</p>
          <p className="ww-empty-sub">Browse our bakery and treat yourself!</p>
        </div>
      )}

      {/* Orders */}
      {!loading && orders.length > 0 && (
        <div className="ww-orders-list">
          {orders.map((order) => {
            const key = order.id ?? order.order_id;
            const status = (order.status ?? "pending").toLowerCase();
            const s      = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
            const isOpen = expanded === key;

            return (
              <div key={key} className={`ww-order-card${isOpen ? " ww-order-card--open" : ""}`}>
                {/* ── Clickable header row ── */}
                <button
                  className="ww-order-header"
                  onClick={() => toggle(key)}
                  aria-expanded={isOpen}
                >
                  <div className="ww-order-meta">
                    <span className="ww-order-id">
                      #{key?.slice(0, 8)}…
                    </span>
                   <span className="ww-order-date">{fmtDate(order.date ?? order.created_at)}</span>
                  </div>

                  <div className="ww-order-right">
                    <span
                      className="ww-status-badge"
                      style={{ background: s.bg, color: s.color }}
                    >
                      <span className="ww-status-dot" style={{ background: s.dot }} />
                      {order.status}
                    </span>
                    <span className="ww-order-total">₹{Number(order.total ?? order.total_amount ?? 0).toFixed(2)}</span>
                    <span className="ww-order-chevron">{isOpen ? "▲" : "▼"}</span>
                  </div>
                </button>

                {/* ── Expandable items ── */}
                {isOpen && (
                  <div className="ww-order-items">
                    {(order.items ?? []).length === 0 ? (
                      <p className="ww-order-no-items">No item details available.</p>
                    ) : (
                      order.items.map((item, i) => (
                        <div key={i} className="ww-order-item-row">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="ww-order-item-img"
                            />
                          )}
                          <span className="ww-order-item-name">{item.name}</span>
                          <span className="ww-order-item-qty">× {item.quantity}</span>
                          <span className="ww-order-item-price">₹{item.price}</span>
                        </div>
                      ))
                    )}
                  <div className="ww-order-items-total">
  Total: <strong>₹{Number(order.total ?? order.total_amount ?? 0).toFixed(2)}</strong>
</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}