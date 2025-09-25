-- 0002_seed.sql

-- Default categories
INSERT OR IGNORE INTO categories (id, slug, name) VALUES
  (1, 'general', 'General');

-- Sample product
INSERT OR IGNORE INTO products (id, slug, title, description, description_html, short_description, marketplace_urls, price_cents, stock, image_url, allow_direct_purchase)
VALUES (
  1,
  'sample-product',
  'Sample Product',
  'This is a sample item.',
  '<p><strong>Sample Product</strong> is an example listing showcasing our marketplace layout and SEO approach.</p>',
  'Contoh produk untuk demo.',
  '{"tokopedia": "https://www.tokopedia.com/"}',
  1999,
  10,
  'https://picsum.photos/seed/sample/600/400',
  1
);

INSERT OR IGNORE INTO product_categories (product_id, category_id) VALUES (1, 1);

-- Sample affiliate link
INSERT OR IGNORE INTO affiliate_links (product_id, label, target_url, click_count)
VALUES (1, 'Tokopedia', 'https://www.tokopedia.com/', 0);
