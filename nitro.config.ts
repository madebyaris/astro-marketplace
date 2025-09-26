export default {
  preset: 'cloudflare',
  publicAssets: [
    {
      baseURL: '/',
      dir: 'dist',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    },
    {
      baseURL: '/',
      dir: 'public',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    }
  ],
  storage: {
    redis: {
      driver: 'redis',
      // Redis configuration will be set via environment variables
    },
    memory: {
      driver: 'memory'
    }
  },
  experimental: {
    wasm: true
  },
  cloudflare: {
    compatibilityDate: '2025-01-09'
  }
}
