"use client";

import { useRef, useState } from "react";
import { ArrowRight, Check, X, Sparkles, Cpu, Target, ShoppingBag, Zap, Layers3 } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { AnimatedBeam } from "@/components/ui/AnimatedBeam";

interface AngleDetail {
  id: "pas" | "lifestyle" | "fab";
  num: string;
  tag: string;
  tagColor: string;
  badgeBg: string;
  title: string;
  formula: string;
  bestFor: string;
  keyBenefit: string;
  aiSlopExample: string;
  studioExampleHook: string;
  studioExampleBody: string;
}

const ANGLES_DATA: AngleDetail[] = [
  {
    id: "pas",
    num: "01",
    tag: "PAS",
    tagColor: "text-rose-400",
    badgeBg: "border-rose-500/30 bg-rose-500/10 text-rose-300",
    title: "Vấn đề & Giải pháp (PAS)",
    formula: "Problem (Nỗi đau) → Agitate (Khoét sâu) → Solve (Giải pháp)",
    bestFor: "Khách hàng đang chịu đựng sản phẩm kém chất lượng trên thị trường",
    keyBenefit: "Tỷ lệ nhấp (CTR) cao nhất do chạm đúng cảm xúc ức chế",
    aiSlopExample:
      "Chào các bạn yêu, hôm nay shop xin giới thiệu siêu phẩm áo sơ mi lụa tơ tằm đỉnh chóp giá hạt dẻ không thể bỏ lỡ!",
    studioExampleHook:
      "Chiếc sơ mi 800k mua tuần trước đã nhăn nhúm sau 2 lần giặt, làm hỏng cả buổi họp quan trọng của bạn?",
    studioExampleBody:
      "Lụa tơ tằm Bảo Lộc dệt tay mật độ 16 momme giữ phom thẳng mượt tự nhiên suốt 10 tiếng công sở. Mát hơn cotton 2–3°C, không tích điện và không bao giờ xù lông.",
  },
  {
    id: "lifestyle",
    num: "02",
    tag: "AIDA",
    tagColor: "text-sky-400",
    badgeBg: "border-sky-500/30 bg-sky-500/10 text-sky-300",
    title: "Cảm xúc & Phong cách (AIDA)",
    formula: "Attention (Chú ý) → Interest (Thích thú) → Desire (Khao khát) → Action (Hành động)",
    bestFor: "Thời trang, mỹ phẩm, trang sức, phong cách sống quiet luxury",
    keyBenefit: "Tăng giá trị cảm nhận (perceived value) và lòng tự hào sở hữu",
    aiSlopExample:
      "Chiếc áo sơ mi tuyệt đẹp này sẽ khiến bạn tỏa sáng rạng ngời như một nàng công chúa lộng lẫy!",
    studioExampleHook:
      "Không cần logo phô trương, sự đắt giá của một quý cô công sở nằm ở ánh bóng mờ dịu mắt của tơ tằm dệt thủ công.",
    studioExampleBody:
      "Mỗi sáng thứ Hai khoác lên mình chiếc áo lụa Bảo Lộc nhẹ như mây, bạn bước vào phòng họp với thần thái tĩnh lặng và đẳng cấp không thể trộn lẫn.",
  },
  {
    id: "fab",
    num: "03",
    tag: "FAB",
    tagColor: "text-emerald-400",
    badgeBg: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    title: "Thông số & Chế tác (FAB)",
    formula: "Features (Đặc điểm) → Advantages (Lợi thế) → Benefits (Lợi ích thực tế)",
    bestFor: "Khách hàng duy lý, kỹ tính, thích so sánh chất liệu và công năng",
    keyBenefit: "Tỷ lệ hoàn hàng thấp nhất nhờ khách hiểu rõ sản phẩm trước khi mua",
    aiSlopExample:
      "Áo được làm từ chất liệu cao cấp nhất xịn xò bảo đảm 100% uy tín số 1 Việt Nam nha cả nhà!",
    studioExampleHook:
      "36 giờ dệt thủ công từ 100% kén tơ tằm Bảo Lộc và đường may giấu chỉ chuẩn may đo cao cấp (Haute Couture).",
    studioExampleBody:
      "Mật độ 16 momme cho độ bền gấp 3 lần lụa công nghiệp. Cúc vỏ trai khảm xà cừ tự nhiên tạo nên tổng thể hoàn hảo cho mọi trang phục thanh lịch.",
  },
];

export default function ThreeAnglesFramework() {
  const [selectedAngleId, setSelectedAngleId] = useState<"pas" | "lifestyle" | "fab">("pas");

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const pasRef = useRef<HTMLButtonElement>(null);
  const aidaRef = useRef<HTMLButtonElement>(null);
  const fabRef = useRef<HTMLButtonElement>(null);

  const currentAngle = ANGLES_DATA.find((a) => a.id === selectedAngleId) ?? ANGLES_DATA[0]!;

  return (
    <section
      id="framework"
      className="relative scroll-mt-20 py-24 sm:py-32 lg:py-40 border-t border-white/[0.08] overflow-hidden"
    >
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,212,146,0.12),rgba(56,189,248,0.06),transparent_70%)] blur-[90px]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" duration={600}>
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/35 bg-[#0A0D15]/80 px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 backdrop-blur-xl shadow-[0_0_20px_rgba(0,212,146,0.25)]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              TRIẾT LÝ COPYWRITING 3 GÓC TIẾP CẬN
            </span>
            <h2 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight">
              1 Đề Bài Sản Phẩm → 3 Kịch Bản Chốt Đơn Độc Bản
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Người mua hàng không có cùng một động cơ. Content Studio phân giải sản phẩm của bạn
              thành 3 góc độ tâm lý độc lập để tiếp cận trọn vẹn tệp khách hàng tiềm năng.
            </p>
          </div>
        </ScrollReveal>

        {/* ================= ANIMATED BEAM SYNTHESIS PIPELINE ================= */}
        <div className="mt-14 overflow-hidden rounded-[2.25rem] border border-white/[0.14] bg-[#0A0D15]/85 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.18)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-4 font-mono text-xs text-slate-400">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>PIPELINE: SYNTHESIZER 1-INTO-3</span>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span>GIAO THỨC: PAS · AIDA · FAB</span>
              <span>·</span>
              <span className="text-emerald-400">ĐỘ TRỄ: 0ms GPU</span>
            </div>
          </div>

          <div
            ref={containerRef}
            className="relative mt-8 flex flex-col md:flex-row items-center justify-between gap-8 py-6"
          >
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={inputRef}
              toRef={pasRef}
              duration={3}
              curvature={-40}
              gradientStartColor="#00D492"
              gradientStopColor="#FB7185"
            />
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={inputRef}
              toRef={aidaRef}
              duration={3}
              delay={0.6}
              curvature={0}
              gradientStartColor="#00D492"
              gradientStopColor="#38BDF8"
            />
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={inputRef}
              toRef={fabRef}
              duration={3}
              delay={1.2}
              curvature={40}
              gradientStartColor="#00D492"
              gradientStopColor="#10B981"
            />

            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8 relative z-10 w-full">
              {/* Input Node: Raw Brief (High-Craft Hardware Glass Card) */}
              <div
                ref={inputRef}
                className="w-full lg:w-[280px] shrink-0 rounded-2xl border border-emerald-500/30 bg-[#0E121B]/95 p-5 shadow-2xl shadow-emerald-500/10 backdrop-blur-2xl transition-all"
              >
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-mono text-[11px] font-black">
                      IN
                    </span>
                    <div>
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                        TÍN HIỆU ĐẦU VÀO
                      </span>
                      <span className="text-[11.5px] font-bold text-white block">
                        1 Brief Sản Phẩm Thô
                      </span>
                    </div>
                  </div>
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                </div>

                <div className="space-y-2 text-[11px]">
                  <div className="flex items-center gap-2 rounded-lg bg-white/[0.03] border border-white/[0.06] p-2 text-slate-300">
                    <ShoppingBag className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate font-medium text-white">Sơ mi lụa tơ tằm Bảo Lộc</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-white/[0.03] border border-white/[0.06] p-2 text-slate-300">
                    <Target className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                    <span className="truncate">Nữ công sở 28–45 · Quiet Luxury</span>
                  </div>
                  <div className="flex items-center justify-between gap-1 text-[10px] font-mono text-slate-400 pt-1 px-1">
                    <span>⚡ 4 RÀNG BUỘC CHUẨN</span>
                    <span className="text-emerald-400 font-bold">125 CHARS READY</span>
                  </div>
                </div>
              </div>

              {/* Center Engine Core: Neural Synthesizer */}
              <div className="flex flex-col items-center gap-2 text-center my-2 lg:my-0">
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400/20 via-teal-500/15 to-transparent border border-emerald-500/50 shadow-[0_0_35px_rgba(0,212,146,0.35)] backdrop-blur-2xl">
                  <Cpu className="h-6 w-6 text-emerald-400 animate-pulse" />
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="rounded-full bg-gradient-to-r from-emerald-500/20 via-teal-500/15 to-emerald-500/20 border border-emerald-500/40 px-3.5 py-1 font-mono text-[11px] font-extrabold text-emerald-300 shadow-[0_0_20px_rgba(0,212,146,0.25)] backdrop-blur-xl">
                    [PHÂN GIẢI 3 LUỒNG TÂM LÝ] ⚡
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 font-medium">
                    100% Anti-AI-Slop Purified · Zero Hallucination
                  </span>
                </div>
              </div>

              {/* Output Nodes: 3 Psychological Angles */}
              <div className="flex flex-col gap-2.5 w-full lg:w-[320px] shrink-0">
                <button
                  ref={pasRef}
                  type="button"
                  onClick={() => setSelectedAngleId("pas")}
                  className={`group relative flex items-center justify-between rounded-xl border p-3 text-left transition-all duration-200 cursor-pointer active:scale-[0.98] ${
                    selectedAngleId === "pas"
                      ? "border-rose-500/80 bg-rose-500/20 shadow-[0_0_25px_rgba(244,63,94,0.35)] ring-1 ring-rose-500/50 backdrop-blur-2xl"
                      : "border-white/[0.10] bg-[#0E121B]/85 hover:border-rose-500/40 hover:bg-[#121622] backdrop-blur-xl"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-rose-500/20 border border-rose-500/40 font-mono text-[10px] font-black text-rose-400">
                      01
                    </span>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-white block truncate">
                        PAS · Nỗi đau &amp; Lối thoát
                      </span>
                      <span className="text-[10px] text-slate-400 block font-mono truncate">
                        Vấn đề → Khoét sâu → Giải pháp
                      </span>
                    </div>
                  </div>
                  <span className="shrink-0 text-[9.5px] font-mono text-rose-300 uppercase font-bold px-2 py-0.5 rounded-full border border-rose-500/40 bg-rose-500/15">
                    125 chars
                  </span>
                </button>

                <button
                  ref={aidaRef}
                  type="button"
                  onClick={() => setSelectedAngleId("lifestyle")}
                  className={`group relative flex items-center justify-between rounded-xl border p-3 text-left transition-all duration-200 cursor-pointer active:scale-[0.98] ${
                    selectedAngleId === "lifestyle"
                      ? "border-sky-500/80 bg-sky-500/20 shadow-[0_0_25px_rgba(56,189,248,0.35)] ring-1 ring-sky-500/50 backdrop-blur-2xl"
                      : "border-white/[0.10] bg-[#0E121B]/85 hover:border-sky-500/40 hover:bg-[#121622] backdrop-blur-xl"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-sky-500/20 border border-sky-500/40 font-mono text-[10px] font-black text-sky-400">
                      02
                    </span>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-white block truncate">
                        AIDA · Cảm xúc &amp; Bản sắc
                      </span>
                      <span className="text-[10px] text-slate-400 block font-mono truncate">
                        Chú ý → Khao khát → Chuyển đổi
                      </span>
                    </div>
                  </div>
                  <span className="shrink-0 text-[9.5px] font-mono text-sky-300 uppercase font-bold px-2 py-0.5 rounded-full border border-sky-500/40 bg-sky-500/15">
                    125 chars
                  </span>
                </button>

                <button
                  ref={fabRef}
                  type="button"
                  onClick={() => setSelectedAngleId("fab")}
                  className={`group relative flex items-center justify-between rounded-xl border p-3 text-left transition-all duration-200 cursor-pointer active:scale-[0.98] ${
                    selectedAngleId === "fab"
                      ? "border-emerald-500/80 bg-emerald-500/20 shadow-[0_0_25px_rgba(0,212,146,0.35)] ring-1 ring-emerald-500/50 backdrop-blur-2xl"
                      : "border-white/[0.10] bg-[#0E121B]/85 hover:border-emerald-500/40 hover:bg-[#121622] backdrop-blur-xl"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-emerald-500/20 border border-emerald-500/40 font-mono text-[10px] font-black text-emerald-400">
                      03
                    </span>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-white block truncate">
                        FAB · Thông số &amp; Chế tác
                      </span>
                      <span className="text-[10px] text-slate-400 block font-mono truncate">
                        Đặc tính → Lợi thế → Giá trị
                      </span>
                    </div>
                  </div>
                  <span className="shrink-0 text-[9.5px] font-mono text-emerald-300 uppercase font-bold px-2 py-0.5 rounded-full border border-emerald-500/40 bg-emerald-500/15">
                    125 chars
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ================= INTERACTIVE ANATOMY STAGE ================= */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          {/* Left Column: Double-Bezel Hardware Comparison (7 cols) */}
          <div className="lg:col-span-7">
            <div className="rounded-[2.25rem] p-2 bg-gradient-to-b from-white/[0.18] via-white/[0.05] to-transparent border border-white/[0.15] shadow-[0_24px_70px_-20px_rgba(0,0,0,0.6)] backdrop-blur-3xl">
              <div className="rounded-[calc(2.25rem-0.5rem)] border border-white/[0.08] bg-[#0A0D15]/95 p-6 sm:p-8 backdrop-blur-2xl">
                {/* Header with Active Angle Badge & Formula */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
                  <div className="flex items-center gap-2.5">
                    <span className={`text-base font-black tracking-wider ${currentAngle.tagColor}`}>
                      [{currentAngle.num}]
                    </span>
                    <span className={`rounded-full border px-3 py-0.5 text-xs font-bold uppercase tracking-wider ${currentAngle.badgeBg}`}>
                      {currentAngle.tag}
                    </span>
                  </div>
                  <span className="font-mono text-xs font-semibold text-emerald-400">
                    Phân tích tâm lý chuyển đổi
                  </span>
                </div>

                <div className="mt-4">
                  <h3 className="text-xl font-bold text-white">
                    {currentAngle.title}
                  </h3>
                  <div className="mt-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-xs text-slate-300 leading-relaxed font-mono">
                    <strong className="text-white">Công thức: </strong>
                    {currentAngle.formula}
                  </div>
                </div>

                {/* Side-by-side: Before (AI Slop) vs After (Content Studio) */}
                <div className="mt-6 space-y-4">
                  {/* ❌ Generic AI Slop */}
                  <div className="rounded-2xl border border-rose-500/25 bg-rose-500/[0.06] p-4 text-xs backdrop-blur-xl">
                    <div className="flex items-center gap-2 text-rose-400 font-bold mb-2 font-mono uppercase tracking-wider text-[11px]">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500/20 text-[10px]">
                        <X className="h-3 w-3" />
                      </span>
                      <span>Văn mẫu AI sáo rỗng (Thừa thãi &amp; Khách lướt qua ngay)</span>
                    </div>
                    <p className="line-through text-slate-400 italic leading-relaxed">
                      &quot;{currentAngle.aiSlopExample}&quot;
                    </p>
                  </div>

                  {/* ✅ Content Studio Custom Craft */}
                  <div className="relative rounded-2xl border border-emerald-500/40 bg-emerald-500/[0.08] p-5 text-[13px] backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
                    <div className="flex items-center justify-between gap-2 text-emerald-400 font-bold mb-2.5">
                      <div className="flex items-center gap-2 font-mono uppercase tracking-wider text-[11px]">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-[10px]">
                          <Check className="h-3 w-3 text-emerald-400" />
                        </span>
                        <span>Content Studio — Chuẩn 125 ký tự Hook vàng</span>
                      </div>
                      <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10.5px] font-bold text-emerald-400 uppercase tracking-wide font-mono">
                        CTR +42%
                      </span>
                    </div>
                    <p className="font-bold text-white leading-snug">
                      {currentAngle.studioExampleHook}
                    </p>
                    <p className="mt-2 text-slate-300 leading-relaxed">
                      {currentAngle.studioExampleBody}
                    </p>
                  </div>
                </div>

                {/* Audience Fit & Key Benefit */}
                <div className="mt-6 border-t border-white/[0.08] pt-4 text-xs text-slate-300 flex flex-col gap-2 font-mono">
                  <div>
                    <strong className="text-white">🎯 Phù hợp nhất cho: </strong>
                    {currentAngle.bestFor}
                  </div>
                  <div>
                    <strong className="text-white">⚡ Hiệu quả chuyển đổi: </strong>
                    {currentAngle.keyBenefit}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 3 Interactive Angle Selector Cards (5 cols) */}
          <div className="flex flex-col gap-3.5 lg:col-span-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1 font-mono">
              Bấm để xem phân tích từng góc bài:
            </span>

            {ANGLES_DATA.map((angle) => {
              const isSelected = angle.id === selectedAngleId;
              return (
                <button
                  key={angle.id}
                  type="button"
                  onClick={() => setSelectedAngleId(angle.id)}
                  className={`group relative flex flex-col text-left rounded-2xl border p-5 transition-all duration-200 cursor-pointer active:scale-[0.98] ${
                    isSelected
                      ? `bg-white/[0.06] border-emerald-500/50 shadow-[0_0_25px_rgba(0,212,146,0.2),inset_0_1px_1px_rgba(255,255,255,0.18)] backdrop-blur-2xl ring-1 ring-emerald-500/30`
                      : "border-white/[0.10] bg-white/[0.03] backdrop-blur-xl hover:border-white/20 hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-black ${angle.tagColor}`}>
                        [{angle.num}]
                      </span>
                      <span className="font-bold text-sm text-white">
                        {angle.title.split("(")[0]}
                      </span>
                    </div>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wider ${angle.badgeBg}`}
                    >
                      {angle.tag}
                    </span>
                  </div>

                  <p className="mt-2.5 text-xs text-slate-300 leading-relaxed">
                    {angle.formula}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-[11px] font-semibold">
                    <span
                      className={
                        isSelected
                          ? "text-emerald-400 font-bold"
                          : "text-slate-400"
                      }
                    >
                      {isSelected ? "Đang chọn hiển thị" : "Bấm để xem mẫu bài"}
                    </span>
                    <ArrowRight
                      className={`h-3.5 w-3.5 transition-transform ${
                        isSelected
                          ? "translate-x-1 text-emerald-400"
                          : "text-slate-500 group-hover:translate-x-0.5"
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
