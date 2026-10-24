"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Check, Copy, Pencil, RotateCcw } from "lucide-react";
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
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(caption.text);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Đồng bộ lại text khi caption từ props thay đổi (ví dụ: khôi phục lịch sử hoặc tải sample mới)
  useEffect(() => {
    setText(caption.text);
    setIsEditing(false);
  }, [caption.text]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Tự động focus và cuộn chuột phù hợp khi bật chế độ sửa
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      // Auto resize chiều cao textarea theo nội dung
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [isEditing]);

  const charCount = countUnicodeChars(text);
  const facebook = getFacebookStatus(charCount);
  const instagram = getInstagramStatus(charCount);
  const exceeded = facebook.status === "recommended_exceeded";
  const ratio = Math.min(charCount / FB_PREVIEW_LIMIT, 1);
  const isModified = text !== caption.text;

  const handleCopy = async () => {
    const succeeded = await copyToClipboard(text);
    if (!succeeded) {
      onNotify?.("Không thể sao chép tự động. Vui lòng bôi đen và chép thủ công.");
      return;
    }

    setCopied(true);
    onNotify?.("Đã sao chép nội dung bài viết vào clipboard.");
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 1500);
  };

  const handleResetOriginal = () => {
    setText(caption.text);
    setIsEditing(false);
    onNotify?.("Đã khôi phục nội dung AI gốc.");
  };

  return (
    <article className="group overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] shadow-xs transition-all duration-200 hover:border-[var(--border-strong)] hover:shadow-md">
      {/* 1. Header: Phân loại góc nhìn & Nhóm nút thao tác */}
      <header className="flex flex-wrap items-center justify-between gap-2.5 border-b border-[var(--border-subtle)] bg-[var(--surface-raised)]/40 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-md bg-[var(--surface-raised)] px-2.5 py-1 text-[12px] font-semibold text-[var(--ink-secondary)]">
            <span className="truncate">{caption.angle}</span>
          </span>
          {isModified && (
            <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400">
              Đã chỉnh sửa
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {/* Nút Hoàn tác về nội dung AI gốc nếu có chỉnh sửa */}
          {isModified && (
            <button
              type="button"
              onClick={handleResetOriginal}
              title="Khôi phục nội dung AI ban đầu"
              className="btn-tactile inline-flex h-8 items-center gap-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-2 text-[11px] font-medium text-[var(--ink-tertiary)] hover:border-[var(--border-strong)] hover:text-[var(--ink-primary)]"
            >
              <RotateCcw className="h-3 w-3" />
              <span className="hidden sm:inline">Khôi phục AI</span>
            </button>
          )}

          {/* Nút Chỉnh sửa trực tiếp */}
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className={`btn-tactile inline-flex h-8 items-center gap-1 rounded-lg border px-2.5 text-[12px] font-medium transition-colors ${
              isEditing
                ? "border-[var(--accent-navy)] bg-[var(--accent-navy)]/[0.08] text-[var(--accent-navy)]"
                : "border-[var(--border-subtle)] bg-[var(--surface)] text-[var(--ink-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--ink-primary)]"
            }`}
          >
            {isEditing ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Xong</span>
              </>
            ) : (
              <>
                <Pencil className="h-3.5 w-3.5" />
                <span>Chỉnh sửa</span>
              </>
            )}
          </button>

          {/* Nút Sao chép */}
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Sao chép bài viết"
            className={`btn-tactile inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-lg border px-3 text-[12px] font-medium transition-colors ${
              copied
                ? "border-[var(--accent-emerald)] bg-[var(--accent-emerald)]/[0.08] text-[var(--accent-emerald)]"
                : "border-[var(--border-subtle)] bg-[var(--surface)] text-[var(--ink-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--ink-primary)]"
            }`}
          >
            {copied ? (
              <Check className="check-pop h-3.5 w-3.5" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            <span>{copied ? "Đã chép" : "Chép"}</span>
          </button>
        </div>
      </header>

      {/* 2. Body: Hiển thị hoặc Trình soạn thảo trực tiếp */}
      <div className="p-4 sm:p-5">
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                // Tự co giãn chiều cao
                e.target.style.height = "auto";
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              rows={4}
              className="w-full resize-none rounded-xl border border-[var(--accent-navy)]/40 bg-[var(--canvas)] p-3 text-[15px] leading-[1.7] text-[var(--ink-primary)] outline-hidden focus:border-[var(--accent-navy)] focus:ring-2 focus:ring-[var(--accent-navy)]/15"
              placeholder="Nhập nội dung chỉnh sửa..."
            />
            <p className="text-[11px] text-[var(--ink-tertiary)]">
              Mẹo: Các chỉ số ký tự và thước đo Facebook sẽ tự động cập nhật theo từng từ bạn gõ.
            </p>
          </div>
        ) : (
          <div
            onClick={() => setIsEditing(true)}
            className="cursor-pointer rounded-xl p-1 transition-colors hover:bg-[var(--surface-raised)]/50"
            title="Bấm để chỉnh sửa trực tiếp"
          >
            <p className="whitespace-pre-wrap break-words text-[15px] leading-[1.75] text-[var(--ink-primary)]">
              {text}
            </p>
          </div>
        )}
      </div>

      {/* 3. Footer: Thước đo thông minh 125 ký tự trước nút "Xem thêm" */}
      <footer className="space-y-2.5 border-t border-[var(--border-subtle)] bg-[var(--surface-raised)]/20 px-4 py-3 sm:px-5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[12px] font-medium tabular-nums text-[var(--ink-tertiary)]">
            <strong className="text-[var(--ink-primary)]">{charCount}</strong> ký tự
          </span>

          <span
            className={`inline-flex items-center gap-1 text-[12px] font-medium ${
              exceeded ? "text-[#B45309] dark:text-amber-400" : "text-[var(--accent-emerald)]"
            }`}
          >
            {exceeded ? (
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            ) : (
              <Check className="h-3.5 w-3.5 shrink-0" />
            )}
            {exceeded ? "Vượt mốc 125 ký tự" : "Trong mốc 125 ký tự"}
          </span>
        </div>

        {/* Vạch thước đo mốc 125 ký tự */}
        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-raised)]">
          <div
            className={`h-full rounded-full transition-[width] duration-200 ${
              exceeded ? "bg-[#B45309] dark:bg-amber-400" : "bg-[var(--accent-emerald)]"
            }`}
            style={{ width: `${ratio * 100}%` }}
          />
        </div>

        <p className="text-[11.5px] leading-relaxed text-[var(--ink-tertiary)]">
          {exceeded
            ? "Đoạn văn này sẽ bị ngắt sau nút 'Xem thêm' trên bảng tin Facebook."
            : "Toàn bộ bài viết hiển thị trực diện không cần bấm nút 'Xem thêm'."}
        </p>

        {instagram.status === "limit_exceeded" ? (
          <p className="text-[11.5px] leading-relaxed text-[#DC2626] dark:text-rose-400">
            {instagram.message}
          </p>
        ) : null}
      </footer>
    </article>
  );
}