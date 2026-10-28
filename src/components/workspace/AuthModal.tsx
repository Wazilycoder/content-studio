"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Layers3, X } from "lucide-react";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  productName?: string;
}

export default function AuthModal({ open, onClose, productName }: AuthModalProps) {
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
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="animate-fade-in relative w-full max-w-md rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition-all"
      >
        <button
          type="button"
          onClick={onClose}
          className="btn-tactile absolute right-4 top-4 rounded-lg p-1.5 text-[var(--ink-secondary)] hover:bg-[var(--surface-raised)] hover:text-[var(--ink-primary)] transition-colors"
          aria-label="Đóng"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-navy)]/[0.1] text-[var(--accent-navy)]">
          <Layers3 className="h-5 w-5" />
        </div>

        <h3
          id="auth-modal-title"
          className="mt-4 text-base font-semibold tracking-tight text-[var(--ink-primary)]"
        >
          Đăng nhập để AI tạo nội dung
        </h3>

        <p className="mt-2 text-xs leading-relaxed text-[var(--ink-secondary)]">
          {productName ? (
            <>
              Để tạo 3 góc bài viết thực tế cho sản phẩm{" "}
              <strong className="text-[var(--ink-primary)]">&ldquo;{productName}&rdquo;</strong>, bạn cần đăng
              nhập để hệ thống kết nối máy chủ AI (Gemini 3.5 / DeepSeek V3).
            </>
          ) : (
            <>
              Vui lòng đăng nhập để hệ thống gọi máy chủ AI sáng tạo nội dung và lưu trữ lịch sử bài viết.
            </>
          )}
        </p>

        <div className="mt-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-3 text-[11.5px] text-[var(--ink-primary)]">
          🎁 <strong>Tặng ngay 10 lượt tạo miễn phí</strong> cho tài khoản đăng ký mới.
        </div>

        <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
          <Link
            href="/register"
            className="btn-tactile inline-flex flex-1 items-center justify-center rounded-lg bg-[var(--accent-navy)] px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[var(--accent-navy-hover)]"
          >
              Tạo tài khoản miễn phí
            </Link>
          <Link
            href="/login"
            className="btn-tactile inline-flex flex-1 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-4 py-2.5 text-xs font-medium text-[var(--ink-primary)] transition-colors hover:bg-[var(--surface-raised)]"
          >
            Đã có tài khoản
          </Link>
        </div>
      </div>
    </div>
  );
}
