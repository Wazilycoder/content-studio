"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { BorderBeam } from "@/components/ui/BorderBeam";
import { Tilt } from "@/components/ui/Tilt";
import { ShimmerButton } from "@/components/ui/ShimmerButton";
import { useToast } from "@/components/ui/SonnerToast";
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
  const toast = useToast();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");

  return (
    <section
      id="pricing"
      className="relative scroll-mt-20 py-24 sm:py-32 lg:py-40 border-t border-white/[0.08] overflow-hidden"
    >
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,212,146,0.12),rgba(56,189,248,0.06),transparent_70%)] blur-[90px]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" duration={600}>
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/35 bg-[#0A0D15]/80 px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 backdrop-blur-xl shadow-[0_0_20px_rgba(0,212,146,0.25)]">
              <Sparkles className="h-3 w-3" />
              GÓI DỊCH VỤ MINH BẠCH // ROI TỨC THÌ
            </span>
            <h2 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight">
              Đầu tư thông minh cho cỗ máy tăng trưởng.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-300 sm:text-lg">
              Tặng sẵn 10 lượt tạo miễn phí khi đăng ký. Mở khóa gói Pro để không còn thời gian chờ và trải nghiệm sức mạnh tổng hợp tức thì 0s.
            </p>
          </div>
        </ScrollReveal>

        {/* Billing cycle interactive toggle */}
        <ScrollReveal direction="up" duration={600} delay={120}>
          <div className="mt-12 flex justify-center">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.14] bg-[#0A0D15]/85 p-1.5 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.18)]">
              <button
                type="button"
                onClick={() => {
                  setBillingCycle("monthly");
                  toast.info("Đã chọn thanh toán theo tháng");
                }}
                className={`rounded-full px-5 py-2 text-xs font-bold transition-all duration-200 sm:text-sm cursor-pointer active:scale-[0.97] ${
                  billingCycle === "monthly"
                    ? "bg-white/[0.12] text-white shadow-sm border border-white/[0.20]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Thanh toán theo tháng
              </button>
              <button
                type="button"
                onClick={() => {
                  setBillingCycle("yearly");
                  toast.info("Đã chọn thanh toán theo năm · Tiết kiệm 35%");
                }}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold transition-all duration-200 sm:text-sm cursor-pointer active:scale-[0.97] ${
                  billingCycle === "yearly"
                    ? "bg-white/[0.12] text-white shadow-sm border border-white/[0.20]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <span>Thanh toán theo năm</span>
                <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 text-[10.5px] font-bold text-emerald-400 font-mono">
                  -35%
                </span>
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Pricing cards — Tilt 3D + Double-Bezel Hardware Architecture */}
        <div className="mt-16 grid gap-7 md:grid-cols-3 items-stretch">
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
                <Tilt rotationFactor={2} perspective={1200} className="h-full">
                  <div
                    className={`relative flex h-full flex-col rounded-[2.25rem] p-2 transition-all duration-300 ${
                      plan.highlight
                        ? "bg-gradient-to-b from-emerald-500/35 via-emerald-500/10 to-transparent border border-emerald-500/40 shadow-[0_25px_60px_-15px_rgba(0,212,146,0.35)] md:-translate-y-3"
                        : "bg-gradient-to-b from-white/[0.15] via-white/[0.04] to-transparent border border-white/[0.12] shadow-xl hover:border-white/25"
                    } backdrop-blur-3xl`}
                  >
                    <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[calc(2.25rem-0.5rem)] bg-[#0A0D15]/95 p-6 sm:p-8 border border-white/[0.08] backdrop-blur-2xl">
                      {plan.highlight ? (
                        <BorderBeam duration={8} colorFrom="#00D492" colorVia="#38BDF8" colorTo="#00D492" borderWidth={1.5} />
                      ) : null}

                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <h3 className="text-lg font-bold text-white">
                            {plan.name}
                          </h3>
                          {plan.highlight ? (
                            <span className="rounded-full border border-emerald-500/40 bg-emerald-500/20 px-3 py-0.5 font-mono text-[10.5px] font-bold uppercase tracking-wider text-emerald-400">
                              ✨ KHUYÊN DÙNG
                            </span>
                          ) : plan.badge ? (
                            <span className="rounded-full border border-white/[0.12] bg-white/[0.05] px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-300">
                              {plan.badge}
                            </span>
                          ) : null}
                        </div>

                        <div className="mt-4 flex items-baseline gap-1.5">
                          <span className="font-mono text-4xl sm:text-5xl font-black tracking-tight text-white">
                            {display.main}
                          </span>
                          <span className="text-xs font-semibold text-slate-400 uppercase font-mono">
                            {display.period}
                          </span>
                        </div>

                        <p className="mt-1 font-mono text-xs text-slate-400">
                          {display.note}
                        </p>

                        <p className="mt-4 text-xs leading-relaxed text-slate-300">
                          {plan.description}
                        </p>

                        <div className="mt-6 border-t border-white/[0.08] pt-5">
                          <ul className="space-y-3">
                            {plan.features.map((feature) => (
                              <li
                                key={feature}
                                className="flex items-start gap-2.5 text-xs text-slate-200"
                              >
                                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-md border border-emerald-500/30 bg-emerald-500/10 font-mono text-[10px] font-bold text-emerald-400">
                                  ✓
                                </span>
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="mt-8 border-t border-white/[0.08] pt-5">
                        {plan.highlight ? (
                          <Link href="/workspace" className="block w-full">
                            <ShimmerButton
                              shimmerColor="rgba(255, 255, 255, 0.4)"
                              shimmerDuration="2.5s"
                              borderRadius="0.875rem"
                              className="w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 text-slate-950 font-black py-3.5 shadow-[0_0_30px_rgba(0,212,146,0.5)] active:scale-[0.98]"
                            >
                              <div className="flex items-center justify-between w-full">
                                <span>Trải nghiệm Studio Turbo</span>
                                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-950/20 text-slate-950">
                                  <ArrowRight className="h-3.5 w-3.5" />
                                </span>
                              </div>
                            </ShimmerButton>
                          </Link>
                        ) : (
                          <Link
                            href="/workspace"
                            className="group relative inline-flex w-full items-center justify-between gap-2 overflow-hidden rounded-xl border border-white/[0.14] bg-white/[0.05] py-3.5 pl-5 pr-3 text-sm font-bold text-white transition-all hover:bg-white/[0.10] hover:border-white/25 active:scale-[0.98]"
                          >
                            <span>Dùng thử miễn phí</span>
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white transition-transform duration-200 group-hover:translate-x-0.5">
                              <ArrowRight className="h-3.5 w-3.5" />
                            </span>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </Tilt>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Security and SLA assurance */}
        <div className="mt-12 rounded-2xl border border-white/[0.12] bg-[#0A0D15]/80 px-6 py-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300 font-mono backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)]">
          <div className="flex items-center gap-2 text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
            <span>Thanh toán bảo mật VietQR · Kích hoạt GPU tức thì</span>
          </div>
          <span>Cam kết 100% hoàn tiền nếu không hài lòng trong 7 ngày</span>
        </div>
      </div>
    </section>
  );
}
