# Phase 1 & 2 Brief — Cloudflare Setup + Data Schema

## Context
- Storefront previously relied on in-memory admin store and mock data; D1 repositories now exist but require runtime binding to be available.
- `/todo.md` Phase 1 covers infrastructure bindings (D1 + KV); Phase 2 covers relational schema and access layer.
- Migrations (`migrations/0001_init.sql`…`0005_admin_extensions.sql`) now cover admin metadata (pages, integrations) though local dev still defaults to mock data when `env.DB` is missing.

## Problem & Goals
- Enable persistent data storage for products, categories, orders, settings, and sessions across deployments.
- Prepare database schema and access layer so storefront and admin can move off mocks.
- Ensure Cloudflare environment bindings and local dev workflow are consistent.

## Research Snapshot
- Astro + `@astrojs/cloudflare` adapter expects D1 via `env.DB`; local dev can use Wrangler D1/SQLite.
- KV session binding already scaffolded in `wrangler.toml` but IDs/secrets are placeholders.
- Schema already includes users, products, categories, orders, affiliate tracking; needs validation against future features (auth, analytics).
- No repository layer yet; API handlers still use in-memory `admin-store.ts` and `mock-data.ts`.

## Requirements
1. Cloudflare Environment (Phase 1)
   - Provision D1 database and KV namespace; update `wrangler.toml` with real IDs.
   - Document local Wrangler commands for creating local DB, running migrations, and seeding.
   - Establish `.dev.vars` or `.env` pattern for `SESSION_SECRET`, future secrets.
   - Verify adapter config (`astro.config.mjs`) for `imageService: "compile"` per Cloudflare constraints.
   - **New:** Ensure local dev server (`astro dev`) injects `DB` binding. Options: run via `wrangler pages dev`, or add an adapter shim so `/api/admin/*` routes detect the local SQLite handle. Without binding, endpoints fall back to mock data.
2. Data Schema Completion (Phase 2)
   - Finalize migrations: ensure admin seed runs with secure hash placeholder, confirm referential integrity.
   - Create repository layer (`src/lib/db.ts` + new modules) for CRUD on products/categories/orders/settings. ✅ Completed.
   - Plan strategy to replace `admin-store.ts` and mocks with DB-backed implementations (transitional toggle acceptable). **Action:** add explicit toggle/env flag to avoid silent fallback.
   - Define seed data coverage for categories, sample products, admin user, settings. ✅ Updated migrations/seeds.
   - Identify performance considerations (indexes, pagination, query patterns).

## Implementation Outline
- Cloudflare Setup
  - Use Wrangler CLI: `wrangler d1 create astro_marketplace`, `wrangler kv:namespace create SESSION`.
  - Store returned IDs in `wrangler.toml`; document same in README or `docs/cloudflare-setup.md`.
  - Add scripts in `package.json` for `wrangler d1 migrate` and `wrangler d1 execute` (if missing).
  - Confirm dev server wiring for `DB` binding. **Discovery:** running plain `astro dev` does not provide `env.DB`, so API routes return 404. Need either:
    - Run `wrangler pages dev` to proxy bindings; or
    - Create dev middleware that injects local SQLite connection via Vite/Node adapter.
- Data Schema & Access
  - Review migrations for idempotency; ensure `0003_seed_admin.sql` produces hashed password placeholder.
  - Write TypeScript data layer modules (e.g., `src/lib/repositories/*.ts`) abstracting `D1Database` interactions. ✅
  - Update API routes under `src/pages/api/admin/*` to use repositories with mock fallback. ✅
  - Provide seed script to prime local DB (products, categories, settings, demo admin) and document. ✅
  - Sketch plan to migrate front-end islands (store/cart) to fetch from APIs backed by DB once repository live.

## Risks & Unknowns
- Password hashing and session management not yet implemented; will require secure hash generation and cookie strategy.
- D1 query limits and performance: need pagination for admin lists.
- Migration ordering: ensure future changes can run on production DB without data loss.

## Immediate Next Actions
1. (Future) Wire authentication/session management before enabling real admin logins.
2. (Future) Add feature flag/logging when APIs fall back to mock store so devs notice missing DB binding.
3. (Future) Plan pagination/performance testing as dataset grows.

## Changelog
- **2025-09-25:** Added discovery that `astro dev` lacks D1 bindings, falling back to mock store and producing 404s on `/api/admin/*`. Brief updated with requirement to supply bindings during dev and highlight completed repository/migration work.
- **2025-09-26:** Middleware added to auto-bind local D1 during `npm run dev`; README updated to document behavior. Phase 1 & 2 items closed; remaining actions tracked as future enhancements.

