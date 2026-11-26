import { Pool, type PoolClient, type QueryResultRow } from "pg";
import { HttpError } from "./http";

/**
 * PostgreSQL on the VPS. Set UNSCROLL_DATABASE_URL in .env.local, e.g.
 * postgres://unscroll:PASSWORD@127.0.0.1:5432/aivexa
 */
const g = globalThis as unknown as { __unscrollPool?: Pool };

export function pool(): Pool {
  if (!g.__unscrollPool) {
    const url = process.env.UNSCROLL_DATABASE_URL || process.env.DATABASE_URL;
    if (!url) throw new HttpError(503, "Unscroll database is not configured");
    g.__unscrollPool = new Pool({ connectionString: url, max: 10, idleTimeoutMillis: 30_000 });
  }
  return g.__unscrollPool;
}

export async function q<T extends QueryResultRow = QueryResultRow>(sql: string, params: unknown[] = []): Promise<T[]> {
  return (await pool().query<T>(sql, params)).rows;
}

export async function one<T extends QueryResultRow = QueryResultRow>(sql: string, params: unknown[] = []): Promise<T | null> {
  return (await q<T>(sql, params))[0] ?? null;
}

export async function tx<T>(fn: (c: PoolClient) => Promise<T>): Promise<T> {
  const c = await pool().connect();
  try {
    await c.query("BEGIN");
    const r = await fn(c);
    await c.query("COMMIT");
    return r;
  } catch (e) {
    await c.query("ROLLBACK").catch(() => undefined);
    throw e;
  } finally {
    c.release();
  }
}
