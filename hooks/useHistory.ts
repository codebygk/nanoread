"use client";

// ─────────────────────────────────────────────
// useHistory – manages summary history in localStorage
// ─────────────────────────────────────────────

import { useState, useCallback } from "react";
import { MAX_HISTORY_ITEMS, STORAGE_KEYS } from "@/lib/constants";
import type { HistoryItem, SummarizeResult } from "@/types";

interface UseHistoryReturn {
  history: HistoryItem[];
  addToHistory: (result: SummarizeResult, model: string) => void;
  clearHistory: () => void;
  loadHistory: () => void;
}

export function useHistory(): UseHistoryReturn {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const loadHistory = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (raw) setHistory(JSON.parse(raw) as HistoryItem[]);
    } catch {
      // Malformed storage - start with empty history
    }
  }, []);

  const addToHistory = useCallback(
    (result: SummarizeResult, model: string) => {
      const item: HistoryItem = {
        id:        Date.now().toString(),
        url:       result.url,
        title:     result.title,
        summary:   result.summary,
        model,
        timestamp: Date.now(),
      };

      setHistory(prev => {
        const next = [item, ...prev].slice(0, MAX_HISTORY_ITEMS);
        try {
          localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(next));
        } catch { /* quota exceeded */ }
        return next;
      });
    },
    [],
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
    } catch { /* ignore */ }
  }, []);

  return { history, addToHistory, clearHistory, loadHistory };
}