"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Check, Copy, Eye, Pencil, RotateCcw, Zap } from "lucide-react";
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
  const [displayedText, setDisplayedText] = useState(caption.text);
  const [isStreaming, setIsStreaming] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const streamIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const prevTextRef = useRef(caption.text);

  // Hiệu ứng Typewriter Streaming mượt mà khi nhận bài viết mới từ AI
  useEffect(() => {
    setText(caption.text);
    setIsEditing(false);

    if (caption.text && caption.text !== prevTextRef.current) {
      prevTextRef.current = caption.text;
      setIsStreaming(true);
      setDisplayedText("");

      let currentIndex = 0;
      const fullText = caption.text;
      const step = Math.max(3, Math.floor(fullText.length / 40));

      if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);

      streamIntervalRef.current = setInterval(() => {
        currentIndex = Math.min(currentIndex + step, fullText.length);
        setDisplayedText(fullText.slice(0, currentIndex));

        if (currentIndex >= fullText.length) {
          if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
          setIsStreaming(false);
        }
      }, 16);

      return () => {
        if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
      };
    } else {
      setDisplayedText(caption.text);
      setIsStreaming(false);
    }
  }, [caption.text]);

  const finishStreaming = () => {
    if (isStreaming) {
      if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
      setDisplayedText(text);
      setIsStreaming(false);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
    };
  }, []);

  // Tự động focus và cuộn chuột phù hợp khi bật chế độ sửa
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
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
    finishStreaming();
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
    finishStreaming();
    setText(caption.text);
    setDisplayedText(caption.text);
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
          {isStreaming ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10.5px] font-medium text-indigo-600 dark:text-indigo-400 animate-pulse">
              <Zap className="h-3 w-3" />
              Đang viết...
            </span>
          ) : isModified ? (
            <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400">
              Đã chỉnh sửa
            </span>
          ) : null}
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
            onClick={() => {
              finishStreaming();
              setIsEditing(!isEditing);
            }}
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
                setDisplayedText(e.target.value);
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
            onClick={() => {
              if (isStreaming) {
                finishStreaming();
              } else {
                setIsEditing(true);
              }
            }}
            className="cursor-pointer rounded-xl p-1 transition-colors hover:bg-[var(--surface-raised)]/50"
            title={isStreaming ? "Bấm để xem toàn bộ ngay" : "Bấm để chỉnh sửa trực tiếp"}
          >
            <p className="whitespace-pre-wrap break-words text-[15px] leading-[1.75] text-[var(--ink-primary)]">
              {isEditing ? text : displayedText}
              {isStreaming && (
                <span className="ml-1 inline-block h-[15px] w-[2px] animate-pulse rounded-xs bg-indigo-500 align-middle" />
              )}
            </p>
          </div>
        )}
      </div>

      {/* 3. Footer: Thước đo thông minh 125 ký tự trước nút "Xem thêm" */}
      <footer className="space-y-2 border-t border-[var(--border-subtle)] bg-[var(--surface-raised)]/20 px-4 py-3 sm:px-5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[12px] font-medium tabular-nums text-[var(--ink-tertiary)]">
            Tổng cộng: <strong className="text-[var(--ink-primary)]">{charCount}</strong> ký tự
          </span>

          <span
            className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11.5px] font-medium ${
              exceeded
                ? "bg-[var(--accent-navy)]/[0.08] text-[var(--accent-navy)]"
                : "bg-[var(--accent-emerald)]/[0.08] text-[var(--accent-emerald)]"
            }`}
          >
            {exceeded ? (
              <Eye className="h-3 w-3 shrink-0" />
            ) : (
              <Check className="h-3 w-3 shrink-0" />
            )}
            {exceeded ? "Có nút 'Xem thêm' (> 125 ký tự)" : "Hiển thị trọn vẹn (≤ 125 ký tự)"}
          </span>
        </div>

        {/* Thanh thể hiện mốc Hook 125 ký tự đầu */}
        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-raised)]">
          <div
            className={`h-full rounded-full transition-[width] duration-300 ${
              exceeded ? "bg-[var(--accent-navy)]" : "bg-[var(--accent-emerald)]"
            }`}
            style={{ width: `${ratio * 100}%` }}
          />
        </div>

        <p className="text-[11.5px] leading-relaxed text-[var(--ink-tertiary)]">
          {exceeded
            ? "Mẹo Facebook: 125 ký tự đầu đóng vai trò là 'Hook' giật tò mò trước nút 'Xem thêm'. Bấm tab 'Xem trước Facebook Post' bên trên để xem giao diện thật."
            : "Bài viết ngắn gọn, hiển thị trực diện 100% trên bảng tin người xem mà không bị ngắt quãng."}
        </p>

        {instagram.status === "limit_exceeded" ? (
          <p className="text-[11.5px] leading-relaxed text-rose-600 dark:text-rose-400">
            {instagram.message}
          </p>
        ) : null}
      </footer>
    </article>
  );
}