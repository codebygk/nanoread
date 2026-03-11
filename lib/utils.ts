// ─────────────────────────────────────────────
// Pure utility functions
// ─────────────────────────────────────────────

import { URL_TRUNCATE_LEN } from "@/lib/constants";

/**
 * Returns a short human-readable label for a given LLM base URL.
 * Falls back to the hostname, then "Default".
 */
export function getEndpointLabel(baseUrl: string): string {
  if (!baseUrl) return "Default";
  if (baseUrl.includes("openai.com"))    return "OpenAI";
  if (baseUrl.includes("groq.com"))      return "Groq";
  if (baseUrl.includes("openrouter.ai")) return "OpenRouter";
  if (baseUrl.includes("anthropic.com")) return "Anthropic";
  if (baseUrl.includes("localhost:11434")) return "Ollama";
  if (baseUrl.includes("localhost:1234"))  return "LM Studio";
  if (baseUrl.includes("localhost"))       return "Local";
  try {
    return new URL(baseUrl).hostname;
  } catch {
    return "Custom";
  }
}

/**
 * Returns a relative time string (e.g. "3m ago", "2h ago").
 */
export function timeAgo(timestamp: number): string {
  const mins = Math.floor((Date.now() - timestamp) / 60_000);
  if (mins < 1)  return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return new Date(timestamp).toLocaleDateString();
}

/**
 * Truncates a URL string for display purposes.
 */
export function truncateUrl(url: string, maxLen = URL_TRUNCATE_LEN): string {
  return url.length > maxLen ? `${url.slice(0, maxLen)}…` : url;
}

/**
 * Normalises a URL string - prepends https:// if no scheme is present.
 */
export function normaliseUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return trimmed;
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

/**
 * Decodes common HTML entities in a string.
 */
export function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g,  "&")
    .replace(/&lt;/g,   "<")
    .replace(/&gt;/g,   ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
}

/**
 * Strips HTML tags and boilerplate from raw HTML, returning plain text.
 * Used server-side in the API route.
 */
export function extractTextFromHtml(html: string, maxChars: number): { title: string; text: string } {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? decodeHtmlEntities(titleMatch[1].trim()) : "Untitled";

  let text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi,   " ")
    .replace(/<nav[\s\S]*?<\/nav>/gi,        " ")
    .replace(/<header[\s\S]*?<\/header>/gi,  " ")
    .replace(/<footer[\s\S]*?<\/footer>/gi,  " ")
    .replace(/<aside[\s\S]*?<\/aside>/gi,    " ")
    .replace(/<!--[\s\S]*?-->/g,             " ")
    .replace(/<[^>]+>/g,                     " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g,    " ")
    .trim();

  text = decodeHtmlEntities(text);

  if (text.length > maxChars) {
    text = `${text.substring(0, maxChars)}...`;
  }

  return { title, text };
}