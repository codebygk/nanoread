// ─────────────────────────────────────────────
// IP-based rate limiter backed by Neon Postgres.
// Table is auto-created on first request.
// ─────────────────────────────────────────────

import { neon } from "@neondatabase/serverless";
import { FREE_TIER_LIMIT } from "@/lib/constants";

function sql() {
  return neon(process.env.DATABASE_URL!);
}

async function ensureTable(): Promise<void> {
  const db = sql();
  await db`
    CREATE TABLE IF NOT EXISTS ip_usage (
      ip      TEXT PRIMARY KEY,
      count   INTEGER NOT NULL DEFAULT 0,
      updated TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
}

export async function getUsage(ip: string): Promise<number> {
  await ensureTable();
  const db  = sql();
  const rows = await db`
    SELECT count FROM ip_usage WHERE ip = ${ip}
  `;
  return rows[0]?.count ?? 0;
}

export async function incrementUsage(ip: string): Promise<number> {
  await ensureTable();
  const db  = sql();
  const rows = await db`
    INSERT INTO ip_usage (ip, count, updated)
    VALUES (${ip}, 1, now())
    ON CONFLICT (ip) DO UPDATE
      SET count   = ip_usage.count + 1,
          updated = now()
    RETURNING count
  `;
  return rows[0].count;
}

export async function isLimitReached(ip: string): Promise<boolean> {
  const count = await getUsage(ip);
  return count >= FREE_TIER_LIMIT;
}