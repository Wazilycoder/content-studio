import Link from "next/link";
import { ArrowRight, PlayCircle, Zap, Sparkles } from "lucide-react";
import { getUserProfile } from "@/app/auth/actions";
import ScrollReveal from "@/components/ui/ScrollReveal";

type LandingUser = Awaited<ReturnType<typeof getUserProfile>>;

interface HeroSectionProps {
  user: LandingUser;
}

const TRUST_ITEMS = [
  "0đ chi phí bắt đầu",
  "10 lượt tạo tặng ngay",
  "Chuẩn 125 ký tự trước nút 'Xem thêm'",
  "7 tông giọng chuyên sâu",
];

export default function HeroSection({ user }: HeroSectionProps) {
  const primaryHref = user ? "/workspace" : "/register";
  const primaryLabel = user
    ? "Vào Workspace làm việc"
    : "Bắt đầu miễn phí (Tặng 10 lượt)";

  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
      {/* 1. Background Grid Mesh Texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_20%,#000_70%,transparent_100%)]"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* 2. Focused Subtle Ambient Glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-32 -z-10 flex justify-center overflow-hidden">
        <div className="h-[380px] w-[700px] rounded-full bg-[var(--accent-navy)]/8 blur-[120px] dark:bg-[var(--accent-navy)]/15" />
      </div>

      {/* 3. Central Hero Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6">
        {/* Top Eyebrow Badge */}
        <ScrollReveal direction="down" duration={550}>
          <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-indigo-500/25 bg-indigo-50/80 px-3 py-1 sm:px-4 sm:py-1.5 shadow-[0_0_24px_rgba(99,102,241,0.15)] backdrop-blur-md transition-all duration-200 hover:scale-105 hover:border-indigo-500/40 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:shadow-[0_0_24px_rgba(99,102,241,0.25)]">
            <span className="flex h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-emerald-500 animate-pulse dark:bg-emerald-400" />
            <span className="text-[10px] sm:text-xs font-semibold tracking-wide text-indigo-700 dark:text-indigo-300">
              AI Copywriting đầu tiên tại VN chuẩn Anti-AI-Slop
            </span>
            <Sparkles className="h-3 w-3 text-amber-500 animate-spin [animation-duration:5s] dark:text-amber-300" />
          </div>
        </ScrollReveal>

        {/* Hero Title & Subtitle */}
        <ScrollReveal direction="up" delay={120} duration={700}>
          <h1 className="mt-6 sm:mt-7 text-balance text-3xl font-extrabold leading-[1.12] tracking-tight sm:text-5xl md:text-6xl lg:text-[4rem]">
            <span className="bg-gradient-to-b from-slate-900 via-slate-800 to-zinc-700 bg-clip-text text-transparent dark:from-white dark:via-white/95 dark:to-slate-300">
              Tạo 3 góc bài viết bán hàng độc bản.
            </span>
            <br />
            <span className="mt-2 inline-block bg-gradient-to-r from-indigo-600 via-sky-600 to-emerald-600 bg-clip-text text-transparent drop-shadow-[0_4px_24px_rgba(99,102,241,0.2)] dark:from-indigo-400 dark:via-sky-300 dark:to-emerald-300 dark:drop-shadow-[0_4px_24px_rgba(99,102,241,0.3)]">
              Không văn mẫu sáo rỗng.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-zinc-600 sm:text-lg dark:text-zinc-300">
            Biến thông tin sản phẩm thô sơ thành 3 bài viết Facebook &amp; Instagram
            đa chiều: <span className="font-semibold text-zinc-900 dark:text-white">Vấn đề &amp; Giải pháp</span>,{" "}
            <span className="font-semibold text-zinc-900 dark:text-white">Cảm xúc phong cách sống</span>, và{" "}
            <span className="font-semibold text-zinc-900 dark:text-white">Trực diện tính năng</span>. Đăng ngay lập tức, không mất công chỉnh sửa.
          </p>
        </ScrollReveal>

        {/* Interactive High-End CTAs (Button-in-Button Pattern) */}
        <ScrollReveal direction="up" delay={240} duration={700}>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={primaryHref}
              className="group relative inline-flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_0_35px_rgba(79,93,255,0.45)] transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_50px_rgba(79,93,255,0.7)] active:scale-[0.98] sm:w-auto"
            >
              <span>{primaryLabel}</span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-transform duration-200 group-hover:translate-x-1">
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>

            <a
              href="#demo"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-zinc-200/90 bg-white/80 px-6 py-3.5 text-sm font-semibold text-zinc-700 shadow-xs backdrop-blur-xl transition-all duration-200 hover:scale-[1.03] hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900 active:scale-[0.98] sm:w-auto dark:border-white/20 dark:bg-white/[0.06] dark:text-zinc-100 dark:hover:border-white/40 dark:hover:bg-white/[0.12] dark:hover:text-white"
            >
              <PlayCircle className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
              <span>Xem bài viết mẫu</span>
            </a>
          </div>
        </ScrollReveal>

        {/* 5. Trust Badges (Double-Bezel Glass Pills) */}
        <ScrollReveal direction="up" delay={340} duration={700}>
          <div className="mx-auto mt-14 flex flex-wrap items-center justify-center gap-3 max-w-3xl">
            {TRUST_ITEMS.map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 rounded-full border border-zinc-200/80 bg-white/70 px-4 py-2 shadow-xs backdrop-blur-md transition-all duration-200 hover:scale-105 hover:border-indigo-500/30 hover:bg-white dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300 dark:hover:border-indigo-500/40 dark:hover:bg-white/[0.08]"
              >
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  ✓
                </span>
                <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}