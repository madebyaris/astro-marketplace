# Deployment Guide

This project uses Nitro for portable deployment across multiple platforms.

## Prerequisites

1. **Database Setup**: Create a Turso database
   ```bash
   # Install Turso CLI
   curl -sSfL https://get.tur.so/install.sh | bash
   
   # Create database
   turso db create astro-marketplace
   
   # Get connection details
   turso db show astro-marketplace
   ```

2. **Environment Variables**: Copy `.env.example` to `.env` and configure:
   ```bash
   cp server/.env.example server/.env
   ```

## Deployment Options

### 1. Cloudflare Workers

```bash
# Build for Cloudflare
npm run build:cloudflare

# Deploy with Wrangler
cd server
wrangler deploy

# Set secrets
wrangler secret put SESSION_SECRET
wrangler secret put TURSO_AUTH_TOKEN
```

**Configuration:**
- Update `server/wrangler.toml` with your KV namespace ID
- Set environment variables in Cloudflare dashboard or via CLI

### 2. Node.js Hosting (Render, Railway, Vercel, etc.)

```bash
# Build for Node.js
npm run build:node

# Deploy the .output directory
```

**For Render:**
- Connect your GitHub repository
- Build Command: `npm run build:node`
- Start Command: `cd server && npm start`

**For Railway:**
- Connect your GitHub repository
- Railway will auto-detect the Node.js app
- Set environment variables in Railway dashboard

**For Vercel:**
- Install Vercel CLI: `npm i -g vercel`
- Run: `vercel --prod`
- Set environment variables in Vercel dashboard

### 3. Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY server/package*.json ./server/

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build:node

# Expose port
EXPOSE 3000

# Start the application
CMD ["cd", "server", "&&", "npm", "start"]
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `TURSO_DATABASE_URL` | Turso database URL | Yes |
| `TURSO_AUTH_TOKEN` | Turso authentication token | Yes |
| `SESSION_SECRET` | Secret for session encryption | Yes |
| `SESSION_DRIVER` | Session storage driver (`memory`, `redis`, `cloudflare-kv`) | No (defaults to `memory`) |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis URL (if using Redis) | No |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis token (if using Redis) | No |

## Session Storage Options

### Memory (Default)
- **Pros**: Simple, no external dependencies
- **Cons**: Sessions lost on restart, not suitable for production
- **Use Case**: Development, single-instance deployments

### Redis (Recommended for Production)
- **Pros**: Persistent, scalable, fast
- **Cons**: Requires Redis instance
- **Setup**: Create Upstash Redis instance, set `SESSION_DRIVER=redis`

### Cloudflare KV
- **Pros**: Integrated with Cloudflare, edge-distributed
- **Cons**: Cloudflare-specific, eventual consistency
- **Setup**: Create KV namespace, set `SESSION_DRIVER=cloudflare-kv`

## Database Migration

The database schema is defined in `migrations/`. To apply migrations:

```bash
# For local development with D1
npm run db:migrate:local
npm run db:seed:local

# For Turso (production)
# Use Turso CLI or web interface to run SQL from migrations/
```

## Monitoring and Logs

- **Cloudflare Workers**: Use Cloudflare dashboard for logs and analytics
- **Node.js**: Use platform-specific logging (Render, Railway, etc.)
- **Health Check**: Available at `/api/health`

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`
   - Check database permissions and network access

2. **Session Issues**
   - Verify `SESSION_SECRET` is set and consistent across instances
   - Check session storage driver configuration

3. **Build Errors**
   - Ensure all dependencies are installed: `npm ci`
   - Check Node.js version compatibility (18+)

### Development

```bash
# Start development servers
npm run dev

# This starts:
# - Nitro server on http://localhost:3000
# - Astro dev server on http://localhost:4321 (proxies /api to Nitro)
```

## Performance Optimization

1. **Database**: Use Turso's connection pooling
2. **Caching**: Implement Nitro's built-in caching for hot reads
3. **CDN**: Use Cloudflare or similar for static assets
4. **Monitoring**: Set up alerts for database and API performance
