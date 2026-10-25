"use client";

import { useState, type MouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, ArrowRight, Menu, X, Zap } from "lucide-react";
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
    <header className="sticky top-3 z-50 mx-auto max-w-6xl px-4 transition-all duration-300 sm:top-4 sm:px-6">
      <div className="flex h-14 items-center justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)]/95 px-4 shadow-[0_6px_20px_rgba(0,0,0,0.06)] dark:bg-[#0F0F12]/95 dark:shadow-[0_6px_20px_rgba(0,0,0,0.35)] sm:h-16 sm:px-6">
        {/* Brand */}
        <Link href="/" className="btn-tactile flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--accent-navy)] to-indigo-500 text-white shadow-xs">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-sm font-bold tracking-tight text-[var(--ink-primary)]">
            Content Studio
          </span>
          <span className="hidden items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 sm:inline-flex">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            v3.2 Cloud Online
          </span>
        </Link>

        {/* Center navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={(event) => handleNavClick(event, link.href)}
              className="rounded-lg px-3 py-1.5 text-[13px] font-medium text-[var(--ink-secondary)] transition-colors duration-150 hover:bg-[var(--surface-raised)] hover:text-[var(--ink-primary)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Action cluster */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <ThemeToggle />

          {user ? (
            <>
              <div className="hidden items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-2.5 py-1 text-xs font-medium text-[var(--ink-secondary)] sm:flex">
                {typeof user.credits === "number" && user.credits > 0 ? (
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                    <Zap className="h-3 w-3 fill-emerald-500 text-emerald-500" />
                    <span>Studio Pro</span>
                  </span>
                ) : (
                  <span>Gói Miễn Phí</span>
                )}
              </div>
              <Link
                href="/workspace"
                className="btn-tactile hidden items-center gap-1.5 rounded-lg bg-[var(--accent-navy)] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[var(--accent-navy-hover)] sm:inline-flex"
              >
                <span>Vào Workspace</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden text-xs font-medium text-[var(--ink-secondary)] transition-colors hover:text-[var(--ink-primary)] sm:inline-block"
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="btn-tactile hidden items-center gap-1.5 rounded-lg bg-[var(--accent-navy)] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[var(--accent-navy-hover)] sm:inline-flex"
              >
                Dùng thử miễn phí
              </Link>
            </>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label="Mở menu điều hướng"
            aria-expanded={mobileOpen}
            className="btn-tactile inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-raised)] text-[var(--ink-secondary)] transition-colors hover:text-[var(--ink-primary)] lg:hidden"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="animate-fade-in mt-2 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] p-3 shadow-lg lg:hidden dark:bg-[#0F0F12]">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(event) => handleNavClick(event, link.href)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--ink-secondary)] transition-colors hover:bg-[var(--surface-raised)] hover:text-[var(--ink-primary)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-3 flex flex-col gap-2 border-t border-[var(--border-subtle)] pt-3">
            {user ? (
              <>
                <div className="flex items-center justify-between rounded-lg bg-[var(--surface-raised)] px-3 py-2 text-xs text-[var(--ink-secondary)]">
                  <span>Gói dịch vụ</span>
                  <strong className="inline-flex items-center gap-1 text-[var(--ink-primary)]">
                    {typeof user.credits === "number" && user.credits > 0 ? (
                      <>
                        <Zap className="h-3 w-3 fill-emerald-500 text-emerald-500" />
                        <span>Studio Pro</span>
                      </>
                    ) : (
                      "Gói Miễn Phí"
                    )}
                  </strong>
                </div>
                <Link
                  href="/workspace"
                  onClick={() => setMobileOpen(false)}
                  className="btn-tactile inline-flex items-center justify-center gap-1.5 rounded-lg bg-[var(--accent-navy)] px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-[var(--accent-navy-hover)]"
                >
                  <span>Vào Workspace</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-3.5 py-2.5 text-sm font-medium text-[var(--ink-primary)] transition-colors hover:bg-[var(--surface)]"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="btn-tactile inline-flex items-center justify-center gap-1.5 rounded-lg bg-[var(--accent-navy)] px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-[var(--accent-navy-hover)]"
                >
                  Dùng thử miễn phí
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}