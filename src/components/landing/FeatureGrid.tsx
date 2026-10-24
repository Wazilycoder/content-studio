import { MessagesSquare, Type, Copy, History, ShieldCheck, Cpu } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

interface FeatureItem {
  Icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
  pills?: string[];
}

const FEATURES: FeatureItem[] = [
  {
    Icon: MessagesSquare,
    title: "7 tông giọng tiếp thị chuyên sâu",
    description:
      "Chọn đúng giọng điệu cho từng sản phẩm: từ hài hước giải trí đến sang trọng đẳng cấp, mỗi tông là một cách chạm cảm xúc khác nhau.",
    className: "sm:col-span-2 lg:col-span-2",
    pills: [
      "Hài hước",
      "Sang trọng",
      "Trẻ trung",
      "Đồng cảm",
      "Chuyên gia",
      "Kể chuyện",
      "Kích thích mua",
    ],
  },
  {
    Icon: Type,
    title: "Bộ đếm ký tự Unicode chuẩn xác",
    description:
      "Cảnh báo 125 ký tự Facebook mobile & 2.200 ký tự Instagram để caption không bao giờ bị cắt.",
  },
  {
    Icon: Copy,
    title: "Sao chép 1 chạm thông minh",
    description:
      "Copy từng caption, headline hoặc chép toàn bộ 5 hashtags chỉ với một cú click.",
  },
  {
    Icon: History,
    title: "Khôi phục lịch sử tức thì",
    description:
      "Lưu trữ 50 bài viết gần nhất trong Database Supabase, tải lại form trong 1 click.",
  },
  {
    Icon: ShieldCheck,
    title: "Trừ lượt Atomic an toàn",
    description:
      "Bảo vệ giao dịch bằng Postgres RPC, tự động hoàn trả 100% nếu AI gặp sự cố.",
  },
  {
    Icon: Cpu,
    title: "Kiến trúc AI Đa nguồn",
    description:
      "Hỗ trợ DeepSeek V3, Claude 3.5 và Gemini 3.5 Flash với cơ chế fallback tự động — không gián đoạn khi một nguồn gặp sự cố.",
    className: "sm:col-span-2 lg:col-span-3",
  },
];

export default function FeatureGrid() {
  return (
    <section
      id="features"
      className="scroll-mt-20 border-y border-[var(--border-subtle)] bg-[var(--surface)] py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal direction="up" duration={600}>
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center rounded-full border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-3 py-1 text-[11px] font-medium text-[var(--ink-secondary)]">
              Tính năng
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--ink-primary)] sm:text-4xl">
              Mọi thứ một chủ shop cần để viết content
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--ink-secondary)] sm:text-base">
              Tinh gọn, mạnh mẽ và được thiết kế để bạn đăng bài trong vài phút, không
              phải học công cụ phức tạp.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ Icon, title, description, className, pills }, idx) => (
            <ScrollReveal
              key={title}
              direction="up"
              delay={idx * 70}
              duration={600}
              className={`h-full ${className ?? ""}`}
            >
              <div
                className="card-interactive group flex h-full flex-col rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-6 hover:border-[var(--accent-navy)]/40"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--accent-navy)] shadow-xs transition-transform duration-200 group-hover:scale-110">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold tracking-tight text-[var(--ink-primary)]">
                  {title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-[var(--ink-secondary)]">
                  {description}
                </p>
                {pills && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {pills.map((pill) => (
                      <span
                        key={pill}
                        className="rounded-md border border-[var(--border-subtle)] bg-[var(--surface)] px-2 py-0.5 text-[11px] font-medium text-[var(--ink-secondary)] transition-colors group-hover:border-[var(--border-strong)]"
                      >
                        {pill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}