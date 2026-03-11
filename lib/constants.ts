// ─────────────────────────────────────────────
// Application-wide constants
// ─────────────────────────────────────────────

import type { Settings } from "@/types";

// ── Storage keys ──────────────────────────────
export const STORAGE_KEYS = {
    SETTINGS: "summarizer-settings-v2",
    HISTORY: "summarizer-history",
    THEME: "theme",
} as const;

// ── Limits ────────────────────────────────────
export const MAX_HISTORY_ITEMS = 20;
export const MAX_CONTENT_CHARS = 8000;
export const FETCH_TIMEOUT_MS = 10000;
export const MAX_TOKENS = 1024;
export const COPY_RESET_MS = 2000;
export const URL_TRUNCATE_LEN = 60;

// ── Default settings ──────────────────────────
export const DEFAULT_SETTINGS: Settings = {
    baseUrl: "https://api.openai.com/v1",
    apiKey: "",
    model: "gpt-4o-mini",
};

// ── LLM provider presets ──────────────────────
export const PROVIDER_PRESETS = [
    {
        label: "Groq (free)",
        baseUrl: "https://api.groq.com/openai/v1",
        model: "llama-3.1-8b-instant",
        keyHint: "gsk_...",
        keyLink: "https://console.groq.com/keys",
    },
    {
        label: "Ollama (free)",
        baseUrl: "http://localhost:11434/v1",
        model: "llama3.2",
        keyHint: "ollama",
        keyLink: "https://ollama.com/download",
    },
    {
        label: "LM Studio (free)",
        baseUrl: "http://localhost:1234/v1",
        model: "local-model",
        keyHint: "lm-studio",
        keyLink: "https://lmstudio.ai",
    },
    {
        label: "OpenAI",
        baseUrl: "https://api.openai.com/v1",
        model: "gpt-4o-mini",
        keyHint: "sk-...",
        keyLink: "https://platform.openai.com/api-keys",
    },
    {
        label: "OpenRouter",
        baseUrl: "https://openrouter.ai/api/v1",
        model: "mistralai/mistral-7b-instruct",
        keyHint: "sk-or-...",
        keyLink: "https://openrouter.ai/keys",
    },
    {
        label: "Together",
        baseUrl: "https://api.together.xyz/v1",
        model: "mistralai/Mistral-7B-Instruct-v0.1",
        keyHint: "...",
        keyLink: "https://api.together.ai",
    },
] as const;

export type ProviderPreset = (typeof PROVIDER_PRESETS)[number];

// ── Example URLs shown on the home page ───────
export const EXAMPLE_URLS = [
    { label: "CodeByGK", url: "https://codebygk.vercel.app", emoji: "🔥" },
    { label: "QACanCode", url: "https://qacancode.com", emoji: "🤖" },
    { label: "Dorkmine", url: "https://dorkmine.vercel.app", emoji: "📱" },
] as const;

// ── Summarize API endpoint ─────────────────────
export const SUMMARIZE_API_PATH = "/api/summarize";

// ── LLM system prompt ─────────────────────────
export const SUMMARIZE_SYSTEM_PROMPT = `You are an assistant that analyzes webpage text and provides a clear, well-structured summary.
Ignore navigation menus, ads, and boilerplate content. Focus on the main content.
Respond in markdown with:
- A brief 1-2 sentence overview
- Key points as bullet points
- Any notable announcements or news if present`;