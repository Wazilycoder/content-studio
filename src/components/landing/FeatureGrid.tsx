import { Layers3, ClipboardList, Sparkles, Copy, History, Type } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

interface FeatureItem {
  Icon: LucideIcon;
  title: string;
  description: string;
  span: string;
  pills?: string[];
}

const FEATURES: FeatureItem[] = [
  {
    Icon: ClipboardList,
    title: "Form 4 trường & 3 tông giọng chuẩn đề bài",
    description:
      "Chỉ cần nhập tên sản phẩm, mô tả, khách hàng mục tiêu và chọn 1 trong 3 tông giọng bắt buộc — đúng cấu trúc Đề 2 yêu cầu, không thừa không thiếu.",
    pills: ["Hài hước", "Trang trọng", "Trẻ trung"],
    span: "md:col-span-3",
  },
  {
    Icon: Sparkles,
    title: "AI sinh 3 Caption + 3 Headline + 5 Hashtag",
    description:
      "Mỗi lượt tạo trả về trọn bộ 3 góc nhìn độc bản (PAS, Cảm xúc, FAB), 3 tiêu đề giật tít và 5 hashtag chuẩn ngách — đa chiều, không trùng lặp văn mẫu.",
    pills: ["PAS", "Cảm xúc", "FAB"],
    span: "md:col-span-3",
  },
  {
    Icon: Copy,
    title: "Sao chép 1 chạm & Nút Tạo lại tức thì",
    description:
      "Copy từng góc bài, headline hay trọn bộ hashtag chỉ với một cú click. Chưa ưng ý? Bấm Tạo lại để AI sinh phương án mới ngay lập tức.",
    span: "md:col-span-2",
  },
  {
    Icon: History,
    title: "Lịch sử LocalStorage xóa từng mục",
    description:
      "Lưu trữ ngoại tuyến an toàn trên trình duyệt. Khôi phục form 1-click, xem lại bài cũ và xóa sạch từng mục bất cứ lúc nào bạn muốn.",
    span: "md:col-span-2",
  },
  {
    Icon: Type,
    title: "Bộ đếm ký tự kép Facebook & Instagram",
    description:
      "Cảnh báo trực quan ngưỡng 125 ký tự 'Xem thêm' của Facebook và 2.200 ký tự trần của Instagram, giúp caption không bao giờ bị cắt xén.",
    span: "md:col-span-2",
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
              <Layers3 className="h-3.5 w-3.5" /> 5 tính năng lõi của đề bài
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--ink-primary)] sm:text-4xl">
              Đủ bộ công cụ để tạo caption chuẩn cuộc thi
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--ink-secondary)] sm:text-base">
              Tinh gọn, mạnh mẽ và bám sát từng yêu cầu của Đề 2 — để bạn tạo ra bài
              viết chất lượng trong vài phút, không cần học công cụ phức tạp.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-6">
          {FEATURES.map(({ Icon, title, description, pills, span }, idx) => (
            <ScrollReveal
              key={title}
              direction="up"
              delay={idx * 80}
              duration={600}
              className={span}
            >
              <div className="group relative flex h-full flex-col rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-raised)]/70 p-6 sm:p-7 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-[0_15px_35px_-10px_rgba(99,102,241,0.12)]">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-sm transition-transform duration-200 group-hover:scale-110">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-bold tracking-tight text-[var(--ink-primary)]">
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
                        className="rounded-full border border-indigo-500/20 bg-indigo-500/5 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400"
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