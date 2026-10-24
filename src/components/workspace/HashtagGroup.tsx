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
    <div className="overflow-hidden rounded-lg border border-[#E4E4DE] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <header className="flex items-center justify-between gap-3 border-b border-[#E4E4DE] px-4 py-2.5">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
          <Hash className="h-3.5 w-3.5" />
          Hashtags
        </span>

        <button
          type="button"
          onClick={copyAll}
          aria-label="Chép tất cả hashtag"
          className={`inline-flex shrink-0 items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-medium transition-colors ${
            copiedAll
              ? "border-[#0E7051]/30 bg-[#0E7051]/[0.06] text-[#0E7051]"
              : "border-[#E4E4DE] bg-white text-[#71717A] hover:border-[#D4D4D8] hover:text-[#18181B]"
          }`}
        >
          {copiedAll ? (
            <Check className="h-3 w-3" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
          <span>{copiedAll ? "Đã chép tất cả" : "Chép tất cả 5 hashtag"}</span>
        </button>
      </header>

      <div className="flex flex-wrap gap-1.5 px-4 py-3">
        {hashtags.map((tag) => {
          const active = copiedTag === tag;
          return (
            <button
              key={tag}
              type="button"
              onClick={() => copyTag(tag)}
              aria-label={`Sao chép ${tag}`}
              className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-[12px] font-medium transition-colors ${
                active
                  ? "border-[#0E7051]/30 bg-[#0E7051]/[0.06] text-[#0E7051]"
                  : "border-[#E4E4DE] bg-[#F8F8F6] text-[#3F3F46] hover:border-[#3B49DF]/40 hover:bg-[#3B49DF]/[0.06] hover:text-[#3B49DF]"
              }`}
            >
              {active ? <Check className="h-3 w-3" /> : null}
              <span className="break-all">{tag}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}