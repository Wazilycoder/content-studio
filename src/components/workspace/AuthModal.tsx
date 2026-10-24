"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Sparkles, X } from "lucide-react";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  productName?: string;
}

export default function AuthModal({ open, onClose, productName }: AuthModalProps) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-md rounded-2xl border border-[#E4E4DE] bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.12)] transition-all animate-in fade-in zoom-in-95 duration-150"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-[#71717A] hover:bg-[#F1F1ED] hover:text-[#18181B] transition-colors"
          aria-label="Đóng"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3B49DF]/10 text-[#3B49DF]">
          <Sparkles className="h-5 w-5" />
        </div>

        <h3 className="mt-4 text-base font-semibold tracking-tight text-[#18181B]">
          Đăng nhập để AI tạo nội dung
        </h3>

        <p className="mt-2 text-xs leading-relaxed text-[#71717A]">
          {productName ? (
            <>
              Để tạo 3 góc bài viết thực tế cho sản phẩm{" "}
              <strong className="text-[#18181B]">&ldquo;{productName}&rdquo;</strong>, bạn cần đăng
              nhập để hệ thống kết nối máy chủ AI (Gemini 3.5 / DeepSeek V3).
            </>
          ) : (
            <>
              Vui lòng đăng nhập để hệ thống gọi máy chủ AI sáng tạo nội dung và lưu trữ lịch sử bài viết.
            </>
          )}
        </p>

        <div className="mt-4 rounded-xl border border-[#E4E4DE] bg-[#F8F8F6] p-3 text-[11.5px] text-[#27272A]">
          🎁 <strong>Tặng ngay 10 lượt tạo miễn phí</strong> cho tài khoản đăng ký mới.
        </div>

        <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
          <Link
            href="/register"
            className="inline-flex flex-1 items-center justify-center rounded-lg bg-[#3B49DF] px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#2F3CBF]"
          >
            Đăng ký nhận 10 lượt
          </Link>
          <Link
            href="/login"
            className="inline-flex flex-1 items-center justify-center rounded-lg border border-[#E4E4DE] bg-white px-4 py-2.5 text-xs font-medium text-[#18181B] transition-colors hover:bg-[#F1F1ED]"
          >
            Đã có tài khoản
          </Link>
        </div>
      </div>
    </div>
  );
}
