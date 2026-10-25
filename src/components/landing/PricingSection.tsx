import Link from "next/link";
import { Check, Sparkles, Zap } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { PRICING_PLANS } from "@/lib/config/pricing";

export default function PricingSection() {
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

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {PRICING_PLANS.map((plan, planIdx) => (
            <ScrollReveal
              key={plan.id}
              direction="up"
              delay={planIdx * 110}
              duration={650}
              className="h-full"
            >
              <div
                className={`card-interactive relative flex h-full flex-col rounded-2xl border bg-[var(--surface)] p-6 ${
                  plan.highlight
                    ? "border-[var(--accent-navy)] shadow-md ring-1 ring-[var(--accent-navy)]/30"
                    : "border-[var(--border-subtle)]"
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-[var(--accent-navy)] px-2.5 py-1 text-[11px] font-semibold text-white shadow-xs">
                    <Sparkles className="h-3 w-3 animate-spin text-amber-300 [animation-duration:4s]" />
                    {plan.badge}
                  </span>
                )}
                <h3 className="text-sm font-semibold text-[var(--ink-primary)]">{plan.name}</h3>
                <div className="mt-3 flex items-baseline gap-1.5">
                  <span className="text-3xl font-semibold tracking-tight text-[var(--ink-primary)]">
                    {plan.formattedPrice}
                  </span>
                </div>
                <p className="mt-1 text-xs font-medium text-[var(--accent-navy)]">
                  {plan.duration}
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
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-navy)]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`btn-tactile mt-6 inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 active:scale-98 ${
                    plan.highlight
                      ? "bg-[var(--accent-navy)] text-white shadow-xs hover:bg-[var(--accent-navy-hover)] hover:shadow-[0_6px_16px_rgba(37,52,199,0.2)]"
                      : "border border-[var(--border-subtle)] bg-[var(--surface)] text-[var(--ink-primary)] hover:bg-[var(--surface-raised)] hover:border-[var(--border-strong)]"
                  }`}
                >
                  {plan.highlight ? `Nâng cấp ${plan.tierBadge}` : `Chọn gói ${plan.tierBadge}`}
                </Link>
              </div>
            </ScrollReveal>
                    ))}
                  </div>

                  <div className="mt-8 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-raised)]/60 p-5">
                    <p className="flex items-center justify-center gap-1.5 text-center text-[12.5px] font-semibold text-[var(--ink-primary)]">
                      <Zap className="h-4 w-4 fill-emerald-500 text-emerald-500" />
                      <span>Pro Turbo — Tạo tức thì, không chờ đợi</span>
                    </p>
                    <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                      {[
                        "0s Chờ đợi — Tạo tức thì liên tục",
                        "Không giới hạn bài viết",
                        "Lưu trữ lịch sử vĩnh viễn",
                      ].map((benefit) => (
                        <span
                          key={benefit}
                          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-1 text-[11.5px] font-medium text-[var(--ink-secondary)]"
                        >
                          <Check className="h-3.5 w-3.5 text-[var(--accent-navy)]" />
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            );
          }