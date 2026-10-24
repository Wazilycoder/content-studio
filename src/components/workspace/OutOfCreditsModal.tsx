"use client";

import { useEffect } from "react";
import { Coins, Sparkles, X, ArrowRight } from "lucide-react";

interface OutOfCreditsModalProps {
  open: boolean;
  onClose: () => void;
  onUpgrade?: () => void;
}

export default function OutOfCreditsModal({
  open,
  onClose,
  onUpgrade,
}: OutOfCreditsModalProps) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        className="animate-fade-in relative w-full max-w-md rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.25)] transition-all"
      >
        <button
          type="button"
          onClick={onClose}
          className="btn-tactile absolute right-4 top-4 rounded-lg p-1.5 text-[var(--ink-secondary)] hover:bg-[var(--surface-raised)] hover:text-[var(--ink-primary)] transition-colors"
          aria-label="Đóng"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 dark:bg-amber-400/10 dark:text-amber-400">
          <Coins className="h-6 w-6" />
        </div>

        <h3 className="mt-4 text-lg font-semibold tracking-tight text-[var(--ink-primary)]">
          Bạn đã dùng hết lượt tạo miễn phí
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-[var(--ink-secondary)]">
          Mỗi tài khoản trải nghiệm được tặng sẵn 10 lượt tạo bài viết AI đa chiều. Để tiếp tục sáng tạo nội dung không giới hạn với Gemini 3.5, vui lòng tham khảo các gói tài nguyên của Content Studio.
        </p>

        <div className="mt-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)]/60 p-3.5 text-xs text-[var(--ink-secondary)] space-y-1.5">
          <div className="flex items-center gap-2 font-medium text-[var(--ink-primary)]">
            <Sparkles className="h-4 w-4 text-[var(--accent-navy)]" />
            <span>Quyền lợi gói Studio Pro:</span>
          </div>
          <p>• Không giới hạn lượt tạo bài viết Facebook &amp; Instagram.</p>
          <p>• Ưu tiên băng thông cao nhất trên Gemini 3.5 Flash.</p>
          <p>• Xuất file &amp; sao chép hàng loạt không watermark.</p>
        </div>

        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
          <Link
            href="/#pricing"
            onClick={onClose}
            className="group inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--accent-navy)] px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-[var(--accent-navy-hover)] hover:shadow-md"
          >
            <span>Nâng cấp ngay</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] px-4 py-2.5 text-xs font-medium text-[var(--ink-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--ink-primary)] transition-colors"
          >
            Để sau
          </button>
        </div>
      </div>
    </div>
  );
}
