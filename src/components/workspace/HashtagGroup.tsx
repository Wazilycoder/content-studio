"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, Hash } from "lucide-react";
import { copyToClipboard } from "@/lib/utils/clipboard";

interface HashtagGroupProps {
  hashtags: string[];
  onNotify?: (message: string) => void;
}

export default function HashtagGroup({ hashtags, onNotify }: HashtagGroupProps) {
  const [copiedTag, setCopiedTag] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const tagTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const allTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (tagTimerRef.current) clearTimeout(tagTimerRef.current);
      if (allTimerRef.current) clearTimeout(allTimerRef.current);
    };
  }, []);

  const copyTag = async (tag: string) => {
    const succeeded = await copyToClipboard(tag);
    if (!succeeded) {
      onNotify?.("Không thể sao chép tự động. Vui lòng bôi đen và chép thủ công.");
      return;
    }

    setCopiedTag(tag);
    onNotify?.(`Đã chép ${tag}`);
    if (tagTimerRef.current) clearTimeout(tagTimerRef.current);
    tagTimerRef.current = setTimeout(() => setCopiedTag(null), 1500);
  };

  const copyAll = async () => {
    const succeeded = await copyToClipboard(hashtags.join(" "));
    if (!succeeded) {
      onNotify?.("Không thể sao chép tự động. Vui lòng bôi đen và chép thủ công.");
      return;
    }

    setCopiedAll(true);
    onNotify?.("Đã chép toàn bộ hashtag.");
    if (allTimerRef.current) clearTimeout(allTimerRef.current);
    allTimerRef.current = setTimeout(() => setCopiedAll(false), 1500);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <header className="flex items-center justify-between gap-3 border-b border-[var(--border-subtle)] px-4 py-2.5">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-tertiary)]">
          <Hash className="h-3.5 w-3.5 text-[var(--accent-navy)]" />
          Bộ 5 Hashtags đề xuất
        </span>

        <button
          type="button"
          onClick={copyAll}
          aria-label="Chép tất cả hashtag"
          className={`btn-tactile inline-flex shrink-0 items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-medium transition-colors ${
            copiedAll
              ? "border-[var(--accent-emerald)] bg-[var(--accent-emerald)]/[0.08] text-[var(--accent-emerald)]"
              : "border-[var(--border-subtle)] bg-[var(--surface)] text-[var(--ink-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--ink-primary)]"
          }`}
        >
          {copiedAll ? (
            <Check className="check-pop h-3 w-3" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
          <span>{copiedAll ? "Đã chép tất cả" : "Chép tất cả 5 hashtag"}</span>
        </button>
      </header>

      <div className="flex flex-wrap gap-2 px-4 py-3.5">
        {hashtags.map((tag) => {
          const active = copiedTag === tag;
          return (
            <button
              key={tag}
              type="button"
              onClick={() => copyTag(tag)}
              aria-label={`Sao chép ${tag}`}
              className={`btn-tactile inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-[12px] font-medium transition-all duration-150 ${
                active
                  ? "border-[var(--accent-emerald)] bg-[var(--accent-emerald)]/[0.08] text-[var(--accent-emerald)]"
                  : "border-[var(--border-subtle)] bg-[var(--surface-raised)] text-[var(--ink-secondary)] hover:border-[var(--accent-navy)]/40 hover:bg-[var(--accent-navy)]/[0.06] hover:text-[var(--accent-navy)]"
              }`}
            >
              {active ? <Check className="check-pop h-3 w-3" /> : null}
              <span className="break-all">{tag}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}