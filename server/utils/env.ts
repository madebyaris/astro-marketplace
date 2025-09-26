// Cloudflare types
interface D1Database {
  prepare: (query: string) => any
  exec: (query: string) => any
}

interface KVNamespace {
  get: (key: string) => Promise<string | null>
  put: (key: string, value: string, options?: any) => Promise<void>
  delete: (key: string) => Promise<void>
}

export interface CloudflareEnv {
  DB: D1Database
  SESSION: KVNamespace
  SESSION_SECRET: string
}

export function getEnv(): CloudflareEnv {
  // In Cloudflare Workers, these are available as global bindings
  const global = globalThis as any
  return {
    DB: global.DB as D1Database,
    SESSION: global.SESSION as KVNamespace,
    SESSION_SECRET: global.SESSION_SECRET as string || 'fallback-secret'
  }
}

export function getDB(): D1Database | null {
  const env = getEnv()
  return env.DB || null
}

export function getSessionKV(): KVNamespace | null {
  const env = getEnv()
  return env.SESSION || null
}

export function getSessionSecret(): string {
  const env = getEnv()
  return env.SESSION_SECRET
}
