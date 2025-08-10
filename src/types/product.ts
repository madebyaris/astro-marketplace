export type AffiliateLink = {
  label: string;
  targetUrl: string;
  clickCount?: number;
};

export type Product = {
  id: number;
  slug: string;
  title: string;
  description: string; // short summary for SEO/meta
  descriptionHtml?: string; // long rich HTML description for SERP/SEO
  shortDescription?: string; // optional shorter blurb for cards
  marketplaceUrls?: Record<string, string>; // e.g., { tokopedia: 'https://...', shopee: 'https://...' }
  priceCents: number;
  stock: number;
  imageUrl: string;
  gallery?: string[]; // optional image gallery thumbnails
  allowDirectPurchase: boolean;
  affiliate?: AffiliateLink | null;
  categories?: string[];
  rating?: number; // 0..5
  soldCount?: number;
  location?: string;
  freeShipping?: boolean;
  storeName?: string;
};
