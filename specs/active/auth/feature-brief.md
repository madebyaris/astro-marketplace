# Auth & Session Brief — Astro Marketplace

## Context
- Admin dashboard currently uses mock users; `todo.md` Phase 3 outlines email/password auth, session cookies, guards, and login wiring.
- D1 schema already includes `users` table with `password_hash` and `is_admin`. Seed data provides a placeholder admin record (`0003_seed_admin.sql`).
- App runs on Cloudflare Pages + Functions; final production env should store sessions in KV (`SESSION` binding) and hash passwords securely.

## Problem & Goals
- Restrict `/admin` and related API routes to authenticated users.
- Provide email/password login with secure hash storage and server-side session management.
- Integrate with existing middleware and repositories so the admin UI becomes a real app, not a mock.

## Research Snapshot (15m)
- Astro server endpoints (via `APIRoute`) can access `context.locals.runtime.env` for D1 + KV bindings.
- Password hashing options: `@node-rs/bcrypt` (fast) or `bcryptjs` (pure JS). Cloudflare Workers support WebCrypto SubtleCrypto; `@noble/hashes` + `argon2-browser` also possible.
- Session management: sign tokens and store session data in KV; include HttpOnly cookie. Example: `SESSION:<uuid>` with JSON payload `{ userId, createdAt }`.
- Route protection: Astro's server-side middleware (`src/middleware.ts`) can examine cookies, load session, and gate `/admin` pages / API routes.

## Requirements
### Authentication
1. Login form submits email + password to `/api/auth/login` (POST).
2. Verify user exists in D1; compare hash using chosen algorithm.
3. On success, create session record in KV with TTL; set HttpOnly Secure cookie (`sessionId`).
4. Provide logout endpoint to delete KV entry and clear cookie.

### Authorization
5. Middleware checks incoming requests for session cookie; loads session/user, attaches to `locals`.
6. Redirect unauthenticated access to `/admin` routes back to `/login` (with flash message). APIs return 401.
7. Support `is_admin` flag; optionally allow future non-admin users for storefront.

### Security & UX
8. Hash passwords on create/update. Provide seed script hashed value (update `0003_seed_admin.sql`).
9. Rate-limit login attempts minimally (e.g., delay after failed login) or note future enhancement.
10. Ensure cookies use `Secure`, `HttpOnly`, `SameSite=Lax` (or `Strict`) and include `SESSION_SECRET` for HMAC or encryption if storing signed data.

### Tooling & Documentation
11. Update README with auth setup instructions (hash tool, session secret config, default admin credential guidance).
12. Add tests/manual checklist for login/logout flow.

## High-level Implementation
1. **Hashing Utility**: Choose bcrypt (likely `bcryptjs` for compatibility). Add helper to hash/verify passwords.
2. **User Repository**: Extend D1 repo for `users` (fetch by email, update password, create admin).
3. **Session Store**: Create module that wraps KV (`SESSION`). Provide `createSession(userId)`, `getSession(sessionId)`, `deleteSession(sessionId)`.
4. **Auth API Routes**:
   - `POST /api/auth/login` — validate input, verify password, create session, set cookie.
   - `POST /api/auth/logout` — delete session, clear cookie.
5. **Middleware Update**: Inspect cookies, load session, attach `locals.user`; protect `/admin` pages + API routes.
6. **Login Page**: Wire existing `/login` form to call login API, handle errors, redirect to `/admin` on success.
7. **Admin UI**: Update components to use `locals.user`; optionally display user info & logout button.

## Immediate Next Actions
1. Decide hashing library (bcrypt vs argon2) and add dependency.
2. Implement user + session repository modules (D1 + KV).
3. Create auth API routes & middleware guard.
4. Update `/login` page and README instructions.
5. Generate secure hash for seed admin; document how to rotate.

## Open Questions / Future Enhancements
- Multi-factor auth or password reset flows? (Out of scope now.)
- Do we need role-based access beyond `is_admin`? (Maybe later.)
- Should sessions store additional metadata (IP, UA) for analytics? (Optional.)

## Changelog
- **2025-09-26:** Initial auth brief drafted covering login, sessions, middleware, and documentation tasks.


