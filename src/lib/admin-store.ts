import type { Product } from '../types/product';
import { mockProducts } from './mock-data';
import { mockCategories } from './mock-categories';

export type Settings = {
  purchasingEnabled: boolean;
  siteTitle: string;
  siteDescription: string;
  ogImage?: string;
  canonicalDomain?: string; // e.g., https://example.com
};

export type Category = { id: number; slug: string; name: string };

export type PagesContent = {
  aboutHtml: string;
  privacyHtml: string;
  policyHtml: string;
  heroTitle: string;
  heroSubtitle: string;
};

export type SmtpConfig = { host: string; port: number; user: string; from: string };
export type S3Config = { endpoint: string; bucket: string; accessKeyId: string; secretAccessKey: string };

type AdminStore = {
  products: Product[];
  settings: Settings;
  categories: Category[];
  nextCategoryId: number;
  pages: PagesContent;
  marketplaces: string[];
  users: Array<{ id: number; email: string; isAdmin: boolean }>;
  nextUserId: number;
  smtp: SmtpConfig;
  s3: S3Config;
  nextProductId: number;
};

const GLOBAL_KEY = '__astro_marketplace_admin_store__';

function initStore(): AdminStore {
  const baseProducts: Product[] = JSON.parse(JSON.stringify(mockProducts));
  return {
    products: baseProducts,
    settings: {
      purchasingEnabled: true,
      siteTitle: 'Astro Marketplace',
      siteDescription: 'Simple marketplace with affiliate links',
      ogImage: '',
      canonicalDomain: '',
    },
    categories: mockCategories.map((c, i) => ({ id: i + 1, slug: c.slug, name: c.name })),
    nextCategoryId: mockCategories.length + 1,
    pages: {
      aboutHtml: '<p>Kami adalah penjual mandiri dengan fokus pengalaman belanja terbaik.</p>',
      privacyHtml: '<p>Kami menghargai privasi Anda.</p>',
      policyHtml: '<p>Kebijakan toko yang transparan.</p>',
      heroTitle: 'Belanja Mudah. Pilihan Fleksibel.',
      heroSubtitle: 'Beli langsung atau lewat marketplace favorit Anda',
    },
    marketplaces: ['tokopedia', 'shopee'],
    users: [{ id: 1, email: 'admin@example.com', isAdmin: true }],
    nextUserId: 2,
    smtp: { host: '', port: 587, user: '', from: '' },
    s3: { endpoint: '', bucket: '', accessKeyId: '', secretAccessKey: '' },
    nextProductId: Math.max(...baseProducts.map((p) => p.id)) + 1,
  };
}

export function getStore(): AdminStore {
  const g = globalThis as any;
  if (!g[GLOBAL_KEY]) {
    g[GLOBAL_KEY] = initStore();
  }
  return g[GLOBAL_KEY] as AdminStore;
}

// Product ops
export function listProducts(): Product[] {
  return getStore().products;
}

export function getProductById(id: number): Product | undefined {
  return getStore().products.find((p) => p.id === id);
}

export function createProduct(input: Omit<Product, 'id'>): Product {
  const store = getStore();
  const product: Product = { id: store.nextProductId++, ...input } as Product;
  store.products.push(product);
  return product;
}

export function updateProduct(id: number, update: Partial<Product>): Product | undefined {
  const store = getStore();
  const idx = store.products.findIndex((p) => p.id === id);
  if (idx === -1) return undefined;
  store.products[idx] = { ...store.products[idx], ...update, id };
  return store.products[idx];
}

export function deleteProduct(id: number): boolean {
  const store = getStore();
  const before = store.products.length;
  store.products = store.products.filter((p) => p.id !== id);
  return store.products.length < before;
}

// Settings ops
export function getSettings() {
  return getStore().settings;
}

export function updateSettings(update: Partial<Settings>) {
  const store = getStore();
  store.settings = { ...store.settings, ...update };
  return store.settings;
}

// Categories
export function listCategories(): Category[] { return getStore().categories; }
export function createCategory(input: Omit<Category, 'id'>): Category {
  const s = getStore();
  const c: Category = { id: s.nextCategoryId++, ...input };
  s.categories.push(c);
  return c;
}
export function updateCategory(id: number, update: Partial<Category>): Category | undefined {
  const s = getStore();
  const i = s.categories.findIndex((c) => c.id === id);
  if (i === -1) return undefined;
  s.categories[i] = { ...s.categories[i], ...update, id } as Category;
  return s.categories[i];
}
export function deleteCategory(id: number): boolean {
  const s = getStore();
  const before = s.categories.length;
  s.categories = s.categories.filter((c) => c.id !== id);
  return s.categories.length < before;
}

// Pages
export function getPages(): PagesContent { return getStore().pages; }
export function updatePages(update: Partial<PagesContent>): PagesContent {
  const s = getStore();
  s.pages = { ...s.pages, ...update };
  return s.pages;
}

// Marketplaces
export function getMarketplaces(): string[] { return getStore().marketplaces; }
export function setMarketplaces(list: string[]): string[] { const s = getStore(); s.marketplaces = list; return s.marketplaces; }

// Users (mock)
export function listUsers() { return getStore().users; }
export function createUser(email: string, isAdmin = false) {
  const s = getStore();
  const u = { id: s.nextUserId++, email, isAdmin };
  s.users.push(u);
  return u;
}
export function toggleUserAdmin(id: number, isAdmin: boolean) {
  const s = getStore();
  const u = s.users.find((x) => x.id === id);
  if (!u) return undefined;
  u.isAdmin = isAdmin;
  return u;
}

// Config
export function getConfig() { const s = getStore(); return { smtp: s.smtp, s3: s.s3 }; }
export function updateConfig(update: Partial<{ smtp: SmtpConfig; s3: S3Config }>) {
  const s = getStore();
  s.smtp = { ...s.smtp, ...(update.smtp || {}) };
  s.s3 = { ...s.s3, ...(update.s3 || {}) };
  return { smtp: s.smtp, s3: s.s3 };
}


