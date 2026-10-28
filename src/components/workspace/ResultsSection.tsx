"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlignLeft,
  Check,
  Copy,
  Hash,
  Layers3,
  LayoutList,
  RefreshCw,
  Smartphone,
  Type,
} from "lucide-react";
import { copyToClipboard } from "@/lib/utils/clipboard";
import CaptionCard from "./CaptionCard";
import EmptyState from "./EmptyState";
import FacebookMockup from "./FacebookMockup";
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
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  const handleCopyWithFeedback = async (value: string, key: string, message: string) => {
    const ok = await copyToClipboard(value);
    if (!ok) {
      onNotify("Không thể sao chép tự động. Vui lòng thử lại.");
      return;
    }
    setCopiedKey(key);
    onNotify(message);
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => setCopiedKey(null), 1600);
  };

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
            <Layers3 className="h-4 w-4 text-[var(--accent-navy)]" />
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
        <div className="relative mb-5 grid w-full max-w-[420px] grid-cols-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-1">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-1 left-1 rounded-lg bg-[var(--surface)] shadow-[0_1px_3px_rgba(0,0,0,0.1)] transition-transform duration-[280ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              width: "calc(50% - 4px)",
              transform: `translateX(${view === "cards" ? 0 : 100}%)`,
            }}
          />
          <button
            type="button"
            onClick={() => setView("cards")}
            aria-pressed={view === "cards"}
            className={`btn-tactile relative z-10 inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-semibold transition-colors ${
              view === "cards"
                ? "text-[var(--ink-primary)]"
                : "text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
            }`}
          >
            <LayoutList className="h-3.5 w-3.5 shrink-0" />
            Chi tiết từng góc
          </button>
          <button
            type="button"
            onClick={() => setView("facebook_mockup")}
            aria-pressed={view === "facebook_mockup"}
            className={`btn-tactile relative z-10 inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-semibold transition-colors ${
              view === "facebook_mockup"
                ? "text-[var(--ink-primary)]"
                : "text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
            }`}
          >
            <Smartphone className="h-3.5 w-3.5 shrink-0" />
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
          <div className="relative mb-3 grid w-full max-w-[560px] grid-cols-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-1">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-1 left-1 rounded-lg bg-[var(--surface)] shadow-[0_1px_3px_rgba(0,0,0,0.1)] transition-transform duration-[280ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                width: "calc(33.3333% - 2.667px)",
                transform: `translateX(${
                  Math.min(previewIndex, Math.max(result.captions.length - 1, 0)) * 100
                }%)`,
              }}
            />
            {result.captions.map((caption, index) => {
              const isActive = caption === previewCaption;
              const shortLabel = caption.angle.split(":")[1]?.trim() || caption.angle;
              return (
                <button
                  key={caption.id}
                  type="button"
                  onClick={() => setPreviewIndex(index)}
                  aria-pressed={isActive}
                  className={`btn-tactile relative z-10 inline-flex min-w-0 flex-col items-center justify-center gap-0.5 rounded-lg px-2 py-1.5 transition-colors ${
                    isActive
                      ? "text-[var(--accent-navy)]"
                      : "text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
                  }`}
                >
                  <span className="text-[12px] font-bold uppercase tracking-wide text-[var(--ink-tertiary)]">
                    Góc {index + 1}
                  </span>
                  <span className="w-full truncate text-center text-[12.5px] font-semibold">
                    {shortLabel}
                  </span>
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
            <h3 className="mb-2.5 flex items-center gap-1.5 text-[12.5px] font-semibold uppercase tracking-wider text-[var(--ink-tertiary)]">
              <Type className="h-3.5 w-3.5 shrink-0 text-[var(--accent-navy)]" />
              3 headlines thu hút
            </h3>
            <div className="space-y-2">
              {result.headlines.map((headline, index) => {
                const key = `headline-${index}`;
                return (
                  <div
                    key={key}
                    className="animate-fade-in-up flex items-start gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] px-3.5 py-2.5 transition-colors hover:border-[var(--border-strong)]"
                    style={{ animationDelay: `${(index + 3) * 70}ms` }}
                  >
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[var(--surface-raised)] text-[12px] font-semibold tabular-nums text-[var(--ink-tertiary)]">
                      {index + 1}
                    </span>
                    <p className="min-w-0 flex-1 text-[14.5px] leading-relaxed text-[var(--ink-primary)]">
                      {headline}
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        void handleCopyWithFeedback(
                          headline,
                          key,
                          `Đã sao chép tiêu đề ${index + 1}.`,
                        )
                      }
                      aria-label={`Sao chép tiêu đề ${index + 1}`}
                      className={`btn-tactile inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                        copiedKey === key
                          ? "border-[var(--accent-emerald)] bg-[var(--accent-emerald)]/10 text-[var(--accent-emerald)]"
                          : "border-[var(--border-subtle)] text-[var(--ink-tertiary)] hover:border-[var(--border-strong)] hover:text-[var(--ink-primary)]"
                      }`}
                    >
                      {copiedKey === key ? (
                        <Check className="check-pop h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          <section
            className="animate-fade-in-up"
            style={{ animationDelay: "450ms" }}
          >
            <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
              <h3 className="flex items-center gap-1.5 text-[12.5px] font-semibold uppercase tracking-wider text-[var(--ink-tertiary)]">
                <Hash className="h-3.5 w-3.5 shrink-0 text-[var(--accent-navy)]" />
                5 hashtags đề xuất
              </h3>
              <button
                type="button"
                onClick={() =>
                  void handleCopyWithFeedback(
                    result.hashtags.join(" "),
                    "hashtags",
                    "Đã sao chép toàn bộ 5 hashtag.",
                  )
                }
                className={`btn-tactile inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[12.5px] font-medium transition-colors ${
                  copiedKey === "hashtags"
                    ? "border-[var(--accent-emerald)] bg-[var(--accent-emerald)]/10 text-[var(--accent-emerald)]"
                    : "border-[var(--border-subtle)] bg-[var(--surface)] text-[var(--ink-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--ink-primary)]"
                }`}
              >
                {copiedKey === "hashtags" ? (
                  <Check className="check-pop h-3.5 w-3.5" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                {copiedKey === "hashtags" ? "Đã sao chép" : "Sao chép toàn bộ 5 hashtag"}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {result.hashtags.map((tag, index) => {
                const key = `hashtag-${index}`;
                const label = tag.trim().startsWith("#") ? tag.trim() : `#${tag.trim()}`;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() =>
                      void handleCopyWithFeedback(label, key, `Đã sao chép ${label}.`)
                    }
                    className={`btn-tactile inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors ${
                      copiedKey === key
                        ? "border-[var(--accent-emerald)] bg-[var(--accent-emerald)]/10 text-[var(--accent-emerald)]"
                        : "border-[var(--border-subtle)] bg-[var(--surface-raised)] text-[var(--ink-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--ink-primary)]"
                    }`}
                  >
                    {copiedKey === key ? (
                      <Check className="check-pop h-3.5 w-3.5" />
                    ) : (
                      <Hash className="h-3.5 w-3.5" />
                    )}
                    <span className="max-w-[220px] truncate">{label}</span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}