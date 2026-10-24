"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { copyToClipboard } from "@/lib/utils/clipboard";

interface HeadlineCardProps {
  headline: string;
  index: number;
  onNotify?: (message: string) => void;
}

export default function HeadlineCard({
  headline,
  index,
  onNotify,
}: HeadlineCardProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleCopy = async () => {
    const succeeded = await copyToClipboard(headline);
    if (!succeeded) {
      onNotify?.("Không thể sao chép tự động. Vui lòng bôi đen và chép thủ công.");
      return;
    }

    setCopied(true);
    onNotify?.("Đã chép headline vào clipboard.");
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex items-start gap-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-3.5 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-colors hover:border-[var(--border-strong)]">
      <span className="mt-[1px] inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[var(--surface-raised)] text-[10.5px] font-semibold tabular-nums text-[var(--ink-tertiary)]">
        {String(index + 1).padStart(2, "0")}
      </span>

      <p className="min-w-0 flex-1 break-words text-[13px] font-medium leading-relaxed text-[var(--ink-primary)]">
        {headline}
      </p>

      <button
        type="button"
        onClick={handleCopy}
        aria-label="Sao chép headline"
        title="Chép headline"
        className={`btn-tactile inline-flex shrink-0 items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-medium transition-colors ${
          copied
            ? "border-[var(--accent-emerald)] bg-[var(--accent-emerald)]/[0.08] text-[var(--accent-emerald)]"
            : "border-[var(--border-subtle)] bg-[var(--surface)] text-[var(--ink-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--ink-primary)]"
        }`}
      >
        {copied ? (
          <Check className="check-pop h-3 w-3" />
        ) : (
          <Copy className="h-3 w-3" />
        )}
        <span className="hidden sm:inline">{copied ? "Đã chép" : "Chép"}</span>
      </button>
    </div>
  );
}