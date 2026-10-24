"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

const SKELETON_ROWS: string[][] = [
  ["w-[92%]", "w-full", "w-[88%]", "w-[64%]"],
  ["w-full", "w-[90%]", "w-[76%]"],
  ["w-[86%]", "w-full", "w-[70%]", "w-[52%]"],
];

const PHASES = [
  {
    step: "BƯỚC 1/3",
    label: "Đang phân tích góc nhìn sản phẩm & chân dung khách hàng...",
    progress: 35,
  },
  {
    step: "BƯỚC 2/3",
    label: "Đang sáng tác 3 góc bài viết PAS, Lifestyle & FAB chuẩn phong cách...",
    progress: 70,
  },
  {
    step: "BƯỚC 3/3",
    label: "Đang đo mốc 125 ký tự vàng và tối ưu bộ 5 hashtags chuyên sâu...",
    progress: 92,
  },
];

export default function SkeletonResults() {
  const [phaseIndex, setPhaseIndex] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setPhaseIndex(1), 3200);
    const timer2 = setTimeout(() => setPhaseIndex(2), 7000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const currentPhase = PHASES[phaseIndex] ?? PHASES[0]!;

  return (
    <div role="status" className="animate-fade-in space-y-4">
      <span className="sr-only">Đang biên soạn nội dung...</span>

      {/* Dynamic Multi-Phase AI Banner */}
      <div className="relative overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--accent-navy)] text-white shadow-xs">
              <Sparkles className="h-4 w-4 animate-spin text-white" />
            </div>
            <div>
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--accent-navy)]">
                {currentPhase.step} · AI STUDIO PRO
              </span>
              <p className="text-[13px] font-medium text-[var(--ink-primary)] transition-all duration-300">
                {currentPhase.label}
              </p>
            </div>
          </div>
          <span className="text-[12px] font-semibold tabular-nums text-[var(--accent-navy)]">
            {currentPhase.progress}%
          </span>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-[var(--surface-raised)]">
          <div
            className="h-full rounded-full bg-[var(--accent-navy)] transition-all duration-700 ease-out"
            style={{ width: `${currentPhase.progress}%` }}
          />
        </div>
      </div>

      {/* Shimmer Skeleton Cards */}
      <div aria-hidden="true" className="space-y-3">
        {SKELETON_ROWS.map((rows, cardIndex) => (
          <div
            key={cardIndex}
            className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="skeleton-shimmer h-5 w-44 rounded-md" />
              <div className="skeleton-shimmer h-6 w-16 rounded-md" />
            </div>

            <div className="mt-4 space-y-2.5">
              {rows.map((width, rowIndex) => (
                <div
                  key={rowIndex}
                  className={`skeleton-shimmer h-3 rounded ${width}`}
                />
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between gap-3 border-t border-[var(--border-subtle)] pt-3">
              <div className="skeleton-shimmer h-3 w-24 rounded" />
              <div className="skeleton-shimmer h-7 w-20 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}