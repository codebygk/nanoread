// ─────────────────────────────────────────────
// Client-side API helpers
// ─────────────────────────────────────────────

import { SUMMARIZE_API_PATH } from "@/lib/constants";
import type { SummarizeRequest, SummarizeResult } from "@/types";

export class ApiError extends Error {
  public readonly limitReached: boolean;
  constructor(
    message: string,
    public readonly status: number,
    limitReached = false,
  ) {
    super(message);
    this.name = "ApiError";
    this.limitReached = limitReached;
  }
}

/**
 * Calls the /api/summarize route and returns the result.
 * Throws ApiError on non-2xx responses, Error on network failure.
 * Rate limiting is handled server-side via a signed cookie -- no
 * fingerprint needs to be sent from the client.
 */
export async function summarizePage(
  request: SummarizeRequest,
): Promise<SummarizeResult> {
  const res = await fetch(SUMMARIZE_API_PATH, {
    method:      "POST",
    headers:     { "Content-Type": "application/json" },
    credentials: "same-origin", // ensures cookies are sent with the request
    body:        JSON.stringify(request),
  });

  const data = await res.json();

  if (!res.ok) {
    const message =
      res.status === 401
        ? "API key issue - please add your own key in Settings."
        : (data.error as string) || "Something went wrong.";
    throw new ApiError(message, res.status, !!data.limitReached);
  }

  return data as SummarizeResult;
}