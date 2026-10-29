"use client";

import { useState, type ReactNode } from "react";
import {
  Check,
  FileText,
  Gauge,
  HardDrive,
  Zap,
  type LucideIcon,
} from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { BentoGrid } from "@/components/ui/BentoGrid";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

type ToneId = "haihuoc" | "trangtrong" | "tretrung";

interface TonePreset {
  id: ToneId;
  label: string;
  sample: string;
}

const TONES: TonePreset[] = [
  {
    id: "haihuoc",
    label: "Hài hước",
    sample:
      "Sơ mi nhăn nhúm sau hai lần giặt là kiểu gì cũng phải mua chiếc thứ ba — lần này chọn lụa tơ tằm cho lành.",
  },
  {
    id: "trangtrong",
    label: "Trang trọng",
    sample:
      "Sự chỉn chu không đến từ phô trương, mà từ chất liệu đủ tinh tế để người đối diện nhớ mãi.",
  },
  {
    id: "tretrung",
    label: "Trẻ trung",
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

interface BentoShellProps {
  icon: LucideIcon;
  badge: string;
  title: string;
  description: string;
  className?: string;
  children?: ReactNode;
}

function BentoShell({
  icon: Icon,
  badge,
  title,
  description,
  className = "",
  children,
}: BentoShellProps) {
  return (
    <SpotlightCard
      spotlightColor="rgba(0, 212, 146, 0.12)"
      className={`flex h-full flex-col p-6 ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-hairline)] bg-[var(--surface-raised)] text-[var(--brand)]">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </div>
        <span className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[var(--ink-tertiary)]">
          {badge}
        </span>
      </div>

      <h3 className="mt-4 text-[15px] font-semibold tracking-tight text-[var(--ink-primary)]">
        {title}
      </h3>
      <p className="mt-1.5 text-[12.5px] leading-relaxed text-[var(--ink-secondary)]">
        {description}
      </p>

      {children ? <div className="mt-4 flex-1">{children}</div> : null}
    </SpotlightCard>
  );
}

export default function FeatureGrid() {
  const [activeTone, setActiveTone] = useState("haihuoc");
  const activePreset = TONES.find((tone) => tone.id === activeTone) ?? TONES[0]!;

  return (
    <section
      id="features"
      className="scroll-mt-20 border-y border-[var(--border-hairline)] bg-[var(--surface-raised)]/40 py-12 sm:py-14"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" duration={600}>
          <div className="mx-auto max-w-3xl text-center">
            <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[var(--ink-tertiary)]">
              {"[Engineering Standards // Core Capabilities]"}
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--ink-primary)] sm:text-4xl">
              Kiến trúc cho tốc độ và chất lượng ngôn từ.
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-[13.5px] leading-relaxed text-[var(--ink-secondary)] sm:text-sm">
              Không tính năng thừa. Mọi chi tiết đều phục vụ một mục đích duy
              nhất: biến sản phẩm thô thành kịch bản bán chạy.
            </p>
          </div>
        </ScrollReveal>

        {/* Bento Grid Architecture */}
        <BentoGrid className="mt-12">
          {/* Card lớn: Form 4 trường dữ liệu & 3 tông giọng */}
          <BentoShell
            icon={FileText}
            badge="Brief 04 Fields"
            title="Form 4 trường dữ liệu & 3 tông giọng"
            description="Tên sản phẩm, khách hàng mục tiêu, điểm nhấn và tông giọng. Đổi tông nào, preview cập nhật ngay tông đó."
            className="md:col-span-2"
          >
            <div className="grid gap-2 sm:grid-cols-2">
              {BRIEF_FIELDS.map((field) => (
                <div
                  key={field.label}
                  className="rounded-xl border border-[var(--border-hairline)] bg-[var(--surface-raised)]/60 px-3 py-2"
                >
                  <p className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.12em] text-[var(--ink-tertiary)]">
                    {field.label}
                  </p>
                  <p className="mt-1 truncate text-[12.5px] font-medium text-[var(--ink-primary)]">
                    {field.value}
                  </p>
                </div>
              ))}

              <div className="rounded-xl border border-[var(--border-hairline)] bg-[var(--surface-raised)]/60 px-3 py-2 sm:col-span-2">
                <p className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.12em] text-[var(--ink-tertiary)]">
                  Tông giọng
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {TONES.map((tone) => {
                    const isActive = tone.id === activeTone;
                    return (
                      <button
                        key={tone.id}
                        type="button"
                        onClick={() => setActiveTone(tone.id)}
                        aria-pressed={isActive}
                        className={`btn-tactile cursor-pointer rounded-lg border px-2.5 py-1 text-[11.5px] font-semibold transition-colors ${
                          isActive
                            ? "border-[var(--brand)] bg-[var(--brand)] text-white"
                            : "border-[var(--border-subtle)] bg-[var(--surface)] text-[var(--ink-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--ink-primary)]"
                        }`}
                      >
                        {tone.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-2 rounded-xl border border-[var(--border-hairline)] bg-[var(--surface)] px-3.5 py-3">
              <div className="flex items-center gap-1.5 font-mono text-[9.5px] font-semibold uppercase tracking-[0.12em] text-[var(--brand)]">
                <Check className="h-3 w-3" aria-hidden="true" />
                Live preview · {activePreset.label}
              </div>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-[var(--ink-secondary)]">
                {activePreset.sample}
              </p>
            </div>
          </BentoShell>

          {/* Card cao: Bộ đếm ký tự kép Facebook & Instagram */}
          <BentoShell
            icon={Gauge}
            badge="Dual Meter"
            title="Bộ đếm ký tự kép"
            description="Hook Facebook vượt 125 ký tự sẽ bị cắt sau nút “Xem thêm”; caption Instagram vượt 2.200 ký tự sẽ bị từ chối đăng."
            className="md:col-span-1 md:row-span-2"
          >
            <div className="flex h-full flex-col justify-between gap-5">
              <div className="space-y-5">
                <div>
                  <div className="flex items-baseline justify-between font-mono text-[11px] tabular-nums">
                    <span className="font-semibold text-[var(--ink-primary)]">
                      FB Newsfeed Hook
                    </span>
                    <span className="text-[var(--ink-secondary)]">118 / 125</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[var(--border-subtle)]">
                    <div
                      className="h-full rounded-full bg-[var(--brand)]"
                      style={{ width: "94%" }}
                    />
                  </div>
                  <p className="mt-1.5 font-mono text-[10px] text-[var(--ink-tertiary)]">
                    7 ký tự còn lại trước ngưỡng cắt
                  </p>
                </div>

                <div>
                  <div className="flex items-baseline justify-between font-mono text-[11px] tabular-nums">
                    <span className="font-semibold text-[var(--ink-primary)]">
                      Instagram Caption
                    </span>
                    <span className="text-[var(--ink-secondary)]">
                      1.420 / 2.200
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[var(--border-subtle)]">
                    <div
                      className="h-full rounded-full bg-sky-600 dark:bg-sky-400"
                      style={{ width: "64%" }}
                    />
                  </div>
                  <p className="mt-1.5 font-mono text-[10px] text-[var(--ink-tertiary)]">
                    780 ký tự đệm an toàn
                  </p>
                </div>
              </div>

              <p className="rounded-xl border border-[var(--border-hairline)] bg-[var(--surface-raised)]/60 px-3 py-2.5 text-[11.5px] leading-relaxed text-[var(--ink-secondary)]">
                Thanh đo quang học cập nhật theo thời gian thực mỗi khi bạn sửa
                bản thảo.
              </p>
            </div>
          </BentoShell>

          {/* Card nhỏ 1: Offline-first LocalStorage */}
          <BentoShell
            icon={HardDrive}
            badge="Offline-First"
            title="Không mất dữ liệu khi mất mạng"
            description="Bản thảo ghi thẳng vào LocalStorage của máy bạn. Mất wifi, đóng tab, tải lại trang — nội dung vẫn nguyên vẹn."
            className="md:col-span-1"
          >
            <div className="space-y-2">
              {[
                "Áo sơ mi lụa tơ tằm Bảo Lộc",
                "Cà phê Robusta rang mộc Cầu Đất",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between gap-2 rounded-xl border border-[var(--border-hairline)] bg-[var(--surface-raised)]/60 px-3 py-2"
                >
                  <span className="truncate text-[11.5px] font-medium text-[var(--ink-primary)]">
                    {item}
                  </span>
                  <span className="shrink-0 font-mono text-[9.5px] font-semibold uppercase tracking-[0.1em] text-[var(--brand)]">
                    Saved
                  </span>
                </div>
              ))}
            </div>
          </BentoShell>

          {/* Card nhỏ 2: Tốc độ Turbo 0.5s */}
          <BentoShell
            icon={Zap}
            badge="Turbo Path"
            title="0.5s cho một lượt tổng hợp"
            description="Hàng đợi GPU xử lý song song ba góc bài, không chờ tua, không giới hạn nhịp viết."
            className="md:col-span-1"
          >
            <div className="flex items-end justify-between gap-3 rounded-xl border border-[var(--border-hairline)] bg-[var(--surface-raised)]/60 px-3 py-3">
              <div>
                <p className="font-mono text-2xl font-semibold leading-none tabular-nums text-[var(--ink-primary)]">
                  0.5s
                </p>
                <p className="mt-1 font-mono text-[9.5px] uppercase tracking-[0.12em] text-[var(--ink-tertiary)]">
                  Độ trễ trung bình
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-2 py-1 font-mono text-[9.5px] font-semibold uppercase tracking-[0.1em] text-[var(--brand)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)]" />
                Queue idle
              </span>
            </div>
          </BentoShell>
        </BentoGrid>
            </div>
          </section>
  );
}
