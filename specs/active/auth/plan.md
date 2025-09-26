# Implementation Plan — Auth & Sessions

## Scope
- Implement email/password login backed by D1 `users` table.
- Manage sessions using Cloudflare KV (SESSION binding) with HttpOnly cookie.
- Protect `/admin` pages & APIs; update login page and documentation.

## Tasks
1. **Hashing & User Utilities**
   - Choose bcrypt (via `bcryptjs`) for hashing/verification.
   - Add helper functions: `hashPassword`, `verifyPassword`, `createSeedHash` script or note.
2. **Repositories**
   - Create `users` repository (fetch by email/id, create/update hashed password).
   - Build `sessions` repository wrapping KV with TTL + serialization.
3. **Middleware & Guards**
   - Extend `src/middleware.ts` to read session cookie, load user, attach `locals.user`.
   - Block `/admin` routes and admin APIs when unauthenticated; redirect or return 401.
4. **API Routes**
   - `POST /api/auth/login`: validate, verify password, create session, set cookie.
   - `POST /api/auth/logout`: remove session, clear cookie.
   - Optional: `GET /api/auth/me` for client hydration.
5. **UI Integration**
   - Update `LoginForm` to call login API, display errors, redirect to `/admin` on success.
   - Add logout control (e.g., button in admin header) calling logout endpoint.
6. **Docs & Seeds**
   - Update `README.md` with auth instructions and hashing note.
   - Ensure `0003_seed_admin.sql` uses bcrypt hash that matches documented password.
7. **Testing**
   - Manual QA checklist in `progress.md` covering login, guard redirects, invalid password handling.

## Risks & Mitigations
- **Hash Compatibility:** Workers may have limited crypto; use `bcryptjs` to avoid native bindings.
- **KV Latency:** Sessions rely on KV; add caching via locals if necessary (optional for now).
- **Security:** ensure cookies are HttpOnly/Secure and use `SESSION_SECRET` for signing; fallback to simple random UUID stored only in KV if signing not needed immediately.

## Deliverables
- Password utility module.
- `users` and `sessions` repositories.
- Auth API routes and middleware updates.
- Updated login UI and docs.
- Progress log note and README auth section.


