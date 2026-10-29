"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  Copy,
  SlidersHorizontal,
} from "lucide-react";
import { getUserProfile } from "@/app/auth/actions";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
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
  accentVar: "--pas" | "--aida" | "--fab";
  glow: string;
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
    accentVar: "--pas",
    glow: "rgba(67, 85, 245, 0.16)",
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
    accentVar: "--aida",
    glow: "rgba(231, 110, 103, 0.16)",
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
    accentVar: "--fab",
    glow: "rgba(22, 132, 110, 0.16)",
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
    const fullText = `${activeAngle.hook}\n\n${activeAngle.body}\n\n${activeAngle.hashtags}`;
    try {
      await navigator.clipboard.writeText(fullText);
      setCopiedPost(true);
      window.setTimeout(() => setCopiedPost(false), 1600);
    } catch {
      setCopiedPost(false);
    }
  };

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
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-hairline)] bg-[var(--surface-stage)] px-3.5 py-1.5 text-[10.5px] font-semibold tracking-widest uppercase text-[var(--ink-secondary)] shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-indigo)]" />
              <span>Studio biên tập AI · Kiến tạo nội dung đa chiều</span>
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
              Một brief duy nhất, ba lớp kể chuyện tinh xảo:{" "}
              <strong className="font-semibold text-[var(--ink-primary)]">PAS</strong> đánh trúng nỗi đau,{" "}
              <strong className="font-semibold text-[var(--ink-primary)]">AIDA</strong> khơi gợi cảm xúc và{" "}
              <strong className="font-semibold text-[var(--ink-primary)]">FAB</strong> chứng minh giá trị thật.
            </p>

            {/* Call To Action Buttons (Island Button Architecture) */}
            <div className="mt-8 flex w-full flex-col items-stretch gap-4 sm:w-auto sm:flex-row sm:items-center">
              <ShimmerButton
                type="button"
                onClick={() => router.push(primaryHref)}
                  background="linear-gradient(180deg, #23262F 0%, #15171C 100%)"
                  className="group w-full border-white/15 px-7 py-4 text-sm font-semibold text-white sm:w-auto"
                >
                  <span>Bắt đầu sáng tạo ngay</span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-current transition-transform duration-200 group-hover:translate-x-1">
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
              {/* TẦNG 1: BRIEF BAR TỐI GIẢN */}
              <div className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl border border-[var(--border-hairline)] bg-[var(--surface-raised)]/70 px-3.5 py-2.5 text-[11.5px] backdrop-blur-md">
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--ink-tertiary)]">
                  Brief đầu vào
                </span>
                <span className="text-[var(--ink-tertiary)]">·</span>
                <span className="min-w-0 max-w-[220px] truncate font-medium text-[var(--ink-primary)]">
                  {SAMPLE_BRIEF.name}
                </span>
                <span className="text-[var(--ink-tertiary)]">·</span>
                <span className="font-medium text-[var(--ink-secondary)]">Tông {SAMPLE_BRIEF.tone}</span>
                <span className="text-[var(--ink-tertiary)]">·</span>
                <span className="font-medium text-[var(--ink-secondary)]">{SAMPLE_BRIEF.audience}</span>
              </div>

              {/* TẦNG 2: 3 GÓC BIÊN TẬP */}
              <div className="mb-3 grid shrink-0 grid-cols-3 gap-1.5 rounded-2xl border border-[var(--border-hairline)] bg-[var(--surface-raised)]/60 p-1.5">
                {TRANSFORMATION_ANGLES.map((angle, idx) => {
                  const isActive = activeAngleIndex === idx;
                  return (
                    <button
                      key={angle.id}
                      type="button"
                      onClick={() => setActiveAngleIndex(idx)}
                      aria-pressed={isActive}
                      className={`btn-tactile flex min-w-0 flex-col items-start gap-0.5 rounded-xl px-2.5 py-2 text-left transition-all duration-200 ${
                        isActive
                          ? "bg-[var(--surface-stage)] shadow-[0_1px_2px_rgba(0,0,0,0.06)] ring-1 ring-[var(--border-hairline)]"
                          : "hover:bg-[var(--surface-stage)]/60"
                      }`}
                    >
                      <span
                        className="flex items-center gap-1.5 text-[11px] font-bold tabular-nums"
                        style={{ color: isActive ? `var(${angle.accentVar})` : "var(--ink-tertiary)" }}
                      >
                        <span
                          className="h-1.5 w-1.5 rounded-full transition-opacity"
                          style={{
                            backgroundColor: `var(${angle.accentVar})`,
                            opacity: isActive ? 1 : 0.35,
                          }}
                        />
                        {angle.num}. {angle.tag}
                      </span>
                      <span
                        className={`w-full truncate text-[10.5px] font-medium ${
                          isActive ? "text-[var(--ink-primary)]" : "text-[var(--ink-tertiary)]"
                        }`}
                      >
                        {angle.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* TẦNG 3: EDITORIAL SHEET (Bản thảo biên tập đang mở) */}
              <div className="relative">
                <SpotlightCard
                  spotlightColor={activeAngle.glow}
                  className="rounded-[26px] border-[var(--border-hairline)] bg-[var(--surface-stage)] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)]"
                >
                  <div className="p-5 sm:p-6">
                  {/* Sheet Header */}
                  <div className="flex items-center justify-between gap-3 border-b border-[var(--border-hairline)] pb-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <span
                        className="h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: `var(${activeAngle.accentVar})` }}
                      />
                      <span className="truncate text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[var(--ink-secondary)]">
                        Editorial Sheet · {activeAngle.num} {activeAngle.tag}
                      </span>
                    </div>
                    <span className="shrink-0 rounded-full border border-[var(--border-hairline)] bg-[var(--surface-raised)] px-2.5 py-0.5 text-[10.5px] font-medium text-[var(--ink-secondary)]">
                      {activeAngle.name}
                    </span>
                  </div>

                  {/* Hook mở đầu */}
                  <div className="mt-4 rounded-xl border border-[var(--border-hairline)] bg-[var(--surface-raised)]/60 p-3.5">
                    <div className="mb-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-semibold uppercase tracking-[0.12em]">
                      <span
                        className="inline-flex items-center gap-1.5"
                        style={{ color: `var(${activeAngle.accentVar})` }}
                      >
                        <span
                          className="h-1 w-1 rounded-full"
                          style={{ backgroundColor: `var(${activeAngle.accentVar})` }}
                        />
                        Hook mở đầu
                      </span>
                      <span className="font-normal normal-case tracking-normal text-[var(--ink-tertiary)]">
                        ({activeAngle.hook.length} ký tự · khuyến nghị ~125 trước &quot;Xem thêm&quot;)
                      </span>
                    </div>
                    <p className="text-[13.5px] font-semibold leading-relaxed text-[var(--ink-primary)]">
                      {activeAngle.hook}
                    </p>
                  </div>

                  {/* Thân bài */}
                  <p className="mt-4 text-[13px] leading-[1.75] text-[var(--ink-secondary)]">
                    {activeAngle.body}
                  </p>

                  {/* Hashtag & chiến lược tâm lý */}
                  <div className="mt-4 space-y-2 border-t border-[var(--border-hairline)] pt-3.5">
                    <p
                      className="text-[11.5px] font-semibold"
                      style={{ color: `var(${activeAngle.accentVar})` }}
                    >
                      {activeAngle.hashtags}
                    </p>
                    <p className="flex items-start gap-1.5 text-[11px] leading-relaxed text-[var(--ink-tertiary)]">
                      <span className="mt-[6px] h-1 w-1 shrink-0 rounded-full bg-[var(--ink-tertiary)]" />
                      <span>
                        <span className="font-semibold text-[var(--ink-secondary)]">Chiến lược tâm lý: </span>
                        {activeAngle.psychology}
                      </span>
                    </p>
                  </div>

                      {/* Thanh điều khiển */}
                      <div className="mt-5 flex flex-col gap-2 border-t border-[var(--border-hairline)] pt-4 sm:flex-row sm:items-center sm:justify-between">
                        <button
                          type="button"
                          onClick={handleCopy}
                          className="btn-tactile inline-flex items-center justify-center gap-1.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--surface-raised)] px-3.5 py-2 text-[12px] font-semibold text-[var(--ink-primary)] transition-colors hover:border-[var(--border-strong)]"
                        >
                          {copiedPost ? (
                            <Check className="check-pop h-3.5 w-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                          <span>{copiedPost ? "Đã sao chép bản thảo" : "Sao chép bản thảo"}</span>
                        </button>

                        <Link
                          href="/workspace"
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2 text-[12px] font-semibold text-white shadow-xs transition-opacity hover:opacity-90"
                          style={{ backgroundColor: `var(${activeAngle.accentVar})` }}
                        >
                          <span>Mở Studio biên tập</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                      </div>
                    </SpotlightCard>
                  </div>

                      </div>
                    </div>
                  </div>
                </div>
              </section>
  );
}
