"use client";

import { useEffect, useState } from "react";
import { History, Search, X } from "lucide-react";
import HistoryItem from "./HistoryItem";
import HistoryEmptyState from "./HistoryEmptyState";
import type { GenerationRecord } from "@/types/content";

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
    const timer = setTimeout(() => setRendered(false), 220);
    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = previousOverflow;
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
        className={`absolute inset-0 bg-black/20 transition-opacity duration-200 ${
          active ? "opacity-100" : "opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Lịch sử tạo bài viết"
        className={`absolute inset-y-0 right-0 flex w-full flex-col border-l border-[var(--border-subtle)] bg-[var(--surface)] shadow-[0_0_30px_rgba(0,0,0,0.18)] transition-transform duration-200 ease-out sm:w-[480px] ${
          active ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-start justify-between gap-3 border-b border-[var(--border-subtle)] px-5 py-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 shrink-0 text-[var(--accent-navy)]" />
              <h2 className="truncate text-sm font-semibold tracking-tight text-[var(--ink-primary)]">
                Lịch sử tạo bài viết
              </h2>
            </div>
            <p className="mt-1.5 inline-flex items-center rounded-md bg-[var(--surface-raised)] px-2 py-0.5 text-[11px] font-medium text-[var(--ink-secondary)]">
              {loading ? "Đang tải..." : `${count} bài đã lưu`}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng lịch sử"
            className="btn-tactile shrink-0 rounded-md p-1.5 text-[var(--ink-secondary)] transition-colors hover:bg-[var(--surface-raised)] hover:text-[var(--ink-primary)]"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {!loading && !error && count > 0 ? (
          <div className="border-b border-[var(--border-subtle)] px-4 pb-3 pt-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--ink-tertiary)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Tìm kiếm theo tên sản phẩm..."
                aria-label="Tìm kiếm bài viết trong lịch sử"
                className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] py-2 pl-8 pr-8 text-[12.5px] text-[var(--ink-primary)] placeholder:text-[var(--ink-tertiary)] transition-colors focus:border-[var(--border-strong)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-navy)]/15"
              />
              {searchQuery.length > 0 ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Xóa từ khóa tìm kiếm"
                  className="btn-tactile absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-[var(--ink-tertiary)] transition-colors hover:text-[var(--ink-primary)]"
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
                className={`btn-tactile inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11.5px] font-medium transition-colors ${
                  activeFilterTab === "all"
                    ? "bg-[var(--accent-navy)] text-white"
                    : "bg-[var(--surface-raised)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
                }`}
              >
                Tất cả ({count})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilterTab("starred")}
                aria-pressed={activeFilterTab === "starred"}
                className={`btn-tactile inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11.5px] font-medium transition-colors ${
                  activeFilterTab === "starred"
                    ? "bg-[var(--accent-navy)] text-white"
                    : "bg-[var(--surface-raised)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
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
              {sorted.map(({ record, starred }) => (
                <HistoryItem
                  key={record.id}
                  record={record}
                  starred={starred}
                  onToggleStar={handleToggleStar}
                  onRestore={onRestore}
                  onDelete={onDelete}
                />
              ))}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}