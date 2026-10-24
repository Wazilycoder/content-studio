"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { forgotPassword, getMathCaptcha, login, signup } from "@/app/auth/actions";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Home,
  Loader2,
  Mail,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import ThemeToggle from "@/components/theme/ThemeToggle";
import FloatingSocialIcons from "@/components/ui/FloatingSocialIcons";

interface AuthPageProps {
  initialMode?: "login" | "signup";
}

export default function AuthPage({ initialMode = "login" }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(initialMode === "login");
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [captchaQuestion, setCaptchaQuestion] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "error" | "success"; message: string } | null>(null);
  const emailInputRef = useRef<HTMLInputElement | null>(null);

  const refreshCaptcha = useCallback(async () => {
    setCaptchaLoading(true);
    try {
      const captcha = await getMathCaptcha();
      setCaptchaQuestion(captcha.question);
      setCaptchaToken(captcha.token);
    } catch {
      setCaptchaQuestion("Không tải được phép tính, vui lòng thử lại.");
    } finally {
      setCaptchaLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialMode === "signup") {
      emailInputRef.current?.focus();
    }
  }, [initialMode]);

  useEffect(() => {
    void refreshCaptcha();
  }, [refreshCaptcha]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 6000);
    return () => clearTimeout(timer);
  }, [toast]);

  async function handleSubmit(formData: FormData) {
    setToast(null);
    setLoading(true);

    try {
      const result = isLogin ? await login(formData) : await signup(formData);
      if (result?.error) {
        setToast({ type: "error", message: result.error });
        void refreshCaptcha();
      } else if (result?.success && result?.message) {
        setToast({ type: "success", message: result.message });
      }
    } catch {
      // redirect() throws an internal NEXT_REDIRECT error which is expected
    } finally {
      setLoading(false);
    }
  }

  async function handleForgot(formData: FormData) {
    setToast(null);
    setLoading(true);
    try {
      const email = (formData.get("email") as string) || "";
      const result = await forgotPassword(email);
      if (result?.error) {
        setToast({ type: "error", message: result.error });
      } else if (result?.success) {
        setToast({
          type: "success",
          message: result.message ?? "Yêu cầu khôi phục đã được gửi.",
        });
        setForgotMode(false);
      }
    } catch {
      setToast({ type: "error", message: "Không thể gửi yêu cầu. Vui lòng thử lại." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-[var(--canvas)] text-[var(--ink-primary)] flex flex-col justify-center py-12 sm:px-6 lg:px-8 overflow-hidden">
      <FloatingSocialIcons variant="auth" />
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
          {toast && (
            <div
              className={`mb-5 flex items-start gap-2.5 rounded-lg border p-3 text-xs leading-relaxed ${
                toast.type === "error"
                  ? "animate-shake border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400"
                  : "animate-fade-in border-[var(--accent-emerald)]/30 bg-[var(--accent-emerald)]/10 text-[var(--accent-emerald)]"
              }`}
            >
              {toast.type === "error" ? (
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              ) : (
                <CheckCircle2 className="animate-pop mt-0.5 h-4 w-4 shrink-0" />
              )}
              <span className="flex-1">{toast.message}</span>
              <button
                type="button"
                onClick={() => setToast(null)}
                aria-label="Đóng thông báo"
                className="shrink-0 opacity-60 transition-opacity hover:opacity-100"
              >
                ✕
              </button>
            </div>
          )}

          {forgotMode ? (
            <form action={handleForgot} className="animate-fade-in space-y-4">
              <div>
                <label
                  htmlFor="forgot-email"
                  className="mb-1.5 block text-xs font-medium text-[var(--ink-secondary)]"
                >
                  Email khôi phục mật khẩu
                </label>
                <input
                  id="forgot-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="chushop@gmail.com"
                  className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--ink-primary)] placeholder-[var(--ink-tertiary)] transition-all focus:border-[var(--accent-navy)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-navy)]/20"
                />
                <p className="mt-1.5 text-[11px] text-[var(--ink-tertiary)]">
                  Chúng tôi sẽ gửi liên kết đặt lại mật khẩu tới hộp thư của bạn.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-tactile mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--accent-navy)] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all duration-150 hover:bg-[var(--accent-navy-hover)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Đang gửi yêu cầu...</span>
                  </>
                ) : (
                  <>
                    <Mail className="h-3.5 w-3.5" />
                    <span>Gửi liên kết khôi phục</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setForgotMode(false);
                  setToast(null);
                }}
                className="inline-flex w-full items-center justify-center gap-1.5 text-[11px] font-medium text-[var(--ink-secondary)] transition-colors hover:text-[var(--ink-primary)]"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Quay lại đăng nhập</span>
              </button>
            </form>
          ) : (
            <>
              {/* Tabs: Đăng nhập vs Đăng ký */}
              <div className="relative mb-6 flex rounded-lg bg-[var(--surface-raised)] p-1">
                <span
                  aria-hidden
                  className={`absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-md bg-[var(--surface)] shadow-sm transition-transform duration-300 ease-out ${
                    isLogin ? "translate-x-0" : "translate-x-full"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(true);
                    setToast(null);
                  }}
                  className={`relative z-10 flex-1 rounded-md py-1.5 text-xs font-medium transition-colors duration-150 ${
                    isLogin
                      ? "text-[var(--ink-primary)]"
                      : "text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
                  }`}
                >
                  Đăng nhập
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(false);
                    setToast(null);
                  }}
                  className={`relative z-10 flex-1 rounded-md py-1.5 text-xs font-medium transition-colors duration-150 ${
                    !isLogin
                      ? "text-[var(--ink-primary)]"
                      : "text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
                  }`}
                >
                  Đăng ký mới
                </button>
              </div>

              {!isLogin && (
                <div className="animate-fade-in mb-5 flex items-start gap-2.5 rounded-lg border border-[var(--accent-emerald)]/20 bg-[var(--accent-emerald)]/[0.08] p-3 text-xs leading-relaxed text-[var(--accent-emerald)]">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    Tặng ngay <strong>10 lượt tạo nội dung miễn phí</strong> vào tài khoản sau khi đăng ký.
                  </span>
                </div>
              )}

              <form action={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-xs font-medium text-[var(--ink-secondary)]"
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
                    className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--ink-primary)] placeholder-[var(--ink-tertiary)] transition-all focus:border-[var(--accent-navy)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-navy)]/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-1.5 block text-xs font-medium text-[var(--ink-secondary)]"
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
                    className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--ink-primary)] placeholder-[var(--ink-tertiary)] transition-all focus:border-[var(--accent-navy)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-navy)]/20"
                  />
                  {!isLogin && (
                    <p className="mt-1 text-[11px] text-[var(--ink-tertiary)]">
                      Tối thiểu 6 ký tự
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="captchaAnswer"
                    className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-[var(--ink-secondary)]"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-[var(--accent-emerald)]" />
                    <span>
                      Xác minh:{" "}
                      <strong className="text-[var(--ink-primary)]">
                        {captchaQuestion || "Đang tải..."}
                      </strong>
                    </span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id="captchaAnswer"
                      name="captchaAnswer"
                      type="text"
                      inputMode="numeric"
                      required
                      autoComplete="off"
                      placeholder="Nhập kết quả"
                      className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--ink-primary)] placeholder-[var(--ink-tertiary)] transition-all focus:border-[var(--accent-navy)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-navy)]/20"
                    />
                    <input type="hidden" name="captchaToken" value={captchaToken} />
                    <button
                      type="button"
                      onClick={() => void refreshCaptcha()}
                      disabled={captchaLoading}
                      aria-label="Đổi phép tính"
                      title="Đổi phép tính"
                      className="btn-tactile inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-raised)] text-[var(--ink-secondary)] transition-colors hover:text-[var(--ink-primary)] disabled:opacity-60"
                    >
                      <RefreshCw
                        className={`h-3.5 w-3.5 transition-transform duration-300 ${
                          captchaLoading ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {isLogin && (
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setForgotMode(true);
                        setToast(null);
                      }}
                      className="text-[11px] font-medium text-[var(--accent-navy)] transition-opacity hover:underline"
                    >
                      Quên mật khẩu?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-tactile mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--accent-navy)] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all duration-150 hover:bg-[var(--accent-navy-hover)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>
                        {isLogin ? "Đang xác thực bảo mật..." : "Đang khởi tạo tài khoản..."}
                      </span>
                    </>
                  ) : (
                    <>
                      <span>{isLogin ? "Đăng nhập vào Studio" : "Tạo tài khoản nhận 10 lượt"}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-center gap-1.5 text-[11px] text-[var(--ink-tertiary)]">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent-emerald)]" />
            <span>Dữ liệu và quyền riêng tư được bảo vệ 100%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
