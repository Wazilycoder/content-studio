"use client";

import type { MouseEvent } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Coins } from "lucide-react";
import { getUserProfile } from "@/app/auth/actions";
import ThemeToggle from "@/components/theme/ThemeToggle";

type LandingUser = Awaited<ReturnType<typeof getUserProfile>>;

interface LandingNavProps {
  user: LandingUser;
}

const NAV_LINKS = [
  { label: "Khung 3 góc nhìn", href: "#framework" },
  { label: "Trải nghiệm thử", href: "#demo" },
  { label: "Tính năng", href: "#features" },
  { label: "Bảng giá", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

function handleSmoothScroll(event: MouseEvent<HTMLAnchorElement>, href: string) {
  if (!href.startsWith("#")) return;
  event.preventDefault();
  const el = document.querySelector(href);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
  window.history.pushState(null, "", href);
}

export default function LandingNav({ user }: LandingNavProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border-subtle)] bg-[var(--surface)]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="btn-tactile flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-navy)] text-white shadow-xs">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-[var(--ink-primary)]">
            Content Studio
          </span>
          <span className="hidden rounded-md bg-[var(--surface-raised)] px-2 py-0.5 text-[11px] font-medium text-[var(--ink-tertiary)] sm:inline-block">
            v3.2 Cloud
          </span>
        </Link>

        {/* Center navigation */}
        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(event) => handleSmoothScroll(event, link.href)}
              className="text-[13px] font-medium text-[var(--ink-secondary)] transition-colors hover:text-[var(--ink-primary)]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Auth actions & ThemeToggle */}
        <div className="flex items-center gap-2.5">
          <ThemeToggle />

          {user ? (
            <>
              <div className="flex items-center gap-1.5 rounded-md border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-2.5 py-1 text-xs font-medium text-[var(--ink-secondary)]">
                <Coins className="h-3.5 w-3.5 text-[var(--accent-navy)]" />
                <span>
                  <strong className="text-[var(--ink-primary)]">{user.credits}</strong> lượt tạo
                </span>
              </div>
              <Link
                href="/workspace"
                className="btn-tactile inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent-navy)] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[var(--accent-navy-hover)]"
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
                className="btn-tactile inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent-navy)] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[var(--accent-navy-hover)]"
              >
                Dùng thử miễn phí
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}