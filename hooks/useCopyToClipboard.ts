"use client";

// ─────────────────────────────────────────────
// useCopyToClipboard – copies text and resets
//                      the "copied" flag after a delay
// ─────────────────────────────────────────────

import { useState, useCallback } from "react";
import { COPY_RESET_MS } from "@/lib/constants";

interface UseCopyReturn {
  copied: boolean;
  copy: (text: string) => void;
}

export function useCopyToClipboard(): UseCopyReturn {
  const [copied, setCopied] = useState(false);

  const copy = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), COPY_RESET_MS);
    });
  }, []);

  return { copied, copy };
}