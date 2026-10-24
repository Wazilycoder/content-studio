import { ChevronDown } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: "Bài viết sinh ra có bị trùng lặp với shop khác không?",
    answer:
      "Không. Mỗi lượt tạo đều được AI phân tích từ mô tả riêng biệt của bạn qua 3 góc nhìn độc bản.",
  },
  {
    question: "Facebook và Instagram có hạn chế bài viết do AI tạo không?",
    answer:
      "Content Studio áp dụng bộ lọc Anti-AI-Slop loại bỏ hoàn toàn từ ngữ máy móc, nhịp câu tự nhiên như người viết thực thụ.",
  },
  {
    question: "Tôi có thể dùng bài viết này để chạy quảng cáo Ads không?",
    answer:
      "Rất phù hợp. Bộ 3 góc nhìn được thiết kế chuẩn cấu trúc chạy A/B Testing cho Facebook & Instagram Ads.",
  },
  {
    question: "1 lượt tạo tương đương với những gì?",
    answer:
      "1 lượt tạo sinh ra đầy đủ: 3 Captions (3 góc độ) + 3 Headlines giật tít + 5 Hashtags chuẩn ngách.",
  },
  {
    question: "Thông tin sản phẩm của tôi có được bảo mật không?",
    answer:
      "Dữ liệu được bảo vệ an toàn bằng Supabase Row Level Security (RLS), chỉ bạn mới xem và xóa được lịch sử của mình.",
  },
];

export default function FaqSection() {
  return (
    <section
      id="faq"
      className="scroll-mt-20 border-y border-[var(--border-subtle)] bg-[var(--surface)] py-16 sm:py-20"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center">
          <span className="inline-flex items-center rounded-full border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-3 py-1 text-[11px] font-medium text-[var(--ink-secondary)]">
            FAQ
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--ink-primary)] sm:text-4xl">
            Giải đáp thắc mắc của chủ shop
          </h2>
        </div>

        <div className="mt-10 divide-y divide-[var(--border-subtle)] overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          {FAQS.map((faq) => (
            <details key={faq.question} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-medium text-[var(--ink-primary)] transition-colors hover:bg-[var(--surface-raised)] [&::-webkit-details-marker]:hidden">
                <span>{faq.question}</span>
                <ChevronDown className="h-4 w-4 shrink-0 text-[var(--ink-secondary)] transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <p className="px-5 pb-4 text-[13px] leading-relaxed text-[var(--ink-secondary)]">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}