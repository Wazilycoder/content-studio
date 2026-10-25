"use client";

import Link from "next/link";
import { PenLine, LogOut, ArrowRight, Home } from "lucide-react";
import ThemeToggle from "@/components/theme/ThemeToggle";
import type { WorkspaceUser } from "./WorkspaceContainer";

interface WorkspaceHeaderProps {
  user?: WorkspaceUser | null;
  credits: number | null;
  onOpenTopUp: () => void;
  onSignOutAction?: () => Promise<void>;
}

export default function WorkspaceHeader({
  user,
  credits,
  onOpenTopUp,
    onSignOutAction,
  }: WorkspaceHeaderProps) {
    const isPro = typeof credits === "number" && credits > 0;

    return (
    <header className="sticky top-0 z-30 border-b border-[var(--border-subtle)] bg-[var(--surface)]/90 backdrop-blur-md">
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
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--accent-navy)] text-white shadow-xs">
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
              {/* Service tier pill — Pro Turbo hoặc Gói Miễn Phí */}
              {isPro ? (
                <button
                  type="button"
                  onClick={onOpenTopUp}
                  title="Bạn đang dùng Pro Turbo — 0s Cooldown"
                  className="btn-tactile flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[12px] font-semibold text-emerald-600 dark:text-emerald-400"
                >
                  ⚡ Pro Turbo
                </button>
              ) : (
                <div className="flex items-center rounded-full border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-0.5">
                  <span className="px-2.5 py-1 text-[11.5px] font-medium text-[var(--ink-secondary)]">
                    Gói Miễn Phí
                  </span>
                  <button
                    type="button"
                    onClick={onOpenTopUp}
                    className="btn-tactile rounded-full bg-[var(--accent-navy)] px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-[var(--accent-navy-hover)]"
                  >
                    Nâng Pro 0s
                  </button>
                </div>
              )}

              {/* User email */}
              <span className="hidden max-w-[150px] truncate text-[12px] text-[var(--ink-tertiary)] lg:inline">
                {user.email}
              </span>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Logout action */}
              {onSignOutAction ? (
                <form action={onSignOutAction}>
                  <button
                    type="submit"
                    className="flex items-center gap-1 rounded-lg p-1.5 text-[12px] font-medium text-[var(--ink-tertiary)] transition-colors hover:text-[#DC2626]"
                    title="Đăng xuất"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Thoát</span>
                  </button>
                </form>
              ) : null}
            </>
          ) : (
            <>
              <ThemeToggle />
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent-navy)] px-3 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-[var(--accent-navy-hover)]"
              >
                <span>Đăng nhập</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
