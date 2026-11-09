import Link from "next/link";
import { Sparkles } from "lucide-react";

interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

const COLUMNS: FooterColumn[] = [
  {
    title: "Sản phẩm",
    links: [
      { label: "Khung 3 góc nhìn", href: "/#framework" },
      { label: "Trải nghiệm thử", href: "/#demo" },
      { label: "Tính năng", href: "/#features" },
      { label: "Bảng giá", href: "/#pricing" },
    ],
  },
  {
    title: "Tài nguyên",
    links: [
      { label: "FAQ", href: "/#faq" },
      { label: "Hướng dẫn sử dụng", href: "/guide" },
      { label: "Đăng nhập", href: "/login" },
      { label: "Đăng ký", href: "/register" },
    ],
  },
  {
    title: "Pháp lý",
    links: [
      { label: "Điều khoản sử dụng", href: "/terms" },
      { label: "Chính sách bảo mật", href: "/privacy" },
      { label: "Chính sách hoàn tiền", href: "/refund" },
    ],
  },
];

export default function LandingFooter() {
  return (
    <footer className="relative border-t border-white/[0.08] bg-[#070A10]/95 backdrop-blur-2xl">
      {/* Subtle bottom glow */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-40 w-3/4 rounded-full bg-emerald-500/[0.03] blur-[100px]" />

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid gap-12 md:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div className="max-w-xs">
            <Link href="/" className="group flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 font-black text-slate-950 text-xs shadow-[0_0_20px_rgba(0,212,146,0.4)] transition-transform duration-200 group-hover:scale-105 active:scale-95">
                CS
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-extrabold tracking-tight text-slate-100 group-hover:text-emerald-400 transition-colors">
                  CONTENT STUDIO
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400/80">
                  Luxury Glass Edition
                </span>
              </div>
            </Link>
            <p className="mt-4 text-[13px] leading-relaxed text-slate-400">
              Sáng tạo nội dung bán hàng chuẩn phong cách. Biến mô tả sản phẩm thô
              thành 3 kịch bản quảng cáo độc bản tối ưu tỷ lệ chuyển đổi cho Facebook &amp; Instagram.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-[11px] font-medium text-emerald-400">
              <Sparkles className="h-3 w-3 text-emerald-400 animate-pulse" />
              <span>Zero AI-Slop Architecture</span>
            </div>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-300">
                {column.title}
              </h4>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-slate-400 transition-colors duration-150 hover:text-emerald-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/[0.08] pt-8 text-xs text-slate-500 sm:flex-row">
          <div>
            © 2026 Content Studio. Thiết kế theo chuẩn Luxury Glass &amp; Karpathy Discipline. Zero AI-Slop.
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              All Systems Operational
            </span>
            <span>·</span>
            <span>Latency: 0ms GPU Turbo</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
