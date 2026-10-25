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
import type { InspirationPreset } from "./EmptyState";

type ViewMode = "cards" | "facebook_mockup";

interface ResultsSectionProps {
  result: GeneratedContent | null;
  loading: boolean;
  onRegenerate: () => void;
  onNotify: (message: string) => void;
  onSelectInspiration?: (preset: InspirationPreset) => void;
}

export default function ResultsSection({
  result,
  loading,
  onRegenerate,
  onNotify,
  onSelectInspiration,
}: ResultsSectionProps) {
  const [view, setView] = useState<ViewMode>("cards");
  const [previewIndex, setPreviewIndex] = useState(0);

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

  const previewCaption =
    result?.captions[previewIndex] ?? result?.captions[0] ?? null;

  return (
    <div className="relative">
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
            className="btn-tactile inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-1.5 text-[12px] font-medium text-[var(--ink-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--ink-primary)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-[var(--accent-navy)]" : ""}`} />
            Tạo lại
          </button>
          <button
            type="button"
            onClick={handleCopyAll}
            disabled={!result}
            className="btn-tactile inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-1.5 text-[12px] font-medium text-[var(--ink-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--ink-primary)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Copy className="h-3.5 w-3.5" />
            Sao chép tất cả
          </button>
        </div>
      </div>

      {result && !loading ? (
        <div className="mb-5 inline-flex rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-1 shadow-inner">
          <button
            type="button"
            onClick={() => setView("cards")}
            aria-pressed={view === "cards"}
            className={`btn-tactile inline-flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-[12px] font-medium transition-all duration-200 ${
              view === "cards"
                ? "bg-[var(--surface)] text-[var(--ink-primary)] shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
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
            className={`btn-tactile inline-flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-[12px] font-medium transition-all duration-200 ${
              view === "facebook_mockup"
                ? "bg-[var(--surface)] text-[var(--ink-primary)] shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
                : "text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            Xem trước đa kênh
          </button>
        </div>
      ) : null}

      {loading ? (
        <SkeletonResults />
      ) : !result ? (
        <EmptyState onSelectInspiration={onSelectInspiration} />
      ) : view === "facebook_mockup" ? (
        <div className="animate-fade-in">
          <div className="mb-3 flex flex-wrap gap-1.5">
            {result.captions.map((caption, index) => {
              const isActive = caption === previewCaption;
              return (
                <button
                  key={caption.id}
                  type="button"
                  onClick={() => setPreviewIndex(index)}
                  className={`btn-tactile shrink-0 rounded-full border px-3.5 py-1.5 text-[12px] font-medium transition-all duration-200 ${
                    isActive
                      ? "border-[var(--accent-navy)] bg-[var(--accent-navy)] text-white shadow-xs"
                      : "border-[var(--border-subtle)] bg-[var(--surface)] text-[var(--ink-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--ink-primary)]"
                  }`}
                >
                  Góc {index + 1}: {caption.angle.split(":")[1]?.trim() || caption.angle}
                </button>
              );
            })}
          </div>
          {previewCaption ? (
            <FacebookMockup
              activeText={previewCaption.text}
              activeAngle={previewCaption.angle}
              headline={result.headlines[0]}
              hashtags={result.hashtags}
              onNotify={onNotify}
            />
          ) : null}
        </div>
      ) : (
        <div className="space-y-6">
          <section className="animate-fade-in-up">
            <h3 className="mb-2.5 flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wider text-[var(--ink-tertiary)]">
              <AlignLeft className="h-3.5 w-3.5 text-[var(--accent-navy)]" />
              3 góc bài viết
            </h3>
            <div className="space-y-3">
              {result.captions.map((caption, index) => (
                <div
                  key={caption.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 90}ms` }}
                >
                  <CaptionCard
                    caption={caption}
                    onNotify={onNotify}
                  />
                </div>
              ))}
            </div>
          </section>

          <section
            className="animate-fade-in-up"
            style={{ animationDelay: "280ms" }}
          >
            <h3 className="mb-2.5 flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wider text-[var(--ink-tertiary)]">
              <Sparkles className="h-3.5 w-3.5 text-[var(--accent-navy)]" />
              3 headlines thu hút
            </h3>
            <div className="space-y-2">
              {result.headlines.map((headline, index) => (
                <div
                  key={`${index}-${headline}`}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${(index + 3) * 70}ms` }}
                >
                  <HeadlineCard
                    headline={headline}
                    index={index}
                    onNotify={onNotify}
                  />
                </div>
              ))}
            </div>
          </section>

          <section
            className="animate-fade-in-up"
            style={{ animationDelay: "450ms" }}
          >
            <HashtagGroup hashtags={result.hashtags} onNotify={onNotify} />
          </section>
        </div>
      )}
    </div>
  );
}