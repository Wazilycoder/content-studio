import Link from "next/link";
import { Layers3 } from "lucide-react";

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
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--surface)]">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00D492] text-black font-black text-xs shadow-[0_0_15px_rgba(0,212,146,0.35)]">
                CS
              </div>
              <span className="text-sm font-extrabold tracking-tight text-[var(--ink-primary)]">
                CONTENT STUDIO
              </span>
            </div>
            <p className="mt-4 text-[13px] leading-relaxed text-[var(--ink-secondary)]">
              Sáng tạo nội dung bán hàng chuẩn phong cách. Biến mô tả sản phẩm thô
              thành 3 góc bài viết độc bản cho Facebook &amp; Instagram.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-tertiary)]">
                {column.title}
              </h4>
              <ul className="mt-3 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-[var(--ink-secondary)] transition-colors hover:text-[var(--ink-primary)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-[var(--border-subtle)] pt-6 text-center text-xs text-[var(--ink-tertiary)] sm:text-left">
          © 2026 Content Studio. Thiết kế theo chuẩn Editorial SaaS &amp; Karpathy
          Discipline. Zero AI-Slop.
        </div>
      </div>
    </footer>
  );
}