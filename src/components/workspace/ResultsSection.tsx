"use client";

import { useState } from "react";
import { AlignLeft, Copy, LayoutList, RefreshCw, Smartphone, Sparkles } from "lucide-react";
import { copyToClipboard } from "@/lib/utils/clipboard";
import CaptionCard from "./CaptionCard";
import EmptyState from "./EmptyState";
import FacebookMockup from "./FacebookMockup";
import HashtagGroup from "./HashtagGroup";
import HeadlineCard from "./HeadlineCard";
import SkeletonResults from "./SkeletonResults";
import type { GeneratedContent } from "@/types/content";

type ViewMode = "cards" | "facebook_mockup";

interface ResultsSectionProps {
  result: GeneratedContent | null;
  loading: boolean;
  onRegenerate: () => void;
  onNotify: (message: string) => void;
}

export default function ResultsSection({
  result,
  loading,
  onRegenerate,
  onNotify,
}: ResultsSectionProps) {
  const [view, setView] = useState<ViewMode>("cards");

  const handleCopyAll = async () => {
    if (!result) return;
    const combined = result.captions
      .map((caption) => `${caption.angle}\n\n${caption.text}`)
      .join("\n\n———\n\n");
    const ok = await copyToClipboard(combined);
    onNotify(
      ok
        ? "Đã chép toàn bộ 3 góc bài viết."
        : "Không thể sao chép tự động. Vui lòng thử lại.",
    );
  };

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 border-b border-[var(--border-subtle)] pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="flex items-center gap-1.5 text-[15px] font-semibold tracking-tight text-[var(--ink-primary)]">
            <Sparkles className="h-4 w-4 text-[var(--accent-navy)]" />
            Nội dung bài viết (3 Góc Nhìn)
          </h2>
          <p className="mt-0.5 text-[13px] text-[var(--ink-secondary)]">
            {result
              ? "3 góc nhìn · 3 headlines · 5 hashtags"
              : "Chưa có nội dung được tạo"}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onRegenerate}
            disabled={loading || !result}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-white px-3 py-1.5 text-[12px] font-medium text-[var(--ink-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--ink-primary)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Tạo lại
          </button>
          <button
            type="button"
            onClick={handleCopyAll}
            disabled={!result}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-white px-3 py-1.5 text-[12px] font-medium text-[var(--ink-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--ink-primary)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Copy className="h-3.5 w-3.5" />
            Sao chép tất cả
          </button>
        </div>
      </div>

      {result && !loading ? (
        <div className="mb-4 inline-flex rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-0.5">
          <button
            type="button"
            onClick={() => setView("cards")}
            aria-pressed={view === "cards"}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors ${
              view === "cards"
                ? "bg-white text-[var(--ink-primary)] shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
                : "text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
            }`}
          >
            <LayoutList className="h-3.5 w-3.5" />
            Chi tiết từng góc
          </button>
          <button
            type="button"
            onClick={() => setView("facebook_mockup")}
            aria-pressed={view === "facebook_mockup"}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors ${
              view === "facebook_mockup"
                ? "bg-white text-[var(--ink-primary)] shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
                : "text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            Xem trước Facebook Post
          </button>
        </div>
      ) : null}

      {loading ? (
        <SkeletonResults />
      ) : !result ? (
        <EmptyState />
      ) : view === "facebook_mockup" ? (
        <FacebookMockup captions={result.captions} />
      ) : (
        <div className="space-y-6">
          <section>
            <h3 className="mb-2 flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wider text-[var(--ink-tertiary)]">
              <AlignLeft className="h-3.5 w-3.5" />
              3 góc bài viết
            </h3>
            <div className="space-y-3">
              {result.captions.map((caption) => (
                <CaptionCard
                  key={caption.id}
                  caption={caption}
                  onNotify={onNotify}
                />
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-2 flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wider text-[var(--ink-tertiary)]">
              <Sparkles className="h-3.5 w-3.5" />
              3 headlines
            </h3>
            <div className="space-y-2">
              {result.headlines.map((headline, index) => (
                <HeadlineCard
                  key={`${index}-${headline}`}
                  headline={headline}
                  index={index}
                  onNotify={onNotify}
                />
              ))}
            </div>
          </section>

          <section>
            <HashtagGroup hashtags={result.hashtags} onNotify={onNotify} />
          </section>
        </div>
      )}
    </div>
  );
}