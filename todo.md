## TODO — Astro Marketplace

### Phase 0 — Repo Setup
- [x] Initialize Astro with React + TypeScript.
- [x] Add Tailwind CSS and configure base theme.
- [x] Add ESLint + Prettier configs.
- [ ] Add basic CI (format/lint) in GitHub Actions.

### Phase 1 — Cloudflare & DB
- [x] Add `@astrojs/cloudflare` adapter and `wrangler.toml` skeleton.
- [x] Configure D1 binding (e.g., `DB`).
- [x] Configure KV namespace for sessions (`SESSION`).
- [ ] Create D1 database (prod) in Cloudflare dashboard.
- [x] Create local SQLite DB via Wrangler and auto-bind during dev (`npm run db:migrate:local`, middleware).

### Phase 2 — Data Schema
- [x] Create tables: users, products, categories, product_categories, affiliate_links, orders, order_items, settings.
- [x] Seed script: settings row, sample products + affiliate link.
- [x] Seed script: admin user (placeholder hash via `migrations/0003_seed_admin.sql`).
- [x] Data access layer for SQLite (dev) and D1 (prod) with repository functions.

### Phase 3 — Auth
- [ ] Email/password registration + login (hash passwords with bcrypt/argon2).
- [ ] Session cookies (HttpOnly, Secure, SameSite).
- [ ] Middleware/guards for admin-only routes.
- [ ] Login page wiring to API.

### Phase 4 — Admin Dashboard
- [x] Scaffold admin page route.
- [ ] Admin layout (Tailwind), nav: Products, Orders, Users, Settings.
- [ ] CRUD products (images, price, stock, affiliate link fields).
- [ ] Orders list + status updates.
- [ ] Users list + toggle admin flag.
- [ ] Settings: `purchasing_enabled`, site metadata.

### Phase 5 — Storefront
- [x] Store landing and grid UI.
- [x] Product card with affiliate button and Add to Cart.
- [x] Product detail page.
- [ ] Search with client-side filtering.
- [ ] Category filter UI.
- [ ] Server-side product list from DB (replace mock).

### Phase 6 — Cart & Checkout (MVP)
- [x] Client-side cart with localStorage.
- [x] Cart summary component and checkout page shell.
- [ ] Checkout flow (create order record server-side).
- [ ] Order confirmation page.

### Phase 7 — SEO
- [x] `sitemap.xml` + `robots.txt`.
- [ ] Dynamic meta per page (title, description, canonical).
- [ ] Open Graph & Twitter tags.
- [ ] JSON-LD for products.

### Phase 8 — Analytics & Observability
- [ ] Pageview analytics (Cloudflare Analytics or similar).
- [ ] API request logging (redact PII).

### Phase 9 — Deployment
- [ ] Connect repo to Cloudflare Pages.
- [ ] Configure env vars/secrets (SESSION_SECRET, D1 binding, KV namespace).
- [ ] Set up preview + production environments.

### Phase 10 — Polish
- [x] Favicon.
- [ ] Accessibility pass (focus states, labels, contrast).
- [ ] Performance tuning (islands, image optimization).
- [ ] 404/500 pages.

### Helpful Commands (reference)
```bash
# Local DB: migrations and seed
npm run db:migrate:local
npm run db:seed:local

# Dev server
npm run dev
```
