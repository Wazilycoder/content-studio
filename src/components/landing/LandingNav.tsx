"use client";

import { useState, type MouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layers3, ArrowRight, Menu, X, Zap } from "lucide-react";
import { getUserProfile } from "@/app/auth/actions";
import ThemeToggle from "@/components/theme/ThemeToggle";

type LandingUser = Awaited<ReturnType<typeof getUserProfile>>;

interface LandingNavProps {
  user: LandingUser;
}

const NAV_LINKS = [
  { label: "Khung 3 góc nhìn", href: "/#framework" },
  { label: "Trải nghiệm thử", href: "/#demo" },
  { label: "Tính năng", href: "/#features" },
  { label: "Bảng giá", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
];

export default function LandingNav({ user }: LandingNavProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    setMobileOpen(false);
    if (pathname !== "/") return;
    const hash = href.replace("/#", "#");
    const el = document.querySelector(hash);
    if (!el) return;
    event.preventDefault();
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.pushState(null, "", hash);
  };

  return (
    <header className="sticky top-3 z-50 mx-auto max-w-6xl px-4 transition-all duration-300 sm:top-5 sm:px-6">
      <div className="flex h-14 items-center justify-between rounded-full border border-white/[0.14] bg-[#0A0D15]/80 px-4 shadow-[0_15px_35px_-10px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.18)] backdrop-blur-2xl sm:h-14 sm:px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 transition-transform active:scale-95">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-[#00D492] text-black font-black text-xs shadow-[0_0_18px_rgba(0,212,146,0.45)]">
            CS
          </div>
          <span className="text-sm font-extrabold tracking-tight text-white">
            CONTENT STUDIO
          </span>
          <span className="hidden items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-400 sm:inline-flex shadow-[0_0_10px_rgba(0,212,146,0.15)]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            SYNTHESIZER
          </span>
        </Link>

        {/* Center navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={(event) => handleNavClick(event, link.href)}
              className="rounded-full px-4 py-1.5 text-[13px] font-medium text-slate-300 transition-all duration-150 hover:bg-white/[0.08] hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Action cluster */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          {user ? (
            <>
              <div className="hidden items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-mono font-medium text-emerald-400 sm:flex">
                <Zap className="h-3 w-3 fill-emerald-400 text-emerald-400" />
                <span>10 CREDITS</span>
              </div>
              <Link
                href="/workspace"
                className="group relative hidden items-center gap-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2 text-xs font-bold shadow-[0_0_20px_rgba(0,212,146,0.35)] transition-all active:scale-[0.98] sm:inline-flex"
              >
                <span>Vào Studio</span>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black/15 transition-transform duration-200 group-hover:translate-x-0.5">
                  <ArrowRight className="h-3 w-3 text-black" />
                </span>
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-xs font-semibold px-4 py-1.5 rounded-full text-slate-300 hover:text-white transition border border-white/[0.12] hover:bg-white/[0.08] inline-block active:scale-[0.98]"
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="group relative hidden items-center gap-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-1.5 text-xs font-extrabold shadow-[0_0_20px_rgba(0,212,146,0.35)] transition-all active:scale-[0.98] sm:inline-flex"
              >
                <span>Đăng ký</span>
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-black/15 transition-transform duration-200 group-hover:translate-x-0.5">
                  <ArrowRight className="h-2.5 w-2.5 text-black" />
                </span>
              </Link>
            </>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label="Mở menu điều hướng"
            aria-expanded={mobileOpen}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.14] bg-white/[0.06] text-slate-300 transition-colors hover:text-white active:scale-95 lg:hidden"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="animate-fade-in mt-2 rounded-2xl border border-white/[0.14] bg-[#0A0D15]/95 p-3 shadow-2xl backdrop-blur-3xl lg:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(event) => handleNavClick(event, link.href)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/[0.08] hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-3 flex flex-col gap-2 border-t border-white/[0.10] pt-3">
            {user ? (
              <>
                <div className="flex items-center justify-between rounded-xl bg-white/[0.04] border border-white/[0.08] px-3 py-2 text-xs text-slate-300">
                  <span>Gói dịch vụ</span>
                  <strong className="inline-flex items-center gap-1 text-emerald-400">
                    {typeof user.credits === "number" && user.credits > 0 ? (
                      <>
                        <Zap className="h-3 w-3 fill-emerald-400 text-emerald-400" />
                        <span>Studio Pro ({user.credits} credits)</span>
                      </>
                    ) : (
                      "Gói Miễn Phí"
                    )}
                  </strong>
                </div>
                <Link
                  href="/workspace"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 px-3.5 py-2.5 text-sm font-bold text-black shadow-sm transition-colors hover:bg-emerald-400 active:scale-[0.98]"
                >
                  <span>Vào Studio</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center justify-center rounded-xl border border-white/[0.14] bg-white/[0.06] px-3.5 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:bg-white/[0.12] hover:text-white"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 px-3.5 py-2.5 text-sm font-bold text-black shadow-sm transition-colors hover:bg-emerald-400 active:scale-[0.98]"
                >
                  Đăng ký miễn phí ↗
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}