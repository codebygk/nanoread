// ─────────────────────────────────────────────
// POST /api/summarize
// Fetches a webpage, strips boilerplate, and
// summarises the content using an LLM.
// ─────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { extractTextFromHtml } from "@/lib/utils";
import {
  SUMMARIZE_SYSTEM_PROMPT,
  MAX_CONTENT_CHARS,
  FETCH_TIMEOUT_MS,
  MAX_TOKENS,
} from "@/lib/constants";
import type { SummarizeRequest } from "@/types";

// ── Webpage fetcher ───────────────────────────

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

// ── Route handler ─────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SummarizeRequest;
    const { url, apiKey, baseUrl, model } = body;

    // ── Validate input ──
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url.startsWith("http") ? url : `https://${url}`);
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: "No API key provided. Please add your API key in Settings." },
        { status: 401 },
      );
    }

    // ── Fetch & extract webpage content ──
    const { title, text } = await fetchWebpage(parsedUrl.toString());

    if (!text || text.length < 50) {
      return NextResponse.json(
        { error: "Could not extract meaningful content from this page." },
        { status: 422 },
      );
    }

    // ── Call LLM ──
    // Uses a single OpenAI-compatible client that works with any provider:
    // OpenAI, Groq, Ollama, OpenRouter, LM Studio, Together, Mistral, etc.
    const client = new OpenAI({
      apiKey,
      ...(baseUrl ? { baseURL: baseUrl } : {}),
    });

    const response = await client.chat.completions.create({
      model:      model ?? "gpt-4o-mini",
      max_tokens: MAX_TOKENS,
      messages: [
        { role: "system", content: SUMMARIZE_SYSTEM_PROMPT },
        { role: "user",   content: `Summarize this webpage titled "${title}":\n\n${text}` },
      ],
    });

    const summary = response.choices[0]?.message?.content ?? "";

    return NextResponse.json({ summary, title, url: parsedUrl.toString() });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    const isAuthError =
      message.includes("401") ||
      message.includes("API key") ||
      message.includes("Incorrect API key");

    return NextResponse.json(
      { error: isAuthError ? "Invalid API key. Please check your settings." : message },
      { status: isAuthError ? 401 : 500 },
    );
  }
}