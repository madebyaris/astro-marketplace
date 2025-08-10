# Astro Marketplace

Monolithic marketplace on Cloudflare Pages + Functions with D1 (SQLite in dev), Astro + React + TypeScript + Tailwind.

## Quickstart

```bash
npm install
npm run dev
```

## Database (local)
```bash
# Apply migrations to local SQLite (via D1 local)
npm run db:migrate:local

# Seed sample data
npm run db:seed:local

# Inspect tables
npm run db:console:local
```

## Deploy (Cloudflare)
- Configure `wrangler.toml` D1 binding and `SESSION_SECRET`.
- Create a KV namespace for `SESSION` and set the binding in `wrangler.toml`.
- Connect repo to Cloudflare Pages (Functions enabled via adapter).

## API
- `GET /api/health` → `{ status: "ok" }`

## SEO
- `sitemap.xml` and `robots.txt` included.
