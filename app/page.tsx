"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { marked } from "marked";
import SettingsModal from "@/components/SettingsModal";
import HistoryPanel from "@/components/HistoryPanel";

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

const DEFAULT_SETTINGS: Settings = {
  baseUrl: "https://api.openai.com/v1",
  apiKey: "",
  model: "gpt-4o-mini",
};

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  );
}

const EXAMPLES = [
  { label: "CodeByGK", url: "https://codebygk.vercel.app", emoji: "🔥" },
  { label: "QACanCode", url: "https://qacancode.com", emoji: "🤖" },
  { label: "Dorkmine", url: "https://dorkmine.vercel.app", emoji: "📱" },
];

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ summary: string; title: string; url: string } | null>(null);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [copied, setCopied] = useState(false);
  const [dark, setDark] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("summarizer-settings-v2");
    if (saved) setSettings(JSON.parse(saved));
    const savedHistory = localStorage.getItem("summarizer-history");
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = savedTheme === "dark" || (!savedTheme && prefersDark);
    setDark(isDark);
    inputRef.current?.focus();
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem("theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  };

  const handleSubmit = useCallback(async (e: React.FormEvent | null, overrideUrl?: string) => {
    e?.preventDefault();
    const targetUrl = overrideUrl || url;
    if (!targetUrl.trim()) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: targetUrl,
          apiKey: settings.apiKey || undefined,
          baseUrl: settings.baseUrl || undefined,
          model: settings.model,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(res.status === 401
          ? "API key issue — the default quota may be used up. Add your own key in Settings."
          : data.error || "Something went wrong.");
        return;
      }
      setResult(data);
      const item: HistoryItem = { id: Date.now().toString(), url: data.url, title: data.title, summary: data.summary, model: settings.model, timestamp: Date.now() };
      const newHistory = [item, ...history].slice(0, 20);
      setHistory(newHistory);
      localStorage.setItem("summarizer-history", JSON.stringify(newHistory));
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, [url, settings, history]);

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const endpointLabel = (() => {
    const b = settings.baseUrl || "";
    if (b.includes("openai.com")) return "OpenAI";
    if (b.includes("groq.com")) return "Groq";
    if (b.includes("openrouter.ai")) return "OpenRouter";
    if (b.includes("anthropic.com")) return "Anthropic";
    if (b.includes("localhost:11434")) return "Ollama";
    if (b.includes("localhost:1234")) return "LM Studio";
    if (b.includes("localhost")) return "Local";
    try { if (b) return new URL(b).hostname; } catch { /* ignore */ }
    return "Default";
  })();

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>

      {/* ── Nav ──────────────────────────────────────── */}
      <nav className="fade-up" style={{
        position: "sticky", top: 0, zIndex: 40,
        background: "var(--bg)",
        borderBottom: "1px solid var(--border)",
        backdropFilter: "blur(12px)",
      }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 8px rgba(99,102,241,0.35)",
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="8" y1="13" x2="16" y2="13"/>
                <line x1="8" y1="17" x2="13" y2="17"/>
              </svg>
            </div>
            <span style={{ fontWeight: 600, fontSize: "1rem", color: "var(--text)", letterSpacing: "-0.02em" }}>
              Webpage Summarizer
            </span>
          </div>

          {/* Right controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <NavBtn onClick={() => setShowHistory(true)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              History
              {history.length > 0 && (
                <span style={{
                  background: "var(--accent)", color: "white",
                  fontSize: 10, fontWeight: 600,
                  padding: "1px 5px", borderRadius: 10,
                  lineHeight: 1.6,
                }}>{history.length}</span>
              )}
            </NavBtn>

            <NavBtn onClick={() => setShowSettings(true)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              Settings
              {!settings.apiKey && (
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f59e0b", display: "inline-block" }} />
              )}
            </NavBtn>

            {/* Theme toggle */}
            <button onClick={toggleTheme} style={{
              width: 36, height: 36, borderRadius: 8,
              border: "1px solid var(--border)",
              background: "var(--bg-subtle)",
              color: "var(--text-2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", transition: "all 0.15s",
            }}
              onMouseOver={e => (e.currentTarget.style.borderColor = "var(--accent)")}
              onMouseOut={e => (e.currentTarget.style.borderColor = "var(--border)")}
            >
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Main ─────────────────────────────────────── */}
      <main style={{ maxWidth: 1080, margin: "0 auto", padding: "48px 24px 80px", width: "100%", flex: 1 }}>

        {/* Hero */}
        <div className="fade-up-1" style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 className="font-display" style={{
            fontSize: "clamp(1.9rem, 5vw, 2.75rem)",
            color: "var(--text)",
            lineHeight: 1.15,
            marginBottom: 14,
            letterSpacing: "-0.03em",
            fontWeight: 700,
          }}>
            Summarize any webpage <span style={{ color: "var(--accent)", fontWeight: 700 }}>instantly!</span>
            
          </h1>
          <p style={{ color: "var(--text-2)", fontSize: "1rem", lineHeight: 1.65, fontWeight: 400, letterSpacing: "-0.01em" }}>
            Paste a URL, choose your AI provider, get the key points instantly.
          </p>
        </div>

        {/* No API key warning */}
        {!settings.apiKey && (
          <div className="fade-up-2" style={{
            display: "flex", alignItems: "flex-start", gap: 14,
            background: "var(--bg-card)",
            border: "1.5px solid #f59e0b",
            borderRadius: 12,
            padding: "16px 20px",
            marginBottom: 20,
            boxShadow: "0 2px 12px rgba(245,158,11,0.12)",
          }}>
            <div style={{
              flexShrink: 0, width: 36, height: 36, borderRadius: 10,
              background: "rgba(245,158,11,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.1rem",
            }}>🔑</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text)", margin: "0 0 4px" }}>
                No API key configured
              </p>
              <p style={{ fontSize: "0.82rem", color: "var(--text-2)", margin: "0 0 10px", lineHeight: 1.55 }}>
                You need to add your own API key to use this tool. Supports OpenAI, Groq (free tier), Ollama (local &amp; free), OpenRouter, and more.
              </p>
              <button onClick={() => setShowSettings(true)} style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "7px 16px", borderRadius: 8,
                border: "none",
                background: "#f59e0b", color: "white",
                fontSize: "0.82rem", fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit",
                transition: "opacity 0.15s",
              }}
                onMouseOver={e => (e.currentTarget.style.opacity = "0.85")}
                onMouseOut={e => (e.currentTarget.style.opacity = "1")}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                Open Settings
              </button>
            </div>
          </div>
        )}

        {/* Search card */}
        <div className="fade-up-2" style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          padding: 20,
          boxShadow: "var(--shadow-md)",
          marginBottom: 20,
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "var(--bg-subtle)",
              border: "1.5px solid var(--border)",
              borderRadius: 10,
              padding: "4px 4px 4px 14px",
              transition: "border-color 0.15s",
            }}
              onFocusCapture={e => (e.currentTarget.style.borderColor = "var(--accent)")}
              onBlurCapture={e => (e.currentTarget.style.borderColor = "var(--border)")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, color: "var(--text-3)" }}>
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="Paste a URL to summarize…"
                disabled={loading}
                style={{
                  flex: 1, background: "transparent", border: "none", outline: "none",
                  color: "var(--text)", fontSize: "0.9375rem",
                  fontFamily: "inherit", padding: "8px 0",
                }}
              />
              <button
                type="submit"
                disabled={loading || !url.trim() || !settings.apiKey}
                style={{
                  background: loading || !url.trim() || !settings.apiKey ? "var(--border)" : "var(--accent)",
                  color: loading || !url.trim() || !settings.apiKey ? "var(--text-3)" : "white",
                  border: "none",
                  borderRadius: 7,
                  padding: "9px 20px",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  cursor: loading || !url.trim() || !settings.apiKey ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", gap: 7,
                  transition: "all 0.15s",
                  flexShrink: 0,
                  fontFamily: "inherit",
                }}
              >
                {loading ? <><span className="spinner" /> Summarizing…</> : "Summarize"}
              </button>
            </div>
          </form>

          {/* Status row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12, flexWrap: "wrap", gap: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                background: "var(--accent-bg)", color: "var(--accent)",
                fontSize: "0.75rem", fontWeight: 500,
                padding: "3px 10px", borderRadius: 20,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", display: "inline-block" }} />
                {endpointLabel} · {settings.model}
              </span>
            </div>
            <span style={{
              fontSize: "0.75rem",
              color: settings.apiKey ? "var(--success)" : "#f59e0b",
              display: "flex", alignItems: "center", gap: 4, fontWeight: 500,
            }}>
              {settings.apiKey ? <><CheckIcon /> API key set</> : <>🔑 No key — add in Settings</>}
            </span>
          </div>
        </div>

        {/* Example chips */}
        {!result && !loading && !error && (
          <div className="fade-up-3" style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 32 }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-3)", fontWeight: 500 }}>Try:</span>
            {EXAMPLES.map(ex => (
              <button key={ex.url} onClick={() => { setUrl(ex.url); handleSubmit(null, ex.url); }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  padding: "5px 12px", borderRadius: 20,
                  border: "1px solid var(--border)",
                  background: "var(--bg-card)",
                  color: "var(--text-2)",
                  fontSize: "0.8rem", fontWeight: 500,
                  cursor: "pointer", transition: "all 0.15s",
                  fontFamily: "inherit",
                }}
                onMouseOver={e => {
                  e.currentTarget.style.borderColor = "var(--accent)";
                  e.currentTarget.style.color = "var(--accent)";
                }}
                onMouseOut={e => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.color = "var(--text-2)";
                }}
              >
                {ex.emoji} {ex.label}
              </button>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="scale-in" style={{
            background: "var(--error-bg)",
            border: "1px solid var(--error-border)",
            borderRadius: 12, padding: "14px 16px",
            display: "flex", alignItems: "flex-start", gap: 12,
            marginBottom: 24,
          }}>
            <span style={{ fontSize: "1rem", flexShrink: 0, marginTop: 1 }}>⚠️</span>
            <div>
              <p style={{ color: "var(--error-text)", fontSize: "0.875rem", fontWeight: 500, lineHeight: 1.5 }}>{error}</p>
              {error.includes("key") && (
                <button onClick={() => setShowSettings(true)}
                  style={{ color: "var(--accent)", fontSize: "0.8rem", marginTop: 6, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: 0, fontWeight: 600 }}>
                  Open Settings →
                </button>
              )}
            </div>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="scale-in" style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden", boxShadow: "var(--shadow)" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)" }}>
              <div className="skeleton" style={{ height: 20, width: "60%", marginBottom: 10 }} />
              <div className="skeleton" style={{ height: 14, width: "40%" }} />
            </div>
            <div style={{ padding: "24px" }}>
              {[80, 95, 70, 85, 60].map((w, i) => (
                <div key={i} className="skeleton" style={{ height: 14, width: `${w}%`, marginBottom: 10 }} />
              ))}
            </div>
          </div>
        )}

        {/* Result */}
        {result && !loading && (
          <div className="scale-in">
            <div style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "var(--shadow-md)",
            }}>
              {/* Result header */}
              <div style={{
                padding: "18px 24px",
                borderBottom: "1px solid var(--border)",
                background: "var(--bg-subtle)",
                display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16,
              }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <h2 style={{
                    fontSize: "1rem", fontWeight: 600,
                    color: "var(--text)", lineHeight: 1.4,
                    marginBottom: 4,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {result.title}
                  </h2>
                  <a href={result.url} target="_blank" rel="noopener noreferrer" style={{
                    display: "inline-flex", alignItems: "center", gap: 4,
                    color: "var(--text-3)", fontSize: "0.75rem",
                    textDecoration: "none", fontFamily: "JetBrains Mono, monospace",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    maxWidth: "100%",
                  }}>
                    {result.url.length > 60 ? result.url.slice(0, 60) + "…" : result.url}
                    <ExternalLinkIcon />
                  </a>
                </div>
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <button onClick={handleCopy} style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "7px 14px", borderRadius: 8,
                    border: "1px solid var(--border)",
                    background: copied ? "var(--accent)" : "var(--bg-card)",
                    color: copied ? "white" : "var(--text-2)",
                    fontSize: "0.8rem", fontWeight: 500,
                    cursor: "pointer", transition: "all 0.15s",
                    fontFamily: "inherit",
                  }}>
                    {copied ? <><CheckIcon /> Copied!</> : <><CopyIcon /> Copy</>}
                  </button>
                </div>
              </div>

              {/* Summary body */}
              <div style={{ padding: "24px" }}>
                <div className="prose" dangerouslySetInnerHTML={{ __html: marked.parse(result.summary) as string }} />
              </div>
            </div>

            {/* New summary CTA */}
            <div style={{ textAlign: "center", marginTop: 20 }}>
              <button onClick={() => { setResult(null); setError(""); setUrl(""); setTimeout(() => inputRef.current?.focus(), 50); }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  color: "var(--text-3)", fontSize: "0.85rem",
                  background: "none", border: "none", cursor: "pointer",
                  fontFamily: "inherit", padding: 0,
                  transition: "color 0.15s",
                }}
                onMouseOver={e => (e.currentTarget.style.color = "var(--accent)")}
                onMouseOut={e => (e.currentTarget.style.color = "var(--text-3)")}
              >
                ← Summarize another page
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ── Footer ───────────────────────────────────── */}
      <footer style={{
        borderTop: "1px solid var(--border)",
        padding: "16px 24px",
        textAlign: "center",
        color: "var(--text-3)",
        fontSize: "0.8rem",
        background: "var(--bg)",
        position: "sticky",
        bottom: 0,
        zIndex: 30,
      }}>
        Built by{" "}
        <a href="https://codebygk.vercel.app" target="_blank" rel="noopener noreferrer"
          style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}>@CodeByGK</a>
      </footer>

      {/* ── Modals ───────────────────────────────────── */}
      {showSettings && (
        <SettingsModal settings={settings}
          onSave={s => { setSettings(s); localStorage.setItem("summarizer-settings-v2", JSON.stringify(s)); setShowSettings(false); }}
          onClose={() => setShowSettings(false)} />
      )}
      {showHistory && (
        <HistoryPanel history={history}
          onSelect={item => { setUrl(item.url); setResult({ summary: item.summary, title: item.title, url: item.url }); setShowHistory(false); }}
          onClear={() => { setHistory([]); localStorage.removeItem("summarizer-history"); }}
          onClose={() => setShowHistory(false)} />
      )}
    </div>
  );
}

/* ── Shared nav button component ─────────────── */
function NavBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "7px 12px", borderRadius: 8,
      border: "1px solid var(--border)",
      background: "var(--bg-subtle)",
      color: "var(--text-2)",
      fontSize: "0.8rem", fontWeight: 500,
      cursor: "pointer", transition: "all 0.15s",
      fontFamily: "inherit",
    }}
      onMouseOver={e => {
        e.currentTarget.style.borderColor = "var(--accent)";
        e.currentTarget.style.color = "var(--accent)";
      }}
      onMouseOut={e => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.color = "var(--text-2)";
      }}
    >
      {children}
    </button>
  );
}