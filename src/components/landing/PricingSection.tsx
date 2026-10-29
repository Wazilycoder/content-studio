"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { PRICING_PLANS, type PricingPlan } from "@/lib/config/pricing";

type BillingCycle = "monthly" | "yearly";

function resolveDisplayPrice(
  plan: PricingPlan,
  cycle: BillingCycle,
): { main: string; period: string; note: string } {
  if (
    cycle === "yearly" &&
    plan.monthlyEquivalentFormattedPrice &&
    plan.yearlyFormattedPrice
  ) {
    return {
      main: plan.monthlyEquivalentFormattedPrice,
      period: "/tháng",
      note: `Thanh toán ${plan.yearlyFormattedPrice}/năm · Tiết kiệm 35%`,
    };
  }

  return {
    main: plan.formattedPrice,
    period:
      plan.id === "weekly" ? "/tuần" : plan.id === "yearly" ? "/năm" : "/tháng",
    note: plan.duration,
  };
}

export default function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");

  return (
    <section
      id="pricing"
      className="scroll-mt-20 bg-[var(--canvas)] py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal direction="up" duration={600}>
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center rounded-full border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-3 py-1 text-[11px] font-medium text-[var(--ink-secondary)]">
              Bảng giá
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--ink-primary)] sm:text-4xl">
              Bảng giá minh bạch. Không phí duy trì ẩn.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--ink-secondary)] sm:text-base">
              Gói Free Starter tặng sẵn 10 lượt tạo khi đăng ký. Nâng cấp Pro Creator
              hoặc Business để mở khóa toàn bộ quyền lợi bên dưới.
            </p>
          </div>
        </ScrollReveal>

        {/* Billing cycle interactive toggle */}
        <ScrollReveal direction="up" duration={600} delay={120}>
          <div className="mt-8 flex justify-center">
            <div className="inline-flex items-center gap-1 rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] p-1">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`rounded-full px-3.5 py-2 text-xs font-semibold transition-colors duration-150 sm:text-[13px] ${
                  billingCycle === "monthly"
                    ? "bg-[var(--ink-primary)] text-[var(--canvas)]"
                    : "text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
                }`}
              >
                Thanh toán theo tháng
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("yearly")}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition-colors duration-150 sm:text-[13px] ${
                  billingCycle === "yearly"
                    ? "bg-[var(--ink-primary)] text-[var(--canvas)]"
                    : "text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
                }`}
              >
                Thanh toán theo năm
                <span className="text-[11px] font-medium opacity-70">-35%</span>
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Pricing cards — Double-Bezel Hardware Architecture */}
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {PRICING_PLANS.map((plan, planIdx) => {
            const display = resolveDisplayPrice(plan, billingCycle);

            return (
              <ScrollReveal
                key={plan.id}
                direction="up"
                delay={planIdx * 110}
                duration={650}
                className="h-full"
              >
                <div
                  className={`relative flex h-full flex-col rounded-3xl border p-6 sm:p-7 transition-all duration-300 ${
                    plan.highlight
                      ? "border-indigo-500 bg-[var(--surface)] shadow-[0_20px_50px_-15px_rgba(99,102,241,0.25)] ring-2 ring-indigo-500/20 md:-translate-y-2"
                      : "border-[var(--border-subtle)] bg-[var(--surface)] shadow-xs hover:border-[var(--border-strong)]"
                  }`}
                >
                  {plan.highlight ? (
                    <span className="btn-shimmer absolute -top-3.5 left-6 inline-flex items-center rounded-full px-3 py-1 text-[10.5px] font-bold uppercase tracking-wider shadow-sm">
                      ✨ Khuyên dùng nhiều nhất
                    </span>
                  ) : plan.badge ? (
                    <span className="absolute -top-3.5 left-6 inline-flex items-center rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--ink-secondary)]">
                      {plan.badge}
                    </span>
                  ) : null}

                  <h3 className="text-sm font-bold text-[var(--ink-primary)]">
                    {plan.name}
                  </h3>

                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold tracking-tight text-[var(--ink-primary)]">
                      {display.main}
                    </span>
                    <span className="text-sm font-medium text-[var(--ink-tertiary)]">
                      {display.period}
                    </span>
                  </div>

                  <p className="mt-1 text-xs font-medium text-[var(--ink-tertiary)]">
                    {display.note}
                  </p>

                  <p className="mt-3 text-[13px] leading-relaxed text-[var(--ink-secondary)]">
                    {plan.description}
                  </p>

                  <ul className="mt-5 flex-1 space-y-2.5">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-[13px] text-[var(--ink-secondary)]"
                      >
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/workspace"
                    className={`group mt-6 inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                      plan.highlight
                        ? "btn-shimmer text-white shadow-md hover:scale-[1.01]"
                        : "border border-[var(--border-subtle)] bg-[var(--surface-raised)] text-[var(--ink-primary)] hover:border-[var(--border-strong)] hover:bg-[var(--surface)]"
                    }`}
                  >
                    <span>Trải nghiệm trong Studio</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Payment transparency note */}
        <div className="mt-8 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-raised)]/60 px-5 py-4">
          <p className="text-center text-[12.5px] leading-relaxed text-[var(--ink-secondary)]">
            Hệ thống thanh toán tự động VietQR đang ở chế độ thử nghiệm đánh giá.
          </p>
        </div>
      </div>
    </section>
  );
}