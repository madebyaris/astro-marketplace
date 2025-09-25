import type { D1Database } from '../db';
import { execute, queryAll, queryFirst } from '../db';
import type { Product } from '../../types/product';

type DbProduct = {
  id: number;
  slug: string;
  title: string;
  description: string;
  price_cents: number;
  stock: number;
  image_url: string;
  allow_direct_purchase: number;
  description_html?: string | null;
  short_description?: string | null;
  marketplace_urls?: string | null;
  affiliate_label?: string | null;
  affiliate_target_url?: string | null;
  affiliate_click_count?: number | null;
};

function safeParseJson<T>(value: string | null | undefined): T | undefined {
  if (!value) return undefined;
  try {
    return JSON.parse(value) as T;
  } catch {
    return undefined;
  }
}

function mapProduct(row: DbProduct): Product {
  const marketplaceUrls = safeParseJson<Record<string, string>>(row.marketplace_urls ?? undefined);
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    descriptionHtml: row.description_html ?? undefined,
    shortDescription: row.short_description ?? undefined,
    marketplaceUrls,
    priceCents: row.price_cents,
    stock: row.stock,
    imageUrl: row.image_url,
    allowDirectPurchase: Boolean(row.allow_direct_purchase),
    affiliate: row.affiliate_label && row.affiliate_target_url
      ? {
          label: row.affiliate_label,
          targetUrl: row.affiliate_target_url,
          clickCount: row.affiliate_click_count ?? undefined,
        }
      : null,
  };
}

export async function listProducts(db: D1Database): Promise<Product[]> {
  const { rows } = await queryAll<DbProduct>(db, `
    SELECT
      p.id,
      p.slug,
      p.title,
      p.description,
      p.description_html,
      p.short_description,
      p.marketplace_urls,
      p.price_cents,
      p.stock,
      p.image_url,
      p.allow_direct_purchase,
      (
        SELECT label FROM affiliate_links WHERE product_id = p.id ORDER BY id LIMIT 1
      ) AS affiliate_label,
      (
        SELECT target_url FROM affiliate_links WHERE product_id = p.id ORDER BY id LIMIT 1
      ) AS affiliate_target_url,
      (
        SELECT click_count FROM affiliate_links WHERE product_id = p.id ORDER BY id LIMIT 1
      ) AS affiliate_click_count
    FROM products p
    ORDER BY p.id DESC
  `);
  return rows.map(mapProduct);
}

export async function createProduct(db: D1Database, input: Omit<Product, 'id'>): Promise<Product> {
  const result = await execute(db, `
    INSERT INTO products (
      slug, title, description, description_html, short_description,
      marketplace_urls, price_cents, stock, image_url, allow_direct_purchase
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    input.slug,
    input.title,
    input.description,
    input.descriptionHtml ?? null,
    input.shortDescription ?? null,
    input.marketplaceUrls ? JSON.stringify(input.marketplaceUrls) : '{}',
    input.priceCents,
    input.stock,
    input.imageUrl,
    input.allowDirectPurchase ? 1 : 0,
  ]);

  const id = Number(result?.meta?.last_row_id);
  if (input.affiliate && input.affiliate.label && input.affiliate.targetUrl) {
    await execute(db, `
      INSERT INTO affiliate_links (product_id, label, target_url, click_count)
      VALUES (?, ?, ?, COALESCE(?, 0))
    `, [
      id,
      input.affiliate.label,
      input.affiliate.targetUrl,
      input.affiliate.clickCount ?? 0,
    ]);
  }
  const row = await queryFirst<DbProduct>(db, `
    SELECT
      p.id,
      p.slug,
      p.title,
      p.description,
      p.description_html,
      p.short_description,
      p.marketplace_urls,
      p.price_cents,
      p.stock,
      p.image_url,
      p.allow_direct_purchase,
      (
        SELECT label FROM affiliate_links WHERE product_id = p.id ORDER BY id LIMIT 1
      ) AS affiliate_label,
      (
        SELECT target_url FROM affiliate_links WHERE product_id = p.id ORDER BY id LIMIT 1
      ) AS affiliate_target_url,
      (
        SELECT click_count FROM affiliate_links WHERE product_id = p.id ORDER BY id LIMIT 1
      ) AS affiliate_click_count
    FROM products p
    WHERE p.id = ?
  `, [id]);
  if (!row) throw new Error('Failed to fetch inserted product');
  return mapProduct(row);
}

export async function updateProduct(db: D1Database, id: number, input: Partial<Product>): Promise<Product | null> {
  const existing = await queryFirst<DbProduct>(db, `
    SELECT
      p.id,
      p.slug,
      p.title,
      p.description,
      p.description_html,
      p.short_description,
      p.marketplace_urls,
      p.price_cents,
      p.stock,
      p.image_url,
      p.allow_direct_purchase,
      (
        SELECT label FROM affiliate_links WHERE product_id = p.id ORDER BY id LIMIT 1
      ) AS affiliate_label,
      (
        SELECT target_url FROM affiliate_links WHERE product_id = p.id ORDER BY id LIMIT 1
      ) AS affiliate_target_url,
      (
        SELECT click_count FROM affiliate_links WHERE product_id = p.id ORDER BY id LIMIT 1
      ) AS affiliate_click_count
    FROM products p
    WHERE p.id = ?
  `, [id]);
  if (!existing) return null;

  const updated = {
    ...existing,
    slug: input.slug ?? existing.slug,
    title: input.title ?? existing.title,
    description: input.description ?? existing.description,
    description_html: input.descriptionHtml ?? existing.description_html,
    short_description: input.shortDescription ?? existing.short_description,
    marketplace_urls: input.marketplaceUrls ? JSON.stringify(input.marketplaceUrls) : existing.marketplace_urls ?? '{}',
    price_cents: input.priceCents ?? existing.price_cents,
    stock: input.stock ?? existing.stock,
    image_url: input.imageUrl ?? existing.image_url,
    allow_direct_purchase: typeof input.allowDirectPurchase === 'boolean' ? (input.allowDirectPurchase ? 1 : 0) : existing.allow_direct_purchase,
  } satisfies DbProduct;

  await execute(db, `
    UPDATE products SET
      slug = ?,
      title = ?,
      description = ?,
      description_html = ?,
      short_description = ?,
      marketplace_urls = ?,
      price_cents = ?,
      stock = ?,
      image_url = ?,
      allow_direct_purchase = ?,
      updated_at = strftime('%s','now')
    WHERE id = ?
  `, [
    updated.slug,
    updated.title,
    updated.description,
    updated.description_html,
    updated.short_description,
    updated.marketplace_urls,
    updated.price_cents,
    updated.stock,
    updated.image_url,
    updated.allow_direct_purchase,
    id,
  ]);

  if (input.affiliate !== undefined) {
    if (input.affiliate && input.affiliate.label && input.affiliate.targetUrl) {
      await execute(db, `
        INSERT INTO affiliate_links (product_id, label, target_url, click_count)
        VALUES (?, ?, ?, COALESCE(?, 0))
        ON CONFLICT(product_id) DO UPDATE SET
          label = excluded.label,
          target_url = excluded.target_url,
          click_count = excluded.click_count
      `, [
        id,
        input.affiliate.label,
        input.affiliate.targetUrl,
        input.affiliate.clickCount ?? existing.affiliate_click_count ?? 0,
      ]);
    } else {
      await execute(db, `DELETE FROM affiliate_links WHERE product_id = ?`, [id]);
    }
  }

  const row = await queryFirst<DbProduct>(db, `
    SELECT
      p.id,
      p.slug,
      p.title,
      p.description,
      p.description_html,
      p.short_description,
      p.marketplace_urls,
      p.price_cents,
      p.stock,
      p.image_url,
      p.allow_direct_purchase,
      (
        SELECT label FROM affiliate_links WHERE product_id = p.id ORDER BY id LIMIT 1
      ) AS affiliate_label,
      (
        SELECT target_url FROM affiliate_links WHERE product_id = p.id ORDER BY id LIMIT 1
      ) AS affiliate_target_url,
      (
        SELECT click_count FROM affiliate_links WHERE product_id = p.id ORDER BY id LIMIT 1
      ) AS affiliate_click_count
    FROM products p
    WHERE p.id = ?
  `, [id]);

  return row ? mapProduct(row) : mapProduct(updated);
}

export async function deleteProduct(db: D1Database, id: number): Promise<boolean> {
  await execute(db, `DELETE FROM affiliate_links WHERE product_id = ?`, [id]);
  const result = await execute(db, `DELETE FROM products WHERE id = ?`, [id]);
  return Boolean(result?.meta?.changes);
}

