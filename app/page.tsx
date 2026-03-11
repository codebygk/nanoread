"use client";

// ─────────────────────────────────────────────
// Home page – orchestrates all state and
// composes the UI from focused sub-components.
// No business logic or inline styles live here.
// ─────────────────────────────────────────────

import { useState, useEffect, useRef, useCallback } from "react";

// Hooks
import { useSettings }        from "@/hooks/useSettings";
import { useHistory }         from "@/hooks/useHistory";
import { useTheme }           from "@/hooks/useTheme";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

// API
import { summarizePage, ApiError } from "@/lib/api";

// Components
import { AppNav }          from "@/components/AppNav";
import { NoApiKeyBanner }  from "@/components/NoApiKeyBanner";
import { UrlSearchCard, ExampleChips } from "@/components/UrlSearchCard";
import { SummaryResult }   from "@/components/SummaryResult";
import { LoadingSkeleton, ErrorAlert } from "@/components/Feedback";
import SettingsModal       from "@/components/SettingsModal";
import HistoryPanel        from "@/components/HistoryPanel";

// Types
import type { SummarizeResult } from "@/types";

// ─────────────────────────────────────────────

export default function Home() {
  const [url,          setUrl]          = useState("");
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");
  const [result,       setResult]       = useState<SummarizeResult | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory,  setShowHistory]  = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const { settings,  saveSettings,  loadSettings  } = useSettings();
  const { history,   addToHistory,  clearHistory,
          loadHistory                              } = useHistory();
  const { dark,      toggleTheme,   initTheme      } = useTheme();
  const { copied,    copy                          } = useCopyToClipboard();

  // ── Initialise from localStorage on mount ──
  useEffect(() => {
    loadSettings();
    loadHistory();
    initTheme();
    inputRef.current?.focus();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Summarize ──────────────────────────────
  const handleSubmit = useCallback(async (
    e: React.FormEvent | null,
    overrideUrl?: string,
  ) => {
    e?.preventDefault();
    const targetUrl = overrideUrl ?? url;
    if (!targetUrl.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await summarizePage({
        url:     targetUrl,
        apiKey:  settings.apiKey  || undefined,
        baseUrl: settings.baseUrl || undefined,
        model:   settings.model,
      });
      setResult(data);
      addToHistory(data, settings.model);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Network error. Please check your connection.",
      );
    } finally {
      setLoading(false);
    }
  }, [url, settings, addToHistory]);

  const handleExampleSelect = useCallback((exampleUrl: string) => {
    setUrl(exampleUrl);
    handleSubmit(null, exampleUrl);
  }, [handleSubmit]);

  const handleReset = useCallback(() => {
    setResult(null);
    setError("");
    setUrl("");
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const handleHistorySelect = useCallback((item: Parameters<typeof addToHistory>[0] & { url: string; summary: string; title: string }) => {
    setUrl(item.url);
    setResult({ summary: item.summary, title: item.title, url: item.url });
    setShowHistory(false);
  }, []);

  // ── Render ─────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>

      <AppNav
        historyCount={history.length}
        hasApiKey={!!settings.apiKey}
        dark={dark}
        onOpenHistory={()  => setShowHistory(true)}
        onOpenSettings={() => setShowSettings(true)}
        onToggleTheme={toggleTheme}
      />

      <main style={{
        maxWidth: 920,
        margin:   "0 auto",
        padding:  "48px 24px 80px",
        width:    "100%",
        flex:     1,
      }}>
        {/* Hero */}
        <div className="fade-up-1" style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 className="font-display" style={{
            fontSize:      "clamp(2rem, 8vw, 4rem)",
            color:         "var(--text)",
            lineHeight:    1.15,
            marginBottom:  14,
            letterSpacing: "-0.03em",
            fontWeight:    700,
          }}>
            Summarize any webpage { " " }
            <span style={{ color: "var(--accent)", fontWeight: 700 }}> instantly!</span>
          </h1>
          <p style={{
            color:         "var(--text-2)",
            fontSize:      "1rem",
            lineHeight:    1.65,
            fontWeight:    400,
            letterSpacing: "-0.01em",
          }}>
            Paste a URL or select from the examples to get the summary of the webpage instantly.
          </p>
        </div>

        {!settings.apiKey && (
          <NoApiKeyBanner onOpenSettings={() => setShowSettings(true)} />
        )}

        <UrlSearchCard
          url={url}
          loading={loading}
          settings={settings}
          inputRef={inputRef}
          onChange={setUrl}
          onSubmit={handleSubmit}
        />

        {!result && !loading && !error && (
          <ExampleChips onSelect={handleExampleSelect} />
        )}

        {error   && <ErrorAlert message={error} onOpenSettings={() => setShowSettings(true)} />}
        {loading && <LoadingSkeleton />}
        {result  && !loading && (
          <SummaryResult
            result={result}
            copied={copied}
            onCopy={() => copy(result.summary)}
            onReset={handleReset}
          />
        )}
      </main>

      <footer style={{
        borderTop:  "1px solid var(--border)",
        padding:    "16px 24px",
        textAlign:  "center",
        color:      "var(--text-3)",
        fontSize:   "0.8rem",
        background: "var(--bg)",
        position:   "sticky",
        bottom:     0,
        zIndex:     30,
      }}>
        
        Built by{" "}
        <a
          href="https://codebygk.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}
        >
          Gopalakrishnan (@codebygk)
        </a>
      </footer>

      {showSettings && (
        <SettingsModal
          settings={settings}
          onSave={next => { saveSettings(next); setShowSettings(false); }}
          onClose={() => setShowSettings(false)}
        />
      )}

      {showHistory && (
        <HistoryPanel
          history={history}
          onSelect={handleHistorySelect}
          onClear={clearHistory}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  );
}