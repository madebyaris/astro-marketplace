-- 0004_affiliate_click_logs.sql
-- Add click tracking table for detailed affiliate link analytics

-- Affiliate Click Logs for detailed tracking
CREATE TABLE IF NOT EXISTS affiliate_click_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  marketplace TEXT NOT NULL,
  target_url TEXT NOT NULL,
  timestamp INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  user_agent TEXT,
  referrer TEXT,
  ip_address TEXT,
  session_id TEXT,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_affiliate_click_logs_product ON affiliate_click_logs(product_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_click_logs_timestamp ON affiliate_click_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_affiliate_click_logs_marketplace ON affiliate_click_logs(marketplace);
CREATE INDEX IF NOT EXISTS idx_affiliate_click_logs_date ON affiliate_click_logs(date(timestamp, 'unixepoch'));

-- Update existing affiliate_links table to ensure click_count exists
-- (This is already in 0001_init.sql but adding here for completeness)
UPDATE affiliate_links SET click_count = 0 WHERE click_count IS NULL;

