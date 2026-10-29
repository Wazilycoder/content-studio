"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  PlayCircle,
  CheckCircle2,
  Check,
  Copy,
  Globe,
  MessageCircle,
  Share2,
  Sparkles,
} from "lucide-react";
import { getUserProfile } from "@/app/auth/actions";
import { BorderBeam } from "@/components/ui/BorderBeam";
import { Tilt } from "@/components/ui/Tilt";
import { Particles } from "@/components/ui/Particles";

type LandingUser = Awaited<ReturnType<typeof getUserProfile>>;

interface HeroSectionProps {
  user: LandingUser;
}

interface DemoPost {
  tag: string;
  badgeBg: string;
  angleTitle: string;
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
    angleTitle: "Góc 1: Vấn đề & Giải pháp",
    hook: "85% người bán hàng online bỏ cuộc sau 3 tháng đầu vì vẫn copy cùng một kiểu văn mẫu AI sáo rỗng khiến khách lướt qua trong 0.5 giây",
    body: "Họ vô tình đăng đúng câu 'Chào mừng quý khách...' hay 'Sản phẩm siêu hot...' mà ai cũng đã đọc hàng trăm lần. Cách duy nhất phá vỡ vòng lặp: tiếp cận trực diện nỗi đau thực tế của khách, rồi biến giải pháp thành lý do họ phải chốt đơn ngay hôm nay.",
    hashtags: "#ContentMarketing #AntiAISlop #BanHangOnline",
  },
  {
    tag: "Cảm xúc",
    badgeBg: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
    angleTitle: "Góc 2: Cảm xúc & Phong cách",
    hook: "Từ ngày đổi sang phong cách viết này, khách tự nhắn hỏi mua không cần chèo kéo — đơn về đều đặn mỗi ngày mà không tốn thêm chi phí quảng cáo",
    body: "Không đao to búa lớn. Không kêu gọi gượng ép. Chỉ kể lại câu chuyện chân thực khi khách hàng bước vào cuộc sống mới cùng sản phẩm — để mỗi câu từ là một bức tranh cảm xúc khiến họ nhìn thấy chính mình hạnh phúc và tự tin hơn mỗi ngày.",
    hashtags: "#PhongCachSong #Storytelling #ChamVaoCamXuc",
  },
  {
    tag: "FAB",
    badgeBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    angleTitle: "Góc 3: Tính năng & Giá trị",
    hook: "Trực diện 3 nâng cấp công nghệ giúp bạn tiết kiệm 3 giờ viết bài mỗi ngày: chuẩn hóa 125 ký tự đầu, tự động phân giải 3 góc bài, 100% không trùng lặp",
    body: "Bán hàng bằng giá trị cốt lõi và thông số thuyết phục: mỗi caption trả lời đúng những câu khách hay lăn tăn nhất, biến người xem vãng lai thành khách hàng trung thành dài hạn — không cần chiêu trò, không cần giảm giá sốc.",
    hashtags: "#ProTurbo #HieuQuaCao #TuDongHoa",
  },
];

interface FloatingEmoji {
  id: number;
  emoji: string;
  x: number;
}

export default function HeroSection({ user }: HeroSectionProps) {
  const [activeAngleIndex, setActiveAngleIndex] = useState(0);
  const [copiedPost, setCopiedPost] = useState(false);

  // Live reaction counts
  const [reactions, setReactions] = useState({
    likes: 148,
    loves: 312,
    fires: 256,
  });
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);

  const activePost = DEMO_POSTS[activeAngleIndex];
  const primaryHref = user ? "/workspace" : "/register";

  const handleReaction = (type: "likes" | "loves" | "fires", emoji: string) => {
    setReactions((prev) => ({ ...prev, [type]: prev[type] + 1 }));

    const id = Date.now() + Math.random();
    const x = Math.floor(Math.random() * 40) - 20; // -20px to +20px jitter
    setFloatingEmojis((prev) => [...prev, { id, emoji, x }]);

    window.setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((item) => item.id !== id));
    }, 900);
  };

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
    <section className="relative overflow-x-clip py-8 sm:py-12 lg:py-0 lg:min-h-[calc(100dvh-5rem)] lg:flex lg:items-center">
      {/* Ambient Particle Field & Spotlight */}
      <Particles
        quantity={35}
        size={0.6}
        color="#6366f1"
        className="opacity-40 dark:opacity-60 -z-10"
      />
      <div
        aria-hidden="true"
        className="hero-spotlight pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_80%_60%_at_50%_20%,#000_70%,transparent_100%)] opacity-80 dark:opacity-100"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_20%,#000_60%,transparent_100%)] opacity-20 dark:opacity-15"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-10 xl:gap-14">
          {/* ================= LEFT COLUMN: EDITORIAL HERO ================= */}
          <div className="flex flex-col items-start text-left lg:col-span-7">
            {/* Top Eyebrow Pill — Clean, authoritative, zero fake status dots */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-raised)]/90 px-3.5 py-1.5 text-xs font-semibold text-[var(--ink-secondary)] shadow-xs backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
              <span className="tracking-wide">
                BẢNG B — ĐỀ 2 VIBE-CODING 2026 · TRÌNH TẠO CAPTION AI CHUẨN ĐỘC BẢN
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="mt-4 text-balance text-3xl font-extrabold leading-[1.14] tracking-tight sm:text-5xl lg:text-[3.15rem] xl:text-[3.5rem]">
              <span className="text-[var(--ink-primary)]">Một sản phẩm.</span>
              <br />
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-400 dark:via-purple-300 dark:to-emerald-400 bg-clip-text text-transparent">
                Ba cách khiến khách muốn mua.
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--ink-secondary)] sm:text-base">
              Chấm dứt văn mẫu sáo rỗng. Tự động kiến tạo 3 góc bài viết Facebook &amp; Instagram đa chiều:{" "}
              <strong className="text-[var(--ink-primary)] font-semibold">Vấn đề &amp; Giải pháp (PAS)</strong>,{" "}
              <strong className="text-[var(--ink-primary)] font-semibold">Cảm xúc &amp; Phong cách</strong>, và{" "}
              <strong className="text-[var(--ink-primary)] font-semibold">Trực diện tính năng (FAB)</strong> — với 3 tông giọng chuẩn cuộc thi{" "}
              <span className="inline-block rounded-md bg-indigo-500/10 px-1.5 py-0.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                Hài hước · Trang trọng · Trẻ trung
              </span>.
            </p>

            {/* CTAs */}
            <div className="mt-6 flex w-full flex-col items-stretch gap-3.5 sm:w-auto sm:flex-row sm:items-center">
              <Link
                href={primaryHref}
                className="btn-shimmer group inline-flex w-full items-center justify-center gap-3 rounded-full px-6 py-3.5 text-sm font-semibold shadow-[0_0_30px_-5px_rgba(99,102,241,0.5)] transition-all sm:w-auto cursor-pointer"
              >
                <span>Bắt đầu sáng tạo ngay</span>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>

              <a
                href="#demo"
                className="btn-tactile inline-flex w-full items-center justify-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--surface)]/80 px-5 py-3.5 text-sm font-medium text-[var(--ink-secondary)] backdrop-blur-md transition-all hover:border-[var(--border-strong)] hover:text-[var(--ink-primary)] sm:w-auto"
              >
                <PlayCircle className="h-4 w-4 text-indigo-500" />
                <span>Trải nghiệm bài mẫu</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="mt-5 flex flex-wrap items-center justify-start gap-2">
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

            {/* Value Props Bar */}
            <div className="mt-6 grid w-full grid-cols-3 gap-2.5 sm:gap-3 border-t border-[var(--border-subtle)] pt-5">
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)]/60 p-3 backdrop-blur-sm">
                <div className="text-lg font-bold tracking-tight text-[var(--ink-primary)] sm:text-xl">
                  3 Góc viết
                </div>
                <div className="mt-0.5 text-[11px] font-medium text-[var(--ink-tertiary)]">
                  PAS · Cảm xúc · FAB
                </div>
              </div>
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)]/60 p-3 backdrop-blur-sm">
                <div className="text-lg font-bold tracking-tight text-indigo-500 dark:text-indigo-400 sm:text-xl">
                  3 Tông giọng
                </div>
                <div className="mt-0.5 text-[11px] font-medium text-[var(--ink-tertiary)]">
                  Hài hước · Trang trọng · Trẻ trung
                </div>
              </div>
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)]/60 p-3 backdrop-blur-sm">
                <div className="text-lg font-bold tracking-tight text-emerald-600 dark:text-emerald-400 sm:text-xl">
                  125 Ký tự
                </div>
                <div className="mt-0.5 text-[11px] font-medium text-[var(--ink-tertiary)]">
                  Chuẩn Hook &quot;Xem thêm&quot; FB
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: INTERACTIVE TILT & BORDER BEAM SHOWCASE ================= */}
          <div className="hero-visual-container relative flex w-full items-center justify-center lg:col-span-5">
            {/* Background Ambient Glow */}
            <div className="pointer-events-none absolute -inset-4 rounded-[2.5rem] bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-emerald-500/15 blur-3xl opacity-80" />

            <Tilt rotationFactor={7} perspective={1100} className="w-full max-w-[470px]">
              {/* Outer Card with BorderBeam Laser */}
              <div className="relative rounded-3xl p-[1.5px] overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5),0_0_35px_-10px_rgba(99,102,241,0.25)]">
                <BorderBeam duration={7} colorFrom="#6366f1" colorVia="#a855f7" colorTo="#10b981" />

                {/* Inner Card Container */}
                <div className="relative z-10 flex flex-col rounded-[calc(1.5rem-1.5px)] bg-[var(--surface)] p-4 sm:p-5">
                  {/* Floating Top Meter Tag */}
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Hook: 122/125 ký tự đạt chuẩn &quot;Xem thêm&quot;
                    </span>
                    <span className="text-[11px] font-medium text-[var(--ink-tertiary)]">
                      Newsfeed Feed Preview
                    </span>
                  </div>

                  {/* 3-Tab Pill Switcher */}
                  <div className="mb-3.5 flex shrink-0 items-center gap-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-1">
                    {DEMO_POSTS.map((demo, idx) => (
                      <button
                        key={demo.tag}
                        type="button"
                        onClick={() => setActiveAngleIndex(idx)}
                        className={`flex-1 rounded-lg py-1.5 text-center text-[11.5px] font-semibold transition-all duration-200 touch-manipulation cursor-pointer ${
                          activeAngleIndex === idx
                            ? "bg-[var(--surface)] text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-black/5 dark:ring-white/10"
                            : "text-[var(--ink-tertiary)] hover:text-[var(--ink-primary)]"
                        }`}
                      >
                        {demo.tag}
                      </button>
                    ))}
                  </div>

                  {/* Facebook Post Header */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-xs font-bold text-white shadow-md">
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
                      {activePost.angleTitle}
                    </span>
                  </div>

                  {/* Facebook Post Body with Animated Key Transition */}
                  <div
                    key={activeAngleIndex}
                    className="mt-3.5 min-h-[155px] space-y-2 text-[13px] leading-relaxed transition-all duration-200"
                  >
                    <p className="font-semibold text-[var(--ink-primary)]">
                      {activePost.hook}
                      <span className="ml-0.5 font-normal text-indigo-500 dark:text-indigo-400 cursor-pointer hover:underline">
                        … Xem thêm
                      </span>
                    </p>
                    <p className="text-[var(--ink-secondary)]">{activePost.body}</p>
                    <p className="text-[12px] font-medium text-indigo-600 dark:text-indigo-400">
                      {activePost.hashtags}
                    </p>
                  </div>

                  {/* Interactive Facebook Reactions Bar */}
                  <div className="relative mt-3.5 flex items-center justify-between border-t border-[var(--border-subtle)] pt-2.5 text-xs text-[var(--ink-tertiary)]">
                    {/* Floating Reaction Emojis Canvas */}
                    <div className="pointer-events-none absolute -top-8 left-4 right-0 h-10 overflow-visible">
                      {floatingEmojis.map((item) => (
                        <span
                          key={item.id}
                          className="animate-emoji-burst absolute text-xl select-none"
                          style={{ left: `calc(15% + ${item.x}px)` }}
                        >
                          {item.emoji}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleReaction("likes", "👍")}
                        className="flex items-center gap-1 rounded-full px-2 py-1 transition-transform hover:scale-110 active:scale-95 bg-[var(--surface-raised)] hover:bg-blue-500/10 cursor-pointer text-[var(--ink-secondary)] hover:text-blue-600"
                        title="Thả Like"
                      >
                        <span>👍</span>
                        <span className="font-semibold text-[11px]">{reactions.likes}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReaction("loves", "❤️")}
                        className="flex items-center gap-1 rounded-full px-2 py-1 transition-transform hover:scale-110 active:scale-95 bg-[var(--surface-raised)] hover:bg-rose-500/10 cursor-pointer text-[var(--ink-secondary)] hover:text-rose-600"
                        title="Thả Tim"
                      >
                        <span>❤️</span>
                        <span className="font-semibold text-[11px]">{reactions.loves}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReaction("fires", "🔥")}
                        className="flex items-center gap-1 rounded-full px-2 py-1 transition-transform hover:scale-110 active:scale-95 bg-[var(--surface-raised)] hover:bg-amber-500/10 cursor-pointer text-[var(--ink-secondary)] hover:text-amber-600"
                        title="Thả Lửa"
                      >
                        <span>🔥</span>
                        <span className="font-semibold text-[11px]">{reactions.fires}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 hover:text-[var(--ink-primary)] cursor-pointer">
                        <MessageCircle className="h-3.5 w-3.5" /> 42
                      </span>
                      <span className="flex items-center gap-1 hover:text-[var(--ink-primary)] cursor-pointer">
                        <Share2 className="h-3.5 w-3.5" /> 18
                      </span>
                    </div>
                  </div>

                  {/* Card Bottom: Copy Action & Platform Stamp */}
                  <div className="mt-3.5 flex flex-col gap-2.5 border-t border-[var(--border-subtle)] pt-3.5 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      type="button"
                      onClick={handleCopyPost}
                      className="btn-shimmer inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-[12.5px] font-semibold cursor-pointer"
                    >
                      {copiedPost ? (
                        <Check className="h-4 w-4 text-emerald-300 animate-bounce" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      <span>{copiedPost ? "Đã sao chép!" : "Sao chép góc bài"}</span>
                    </button>
                    <span className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-2.5 py-1 text-[11px] font-medium text-[var(--ink-secondary)]">
                      <Globe className="h-3 w-3 text-indigo-500" />
                      Chuẩn Facebook Newsfeed 2026
                    </span>
                  </div>
                </div>
              </div>
            </Tilt>
          </div>
        </div>
      </div>
    </section>
  );
}
