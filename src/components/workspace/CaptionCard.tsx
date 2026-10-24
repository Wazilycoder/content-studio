"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Check, Copy } from "lucide-react";
import { copyToClipboard } from "@/lib/utils/clipboard";
import {
  countUnicodeChars,
  getFacebookStatus,
  getInstagramStatus,
} from "@/lib/utils/charCounter";
import type { CaptionItem } from "@/types/content";

const FB_PREVIEW_LIMIT = 125;

interface CaptionCardProps {
  caption: CaptionItem;
  onNotify?: (message: string) => void;
}

export default function CaptionCard({ caption, onNotify }: CaptionCardProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const charCount = countUnicodeChars(caption.text);
  const facebook = getFacebookStatus(charCount);
  const instagram = getInstagramStatus(charCount);
  const exceeded = facebook.status === "recommended_exceeded";
  const ratio = Math.min(charCount / FB_PREVIEW_LIMIT, 1);

  const handleCopy = async () => {
    const succeeded = await copyToClipboard(caption.text);
    if (!succeeded) {
      onNotify?.("Không thể sao chép tự động. Vui lòng bôi đen và chép thủ công.");
      return;
    }

    setCopied(true);
    onNotify?.("Đã chép caption vào clipboard.");
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 1500);
  };

  return (
    <article className="overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      <header className="flex items-center justify-between gap-3 border-b border-[var(--border-subtle)] px-4 py-3">
        <span className="inline-flex min-w-0 items-center rounded-md bg-[var(--surface-raised)] px-2.5 py-1 text-[12px] font-medium text-[var(--ink-secondary)]">
          <span className="truncate">{caption.angle}</span>
        </span>

        <button
          type="button"
          onClick={handleCopy}
          aria-label="Sao chép caption"
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-md border px-2.5 py-1 text-[12px] font-medium transition-colors ${
            copied
              ? "border-[var(--accent-emerald)]/30 bg-[var(--accent-emerald)]/[0.06] text-[var(--accent-emerald)]"
              : "border-[var(--border-subtle)] bg-white text-[var(--ink-tertiary)] hover:border-[var(--border-strong)] hover:text-[var(--ink-primary)]"
          }`}
        >
          {copied ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          <span>{copied ? "Đã chép" : "Chép"}</span>
        </button>
      </header>

      <div className="px-4 py-4">
        <p className="whitespace-pre-wrap break-words text-[15px] leading-[1.7] text-[var(--ink-primary)]">
          {caption.text}
        </p>
      </div>

      <footer className="space-y-2 border-t border-[var(--border-subtle)] px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[12px] tabular-nums text-[var(--ink-tertiary)]">
            {charCount} ký tự
          </span>

          <span
            className={`inline-flex items-center gap-1 text-[12px] ${
              exceeded ? "text-[#B45309]" : "text-[var(--accent-emerald)]"
            }`}
          >
            {exceeded ? (
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            ) : (
              <Check className="h-3.5 w-3.5 shrink-0" />
            )}
            {exceeded ? "Vượt mốc 125" : "Trong mốc 125"}
          </span>
        </div>

        {/* Vạch thước đo mốc 125 ký tự */}
        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-raised)]">
          <div
            className={`h-full rounded-full transition-[width] duration-300 ${
              exceeded ? "bg-[#B45309]" : "bg-[var(--accent-emerald)]"
            }`}
            style={{ width: `${ratio * 100}%` }}
          />
        </div>

        <p className="text-[12px] leading-relaxed text-[var(--ink-tertiary)]">
          {exceeded
            ? "Nội dung sẽ hiện sau nút Xem thêm trên Facebook."
            : "Toàn bộ nội dung hiển thị trước nút Xem thêm."}
        </p>

        {instagram.status === "limit_exceeded" ? (
          <p className="text-[12px] leading-relaxed text-[#DC2626]">
            {instagram.message}
          </p>
        ) : null}
      </footer>
    </article>
  );
}