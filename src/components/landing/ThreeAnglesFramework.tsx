import { Target, Heart, BadgeCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

interface AngleItem {
  index: string;
  tag: string;
  title: string;
  description: string;
  valueProp: string;
  Icon: LucideIcon;
}

const ANGLES: AngleItem[] = [
  {
    index: "Góc 1",
    tag: "PAS",
    title: "Vấn đề & Giải pháp",
    description:
      "Đánh trúng phiền toái, sai lầm hay thói quen cũ mà khách hàng đang chịu đựng, đưa sản phẩm vào như lời giải tối ưu.",
    valueProp: "→ Hợp shop mới, sản phẩm cần giải thích rõ vấn đề để chốt đơn nhanh.",
    Icon: Target,
  },
  {
    index: "Góc 2",
    tag: "Cảm xúc",
    title: "Cảm xúc & Phong cách sống",
    description:
      "Bán hình ảnh người mua muốn thấy ở chính mình: sự tự tin, thư thái và chuẩn mực sống cao cấp.",
    valueProp: "→ Hợp thương hiệu lifestyle, mỹ phẩm, thời trang xây dựng hình ảnh.",
    Icon: Heart,
  },
  {
    index: "Góc 3",
    tag: "FAB",
    title: "Trực diện tính năng & Giá trị",
    description:
      "Phân tích chất liệu, độ bền, thông số và nguồn gốc; chứng minh sản phẩm xứng đáng từng đồng chi ra.",
    valueProp: "→ Hợp sản phẩm công nghệ, gia dụng cần chứng minh bằng thông số.",
    Icon: BadgeCheck,
  },
];

export default function ThreeAnglesFramework() {
  return (
    <section
      id="framework"
      className="scroll-mt-20 bg-[var(--canvas)] py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal direction="up" duration={600}>
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center rounded-full border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-3 py-1 text-[11px] font-medium text-[var(--ink-secondary)]">
              Phương pháp luận
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--ink-primary)] sm:text-4xl">
              Tại sao lại là 3 góc tiếp cận?
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[var(--ink-secondary)] sm:text-base">
              Chạy quảng cáo hoặc đăng 1 nội dung lặp đi lặp lại khiến khách hàng bị
              chai lì (Ad Fatigue). Content Studio tự động phân hóa thành 3 góc nhìn
              bổ trợ nhau hoàn hảo:
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {ANGLES.map(({ index, tag, title, description, valueProp, Icon }, cardIdx) => (
            <ScrollReveal
              key={index}
              direction="up"
              delay={cardIdx * 130}
              duration={650}
            >
              <div
                className="card-interactive group flex h-full flex-col rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] p-6 hover:border-[var(--accent-navy)]/40"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surface-raised)] text-[var(--accent-navy)] transition-transform duration-200 group-hover:scale-110">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-md bg-[var(--surface-raised)] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--ink-secondary)] transition-colors group-hover:text-[var(--accent-navy)]">
                    {tag}
                  </span>
                </div>
                <span className="mt-5 text-[11px] font-semibold uppercase tracking-wider text-[var(--accent-navy)]">
                  {index}
                </span>
                <h3 className="mt-1 text-lg font-semibold tracking-tight text-[var(--ink-primary)]">
                  {title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-[var(--ink-secondary)]">
                  {description}
                </p>
                <div className="mt-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-3 py-2 text-[12px] font-medium text-[var(--ink-secondary)]">
                  {valueProp}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}