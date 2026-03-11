import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const SYSTEM_PROMPT = `You are an assistant that analyzes webpage text and provides a clear, well-structured summary.
Ignore navigation menus, ads, and boilerplate content. Focus on the main content.
Respond in markdown with:
- A brief 1-2 sentence overview
- Key points as bullet points
- Any notable announcements or news if present`;

async function fetchWebpageText(url: string): Promise<{ title: string; text: string }> {
  const response = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; WebSummarizer/1.0)" },
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`Failed to fetch webpage: ${response.status} ${response.statusText}`);

  const html = await response.text();
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").trim() : "Untitled";

  let cleaned = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<nav[\s\S]*?<\/nav>/gi, " ")
    .replace(/<header[\s\S]*?<\/header>/gi, " ")
    .replace(/<footer[\s\S]*?<\/footer>/gi, " ")
    .replace(/<aside[\s\S]*?<\/aside>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();

  if (cleaned.length > 8000) cleaned = cleaned.substring(0, 8000) + "...";
  return { title, text: cleaned };
}

export async function POST(req: NextRequest) {
  try {
    const { url, apiKey, baseUrl, model } = await req.json();

    if (!url) return NextResponse.json({ error: "URL is required" }, { status: 400 });

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url.startsWith("http") ? url : `https://${url}`);
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    const { title, text } = await fetchWebpageText(parsedUrl.toString());
    if (!text || text.length < 50) {
      return NextResponse.json({ error: "Could not extract meaningful content from this page" }, { status: 422 });
    }

    // Require user-supplied API key — no server-side default
    const resolvedApiKey = apiKey;
    if (!resolvedApiKey) {
      return NextResponse.json({ error: "No API key provided. Please add your API key in Settings." }, { status: 401 });
    }
    const resolvedBaseUrl = baseUrl || undefined;
    const resolvedModel = model || "gpt-4o-mini";

    // Single universal OpenAI-compatible client — works with OpenAI, Ollama, Groq,
    // OpenRouter, Together, LM Studio, Mistral, any custom endpoint
    const client = new OpenAI({
      apiKey: resolvedApiKey,
      ...(resolvedBaseUrl ? { baseURL: resolvedBaseUrl } : {}),
    });

    const response = await client.chat.completions.create({
      model: resolvedModel,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Summarize this webpage titled "${title}":\n\n${text}` },
      ],
      max_tokens: 1024,
    });

    const summary = response.choices[0]?.message?.content || "";
    return NextResponse.json({ summary, title, url: parsedUrl.toString() });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    const isAuthError = message.includes("401") || message.includes("API key") || message.includes("Incorrect API key");
    return NextResponse.json(
      { error: isAuthError ? "Invalid API key. Please check your settings." : message },
      { status: isAuthError ? 401 : 500 }
    );
  }
}