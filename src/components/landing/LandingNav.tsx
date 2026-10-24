import Link from "next/link";
import { Sparkles, ArrowRight, Coins } from "lucide-react";
import { getUserProfile } from "@/app/auth/actions";

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

export default function LandingNav({ user }: LandingNavProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#E4E4DE] bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3B49DF] text-white shadow-xs">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-[#18181B]">
            Content Studio
          </span>
          <span className="hidden rounded-md bg-[#F1F1ED] px-2 py-0.5 text-[11px] font-medium text-[#71717A] sm:inline-block">
            v3.2 Cloud
          </span>
        </Link>

        {/* Center navigation */}
        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[13px] font-medium text-[#71717A] transition-colors hover:text-[#18181B]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Auth actions */}
        <div className="flex items-center gap-2.5">
          {user ? (
            <>
              <div className="flex items-center gap-1.5 rounded-md border border-[#E4E4DE] bg-[#F1F1ED] px-2.5 py-1 text-xs font-medium text-[#27272A]">
                <Coins className="h-3.5 w-3.5 text-[#3B49DF]" />
                <span>
                  <strong className="text-[#18181B]">{user.credits}</strong> lượt tạo
                </span>
              </div>
              <Link
                href="/workspace"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#3B49DF] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#2F3CBF]"
              >
                <span>Vào Workspace</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden text-xs font-medium text-[#71717A] transition-colors hover:text-[#18181B] sm:inline-block"
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#3B49DF] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#2F3CBF]"
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