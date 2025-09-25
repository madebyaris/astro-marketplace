import type { APIRoute } from 'astro';
import { createProduct, deleteProduct, listProducts, updateProduct } from '../../../lib/repositories/products';
import type { Product, AffiliateLink } from '../../../types/product';
import {
  listProducts as listProductsMock,
  createProduct as createProductMock,
  updateProduct as updateProductMock,
  deleteProduct as deleteProductMock,
} from '../../../lib/admin-store';

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });

const handleError = (error: unknown) => {
  console.error('[api/admin/products] error', error);
  return json({ error: 'Internal Server Error' }, 500);
};

const normalizeAffiliate = (data: any): AffiliateLink | undefined => {
  if (!data) return undefined;
  const label = typeof data.label === 'string' ? data.label.trim() : '';
  const targetUrl = typeof data.targetUrl === 'string' ? data.targetUrl.trim() : '';
  if (!label || !targetUrl) return undefined;
  return {
    label,
    targetUrl,
    clickCount: typeof data.clickCount === 'number' ? data.clickCount : undefined,
  };
};

const normalizeMarketplaceUrls = (value: unknown): Record<string, string> | undefined => {
  if (!value || typeof value !== 'object') return undefined;
  const entries = Object.entries(value as Record<string, unknown>)
    .filter(([, v]) => typeof v === 'string' && v.trim().length > 0)
    .map(([k, v]) => [k, (v as string).trim()]);
  if (!entries.length) return undefined;
  return Object.fromEntries(entries);
};

const normalizeProductPayload = (data: any): Omit<Product, 'id'> => {
  const slug = typeof data.slug === 'string' ? data.slug.trim() : '';
  const title = typeof data.title === 'string' ? data.title.trim() : '';
  if (!slug || !title) {
    throw new Error('Slug and title are required');
  }

  return {
    slug,
    title,
    description: typeof data.description === 'string' ? data.description : '',
    descriptionHtml: typeof data.descriptionHtml === 'string' ? data.descriptionHtml : undefined,
    shortDescription: typeof data.shortDescription === 'string' ? data.shortDescription : undefined,
    marketplaceUrls: normalizeMarketplaceUrls(data.marketplaceUrls),
    priceCents: Number.isFinite(Number(data.priceCents)) ? Number(data.priceCents) : 0,
    stock: Number.isFinite(Number(data.stock)) ? Number(data.stock) : 0,
    imageUrl: typeof data.imageUrl === 'string' ? data.imageUrl : '',
    allowDirectPurchase: Boolean(data.allowDirectPurchase ?? true),
    affiliate: normalizeAffiliate(data.affiliate) ?? null,
    gallery: Array.isArray(data.gallery) ? data.gallery : undefined,
    categories: Array.isArray(data.categories) ? data.categories : undefined,
    rating: typeof data.rating === 'number' ? data.rating : undefined,
    soldCount: typeof data.soldCount === 'number' ? data.soldCount : undefined,
    location: typeof data.location === 'string' ? data.location : undefined,
    storeName: typeof data.storeName === 'string' ? data.storeName : undefined,
    freeShipping: typeof data.freeShipping === 'boolean' ? data.freeShipping : undefined,
  };
};

const normalizeProductUpdate = (data: any): Partial<Product> => {
  const update: Partial<Product> = {};
  if (typeof data.slug === 'string') update.slug = data.slug.trim();
  if (typeof data.title === 'string') update.title = data.title.trim();
  if (typeof data.description === 'string') update.description = data.description;
  if (typeof data.descriptionHtml === 'string') update.descriptionHtml = data.descriptionHtml;
  if (typeof data.shortDescription === 'string') update.shortDescription = data.shortDescription;
  if (data.marketplaceUrls) update.marketplaceUrls = normalizeMarketplaceUrls(data.marketplaceUrls);
  if (data.priceCents !== undefined) update.priceCents = Number(data.priceCents) || 0;
  if (data.stock !== undefined) update.stock = Number(data.stock) || 0;
  if (typeof data.imageUrl === 'string') update.imageUrl = data.imageUrl;
  if (data.allowDirectPurchase !== undefined) update.allowDirectPurchase = Boolean(data.allowDirectPurchase);
  if ('affiliate' in data) update.affiliate = normalizeAffiliate(data.affiliate) ?? null;
  if ('categories' in data && Array.isArray(data.categories)) update.categories = data.categories;
  if ('gallery' in data && Array.isArray(data.gallery)) update.gallery = data.gallery;
  if ('rating' in data && typeof data.rating === 'number') update.rating = data.rating;
  if ('soldCount' in data && typeof data.soldCount === 'number') update.soldCount = data.soldCount;
  if ('location' in data && typeof data.location === 'string') update.location = data.location;
  if ('storeName' in data && typeof data.storeName === 'string') update.storeName = data.storeName;
  if ('freeShipping' in data && typeof data.freeShipping === 'boolean') update.freeShipping = data.freeShipping;
  return update;
};

export const GET: APIRoute = async ({ locals }) => {
  try {
    const db = locals.runtime?.env?.DB;
    if (!db) {
      return json(listProductsMock());
    }
    const products = await listProducts(db);
    return json(products);
  } catch (error) {
    return handleError(error);
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const payload = await request.json();
    const normalized = normalizeProductPayload(payload);
    const db = locals.runtime?.env?.DB;
    const product = db
      ? await createProduct(db, normalized)
      : createProductMock(normalized as any);
    return json(product, 201);
  } catch (error) {
    if (error instanceof Error && error.message === 'Slug and title are required') {
      return json({ error: error.message }, 400);
    }
    return handleError(error);
  }
};

export const PUT: APIRoute = async ({ request, locals }) => {
  try {
    const payload = await request.json();
    const id = Number(payload?.id);
    if (!id) {
      return json({ error: 'Product id is required' }, 400);
    }
    const update = normalizeProductUpdate(payload);
    const db = locals.runtime?.env?.DB;
    const updated = db
      ? await updateProduct(db, id, update)
      : updateProductMock(id, update as any);
    if (!updated) {
      return json({ error: 'Product not found' }, 404);
    }
    return json(updated);
  } catch (error) {
    return handleError(error);
  }
};

export const DELETE: APIRoute = async ({ request, locals }) => {
  try {
    const payload = await request.json();
    const id = Number(payload?.id);
    if (!id) {
      return json({ error: 'Product id is required' }, 400);
    }
    const db = locals.runtime?.env?.DB;
    const ok = db
      ? await deleteProduct(db, id)
      : deleteProductMock(id);
    return json({ ok });
  } catch (error) {
    return handleError(error);
  }
};


