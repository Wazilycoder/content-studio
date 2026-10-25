"use client";

import { memo } from "react";
import Link from "next/link";
import { Layers3, LogOut, ArrowRight, Home, Zap, Sparkles, Crown } from "lucide-react";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { getPlanById } from "@/lib/config/pricing";
import type { WorkspaceUser } from "./WorkspaceContainer";

interface WorkspaceHeaderProps {
  user?: WorkspaceUser | null;
  credits: number | null;
  planId?: string;
  onOpenTopUp: () => void;
  onSignOutAction?: () => Promise<void>;
}

function WorkspaceHeader({
  user,
  credits,
  planId,
  onOpenTopUp,
  onSignOutAction,
}: WorkspaceHeaderProps) {
  const isPro = typeof credits === "number" && credits > 0;
  const activePlan = getPlanById(planId);

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border-subtle)] bg-[var(--surface)]/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-[1680px] items-center justify-between gap-3 px-4 sm:px-6">
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
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 via-indigo-500 to-blue-600 text-white shadow-xs">
              <Layers3 className="h-3.5 w-3.5" />
            </div>
            <span className="text-[13px] font-semibold tracking-tight text-[var(--ink-primary)]">
              Content Studio
            </span>
            <span className="hidden rounded-md border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-2 py-0.5 text-[11.5px] font-medium text-[var(--ink-tertiary)] sm:inline-block">
              v3.2 Pro
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              {/* Service tier pill — Pro Tuần / Chủ Shop / Doanh Nghiệp VIP hoặc Gói Miễn Phí */}
              {isPro ? (
                <button
                  type="button"
                  onClick={onOpenTopUp}
                  title={`Bạn đang dùng ${activePlan.tierFullTitle} — 0s Cooldown`}
                  className={`btn-tactile flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] font-semibold transition-all ${
                    activePlan.id === "yearly"
                      ? "border-purple-500/40 bg-purple-500/10 text-purple-600 dark:text-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.18)]"
                      : activePlan.id === "monthly"
                      ? "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.18)]"
                      : "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  {activePlan.id === "yearly" ? (
                    <Crown className="h-3.5 w-3.5 fill-purple-500 text-purple-500" />
                  ) : activePlan.id === "monthly" ? (
                    <Sparkles className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  ) : (
                    <Zap className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
                  )}
                  <span>{activePlan.tierBadge}</span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="hidden items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-2.5 py-1 text-[11.5px] font-medium text-[var(--ink-secondary)] sm:inline-flex">
                    <Sparkles className="h-3.5 w-3.5 text-[var(--ink-tertiary)]" />
                    Gói Miễn Phí (45s Chờ)
                  </span>
                  <button
                    type="button"
                    onClick={onOpenTopUp}
                    title="Nâng cấp Pro để tạo nội dung tức thì, không chờ 45s"
                    className="btn-tactile inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-navy)] px-3 py-1 text-[11.5px] font-semibold text-white shadow-[0_2px_8px_rgba(37,52,199,0.22)] transition-all duration-150 hover:-translate-y-px hover:bg-[var(--accent-navy-hover)] active:translate-y-0"
                  >
                    <Zap className="h-3.5 w-3.5" />
                    <span>Nâng cấp Pro</span>
                  </button>
                </div>
              )}

              {/* User email */}
              <span className="hidden max-w-[180px] truncate rounded-full border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-2.5 py-1 text-[11.5px] font-medium text-[var(--ink-secondary)] lg:inline">
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

export default memo(WorkspaceHeader);
