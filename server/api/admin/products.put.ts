import { updateProduct } from '../../lib/repositories/products'
import { createDatabase } from '../../lib/database/adapter'
import type { Product, AffiliateLink } from '../../types'

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

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const id = Number(body?.id);
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Product id is required'
      })
    }
    
    const update = normalizeProductUpdate(body)
    const db = createDatabase()
    const updated = await updateProduct(db, id, update)
    
    if (!updated) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Product not found'
      })
    }
    
    return updated
  } catch (error) {
    console.error('[api/admin/products] error', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  }
})
