"use client";

import { useState } from "react";
import { Settings } from "@/app/page";

interface Props {
  settings: Settings;
  onSave: (s: Settings) => void;
  onClose: () => void;
}

const PRESETS = [
  { label: "OpenAI",      baseUrl: "https://api.openai.com/v1",          model: "gpt-4o-mini",              keyHint: "sk-...",       keyLink: "https://platform.openai.com/api-keys" },
  { label: "Groq (free)", baseUrl: "https://api.groq.com/openai/v1",     model: "llama-3.3-70b-versatile",  keyHint: "gsk_...",      keyLink: "https://console.groq.com/keys" },
  { label: "OpenRouter",  baseUrl: "https://openrouter.ai/api/v1",       model: "mistralai/mistral-7b-instruct", keyHint: "sk-or-...", keyLink: "https://openrouter.ai/keys" },
  { label: "Ollama",      baseUrl: "http://localhost:11434/v1",          model: "llama3.2",                  keyHint: "ollama",       keyLink: "https://ollama.com/download" },
  { label: "LM Studio",   baseUrl: "http://localhost:1234/v1",           model: "local-model",               keyHint: "lm-studio",    keyLink: "https://lmstudio.ai" },
  { label: "Together",    baseUrl: "https://api.together.xyz/v1",        model: "mistralai/Mistral-7B-Instruct-v0.1", keyHint: "...", keyLink: "https://api.together.ai" },
];

export default function SettingsModal({ settings, onSave, onClose }: Props) {
  const [local, setLocal] = useState<Settings>({ ...settings });
  const [showKey, setShowKey] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const applyPreset = (p: typeof PRESETS[0]) => {
    setLocal(prev => ({ ...prev, baseUrl: p.baseUrl, model: p.model, apiKey: "" }));
    setActivePreset(p.label);
  };

  const currentPreset = PRESETS.find(p => p.label === activePreset);

  const inputStyle = {
    width: "100%", padding: "9px 12px",
    border: "1px solid var(--border)",
    borderRadius: 8, outline: "none",
    background: "var(--bg-subtle)",
    color: "var(--text)",
    fontSize: "0.875rem",
    fontFamily: "Geist Mono, monospace",
    transition: "border-color 0.15s",
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 50,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
      background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)",
    }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="scale-in" style={{
        width: "100%", maxWidth: 480,
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        boxShadow: "var(--shadow-lg)",
        maxHeight: "90vh",
        display: "flex", flexDirection: "column",
        overflow: "hidden",
      }}>

        {/* Header */}
        <div style={{
          padding: "20px 24px",
          borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <div>
            <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text)", margin: 0 }}>LLM Settings</h2>
            <p style={{ fontSize: "0.75rem", color: "var(--text-3)", margin: "2px 0 0" }}>Configure your AI provider</p>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 8,
            border: "1px solid var(--border)",
            background: "var(--bg-subtle)",
            color: "var(--text-2)",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1rem", lineHeight: 1,
            fontFamily: "inherit",
          }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 24px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Presets */}
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-2)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Quick Presets
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {PRESETS.map(p => (
                <button key={p.label} onClick={() => applyPreset(p)} style={{
                  padding: "8px 10px",
                  borderRadius: 8,
                  border: activePreset === p.label ? "1.5px solid var(--accent)" : "1px solid var(--border)",
                  background: activePreset === p.label ? "var(--accent-bg)" : "var(--bg-subtle)",
                  color: activePreset === p.label ? "var(--accent)" : "var(--text-2)",
                  fontSize: "0.8rem", fontWeight: 500,
                  cursor: "pointer", transition: "all 0.15s",
                  fontFamily: "inherit",
                }}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Base URL */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Base URL</label>
              <span style={{ fontSize: "0.7rem", color: "var(--text-3)" }}>OpenAI-compatible endpoint</span>
            </div>
            <input type="text" value={local.baseUrl || ""} placeholder="https://api.openai.com/v1"
              onChange={e => { setLocal({ ...local, baseUrl: e.target.value }); setActivePreset(null); }}
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = "var(--accent)")}
              onBlur={e => (e.target.style.borderColor = "var(--border)")}
            />
            <p style={{ fontSize: "0.72rem", color: "var(--text-3)", marginTop: 5 }}>
              Compatible with OpenAI, Groq, Ollama, OpenRouter, LM Studio, Together, Mistral…
            </p>
          </div>

          {/* Model */}
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-2)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Model</label>
            <input type="text" value={local.model} placeholder="gpt-4o-mini"
              onChange={e => setLocal({ ...local, model: e.target.value })}
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = "var(--accent)")}
              onBlur={e => (e.target.style.borderColor = "var(--border)")}
            />
            <p style={{ fontSize: "0.72rem", color: "var(--text-3)", marginTop: 5 }}>
              Examples: <code style={{ fontFamily: "Geist Mono, monospace" }}>llama3.2</code>, <code style={{ fontFamily: "Geist Mono, monospace" }}>mistral</code>, <code style={{ fontFamily: "Geist Mono, monospace" }}>llama-3.3-70b-versatile</code>
            </p>
          </div>

          {/* API Key */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: "0.06em" }}>API Key</label>
              {currentPreset?.keyLink && (
                <a href={currentPreset.keyLink} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: "0.72rem", color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}>
                  Get {currentPreset.label} key →
                </a>
              )}
            </div>
            <div style={{ position: "relative" }}>
              <input
                type={showKey ? "text" : "password"}
                value={local.apiKey}
                onChange={e => setLocal({ ...local, apiKey: e.target.value })}
                placeholder={currentPreset?.keyHint || "your-api-key"}
                style={{ ...inputStyle, paddingRight: 52 }}
                onFocus={e => (e.target.style.borderColor = "var(--accent)")}
                onBlur={e => (e.target.style.borderColor = "var(--border)")}
              />
              <button onClick={() => setShowKey(!showKey)} type="button" style={{
                position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer",
                color: "var(--text-3)", fontSize: "0.72rem", fontWeight: 500,
                fontFamily: "inherit",
              }}>
                {showKey ? "Hide" : "Show"}
              </button>
            </div>
            <p style={{ fontSize: "0.72rem", color: "var(--text-3)", marginTop: 5 }}>
              For Ollama/LM Studio, enter any placeholder — no real key needed. Stored only in your browser.
            </p>
          </div>

          {/* Info banner */}
          <div style={{
            padding: "12px 14px", borderRadius: 10,
            background: "var(--accent-bg)",
            border: "1px solid var(--border)",
            fontSize: "0.8rem", color: "var(--text-2)", lineHeight: 1.5,
          }}>
            <strong style={{ color: "var(--text)" }}>Need a free key?</strong> Ollama runs fully local with no key needed. Groq offers a generous free tier with fast models - great for getting started. 
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: "16px 24px",
          borderTop: "1px solid var(--border)",
          display: "flex", gap: 10,
          flexShrink: 0,
        }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "10px",
            borderRadius: 8, border: "1px solid var(--border)",
            background: "var(--bg-subtle)", color: "var(--text-2)",
            fontSize: "0.875rem", fontWeight: 500, cursor: "pointer",
            fontFamily: "inherit", transition: "all 0.15s",
          }}>Cancel</button>
          <button onClick={() => onSave(local)} style={{
            flex: 1, padding: "10px",
            borderRadius: 8, border: "none",
            background: "var(--accent)", color: "white",
            fontSize: "0.875rem", fontWeight: 600, cursor: "pointer",
            fontFamily: "inherit", transition: "opacity 0.15s",
          }}
            onMouseOver={e => (e.currentTarget.style.opacity = "0.88")}
            onMouseOut={e => (e.currentTarget.style.opacity = "1")}
          >Save Settings</button>
        </div>
      </div>
    </div>
  );
}