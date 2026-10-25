"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { forgotPassword, getMathCaptcha, login, signup } from "@/app/auth/actions";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Calculator,
  CheckCircle2,
  Database,
  Globe,
  Heart,
  Home,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  ThumbsUp,
  X,
} from "lucide-react";
import ThemeToggle from "@/components/theme/ThemeToggle";

interface AuthPageProps {
  initialMode?: "login" | "signup";
}

const SHOWCASE_ANGLES = [
  {
    tag: "PAS",
    label: "Vấn đề & Giải pháp",
    short: "Da bạn đang xỉn màu vì thức khuya? Đừng để làn da “tố cáo” tuổi tác...",
    full: "Da bạn đang xỉn màu vì thức khuya? Đừng để làn da “tố cáo” tuổi tác khi bạn hoàn toàn có thể sở hữu làn da căng bóng, rạng rỡ chỉ sau 14 ngày với Serum Vitamin C nguyên chất thế hệ mới. Công thức thẩm thấu sâu, mờ thâm nám và phục hồi hàng rào ẩm tự nhiên.",
    headline: "Serum Vitamin C Thế Hệ Mới",
    sub: "#1 Bán chạy — Da sáng mịn sau 14 ngày",
    hashtags: ["#SerumVitaminC", "#TrangDaMoTham", "#ChamSocDa", "#LamDepTuNhien", "#ContentStudio"],
  },
  {
    tag: "Cảm xúc",
    label: "Cảm xúc & Phong cách",
    short: "6 giờ sáng, bạn xứng đáng bước ra đường với làn da tự tin như vừa rời spa...",
    full: "6 giờ sáng, bạn xứng đáng bước ra đường với làn da tự tin như vừa rời spa. Serum Vitamin C thế hệ mới — người bạn đồng hành thầm lặng của phụ nữ hiện đại, giúp bạn luôn rạng rỡ trong mọi khoảnh khắc: từ cuộc họp quan trọng đến buổi hẹn hò lãng mạn. Bởi vì sự tự tin, đôi khi bắt đầu từ làn da.",
    headline: "Tỏa Sáng Mỗi Ngày",
    sub: "Làn da khỏe — Tự tin tỏa sáng mọi khoảnh khắc",
    hashtags: ["#ToaSangMoiNgay", "#SerumVitaminC", "#PhuNuHienDai", "#ChamSocDa", "#ContentStudio"],
  },
  {
    tag: "FAB",
    label: "Tính năng & Lợi ích",
    short: "Nồng độ Vitamin C 15% tinh khiết kết hợp HA phân tử thấp — thẩm thấu sâu gấp 3 lần...",
    full: "Nồng độ Vitamin C 15% tinh khiết kết hợp HA phân tử thấp — công thức độc quyền thẩm thấu sâu gấp 3 lần, giúp da hấp thu trọn vẹn dưỡng chất. Chai thủy tinh tối màu chống oxy hóa, vòi nhỏ giọt tiện lợi. Mỗi giọt serum là một cam kết về chất lượng và hiệu quả thực sự, xứng đáng từng đồng bạn chi ra.",
    headline: "15% Vitamin C Nguyên Chất",
    sub: "Công thức độc quyền — Thẩm thấu sâu gấp 3 lần",
    hashtags: ["#VitaminC15", "#SerumDocQuyen", "#ChamSocDaChuyenSau", "#SkincareRoutine", "#ContentStudio"],
  },
] as const;

export default function AuthPage({ initialMode = "login" }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(initialMode === "login");
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [captchaQuestion, setCaptchaQuestion] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "error" | "success"; message: string } | null>(null);
  const [showcaseExpanded, setShowcaseExpanded] = useState(false);
  const [showcaseAngle, setShowcaseAngle] = useState(0);
  const [securityModalOpen, setSecurityModalOpen] = useState(false);
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
    <div className="flex min-h-screen w-full flex-col bg-[var(--canvas)] text-[var(--ink-primary)] lg:grid lg:h-screen lg:grid-cols-2 lg:grid-rows-[auto_minmax(0,1fr)] lg:overflow-hidden">
      {/* ===== PRO NAVIGATION HEADER ===== */}
      <header className="shrink-0 border-b border-[var(--border-subtle)] bg-[var(--surface)]/95 px-6 py-3.5 lg:col-span-2 dark:bg-[#0F0F12]/95">
        <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-navy)] text-white shadow-sm">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="text-sm font-semibold tracking-tight text-[var(--ink-primary)]">
              Content Studio
            </span>
            <span className="hidden rounded-full border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-2 py-0.5 text-[11px] font-medium text-[var(--ink-tertiary)] sm:inline-block">
              v3.2 AI
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            <Link
              href="/"
              className="btn-tactile inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12.5px] font-medium text-[var(--ink-secondary)] transition-colors hover:bg-[var(--surface-raised)] hover:text-[var(--ink-primary)]"
            >
              <Home className="h-3.5 w-3.5" />
              <span>Trang chủ</span>
            </Link>
            <Link
              href="/#features"
              className="btn-tactile rounded-lg px-3 py-1.5 text-[12.5px] font-medium text-[var(--ink-secondary)] transition-colors hover:bg-[var(--surface-raised)] hover:text-[var(--ink-primary)]"
            >
              Tính năng AIDA &amp; PAS
            </Link>
            <Link
              href="/#pricing"
              className="btn-tactile rounded-lg px-3 py-1.5 text-[12.5px] font-medium text-[var(--ink-secondary)] transition-colors hover:bg-[var(--surface-raised)] hover:text-[var(--ink-primary)]"
            >
              Bảng giá Pro Turbo
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSecurityModalOpen(true)}
              className="btn-tactile hidden items-center gap-1.5 rounded-full border border-[var(--accent-emerald)]/25 bg-[var(--accent-emerald)]/[0.08] px-2.5 py-1 text-[11px] font-medium text-[var(--accent-emerald)] transition-colors hover:bg-[var(--accent-emerald)]/15 sm:inline-flex"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Bảo mật SSL 256-bit
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* ===== COLUMN A — AUTHENTICATION ENGINE (LOCKED / CENTERED) ===== */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-8 sm:px-12 lg:h-full lg:min-h-0 lg:overflow-y-auto custom-scrollbar">
        <div className="my-auto w-full max-w-md">
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
                  className="btn-tactile mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--accent-navy)] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-[transform,background-color] duration-150 ease-out hover:bg-[var(--accent-navy-hover)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Đang gửi yêu cầu...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="h-3.5 w-3.5" />
                      <span>Gửi liên kết khôi phục</span>                  </>
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
                    <strong>Tài khoản Miễn Phí:</strong> Tạo không giới hạn bài viết trọn đời
                    (Cooldown 45s để điều tiết tài nguyên).
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
                  className="btn-tactile mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--accent-navy)] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-[transform,background-color] duration-150 ease-out hover:bg-[var(--accent-navy-hover)] disabled:cursor-not-allowed disabled:opacity-60"
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
                      <span>{isLogin ? "Đăng nhập vào Studio" : "Tạo tài khoản miễn phí"}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}

                        <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-[var(--ink-tertiary)]">
                          <ShieldCheck className="h-3.5 w-3.5 text-[var(--accent-emerald)]" />
                          <span>Bảo mật chuẩn mã hóa SSL &amp; Supabase Row-Level Security</span>
                        </div>
                      </div>
                    </div>

                          {/* ===== COLUMN B — EDITORIAL SHOWCASE (INDEPENDENT SCROLL) ===== */}
                          <div
                            className="relative hidden flex-col border-l border-[var(--border-subtle)] bg-[var(--surface-raised)]/70 px-8 py-10 xl:px-14 lg:flex lg:h-full lg:min-h-0 lg:overflow-y-auto custom-scrollbar justify-start"
                            style={{
                              backgroundImage:
                                "radial-gradient(circle at 80% 20%, color-mix(in srgb, var(--accent-navy) 15%, transparent), transparent 70%)",
                            }}
                          >
                            <div className="my-0 mx-auto w-full max-w-lg pb-12 pt-2">
                              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-1.5 text-[11px] font-medium text-[var(--ink-secondary)]">
                                <Sparkles className="h-3.5 w-3.5 text-[var(--accent-emerald)]" />
                                NỀN TẢNG KIẾN TẠO NỘI DUNG CHUYỂN ĐỔI CAO
                              </div>

                              <h2 className="text-[26px] font-semibold leading-[1.25] tracking-tight text-[var(--ink-primary)]">
                                Chinh phục 125 ký tự vàng.{" "}
                                <span className="text-[var(--accent-navy)]">Nhân 3 tỷ lệ nhấp chuột</span> Facebook Ads.
                              </h2>

                              <p className="mt-3 text-[13.5px] leading-relaxed text-[var(--ink-secondary)]">
                                Không còn văn mẫu AI sáo rỗng. Content Studio khai phóng sức mạnh ngôn từ với 3 góc tiếp cận tâm lý khách hàng độc bản.
                              </p>

                              {/* KPI Social Proof — Typographic High-Contrast Metrics (Zero Emoji Slop) */}
                              <div className="mt-5 grid grid-cols-3 gap-2">
                                <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] px-2.5 py-2 text-center">
                                  <div className="text-[15px] font-bold tracking-tight tabular-nums text-[var(--accent-navy)]">
                                    0s
                                  </div>
                                  <div className="mt-0.5 text-[10.5px] font-medium text-[var(--ink-secondary)]">
                                    Tạo tức thì
                                  </div>
                                </div>
                                <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] px-2.5 py-2 text-center">
                                  <div className="text-[15px] font-bold tracking-tight tabular-nums text-[var(--accent-navy)]">
                                    125
                                  </div>
                                  <div className="mt-0.5 text-[10.5px] font-medium text-[var(--ink-secondary)]">
                                    Ký tự vàng
                                  </div>
                                </div>
                                <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] px-2.5 py-2 text-center">
                                  <div className="text-[15px] font-bold tracking-tight tabular-nums text-[var(--accent-emerald)]">
                                    +300%
                                  </div>
                                  <div className="mt-0.5 text-[10.5px] font-medium text-[var(--ink-secondary)]">
                                    Tỷ lệ CTR
                                  </div>
                                </div>
                              </div>

                              {/* Interactive 3-Angle Tabs */}
                              <div className="mt-6">
                                <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-[var(--ink-tertiary)]">
                                  Bấm thử 3 góc tiếp cận
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                  {SHOWCASE_ANGLES.map((angle, index) => (
                                    <button
                                      key={angle.tag}
                                      type="button"
                                      onClick={() => {
                                        setShowcaseAngle(index);
                                        setShowcaseExpanded(false);
                                      }}
                                      className={`btn-tactile inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11.5px] font-medium transition-all ${
                                        showcaseAngle === index
                                          ? "border-[var(--accent-navy)] bg-[var(--accent-navy)] text-white shadow-sm"
                                          : "border-[var(--border-subtle)] bg-[var(--surface)] text-[var(--ink-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--ink-primary)]"
                                      }`}
                                    >
                                      <span
                                        className={`rounded px-1 py-0.5 text-[9px] font-bold uppercase ${
                                          showcaseAngle === index
                                            ? "bg-white/20 text-white"
                                            : "bg-[var(--surface-raised)] text-[var(--ink-tertiary)]"
                                        }`}
                                      >
                                        {angle.tag}
                                      </span>
                                      <span>{angle.label}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Dynamic Facebook Mockup */}
                              <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-white text-[#050505] shadow-2xl dark:bg-[#242526] dark:text-[#E4E6EB]">
                                <div className="flex items-center gap-2.5 p-3">
                                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent-navy)] to-[var(--accent-emerald)] text-[12px] font-bold text-white">
                                    CS
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="truncate text-[13px] font-semibold">Thương Hiệu Của Bạn</p>
                                    <p className="flex items-center gap-1 text-[11px] text-[#65676B] dark:text-[#B0B3B8]">
                                      Được tài trợ · <Globe className="h-3 w-3 opacity-60" />
                                    </p>
                                  </div>
                                  <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold text-red-500">
                                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                                    Live
                                  </span>
                                </div>
                                <div className="px-3 pb-2.5 text-[13px] leading-[1.5]">
                                  <p className="whitespace-pre-wrap break-words">
                                    {showcaseExpanded ? (
                                      <>
                                        {SHOWCASE_ANGLES[showcaseAngle].full}
                                        <button
                                          type="button"
                                          onClick={() => setShowcaseExpanded(false)}
                                          className="ml-1.5 font-semibold text-[#65676B] hover:underline dark:text-[#B0B3B8]"
                                        >
                                          Ẩn bớt
                                        </button>
                                      </>
                                    ) : (
                                      <>
                                        {SHOWCASE_ANGLES[showcaseAngle].short}{" "}
                                        <button
                                          type="button"
                                          onClick={() => setShowcaseExpanded(true)}
                                          className="font-semibold text-[#0866FF] hover:underline"
                                        >
                                          Xem thêm
                                        </button>
                                      </>
                                    )}
                                  </p>
                                  {showcaseExpanded && (
                                    <div className="mt-2 flex flex-wrap gap-1.5 pt-0.5">
                                      {SHOWCASE_ANGLES[showcaseAngle].hashtags.map((tag) => (
                                        <span
                                          key={tag}
                                          className="cursor-pointer text-[12.5px] font-normal text-[#1877F2] transition-colors hover:underline dark:text-[#4599FF]"
                                        >
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <div className="relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-[var(--accent-navy)] via-[#1e293b] to-[var(--accent-emerald)]">
                                  <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
                                    <Sparkles className="mb-1.5 h-5 w-5 opacity-80" />
                                    <p className="text-[13px] font-bold">{SHOWCASE_ANGLES[showcaseAngle].headline}</p>
                                    <p className="mt-0.5 text-[10.5px] text-white/80">
                                      {SHOWCASE_ANGLES[showcaseAngle].sub}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between px-3 py-2 text-[11px] text-[#65676B] dark:text-[#B0B3B8]">
                                  <div className="flex items-center gap-1.5">
                                    <span className="flex -space-x-1">
                                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#1877F2] text-white">
                                        <ThumbsUp className="h-2.5 w-2.5 fill-white" />
                                      </span>
                                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#FA383E] text-white">
                                        <Heart className="h-2.5 w-2.5 fill-white" />
                                      </span>
                                    </span>
                                    <span className="font-medium text-[#65676B] dark:text-[#B0B3B8]">1.4k</span>
                                  </div>
                                  <span>280 bình luận · 96 lượt chia sẻ</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {securityModalOpen && (
                            <div
                              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm animate-fade-in"
                              onClick={() => setSecurityModalOpen(false)}
                            >
                              <div
                                className="w-full max-w-md rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] p-6 shadow-2xl"
                                onClick={(event) => event.stopPropagation()}
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex items-center gap-2.5">
                                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--accent-emerald)]/10 text-[var(--accent-emerald)]">
                                      <ShieldCheck className="h-5 w-5" />
                                    </span>
                                    <div>
                                      <h3 className="text-[15px] font-semibold text-[var(--ink-primary)]">
                                        Bảo chứng bảo mật 4 lớp
                                      </h3>
                                      <p className="text-[11.5px] text-[var(--ink-tertiary)]">
                                        Tiêu chuẩn an toàn dữ liệu doanh nghiệp
                                      </p>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setSecurityModalOpen(false)}
                                    aria-label="Đóng"
                                    className="rounded-lg p-1 text-[var(--ink-tertiary)] transition-colors hover:bg-[var(--surface-raised)] hover:text-[var(--ink-primary)]"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                                <ul className="mt-5 space-y-3">
                                  {[
                                    {
                                      icon: Lock,
                                      title: "Mã hóa SSL 256-bit",
                                      desc: "Toàn bộ dữ liệu truyền tải được mã hóa chuẩn ngân hàng, chống nghe lén.",
                                    },
                                    {
                                      icon: KeyRound,
                                      title: "Session HMAC SHA-256",
                                      desc: "Cookie phiên đăng nhập được ký số chống giả mạo và can thiệp.",
                                    },
                                    {
                                      icon: Calculator,
                                      title: "Math Captcha chống brute-force",
                                      desc: "Chặn đứng tấn công dò mật khẩu tự động bằng phép tính xác thực.",
                                    },
                                    {
                                      icon: Database,
                                      title: "Supabase Row-Level Security",
                                      desc: "Mỗi người dùng chỉ truy cập được dữ liệu của chính mình.",
                                    },
                                  ].map((layer) => (
                                    <li key={layer.title} className="flex items-start gap-3">
                                      <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-navy)]/10 text-[var(--accent-navy)]">
                                        <layer.icon className="h-3.5 w-3.5" />
                                      </span>
                                      <div>
                                        <p className="text-[12.5px] font-semibold text-[var(--ink-primary)]">
                                          {layer.title}
                                        </p>
                                        <p className="mt-0.5 text-[11.5px] leading-relaxed text-[var(--ink-secondary)]">
                                          {layer.desc}
                                        </p>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                                <button
                                  type="button"
                                  onClick={() => setSecurityModalOpen(false)}
                                  className="btn-tactile mt-5 w-full rounded-lg bg-[var(--accent-navy)] px-4 py-2 text-[12.5px] font-semibold text-white transition-colors hover:bg-[var(--accent-navy-hover)]"
                                >
                                  Đã hiểu
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    }
