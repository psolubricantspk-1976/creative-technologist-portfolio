import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

/**
 * Lazy PostgreSQL connection.
 *
 * Nothing is created at import time. This is deliberate: `next build`
 * imports route modules to collect page data, and throwing here would
 * fail the build on any host that does not expose DATABASE_URL during
 * the build step (most CI/deploy environments). Instead we connect on
 * first query, and callers can check `isDatabaseConfigured()` first.
 */

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
  __arenaNextJsPostgresqlDb?: NodePgDatabase<Record<string, never>>;
};

/** Whether DATABASE_URL is present in the current environment. */
export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

function requireDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is required to query the database. Set it in your environment."
    );
  }

  return databaseUrl;
}

/** Reuse a single pool across hot reloads in development. */
export function getPool(): Pool {
  if (!globalForDb.__arenaNextJsPostgresqlPool) {
    globalForDb.__arenaNextJsPostgresqlPool = new Pool({
      connectionString: requireDatabaseUrl(),
      // Fail fast instead of hanging a health probe or serverless request.
      connectionTimeoutMillis: 5_000,
      idleTimeoutMillis: 30_000,
      max: 10,
    });
  }

  return globalForDb.__arenaNextJsPostgresqlPool;
}

/** Lazily initialised Drizzle client. */
export function getDb(): NodePgDatabase<Record<string, never>> {
  if (!globalForDb.__arenaNextJsPostgresqlDb) {
    globalForDb.__arenaNextJsPostgresqlDb = drizzle(getPool());
  }

  return globalForDb.__arenaNextJsPostgresqlDb;
}

/**
 * Convenience client that resolves on first property access, so existing
 * `db.execute(...)` style call sites keep working without importing the
 * factory. Connection is only established when a query actually runs.
 */
export const db = new Proxy({} as NodePgDatabase<Record<string, never>>, {
  get(_target, property) {
    const instance = getDb();
    const value = Reflect.get(instance as object, property, instance);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});
