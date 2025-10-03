import type { DatabaseAdapter } from './adapter'

export async function queryAll<T>(db: DatabaseAdapter, sql: string, params: unknown[] = []): Promise<{ rows: T[] }> {
  const stmt = db.prepare<T>(sql).bind(...params)
  const { results } = await stmt.all<T>()
  return { rows: results ?? [] }
}

export async function queryFirst<T>(db: DatabaseAdapter, sql: string, params: unknown[] = []): Promise<T | null> {
  const stmt = db.prepare<T>(sql).bind(...params)
  return await stmt.first<T>()
}

export async function execute(db: DatabaseAdapter, sql: string, params: unknown[] = []) {
  const stmt = db.prepare(sql).bind(...params)
  return await stmt.run()
}
