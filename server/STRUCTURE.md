# Server Folder Structure

This document explains the Nitro server folder structure and conventions.

## Directory Overview

```
server/
├── api/              # API Routes
├── middleware/       # Request Middleware
├── routes/          # Catch-all Routes
├── lib/             # Libraries (Explicit Imports)
├── types/           # TypeScript Types
├── utils/           # Utilities (Auto-imported)
└── [config files]   # Configuration
```

## Detailed Structure

### `api/` - API Routes
Auto-discovered API endpoints following Nitro's filesystem routing.

```
api/
├── admin/           # Admin endpoints (/api/admin/*)
│   ├── products.get.ts     → GET /api/admin/products
│   ├── products.post.ts    → POST /api/admin/products
│   ├── products.put.ts     → PUT /api/admin/products
│   ├── products.delete.ts  → DELETE /api/admin/products
│   ├── categories.*        → Category CRUD
│   ├── settings.*          → Settings CRUD
│   └── pages.*             → Pages CRUD
├── auth/            # Auth endpoints (/api/auth/*)
│   └── login.post.ts       → POST /api/auth/login
└── health.get.ts    # Health check → GET /api/health
```

**Convention**: File name format is `[name].[method].ts`
- `health.get.ts` = GET /api/health
- `login.post.ts` = POST /api/auth/login

### `middleware/` - Request Middleware
Runs on every request before route handlers.

```
middleware/
└── auth.ts          # Authentication & session handling
```

**Features**:
- Parse session cookie
- Load session from storage
- Attach user to `event.context`
- Redirect unauthorized users

### `routes/` - Catch-all Routes
Handle requests not matched by API routes.

```
routes/
└── [...].ts         # Catch-all route (serves Astro static files)
```

### `lib/` - Libraries (Explicit Imports)
Requires explicit imports. Use for larger modules and classes.

```
lib/
├── database/        # Database Layer
│   ├── adapter.ts   # DatabaseAdapter interface & LibSQL implementation
│   └── helpers.ts   # Query utilities (queryAll, queryFirst, execute)
│
├── session/         # Session Management
│   └── store.ts     # SessionStore class with unstorage
│
└── repositories/    # Data Access Layer
    ├── users.ts     # User CRUD operations
    ├── products.ts  # Product CRUD operations
    ├── categories.ts # Category CRUD operations
    ├── settings.ts   # Settings CRUD operations
    └── pages.ts      # Pages CRUD operations
```

**Import Example**:
```typescript
import { createDatabase } from '../../lib/database/adapter'
import { listProducts } from '../../lib/repositories/products'
```

### `types/` - TypeScript Types
Centralized type definitions shared across the server.

```
types/
└── index.ts         # All shared types
```

**Includes**:
- `User` - User entity
- `SessionData` - Session data
- `Product` - Product entity
- `Category`, `Settings`, `PagesContent` - Other entities
- `AffiliateLink` - Affiliate link data
- H3 event context extension

**Import Example**:
```typescript
import type { User, Product } from '../../types'
```

### `utils/` - Utilities (Auto-imported)
Auto-imported everywhere in server code. Use for small, frequently-used helpers.

```
utils/
└── auth.ts          # Password hashing & cookie helpers
```

**Auto-imported functions**:
- `hashPassword(password)` - Hash password with bcrypt
- `verifyPassword(password, hash)` - Verify password
- `createSessionCookie(id, maxAge)` - Create session cookie string

**Usage** (no import needed):
```typescript
const hash = hashPassword('password123')
const isValid = verifyPassword('password123', hash)
```

## Import Conventions

### From API Routes (`api/**`)
```typescript
// Database
import { createDatabase } from '../../lib/database/adapter'

// Repositories
import { listProducts } from '../../lib/repositories/products'

// Session
import { createSessionStore } from '../../lib/session/store'

// Types
import type { Product } from '../../types'

// Utils (auto-imported, no import needed)
hashPassword('password')
```

### From Middleware
```typescript
// Database
import { createDatabase } from '../lib/database/adapter'

// Repositories
import { findUserById } from '../lib/repositories/users'

// Types
import type { User } from '../types'
```

### From Repositories
```typescript
// Database
import type { DatabaseAdapter } from '../database/adapter'
import { queryAll, execute } from '../database/helpers'

// Types
import type { Product } from '../../types'
```

## Configuration Files

- `nitro.config.ts` - Nitro configuration
- `package.json` - Dependencies and scripts
- `wrangler.toml` - Cloudflare Workers config
- `Procfile` - Node deployment config
- `README.md` - General documentation
- `STRUCTURE.md` - This file

## Adding New Features

### Add API Route
Create file in `api/`:
```typescript
// server/api/example.get.ts
export default defineEventHandler(async (event) => {
  return { message: 'Hello!' }
})
```
Access at: `GET /api/example`

### Add Repository
Create file in `lib/repositories/`:
```typescript
// server/lib/repositories/example.ts
import type { DatabaseAdapter } from '../database/adapter'
import { queryAll } from '../database/helpers'

export async function listExamples(db: DatabaseAdapter) {
  const { rows } = await queryAll(db, 'SELECT * FROM examples')
  return rows
}
```

### Add Type
Add to `types/index.ts`:
```typescript
export interface Example {
  id: number
  name: string
}
```

### Add Utility
Create file in `utils/`:
```typescript
// server/utils/example.ts
export function formatExample(data: string) {
  return data.toUpperCase()
}
```
Use anywhere without import:
```typescript
const result = formatExample('hello') // 'HELLO'
```

## Best Practices

1. **Use `lib/` for explicit imports** - Database, repositories, session store
2. **Use `utils/` for auto-imports** - Small helpers, formatters, validators
3. **Centralize types in `types/`** - Avoid duplicate interface definitions
4. **Follow naming conventions** - `[name].[method].ts` for API routes
5. **Keep repositories thin** - Focus on database operations only
6. **Use TypeScript** - Always type your functions and returns
