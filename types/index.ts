// ─────────────────────────────────────────────
// Shared application types
// ─────────────────────────────────────────────

export interface Settings {
  baseUrl: string;
  apiKey: string;
  model: string;
}

export interface HistoryItem {
  id: string;
  url: string;
  title: string;
  summary: string;
  model: string;
  timestamp: number;
}

export interface SummarizeResult {
  summary: string;
  title: string;
  url: string;
}

export interface SummarizeRequest {
  url: string;
  apiKey?: string;
  baseUrl?: string;
  model: string;
}

export interface ApiErrorResponse {
  error: string;
}