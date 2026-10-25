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
  const [displayedHeadline, setDisplayedHeadline] = useState(headline);
  const [isStreaming, setIsStreaming] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const streamIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevHeadlineRef = useRef(headline);

  useEffect(() => {
    if (headline && headline !== prevHeadlineRef.current) {
      prevHeadlineRef.current = headline;
      setIsStreaming(true);
      setDisplayedHeadline("");

      let currentIndex = 0;
      if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);

      streamIntervalRef.current = setInterval(() => {
        currentIndex = Math.min(currentIndex + 2, headline.length);
        setDisplayedHeadline(headline.slice(0, currentIndex));

        if (currentIndex >= headline.length) {
          if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
          setIsStreaming(false);
        }
      }, 18);

      return () => {
        if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
      };
    } else {
      setDisplayedHeadline(headline);
      setIsStreaming(false);
    }
  }, [headline]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
    };
  }, []);

  const finishStreaming = () => {
    if (isStreaming) {
      if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
      setDisplayedHeadline(headline);
      setIsStreaming(false);
    }
  };

  const handleCopy = async () => {
    finishStreaming();
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
    <div
      onClick={finishStreaming}
      className="flex cursor-pointer items-start gap-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-3.5 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-colors hover:border-[var(--border-strong)]"
    >
      <span className="mt-[1px] inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[var(--surface-raised)] text-[10.5px] font-semibold tabular-nums text-[var(--ink-tertiary)]">
        {String(index + 1).padStart(2, "0")}
      </span>

      <p className="min-w-0 flex-1 break-words text-[13px] font-medium leading-relaxed text-[var(--ink-primary)]">
        {displayedHeadline}
        {isStreaming && (
          <span className="ml-1 inline-block h-[13px] w-[2px] animate-pulse rounded-xs bg-indigo-500 align-middle" />
        )}
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