export type D1Database = {
  prepare: (query: string) => any;
};

/**
 * Placeholder DB accessor. In Cloudflare Functions, bind D1 as `env.DB` and
 * pass it into handlers. For dev, use SQLite-compatible layer.
 */
export function getDb(env: { DB: D1Database }): D1Database {
  return env.DB;
}
