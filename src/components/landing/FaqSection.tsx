"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, Search, X } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

type CategoryId = "all" | "pricing" | "quality" | "ads" | "security";

interface FaqItem {
  category: Exclude<CategoryId, "all">;
  tag: string;
  question: string;
  answer: string;
}

interface CategoryMeta {
  id: CategoryId;
  label: string;
  code: string;
}

const CATEGORIES: CategoryMeta[] = [
  { id: "all", label: "Tất cả", code: "ALL" },
  { id: "pricing", label: "Chi phí & Gói", code: "PRICING" },
  { id: "quality", label: "Chuẩn Anti-AI-Slop", code: "ANTI-SLOP" },
  { id: "ads", label: "Facebook & Insta Ads", code: "FB-ADS" },
  { id: "security", label: "Bảo mật & Supabase RLS", code: "SECURITY" },
];

const FAQS: FaqItem[] = [
  {
    category: "quality",
    tag: "ANTI-SLOP",
    question: "Bài viết sinh ra có bị trùng lặp với các shop đối thủ không?",
    answer:
      "Hoàn toàn không. Thuật toán phân tích ngữ nghĩa độc lập từ tên sản phẩm, công năng và khách hàng mục tiêu của bạn để kiến tạo 3 góc bài viết độc bản: PAS (Vấn đề - Giải pháp), Cảm xúc và Trực diện tính năng. Không có bài viết nào giống nhau.",
  },
  {
    category: "pricing",
    tag: "PRICING",
    question: "Gói Free có bị giới hạn tính năng hay gắn watermark không?",
    answer:
      "Gói Miễn phí không giới hạn số lượng bài viết tạo ra, không gắn watermark và hỗ trợ đầy đủ 3 góc bài viết. Chỉ có thời gian chờ (cooldown) 45 giây giữa các lần tạo để bảo đảm tài nguyên server.",
  },
  {
    category: "quality",
    tag: "QUALITY",
    question: "Bài viết AI có bị Facebook hoặc Instagram bóp tương tác không?",
    answer:
      "Không. Content Studio tích hợp bộ lọc Anti-AI-Slop độc quyền, chủ động loại bỏ các từ ngữ sáo rỗng, nhịp câu máy móc, và bổ sung các điểm ngắt nhịp tự nhiên giống 100% văn phong người viết thực tế.",
  },
  {
    category: "ads",
    tag: "ADS-OPTIM",
    question: "Tôi có thể dùng nội dung này để chạy Facebook & Instagram Ads không?",
    answer:
      "Cực kỳ phù hợp. Định dạng 3 góc bài viết được thiết kế chuẩn cấu trúc A/B Testing: Bạn có thể lấy Góc 1 test nhóm khách hàng đang gặp nỗi đau, Góc 2 cho tệp cảm xúc và Góc 3 cho tệp so sánh tính năng.",
  },
  {
    category: "pricing",
    tag: "GPU-TURBO",
    question: "Nâng cấp lên Chủ Shop Turbo (99.000đ) mang lại lợi ích gì?",
    answer:
      "Bạn được kích hoạt cụm xử lý GPU chuyên biệt, loại bỏ hoàn toàn 45s thời gian chờ (tạo bài tức thì 0s), lưu trữ lịch sử không giới hạn và hỗ trợ ưu tiên khi cần tinh chỉnh prompt theo ngách.",
  },
  {
    category: "security",
    tag: "RLS-GUARD",
    question: "Dữ liệu kinh doanh và ý tưởng sản phẩm của tôi có được bảo mật không?",
    answer:
      "Dữ liệu của bạn được cô lập tuyệt đối theo kiến trúc Row Level Security (RLS) của Supabase. Chúng tôi không bao giờ dùng mô tả sản phẩm của bạn để train model công cộng.",
  },
  {
    category: "quality",
    tag: "EDITOR",
    question: "Tôi có thể chỉnh sửa trực tiếp nội dung trước khi copy không?",
    answer:
      "Có. Ngay trên mỗi thẻ bài viết, bạn chỉ cần bấm nút 'Chỉnh sửa' là có thể gõ thêm câu chữ, icon hoặc số điện thoại. Bộ đếm ký tự Facebook/Instagram sẽ cập nhật theo thời gian thực.",
  },
  {
    category: "security",
    tag: "SUPPORT",
    question: "Tôi cần hỗ trợ hoặc muốn đề xuất thêm tính năng thì liên hệ ở đâu?",
    answer:
      "Bạn có thể gửi phản hồi trực tiếp qua nút 'Trợ giúp' trên thanh điều hướng hoặc liên hệ kênh Telegram/Email hỗ trợ 24/7 của đội ngũ kỹ thuật.",
  },
];

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
        faq.answer.toLowerCase().includes(query)
      );
    });
  }, [selectedCategory, searchQuery]);

  const toggleFaq = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      id="faq"
      className="relative scroll-mt-20 border-t border-white/[0.08] py-24 sm:py-32 lg:py-40 overflow-hidden"
    >
      {/* Soft ambient background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[650px] rounded-full bg-emerald-500/[0.04] blur-[130px]" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
        <ScrollReveal direction="up" duration={600}>
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.14] bg-[#0A0D15]/80 px-4 py-1.5 text-[11px] font-mono font-semibold tracking-wider uppercase text-emerald-400 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.18)]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              FAQ KNOWLEDGE BASE // DIRECT ANSWERS
            </span>
            <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-100 sm:text-4xl lg:text-5xl leading-tight">
              Hỏi đáp thường gặp về{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300">
                Content Studio
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[14px] leading-relaxed text-slate-400 sm:text-base">
              Mọi điều bạn cần biết về thuật toán sinh content 3 góc nhìn, chi
              phí gói cước và bảo mật bản quyền.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={120} duration={650}>
          <div className="mt-14">
            {/* Search Bar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Tìm nhanh thắc mắc (quảng cáo, hoàn tiền, trùng lặp)..."
                  aria-label="Tìm nhanh câu hỏi thường gặp"
                  className="w-full rounded-2xl border border-white/[0.12] bg-[#0A0D15]/80 py-3.5 pl-11 pr-10 text-[13.5px] text-slate-100 outline-none backdrop-blur-2xl transition-all placeholder:text-slate-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)] focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label="Xóa từ khóa tìm kiếm"
                    className="absolute right-3.5 top-1/2 flex h-5 w-5 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <span className="shrink-0 self-start rounded-full border border-white/[0.10] bg-white/[0.03] px-4 py-2.5 text-[12px] font-mono font-medium text-slate-400 backdrop-blur-xl sm:self-auto">
                <span className="font-bold text-emerald-400">{filteredFaqs.length}</span>/{FAQS.length} CÂU HỎI
              </span>
            </div>

            {/* Category Segmented Glass Switcher (Replaces AI slop icon buttons) */}
            <div className="mt-4 flex flex-wrap gap-2">
              {CATEGORIES.map((category) => {
                const isActive = selectedCategory === category.id;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setSelectedCategory(category.id)}
                    aria-pressed={isActive}
                    className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-[12px] font-mono font-bold transition-all duration-200 active:scale-[0.97] ${
                      isActive
                        ? "border-emerald-500/60 bg-emerald-500/15 text-emerald-300 shadow-[0_0_20px_-5px_rgba(0,212,146,0.4),inset_0_1px_1px_rgba(255,255,255,0.2)] backdrop-blur-xl"
                        : "border-white/[0.10] bg-[#0A0D15]/60 text-slate-400 hover:border-white/[0.20] hover:text-slate-200 backdrop-blur-xl"
                    }`}
                  >
                    <span className="text-[10px] opacity-70">[{category.code}]</span>
                    <span>{category.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Accordion List with Double Bezel Glass */}
            <div className="mt-6 rounded-[2.25rem] border border-white/[0.12] bg-white/[0.02] p-2.5 backdrop-blur-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.65),inset_0_1px_1px_rgba(255,255,255,0.15)] sm:p-3">
              {filteredFaqs.length === 0 ? (
                <div className="px-4 py-12 text-center">
                  <p className="text-sm font-medium text-slate-200">
                    Không tìm thấy câu hỏi phù hợp
                  </p>
                  <p className="mt-1 text-[13px] text-slate-400">
                    Thử từ khóa khác hoặc chọn lại danh mục câu hỏi.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredFaqs.map((faq, index) => {
                    const isOpen = openIndex === index;
                    return (
                      <div
                        key={faq.question}
                        className={`overflow-hidden rounded-2xl border transition-all duration-280 ${
                          isOpen
                            ? "border-emerald-500/40 bg-[#0A0D15]/95 shadow-[0_10px_30px_-10px_rgba(0,212,146,0.15),inset_0_1px_1px_rgba(255,255,255,0.16)]"
                            : "border-white/[0.06] bg-[#0A0D15]/60 hover:border-white/[0.14] hover:bg-[#0A0D15]/80 backdrop-blur-xl"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleFaq(index)}
                          aria-expanded={isOpen}
                          className="flex w-full cursor-pointer items-center justify-between gap-4 p-4 text-left transition-colors sm:p-5"
                        >
                          <span className="flex min-w-0 items-center gap-3">
                            <span
                              className={`shrink-0 rounded-md border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider transition-colors ${
                                isOpen
                                  ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-400"
                                  : "border-white/[0.10] bg-white/[0.04] text-slate-400"
                              }`}
                            >
                              {faq.tag}
                            </span>
                            <span className="min-w-0 text-[14px] font-semibold text-slate-100 sm:text-[15px]">
                              {faq.question}
                            </span>
                          </span>
                          <ChevronDown
                            className={`h-4 w-4 shrink-0 transition-transform duration-[280ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                              isOpen ? "rotate-180 text-emerald-400" : "text-slate-400"
                            }`}
                          />
                        </button>
                        <div
                          className={`grid transition-[grid-template-rows] duration-[280ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                            isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                          }`}
                        >
                          <div className="overflow-hidden">
                            <p className="border-t border-white/[0.08] px-4 py-4 text-[13.5px] leading-relaxed text-slate-300 sm:px-6 sm:py-5 sm:pl-[4.5rem] sm:text-[14px]">
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

            {/* Bottom Glass Callout */}
            <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-2xl border border-white/[0.12] bg-[#0A0D15]/85 p-6 backdrop-blur-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)] sm:flex-row sm:items-center sm:p-7">
              <div>
                <p className="text-base font-semibold text-slate-100">
                  Vẫn còn thắc mắc về Content Studio?
                </p>
                <p className="mt-1 text-[13px] text-slate-400">
                  Trải nghiệm trực tiếp trên Workspace hoàn toàn miễn phí không cần thẻ tín dụng.
                </p>
              </div>
              <Link
                href="/workspace"
                className="group relative inline-flex shrink-0 items-center gap-2.5 overflow-hidden rounded-xl bg-emerald-500 px-5 py-3 text-[13px] font-semibold text-slate-950 transition-all duration-200 hover:bg-emerald-400 hover:shadow-[0_0_25px_rgba(0,212,146,0.4)] active:scale-[0.98]"
              >
                <span>Dùng thử miễn phí ngay</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
