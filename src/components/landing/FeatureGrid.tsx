"use client";

import { useState, type ReactNode } from "react";
import { Check } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { BentoGrid } from "@/components/ui/BentoGrid";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

type ToneId = "haihuoc" | "trangtrong" | "tretrung";

interface TonePreset {
  id: ToneId;
  label: string;
  sample: string;
  tempo: string;
}

const TONES: TonePreset[] = [
  {
    id: "haihuoc",
    label: "Hài hước",
    tempo: "Nhịp nhanh · Châm biếm nhẹ",
    sample:
      "Sơ mi nhăn nhúm sau hai lần giặt là kiểu gì cũng phải mua chiếc thứ ba — lần này chọn lụa tơ tằm cho lành.",
  },
  {
    id: "trangtrong",
    label: "Trang trọng",
    tempo: "Nhịp đĩnh đạc · Tĩnh lặng",
    sample:
      "Sự chỉn chu không đến từ phô trương, mà từ chất liệu đủ tinh tế để người đối diện nhớ mãi.",
  },
  {
    id: "tretrung",
    label: "Trẻ trung",
    tempo: "Bắt trend · Năng động",
    sample:
      "Một chiếc sơ mi lụa là đủ slay từ phòng họp sáng tới cafe chiều, khỏi cần đổi đồ.",
  },
];

const BRIEF_FIELDS: { label: string; value: string }[] = [
  { label: "Tên sản phẩm", value: "Áo sơ mi lụa tơ tằm Bảo Lộc" },
  {
    label: "Khách hàng mục tiêu",
    value: "Nữ 25–45 tuổi, công sở, chuộng quiet luxury",
  },
  {
    label: "Điểm nhấn cần khoe",
    value: "16 momme dệt tay · không nhăn · mát 2–3°C",
  },
];

const BANNED_SLOP_WORDS = [
  { slop: "siêu phẩm đỉnh chóp", fix: "dệt tay 16 momme" },
  { slop: "giá rẻ bất ngờ", fix: "đầu tư xứng đáng từng đồng" },
  { slop: "không thể bỏ lỡ", fix: "hạ nhiệt 2-3°C tức thì" },
];

interface BentoShellProps {
  telemetryCode: string;
  badge: string;
  title: string;
  description: string;
  className?: string;
  indicatorElement?: ReactNode;
  children?: ReactNode;
}

function BentoShell({
  telemetryCode,
  badge,
  title,
  description,
  className = "",
  indicatorElement,
  children,
}: BentoShellProps) {
  return (
    <SpotlightCard
      spotlightColor="rgba(0, 212, 146, 0.24)"
      className={`flex h-full flex-col rounded-[2.25rem] border border-white/[0.12] bg-[#0A0D15]/85 p-6 sm:p-7 backdrop-blur-2xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.65),inset_0_1px_1px_rgba(255,255,255,0.18)] hover:border-emerald-500/50 transition-all duration-300 ${className}`}
    >
      {/* Telemetry Hardware Header (Kills generic AI slop icons) */}
      <div className="flex items-center justify-between gap-2 border-b border-white/[0.08] pb-3.5">
        <div className="flex items-center gap-2">
          {indicatorElement ? (
            indicatorElement
          ) : (
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(0,212,146,0.8)]" />
          )}
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-slate-300">
            {telemetryCode}
          </span>
        </div>
        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[9.5px] font-bold uppercase tracking-[0.14em] text-emerald-400 shadow-[0_0_12px_rgba(0,212,146,0.15)]">
          {badge}
        </span>
      </div>

      <h3 className="mt-4 text-base sm:text-lg font-bold tracking-tight text-white leading-snug">
        {title}
      </h3>
      <p className="mt-2 text-xs sm:text-[13px] leading-relaxed text-slate-300">
        {description}
      </p>

      {children ? <div className="mt-5 flex-1">{children}</div> : null}
    </SpotlightCard>
  );
}

export default function FeatureGrid() {
  const [activeTone, setActiveTone] = useState<ToneId>("haihuoc");
  const activePreset = TONES.find((tone) => tone.id === activeTone) ?? TONES[0]!;

  return (
    <section
      id="features"
      className="relative scroll-mt-20 border-y border-white/[0.08] py-24 sm:py-32 lg:py-40 overflow-hidden"
    >
      {/* Background radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 right-1/4 -z-10 h-[500px] w-[700px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.08),transparent_70%)] blur-[80px]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" duration={600}>
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/35 bg-[#0A0D15]/80 px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 backdrop-blur-xl shadow-[0_0_20px_rgba(0,212,146,0.25)]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              NĂNG LỰC KỸ THUẬT CỐT LÕI // ZERO-SLOP
            </span>
            <h2 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight">
              Kiến trúc cho tốc độ và chuyển đổi ngôn từ.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Không tính năng thừa. Mọi chi tiết đều phục vụ một mục đích duy
              nhất: biến sản phẩm thô thành kịch bản bán chạy.
            </p>
          </div>
        </ScrollReveal>

        {/* Gapless Asymmetric 3-Column Bento Grid */}
        <BentoGrid className="mt-16">
          {/* Card 1 (Row 1, Col 1-2): Form 4 trường & Bộ chuyển tông giọng tức thì */}
          <BentoShell
            telemetryCode="[KERNEL // 4-TUPLE AUDIO-TONE]"
            badge="LIVE PREVIEW"
            title="Form 4 trường dữ liệu & 3 tông giọng độc lập"
            description="Tên sản phẩm, khách hàng mục tiêu, điểm nhấn và tông giọng. Đổi tông nào, preview cập nhật ngay tông đó."
            className="md:col-span-2"
            indicatorElement={
              <div className="flex items-end gap-0.5 h-3.5 w-4">
                <span className="w-1 bg-emerald-400 rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-2" />
                <span className="w-1 bg-teal-400 rounded-full animate-[pulse_0.6s_ease-in-out_infinite_0.2s] h-3.5" />
                <span className="w-1 bg-cyan-400 rounded-full animate-[pulse_0.7s_ease-in-out_infinite_0.4s] h-2.5" />
              </div>
            }
          >
            <div className="grid gap-2 sm:grid-cols-2">
              {BRIEF_FIELDS.map((field) => (
                <div
                  key={field.label}
                  className="rounded-xl border border-white/[0.10] bg-white/[0.02] px-3.5 py-2.5 backdrop-blur-xl"
                >
                  <p className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    {field.label}
                  </p>
                  <p className="mt-1 truncate text-xs font-semibold text-slate-100">
                    {field.value}
                  </p>
                </div>
              ))}

              <div className="rounded-xl border border-white/[0.10] bg-white/[0.02] p-3 backdrop-blur-xl sm:col-span-2">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    Chọn Tông Giọng:
                  </p>
                  <span className="font-mono text-[10px] text-emerald-400 font-semibold">
                    {activePreset.tempo}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {TONES.map((tone) => {
                    const isActive = tone.id === activeTone;
                    return (
                      <button
                        key={tone.id}
                        type="button"
                        onClick={() => setActiveTone(tone.id)}
                        aria-pressed={isActive}
                        className={`cursor-pointer rounded-full border px-4 py-1.5 text-xs font-bold transition-all duration-200 active:scale-[0.97] ${
                          isActive
                            ? "border-emerald-500/60 bg-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(0,212,146,0.4)]"
                            : "border-white/[0.10] bg-[#0A0D15]/80 text-slate-300 hover:border-white/25 hover:text-white"
                        }`}
                      >
                        {tone.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-emerald-500/35 bg-emerald-500/[0.08] p-4 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)]">
              <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-400">
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                VĂN PHONG TỰ NHIÊN · {activePreset.label}
              </div>
              <p className="mt-2 text-xs sm:text-[13px] leading-relaxed text-slate-200 italic">
                &quot;{activePreset.sample}&quot;
              </p>
            </div>
          </BentoShell>

          {/* Card 2 (Row 1-2, Col 3): Bộ đếm ký tự kép Facebook & Instagram */}
          <BentoShell
            telemetryCode="[OPTICAL GAUGE // 125 CHARS]"
            badge="REALTIME CUTOFF"
            title="Bộ đếm ký tự kép thời gian thực"
            description="Hook Facebook vượt 125 ký tự sẽ bị cắt sau nút “Xem thêm”; caption Instagram vượt 2.200 ký tự sẽ bị từ chối đăng."
            className="md:col-span-1 md:row-span-2"
            indicatorElement={
              <span className="flex h-2.5 w-2.5 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              </span>
            }
          >
            <div className="flex h-full flex-col justify-between gap-6">
              <div className="space-y-6">
                <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 backdrop-blur-xl">
                  <div className="flex items-baseline justify-between font-mono text-xs tabular-nums">
                    <span className="font-bold text-slate-200">
                      FB Newsfeed Hook
                    </span>
                    <span className="text-emerald-400 font-extrabold text-sm">
                      118 / 125
                    </span>
                  </div>
                  <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-white/[0.08] border border-white/[0.10]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400 shadow-[0_0_10px_rgba(0,212,146,0.6)]"
                      style={{ width: "94%" }}
                    />
                  </div>
                  <p className="mt-2 font-mono text-[10px] text-emerald-400 font-semibold">
                    ✓ Còn 7 ký tự an toàn trước điểm cắt
                  </p>
                </div>

                <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 backdrop-blur-xl">
                  <div className="flex items-baseline justify-between font-mono text-xs tabular-nums">
                    <span className="font-bold text-slate-200">
                      Instagram Caption
                    </span>
                    <span className="text-sky-400 font-extrabold text-sm">
                      1.420 / 2.200
                    </span>
                  </div>
                  <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-white/[0.08] border border-white/[0.10]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 shadow-[0_0_10px_rgba(56,189,248,0.6)]"
                      style={{ width: "64%" }}
                    />
                  </div>
                  <p className="mt-2 font-mono text-[10px] text-slate-400">
                    ✓ 780 ký tự đệm an toàn cho hashtag
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/[0.05] p-3.5 font-mono text-[11px] text-slate-300 leading-relaxed">
                <span className="text-emerald-400 font-bold">[RADAR STATUS]: </span>
                Cập nhật độ dài từng phím gõ mili-giây, ngăn chặn nội dung bị ẩn đằng sau &quot;Xem thêm&quot;.
              </div>
            </div>
          </BentoShell>

          {/* Card 3 (Row 2, Col 1): Bộ lọc Anti-AI-Slop */}
          <BentoShell
            telemetryCode="[PURIFIER // 0% SLOP]"
            badge="SYNTAX AUDIT"
            title="Lọc bỏ 100% từ ngữ sáo rỗng"
            description="Hệ thống tự động loại bỏ các từ vô nghĩa làm giảm uy tín shop online."
            className="md:col-span-1"
            indicatorElement={
              <span className="font-mono text-[10px] font-black text-rose-400">
                [AI-SLOP: BANNED]
              </span>
            }
          >
            <div className="space-y-2 font-mono text-[11px]">
              {BANNED_SLOP_WORDS.map((w, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-2 backdrop-blur-xl"
                >
                  <span className="line-through text-rose-400/90 text-[11px]">
                    {w.slop}
                  </span>
                  <span className="text-emerald-400 font-bold text-[11px]">
                    → {w.fix}
                  </span>
                </div>
              ))}
            </div>
          </BentoShell>

          {/* Card 4 (Row 2, Col 2): Xuất bản 1-Click Banner Canvas */}
          <BentoShell
            telemetryCode="[SYNTHESIS // CANVAS 2D]"
            badge="1-CLICK EXPORT"
            title="Xuất ảnh Banner 1200x630 & .txt"
            description="Render ảnh banner HD bằng HTML5 Canvas 2D và gói văn bản hoàn chỉnh chỉ với 1 click."
            className="md:col-span-1"
            indicatorElement={
              <span className="font-mono text-[10px] font-bold text-sky-400">
                [HD 1200×630]
              </span>
            }
          >
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 backdrop-blur-xl font-mono text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-white text-sm">PNG HD + .TXT</p>
                  <p className="text-[10.5px] text-slate-400 mt-0.5">Không gắn watermark</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="rounded-md border border-white/[0.12] bg-white/[0.05] px-2 py-0.5 text-[10px] text-slate-300">
                    .PNG
                  </span>
                  <span className="rounded-md border border-white/[0.12] bg-white/[0.05] px-2 py-0.5 text-[10px] text-slate-300">
                    .TXT
                  </span>
                </div>
              </div>
            </div>
          </BentoShell>

          {/* Card 5 (Row 3, Col 1-2): Offline-first LocalStorage */}
          <BentoShell
            telemetryCode="[STORAGE // ZERO-LOSS CACHE]"
            badge="OFFLINE-FIRST"
            title="Không mất dữ liệu khi mất mạng (Zero-Loss Cache)"
            description="Bản thảo ghi thẳng vào LocalStorage theo từng tài khoản. Mất wifi, đóng tab, tải lại trang — nội dung vẫn nguyên vẹn."
            className="md:col-span-2"
            indicatorElement={
              <span className="flex items-center gap-1.5 text-emerald-400 font-mono text-[10px] font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                ACTIVE MEMORY
              </span>
            }
          >
            <div className="grid gap-2.5 sm:grid-cols-2 font-mono text-xs">
              <div className="flex items-center justify-between gap-2 rounded-xl border border-white/[0.10] bg-white/[0.02] px-3.5 py-2.5 backdrop-blur-xl">
                <span className="truncate font-semibold text-slate-200">
                  cs_draft_user_secure
                </span>
                <span className="shrink-0 font-bold uppercase text-emerald-400 text-[11px]">
                  Auto-Saved ✓
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 rounded-xl border border-white/[0.10] bg-white/[0.02] px-3.5 py-2.5 backdrop-blur-xl">
                <span className="truncate font-semibold text-slate-200">
                  cs_history_cache
                </span>
                <span className="shrink-0 font-bold uppercase text-teal-400 text-[11px]">
                  Synced (0s)
                </span>
              </div>
            </div>
          </BentoShell>

          {/* Card 6 (Row 3, Col 3): Enterprise Security & Supabase RLS Guard */}
          <BentoShell
            telemetryCode="[ENCLAVE // SUPABASE RLS]"
            badge="ZERO LEAKAGE"
            title="Bảo mật cấp Doanh nghiệp"
            description="Cô lập dữ liệu tuyệt đối qua Supabase RLS. Không dùng bài viết của bạn để train AI."
            className="md:col-span-1"
            indicatorElement={
              <span className="font-mono text-[10px] font-bold text-emerald-400">
                [AES-256 / TLS 1.3]
              </span>
            }
          >
            <div className="space-y-2.5 font-mono text-[11px]">
              <div className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-2 backdrop-blur-xl">
                <span className="text-slate-300">Mã hóa đường truyền</span>
                <span className="font-bold text-emerald-400">TLS 1.3 · SSL</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-2 backdrop-blur-xl">
                <span className="text-slate-300">Phân quyền Database</span>
                <span className="font-bold text-sky-400">Row-Level RLS</span>
              </div>
            </div>
          </BentoShell>
        </BentoGrid>
      </div>
    </section>
  );
}
