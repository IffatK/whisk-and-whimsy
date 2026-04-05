/**
 * Wishlist
 * Props:
 *   items    — array from backend:
 *              { wishlist_id, product_id, name, price, image, description }
 *   loading  — boolean
 *   onRemove(wishlist_id) — called when user clicks remove
 */
export default function Wishlist({ items = [], loading, onRemove }) {
  return (
    <div className="ww-card">
      <div className="ww-card-header">
        <h3 className="ww-card-title">
          <span className="ww-card-title-icon">🤍</span> My Wishlist
        </h3>
        <p className="ww-card-subtitle">
          {loading
            ? "Loading wishlist…"
            : items.length === 0
            ? "Nothing saved yet."
            : `${items.length} item${items.length !== 1 ? "s" : ""} saved`}
        </p>
      </div>

      {/* Skeletons */}
      {loading && (
        <div className="ww-wishlist-grid">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="ww-skeleton ww-skeleton--card" />
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && items.length === 0 && (
        <div className="ww-empty">
          <span className="ww-empty-icon">🍰</span>
          <p>Your wishlist is empty.</p>
          <p className="ww-empty-sub">Heart items you love to save them here.</p>
        </div>
      )}

      {/* Items */}
      {!loading && items.length > 0 && (
        <div className="ww-wishlist-grid">
          {items.map((item) => (
            <div key={item.wishlist_id} className="ww-wishlist-card">
              <a
                href={`/product/${item.product_id}`}
                className="ww-wishlist-thumb-link"
              >
                <div className="ww-wishlist-thumb">
                  {item.image ? (
                    <img src={item.image} alt={item.name} />
                  ) : (
                    <span className="ww-wishlist-emoji">🧁</span>
                  )}
                </div>
              </a>

              <div className="ww-wishlist-info">
                <a
                  href={`/product/${item.product_id}`}
                  className="ww-wishlist-name"
                >
                  {item.name}
                </a>
                {/* price from backend is a number — format as ₹ */}
                <p className="ww-wishlist-price">
                  ₹{Number(item.price).toFixed(2)}
                </p>
              </div>

              <button
                className="ww-wishlist-remove"
                onClick={() => onRemove(item.wishlist_id)}
                title={`Remove ${item.name} from wishlist`}
                aria-label={`Remove ${item.name} from wishlist`}
              >
                <TrashIcon />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14H6L5 6"/>
      <path d="M10 11v6M14 11v6"/>
      <path d="M9 6V4h6v2"/>
    </svg>
  );
}