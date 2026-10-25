"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  Layers3,
  Megaphone,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

type CategoryId = "all" | "pricing" | "quality" | "ads" | "security";

interface FaqItem {
  category: Exclude<CategoryId, "all">;
  badge: string;
  question: string;
  answer: string;
}

interface CategoryMeta {
  id: CategoryId;
  label: string;
  icon: LucideIcon;
}

const CATEGORIES: CategoryMeta[] = [
  { id: "all", label: "Tất cả câu hỏi", icon: Layers3 },
  { id: "pricing", label: "Chi phí & Gói cước", icon: Wallet },
  { id: "quality", label: "Chuẩn Anti-AI-Slop", icon: SlidersHorizontal },
  { id: "ads", label: "Chạy Ads FB & Insta", icon: Megaphone },
  { id: "security", label: "Bảo mật & Bản quyền", icon: ShieldCheck },
];

const FAQS: FaqItem[] = [
  {
    category: "quality",
    badge: "🔥 Phổ biến",
    question: "Bài viết sinh ra có bị trùng lặp với các shop đối thủ không?",
    answer:
      "Hoàn toàn không. Thuật toán phân tích ngữ nghĩa độc lập từ tên sản phẩm, công năng và khách hàng mục tiêu của bạn để kiến tạo 3 góc bài viết độc bản: PAS (Vấn đề - Giải pháp), Cảm xúc và Trực diện tính năng. Không có bài viết nào giống nhau.",
  },
  {
    category: "pricing",
    badge: "💡 Khuyên dùng",
    question: "Gói Free có bị giới hạn tính năng hay gắn watermark không?",
    answer:
      "Gói Miễn phí không giới hạn số lượng bài viết tạo ra, không gắn watermark và hỗ trợ đầy đủ 3 góc bài viết. Chỉ có thời gian chờ (cooldown) 45 giây giữa các lần tạo để bảo đảm tài nguyên server.",
  },
  {
    category: "quality",
    badge: "🔥 Phổ biến",
    question: "Bài viết AI có bị Facebook hoặc Instagram bóp tương tác không?",
    answer:
      "Không. Content Studio tích hợp bộ lọc Anti-AI-Slop độc quyền, chủ động loại bỏ các từ ngữ sáo rỗng, nhịp câu máy móc, và bổ sung các điểm ngắt nhịp tự nhiên giống 100% văn phong người viết thực tế.",
  },
  {
    category: "ads",
    badge: "⚡ Tối ưu Ads",
    question: "Tôi có thể dùng nội dung này để chạy Facebook & Instagram Ads không?",
    answer:
      "Cực kỳ phù hợp. Định dạng 3 góc bài viết được thiết kế chuẩn cấu trúc A/B Testing: Bạn có thể lấy Góc 1 test nhóm khách hàng đang gặp nỗi đau, Góc 2 cho tệp cảm xúc và Góc 3 cho tệp so sánh tính năng.",
  },
  {
    category: "pricing",
    badge: "💎 Pro Turbo",
    question: "Nâng cấp lên Chủ Shop Turbo (99.000đ) mang lại lợi ích gì?",
    answer:
      "Bạn được kích hoạt cụm xử lý GPU chuyên biệt, loại bỏ hoàn toàn 45s thời gian chờ (tạo bài tức thì 0s), lưu trữ lịch sử không giới hạn và hỗ trợ ưu tiên khi cần tinh chỉnh prompt theo ngách.",
  },
  {
    category: "security",
    badge: "🛡️ Bảo mật",
    question: "Dữ liệu kinh doanh và ý tưởng sản phẩm của tôi có được bảo mật không?",
    answer:
      "Dữ liệu của bạn được cô lập tuyệt đối theo kiến trúc Row Level Security (RLS) của Supabase. Chúng tôi không bao giờ dùng mô tả sản phẩm của bạn để train model công cộng.",
  },
  {
    category: "quality",
    badge: "✏️ Soạn thảo",
    question: "Tôi có thể chỉnh sửa trực tiếp nội dung trước khi copy không?",
    answer:
      "Có. Ngay trên mỗi thẻ bài viết, bạn chỉ cần bấm nút 'Chỉnh sửa' là có thể gõ thêm câu chữ, icon hoặc số điện thoại. Bộ đếm ký tự Facebook/Instagram sẽ cập nhật theo thời gian thực.",
  },
  {
    category: "security",
    badge: "🤝 Hỗ trợ",
    question: "Tôi cần hỗ trợ hoặc muốn đề xuất thêm tính năng thì liên hệ ở đâu?",
    answer:
      "Bạn có thể gửi phản hồi trực tiếp qua nút 'Trợ giúp' trên thanh điều hướng hoặc liên hệ kênh Telegram/Email hỗ trợ 24/7 của đội ngũ kỹ thuật.",
  },
];

const CATEGORY_CONFIG: Record<
  Exclude<CategoryId, "all">,
  { icon: LucideIcon; colorClass: string }
> = {
  pricing: {
    icon: Wallet,
    colorClass:
      "text-emerald-500 bg-emerald-500/10 border-emerald-500/20 dark:text-emerald-400",
  },
  quality: {
    icon: SlidersHorizontal,
    colorClass:
      "text-indigo-500 bg-indigo-500/10 border-indigo-500/20 dark:text-indigo-400",
  },
  ads: {
    icon: Megaphone,
    colorClass:
      "text-sky-500 bg-sky-500/10 border-sky-500/20 dark:text-sky-400",
  },
  security: {
    icon: ShieldCheck,
    colorClass:
      "text-teal-500 bg-teal-500/10 border-teal-500/20 dark:text-teal-400",
  },
};

function getBadgeStyle(badge: string) {
  if (badge.includes("Phổ biến"))
    return "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400";
  if (badge.includes("Khuyên dùng"))
    return "border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400";
  if (badge.includes("Tối ưu Ads"))
    return "border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400";
  if (badge.includes("Pro Turbo"))
    return "border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-400";
  if (badge.includes("Bảo mật"))
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
  if (badge.includes("Soạn thảo"))
    return "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400";
  return "border-[var(--border-subtle)] bg-[var(--surface-raised)] text-[var(--ink-secondary)]";
}

export default function FaqSection() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return FAQS.filter((faq) => {
      const matchCategory =
        selectedCategory === "all" || faq.category === selectedCategory;
      if (!matchCategory) return false;
      if (!query) return true;
      return (
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query) ||
        faq.badge.toLowerCase().includes(query)
      );
    });
  }, [selectedCategory, searchQuery]);

  const toggleFaq = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      id="faq"
      className="scroll-mt-20 border-y border-[var(--border-subtle)] bg-[var(--surface)] py-16 sm:py-20"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <ScrollReveal direction="up" duration={600}>
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-3 py-1 text-[11px] font-medium text-[var(--ink-secondary)]">
              <Layers3 className="h-3 w-3" />
              Trung tâm giải đáp FAQ
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--ink-primary)] sm:text-4xl">
              Hỏi đáp thường gặp về Content Studio
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-[13.5px] leading-relaxed text-[var(--ink-secondary)] sm:text-sm">
              Mọi điều bạn cần biết về thuật toán sinh content 3 góc nhìn, chi
              phí gói cước và bảo mật bản quyền.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={120} duration={650}>
          <div className="mt-10">
            {/* Search Bar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ink-secondary)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Tìm nhanh thắc mắc (quảng cáo, hoàn tiền, trùng lặp)..."
                  aria-label="Tìm nhanh câu hỏi thường gặp"
                  className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] py-2.5 pl-10 pr-10 text-[13.5px] text-[var(--ink-primary)] outline-none transition-colors placeholder:text-[var(--ink-secondary)]/70 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label="Xóa từ khóa tìm kiếm"
                    className="absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-[var(--ink-secondary)] transition-colors hover:bg-[var(--surface-raised)] hover:text-[var(--ink-primary)]"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <span className="shrink-0 self-start rounded-full border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-3 py-1.5 text-[11.5px] font-medium text-[var(--ink-secondary)] sm:self-auto">
                Hiển thị {filteredFaqs.length}/{FAQS.length} câu hỏi
              </span>
            </div>

            {/* Category Filter Tabs */}
            <div className="mt-4 flex flex-wrap gap-2">
              {CATEGORIES.map((category) => {
                const Icon = category.icon;
                const isActive = selectedCategory === category.id;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setSelectedCategory(category.id)}
                    aria-pressed={isActive}
                    className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium transition-colors ${
                      isActive
                        ? "border-indigo-600 bg-indigo-600 text-white shadow-xs"
                        : "border-[var(--border-subtle)] bg-[var(--surface-raised)] text-[var(--ink-secondary)] hover:border-indigo-500/40 hover:text-[var(--ink-primary)]"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {category.label}
                  </button>
                );
              })}
            </div>

            {/* Accordion List */}
            <div className="mt-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] p-2 shadow-sm sm:p-3">
              {filteredFaqs.length === 0 ? (
                <div className="px-4 py-10 text-center">
                  <p className="text-sm font-medium text-[var(--ink-primary)]">
                    Không tìm thấy câu hỏi phù hợp
                  </p>
                  <p className="mt-1 text-[13px] text-[var(--ink-secondary)]">
                    Thử từ khóa khác hoặc chọn lại danh mục câu hỏi.
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredFaqs.map((faq, index) => {
                    const isOpen = openIndex === index;
                    const config = CATEGORY_CONFIG[faq.category];
                    const CategoryIcon = config.icon;
                    return (
                      <div
                        key={faq.question}
                        className={`overflow-hidden rounded-xl border transition-all duration-200 ${
                          isOpen
                            ? "border-indigo-500/30 bg-[var(--surface-raised)]/50"
                            : "border-transparent hover:bg-[var(--surface-raised)]/30"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleFaq(index)}
                          aria-expanded={isOpen}
                          className="flex w-full cursor-pointer items-center justify-between gap-4 p-3.5 text-left transition-colors sm:p-4.5"
                        >
                          <span className="flex items-center gap-3 min-w-0">
                            <span
                              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-[var(--ink-secondary)] ${config.colorClass}`}
                            >
                              <CategoryIcon className="h-3.5 w-3.5" />
                            </span>
                            <span className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2.5 min-w-0">
                              <span className="text-[13.5px] font-semibold text-[var(--ink-primary)] sm:text-[14px]">
                                {faq.question}
                              </span>
                              <span
                                className={`w-fit shrink-0 rounded-full border px-2 py-0.5 text-[10.5px] font-semibold ${getBadgeStyle(
                                  faq.badge,
                                )}`}
                              >
                                {faq.badge}
                              </span>
                            </span>
                          </span>
                          <ChevronDown
                            className={`h-4 w-4 shrink-0 text-[var(--ink-secondary)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                              isOpen ? "rotate-180 text-indigo-600 dark:text-indigo-400" : ""
                            }`}
                          />
                        </button>
                        <div
                          className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                            isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                          }`}
                        >
                          <div className="overflow-hidden">
                            <p className="border-t border-[var(--border-subtle)]/60 px-4 py-3.5 text-[13.5px] leading-relaxed text-[var(--ink-secondary)] sm:px-5 sm:py-4 sm:pl-[3.75rem] sm:text-[14px]">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-5 flex flex-col items-start justify-between gap-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-raised)]/60 p-5 sm:flex-row sm:items-center sm:p-6">
              <div>
                <p className="text-sm font-semibold text-[var(--ink-primary)]">
                  Vẫn còn thắc mắc?
                </p>
                <p className="mt-1 text-[13px] text-[var(--ink-secondary)]">
                  Trải nghiệm ngay trên Workspace hoàn toàn miễn phí.
                </p>
              </div>
              <Link
                href="/workspace"
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-indigo-500"
              >
                Dùng thử miễn phí ngay
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}