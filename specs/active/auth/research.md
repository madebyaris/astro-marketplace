# Research Notes — Auth & Sessions

## Hashing Options
- `bcryptjs`: pure JS, compatible with Cloudflare Workers (no native deps). API: `hashSync(password, saltRounds)` / `compareSync`.
- `@node-rs/argon2`: faster but requires WASM; may need bundler config.
- Web Crypto: SubtleCrypto digest + PBKDF2 possible but more work.

## Session Strategy
- Use KV namespace `SESSION` (already defined). Store entries like `sessions:<uuid>` → `{ userId, createdAt, expiresAt }`.
- Generate UUID with `crypto.randomUUID()`.
- Cookie: `Set-Cookie: astro_session=<uuid>; HttpOnly; Secure; Path=/; SameSite=Lax; Max-Age=...`.
- Optionally sign cookie with `SESSION_SECRET` using HMAC for tamper detection (future enhancement).

## Middleware Pattern
- Astro middleware receives `context` with `locals`. We already use it to attach D1 in dev; can extend to attach `locals.user` if session valid.
- For page routes, redirect by returning `Response.redirect`. For API routes, return `401` JSON when unauthorized.

## Existing Assets
- `users` table columns: `email`, `password_hash`, `is_admin`. Need repo to fetch by email.
- Seed admin (`0003_seed_admin.sql`) currently stores placeholder hash (unknown algorithm). Replace with bcrypt hash of known password (e.g., `Admin123!`).
- Login page uses React `LoginForm` performing mock localStorage login; will replace with fetch to `/api/auth/login`.

## References
- Cloudflare Workers KV docs for storing sessions.
- Astro docs: [Middleware](https://docs.astro.build/en/guides/middleware/), [Server Endpoints](https://docs.astro.build/en/core-concepts/routing/#api-routes).


