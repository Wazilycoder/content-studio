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
    <article className="overflow-hidden rounded-lg border border-[#E4E4DE] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <header className="flex items-center justify-between gap-3 border-b border-[#E4E4DE] px-4 py-2.5">
        <span className="inline-flex min-w-0 items-center rounded-md bg-[#F1F1ED] px-2 py-1 text-[11px] font-medium text-[#52525B]">
          <span className="truncate">{caption.angle}</span>
        </span>

        <button
          type="button"
          onClick={handleCopy}
          aria-label="Sao chép caption"
          className={`inline-flex shrink-0 items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-medium transition-colors ${
            copied
              ? "border-[#0E7051]/30 bg-[#0E7051]/[0.06] text-[#0E7051]"
              : "border-[#E4E4DE] bg-white text-[#71717A] hover:border-[#D4D4D8] hover:text-[#18181B]"
          }`}
        >
          {copied ? (
            <Check className="h-3 w-3" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
          <span>{copied ? "Đã chép" : "Chép"}</span>
        </button>
      </header>

      <div className="px-4 py-3.5">
        <p className="whitespace-pre-wrap break-words text-[13.5px] leading-relaxed text-[#18181B]">
          {caption.text}
        </p>
      </div>

      <footer className="border-t border-[#E4E4DE] px-4 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <span className="text-[11px] tabular-nums text-[#71717A]">
            {charCount} ký tự
          </span>

          <span
            className={`inline-flex items-center gap-1 text-[11px] ${
              exceeded ? "text-[#B45309]" : "text-[#0E7051]"
            }`}
          >
            {exceeded ? (
              <AlertTriangle className="h-3 w-3 shrink-0" />
            ) : (
              <Check className="h-3 w-3 shrink-0" />
            )}
            {exceeded ? "Vượt 125 ký tự khuyến nghị" : "Tối ưu cho Facebook"}
          </span>
        </div>

        {exceeded ? (
          <p className="mt-1 text-[10.5px] leading-relaxed text-[#B45309]/90">
            {facebook.message}
          </p>
        ) : null}

        {instagram.status === "limit_exceeded" ? (
          <p className="mt-1 text-[10.5px] leading-relaxed text-[#DC2626]">
            {instagram.message}
          </p>
        ) : null}
      </footer>
    </article>
  );
}