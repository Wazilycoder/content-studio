import { Layers3, MessagesSquare, Type, Copy, History, ShieldCheck, Cpu } from "lucide-react";
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
    pills: [
      "Hài hước",
      "Sang trọng",
      "Trẻ trung",
      "Đồng cảm",
      "Chuyên gia",
      "Storytelling",
      "FOMO",
    ],
  },
  {
    Icon: Type,
    title: "Bộ đếm ký tự Unicode chuẩn xác",
    description:
      "Cảnh báo 125 ký tự Facebook mobile & 2.200 ký tự trần Instagram để caption không bao giờ bị cắt.",
  },
  {
    Icon: Copy,
    title: "Sao chép 1 chạm thông minh",
    description:
      "Copy từng góc bài, headline hoặc gom trọn bộ 5 hashtags tức thì chỉ với một cú click.",
  },
  {
    Icon: History,
    title: "Khôi phục lịch sử ngoại tuyến & Supabase",
    description:
      "Lưu trữ và khôi phục form 1-click, đồng bộ cả ngoại tuyến lẫn Supabase — không sợ mất bài.",
  },
  {
    Icon: ShieldCheck,
    title: "Trừ lượt Atomic an toàn",
    description:
      "Giao dịch Postgres RPC tin cậy, tự động hoàn tiền 100% nếu AI gặp lỗi mạng giữa chừng.",
  },
  {
    Icon: Cpu,
    title: "Hỗ trợ nhiều nguồn AI tiên tiến",
    description:
      "Tích hợp và linh hoạt điều phối giữa DeepSeek V3, Claude 3.5 Sonnet và Gemini Flash — bảo đảm tốc độ tạo bài siêu tốc 0s và không bao giờ bị gián đoạn.",
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
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-3 py-1 text-[11px] font-medium text-[var(--ink-secondary)]">
              <Layers3 className="h-3.5 w-3.5" /> Kiến trúc tính năng lõi
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--ink-primary)] sm:text-4xl">
              Mọi thứ một chủ shop cần để bùng nổ doanh số
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--ink-secondary)] sm:text-base">
              Tinh gọn, mạnh mẽ và được thiết kế để bạn đăng bài trong vài phút, không
              phải học công cụ phức tạp.
            </p>
          </div>
        </ScrollReveal>

        <div className="relative mt-14">
          {/* Trục rễ cây phát sáng (desktop: giữa) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-0.5 -translate-x-1/2 bg-gradient-to-b from-indigo-500 via-sky-500 to-indigo-500/20 md:block"
          />
          {/* Trục rễ cây (mobile: trái) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-4 w-0.5 bg-indigo-500/25 md:hidden"
          />

          <div className="space-y-10 md:space-y-16">
            {FEATURES.map(({ Icon, title, description, pills }, idx) => {
              const isLeft = idx % 2 === 0;
              return (
                <div key={title} className="relative pl-12 md:pl-0">
                  {/* Nút mắt rễ trên trục */}
                  <div className="absolute left-4 top-1 z-10 -translate-x-1/2 md:left-1/2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-indigo-500 bg-[var(--surface)] shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                      <Icon className="h-4 w-4 text-indigo-500" />
                    </div>
                  </div>

                  {/* Nhánh ngang nối trục tới thẻ (desktop) */}
                  <div
                    aria-hidden="true"
                    className={`absolute top-[19px] hidden h-0.5 w-8 bg-indigo-500/40 md:block ${
                      isLeft
                        ? "right-[calc(50%_-_1rem)]"
                        : "left-[calc(50%_+_1rem)]"
                    }`}
                  />

                  <ScrollReveal
                    direction="up"
                    delay={idx * 70}
                    duration={600}
                    className={`md:w-1/2 ${
                      isLeft ? "md:mr-auto md:pr-12" : "md:ml-auto md:pl-12"
                    }`}
                  >
                    <div
                      className={`card-interactive group flex h-full flex-col rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-6 hover:border-[var(--accent-navy)]/40 ${
                        isLeft
                          ? "md:items-end md:text-right"
                          : "md:items-start md:text-left"
                      }`}
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
                        <div
                          className={`mt-4 flex flex-wrap gap-1.5 ${
                            isLeft ? "md:justify-end" : "md:justify-start"
                          }`}
                        >
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
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}