
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);


CREATE TABLE IF NOT EXISTS addresses (
  id           SERIAL PRIMARY KEY,
  user_id      INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  address_line VARCHAR(255) NOT NULL,
  city         VARCHAR(100) NOT NULL,
  state        VARCHAR(100) NOT NULL,
  pincode      VARCHAR(10)  NOT NULL,
  is_default   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);


CREATE UNIQUE INDEX IF NOT EXISTS idx_one_default_per_user
  ON addresses (user_id)
  WHERE is_default = TRUE;


CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);
