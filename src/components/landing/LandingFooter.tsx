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
      { label: "Khung 3 góc nhìn", href: "#framework" },
      { label: "Trải nghiệm thử", href: "#demo" },
      { label: "Tính năng", href: "#features" },
      { label: "Bảng giá", href: "#pricing" },
    ],
  },
  {
    title: "Tài nguyên",
    links: [
      { label: "FAQ", href: "#faq" },
      { label: "Hướng dẫn sử dụng", href: "/workspace" },
      { label: "Đăng nhập", href: "/login" },
      { label: "Đăng ký", href: "/register" },
    ],
  },
  {
    title: "Pháp lý",
    links: [
      { label: "Điều khoản sử dụng", href: "/" },
      { label: "Chính sách bảo mật", href: "/" },
      { label: "Chính sách hoàn tiền", href: "/" },
    ],
  },
];

export default function LandingFooter() {
  return (
    <footer className="border-t border-[#E4E4DE] bg-white">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3B49DF] text-white shadow-xs">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-sm font-semibold tracking-tight text-[#18181B]">
                Content Studio
              </span>
            </div>
            <p className="mt-4 text-[13px] leading-relaxed text-[#71717A]">
              Sáng tạo nội dung bán hàng chuẩn phong cách. Biến mô tả sản phẩm thô
              thành 3 góc bài viết độc bản cho Facebook &amp; Instagram.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#A1A1AA]">
                {column.title}
              </h4>
              <ul className="mt-3 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-[#52525B] transition-colors hover:text-[#18181B]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-[#E4E4DE] pt-6 text-center text-xs text-[#A1A1AA] sm:text-left">
          © 2026 Content Studio. Thiết kế theo chuẩn Editorial SaaS &amp; Karpathy
          Discipline. Zero AI-Slop.
        </div>
      </div>
    </footer>
  );
}