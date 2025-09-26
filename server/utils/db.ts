import { getDB } from './env'
import { createLocalD1 } from '../../src/lib/db'

interface D1Database {
  prepare: (query: string) => any
  exec: (query: string) => any
}

export async function getDatabase(): Promise<D1Database | null> {
  const db = getDB()
  if (db) return db
  
  // Fallback to local D1 for development
  const localDb = await createLocalD1()
  return localDb || null
}
