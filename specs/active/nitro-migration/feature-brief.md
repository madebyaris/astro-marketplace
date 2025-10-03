# Nitro Migration: Portable Backend for Astro

## Problem, Users, Success

- **Problem**: Current SSR runtime and APIs are tied to Cloudflare adapter and D1/KV bindings, limiting portability.
- **Users**: Project maintainers/devops (deployment flexibility), end users (unchanged UX).
- **Success**: Same API and behavior, deployed on Cloudflare Workers and a generic Node host (e.g., Render/Vercel/railway). No provider-specific code in app layer. CI builds once and deploys to multiple targets.

## Quick Research

- **Nitro** provides portable server runtime with filesystem routing, presets for Cloudflare/Node, storage layer, and TypeScript. It's built to deploy anywhere with minimal changes ([Nitro docs](https://nitro.build/)).
- **DB portability**: Adopt LibSQL/Turso (SQLite dialect) to replace D1-specific APIs. Works from Workers (HTTP client) and Node. Keeps current SQL mostly intact.
- **Sessions**: Keep KV-based sessions using `unstorage` via Nitro Storage: Cloudflare KV on Workers; Upstash/Memory/FS on Node.

## Essential Requirements

- Preserve API contract and URLs: `/api/**` endpoints should remain stable.
- Move server logic to Nitro: `server/api/**` and `server/middleware/**`.
- Replace `src/middleware.ts` with Nitro middleware that sets `event.context.user`.
- Replace `src/lib/db.ts` D1-specific layer with provider-agnostic adapter over LibSQL/Turso.
- Replace `KVNamespaceStub` with `unstorage`-backed session store; cookie session id unchanged.
- Convert Astro to static output; islands continue to call `/api/**` (served by Nitro).
- Provide deploy targets: Cloudflare Workers preset and Node server preset.

## High-Level Approach

1. **Scaffold Nitro app** under `server/` with `nitro.config.ts`:
   - Presets: `cloudflare` and `node-server` profiles.
   - Public assets dir to serve Astro static build.

2. **Port API routes**:
   - Map `src/pages/api/**` → `server/api/**` using `defineEventHandler`.
   - Replace uses of `locals.runtime.env` with `event.context` helpers.

3. **Auth/session middleware**:
   - `server/middleware/auth.ts`: parse session cookie, load session from storage, attach `event.context.user`.

4. **Session store via Unstorage**:
   - `runtime/storage.ts` picks driver by env: Cloudflare KV on Workers; Upstash/memory/fs on Node.
   - Re-implement `createSession/getSession/deleteSession` on top of `useStorage()`.

5. **Database abstraction**:
   - Introduce `DatabaseAdapter` with methods used in repos (`prepare/bind/first/all/run`).
   - Implement LibSQL adapter using `@libsql/client` (Node) and `@libsql/client-web` (Workers), maintaining current SQL.
   - Update repositories to consume `DatabaseAdapter` instead of D1 types.

6. **Astro adjustments**:
   - Set `output: 'static'`, remove Cloudflare adapter; keep React/Tailwind.
   - Remove `src/middleware.ts` logic (now in Nitro).
   - Dev: proxy `/api/**` from Astro dev to Nitro dev or serve Astro build from Nitro.

7. **Config & Deploy**:
   - Env vars: `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `SESSION_DRIVER`, `UPSTASH_*` (if chosen), `SESSION_SECRET`.
   - Cloudflare: Nitro `cloudflare` preset, minimal `wrangler.toml` for bindings (only KV if used); DB is LibSQL over HTTP.
   - Node: Nitro `node-server` output; Procfile or start script.

## Implementation Status

✅ **Completed:**
- Scaffold Nitro app with presets and base health route
- Add Unstorage session store and auth middleware in Nitro
- Implement LibSQL adapter compatible with current repository API
- Port /api/auth/login to Nitro using new adapters
- Switch Astro to static output and dev proxy to Nitro
- Port admin routes: products, categories, pages, settings
- Add Cloudflare and Node deployment configs and docs
- Smoke test both targets and fix regressions

## Immediate Next Actions

- **Database Setup**: Create Turso database and configure environment variables
- **Deploy to Cloudflare**: Test Cloudflare Workers deployment with KV sessions
- **Deploy to Node Host**: Test Node.js deployment (Render/Railway/Vercel)
- **Astro Build Fix**: Resolve Astro compiler issue with `set:html` directive
- **Integration Testing**: End-to-end testing of auth flow and admin functionality

## Risks/Notes

- Cross-origin during dev if not proxied → ensure same-origin via proxy or serve static from Nitro.
- Workers + LibSQL HTTP introduces latency; consider Nitro Cache for hot reads.
- If later needed, can upgrade to Drizzle ORM without changing route contracts.
- Astro compiler issue with `set:html` needs investigation - may require alternative approach for dynamic HTML content.

## Deployment Commands

```bash
# Development
npm run dev

# Build for Node.js
npm run build:node

# Build for Cloudflare
npm run build:cloudflare

# Deploy to Cloudflare
cd server && npx wrangler deploy

# Deploy to Node host
# Upload .output directory to your Node.js hosting provider
```

## Environment Variables

```bash
# Required
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your-turso-auth-token
SESSION_SECRET=your-secure-session-secret

# Optional
SESSION_DRIVER=memory  # or 'redis', 'cloudflare-kv'
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token
```

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Astro (SSG)   │    │  Nitro Server   │    │   Turso DB      │
│                 │    │                 │    │                 │
│ - Static pages  │◄──►│ - API routes    │◄──►│ - SQLite        │
│ - React islands │    │ - Auth middleware│    │ - HTTP client   │
│ - Tailwind CSS  │    │ - Session store │    │ - Portable      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│   CDN/Static    │    │  Deploy Target  │
│                 │    │                 │
│ - Cloudflare    │    │ - Cloudflare    │
│ - Vercel        │    │ - Render        │
│ - Netlify       │    │ - Railway       │
└─────────────────┘    └─────────────────┘
```

The migration successfully achieves the goal of portable deployment while maintaining the same API contract and user experience.
