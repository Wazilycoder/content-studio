import Link from "next/link";
import { Check, Sparkles } from "lucide-react";

interface Plan {
  name: string;
  price: string;
  unit: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  highlight: boolean;
  badge?: string;
}

const PLANS: Plan[] = [
  {
    name: "Khởi Đầu",
    price: "0đ",
    unit: "10 lượt tạo tặng sẵn",
    description: "Dành cho chủ shop trải nghiệm chất lượng.",
    features: [
      "10 lượt tạo miễn phí",
      "Đầy đủ 3 góc nhìn",
      "3 headlines + 5 hashtags",
      "Bộ đếm ký tự Unicode",
    ],
    cta: "Dùng thử miễn phí",
    href: "/register",
    highlight: false,
  },
  {
    name: "Chủ Shop",
    price: "99.000đ",
    unit: "100 lượt tạo",
    description: "~990đ/bài viết, rẻ hơn 50 lần thuê cộng tác viên content.",
    features: [
      "100 lượt tạo",
      "Lưu lịch sử 50 bài viết",
      "Đầy đủ 7 tông giọng",
      "Không tự động gia hạn thẻ",
    ],
    cta: "Chọn gói Chủ Shop",
    href: "/register",
    highlight: true,
    badge: "Phổ biến",
  },
  {
    name: "Đội Ngũ / Agency",
    price: "399.000đ",
    unit: "500 lượt tạo",
    description: "Xử lý hàng trăm sản phẩm mỗi tháng.",
    features: [
      "500 lượt tạo",
      "Xử lý hàng trăm sản phẩm",
      "Fallback AI đa nguồn",
      "Hỗ trợ ưu tiên",
    ],
    cta: "Chọn gói Đội Ngũ",
    href: "/register",
    highlight: false,
  },
];

export default function PricingSection() {
  return (
    <section
      id="pricing"
      className="scroll-mt-20 bg-[var(--canvas)] py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-3 py-1 text-[11px] font-medium text-[var(--ink-secondary)]">
            Bảng giá
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--ink-primary)] sm:text-4xl">
            Bảng giá minh bạch. Không phí duy trì ẩn.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--ink-secondary)] sm:text-base">
            Đăng ký nhận ngay 10 lượt tạo miễn phí. Nạp thêm lượt khi cần, không tự
            động gia hạn thẻ.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border bg-[var(--surface)] p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] ${
                plan.highlight
                  ? "border-[var(--accent-navy)] shadow-md"
                  : "border-[var(--border-subtle)]"
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-[var(--accent-navy)] px-2.5 py-1 text-[11px] font-semibold text-white shadow-xs">
                  <Sparkles className="h-3 w-3" />
                  {plan.badge}
                </span>
              )}
              <h3 className="text-sm font-semibold text-[var(--ink-primary)]">{plan.name}</h3>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="text-3xl font-semibold tracking-tight text-[var(--ink-primary)]">
                  {plan.price}
                </span>
              </div>
              <p className="mt-1 text-xs font-medium text-[var(--accent-navy)]">{plan.unit}</p>
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
                href={plan.href}
                className={`btn-tactile mt-6 inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                  plan.highlight
                    ? "bg-[var(--accent-navy)] text-white shadow-xs hover:bg-[var(--accent-navy-hover)]"
                    : "border border-[var(--border-subtle)] bg-[var(--surface)] text-[var(--ink-primary)] hover:bg-[var(--surface-raised)]"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}