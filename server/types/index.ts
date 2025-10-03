// Shared TypeScript types for the Nitro server

export interface User {
  id: number
  email: string
  isAdmin: boolean
  sessionId?: string
}

export interface SessionData {
  id: string
  userId: number
  createdAt: number
  expiresAt: number
}

export interface Product {
  id: number
  slug: string
  title: string
  description: string
  descriptionHtml?: string
  shortDescription?: string
  marketplaceUrls?: Record<string, string>
  priceCents: number
  stock: number
  imageUrl: string
  allowDirectPurchase: boolean
  affiliate?: AffiliateLink | null
  gallery?: string[]
  categories?: string[]
  rating?: number
  soldCount?: number
  location?: string
  storeName?: string
  freeShipping?: boolean
}

export interface AffiliateLink {
  label: string
  targetUrl: string
  clickCount?: number
}

export interface Category {
  id: number
  slug: string
  name: string
}

export interface Settings {
  purchasingEnabled: boolean
  siteTitle?: string
  siteDescription?: string
  primaryColor?: string
  ogImage?: string
  canonicalDomain?: string
}

export interface PagesContent {
  aboutHtml?: string
  privacyHtml?: string
  policyHtml?: string
  heroTitle?: string
  heroSubtitle?: string
}

export interface UserRecord {
  id: number
  email: string
  password_hash: string | null
  is_admin: number
  created_at: number
  updated_at: number
}

// Event context extension for auth middleware
declare module 'h3' {
  interface H3EventContext {
    user?: User
  }
}
