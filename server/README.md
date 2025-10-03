# Nitro Server

Portable server backend for Astro Marketplace using Nitro framework.

## Folder Structure

```
server/
├── api/                    # API routes (auto-discovered)
│   ├── admin/             # Admin endpoints (/api/admin/*)
│   └── auth/              # Auth endpoints (/api/auth/*)
│
├── middleware/            # Request middleware
│   └── auth.ts           # Authentication & session handling
│
├── lib/                   # Explicit imports (not auto-imported)
│   ├── database/         # Database layer
│   │   ├── adapter.ts    # LibSQL adapter with D1-compatible API
│   │   └── helpers.ts    # Query helpers (queryAll, queryFirst, execute)
│   │
│   ├── session/          # Session management
│   │   └── store.ts      # SessionStore class with unstorage
│   │
│   └── repositories/     # Data access layer
│       ├── users.ts
│       ├── products.ts
│       ├── categories.ts
│       ├── settings.ts
│       └── pages.ts
│
├── utils/                 # Auto-imported utilities
│   └── auth.ts           # Password hashing, cookie helpers
│
├── nitro.config.ts       # Nitro configuration
├── package.json          # Dependencies
├── wrangler.toml         # Cloudflare Workers config
└── Procfile              # Node deployment config
```

## Key Concepts

### Auto-imports vs Explicit Imports

- **`utils/`**: Files here are auto-imported across the server. Use for small, frequently-used helpers.
- **`lib/`**: Requires explicit imports. Use for larger modules, classes, and anything with side effects.

### Database Layer

The database adapter (`lib/database/adapter.ts`) provides a provider-agnostic interface compatible with D1's API:
- `DatabaseAdapter` interface
- `LibSQLAdapter` implementation using `@libsql/client`
- Works with both Cloudflare Workers and Node.js

Helper functions in `lib/database/helpers.ts`:
- `queryAll<T>()` - Fetch multiple rows
- `queryFirst<T>()` - Fetch single row
- `execute()` - Run mutations

### Session Management

Session store (`lib/session/store.ts`) uses unstorage for portable session management:
- Memory driver (development)
- Cloudflare KV (Workers)
- Redis/Upstash (production Node.js)

### Repositories

Data access layer in `lib/repositories/` follows the repository pattern:
- Each repository handles one entity (users, products, etc.)
- Uses DatabaseAdapter for queries
- Returns domain models

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for Node.js
npm run build:node

# Build for Cloudflare
npm run build:cloudflare

# Preview build
npm run preview
```

## Environment Variables

Required:
- `TURSO_DATABASE_URL` - Turso/LibSQL database URL
- `TURSO_AUTH_TOKEN` - Database authentication token
- `SESSION_SECRET` - Secret for session encryption

Optional:
- `SESSION_DRIVER` - Session storage driver (memory|redis|cloudflare-kv)
- `UPSTASH_REDIS_REST_URL` - Redis URL for session storage
- `UPSTASH_REDIS_REST_TOKEN` - Redis authentication token

## Deployment

See [DEPLOYMENT.md](../DEPLOYMENT.md) in project root for detailed deployment instructions.

## Adding New Features

### Add API Route

Create file in `server/api/`:
```typescript
// server/api/example.get.ts
export default defineEventHandler(async (event) => {
  return { message: 'Hello from /api/example' }
})
```

### Add Repository

Create file in `server/lib/repositories/`:
```typescript
// server/lib/repositories/example.ts
import type { DatabaseAdapter } from '../database/adapter'
import { queryAll } from '../database/helpers'

export async function listExamples(db: DatabaseAdapter) {
  const { rows } = await queryAll(db, 'SELECT * FROM examples')
  return rows
}
```

### Add Utility

Create file in `server/utils/`:
```typescript
// server/utils/example.ts
export function formatExample(data: string) {
  return data.toUpperCase()
}

// Auto-imported everywhere in server code:
// const result = formatExample('hello')
```
