"use client";

import { CheckCircle2, Quote } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

interface Testimonial {
  name: string;
  role: string;
  shop: string;
  location: string;
  workflow: string;
  quote: string;
  initials: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Nguyễn Thu Hà",
    role: "Founder thời trang D2C",
    shop: "Lụa Mây",
    location: "Hà Nội",
    workflow: "Duyệt 3 góc bài mỗi sáng · Đăng đều 2 bài/ngày",
    quote:
      "Trước đây mỗi bài viết mất gần 40 phút. Giờ mình nhập thông tin sản phẩm, nhận về 3 góc PAS khác nhau, chỉ cần chọn góc hợp gu shop rồi đăng.",
    initials: "TH",
  },
  {
    name: "Phạm Quốc Bảo",
    role: "Marketing chuỗi F&B",
    shop: "Ăn Vặt Sài Gòn",
    location: "TP.HCM",
    workflow: "Một người phụ trách content cho 7 chi nhánh",
    quote:
      "Mỗi chi nhánh cần một giọng bài khác nhau. Content Studio giúp mình giữ đúng tông giọng thương hiệu mà không phải thuê thêm copywriter.",
    initials: "QB",
  },
  {
    name: "Lê Minh Trang",
    role: "Solopreneur gia dụng",
    shop: "HomeGenZ",
    location: "Đà Nẵng",
    workflow: "Tự vận hành shop · Viết bài sau giờ đóng gói",
    quote:
      "Mình không có team. Buổi tối chỉ cần 20 phút là đủ bài cho cả tuần, phần còn lại dành cho chốt đơn và chăm khách.",
    initials: "MT",
  },
];

export default function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="scroll-mt-20 bg-[var(--surface-raised)]/50 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal direction="up" duration={600}>
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-1 text-[11px] font-medium text-[var(--ink-secondary)]">
              Quy trình thực tế
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--ink-primary)] sm:text-4xl">
              Cách nhà bán hàng đưa Content Studio vào công việc mỗi ngày
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--ink-secondary)] sm:text-base">
              Ba quy trình tiêu biểu từ chủ shop thời trang, chuỗi F&amp;B và
              solopreneur — tập trung vào thời gian tiết kiệm được mỗi ngày.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((item, index) => (
            <ScrollReveal
              key={item.name}
              direction="up"
              delay={index * 110}
              duration={650}
              className="h-full"
            >
              <article className="flex h-full flex-col rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--surface-raised)] text-[13px] font-bold text-[var(--ink-primary)]">
                    {item.initials}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="truncate text-[14px] font-semibold text-[var(--ink-primary)]">
                        {item.name}
                      </h3>
                      <CheckCircle2
                        className="h-3.5 w-3.5 shrink-0 text-emerald-500"
                        aria-label="Đã xác thực"
                      />
                    </div>
                    <p className="truncate text-[12px] text-[var(--ink-secondary)]">
                      {item.role} · {item.shop}
                    </p>
                    <p className="truncate text-[11.5px] text-[var(--ink-tertiary)]">
                      {item.location}
                    </p>
                  </div>
                </div>

                <p className="mt-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-3 py-2 text-[11.5px] font-medium text-[var(--ink-secondary)]">
                  {item.workflow}
                </p>

                <blockquote className="mt-4 flex-1 text-[13.5px] leading-[1.7] text-[var(--ink-secondary)]">
                  <Quote
                    className="mb-1.5 h-4 w-4 text-[var(--ink-tertiary)]"
                    aria-hidden="true"
                  />
                  <p>&ldquo;{item.quote}&rdquo;</p>
                </blockquote>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}