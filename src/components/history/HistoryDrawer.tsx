"use client";

import { useEffect, useRef, useState } from "react";
import { History, RotateCcw, Search, Star, Trash2, X } from "lucide-react";
import HistoryEmptyState from "./HistoryEmptyState";
import type { GenerationRecord } from "@/types/content";

const TONE_LABELS: Record<string, string> = {
  "trang-trong": "Trang trọng",
  "than-thien": "Thân thiện",
  "hai-huoc": "Hài hước",
  "chuyen-nghiep": "Chuyên nghiệp",
  "truyen-cam-hung": "Truyền cảm hứng",
  "tre-trung": "Trẻ trung",
};

function formatTone(tone: string): string {
  if (!tone) return "Chưa rõ tông";
  return (
    TONE_LABELS[tone] ??
    tone
      .split("-")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ")
  );
}

function formatTimestamp(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Không rõ thời gian";
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface HistoryDrawerProps {
  open: boolean;
  loading: boolean;
  error?: string | null;
  items: GenerationRecord[];
  onClose: () => void;
  onRestore: (record: GenerationRecord) => void;
  onDelete: (id: string) => Promise<boolean>;
}

export default function HistoryDrawer({
  open,
  loading,
  error,
  items,
  onClose,
  onRestore,
  onDelete,
}: HistoryDrawerProps) {
  const [rendered, setRendered] = useState(open);
  const [active, setActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilterTab, setActiveFilterTab] = useState<"all" | "starred">("all");
  const [starredIds, setStarredIds] = useState<string[]>([]);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open) {
      setRendered(true);
      let inner = 0;
      const outer = requestAnimationFrame(() => {
        inner = requestAnimationFrame(() => setActive(true));
      });
      return () => {
        cancelAnimationFrame(outer);
        cancelAnimationFrame(inner);
      };
    }

    setActive(false);
    setPendingDeleteId(null);
    const timer = setTimeout(() => setRendered(false), 300);
    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const getFocusable = (): HTMLElement[] => {
      const node = panelRef.current;
      if (!node) return [];
      return Array.from(
        node.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = getFocusable();
      if (focusable.length === 0) {
        event.preventDefault();
        panelRef.current?.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeElement = document.activeElement as HTMLElement | null;
      const insidePanel = !!activeElement && !!panelRef.current?.contains(activeElement);

      if (event.shiftKey) {
        if (activeElement === first || !insidePanel) {
          event.preventDefault();
          last.focus();
        }
        return;
      }

      if (activeElement === last || !insidePanel) {
        event.preventDefault();
        first.focus();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    const focusTimer = window.setTimeout(() => {
      const focusable = getFocusable();
      (focusable[0] ?? panelRef.current)?.focus();
    }, 80);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

    useEffect(() => {
      try {
        const raw = localStorage.getItem("content_studio_starred_ids");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            setStarredIds(
              parsed.filter((id): id is string => typeof id === "string"),
            );
          }
        }
      } catch {
        // localStorage không khả dụng hoặc dữ liệu hỏng — bỏ qua an toàn.
      }
    }, []);

    if (!rendered) return null;

    const count = items.length;
    const starredCount = items.filter((item) => starredIds.includes(item.id)).length;
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const decorated = items.map((item) => ({
      record: item,
      starred: starredIds.includes(item.id),
    }));

    const searched = decorated.filter(({ record }) => {
      if (normalizedQuery.length === 0) return true;
      const haystack = [
        record.productName,
        record.productDescription,
        ...record.captions.map((caption) => caption.text),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    });

    const filtered =
      activeFilterTab === "starred"
        ? searched.filter((entry) => entry.starred)
        : searched;

    const sorted = [...filtered].sort(
      (a, b) => (b.starred ? 1 : 0) - (a.starred ? 1 : 0),
    );

    const handleToggleStar = (id: string) => {
      setStarredIds((prev) => {
        const next = prev.includes(id)
          ? prev.filter((starredId) => starredId !== id)
          : [...prev, id];
        try {
          localStorage.setItem("content_studio_starred_ids", JSON.stringify(next));
        } catch {
          // localStorage không khả dụng — trạng thái vẫn giữ trong phiên.
        }
        return next;
      });
    };

    return (
    <div className="fixed inset-0 z-50" role="presentation">
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300 ${
          active ? "opacity-100" : "opacity-0"
        }`}
      />

      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Lịch sử tạo bài viết"
        tabIndex={-1}
        className={`absolute inset-y-0 right-0 flex w-full max-w-full flex-col border-l border-white/[0.14] bg-[#0A0D16]/95 backdrop-blur-3xl shadow-[-24px_0_60px_-30px_rgba(0,0,0,0.8)] outline-none transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] sm:w-[480px] ${
          active ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-start justify-between gap-3 border-b border-white/[0.08] px-5 py-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <History className="h-3.5 w-3.5" />
              </span>
              <h2 className="truncate text-sm font-semibold tracking-tight text-white">
                Lịch sử tạo bài viết
              </h2>
            </div>
            <p className="mt-1.5 inline-flex items-center rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[11px] font-mono text-slate-300">
              {loading ? "Đang tải..." : `${count} BẢN THẢO ĐÃ LƯU`}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng lịch sử"
            className="btn-tactile shrink-0 rounded-xl border border-white/10 bg-white/[0.04] p-2 text-slate-300 transition-all hover:bg-white/[0.08] hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {!loading && !error && count > 0 ? (
          <div className="border-b border-white/[0.08] px-4 pb-3 pt-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Tìm kiếm theo tên sản phẩm..."
                aria-label="Tìm kiếm bài viết trong lịch sử"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-2 pl-9 pr-8 text-[12.5px] text-white placeholder:text-slate-500 backdrop-blur-md transition-colors focus:border-emerald-400/80 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
              />
              {searchQuery.length > 0 ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Xóa từ khóa tìm kiếm"
                  className="btn-tactile absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-400 transition-colors hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : null}
            </div>

            <div className="mt-2.5 flex gap-1.5">
              <button
                type="button"
                onClick={() => setActiveFilterTab("all")}
                aria-pressed={activeFilterTab === "all"}
                className={`btn-tactile inline-flex items-center gap-1 rounded-xl px-3 py-1 text-[12px] font-semibold transition-all ${
                  activeFilterTab === "all"
                    ? "bg-gradient-to-r from-emerald-400 to-teal-400 text-black shadow-md shadow-emerald-500/20"
                    : "border border-white/10 bg-white/[0.04] text-slate-300 hover:border-white/20 hover:text-white"
                }`}
              >
                Tất cả ({count})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilterTab("starred")}
                aria-pressed={activeFilterTab === "starred"}
                className={`btn-tactile inline-flex items-center gap-1 rounded-xl px-3 py-1 text-[12px] font-semibold transition-all ${
                  activeFilterTab === "starred"
                    ? "bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-md shadow-amber-500/20"
                    : "border border-white/10 bg-white/[0.04] text-slate-300 hover:border-white/20 hover:text-white"
                }`}
              >
                ★ Đã ghim ({starredCount})
              </button>
            </div>
          </div>
        ) : null}

        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4">
          {loading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-3.5"
                >
                  <div className="skeleton-shimmer h-3 w-2/3 rounded" />
                  <div className="skeleton-shimmer mt-2 h-2.5 w-1/3 rounded" />
                  <div className="skeleton-shimmer mt-3 h-2.5 w-full rounded" />
                  <div className="skeleton-shimmer mt-1.5 h-2.5 w-5/6 rounded" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-4 text-[12px] leading-relaxed text-[var(--ink-secondary)]">
              {error}
            </div>
          ) : count === 0 ? (
            <HistoryEmptyState />
          ) : sorted.length === 0 ? (
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-4 text-center text-[12px] leading-relaxed text-[var(--ink-secondary)]">
              {normalizedQuery.length > 0
                ? `Không tìm thấy bài viết nào phù hợp với '${searchQuery.trim()}'`
                : "Chưa có bài viết nào được ghim. Nhấn ngôi sao để ghim bài yêu thích."}
            </div>
          ) : (
            <ul className="space-y-3">
              {sorted.map(({ record, starred }) => {
                const isPendingDelete = pendingDeleteId === record.id;
                const previewText = record.captions[0]?.text ?? "";
                return (
                  <li
                    key={record.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md hover:border-white/20 transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-[14px] font-semibold text-white">
                          {record.productName?.trim() || "Bài viết chưa đặt tên"}
                        </p>
                        <p className="mt-1 text-[11.5px] font-mono text-slate-400">
                          {formatTimestamp(record.createdAt)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggleStar(record.id)}
                        aria-pressed={starred}
                        aria-label={starred ? "Bỏ ghim bài viết" : "Ghim bài viết"}
                        className={`btn-tactile inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border border-white/10 transition-colors ${
                          starred
                            ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                            : "bg-white/[0.04] text-slate-400 hover:text-white"
                        }`}
                      >
                        <Star className={`h-4 w-4 ${starred ? "fill-amber-400" : ""}`} />
                      </button>
                    </div>

                    <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                      <span className="inline-flex items-center rounded-lg border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[11.5px] font-medium text-slate-300">
                        {formatTone(record.tone)}
                      </span>
                      <span className="inline-flex items-center rounded-lg border border-white/10 bg-white/[0.02] px-2 py-0.5 text-[11px] font-mono text-slate-400">
                        {record.captions.length} góc · {record.hashtags.length} hashtag
                      </span>
                    </div>

                    {previewText ? (
                      <p className="mt-2.5 line-clamp-2 text-[12.5px] leading-relaxed text-slate-300">
                        {previewText}
                      </p>
                    ) : null}

                    <div className="mt-3.5 flex h-9 items-center gap-2">
                      {isPendingDelete ? (
                        <>
                          <span className="min-w-0 flex-1 truncate text-[12px] font-medium text-rose-400">
                            Xóa bản thảo này?
                          </span>
                          <button
                            type="button"
                            onClick={() => setPendingDeleteId(null)}
                            className="btn-tactile inline-flex h-8 items-center rounded-xl border border-white/10 px-3 text-[12px] font-medium text-slate-300 transition-colors hover:text-white"
                          >
                            Hủy
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              const ok = await onDelete(record.id);
                              if (ok) setPendingDeleteId(null);
                            }}
                            className="btn-tactile inline-flex h-8 items-center gap-1 rounded-xl bg-rose-600 px-3 text-[12px] font-semibold text-white transition-colors hover:bg-rose-500 shadow-md shadow-rose-600/30"
                          >
                            <Trash2 className="h-3.5 w-3.5 shrink-0" />
                            Xóa
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => onRestore(record)}
                            className="btn-tactile inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 px-3 text-[12px] font-extrabold text-black shadow-md shadow-emerald-500/20 transition-all hover:brightness-110 active:scale-[0.98]"
                          >
                            <RotateCcw className="h-3.5 w-3.5 shrink-0" />
                            Khôi phục
                          </button>
                          <button
                            type="button"
                            onClick={() => setPendingDeleteId(record.id)}
                            className="btn-tactile inline-flex h-8 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 text-[12px] font-medium text-slate-400 transition-colors hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400"
                          >
                            <Trash2 className="h-3.5 w-3.5 shrink-0" />
                            Xóa
                          </button>
                        </>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}