## Astro Marketplace — Product Requirements Document (PRD)

### Overview
A simple, monolithic marketplace website built with Astro, React, and TypeScript, styled with Tailwind CSS. Runs on Cloudflare Pages + Functions with Cloudflare D1 as the production database (SQLite locally). Two user roles: admin and user. Admin can enable/disable purchasing. Products can optionally include affiliate out-links (e.g., Tokopedia/Shopee) instead of or in addition to direct purchase.

### Goals
- Build a monolithic app (frontend + backend in one repo) that is easy to deploy and maintain.
- Host on Cloudflare (Pages + Functions), database on Cloudflare D1. Use SQLite locally.
- SEO-friendly and customizable UI using Tailwind.
- Two roles: admin and user. Users can sign up/sign in, and purchase if admin enables purchasing.
- Support optional affiliate-to-link per product (redirect to external marketplace).

### Non-Goals (for initial release)
- Complex multi-vendor features (marketplace operators only, single admin scope initially).
- Advanced payment integrations (placeholder checkout; real payments can be added later).
- Complex inventory management (simple stock counts only).

### Users and Roles
- Admin
  - Manage settings (toggle purchasing on/off globally).
  - CRUD products, categories, and affiliate link metadata.
  - View users and orders.
  - Moderate/approve whether purchasing is enabled.
- User
  - Browse catalog, search products.
  - Sign up/sign in.
  - When purchasing is enabled: add to cart and place orders.
  - When affiliate link present: click to be redirected to external marketplace.

### Key User Stories
- As an admin, I can toggle whether users can purchase on-site.
- As an admin, I can create/edit/delete products with images, price, stock, and optional affiliate link(s).
- As a user, I can browse/search products and view product detail pages.
- As a user, if purchasing is enabled, I can add items to cart and check out (MVP: create order, mock payment/confirmation flow).
- As a user, if a product has an affiliate link, I can click "Buy on Tokopedia/Shopee" to be redirected.

### Functional Requirements
- Authentication
  - Email + password auth (passwords hashed with a modern algorithm e.g., bcrypt/argon2).
  - Session via secure HTTP-only cookies.
  - Admin role flag on user row.
- Catalog
  - Product listing, filtering by category, keyword search.
  - Product detail page with images, description, price, stock, and optional affiliate button.
- Cart & Checkout (when enabled)
  - Cart stored in session; quantity updates; simple stock check.
  - Checkout flow creates an order record (MVP can simulate payment as "Paid (Test)" or "Pending").
  - Admin can mark orders as fulfilled/cancelled.
- Affiliate Out-links
  - Optional per product: label (Tokopedia/Shopee), target URL, and click tracking count.
  - If affiliate link exists, show "Buy on {Market}" button; when clicked, redirect and record click.
- Admin Dashboard
  - Products: list, create, edit, delete.
  - Orders: list, view detail, update status.
  - Users: list, toggle admin flag.
  - Settings: purchasing_enabled boolean, site metadata (title, description, logo), SEO defaults.
- SEO
  - Server-side rendered pages with descriptive titles and meta tags.
  - Canonical URLs, Open Graph/Twitter tags.
  - Sitemap.xml and robots.txt.
  - Structured data (schema.org Product) on product pages.
- Customization
  - Tailwind-first theming via config and utility classes.
  - Site-wide settings from database for title, description, and brand colors where possible.

### Tech Stack
- Framework: Astro (SSR) with `@astrojs/cloudflare` adapter for Pages + Functions.
- UI: React 19 + TypeScript, Tailwind CSS.
- Database: SQLite (development), Cloudflare D1 (production).
- Deployment: Cloudflare Pages (static assets) + Functions (server endpoints) with D1 bindings.
- Optional assets: Cloudflare R2 for media if needed (MVP can inline or use Pages Assets).

### High-Level Architecture
- Single-app repo layout:
  - `src/pages` for Astro pages (SSR) and static routes.
  - `src/pages/api` for server endpoints (cart, auth, admin actions, webhooks if added later).
  - `src/components` for React components.
  - `src/lib/db` for database access (D1/SQLite via a small data access layer).
  - `src/lib/auth` for sessions and role checks.
  - `drizzle` or raw SQL migrations (Cloudflare Wrangler migrations for D1).
- Data access via a unified repository layer that accepts a `DB` interface so it can target SQLite locally and D1 in prod.

### Data Model (MVP)
- users: id, email (unique), password_hash, is_admin (boolean), created_at, updated_at
- products: id, slug (unique), title, description, price_cents, stock, image_url, allow_direct_purchase (boolean), created_at, updated_at
- categories: id, slug (unique), name
- product_categories: product_id, category_id
- affiliate_links: id, product_id, label, target_url, click_count, created_at
- orders: id, user_id, total_cents, status (pending/paid/fulfilled/cancelled), created_at, updated_at
- order_items: id, order_id, product_id, quantity, price_cents
- settings: id=1 singleton, purchasing_enabled (boolean), site_title, site_description, primary_color

Note: SQLite locally and D1 in prod should share the same schema and migration flow via Wrangler.

### Purchasing Enablement Logic
- Global flag in `settings.purchasing_enabled` controls the site.
- Per product `allow_direct_purchase` controls whether direct purchase is offered.
- If direct purchase is disabled but an affiliate link exists, show the affiliate button instead.

### Security & Privacy
- Store password hashes only. Use secure cookie flags (HttpOnly, Secure, SameSite=Lax/Strict).
- Rate-limit auth endpoints.
- Basic input validation server-side and client-side.
- Minimal PII: email and order history only. No payment data in MVP.

### Performance
- SSR for SEO-critical pages.
- Image optimization via Astro/Image where possible.
- Keep TTI and LCP low; avoid heavy client JS—prefer Astro Islands.

### Accessibility
- Keyboard navigable, semantic HTML, focus states.
- Color contrast compliant with Tailwind utilities.

### Deployment
- Use `@astrojs/cloudflare` adapter.
- Configure D1 binding and environment variables in `wrangler.toml`.
- Cloudflare Pages project connected to the repo with automatic builds.

Example `wrangler.toml` (sketch):
```toml
name = "astro-marketplace"
compatibility_date = "2024-11-01"

[[d1_databases]]
binding = "DB"
database_name = "astro_marketplace"
database_id = "<prod-d1-id>"

[vars]
SESSION_SECRET = "<set-in-dashboard-or-ci>"
```

### SEO Requirements
- Dynamic meta per page (title, description, canonical).
- Open Graph and Twitter Card tags.
- `sitemap.xml` generation and `robots.txt`.
- JSON-LD for product pages.

### Analytics & Observability
- Basic pageview analytics (Cloudflare Analytics or privacy-friendly alternative).
- Request logging for API routes (redact PII).

### Milestones
- M1: Project setup (Astro + React + Tailwind), Cloudflare adapter, local SQLite + D1 binding.
- M2: Auth + Admin role + Settings toggle.
- M3: Catalog + Product pages with SEO + Affiliate link support.
- M4: Cart + Checkout (MVP order creation and status updates).
- M5: Admin dashboard (products, orders, users, settings).
- M6: Polish, accessibility, analytics, deploy to prod.
