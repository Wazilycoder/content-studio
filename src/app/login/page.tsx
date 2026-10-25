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
    <div className="flex min-h-screen w-full flex-col bg-[var(--canvas)] text-[var(--ink-primary)] lg:flex-row">
      {/* ===== COLUMN A — AUTHENTICATION ENGINE ===== */}
      <div className="relative flex w-full flex-col lg:w-1/2">
        <div className="flex items-center justify-between px-5 py-4 sm:px-6">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-navy)] text-white shadow-sm">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="text-sm font-semibold tracking-tight text-[var(--ink-primary)]">
              Content Studio
            </span>
          </Link>
          <div className="flex items-center gap-1.5">
            <Link
              href="/"
              className="btn-tactile inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[var(--ink-secondary)] transition-colors hover:text-[var(--ink-primary)]"
            >
              <Home className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Trang chủ</span>
            </Link>
            <ThemeToggle />
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 pb-10 pt-2 sm:px-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--ink-primary)]">
              {forgotMode ? "Khôi phục mật khẩu" : isLogin ? "Chào mừng trở lại" : "Bắt đầu sáng tạo"}
            </h1>
            <p className="mt-1 text-[13px] text-[var(--ink-secondary)]">
              {forgotMode
                ? "Nhập email để nhận liên kết đặt lại mật khẩu."
                : "Nền tảng kiến tạo nội dung quảng cáo chuẩn AIDA & PAS cho người bán hàng Việt."}
            </p>
          </div>
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

                    <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-[var(--ink-tertiary)]">
                      <ShieldCheck className="h-3.5 w-3.5 text-[var(--accent-emerald)]" />
                      <span>Bảo mật chuẩn mã hóa SSL & Supabase Row-Level Security</span>
                    </div>
                  </div>
                </div>

                {/* ===== COLUMN B — DARK EDITORIAL SHOWCASE ===== */}
                <div className="relative hidden w-1/2 flex-col justify-center overflow-hidden border-l border-[var(--border-subtle)] bg-[var(--surface-raised)] lg:flex">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(circle at 80% 20%, color-mix(in srgb, var(--accent-navy) 20%, transparent), transparent 60%)",
                    }}
                  />
                  <div className="relative z-10 mx-auto w-full max-w-lg px-10 py-12">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-[var(--ink-secondary)] backdrop-blur-sm">
                      <Sparkles className="h-3.5 w-3.5 text-[var(--accent-emerald)]" />
                      STUDIO NỘI DUNG CHUẨN AIDA & PAS
                    </div>

                    <h2 className="text-[26px] font-semibold leading-[1.25] tracking-tight text-[var(--ink-primary)]">
                      Chinh phục 125 ký tự vàng.{" "}
                      <span className="text-[var(--accent-navy)]">Tăng gấp 3 lần</span> tỷ lệ nhấp quảng cáo Facebook.
                    </h2>

                    <p className="mt-3 text-[13.5px] leading-relaxed text-[var(--ink-secondary)]">
                      Không còn văn mẫu AI sáo rỗng. Content Studio phân tích sản phẩm, đào sâu tâm lý khách hàng và kiến tạo 3 góc bài viết độc bản chỉ sau 3 giây.
                    </p>

                    <div className="mt-7 space-y-2.5">
                      {[
                        {
                          title: "Góc 1: Vấn đề & Giải pháp (PAS)",
                          desc: "Khơi gợi nỗi đau, định vị sản phẩm là cứu cánh.",
                        },
                        {
                          title: "Góc 2: Cảm xúc & Phong cách sống",
                          desc: "Bán hình tượng khách hàng khao khát trở thành.",
                        },
                        {
                          title: "Góc 3: Trực diện tính năng & Lợi ích (FAB)",
                          desc: "Tôn vinh chất lượng và ưu thế cạnh tranh.",
                        },
                      ].map((feature) => (
                        <div
                          key={feature.title}
                          className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm"
                        >
                          <p className="text-[13px] font-semibold text-[var(--ink-primary)]">
                            {feature.title}
                          </p>
                          <p className="mt-0.5 text-[12px] text-[var(--ink-secondary)]">{feature.desc}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white text-[#050505] shadow-2xl dark:bg-[#242526] dark:text-[#E4E6EB]">
                      <div className="flex items-center gap-2.5 p-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent-navy)] to-[var(--accent-emerald)] text-[12px] font-bold text-white">
                          CS
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-semibold">Thương Hiệu Của Bạn</p>
                          <p className="text-[11px] text-[#65676B] dark:text-[#B0B3B8]">Được tài trợ · 🌐</p>
                        </div>
                      </div>
                      <div className="px-3 pb-2 text-[13px] leading-[1.5]">
                        <p>
                          Da bạn đang xỉn màu vì thức khuya? Đừng để làn da “tố cáo” tuổi tác...{" "}
                          <span className="font-semibold text-[#0866FF]">Xem thêm</span>
                        </p>
                      </div>
                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-[var(--accent-navy)] via-[#1e293b] to-[var(--accent-emerald)]">
                        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
                          <Sparkles className="mb-1.5 h-5 w-5 opacity-80" />
                          <p className="text-[13px] font-bold">Serum Vitamin C Thế Hệ Mới</p>
                          <p className="mt-0.5 text-[10.5px] text-white/80">
                            #1 Bán chạy — Da sáng mịn sau 14 ngày
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between px-3 py-2 text-[11px] text-[#65676B] dark:text-[#B0B3B8]">
                        <span>👍❤️ 1.4k lượt thích</span>
                        <span>280 bình luận · 96 lượt chia sẻ</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          }
