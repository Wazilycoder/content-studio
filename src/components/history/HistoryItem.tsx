"use client";

import { useState } from "react";
import { ChevronDown, Loader2, RotateCcw, Star, Trash2 } from "lucide-react";
import type { GenerationRecord, ToneOption } from "@/types/content";

const TONE_LABELS: Record<ToneOption, string> = {
  "hai-huoc": "Hài hước",
  "trang-trong": "Sang trọng",
  "tre-trung": "Trẻ trung",
  "dong-cam": "Đồng cảm",
  "chuyen-gia": "Chuyên gia",
  "ke-chuyen": "Kể chuyện",
  "kich-thich": "Kích thích mua",
};

function formatVnDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Không rõ thời gian";

  const time = new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);

  const day = new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);

  return `${time} ${day}`;
}

interface HistoryItemProps {
  record: GenerationRecord;
  onRestore: (record: GenerationRecord) => void;
  onDelete: (id: string) => Promise<boolean>;
  starred?: boolean;
  onToggleStar?: (id: string) => void;
}

export default function HistoryItem({
  record,
  onRestore,
  onDelete,
  starred = false,
  onToggleStar,
}: HistoryItemProps) {
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const preview = record.captions[0]?.text ?? "";

  const handleDelete = async () => {
    if (deleting) return;
    setDeleting(true);
    await new Promise((resolve) => setTimeout(resolve, 160));
    const ok = await onDelete(record.id);
    if (!ok) setDeleting(false);
  };

  return (
    <li
      className={`transition-all duration-200 ease-out ${
        deleting
          ? "pointer-events-none -translate-y-1 scale-[0.98] opacity-0"
          : "translate-y-0 scale-100 opacity-100"
      }`}
    >
      <article className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-colors hover:border-[var(--accent-navy)]/40">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 min-w-0 flex-1 text-xs font-semibold leading-5 text-[var(--ink-primary)]">
            {record.productName || "Bài viết không tên"}
          </h3>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => onToggleStar?.(record.id)}
              aria-label="Ghim bài viết yêu thích lên đầu"
              aria-pressed={Boolean(starred)}
              title="Ghim bài viết yêu thích lên đầu"
              className="btn-tactile rounded p-0.5 transition-transform active:scale-90"
            >
              <Star
                className={`h-3.5 w-3.5 transition-colors ${
                  starred
                    ? "fill-amber-400 text-amber-500"
                    : "text-[var(--ink-tertiary)] hover:text-amber-500"
                }`}
              />
            </button>
            <span className="rounded-md bg-[var(--surface-raised)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--ink-secondary)]">
              {TONE_LABELS[record.tone] ?? "Khác"}
            </span>
          </div>
        </div>

        <p className="mt-1 text-[10.5px] tabular-nums text-[var(--ink-tertiary)]">
          {formatVnDateTime(record.createdAt)}
        </p>

        <p className="mt-2 line-clamp-2 text-[12px] leading-[1.55] text-[var(--ink-secondary)]">
          {preview}
        </p>

        <div className="mt-2 flex flex-wrap gap-1">
          {record.hashtags.map((tag, index) => (
            <span
              key={`${tag}-${index}`}
              className="rounded bg-[var(--surface-raised)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--ink-secondary)]"
            >
              {tag}
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="btn-tactile mt-2.5 inline-flex items-center gap-1 text-[11px] font-medium text-[var(--ink-secondary)] transition-colors hover:text-[var(--accent-navy)]"
        >
          {expanded ? "Thu gọn" : "Xem đầy đủ 3 captions & headlines"}
          <ChevronDown
            className={`h-3 w-3 transition-transform ${
              expanded ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>

        {expanded ? (
          <div className="mt-3 space-y-3 border-t border-[var(--border-subtle)] pt-3">
            {record.captions.map((caption) => (
              <div key={caption.id}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--ink-tertiary)]">
                  {caption.angle}
                </p>
                <p className="mt-1 whitespace-pre-line text-[11.5px] leading-[1.6] text-[var(--ink-primary)]">
                  {caption.text}
                </p>
              </div>
            ))}

            <div className="border-t border-[var(--border-subtle)] pt-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--ink-tertiary)]">
                Headlines
              </p>
              <ul className="mt-1 space-y-1">
                {record.headlines.map((headline, index) => (
                  <li
                    key={`${index}-${headline}`}
                    className="flex gap-1.5 text-[11.5px] leading-[1.55] text-[var(--ink-primary)]"
                  >
                    <span className="shrink-0 text-[var(--ink-tertiary)]">
                      {index + 1}.
                    </span>
                    <span>{headline}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}

        <div className="mt-3 flex items-center gap-2 border-t border-[var(--border-subtle)] pt-2.5">
          <button
            type="button"
            onClick={() => onRestore(record)}
            disabled={deleting}
            className="btn-tactile inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-[var(--accent-navy)] px-2.5 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-[var(--accent-navy-hover)] disabled:opacity-50"
          >
            <RotateCcw className="h-3 w-3" />
            Khôi phục vào Form
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            aria-label="Xóa bài viết khỏi lịch sử"
            className="btn-tactile inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[11px] font-medium text-[var(--ink-secondary)] transition-colors hover:bg-[#DC2626]/10 hover:text-[#DC2626] disabled:opacity-50"
          >
            {deleting ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Trash2 className="h-3 w-3" />
            )}
            Xóa
          </button>
        </div>
      </article>
    </li>
  );
}