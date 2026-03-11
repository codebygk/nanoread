// ─────────────────────────────────────────────
// POST /api/summarize
//
// Free-tier rate limiting uses client IP stored
// in Neon Postgres. Persists across reloads,
// incognito, different browsers, and redeploays.
// ─────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { extractTextFromHtml } from "@/lib/utils";
import {
  SUMMARIZE_SYSTEM_PROMPT,
  MAX_CONTENT_CHARS,
  FETCH_TIMEOUT_MS,
  MAX_TOKENS,
  FREE_TIER_LIMIT,
} from "@/lib/constants";
import { getUsage, incrementUsage } from "@/lib/ratelimit";
import type { SummarizeRequest } from "@/types";

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

async function fetchWebpage(url: string): Promise<{ title: string; text: string }> {
  const response = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; WebSummarizer/1.0)" },
    signal:  AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch webpage: ${response.status} ${response.statusText}`);
  }
  const html = await response.text();
  return extractTextFromHtml(html, MAX_CONTENT_CHARS);
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SummarizeRequest;
    const { url, apiKey, baseUrl, model } = body;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url.startsWith("http") ? url : `https://${url}`);
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    let resolvedKey   = apiKey?.trim()  || "";
    let resolvedBase  = baseUrl?.trim() || "https://api.openai.com/v1";
    let resolvedModel = model           || "gpt-4o-mini";
    let freeUsed: number | undefined;

    if (!resolvedKey) {
      const defaultKey   = process.env.DEFAULT_API_KEY  || "";
      const defaultBase  = process.env.DEFAULT_BASE_URL || "https://api.openai.com/v1";
      const defaultModel = process.env.DEFAULT_MODEL    || "gpt-4o-mini";

      if (!defaultKey) {
        return NextResponse.json(
          { error: "No API key provided. Please add your API key in Settings." },
          { status: 401 },
        );
      }

      const ip           = getClientIp(req);
      const currentCount = await getUsage(ip);

      if (currentCount >= FREE_TIER_LIMIT) {
        return NextResponse.json(
          {
            error: `You've used all ${FREE_TIER_LIMIT} free summaries. Add your own API key in Settings to continue -- Groq offers a generous free tier!`,
            limitReached: true,
          },
          { status: 429 },
        );
      }

      resolvedKey   = defaultKey;
      resolvedBase  = defaultBase;
      resolvedModel = defaultModel;
      freeUsed      = await incrementUsage(ip);
    }

    const { title, text } = await fetchWebpage(parsedUrl.toString());

    if (!text || text.length < 50) {
      return NextResponse.json(
        { error: "Could not extract meaningful content from this page." },
        { status: 422 },
      );
    }

    const client = new OpenAI({ apiKey: resolvedKey, baseURL: resolvedBase });

    const response = await client.chat.completions.create({
      model:      resolvedModel,
      max_tokens: MAX_TOKENS,
      messages: [
        { role: "system", content: SUMMARIZE_SYSTEM_PROMPT },
        { role: "user",   content: `Summarize this webpage titled "${title}":\n\n${text}` },
      ],
    });

    const summary = response.choices[0]?.message?.content ?? "";

    return NextResponse.json({
      summary,
      title,
      url: parsedUrl.toString(),
      ...(freeUsed !== undefined ? { freeUsed } : {}),
    });

  } catch (err: unknown) {
    const message     = err instanceof Error ? err.message : "Unexpected error";
    const isAuthError = message.includes("401") || message.includes("API key") || message.includes("Incorrect API key");
    return NextResponse.json(
      { error: isAuthError ? "Invalid API key. Please check your settings." : message },
      { status: isAuthError ? 401 : 500 },
    );
  }
}