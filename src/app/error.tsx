"use client";

import Link from "next/link";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center overflow-x-clip bg-[var(--canvas)] px-4 py-16 text-center">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-3 py-1 text-[11px] font-medium text-[var(--ink-secondary)]">
        Sự cố hệ thống
      </span>

      <div className="mt-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] text-[#B45309] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <AlertTriangle className="h-6 w-6" />
      </div>

      <h1 className="mt-5 text-balance text-2xl font-semibold tracking-tight text-[var(--ink-primary)] sm:text-3xl">
        Đã xảy ra sự cố không mong muốn
      </h1>

      <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--ink-secondary)]">
        Nội dung bạn đang nhập vẫn được giữ nguyên trong trình duyệt. Hãy thử tải
        lại trang để tiếp tục công việc.
      </p>

      <div className="mt-8 flex w-full max-w-xs flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={() => reset()}
          className="btn-tactile inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-[var(--accent-navy)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-navy-hover)]"
        >
          <RotateCcw className="h-4 w-4" />
          Thử tải lại trang
        </button>
        <Link
          href="/"
          className="btn-tactile inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-5 py-3 text-sm font-semibold text-[var(--ink-primary)] transition-colors hover:bg-[var(--surface-raised)]"
        >
          <Home className="h-4 w-4 text-[var(--ink-secondary)]" />
          Về Trang chủ
        </Link>
      </div>
    </main>
  );
}