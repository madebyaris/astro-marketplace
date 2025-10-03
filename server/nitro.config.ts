import { defineNitroConfig } from 'nitropack/config'

export default defineNitroConfig({
  compatibilityDate: '2025-10-03',
  // Serve static files from Astro build
  publicAssets: [
    {
      baseURL: '/',
      dir: '../dist',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    }
  ],
  
  // Runtime config for environment variables
  runtimeConfig: {
    // Private keys (only available on server-side)
    sessionSecret: process.env.SESSION_SECRET || 'dev-secret-change-in-production',
    tursoAuthToken: process.env.TURSO_AUTH_TOKEN,
    
    // Public keys (exposed to client-side)
    public: {
      tursoDatabaseUrl: process.env.TURSO_DATABASE_URL,
      sessionDriver: process.env.SESSION_DRIVER || 'memory'
    }
  },

  // Storage configuration
  storage: {
    // Session storage - driver selected by SESSION_DRIVER env var
    sessions: {
      driver: process.env.SESSION_DRIVER || 'memory',
      // Cloudflare KV configuration
      ...(process.env.SESSION_DRIVER === 'cloudflare-kv' && {
        binding: 'SESSION'
      }),
      // Upstash Redis configuration
      ...(process.env.SESSION_DRIVER === 'redis' && {
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN
      })
    }
  },

  // Preset-specific configurations
  cloudflare: {
    // Cloudflare Workers specific settings
    compatibilityDate: '2024-01-01'
  },

  // Development settings
  devProxy: {
    '/api': {
      target: 'http://localhost:3000/api',
      changeOrigin: true
    }
  }
})
