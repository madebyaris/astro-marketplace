# Research Notes — Cloudflare + D1 Integration

## Cloudflare Platform
- `@astrojs/cloudflare` adapter exposes bindings via `context.locals.runtime.env` (Astro 4+). API routes receive `{ locals }`.
- D1 queries use `env.DB.prepare(statement).bind(...).run()` or `.all()`. Wrangler's local SQLite emulation behaves similarly.
- KV namespaces referenced as `env.SESSION` (implements async get/put/delete).
- Cloudflare Pages Functions requires `wrangler.toml` with `d1_databases` + `kv_namespaces` entries and secrets via `wrangler secret put`.

## Local Development
- `wrangler pages dev` (or `astro dev` with adapter) uses `.dev.vars` for secrets.
- Middleware now attaches local D1 connection when `astro dev` runs and `.wrangler/state/...` exists; supports manual override via `D1_LOCAL_PATH`.
- Existing npm scripts invoke `wrangler d1 migrations apply` and `wrangler d1 execute` for local DB; need instructions for creating db.
- Local D1 creation: `wrangler d1 create astro_marketplace` (remote) and `wrangler d1 migrations apply astro_marketplace --local` to sync.

## Data Model Snapshot
- Tables: `users`, `settings`, `categories`, `products`, `product_categories`, `affiliate_links`, `orders`, `order_items`, `affiliate_click_logs`.
- Missing may include `pages`/CMS content (currently in-memory). Could use table for static pages.
- Seed scripts: `0002_seed.sql` & `0003_seed_admin.sql` (bcrypt placeholder).

## Existing Code Gaps
- `src/lib/admin-store.ts` retains mock data; API routes call it directly when D1 binding missing.
- Frontend fetchers (if any) rely on admin APIs returning mock data shape; need synchronization once DB is default.

## References & Patterns
- Cloudflare D1 docs: https://developers.cloudflare.com/d1/platform/client-api/
- Astro Cloudflare runtime: https://docs.astro.build/en/guides/integrations-guide/cloudflare/
- Example repository pattern: use lightweight query helpers to map rows to `Product` type.

## Open Questions
- Will `pages` content also migrate to DB? (Likely future phase; note for later.)
- How to handle image URLs? Potential integration with R2 or external storage (Phase 4/5?).
- Auth/session not yet implemented; keep placeholder for hashed passwords.

