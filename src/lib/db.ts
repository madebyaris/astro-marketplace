export type D1PreparedStatement<T = unknown> = {
  bind: (...params: unknown[]) => D1PreparedStatement<T>;
  first: <U = T>(column?: string) => Promise<U | null>;
  run: () => Promise<{ success: boolean; meta?: Record<string, unknown> }>;
  all: <U = T>() => Promise<{ results: U[]; success: boolean; meta?: Record<string, unknown> }>;
  raw: <U = unknown[]>() => Promise<U>;
};

export type D1Database = {
  prepare: <T = unknown>(query: string) => D1PreparedStatement<T>;
};

let cachedLocalDb: D1Database | undefined;
let attemptedLocalDb = false;

/**
 * Utility for local development: attach a D1 SQLite connection (wrangler state file)
 * to the Astro runtime locals when running under `astro dev`.
 */
export async function createLocalD1(): Promise<D1Database | undefined> {
  if (typeof process === 'undefined') return undefined;
  if (attemptedLocalDb) return cachedLocalDb;
  attemptedLocalDb = true;

  let dbPath = process.env.D1_LOCAL_PATH;
  if (!dbPath) {
    try {
      const { join } = await import('node:path');
      const fs = await import('node:fs');
      const baseDir = join(process.cwd(), '.wrangler/state/v3/d1/miniflare-D1DatabaseObject');
      if (fs.existsSync(baseDir)) {
        const candidate = fs.readdirSync(baseDir).find((file) => file.endsWith('.sqlite'));
        if (candidate) dbPath = join(baseDir, candidate);
      }
    } catch (error) {
      console.warn('[dev] Failed to resolve local D1 file', error);
    }
  }

  if (!dbPath) {
    return undefined;
  }

  try {
    const fs = await import('node:fs');
    if (!fs.existsSync(dbPath)) {
      return undefined;
    }
    const { D1Database: WorkerD1Database } = await import('@miniflare/d1');
    cachedLocalDb = new WorkerD1Database(dbPath) as unknown as D1Database;
    return cachedLocalDb;
  } catch (error) {
    console.warn('[dev] Could not initialize local D1 database', error);
    return undefined;
  }
}

export class DatabaseError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export type QueryResult<T> = {
  rows: T[];
};

export async function queryAll<T>(db: D1Database, sql: string, params: unknown[] = []): Promise<QueryResult<T>> {
  try {
    const stmt = db.prepare<T>(sql).bind(...params);
    const { results } = await stmt.all<T>();
    return { rows: results ?? [] };
  } catch (error) {
    throw new DatabaseError(`Failed to run query: ${sql}`, error);
  }
}

export async function queryFirst<T>(db: D1Database, sql: string, params: unknown[] = []): Promise<T | null> {
  try {
    const stmt = db.prepare<T>(sql).bind(...params);
    return await stmt.first<T>();
  } catch (error) {
    throw new DatabaseError(`Failed to fetch row: ${sql}`, error);
  }
}

export async function execute(db: D1Database, sql: string, params: unknown[] = []) {
  try {
    const stmt = db.prepare(sql).bind(...params);
    return await stmt.run();
  } catch (error) {
    throw new DatabaseError(`Failed to execute statement: ${sql}`, error);
  }
}

export function requireEnvDb(env: { DB?: D1Database }): D1Database {
  if (!env.DB) {
    throw new DatabaseError('D1 binding `DB` is missing from the environment');
  }
  return env.DB;
}
