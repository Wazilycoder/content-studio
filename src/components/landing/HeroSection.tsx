"use client";

import { useState } from "react";
import Link from "next/link";
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
  hookLength: number;
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
    hook: "85% người bán hàng online bỏ cuộc sau 3 tháng đầu vì vẫn copy cùng một kiểu văn mẫu AI sáo rỗng khiến khách lướt qua trong 0.5 giây",
    hookLength: 122,
    body: "Họ vô tình đăng đúng câu 'Chào mừng quý khách...' hay 'Sản phẩm siêu hot...' mà ai cũng đã đọc hàng trăm lần. Cách duy nhất phá vỡ vòng lặp: tiếp cận trực diện nỗi đau thực tế của khách, rồi biến giải pháp thành lý do họ phải chốt đơn ngay hôm nay.",
    hashtags: "#ContentMarketing #AntiAISlop #BanHangOnline",
    psychology: "Đồng cảm nỗi đau → Xóa tan hoài nghi → Kích hoạt hành động",
  },
  {
    id: "lifestyle",
    num: "02",
    tag: "AIDA",
    name: "Cảm xúc & Phong cách",
    badgeBg: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
    tagColor: "text-pink-500",
    hook: "Từ ngày đổi sang phong cách viết này, khách tự nhắn hỏi mua không cần chèo kéo — đơn về đều đặn mỗi ngày mà không tốn thêm chi phí quảng cáo",
    hookLength: 124,
    body: "Không đao to búa lớn. Không kêu gọi gượng ép. Chỉ kể lại câu chuyện chân thực khi khách hàng bước vào cuộc sống mới cùng sản phẩm — để mỗi câu từ là một bức tranh cảm xúc khiến họ nhìn thấy chính mình hạnh phúc và tự tin hơn mỗi ngày.",
    hashtags: "#PhongCachSong #Storytelling #ChamVaoCamXuc",
    psychology: "Bản ngã khát khao → Viễn cảnh hạnh phúc → Tự hào sở hữu",
  },
  {
    id: "fab",
    num: "03",
    tag: "FAB",
    name: "Tính năng & Giá trị",
    badgeBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    tagColor: "text-emerald-500",
    hook: "Trực diện 3 nâng cấp công nghệ giúp bạn tiết kiệm 3 giờ viết bài mỗi ngày: chuẩn hóa 125 ký tự đầu, tự động phân giải 3 góc bài, 100% không trùng lặp",
    hookLength: 123,
    body: "Bán hàng bằng giá trị cốt lõi và thông số thuyết phục: mỗi caption trả lời đúng những câu khách hay lăn tăn nhất, biến người xem vãng lai thành khách hàng trung thành dài hạn — không cần chiêu trò, không cần giảm giá sốc.",
    hashtags: "#ProTurbo #HieuQuaCao #TuDongHoa",
    psychology: "Bằng chứng vật lý → Lợi ích định lượng → Niềm tin tuyệt đối",
  },
];

export default function HeroSection({ user }: HeroSectionProps) {
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
              <span className="text-[var(--accent-indigo)]">Ba câu chuyện</span>
              <br />
              khiến khách muốn mua.
            </h1>

            {/* Subtitle */}
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--ink-secondary)] sm:text-[17px]">
              Chấm dứt lối viết văn mẫu vô cảm. Tự động chuyển dịch một bản brief thông số thô thành 3 góc bài độc bản:{" "}
              <strong className="text-[var(--ink-primary)] font-semibold">PAS (Nỗi đau)</strong>,{" "}
              <strong className="text-[var(--ink-primary)] font-semibold">Lifestyle (Cảm xúc)</strong>, và{" "}
              <strong className="text-[var(--ink-primary)] font-semibold">FAB (Giá trị thật)</strong> — bám chuẩn 125 ký tự Hook hiển thị trên Newsfeed.
            </p>

            {/* Call To Action Buttons (Island Button Architecture) */}
            <div className="mt-8 flex w-full flex-col items-stretch gap-4 sm:w-auto sm:flex-row sm:items-center">
              <Link
                href={primaryHref}
                className="island-btn group inline-flex w-full items-center justify-center gap-3 rounded-full bg-[var(--ink-primary)] px-7 py-4 text-sm font-semibold text-[var(--canvas)] shadow-md sm:w-auto cursor-pointer"
              >
                <span>Bắt đầu sáng tạo ngay</span>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--canvas)]/20 text-current transition-transform duration-200 group-hover:translate-x-1">
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>

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
              <span className="font-semibold text-[var(--ink-primary)]">Quy chuẩn Đề 2:</span>
              <span className="rounded-md border border-[var(--border-hairline)] bg-[var(--surface-stage)] px-2 py-0.5 font-medium">
                4 Trường đầu vào
              </span>
              <span>→</span>
              <span className="rounded-md border border-[var(--border-hairline)] bg-[var(--surface-stage)] px-2 py-0.5 font-medium text-[var(--accent-indigo)]">
                3 Góc phân giải tâm lý
              </span>
              <span>→</span>
              <span className="rounded-md border border-[var(--border-hairline)] bg-[var(--surface-stage)] px-2 py-0.5 font-medium text-[var(--accent-emerald)]">
                125 Ký tự Hook Newsfeed
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
                          Hook đầu trang ({activeAngle.hookLength}/125 ký tự tối ưu)
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
                        FB: {activeAngle.hookLength}/125 ký tự
                      </span>
                      <span className="rounded-full border border-[var(--border-hairline)] bg-[var(--surface-raised)] px-2.5 py-1 text-[11px] font-medium text-[var(--ink-secondary)]">
                        IG: 1.420/2.200
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
