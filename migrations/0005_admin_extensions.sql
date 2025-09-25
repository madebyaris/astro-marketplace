-- 0005_admin_extensions.sql
-- Extend schema to support admin settings, pages content, and product metadata

-- Products: richer metadata fields for storefront/admin editing
ALTER TABLE products ADD COLUMN description_html TEXT DEFAULT '';
ALTER TABLE products ADD COLUMN short_description TEXT DEFAULT '';
ALTER TABLE products ADD COLUMN marketplace_urls TEXT DEFAULT '{}';

-- Settings: SEO fields
ALTER TABLE settings ADD COLUMN og_image TEXT DEFAULT '';
ALTER TABLE settings ADD COLUMN canonical_domain TEXT DEFAULT '';

-- Pages content (singleton row)
CREATE TABLE IF NOT EXISTS pages_content (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  about_html TEXT NOT NULL DEFAULT '<p>Kami adalah penjual mandiri dengan fokus pengalaman belanja terbaik.</p>',
  privacy_html TEXT NOT NULL DEFAULT '<p>Kami menghargai privasi Anda.</p>',
  policy_html TEXT NOT NULL DEFAULT '<p>Kebijakan toko yang transparan.</p>',
  hero_title TEXT NOT NULL DEFAULT 'Belanja Mudah. Pilihan Fleksibel.',
  hero_subtitle TEXT NOT NULL DEFAULT 'Beli langsung atau lewat marketplace favorit Anda',
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);
INSERT OR IGNORE INTO pages_content (id) VALUES (1);

-- Integration settings (singleton row)
CREATE TABLE IF NOT EXISTS integration_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  smtp_host TEXT NOT NULL DEFAULT '',
  smtp_port INTEGER NOT NULL DEFAULT 587,
  smtp_user TEXT NOT NULL DEFAULT '',
  smtp_from TEXT NOT NULL DEFAULT '',
  s3_endpoint TEXT NOT NULL DEFAULT '',
  s3_bucket TEXT NOT NULL DEFAULT '',
  s3_access_key_id TEXT NOT NULL DEFAULT '',
  s3_secret_access_key TEXT NOT NULL DEFAULT '',
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);
INSERT OR IGNORE INTO integration_settings (id) VALUES (1);

-- Ensure affiliate links have at most one primary entry per product for admin UI simplicity
CREATE UNIQUE INDEX IF NOT EXISTS idx_affiliate_links_product_unique ON affiliate_links(product_id);

-- Ensure default JSON strings are valid
UPDATE products SET marketplace_urls = '{}' WHERE marketplace_urls IS NULL;

