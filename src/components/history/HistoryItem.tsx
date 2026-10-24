"use client";

import { useState } from "react";
import { ChevronDown, Loader2, RotateCcw, Trash2 } from "lucide-react";
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
}

export default function HistoryItem({
  record,
  onRestore,
  onDelete,
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
      <article className="rounded-xl border border-[#E4E4DE] bg-white p-3.5 transition-colors hover:border-[#3B49DF]/40">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 min-w-0 flex-1 text-xs font-semibold leading-5 text-[#18181B]">
            {record.productName || "Bài viết không tên"}
          </h3>
          <span className="shrink-0 rounded-md bg-[#F1F1ED] px-1.5 py-0.5 text-[10px] font-medium text-[#71717A]">
            {TONE_LABELS[record.tone] ?? "Khác"}
          </span>
        </div>

        <p className="mt-1 text-[10.5px] tabular-nums text-[#A1A1AA]">
          {formatVnDateTime(record.createdAt)}
        </p>

        <p className="mt-2 line-clamp-2 text-[12px] leading-[1.55] text-[#71717A]">
          {preview}
        </p>

        <div className="mt-2 flex flex-wrap gap-1">
          {record.hashtags.map((tag, index) => (
            <span
              key={`${tag}-${index}`}
              className="rounded bg-[#F1F1ED] px-1.5 py-0.5 text-[10px] font-medium text-[#71717A]"
            >
              {tag}
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-medium text-[#71717A] transition-colors hover:text-[#3B49DF]"
        >
          {expanded ? "Thu gọn" : "Xem đầy đủ 3 captions & headlines"}
          <ChevronDown
            className={`h-3 w-3 transition-transform ${
              expanded ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>

        {expanded ? (
          <div className="mt-3 space-y-3 border-t border-[#F1F1ED] pt-3">
            {record.captions.map((caption) => (
              <div key={caption.id}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[#A1A1AA]">
                  {caption.angle}
                </p>
                <p className="mt-1 whitespace-pre-line text-[11.5px] leading-[1.6] text-[#27272A]">
                  {caption.text}
                </p>
              </div>
            ))}

            <div className="border-t border-[#F1F1ED] pt-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[#A1A1AA]">
                Headlines
              </p>
              <ul className="mt-1 space-y-1">
                {record.headlines.map((headline, index) => (
                  <li
                    key={`${index}-${headline}`}
                    className="flex gap-1.5 text-[11.5px] leading-[1.55] text-[#27272A]"
                  >
                    <span className="shrink-0 text-[#A1A1AA]">
                      {index + 1}.
                    </span>
                    <span>{headline}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}

        <div className="mt-3 flex items-center gap-2 border-t border-[#F1F1ED] pt-2.5">
          <button
            type="button"
            onClick={() => onRestore(record)}
            disabled={deleting}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-[#3B49DF] px-2.5 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-[#2F3CBF] disabled:opacity-50"
          >
            <RotateCcw className="h-3 w-3" />
            Khôi phục vào Form
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            aria-label="Xóa bài viết khỏi lịch sử"
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[11px] font-medium text-[#71717A] transition-colors hover:bg-[#DC2626]/5 hover:text-[#DC2626] disabled:opacity-50"
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