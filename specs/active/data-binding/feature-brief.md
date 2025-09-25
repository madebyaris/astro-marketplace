# Local Data Binding Brief

## Context
- Devs currently need Cloudflare Pages bindings (`env.DB`, `env.SESSION`) to exercise admin APIs. Running `astro dev` alone returns 404 because bindings are absent.
- Goal: keep the ergonomic `npm run dev` workflow while automatically attaching a local D1 connection (Wrangler state) during development.

## Problem & Goals
- Provide consistent API behavior between local dev and Cloudflare functions.
- Avoid extra commands for new contributors; `npm run dev` should be sufficient.
- Keep fallback to Cloudflare binding in production environments.

## Requirements
1. Detect local D1 state file (under `.wrangler/state/...` or `D1_LOCAL_PATH`). ✅
2. Attach D1 connection to `context.locals.runtime.env.DB` via middleware when running under `astro dev`. ✅
3. Document the behavior and configuration in `README.md`. ✅
4. Fail gracefully if the local DB file is missing (keep mock fallback). ✅

## Implementation
- Helper in `src/lib/db.ts` locates/instantiates Miniflare D1 database, respecting `D1_LOCAL_PATH`.
- Astro middleware (`src/middleware.ts`) attaches `env.DB` when absent.
- README documents automatic binding and override options.

## Risks & Considerations
- Ensure middleware does not run in production or override real Cloudflare bindings.
- Handle cross-platform paths (Mac/Windows) by resolving `.wrangler/state/...` dynamically.
- Persist in-memory mock fallback for cases where DB not found.

## Changelog
- **2025-09-25:** Initial brief created to formalize local binding automation.
- **2025-09-26:** Implementation completed; dev workflow requires only `npm run dev` after migrations.

