"use client";

import { Lightbulb, PenLine, Zap } from "lucide-react";

export interface InspirationPreset {
  productName: string;
  productDescription: string;
  targetAudience: string;
}

const ANGLES = [
  {
    index: "01",
    title: "Vấn đề & Giải pháp",
    detail: "Đào sâu insight, gỡ bỏ phiền toái.",
  },
  {
    index: "02",
    title: "Cảm xúc & Phong cách sống",
    detail: "Bán hình tượng khách hàng muốn trở thành.",
  },
  {
    index: "03",
    title: "Trực diện tính năng & Giá trị",
    detail: "Tôn vinh chất liệu và độ hoàn thiện đỉnh cao.",
  },
];

const INSPIRATIONS: InspirationPreset[] = [
  {
    productName: "Áo sơ mi lụa tơ tằm Bảo Lộc",
    productDescription:
      "Lụa tơ tằm dệt tay tại Bảo Lộc, bề mặt óng mượt, mát lạnh, thấm hút mồ hôi tốt, form suông thanh lịch, đường may thủ công tỉ mỉ.",
    targetAudience:
      "Nữ chuyên viên văn phòng 28–45 tuổi yêu thích phong cách thanh lịch, bền vững.",
  },
  {
    productName: "Trà mãng cầu xiêm Đắk Lắk",
    productDescription:
      "Trà mãng cầu xiêm ủ khô tự nhiên từ trái chín cây Đắk Lắk, vị chua ngọt dịu, thơm mùi quả nhiệt đới, không chất bảo quản, túi lọc tiện pha.",
    targetAudience:
      "Người trẻ 22–35 tuổi quan tâm sức khỏe, thích thức uống thanh mát thay thế trà sữa.",
  },
  {
    productName: "Serum phục hồi đa tầng B5",
    productDescription:
      "Serum nồng độ B5 cao kết hợp HA đa tầng, phục hồi hàng rào ẩm, làm dịu da kích ứng sau treatment, kết cấu mỏng nhẹ thấm nhanh không bết dính.",
    targetAudience:
      "Nữ 25–40 tuổi da nhạy cảm, vừa điều trị da liễu cần sản phẩm phục hồi an toàn.",
  },
];

interface EmptyStateProps {
  onSelectInspiration?: (preset: InspirationPreset) => void;
}

export default function EmptyState({ onSelectInspiration }: EmptyStateProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)]/70 px-5 py-10 text-center backdrop-blur-md sm:px-6 sm:py-12">
      <div className="pointer-events-none absolute -left-16 -top-20 h-48 w-48 rounded-full bg-[var(--accent-navy)]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-16 h-56 w-56 rounded-full bg-fuchsia-500/10 blur-3xl" />

      <div className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-raised)]/80 text-[var(--accent-navy)] shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
        <PenLine className="h-5 w-5" />
      </div>

      <h3 className="relative mt-4 text-[15px] font-semibold tracking-tight text-[var(--ink-primary)]">
        Studio Canvas — Sẵn sàng kiến tạo nội dung
      </h3>
      <p className="relative mx-auto mt-1.5 max-w-md text-[12.5px] leading-relaxed text-[var(--ink-secondary)]">
        Điền thông tin sản phẩm bên trái hoặc chọn gợi ý bên dưới để nhận ngay 3 bài viết
        độc bản.
      </p>

      <div className="relative mt-6 grid gap-2.5 text-left sm:grid-cols-3">
        {ANGLES.map((angle) => (
          <div
            key={angle.index}
            className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-raised)]/60 px-3 py-3 transition-colors hover:border-[var(--accent-navy)]/40"
          >
            <span className="text-[10.5px] font-semibold tabular-nums tracking-wider text-[var(--accent-navy)]">
              {angle.index}
            </span>
            <p className="mt-1 text-[12px] font-semibold leading-snug text-[var(--ink-primary)]">
              {angle.title}
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-[var(--ink-tertiary)]">
              {angle.detail}
            </p>
          </div>
        ))}
      </div>

      <div className="relative mt-6">
        <p className="flex items-center justify-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-[var(--ink-tertiary)]">
          <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
          Gợi ý cảm hứng
        </p>
        <div className="mt-2.5 flex flex-wrap justify-center gap-2">
          {INSPIRATIONS.map((preset) => (
            <button
              key={preset.productName}
              type="button"
              onClick={() => onSelectInspiration?.(preset)}
              className="btn-tactile inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-1.5 text-[12px] font-medium text-[var(--ink-secondary)] transition-all duration-150 hover:-translate-y-0.5 hover:border-[var(--accent-navy)]/50 hover:text-[var(--ink-primary)]"
            >
              <Lightbulb className="h-3 w-3 text-amber-500" />
              {preset.productName}
            </button>
          ))}
        </div>
      </div>

      <p className="relative mt-6 inline-flex flex-wrap items-center justify-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-raised)]/70 px-3 py-1.5 text-[11.5px] text-[var(--ink-tertiary)]">
        <Zap className="h-3 w-3 text-[var(--accent-navy)]" />
        Bấm
        <kbd className="rounded border border-[var(--border-subtle)] bg-[var(--surface)] px-1 py-0.5 text-[10.5px] font-medium text-[var(--ink-secondary)]">
          Ctrl
        </kbd>
        +
        <kbd className="rounded border border-[var(--border-subtle)] bg-[var(--surface)] px-1 py-0.5 text-[10.5px] font-medium text-[var(--ink-secondary)]">
          Enter
        </kbd>
        để khởi tạo bài viết trong 1 giây
      </p>
    </div>
  );
}