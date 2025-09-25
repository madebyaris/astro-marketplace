# Implementation Plan — Cloudflare Setup & Data Schema

## Scope
- Phase 1: Cloudflare environment readiness (D1 + KV, secrets, image config, docs/scripts).
- Phase 2: Data schema integration with runtime (repository layer, API rewiring, seed validation).

## Tasks
1. **Configuration & Docs**
   - Update `wrangler.toml` guidance (placeholder comments, instructions).
   - Ensure `astro.config.mjs` sets `imageService: "compile"` to satisfy Cloudflare limits.
   - Extend README with Cloudflare provisioning + local dev workflow (D1 + KV + secrets).
2. **Database Helpers**
   - Build lightweight D1 helper (`src/lib/db.ts` or new module) for query execution, result parsing, transactions.
   - Define repository modules for products, categories, settings, affiliate links, orders summary (initial focus on admin needs).
3. **API Migration**
   - Update admin API endpoints to use repositories instead of `admin-store.ts`.
   - Maintain feature parity: list/create/update/delete for products & categories, settings/pages/config retrieval.
   - Handle error cases (not found, validation, DB errors) with appropriate HTTP status.
4. **Seed & Migrations Review**
   - Confirm admin seed includes hashed placeholder; adjust if necessary.
   - Optionally add migration for static pages/settings if missing.
   - Create consolidated seed script/SQL for initial data.
5. **Cleanup & Transitional Support**
   - Keep `admin-store.ts` for fallback/mock, but mark as deprecated.
   - Add feature flag or environment-driven switch if needed.
6. **Testing & Verification**
   - Document manual test plan (Wrangler local D1, API requests).
   - Provide instructions for running API smoke tests (curl/httpie examples).

## Risks & Mitigations
- D1 SQL differences vs SQLite; use parameterized queries and simple statements.
- Astro Cloudflare env access varies; verify runtime API and adjust wrappers.
- Legacy UI still expects admin-store shape; ensure API responses match current schema fields.

## Deliverables
- Updated configs/docs (`astro.config.mjs`, `README.md`, `wrangler.toml` comments).
- New repository modules and helper utilities.
- Refactored API endpoints wired to D1.
- Optional: new migration(s) if schema gaps discovered.
- Testing notes / progress log in `progress.md`.

