"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Layers3 } from "lucide-react";
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
              Gói Miễn Phí: Không giới hạn số bài tạo vĩnh viễn (Cooldown 45s sạc năng
              lượng). Nâng cấp Pro Turbo: 0s Cooldown tạo tức thì, ưu tiên GPU.
            </p>
          </div>
        </ScrollReveal>

        {/* Billing cycle interactive toggle */}
        <ScrollReveal direction="up" duration={600} delay={120}>
          <div className="mt-8 flex justify-center">
            <div className="inline-flex items-center gap-1 rounded-full border border-zinc-200/90 bg-white p-1 shadow-sm dark:border-white/10 dark:bg-white/5">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`rounded-full px-3.5 py-2 text-xs font-semibold transition-all duration-200 sm:text-[13px] ${
                  billingCycle === "monthly"
                    ? "bg-zinc-900 text-white shadow-sm dark:bg-white dark:text-zinc-900"
                    : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                }`}
              >
                Thanh toán theo tháng
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("yearly")}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition-all duration-200 sm:text-[13px] ${
                  billingCycle === "yearly"
                    ? "bg-zinc-900 text-white shadow-sm dark:bg-white dark:text-zinc-900"
                    : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                }`}
              >
                Thanh toán theo năm
                <span className="inline-flex items-center rounded-full bg-emerald-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  -35%<span className="hidden sm:inline">&nbsp;Tiết kiệm</span>
                </span>
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
                  className={`relative h-full rounded-[2rem] border p-2 transition-all duration-300 ${
                    plan.highlight
                      ? "border-transparent bg-gradient-to-b from-indigo-500 via-sky-500 to-emerald-500/80 shadow-[0_24px_60px_-24px_rgba(79,70,229,0.5)] hover:shadow-[0_30px_70px_-24px_rgba(79,70,229,0.6)]"
                      : "border-zinc-200/90 bg-gradient-to-b from-zinc-100 to-zinc-50 dark:border-white/10 dark:from-white/[0.08] dark:to-white/[0.02]"
                  }`}
                >
                  <div className="relative flex h-full flex-col rounded-[calc(2rem-0.5rem)] bg-white/95 p-6 backdrop-blur-md dark:bg-[#18181B]/95">
                    {plan.highlight ? (
                      <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg shadow-indigo-600/30">
                        <Layers3 className="h-3 w-3" />
                        KHUYÊN DÙNG · 85% CHỦ SHOP LỰA CHỌN
                      </span>
                    ) : plan.badge ? (
                      <span className="absolute -top-3 left-6 inline-flex items-center rounded-full border border-zinc-200/90 bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-700 shadow-sm dark:border-white/10 dark:bg-[#18181B] dark:text-zinc-200">
                        {plan.badge}
                      </span>
                    ) : null}

                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                      {plan.name}
                    </h3>

                    <div className="mt-3 flex items-baseline gap-1">
                      <span className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
                        {display.main}
                      </span>
                      <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        {display.period}
                      </span>
                    </div>

                    <p
                      className={`mt-1 text-xs font-medium ${
                        plan.highlight
                          ? "text-indigo-600 dark:text-indigo-400"
                          : "text-zinc-500 dark:text-zinc-400"
                      }`}
                    >
                      {display.note}
                    </p>

                    <p className="mt-3 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-400">
                      {plan.description}
                    </p>

                    <ul className="mt-5 flex-1 space-y-2.5">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2 text-[13px] text-zinc-600 dark:text-zinc-300"
                        >
                          <Check
                            className={`mt-0.5 h-4 w-4 shrink-0 ${
                              plan.highlight
                                ? "text-indigo-600 dark:text-indigo-400"
                                : "text-emerald-600 dark:text-emerald-400"
                            }`}
                          />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href="/register"
                      className={`group mt-6 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 active:scale-[0.98] ${
                        plan.highlight
                          ? "bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 text-white shadow-lg shadow-indigo-600/25 hover:shadow-xl hover:shadow-indigo-600/40"
                          : "border border-zinc-200/90 bg-white text-zinc-900 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-white/20"
                      }`}
                    >
                      {plan.highlight
                        ? `Nâng cấp ${plan.tierBadge}`
                        : `Chọn gói ${plan.tierBadge}`}
                      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Live GPU Cluster Runtime Status Bar */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-200/90 bg-[var(--surface-raised)]/70 p-5 backdrop-blur dark:border-white/10">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10B981]" />
              <span className="text-center text-[12.5px] font-semibold text-[var(--ink-primary)] sm:text-left">
                Hệ thống GPU:{" "}
                <span className="text-emerald-600 dark:text-emerald-400">
                  12x NVIDIA H100 SXM5
                </span>{" "}
                · 0s Hàng đợi (Active Cluster)
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {["0s Cooldown", "100% Anti-AI-Slop", "SLA 99.98%"].map((metric) => (
                <span
                  key={metric}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-1 text-[11.5px] font-medium text-[var(--ink-secondary)]"
                >
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  {metric}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}