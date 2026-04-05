-- ============================================================
-- Whisk & Whimsy — Full Database Schema
-- Includes: users (role, is_blocked), categories, products,
--           cart, cart_items, payments, orders, order_items
-- ============================================================

-- ── USERS ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  user_id    SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(255) UNIQUE NOT NULL,
  password   VARCHAR(255) NOT NULL,
  phone      VARCHAR(20),
  address    VARCHAR(255),
  city       VARCHAR(100),
  pincode    VARCHAR(10),
  avatar_url TEXT,
  role       VARCHAR(20) NOT NULL DEFAULT 'user',  -- 'user' | 'admin'
  is_blocked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role  ON users(role);

-- ── CATEGORIES ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  category_id SERIAL PRIMARY KEY,
  name        VARCHAR(100) UNIQUE NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── PRODUCTS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  product_id     SERIAL PRIMARY KEY,
  name           VARCHAR(255) NOT NULL,
  category_id    INTEGER REFERENCES categories(category_id) ON DELETE SET NULL,
  price          NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  description    TEXT,
  image_url      TEXT,
  is_available   BOOLEAN NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_available ON products(is_available);

-- ── CART & CART_ITEMS ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cart (
  cart_id    SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS cart_items (
  cart_item_id SERIAL PRIMARY KEY,
  cart_id      INTEGER NOT NULL REFERENCES cart(cart_id) ON DELETE CASCADE,
  product_id   INTEGER NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
  quantity     INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  added_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(cart_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_cart_user        ON cart(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart  ON cart_items(cart_id);

-- ── PAYMENTS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payments (
  payment_id     SERIAL PRIMARY KEY,
  user_id        INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  amount         NUMERIC(10, 2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL DEFAULT 'cod',  -- 'cod' | 'online'
  status         VARCHAR(30) NOT NULL DEFAULT 'pending', -- 'pending' | 'paid' | 'failed'
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_user   ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- ── ORDERS ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  order_id     SERIAL PRIMARY KEY,
  user_id      INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  payment_id   INTEGER REFERENCES payments(payment_id) ON DELETE SET NULL,
  total_amount NUMERIC(10, 2) NOT NULL,
  status       VARCHAR(30) NOT NULL DEFAULT 'pending',
    -- 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled'
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user   ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_date   ON orders(created_at DESC);

-- ── ORDER_ITEMS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
  order_item_id SERIAL PRIMARY KEY,
  order_id      INTEGER NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
  product_id    INTEGER REFERENCES products(product_id) ON DELETE SET NULL,
  quantity      INTEGER NOT NULL CHECK (quantity > 0),
  price         NUMERIC(10, 2) NOT NULL,  -- locked price at time of order
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order   ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id);

-- ── ADDRESS (optional extended table) ────────────────────────
CREATE TABLE IF NOT EXISTS addresses (
  address_id  SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  label       VARCHAR(50),
  line1       VARCHAR(255) NOT NULL,
  city        VARCHAR(100),
  pincode     VARCHAR(10),
  is_default  BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);