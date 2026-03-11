// ─────────────────────────────────────────────
// GET /api/usage
// Returns free-tier usage for the current IP
// from Neon Postgres. Accurate across reloads
// and incognito sessions.
// ─────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { getUsage } from "@/lib/ratelimit";
import { FREE_TIER_LIMIT } from "@/lib/constants";

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function GET(req: NextRequest) {
  const ip       = getClientIp(req);
  const freeUsed = await getUsage(ip);
  return NextResponse.json({
    freeUsed,
    limit:        FREE_TIER_LIMIT,
    limitReached: freeUsed >= FREE_TIER_LIMIT,
  });
}