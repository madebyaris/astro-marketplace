import { createClient } from '@libsql/client'

export interface DatabaseAdapter {
  prepare<T = unknown>(query: string): PreparedStatement<T>
}

export interface PreparedStatement<T = unknown> {
  bind: (...params: unknown[]) => PreparedStatement<T>
  first: <U = T>(column?: string) => Promise<U | null>
  run: () => Promise<{ success: boolean; meta?: Record<string, unknown> }>
  all: <U = T>() => Promise<{ results: U[]; success: boolean; meta?: Record<string, unknown> }>
  raw: <U = unknown[]>() => Promise<U>
}

export class DatabaseError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message)
    this.name = 'DatabaseError'
  }
}

export class LibSQLAdapter implements DatabaseAdapter {
  private client: any

  constructor(databaseUrl: string, authToken?: string) {
    // Use HTTP client for both Node and Workers
    this.client = createClient({
      url: databaseUrl,
      authToken
    })
  }

  prepare<T = unknown>(query: string): PreparedStatement<T> {
    return new LibSQLPreparedStatement(this.client, query)
  }
}

class LibSQLPreparedStatement<T = unknown> implements PreparedStatement<T> {
  private params: unknown[] = []

  constructor(private client: any, private query: string) {}

  bind(...params: unknown[]): PreparedStatement<T> {
    this.params = params
    return this
  }

  async first<U = T>(column?: string): Promise<U | null> {
    try {
      const result = await this.client.execute({
        sql: this.query,
        args: this.params
      })
      
      if (result.rows.length === 0) return null
      
      const row = result.rows[0]
      if (column) {
        return row[column] as U
      }
      return row as U
    } catch (error) {
      throw new DatabaseError(`Failed to fetch row: ${this.query}`, error)
    }
  }

  async run(): Promise<{ success: boolean; meta?: Record<string, unknown> }> {
    try {
      const result = await this.client.execute({
        sql: this.query,
        args: this.params
      })
      
      return {
        success: true,
        meta: {
          changes: result.rowsAffected,
          lastInsertRowid: result.lastInsertRowid
        }
      }
    } catch (error) {
      throw new DatabaseError(`Failed to execute statement: ${this.query}`, error)
    }
  }

  async all<U = T>(): Promise<{ results: U[]; success: boolean; meta?: Record<string, unknown> }> {
    try {
      const result = await this.client.execute({
        sql: this.query,
        args: this.params
      })
      
      return {
        results: result.rows as U[],
        success: true,
        meta: {
          changes: result.rowsAffected
        }
      }
    } catch (error) {
      throw new DatabaseError(`Failed to run query: ${this.query}`, error)
    }
  }

  async raw<U = unknown[]>(): Promise<U> {
    try {
      const result = await this.client.execute({
        sql: this.query,
        args: this.params
      })
      
      return result.rows as U
    } catch (error) {
      throw new DatabaseError(`Failed to run raw query: ${this.query}`, error)
    }
  }
}

// Database instance factory
export function createDatabase(): DatabaseAdapter {
  const config = useRuntimeConfig()
  const databaseUrl = config.public.tursoDatabaseUrl
  const authToken = config.tursoAuthToken

  if (!databaseUrl) {
    throw new DatabaseError('TURSO_DATABASE_URL is required')
  }

  return new LibSQLAdapter(databaseUrl, authToken)
}
