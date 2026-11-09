"use client";

import { Sparkles, ArrowUpRight } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { NumberTicker } from "@/components/ui/NumberTicker";

interface VelocityCase {
  segment: string;
  operator: string;
  before: string;
  after: string;
  delta: string;
  deltaNote: string;
  outcome: string;
}

const CASES: VelocityCase[] = [
  {
    segment: "Founder D2C Thời Trang",
    operator: "Lụa Mây · Hà Nội",
    before: "40 phút vật lộn viết một bài",
    after: "0.5s tạo 3 góc PAS / AIDA / FAB",
    delta: "18h",
    deltaNote: "tiết kiệm mỗi tháng",
    outcome:
      "Giữ nhịp đăng 2 bài/ngày chuẩn 125 ký tự Hook mà không phải thuê copywriter ngoài.",
  },
  {
    segment: "Chuỗi F&B Đa Chi Nhánh",
    operator: "7 Chi Nhánh · TP.HCM",
    before: "7 tài khoản viết bài rời rạc",
    after: "1 người quản lý · 3 tông giọng độc lập",
    delta: "7→1",
    deltaNote: "đầu mối nội dung",
    outcome:
      "Bản sắc thương hiệu từng chi nhánh được giữ nguyên, không còn loãng giọng hay trùng lặp.",
  },
  {
    segment: "Solopreneur Bán Lẻ",
    operator: "HomeGenZ · Đà Nẵng",
    before: "Viết bài rải rác cả tuần",
    after: "20 phút buổi tối đủ nội dung cả tuần",
    delta: "100%",
    deltaNote: "thời gian dồn cho chốt đơn",
    outcome:
      "Buổi tối dành trọn cho đóng gói và chăm sóc khách hàng, không còn thức khuya nghĩ caption.",
  },
];

export default function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="relative scroll-mt-20 py-24 sm:py-32 lg:py-40 border-t border-white/[0.08] overflow-hidden"
    >
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/3 -z-10 h-[500px] w-[800px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,212,146,0.10),transparent_70%)] blur-[80px]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" duration={600}>
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/35 bg-[#0A0D15]/80 px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 backdrop-blur-xl shadow-[0_0_20px_rgba(0,212,146,0.25)]">
              <Sparkles className="h-3 w-3" />
              HIỆU QUẢ THỰC CHIẾN // BENCHMARKS
            </span>
            <h2 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight">
              Đo lường sự bứt phá trong quy trình sáng tạo.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-300 sm:text-lg">
              Ba pipeline thực chiến từ các shop online thật, đo bằng số giờ làm việc tiết kiệm được và doanh thu chuyển đổi Facebook Ads.
            </p>
          </div>
        </ScrollReveal>

        {/* ================= APPLE-GRADE TELEMETRY KPI MODULES ================= */}
        <div className="mt-14 grid grid-cols-2 gap-3.5 sm:grid-cols-4 lg:gap-5">
          <div className="rounded-[1.75rem] border border-white/[0.12] bg-[#0A0D15]/80 p-5 sm:p-6 backdrop-blur-2xl shadow-[0_15px_35px_-10px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)]">
            <div className="flex items-center justify-between text-emerald-400 mb-3">
              <span className="font-mono text-[10px] uppercase font-bold tracking-widest">[EFFICIENCY]</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="font-mono text-3xl sm:text-4xl font-black text-white">
              <NumberTicker value={18} suffix="h" />
            </p>
            <p className="mt-2 text-xs text-slate-300 font-medium">Tiết kiệm mỗi tháng / shop</p>
          </div>

          <div className="rounded-[1.75rem] border border-white/[0.12] bg-[#0A0D15]/80 p-5 sm:p-6 backdrop-blur-2xl shadow-[0_15px_35px_-10px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)]">
            <div className="flex items-center justify-between text-sky-400 mb-3">
              <span className="font-mono text-[10px] uppercase font-bold tracking-widest">[CONVERSION]</span>
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" />
            </div>
            <p className="font-mono text-3xl sm:text-4xl font-black text-white">
              <NumberTicker value={42} prefix="+" suffix="%" />
            </p>
            <p className="mt-2 text-xs text-slate-300 font-medium">CTR Facebook Ads</p>
          </div>

          <div className="rounded-[1.75rem] border border-white/[0.12] bg-[#0A0D15]/80 p-5 sm:p-6 backdrop-blur-2xl shadow-[0_15px_35px_-10px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)]">
            <div className="flex items-center justify-between text-purple-400 mb-3">
              <span className="font-mono text-[10px] uppercase font-bold tracking-widest">[CONSOLIDATION]</span>
              <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse" />
            </div>
            <p className="font-mono text-3xl sm:text-4xl font-black text-white">
              7 → 1
            </p>
            <p className="mt-2 text-xs text-slate-300 font-medium">Đầu mối vận hành nội dung</p>
          </div>

          <div className="rounded-[1.75rem] border border-white/[0.12] bg-[#0A0D15]/80 p-5 sm:p-6 backdrop-blur-2xl shadow-[0_15px_35px_-10px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)]">
            <div className="flex items-center justify-between text-emerald-400 mb-3">
              <span className="font-mono text-[10px] uppercase font-bold tracking-widest">[ANTI-SLOP]</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="font-mono text-3xl sm:text-4xl font-black text-emerald-400">
              100%
            </p>
            <p className="mt-2 text-xs text-slate-300 font-medium">Khử sạch AI-slop sáo rỗng</p>
          </div>
        </div>

        {/* ================= ASYMMETRIC BENTO CLIENT PROOF ================= */}
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {CASES.map((item, index) => (
            <ScrollReveal
              key={item.segment}
              direction="up"
              delay={index * 110}
              duration={650}
              className="h-full"
            >
              <SpotlightCard
                spotlightColor="rgba(0, 212, 146, 0.22)"
                className="h-full rounded-[2.25rem] border border-white/[0.12] bg-[#0A0D15]/85 p-7 backdrop-blur-2xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.65),inset_0_1px_1px_rgba(255,255,255,0.18)] flex flex-col justify-between hover:border-emerald-500/50 transition-all duration-300"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 border-b border-white/[0.08] pb-4">
                    <div className="min-w-0">
                      <h3 className="text-base font-bold text-white">
                        {item.segment}
                      </h3>
                      <p className="mt-1 truncate font-mono text-[11px] text-slate-400 uppercase tracking-wider">
                        {item.operator}
                      </p>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/35 bg-emerald-500/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      VERIFIED
                    </span>
                  </div>

                  <dl className="mt-5 space-y-2.5 border-b border-white/[0.08] pb-5 font-mono text-xs">
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className="text-slate-400 uppercase tracking-wider text-[10px]">
                        Trước:
                      </dt>
                      <dd className="text-right text-slate-400 line-through">
                        {item.before}
                      </dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className="text-emerald-400 uppercase tracking-wider text-[10px] font-bold">
                        Sau:
                      </dt>
                      <dd className="text-right font-bold text-white">
                        {item.after}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-5 flex items-baseline gap-2">
                    <span className="font-mono text-4xl font-black leading-none tabular-nums text-emerald-400">
                      {item.delta}
                    </span>
                    <span className="font-mono text-xs uppercase tracking-wider text-slate-400 font-semibold">
                      {item.deltaNote}
                    </span>
                  </div>
                </div>

                <p className="mt-5 text-xs sm:text-[13px] leading-relaxed text-slate-300 italic">
                  &quot;{item.outcome}&quot;
                </p>
              </SpotlightCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
