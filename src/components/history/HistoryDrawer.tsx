"use client";

import { useEffect, useState } from "react";
import { History, X } from "lucide-react";
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

  if (!rendered) return null;

  const count = items.length;

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
        className={`absolute inset-y-0 right-0 flex w-full flex-col border-l border-[#E4E4DE] bg-white shadow-[0_0_30px_rgba(0,0,0,0.08)] transition-transform duration-200 ease-out sm:w-[480px] ${
          active ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-start justify-between gap-3 border-b border-[#E4E4DE] px-5 py-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 shrink-0 text-[#3B49DF]" />
              <h2 className="truncate text-sm font-semibold tracking-tight text-[#18181B]">
                Lịch sử tạo bài viết
              </h2>
            </div>
            <p className="mt-1.5 inline-flex items-center rounded-md bg-[#F1F1ED] px-2 py-0.5 text-[11px] font-medium text-[#71717A]">
              {loading ? "Đang tải..." : `${count} bài đã lưu`}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng lịch sử"
            className="shrink-0 rounded-md p-1.5 text-[#71717A] transition-colors hover:bg-[#F1F1ED] hover:text-[#18181B]"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4">
          {loading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className="animate-pulse rounded-xl border border-[#E4E4DE] bg-white p-3.5"
                >
                  <div className="h-3 w-2/3 rounded bg-[#F1F1ED]" />
                  <div className="mt-2 h-2.5 w-1/3 rounded bg-[#F1F1ED]" />
                  <div className="mt-3 h-2.5 w-full rounded bg-[#F1F1ED]" />
                  <div className="mt-1.5 h-2.5 w-5/6 rounded bg-[#F1F1ED]" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-xl border border-[#E4E4DE] bg-[#F1F1ED]/60 p-4 text-[12px] leading-relaxed text-[#71717A]">
              {error}
            </div>
          ) : count === 0 ? (
            <HistoryEmptyState />
          ) : (
            <ul className="space-y-3">
              {items.map((record) => (
                <HistoryItem
                  key={record.id}
                  record={record}
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