import Link from "next/link";
import { ArrowRight, PlayCircle, Zap } from "lucide-react";
import { getUserProfile } from "@/app/auth/actions";
import ScrollReveal from "@/components/ui/ScrollReveal";

type LandingUser = Awaited<ReturnType<typeof getUserProfile>>;

interface HeroSectionProps {
  user: LandingUser;
}

const TRUST_ITEMS = [
  "0đ chi phí bắt đầu",
  "10 lượt tạo tặng ngay khi đăng ký",
  "Chuẩn 125 ký tự trước nút 'Xem thêm' Facebook",
  "7 tông giọng chuyên sâu",
];

export default function HeroSection({ user }: HeroSectionProps) {
  const primaryHref = user ? "/workspace" : "/register";
  const primaryLabel = user
    ? "Vào Workspace làm việc"
    : "Bắt đầu miễn phí (Tặng 10 lượt)";

  return (
    <section className="relative mx-auto max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24">
      {/* Ambient Radial Glow with breathing animation */}
      <div className="pointer-events-none absolute inset-x-0 -top-24 -z-10 flex justify-center overflow-hidden">
        <div className="animate-aura h-[380px] w-[750px] rounded-full bg-gradient-to-tr from-[var(--accent-navy)]/15 via-[var(--accent-navy)]/8 to-transparent blur-3xl" />
      </div>

      <div className="mx-auto max-w-3xl text-center">
        {/* Top Badge */}
        <ScrollReveal direction="down" duration={550}>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-3.5 py-1.5 text-[11px] font-medium text-[var(--ink-secondary)] shadow-xs transition-transform duration-200 hover:scale-105 sm:text-xs">
            <Zap className="h-3.5 w-3.5 text-[var(--accent-navy)] animate-pulse" />
            AI Copywriting đầu tiên tại Việt Nam chuẩn Anti-AI-Slop
          </span>
        </ScrollReveal>

        {/* Hero Title & Subtitle */}
        <ScrollReveal direction="up" delay={120} duration={700}>
          <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-[var(--ink-primary)] sm:text-5xl md:text-[3.4rem]">
            Tạo 3 góc bài viết bán hàng độc bản.{" "}
            <span className="text-[var(--ink-tertiary)]">Không văn mẫu sáo rỗng.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[var(--ink-secondary)] sm:text-lg">
            Biến thông tin sản phẩm thô sơ thành 3 bài viết Facebook &amp; Instagram
            đa chiều: Vấn đề &amp; Giải pháp, Cảm xúc phong cách sống, và Trực diện
            tính năng. Đăng ngay lập tức, không mất công chỉnh sửa.
          </p>
        </ScrollReveal>

        {/* Interactive CTAs */}
        <ScrollReveal direction="up" delay={240} duration={700}>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={primaryHref}
              className="btn-tactile inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--accent-navy)] px-6 py-3 text-sm font-semibold text-white shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--accent-navy-hover)] hover:shadow-[0_8px_20px_rgba(37,52,199,0.22)] active:translate-y-0 sm:w-auto"
            >
              {primaryLabel}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#demo"
              className="btn-tactile inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-6 py-3 text-sm font-semibold text-[var(--ink-primary)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--surface-raised)] hover:border-[var(--border-strong)] active:translate-y-0 sm:w-auto"
            >
              <PlayCircle className="h-4 w-4 text-[var(--accent-navy)]" />
              Xem bài viết mẫu
            </a>
          </div>
        </ScrollReveal>
      </div>

      {/* Trust Items with Staggered Entrance */}
      <ScrollReveal direction="up" delay={340} duration={700}>
        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-px overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--border-subtle)] sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_ITEMS.map((item) => (
            <div
              key={item}
              className="flex items-start gap-2 bg-[var(--surface)] px-4 py-4 text-left transition-all duration-200 hover:bg-[var(--surface-raised)] hover:scale-[1.01]"
            >
              <span className="mt-0.5 shrink-0 font-semibold text-[var(--accent-navy)]">✓</span>
              <span className="text-xs font-medium leading-relaxed text-[var(--ink-secondary)]">
                {item}
              </span>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}