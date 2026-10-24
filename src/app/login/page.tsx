"use client";

import { useState } from "react";
import { login, signup } from "@/app/auth/actions";
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    <div className="min-h-screen bg-[#F8F8F6] text-[#18181B] flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-indigo-100 selection:text-indigo-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
        {/* Brand Header */}
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#3B49DF] text-white shadow-sm mb-4">
          <Sparkles className="w-5 h-5" />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-[#18181B]">
          Content Studio
        </h2>
        <p className="mt-1 text-sm text-[#71717A]">
          Nền tảng sáng tạo nội dung quảng cáo Facebook & Instagram chuẩn phong cách
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-8 rounded-xl border border-[#E4E4DE] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          {/* Tabs: Đăng nhập vs Đăng ký */}
          <div className="flex rounded-lg bg-[#F1F1ED] p-1 mb-6">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setError(null);
              }}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all duration-150 ${
                isLogin
                  ? "bg-white text-[#18181B] shadow-sm"
                  : "text-[#71717A] hover:text-[#18181B]"
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
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all duration-150 ${
                !isLogin
                  ? "bg-white text-[#18181B] shadow-sm"
                  : "text-[#71717A] hover:text-[#18181B]"
              }`}
            >
              Đăng ký mới
            </button>
          </div>

          {!isLogin && (
            <div className="mb-5 p-3 rounded-lg bg-emerald-50 border border-emerald-100 flex items-start gap-2.5 text-emerald-800 text-xs leading-relaxed">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Tặng ngay <strong>10 lượt tạo nội dung miễn phí</strong> vào tài khoản sau khi đăng ký.
              </span>
            </div>
          )}

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-100 text-red-700 text-xs">
              {error}
            </div>
          )}

          <form action={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-[#27272A] mb-1.5"
              >
                Địa chỉ Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="chushop@gmail.com"
                className="w-full px-3 py-2 text-sm bg-white border border-[#E4E4DE] rounded-lg text-[#18181B] placeholder-[#A1A1AA] focus:outline-none focus:ring-2 focus:ring-[#3B49DF]/20 focus:border-[#3B49DF] transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-[#27272A] mb-1.5"
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
                className="w-full px-3 py-2 text-sm bg-white border border-[#E4E4DE] rounded-lg text-[#18181B] placeholder-[#A1A1AA] focus:outline-none focus:ring-2 focus:ring-[#3B49DF]/20 focus:border-[#3B49DF] transition-all"
              />
              {!isLogin && (
                <p className="mt-1 text-[11px] text-[#A1A1AA]">
                  Tối thiểu 6 ký tự
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#3B49DF] hover:bg-[#2F3CBF] active:bg-[#2530A5] rounded-lg shadow-sm transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
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

          <div className="mt-6 pt-4 border-t border-[#F1F1ED] flex items-center justify-center gap-1.5 text-[11px] text-[#A1A1AA]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Dữ liệu và quyền riêng tư được bảo vệ 100%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
