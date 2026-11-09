"use client";

import { memo } from "react";
import Link from "next/link";
import { Layers3, LogOut, ArrowRight, Home, Zap, Clock, Crown } from "lucide-react";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { getPlanById } from "@/lib/config/pricing";
import { NumberTicker } from "@/components/ui/NumberTicker";
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
    <header className="sticky top-0 z-30 border-b border-[#1E2333] bg-[#0E121B] text-white shadow-sm">
      <div className="mx-auto flex h-14 w-full max-w-[1720px] items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3 text-xs font-mono">
          <Link
            href="/"
            className="group flex items-center gap-2 font-extrabold tracking-tight text-white transition hover:opacity-90 font-sans text-sm"
            title="Về trang chủ"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 via-teal-300 to-sky-400 text-black font-black text-xs shadow-md shadow-emerald-500/25 transition-transform duration-200 group-hover:scale-105">
              CS
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-[13px] tracking-tight text-white leading-none">
                CONTENT STUDIO
              </span>
              <span className="font-mono text-[8.5px] uppercase tracking-wider text-slate-400 mt-0.5">
                OBSIDIAN STUDIO
              </span>
            </div>
          </Link>
          <span className="text-white/20 sm:inline">/</span>
          <span className="hidden items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 md:inline-flex font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            VIBE-CODING 2026 · BẢNG B
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 font-mono text-xs">
          {user ? (
            <>
              {/* Service tier pill */}
              {isPro ? (
                <button
                  type="button"
                  onClick={onOpenTopUp}
                  title={`Gói hiện tại: ${activePlan.tierFullTitle} — 0s Chờ`}
                  className="btn-tactile flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-3 py-1.5 text-xs font-bold text-emerald-400 hover:bg-emerald-500/25 active:scale-[0.98]"
                >
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  <span>
                    {typeof credits === "number" ? (
                      <NumberTicker value={credits} suffix=" CREDITS" />
                    ) : (
                      activePlan.tierBadge
                    )}
                  </span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="hidden items-center gap-1.5 rounded-lg border border-[#1E2333] bg-[#07090E] px-2.5 py-1 text-[11px] font-mono text-slate-400 sm:inline-flex">
                    <Clock className="h-3 w-3 text-slate-400" />
                    FREE STARTER
                  </span>
                  <button
                    type="button"
                    onClick={onOpenTopUp}
                    title="Nâng cấp Pro để tạo nội dung tức thì"
                    className="btn-tactile inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-1 text-[11px] font-bold text-black shadow-md shadow-emerald-500/25 hover:bg-emerald-400 active:scale-[0.98]"
                  >
                    <Zap className="h-3 w-3 fill-black text-black" />
                    <span>NÂNG CẤP PRO</span>
                  </button>
                </div>
              )}

              {/* User email */}
              <span className="hidden max-w-[180px] truncate rounded-lg border border-[#1E2333] bg-[#07090E] px-2.5 py-1 text-[11px] font-mono text-slate-300 lg:inline">
                {user.email}
              </span>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Logout action */}
              {onSignOutAction ? (
                <form action={onSignOutAction}>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 rounded-lg border border-[#1E2333] bg-[#07090E] p-1.5 px-2.5 text-[12px] font-medium text-slate-400 transition-colors hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-400 active:scale-[0.98]"
                    title="Đăng xuất"
                  >
                    <LogOut className="h-3.5 w-3.5" />
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
                className="btn-tactile inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 px-3 py-1.5 text-[12px] font-extrabold text-black shadow-lg shadow-emerald-500/25 hover:brightness-110 active:scale-[0.98]"
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
