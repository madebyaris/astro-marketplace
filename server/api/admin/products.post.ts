import { defineEventHandler, readBody, createError } from 'h3'
import { getDatabase } from '../../utils/db'
import { createProduct } from '../../../src/lib/repositories/products'
import { createProduct as createProductMock } from '../../../src/lib/admin-store'
import type { Product, AffiliateLink } from '../../../src/types/product'

const normalizeAffiliate = (data: any): AffiliateLink | undefined => {
  if (!data) return undefined
  const label = typeof data.label === 'string' ? data.label.trim() : ''
  const targetUrl = typeof data.targetUrl === 'string' ? data.targetUrl.trim() : ''
  if (!label || !targetUrl) return undefined
  return {
    label,
    targetUrl,
    clickCount: typeof data.clickCount === 'number' ? data.clickCount : undefined,
  }
}

const normalizeMarketplaceUrls = (value: unknown): Record<string, string> | undefined => {
  if (!value || typeof value !== 'object') return undefined
  const entries = Object.entries(value as Record<string, unknown>)
    .filter(([, v]) => typeof v === 'string' && v.trim().length > 0)
    .map(([k, v]) => [k, (v as string).trim()])
  if (!entries.length) return undefined
  return Object.fromEntries(entries)
}

const normalizeProductPayload = (data: any): Omit<Product, 'id'> => {
  const slug = typeof data.slug === 'string' ? data.slug.trim() : ''
  const title = typeof data.title === 'string' ? data.title.trim() : ''
  if (!slug || !title) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Slug and title are required'
    })
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
  }
}

export default defineEventHandler(async (event) => {
  try {
    const payload = await readBody(event)
    const normalized = normalizeProductPayload(payload)
    const db = await getDatabase()
    const product = db
      ? await createProduct(db, normalized)
      : createProductMock(normalized as any)
    return product
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    console.error('[api/admin/products] error', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  }
})
