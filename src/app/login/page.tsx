"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { login, signup } from "@/app/auth/actions";
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, Home } from "lucide-react";
import ThemeToggle from "@/components/theme/ThemeToggle";

interface AuthPageProps {
  initialMode?: "login" | "signup";
}

export default function AuthPage({ initialMode = "login" }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(initialMode === "login");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const emailInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (initialMode === "signup") {
      emailInputRef.current?.focus();
    }
  }, [initialMode]);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setLoading(true);

    try {
      const result = isLogin ? await login(formData) : await signup(formData);
      if (result?.error) {
        setError(result.error);
      }
    } catch {
      // redirect() throws an internal NEXT_REDIRECT error which is expected
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-[var(--canvas)] text-[var(--ink-primary)] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Top Bar with Home & ThemeToggle */}
      <div className="absolute top-4 inset-x-0 mx-auto max-w-4xl px-4 flex items-center justify-between">
        <Link
          href="/"
          className="btn-tactile inline-flex items-center gap-1.5 text-xs font-medium text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
        >
          <Home className="h-3.5 w-3.5" />
          <span>Trang chủ</span>
        </Link>
        <ThemeToggle />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
        {/* Brand Header */}
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--accent-navy)] text-white shadow-sm mb-4">
          <Sparkles className="w-5 h-5" />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-[var(--ink-primary)]">
          Content Studio
        </h2>
        <p className="mt-1 text-sm text-[var(--ink-secondary)]">
          Nền tảng sáng tạo nội dung quảng cáo Facebook & Instagram chuẩn phong cách
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-[var(--surface)] py-8 px-6 sm:px-8 rounded-xl border border-[var(--border-subtle)] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          {/* Tabs: Đăng nhập vs Đăng ký */}
          <div className="flex rounded-lg bg-[var(--surface-raised)] p-1 mb-6">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setError(null);
              }}
              className={`btn-tactile flex-1 py-1.5 text-xs font-medium rounded-md transition-all duration-150 ${
                isLogin
                  ? "bg-[var(--surface)] text-[var(--ink-primary)] shadow-sm"
                  : "text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
              }`}
            >
              Đăng nhập
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
                setError(null);
              }}
              className={`btn-tactile flex-1 py-1.5 text-xs font-medium rounded-md transition-all duration-150 ${
                !isLogin
                  ? "bg-[var(--surface)] text-[var(--ink-primary)] shadow-sm"
                  : "text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
              }`}
            >
              Đăng ký mới
            </button>
          </div>

          {!isLogin && (
            <div className="animate-fade-in mb-5 p-3 rounded-lg bg-[var(--accent-emerald)]/[0.08] border border-[var(--accent-emerald)]/20 flex items-start gap-2.5 text-[var(--accent-emerald)] text-xs leading-relaxed">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Tặng ngay <strong>10 lượt tạo nội dung miễn phí</strong> vào tài khoản sau khi đăng ký.
              </span>
            </div>
          )}

          {error && (
            <div className="animate-fade-in mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs">
              {error}
            </div>
          )}

          <form action={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-[var(--ink-secondary)] mb-1.5"
              >
                Địa chỉ Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                ref={emailInputRef}
                autoComplete="email"
                placeholder="chushop@gmail.com"
                className="w-full px-3 py-2 text-sm bg-[var(--surface)] border border-[var(--border-subtle)] rounded-lg text-[var(--ink-primary)] placeholder-[var(--ink-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-navy)]/20 focus:border-[var(--accent-navy)] transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-[var(--ink-secondary)] mb-1.5"
              >
                Mật khẩu
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete={isLogin ? "current-password" : "new-password"}
                placeholder="••••••••"
                className="w-full px-3 py-2 text-sm bg-[var(--surface)] border border-[var(--border-subtle)] rounded-lg text-[var(--ink-primary)] placeholder-[var(--ink-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-navy)]/20 focus:border-[var(--accent-navy)] transition-all"
              />
              {!isLogin && (
                <p className="mt-1 text-[11px] text-[var(--ink-tertiary)]">
                  Tối thiểu 6 ký tự
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-tactile w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[var(--accent-navy)] hover:bg-[var(--accent-navy-hover)] rounded-lg shadow-sm transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span>Đang xử lý...</span>
              ) : (
                <>
                  <span>{isLogin ? "Đăng nhập vào Studio" : "Tạo tài khoản nhận 10 lượt"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-center gap-1.5 text-[11px] text-[var(--ink-tertiary)]">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent-emerald)]" />
            <span>Dữ liệu và quyền riêng tư được bảo vệ 100%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
