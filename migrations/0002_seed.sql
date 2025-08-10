-- 0002_seed.sql

-- Default categories
INSERT OR IGNORE INTO categories (id, slug, name) VALUES
  (1, 'general', 'General');

-- Sample product
INSERT OR IGNORE INTO products (id, slug, title, description, price_cents, stock, image_url)
VALUES (1, 'sample-product', 'Sample Product', 'This is a sample item.', 1999, 10, '');

INSERT OR IGNORE INTO product_categories (product_id, category_id) VALUES (1, 1);

-- Sample affiliate link
INSERT OR IGNORE INTO affiliate_links (product_id, label, target_url)
VALUES (1, 'Tokopedia', 'https://www.tokopedia.com/');
