import Link from "next/link";
import { getUserProfile, signOut } from "@/app/auth/actions";
import WorkspaceContainer from "@/components/workspace/WorkspaceContainer";
import { PenLine, LogOut, ArrowRight, Coins, Home } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function WorkspacePage() {
  const user = await getUserProfile();

  return (
    <div className="flex min-h-screen flex-col bg-[var(--canvas)] text-[var(--ink-primary)]">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 border-b border-[var(--border-subtle)] bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-[13px] text-[var(--ink-tertiary)] transition-colors hover:text-[var(--ink-primary)]"
              title="Về trang giới thiệu"
            >
              <Home className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Trang chủ</span>
            </Link>
            <span className="hidden text-[var(--border-strong)] sm:inline">/</span>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--accent-navy)] text-white">
                <PenLine className="h-4 w-4" />
              </div>
              <span className="text-[13px] font-semibold tracking-tight text-[var(--ink-primary)]">
                Studio
              </span>
              <span className="hidden rounded-md bg-[var(--surface-raised)] px-2 py-0.5 text-[12px] font-medium text-[var(--ink-tertiary)] sm:inline-block">
                v3.2 Studio Pro
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <>
                {/* Credit Pill */}
                <div className="flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-2.5 py-1 text-[12px] font-medium text-[var(--ink-secondary)]">
                  <Coins className="h-3.5 w-3.5 text-[var(--accent-navy)]" />
                  <span>
                    <strong className="tabular-nums text-[var(--ink-primary)]">{user.credits}</strong>{" "}
                    lượt tạo khả dụng
                  </span>
                </div>

                {/* User email */}
                <span className="hidden text-[12px] text-[var(--ink-tertiary)] md:inline">
                  {user.email}
                </span>

                {/* Logout action */}
                <form action={signOut}>
                  <button
                    type="submit"
                    className="flex items-center gap-1 rounded-lg p-1.5 text-[12px] font-medium text-[var(--ink-tertiary)] transition-colors hover:text-[#DC2626]"
                    title="Đăng xuất"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Thoát</span>
                  </button>
                </form>
              </>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent-navy)] px-3 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-[var(--accent-navy-hover)]"
              >
                <span>Đăng nhập</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="w-full flex-1">
        <WorkspaceContainer user={user} />
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border-subtle)] bg-white py-4 text-center text-[12px] text-[var(--ink-tertiary)]">
        Content Studio — Không gian sáng tạo nội dung Facebook & Instagram chuyên nghiệp. Zero AI-Slop.
      </footer>
    </div>
  );
}
