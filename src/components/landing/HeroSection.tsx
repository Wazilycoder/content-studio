"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  Copy,
  Globe,
  SlidersHorizontal,
  CheckCircle2,
} from "lucide-react";
import { getUserProfile } from "@/app/auth/actions";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { BorderBeam } from "@/components/ui/BorderBeam";
import { ShimmerButton } from "@/components/ui/ShimmerButton";

type LandingUser = Awaited<ReturnType<typeof getUserProfile>>;

interface HeroSectionProps {
  user: LandingUser;
}

interface TransformationAngle {
  id: string;
  num: string;
  tag: string;
  name: string;
  badgeBg: string;
  tagColor: string;
  hook: string;
  body: string;
  hashtags: string;
  psychology: string;
}

const SAMPLE_BRIEF = {
  name: "Áo sơ mi lụa tơ tằm dệt tay Bảo Lộc",
  tone: "Trang trọng",
  audience: "Nữ chuyên viên văn phòng 28–45 tuổi",
};

const TRANSFORMATION_ANGLES: TransformationAngle[] = [
  {
    id: "pas",
    num: "01",
    tag: "PAS",
    name: "Vấn đề & Giải pháp",
    badgeBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    tagColor: "text-blue-500",
    hook: "Áo sơ mi công sở khiến bạn bí bách cả ngày dài, ngứa cổ và nhăn nhúm sau 2 lần giặt? Đã đến lúc chấm dứt sự khó chịu đó.",
    body: "Sợi tơ tằm Bảo Lộc tự nhiên 100% với cấu trúc protein thoáng khí giúp hạ nhiệt tức thì 2-3°C khi tiếp xúc với da. Kỹ thuật dệt tay giữ nếp rũ mềm mại tự nhiên, không nhăn nhúm, cho bạn vẻ chỉn chu từ cuộc họp sáng sớm đến bữa tối đối tác.",
    hashtags: "#AoSoMiLua #LuaToTamBaoLoc #ThoiTrangCongSo #ThanhLichTuNhien",
    psychology: "Bí bách khó chịu → Giải pháp lụa tự nhiên → Tự tin suốt ngày dài",
  },
  {
    id: "aida",
    num: "02",
    tag: "AIDA",
    name: "Cảm xúc & Phong cách",
    badgeBg: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
    tagColor: "text-pink-500",
    hook: "Không cần phô trương logo, chiếc áo sơ mi lụa tơ tằm dệt tay Bảo Lộc tự toát lên thần thái sang trọng, tĩnh lặng của người phụ nữ tinh tế.",
    body: "Chạm nhẹ vào làn da mỗi sáng thứ Hai như một lời khẳng định dịu dàng về gu thẩm mỹ thượng thừa. Ánh bóng mờ tự nhiên của tơ dệt thủ công tôn vinh nét quý phái mà không cần bất kỳ sự gượng ép nào — bước vào phòng làm việc và thu hút mọi ánh nhìn.",
    hashtags: "#QuietLuxury #ThoiTrangQuyPhai #LuaBaoLoc #ThanhLichTinhLang",
    psychology: "Gu thẩm mỹ tinh tế → Khẳng định vị thế thầm lặng → Tự hào sở hữu",
  },
  {
    id: "fab",
    num: "03",
    tag: "FAB",
    name: "Tính năng & Giá trị",
    badgeBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    tagColor: "text-emerald-500",
    hook: "36 giờ dệt tay thủ công từ 100% kén tơ tằm tự nhiên vùng cao nguyên Bảo Lộc cùng cúc vỏ trai khảm xà cừ tạo nên kiệt tác độc bản.",
    body: "Mỗi chiếc áo sở hữu mật độ dệt 16 momme tối ưu cho độ bền gấp 3 lần lụa công nghiệp, không tích điện và thân thiện với làn da nhạy cảm. Từng đường may giấu chỉ chuẩn may đo cao cấp (Haute Couture), bảo toàn trọn vẹn giá trị di sản thủ công Việt.",
    hashtags: "#ThuCongTruyenThong #GiaTriThat #ChatLieuTuNhien #BaoLocSilk",
    psychology: "Chế tác 36h thủ công → Bền gấp 3 lần lụa dệt máy → Đầu tư xứng đáng",
  },
];

export default function HeroSection({ user }: HeroSectionProps) {
  const router = useRouter();
  const [activeAngleIndex, setActiveAngleIndex] = useState(0);
  const [copiedPost, setCopiedPost] = useState(false);

  const activeAngle = TRANSFORMATION_ANGLES[activeAngleIndex];
  const primaryHref = user ? "/workspace" : "/register";

  const handleCopy = async () => {
    const fullText = `${activeAngle.hook}… Xem thêm\n\n${activeAngle.body}\n\n${activeAngle.hashtags}`;
    try {
      await navigator.clipboard.writeText(fullText);
      setCopiedPost(true);
      window.setTimeout(() => setCopiedPost(false), 1600);
    } catch {
      setCopiedPost(false);
    }
  };

  // Get the other two angles for the stacked cards behind
  const otherAngles = TRANSFORMATION_ANGLES.filter((_, idx) => idx !== activeAngleIndex);

  return (
    <section className="relative overflow-x-clip py-10 sm:py-16 lg:py-0 lg:min-h-[calc(100dvh-5rem)] lg:flex lg:items-center">
      {/* 1. Atmospheric Directional Ambient Lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_70%_50%_at_65%_30%,#000_60%,transparent_100%)] opacity-70"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_20%,rgba(68,82,232,0.18),transparent_70%)]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          {/* ================= LEFT COLUMN: KINETIC EDITORIAL ================= */}
          <div className="flex flex-col items-start text-left lg:col-span-6 xl:col-span-6">
            {/* Editorial Eyebrow Tag */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-hairline)] bg-[var(--surface-stage)] px-3.5 py-1.5 text-xs font-semibold tracking-wider uppercase text-[var(--ink-secondary)] shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-indigo)]" />
              <span>Editorial Intelligence · Kiến tạo nội dung đa chiều</span>
            </div>

            {/* Kinetic Display Headline */}
            <h1 className="mt-5 text-balance text-4xl font-extrabold tracking-tight text-[var(--ink-primary)] sm:text-6xl lg:text-[3.75rem] xl:text-[4.25rem] leading-[1.08]">
                Một sản phẩm.
                <br />
                <span className="text-[var(--accent-indigo)]">Ba câu chuyện.</span>
                <br />
                Khiến khách muốn mua.
              </h1>

            {/* Subtitle */}
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--ink-secondary)] sm:text-[17px]">
              Một bản brief 4 trường thô kệch được chuyển hóa thành 3 góc bài độc bản:{" "}
              <strong className="text-[var(--ink-primary)] font-semibold">PAS (Nỗi đau)</strong>,{" "}
              <strong className="text-[var(--ink-primary)] font-semibold">AIDA (Cảm xúc)</strong>, và{" "}
              <strong className="text-[var(--ink-primary)] font-semibold">FAB (Giá trị thật)</strong> — mỗi hook mở đầu được canh theo ngưỡng ~125 ký tự hiển thị trước &quot;Xem thêm&quot; trên Newsfeed.
            </p>

            {/* Call To Action Buttons (Island Button Architecture) */}
            <div className="mt-8 flex w-full flex-col items-stretch gap-4 sm:w-auto sm:flex-row sm:items-center">
              <ShimmerButton
                type="button"
                onClick={() => router.push(primaryHref)}
                background="var(--ink-primary)"
                className="group w-full px-7 py-4 text-sm font-semibold text-[var(--canvas)] sm:w-auto"
              >
                <span>Bắt đầu sáng tạo ngay</span>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--canvas)]/20 text-current transition-transform duration-200 group-hover:translate-x-1">
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </ShimmerButton>

              <a
                href="#demo"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[var(--border-hairline)] bg-[var(--surface-stage)] px-6 py-4 text-sm font-semibold text-[var(--ink-secondary)] transition-all hover:border-[var(--border-strong)] hover:text-[var(--ink-primary)] sm:w-auto"
              >
                <SlidersHorizontal className="h-4 w-4 text-[var(--accent-indigo)]" />
                <span>Xem trải nghiệm mẫu</span>
              </a>
            </div>

            {/* Clean Micro Spec Bar (No Clutter, Authentic Pipeline) */}
            <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-[var(--border-hairline)] pt-5 text-xs text-[var(--ink-tertiary)]">
              <span className="font-semibold text-[var(--ink-primary)]">Luồng xử lý:</span>
              <span className="rounded-md border border-[var(--border-hairline)] bg-[var(--surface-stage)] px-2 py-0.5 font-medium">
                Brief 4 trường
              </span>
              <span>→</span>
              <span className="rounded-md border border-[var(--border-hairline)] bg-[var(--surface-stage)] px-2 py-0.5 font-medium text-[var(--accent-indigo)]">
                3 Góc phân giải tâm lý
              </span>
              <span>→</span>
              <span className="rounded-md border border-[var(--border-hairline)] bg-[var(--surface-stage)] px-2 py-0.5 font-medium text-[var(--accent-emerald)]">
                Khuyến nghị Hook Newsfeed
              </span>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: PRODUCT TRANSFORMATION THEATRE ================= */}
          <div className="relative flex w-full flex-col items-center justify-center lg:col-span-6 xl:col-span-6">
            {/* The 3-Layer Z-Axis Stage */}
            <div className="stage-perspective relative w-full max-w-[500px]">
              {/* TẦNG 1: THE INPUT BRIEF CAPSULE (Bản tóm tắt đầu vào) */}
              <div className="mb-4 flex items-center justify-between rounded-2xl border border-[var(--border-hairline)] bg-[var(--surface-raised)]/90 px-4 py-2.5 text-xs backdrop-blur-md shadow-sm">
                <div className="flex items-center gap-2 truncate">
                  <span className="font-bold text-[var(--ink-tertiary)] uppercase tracking-wider text-[10px]">
                    Brief đầu vào:
                  </span>
                  <span className="truncate font-semibold text-[var(--ink-primary)]">
                    {SAMPLE_BRIEF.name}
                  </span>
                </div>
                <span className="shrink-0 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-[var(--accent-indigo)]">
                  {SAMPLE_BRIEF.tone}
                </span>
              </div>

              {/* TẦNG 2: 3-TACTILE ANGLE SELECTOR PILLS */}
              <div className="mb-4 flex shrink-0 items-center gap-1.5 rounded-2xl border border-[var(--border-hairline)] bg-[var(--surface-stage)] p-1.5 shadow-xs">
                {TRANSFORMATION_ANGLES.map((angle, idx) => {
                  const isActive = activeAngleIndex === idx;
                  return (
                    <button
                      key={angle.id}
                      type="button"
                      onClick={() => setActiveAngleIndex(idx)}
                      className={`flex-1 rounded-xl py-2 px-2 text-center text-xs font-semibold transition-all duration-200 cursor-pointer ${
                        isActive
                          ? "bg-[var(--surface-raised)] text-[var(--accent-indigo)] shadow-sm ring-1 ring-black/5 dark:ring-white/10"
                          : "text-[var(--ink-tertiary)] hover:text-[var(--ink-primary)]"
                      }`}
                    >
                      <span className="block font-bold">{angle.num}. {angle.tag}</span>
                      <span className="block text-[10px] opacity-80 truncate">{angle.name.split("&")[0]}</span>
                    </button>
                  );
                })}
              </div>

              {/* TẦNG 3: THE ACTIVE MASTERPIECE CARD (Centerpiece với Spotlight quang học từ React Bits) */}
              <div className="stage-layer-active relative">
                <SpotlightCard className="p-5 sm:p-6 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)]">
                  <BorderBeam
                    duration={8}
                    colorFrom="var(--brand)"
                    colorTo="var(--pas)"
                    className="rounded-3xl p-[1.5px] [mask:linear-gradient(#000,#000)_content-box,linear-gradient(#000,#000)] [mask-composite:exclude] [-webkit-mask-composite:xor]"
                  />
                  {/* Card Header */}
                  <div className="flex items-center justify-between gap-3 border-b border-[var(--border-hairline)] pb-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[var(--accent-indigo)] to-indigo-800 text-xs font-bold text-white shadow-sm">
                        CS
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-[var(--ink-primary)]">
                            Content Studio
                          </span>
                          <CheckCircle2 className="h-3.5 w-3.5 fill-blue-500 text-white" />
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-[var(--ink-tertiary)]">
                          <span>Vừa xong</span>
                          <span>·</span>
                          <Globe className="h-3 w-3" />
                          <span>·</span>
                          <span className="text-[var(--ink-secondary)]">{activeAngle.psychology}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${activeAngle.badgeBg}`}>
                      {activeAngle.tag}
                    </span>
                  </div>

                  {/* Hook Focus (125 ký tự được tách bạch quang học) */}
                  <div className="mt-4 space-y-2.5 text-[13.5px] leading-relaxed">
                    <div className="rounded-xl border border-[var(--border-hairline)] bg-[var(--surface-raised)]/60 p-3">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-[var(--accent-emerald)] mb-1">
                        <span className="flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Hook đầu trang ({activeAngle.hook.length} ký tự)
                        </span>
                        <span className="text-[var(--ink-tertiary)] font-normal">Hiển thị trước &quot;Xem thêm&quot;</span>
                      </div>
                      <p className="font-bold text-[var(--ink-primary)] leading-snug">
                        {activeAngle.hook}
                        <span className="ml-1 font-normal text-[var(--accent-indigo)] cursor-pointer hover:underline">
                          … Xem thêm
                        </span>
                      </p>
                    </div>

                    <p className="text-[var(--ink-secondary)] text-[13px] px-1">
                      {activeAngle.body}
                    </p>

                    <p className="text-xs font-semibold text-[var(--accent-indigo)] px-1">
                      {activeAngle.hashtags}
                    </p>
                  </div>

                  {/* Real-world Conversion Gauge & Quick Actions */}
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-hairline)] pt-4">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        FB: {activeAngle.hook.length} ký tự (~125 khuyến nghị preview)
                      </span>
                      <span className="rounded-full border border-[var(--border-hairline)] bg-[var(--surface-raised)] px-2.5 py-1 text-[11px] font-medium text-[var(--ink-secondary)]">
                        IG: 2.200 (giới hạn)
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCopy}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--surface-raised)] px-3 py-1.5 text-xs font-semibold text-[var(--ink-primary)] transition-all hover:border-[var(--border-strong)] cursor-pointer"
                      >
                        {copiedPost ? (
                          <Check className="h-3.5 w-3.5 text-emerald-500 animate-bounce" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                        <span>{copiedPost ? "Đã copy!" : "Sao chép góc bài"}</span>
                      </button>

                      <Link
                        href="/workspace"
                        className="inline-flex items-center gap-1 rounded-xl bg-[var(--accent-indigo)] px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition-opacity hover:opacity-90"
                      >
                        <span>Mở Editor</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </SpotlightCard>
              </div>

              {/* TẦNG 4: THE INACTIVE STACKED CARDS (Lớp chiều sâu Z-axis phía sau) */}
              {otherAngles.map((angle, index) => (
                <div
                  key={angle.id}
                  onClick={() => {
                    const originalIdx = TRANSFORMATION_ANGLES.findIndex((a) => a.id === angle.id);
                    if (originalIdx !== -1) setActiveAngleIndex(originalIdx);
                  }}
                  className={`absolute inset-0 cursor-pointer ${
                    index === 0 ? "stage-layer-stacked-1" : "stage-layer-stacked-2"
                  }`}
                >
                  <div className="h-full w-full rounded-3xl border border-[var(--border-hairline)] bg-[var(--surface-stage)] p-5 shadow-lg">
                    <div className="flex items-center justify-between border-b border-[var(--border-hairline)] pb-2 opacity-70">
                      <span className="text-xs font-bold text-[var(--ink-primary)]">
                        {angle.num}. {angle.name}
                      </span>
                      <span className="text-[10px] font-semibold text-[var(--ink-tertiary)]">
                        Bấm để hoán đổi
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
