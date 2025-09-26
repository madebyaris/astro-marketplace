# Progress Log — Auth & Sessions

## 2025-09-26
- Added `bcryptjs` utilities (`hashPassword`, `verifyPassword`) and updated admin seed hash to `Admin123!`.
- Created D1/KV repositories (`users`, `sessions`) for login workflow.
- Implemented `/api/auth/login` & `/api/auth/logout` endpoints; middleware now hydrates `locals.user` and guards `/admin` routes/APIs.
- Updated React login form to call API, handle errors, and redirect to `/admin` by default.

## Manual Verification
- Ran `npm run db:migrate:local` + `npm run db:seed:local` (hash updated).
- `npm run dev` ➜ POST `/api/auth/login` with seed admin succeeds; `/admin` accessible post-login.
- Invalid password returns 401 + error message; `/admin` while logged out redirects to `/login`.


