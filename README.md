# Astro Marketplace

## What is this?
Astro Marketplace is a monolithic storefront + admin starter built with Astro, React, and Tailwind, designed for independent sellers who:
- Want a fast, SEO‑optimized product website under their own domain
- Sell directly on the site or redirect customers to marketplaces (Tokopedia, Shopee, etc.)
- Need simple admin tools to manage products, pages (About/Privacy/Policy), and basic SEO settings (OG image, canonical domain)

It runs on Cloudflare Pages + Functions and uses D1 (SQLite locally). The current admin backend is in‑memory for rapid iteration; you can later swap to Cloudflare D1 for persistence.

![Astro Marketplace Frontpage](asset-git/frontpage.png)

## Features
- Storefront pages: Home (`/`), Store (`/store`), Product (`/product/[slug]`), Cart (`/cart`), Checkout (`/checkout`)
- Content pages: About (`/about`), Privacy (`/privacy`), Kebijakan/Policy (`/kebijakan`), Contact (`/contact`)
- Cart & Checkout: localStorage cart with quantity stepper and checkout form validation
- SEO:
  - Canonical, Open Graph, Twitter meta (configurable)
  - Product JSON-LD on product pages
  - `sitemap.xml` and `robots.txt`
- Admin Dashboard (`/admin`)
  - Products CRUD (title, slug, price, stock, image, short/HTML description, marketplace URLs)
  - Categories CRUD
  - Homepage editor (hero title/subtitle)
  - Pages editor (About/Privacy/Policy HTML) rendered live on the site
  - Marketplaces list management
  - Users (mock) and general Settings (site title/description, purchasing toggle)
  - SEO Settings: OG image URL, Canonical domain
  - Integrations: SMTP + S3 config forms (stored in-memory for now)

Note: The current admin backend is an in-memory store for rapid iteration. For production, swap to D1 persistence.

## How this helps you
- Centralizes your product catalog and long‑form descriptions for SERP while still letting buyers check out here or jump to their favorite marketplace.
- Lets you edit About/Privacy/Policy pages right from the admin and see the changes live.
- Gives you basic SEO controls (canonical domain + OG image) without touching code.
- Deploys easily to Cloudflare Pages with serverless APIs.

## Installation (local)
Prerequisites:
- Node.js 20+ and npm
- Optional: Cloudflare Wrangler CLI (`npm i -g wrangler`) for local D1

Steps:
```bash
npm install
npm run dev
```
The site will be available at `http://localhost:4321`.

### Database (local)
```bash
# Apply migrations to local SQLite (via D1 local)
npm run db:migrate:local

# Seed sample data (products, categories, sample affiliate link, demo admin)
npm run db:seed:local

# Inspect tables
npm run db:console:local
```

Admin seed: `migrations/0003_seed_admin.sql` inserts a demo admin user (`arissetia.m@gmail.com`) with a placeholder hash. Replace with a secure bcrypt/argon2 hash before production.

## Admin
- URL: `/admin`
- Data is kept in-memory while the dev server runs (restart resets in-memory edits). DB migrations cover storefront tables; admin store to be wired to D1 next.
- Header automatically switches to an admin-focused view on admin routes.

### Admin APIs (in-memory)
- Products: `GET/POST/PUT/DELETE /api/admin/products`
- Categories: `GET/POST/PUT/DELETE /api/admin/categories`
- Settings: `GET/PUT /api/admin/settings` (site title/description, purchasing, OG image, canonical)
- Pages: `GET/PUT /api/admin/pages` (About/Privacy/Policy HTML, Homepage hero)
- Config: `GET/PUT /api/admin/config` (SMTP/S3 forms)

## SEO & Canonical
- Set OG Image URL and Canonical Domain in Admin → Settings. When Canonical is set (e.g., `https://example.com`), pages render `<link rel="canonical">` using that domain + current path.

## Deploy (Cloudflare)
- Use `@astrojs/cloudflare` adapter (already configured)
- In `wrangler.toml`, set D1 binding and any vars you need
  - `DB` (D1) and `SESSION` (KV) are scaffolded
- Connect the repo to Cloudflare Pages (enable Functions)

## API
- `GET /api/health` → `{ status: "ok" }`

## Sitemap
Includes: `/`, `/store`, `/admin`, `/privacy`, `/kebijakan`, `/about`, `/contact`, `/cart`, `/checkout`.
