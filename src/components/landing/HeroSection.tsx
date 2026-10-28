"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  PlayCircle,
  Layers3,
  CheckCircle2,
  Check,
  Copy,
  Globe,
} from "lucide-react";
import { getUserProfile } from "@/app/auth/actions";

type LandingUser = Awaited<ReturnType<typeof getUserProfile>>;

interface HeroSectionProps {
  user: LandingUser;
}

interface DemoPost {
  tag: string;
  badgeBg: string;
  hook: string;
  body: string;
  hashtags: string;
}

const TRUST_ITEMS = [
  "0đ chi phí bắt đầu",
  "10 lượt tạo miễn phí",
  "Chuẩn 125 ký tự 'Xem thêm'",
  "3 tông giọng chuẩn cuộc thi (Hài hước · Trang trọng · Trẻ trung)",
];

const DEMO_POSTS: DemoPost[] = [
  {
    tag: "PAS",
    badgeBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    hook: "85% người bán hàng online bỏ cuộc sau 3 tháng đầu vì vẫn copy cùng một kiểu văn mẫu AI sáo rỗng khiến khách lướt qua trong 0.5 giây",
    body: "Họ vô tình đăng đúng câu 'Chào mừng quý khách...' hay 'Sản phẩm siêu hot...' mà ai cũng đã đọc hàng trăm lần. Cách duy nhất phá vỡ vòng lặp: tiếp cận trực diện nỗi đau thực tế của khách, rồi biến giải pháp thành lý do họ phải chốt đơn ngay hôm nay.",
    hashtags: "#ContentMarketing #AntiAISlop #BanHangOnline",
  },
  {
    tag: "Cảm xúc",
    badgeBg: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
    hook: "Từ ngày đổi sang phong cách viết này, khách tự nhắn hỏi mua không cần chèo kéo — đơn về đều đặn mỗi ngày mà không tốn thêm chi phí quảng cáo",
    body: "Không đao to búa lớn. Không kêu gọi gượng ép. Chỉ kể lại câu chuyện chân thực khi khách hàng bước vào cuộc sống mới cùng sản phẩm — để mỗi câu từ là một bức tranh cảm xúc khiến họ nhìn thấy chính mình hạnh phúc và tự tin hơn mỗi ngày.",
    hashtags: "#PhongCachSong #Storytelling #ChamVaoCamXuc",
  },
  {
    tag: "FAB",
    badgeBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    hook: "Trực diện 3 nâng cấp công nghệ giúp bạn tiết kiệm 3 giờ viết bài mỗi ngày: chuẩn hóa 125 ký tự đầu, tự động phân giải 3 góc bài, 100% không trùng lặp",
    body: "Bán hàng bằng giá trị cốt lõi và thông số thuyết phục: mỗi caption trả lời đúng những câu khách hay lăn tăn nhất, biến người xem vãng lai thành khách hàng trung thành dài hạn — không cần chiêu trò, không cần giảm giá sốc.",
    hashtags: "#ProTurbo #HieuQuaCao #TuDongHoa",
  },
];

export default function HeroSection({ user }: HeroSectionProps) {
  const [activeAngleIndex, setActiveAngleIndex] = useState(0);
  const [copiedPost, setCopiedPost] = useState(false);

  const activePost = DEMO_POSTS[activeAngleIndex];
  const primaryHref = user ? "/workspace" : "/register";

  const handleCopyPost = async () => {
    const fullText = `${activePost.hook}… Xem thêm\n\n${activePost.body}\n\n${activePost.hashtags}`;
    try {
      await navigator.clipboard.writeText(fullText);
      setCopiedPost(true);
      window.setTimeout(() => setCopiedPost(false), 1800);
    } catch {
      setCopiedPost(false);
    }
  };

  return (
    <section className="relative overflow-x-clip py-4 sm:py-8 lg:py-0 lg:min-h-[calc(100dvh-5rem)] lg:flex lg:items-center">
      {/* 1. Background Grid Mesh Texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_20%,#000_70%,transparent_100%)]"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10 xl:gap-12">
          {/* ================= LEFT COLUMN: HERO CONTENT ================= */}
          <div className="flex flex-col items-start text-left lg:col-span-7">
            {/* Top Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-3 py-1">
              <Layers3 className="h-3 w-3 text-[var(--ink-tertiary)]" />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--ink-secondary)] sm:text-[11px]">
                Chuẩn Anti-AI-Slop cho người bán hàng Việt
              </span>
            </div>

            {/* Hero Title & Subtitle */}
            <h1 className="mt-3 text-balance text-3xl font-extrabold leading-[1.12] tracking-tight text-[var(--ink-primary)] sm:text-4xl lg:text-[2.85rem] xl:text-[3.25rem]">
              Một sản phẩm.
              <br />
              <span className="text-[var(--ink-secondary)]">
                Ba cách khiến khách muốn mua.
              </span>
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--ink-secondary)] sm:text-base">
              Biến thông tin sản phẩm thô sơ thành 3 bài viết Facebook &amp; Instagram đa chiều:{" "}
              <span className="font-semibold text-[var(--ink-primary)]">Vấn đề &amp; Giải pháp (PAS)</span>,{" "}
              <span className="font-semibold text-[var(--ink-primary)]">Cảm xúc &amp; Phong cách</span>, và{" "}
              <span className="font-semibold text-[var(--ink-primary)]">Trực diện tính năng (FAB)</span> — chuẩn xác 3 tông giọng{" "}
              <span className="font-semibold text-[var(--ink-primary)]">Hài hước · Trang trọng · Trẻ trung</span>. Đăng ngay, không mất công chỉnh sửa.
            </p>

            {/* Interactive High-End CTAs */}
            <div className="mt-4.5 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
              <Link
                href={primaryHref}
                className="group inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-[var(--accent-navy)] px-6 py-3 text-sm font-semibold text-white transition-colors duration-150 ease-out hover:bg-[var(--accent-navy-hover)] sm:w-auto"
              >
                <span>Bắt đầu sáng tạo ngay</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5" />
              </Link>

              <a
                href="#demo"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-medium text-[var(--ink-secondary)] transition-colors duration-150 ease-out hover:text-[var(--ink-primary)] sm:w-auto"
              >
                <PlayCircle className="h-4 w-4" />
                <span>Trải nghiệm bài mẫu</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="mt-4 flex flex-wrap items-center justify-start gap-2">
              {TRUST_ITEMS.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-2.5 py-1 text-xs text-[var(--ink-secondary)]"
                >
                  <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                    ✓
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Value Props Bar (Genuine Contest Metrics) */}
            <div className="mt-4.5 flex items-center gap-5 border-t border-[var(--border-subtle)] pt-3.5 sm:gap-8">
              <div>
                <div className="text-xl font-extrabold tracking-tight text-[var(--ink-primary)] sm:text-2xl">
                  3 Góc viết
                </div>
                <div className="mt-0.5 text-[11px] font-medium text-[var(--ink-tertiary)]">
                  PAS · Cảm xúc · FAB
                </div>
              </div>
              <div className="h-7 w-px bg-[var(--border-subtle)]" />
              <div>
                <div className="text-xl font-extrabold tracking-tight text-[var(--ink-primary)] sm:text-2xl">
                  3 Tông giọng
                </div>
                <div className="mt-0.5 text-[11px] font-medium text-[var(--ink-tertiary)]">
                  Hài hước · Trang trọng · Trẻ trung
                </div>
              </div>
              <div className="h-7 w-px bg-[var(--border-subtle)]" />
              <div>
                <div className="text-xl font-extrabold tracking-tight text-[var(--ink-primary)] sm:text-2xl">
                  125 Ký tự
                </div>
                <div className="mt-0.5 text-[11px] font-medium text-[var(--ink-tertiary)]">
                  Chuẩn Hook &quot;Xem thêm&quot; FB
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: INTERACTIVE PRODUCT THEATRE ================= */}
          <div className="hero-visual-container relative flex w-full items-center justify-center lg:col-span-5">
            <div className="w-full max-w-[430px]">
              <div className="relative overflow-hidden rounded-[1.75rem] border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-2 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.25)]">
                <div className="relative z-10 flex flex-col overflow-hidden rounded-[calc(1.75rem-0.5rem)] border border-[var(--border-subtle)] bg-[var(--surface)] p-3.5 sm:p-4">
                  {/* 3-Tab Pill Switcher for the 3 Angles */}
                  <div className="mb-3 flex shrink-0 items-center gap-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)]/70 p-1">
                    {DEMO_POSTS.map((demo, idx) => (
                      <button
                        key={demo.tag}
                        type="button"
                        onClick={() => setActiveAngleIndex(idx)}
                        className={`flex-1 rounded-lg py-1.5 text-center text-[11px] font-semibold transition-colors duration-150 touch-manipulation cursor-pointer ${
                          activeAngleIndex === idx
                            ? "bg-[var(--surface)] text-[var(--ink-primary)] shadow-xs"
                            : "text-[var(--ink-tertiary)] hover:text-[var(--ink-primary)]"
                        }`}
                      >
                        {demo.tag}
                      </button>
                    ))}
                  </div>

                  {/* Post Header */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--ink-primary)] text-xs font-bold text-[var(--canvas)]">
                        CS
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[13px] font-bold text-[var(--ink-primary)]">
                            Content Studio
                          </span>
                          <CheckCircle2 className="h-3.5 w-3.5 fill-blue-500 text-white" />
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-[var(--ink-tertiary)]">
                          <span>Vừa xong</span>
                          <span>·</span>
                          <Globe className="h-3 w-3" />
                        </div>
                      </div>
                    </div>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${activePost.badgeBg}`}
                    >
                      {activePost.tag}
                    </span>
                  </div>

                  {/* Post Body: Hook (125-char cutoff) + Expanded Pitch + Hashtags */}
                  <div className="mt-3 min-h-[150px] space-y-2 text-[12.5px] leading-relaxed">
                    <p className="font-semibold text-[var(--ink-primary)]">
                      {activePost.hook}
                      <span className="ml-0.5 font-normal text-[var(--ink-tertiary)]">
                        … Xem thêm
                      </span>
                    </p>
                    <p className="text-[var(--ink-secondary)]">{activePost.body}</p>
                    <p className="text-[11.5px] font-medium text-blue-600 dark:text-blue-400">
                      {activePost.hashtags}
                    </p>
                  </div>

                  {/* Card Bottom: Copy + Platform Readiness */}
                  <div className="mt-3 flex flex-col gap-2.5 border-t border-[var(--border-subtle)] pt-3 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      type="button"
                      onClick={handleCopyPost}
                      className="btn-tactile inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent-navy)] px-3.5 py-2 text-[12.5px] font-semibold text-white transition-colors hover:bg-[var(--accent-navy-hover)] active:scale-95"
                    >
                      {copiedPost ? (
                        <Check className="check-pop h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      <span>{copiedPost ? "Đã sao chép!" : "Sao chép góc bài"}</span>
                    </button>
                    <span className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-2.5 py-1 text-[11px] font-medium text-[var(--ink-secondary)]">
                      <Globe className="h-3 w-3" />
                      Chuẩn Facebook &amp; Instagram Newsfeed
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}