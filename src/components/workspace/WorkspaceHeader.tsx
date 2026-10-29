"use client";

import { memo } from "react";
import Link from "next/link";
import { Layers3, LogOut, ArrowRight, Home, Zap, Clock, Crown } from "lucide-react";
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
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0E1017]/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-[1680px] items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3 text-xs font-mono">
          <Link
            href="/"
            className="flex items-center gap-2 text-white font-extrabold tracking-tight hover:opacity-80 transition font-sans text-sm"
            title="Về trang chủ"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#00D492] text-black font-black text-xs shadow-[0_0_12px_rgba(0,212,146,0.3)]">
              CS
            </div>
            <span className="font-extrabold text-[13px] tracking-tight text-white">
              CONTENT STUDIO
            </span>
          </Link>
          <span className="text-gray-600 sm:inline">/</span>
          <span className="text-teal-400 font-bold hidden sm:inline">PRECISION STUDIO</span>
          <span className="hidden rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-mono text-gray-400 md:inline-block">
            LINEAR TIER
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
                  className="btn-tactile flex items-center gap-2 rounded-lg border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-bold text-teal-300 shadow-[0_0_12px_rgba(0,212,146,0.15)]"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
                  <span>{typeof credits === "number" ? `${credits} CREDITS` : activePlan.tierBadge}</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="hidden items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-mono text-gray-400 sm:inline-flex">
                    <Clock className="h-3 w-3 text-gray-400" />
                    FREE STARTER
                  </span>
                  <button
                    type="button"
                    onClick={onOpenTopUp}
                    title="Nâng cấp Pro để tạo nội dung tức thì"
                    className="btn-tactile inline-flex items-center gap-1.5 rounded-lg bg-[#00D492] hover:bg-teal-400 px-3 py-1 text-[11px] font-bold text-black shadow-md shadow-teal-500/20"
                  >
                    <Zap className="h-3 w-3 fill-black text-black" />
                    <span>NÂNG CẤP PRO</span>
                  </button>
                </div>
              )}

              {/* User email */}
              <span className="hidden max-w-[180px] truncate rounded-lg border border-white/5 bg-white/5 px-2.5 py-1 text-[11px] font-mono text-gray-400 lg:inline">
                {user.email}
              </span>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Logout action */}
              {onSignOutAction ? (
                <form action={onSignOutAction}>
                  <button
                    type="submit"
                    className="flex items-center gap-1 rounded-lg p-1.5 text-[12px] font-medium text-gray-400 transition-colors hover:text-rose-400"
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
                className="btn-tactile inline-flex items-center gap-1.5 rounded-lg bg-[#00D492] hover:bg-teal-400 px-3 py-1.5 text-[12px] font-bold text-black shadow-md shadow-teal-500/20"
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
