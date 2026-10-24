import Link from "next/link";
import { ArrowRight, Compass, Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center overflow-x-clip bg-[var(--canvas)] px-4 py-16 text-center">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-3 py-1 text-[11px] font-medium text-[var(--ink-secondary)]">
        404 · Không tìm thấy trang
      </span>

      <div className="mt-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] text-[var(--accent-navy)] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <Compass className="h-6 w-6" />
      </div>

      <h1 className="mt-5 text-balance text-2xl font-semibold tracking-tight text-[var(--ink-primary)] sm:text-3xl">
        Trang này hiện không tồn tại
      </h1>

      <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--ink-secondary)]">
        Đường dẫn bạn vừa mở có thể đã được đổi tên hoặc bị gỡ bỏ. Quay lại Studio
        để tiếp tục tạo nội dung cho sản phẩm của bạn.
      </p>

      <div className="mt-8 flex w-full max-w-xs flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
        <Link
          href="/workspace"
          className="btn-tactile inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-[var(--accent-navy)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-navy-hover)]"
        >
          Vào Studio làm việc
          <ArrowRight className="h-4 w-4" />
        </Link>
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