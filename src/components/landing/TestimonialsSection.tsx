"use client";

import { BadgeCheck } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

interface VelocityCase {
  segment: string;
  operator: string;
  before: string;
  after: string;
  delta: string;
  deltaNote: string;
  outcome: string;
}

const CASES: VelocityCase[] = [
  {
    segment: "Founder D2C thời trang",
    operator: "Lụa Mây · Hà Nội",
    before: "40 phút viết một bài",
    after: "0.5s tạo 3 góc PAS / AIDA / FAB",
    delta: "18h",
    deltaNote: "tiết kiệm mỗi tháng",
    outcome:
      "Giữ nhịp đăng 2 bài/ngày mà không phải thuê copywriter ngoài.",
  },
  {
    segment: "Chuỗi F&B đa chi nhánh",
    operator: "7 chi nhánh · TP.HCM",
    before: "7 tài khoản viết bài rời rạc",
    after: "1 người quản lý · 3 tông giọng độc lập",
    delta: "7→1",
    deltaNote: "đầu mối nội dung",
    outcome:
      "Bản sắc thương hiệu từng chi nhánh được giữ nguyên, không lẫn giọng.",
  },
  {
    segment: "Solopreneur bán lẻ",
    operator: "HomeGenZ · Đà Nẵng",
    before: "Viết bài rải rác cả tuần",
    after: "20 phút buổi tối đủ nội dung cả tuần",
    delta: "100%",
    deltaNote: "thời gian dồn cho chốt đơn",
    outcome:
      "Buổi tối dành trọn cho đóng gói và chăm khách, không còn ngồi nghĩ caption.",
  },
];

export default function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="scroll-mt-20 bg-[var(--surface-raised)]/50 py-12 sm:py-14 border-t border-[var(--border-hairline)]"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal direction="up" duration={600}>
          <div className="mx-auto max-w-2xl text-center">
            <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[var(--ink-tertiary)]">
              {"[Proven Workflows // Production Telemetry]"}
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--ink-primary)] sm:text-4xl">
              Đo lường sự chuyển biến trong quy trình sáng tạo.
            </h2>
            <p className="mt-3 text-[13.5px] leading-relaxed text-[var(--ink-secondary)] sm:text-sm">
              Ba pipeline thực chiến, đo bằng thời gian tiết kiệm được và số đầu
              mối nội dung giảm xuống.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {CASES.map((item, index) => (
            <ScrollReveal
              key={item.segment}
              direction="up"
              delay={index * 110}
              duration={650}
              className="h-full"
            >
              <article className="h-full rounded-[26px] border border-[var(--border-subtle)] bg-[var(--surface-raised)]/60 p-1.5">
                <div className="flex h-full flex-col rounded-[20px] border border-[var(--border-hairline)] bg-[var(--surface)] p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-[13.5px] font-semibold text-[var(--ink-primary)]">
                        {item.segment}
                      </h3>
                      <p className="mt-0.5 truncate font-mono text-[10.5px] uppercase tracking-[0.1em] text-[var(--ink-tertiary)]">
                        {item.operator}
                      </p>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.1em] text-[var(--brand)]">
                      <BadgeCheck className="h-2.5 w-2.5" aria-hidden="true" />
                      Verified Pipeline
                    </span>
                  </div>

                  <dl className="mt-4 space-y-2 border-y border-[var(--border-hairline)] py-3">
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-[var(--ink-tertiary)]">
                        Trước
                      </dt>
                      <dd className="text-right font-mono text-[11.5px] tabular-nums text-[var(--ink-secondary)]">
                        {item.before}
                      </dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-[var(--ink-tertiary)]">
                        Sau
                      </dt>
                      <dd className="text-right text-[12px] font-semibold text-[var(--ink-primary)]">
                        {item.after}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="font-mono text-3xl font-semibold leading-none tabular-nums text-[var(--brand)]">
                      {item.delta}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--ink-tertiary)]">
                      {item.deltaNote}
                    </span>
                  </div>

                  <p className="mt-3 flex-1 text-[12.5px] leading-relaxed text-[var(--ink-secondary)]">
                    {item.outcome}
                  </p>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}