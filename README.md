# Astro Marketplace

## What is this?
Astro Marketplace is a modern storefront + admin starter built with Astro (static), Nitro (backend), React, and Tailwind, designed for independent sellers who:
- Want a fast, SEO‑optimized product website under their own domain
- Sell directly on the site or redirect customers to marketplaces (Tokopedia, Shopee, etc.)
- Need simple admin tools to manage products, pages (About/Privacy/Policy), and basic SEO settings
- Require flexible deployment options (Cloudflare, Vercel, Render, Railway, or any Node.js host)

**New in v2.0**: Migrated to a portable Nitro backend for multi-platform deployment flexibility!

![Astro Marketplace Frontpage](asset-git/frontpage.png)

## Architecture

The application uses a modern split architecture:
- **Frontend**: Astro static site generation (SSG) with React islands
- **Backend**: Nitro server with portable API routes
- **Database**: LibSQL/Turso (SQLite-compatible, works everywhere)
- **Sessions**: Unstorage with multiple driver options (memory, Redis, Cloudflare KV)

```
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  Astro (Static)  │───▶│  Nitro Server    │───▶│   Turso DB       │
│  568 KB          │    │  1.6 MB          │    │   LibSQL         │
└──────────────────┘    └──────────────────┘    └──────────────────┘
```

## Features

### Storefront
- **Pages**: Home (`/`), Store (`/store`), Product (`/product/[slug]`), Cart (`/cart`), Checkout (`/checkout`)
- **Content**: About (`/about`), Privacy (`/privacy`), Policy (`/kebijakan`), Contact (`/contact`)
- **Cart & Checkout**: localStorage cart with quantity stepper and checkout form validation
- **Affiliate Tracking**: Click tracking for marketplace links with analytics

### SEO
- Canonical URLs, Open Graph, Twitter meta tags
- Product JSON-LD structured data
- Dynamic `sitemap.xml` and `robots.txt`
- Configurable OG image and canonical domain

### Admin Dashboard (`/admin`)
- **Products**: Full CRUD with images, descriptions, pricing, stock, marketplace URLs
- **Categories**: Manage product categories
- **Pages**: Edit About/Privacy/Policy content
- **Settings**: Site title, description, purchasing toggle, SEO settings
- **Statistics**: Affiliate link click analytics with charts
- **Integrations**: SMTP and S3 configuration

### API Routes (17 total)
All routes are portable and work on any deployment target:
- **Auth**: `/api/auth/login`, `/api/auth/logout`
- **Admin**: Products, Categories, Settings, Pages, Config, Statistics
- **Affiliate**: `/api/affiliate/track` - Click tracking
- **System**: `/api/health` - Health check

## Installation (local)

### Prerequisites
- Node.js 20+ and npm
- (Optional) Turso CLI for database setup

### Quick Start

```bash
# Install dependencies
npm install
cd server && npm install && cd ..

# Start development server (both Astro and Nitro)
npm run dev
```

The site will be available at:
- **Frontend**: `http://localhost:4321`
- **Backend API**: `http://localhost:3000`

## Database Setup

### Using Turso (Recommended for Production)

1. **Install Turso CLI**:
```bash
curl -sSfL https://get.tur.so/install.sh | bash
```

2. **Create database**:
```bash
turso db create astro-marketplace
```

3. **Get credentials**:
```bash
turso db show astro-marketplace
```

4. **Configure environment** (create `server/.env`):
```bash
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your-turso-auth-token
SESSION_SECRET=your-secure-random-secret
```

5. **Run migrations**:
```bash
turso db shell astro-marketplace < migrations/0001_init.sql
turso db shell astro-marketplace < migrations/0002_seed.sql
turso db shell astro-marketplace < migrations/0003_seed_admin.sql
turso db shell astro-marketplace < migrations/0004_affiliate_click_logs.sql
turso db shell astro-marketplace < migrations/0005_admin_extensions.sql
```

### Using Local SQLite (Development)

For local development without Turso:
```bash
# Create a local SQLite database
sqlite3 local.db < migrations/0001_init.sql
sqlite3 local.db < migrations/0002_seed.sql
sqlite3 local.db < migrations/0003_seed_admin.sql

# Configure environment
echo "TURSO_DATABASE_URL=file:./local.db" > server/.env
echo "SESSION_SECRET=dev-secret-change-in-production" >> server/.env
```

### Default Admin User
The seed includes a demo admin:
- **Email**: `arissetia.m@gmail.com`
- **Password**: `Admin123!`

⚠️ **Change this before production!**

## Admin Access
- **URL**: `/admin`
- **Auth**: Login via `/login` with credentials above
- **Sessions**: Stored in configured session driver (memory/Redis/KV)
- **Protection**: Middleware guards all `/admin` routes and `/api/admin/*` endpoints

## Development

### Available Scripts

```bash
# Development (runs both Astro and Nitro)
npm run dev

# Build for Node.js deployment
npm run build:node

# Build for Cloudflare Workers
npm run build:cloudflare

# Build only Astro (static)
cd / && astro build

# Build only Nitro server
cd server && npm run build

# Preview production build
cd server && npm run preview
```

## Deployment

### 1. Cloudflare Workers

```bash
# Build for Cloudflare
npm run build:cloudflare

# Deploy
cd server && npx wrangler deploy
```

**Environment variables** (set via Wrangler):
```bash
wrangler secret put TURSO_DATABASE_URL
wrangler secret put TURSO_AUTH_TOKEN
wrangler secret put SESSION_SECRET
```

Optional: Configure KV for sessions in `server/wrangler.toml`

### 2. Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Build
npm run build:node

# Deploy
vercel --prod
```

Configure environment variables in Vercel dashboard.

### 3. Render / Railway

```bash
# Build
npm run build:node

# Upload server/.output directory to your host
```

Set environment variables in your hosting dashboard.

### 4. Generic Node.js

```bash
# Build
npm run build:node

# Run
cd server/.output && node server/index.mjs
```

Default port: 3000 (configure via `PORT` environment variable)

## Environment Variables

### Required

```bash
# Database
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your-turso-auth-token

# Sessions
SESSION_SECRET=your-secure-random-secret-min-32-chars
```

### Optional

```bash
# Session driver (default: memory)
SESSION_DRIVER=memory  # or 'redis', 'cloudflare-kv'

# Redis (if using redis driver)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token

# Server
PORT=3000  # Default port for Node.js
```

## Project Structure

```
/
├── src/                    # Astro frontend (static)
│   ├── components/         # React islands & Astro components
│   ├── layouts/            # Page layouts
│   ├── pages/              # Static pages & routes
│   └── lib/                # Client-side utilities
│
├── server/                 # Nitro backend
│   ├── api/                # API routes (17 files)
│   │   ├── auth/           # Authentication
│   │   ├── admin/          # Admin endpoints
│   │   └── affiliate/      # Affiliate tracking
│   ├── lib/                # Core logic
│   │   ├── database/       # DB adapter & helpers
│   │   ├── session/        # Session store
│   │   └── repositories/   # Data access layer
│   ├── middleware/         # Auth middleware
│   ├── types/              # TypeScript definitions
│   ├── utils/              # Auto-imported helpers
│   └── nitro.config.ts     # Nitro configuration
│
├── migrations/             # Database migrations
├── dist/                   # Astro build output (568 KB)
└── specs/                  # Documentation & specs
```

## API Reference

### Public Endpoints
- `GET /api/health` → Health check
- `POST /api/affiliate/track` → Track affiliate clicks

### Auth Endpoints
- `POST /api/auth/login` → User authentication
- `POST /api/auth/logout` → Logout & session cleanup

### Admin Endpoints (Protected)
All require authentication via session cookie:
- `GET/POST/PUT/DELETE /api/admin/products`
- `GET/POST/PUT/DELETE /api/admin/categories`
- `GET/PUT /api/admin/settings`
- `GET/PUT /api/admin/pages`
- `GET/PUT /api/admin/config`
- `GET /api/admin/statistics`

## Sitemap
Automatically includes: `/`, `/store`, `/admin`, `/privacy`, `/kebijakan`, `/about`, `/contact`, `/cart`, `/checkout`, and all product pages.

## Migration from v1.x

If you're upgrading from the old Cloudflare-specific version:
1. Review `NITRO_MIGRATION_COMPLETE.md` for full migration guide
2. Set up Turso database (replaces D1)
3. Configure environment variables
4. Test locally with `npm run dev`
5. Deploy to your chosen platform

See `specs/active/nitro-migration/` for detailed migration documentation.

## Documentation

- `DEPLOYMENT.md` - Detailed deployment guide
- `NITRO_MIGRATION_COMPLETE.md` - Migration overview
- `server/README.md` - Server architecture
- `server/STRUCTURE.md` - Folder structure explanation
- `specs/active/nitro-migration/` - Full migration specs

## Troubleshooting

### "TURSO_DATABASE_URL is required" error
- Ensure `server/.env` exists with database credentials
- Check that environment variables are set in your deployment platform

### Build fails with Astro compiler error
- This is a known Astro bug with `set:html` directive
- The codebase has been updated to work around this issue

### Session not persisting
- Check `SESSION_SECRET` is set
- For production, use Redis or Cloudflare KV instead of memory driver
- Verify session cookie domain matches your deployment domain

## Performance

- **Frontend**: 568 KB static build (~59 KB gzip for client bundle)
- **Backend**: 1.6 MB Nitro server (188 KB gzip for Node.js, 84.8 KB for Cloudflare)
- **Build time**: ~3 seconds total (Astro + Nitro)
- **First load**: Optimized with static pages and lazy-loaded islands

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally with `npm run dev`
5. Submit a pull request

## License

MIT License - feel free to use this for your own projects!

## Support

For issues or questions:
1. Check the documentation in `specs/` and root directory
2. Review `DEPLOYMENT.md` for deployment-specific issues
3. Open an issue on GitHub

---

**Built with**: Astro, Nitro, React, Tailwind CSS, LibSQL/Turso  
**Version**: 2.0 (Portable Nitro Backend)  
**Status**: Production Ready ✅
