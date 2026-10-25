import { Quote, Star } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  tag: string;
  initials: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Nguyễn Thu Hà",
    role: 'Chủ shop Thời trang "Lụa Mây", Hà Nội',
    quote:
      "Trước đây mình mất cả tiếng để nghĩ content Facebook Ads, giờ chỉ 15 giây là có ngay 3 góc bài chuẩn PAS. CTR quảng cáo tăng từ 1.8% lên 4.2%!",
    tag: "Facebook Ads · Thời trang",
    initials: "TH",
  },
  {
    name: "Trần Hoàng Nam",
    role: 'Founder Brand Mỹ phẩm Nam "MenGlow", TP.HCM',
    quote:
      "Cực kỳ thích tính năng xem trước TikTok 9:16 và Shopee Feed. Xuất 1-click file txt là team content đăng liền đa kênh, tiết kiệm ít nhất 2 nhân sự viết bài.",
    tag: "TikTok & Shopee · Mỹ phẩm",
    initials: "HN",
  },
  {
    name: "Lê Minh Trang",
    role: "Nhà sáng tạo nội dung & Kinh doanh gia dụng thông minh",
    quote:
      "Gói Free không giới hạn bài viết rất hào phóng, thời gian chờ 45s là vừa đủ để mình đọc và tinh chỉnh bài. Sau đó mình nâng cấp Pro để tạo tức thì, quá xứng đáng!",
    tag: "Pro Turbo · Gia dụng",
    initials: "MT",
  },
];

export default function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="scroll-mt-20 bg-[var(--surface-raised)]/50 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal direction="up" duration={600}>
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-1 text-[11px] font-medium text-[var(--ink-secondary)]">
              Đánh giá thực tế
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--ink-primary)] sm:text-4xl">
              Được tin dùng bởi hơn 2,000+ Nhà bán hàng &amp; Marketer
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--ink-secondary)] sm:text-base">
              Xem cách các chủ shop Facebook, TikTok và Shopee tăng gấp 3 lần lượng
              tương tác và đơn hàng nhờ Content Studio.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((item, index) => (
            <ScrollReveal
              key={item.name}
              direction="up"
              delay={index * 110}
              duration={650}
              className="h-full"
            >
              <figure className="card-interactive relative flex h-full flex-col rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                <Quote
                  className="h-6 w-6 text-[var(--accent-navy)]/25"
                  aria-hidden="true"
                />
                <div
                  className="mt-3 flex items-center gap-0.5 text-amber-500"
                  aria-label="Đánh giá 5 trên 5 sao"
                >
                  {[0, 1, 2, 3, 4].map((star) => (
                    <Star
                      key={star}
                      className="h-4 w-4 fill-amber-400 text-amber-500"
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <blockquote className="mt-3 flex-1 text-[13.5px] leading-relaxed text-[var(--ink-secondary)]">
                  <p>&ldquo;{item.quote}&rdquo;</p>
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-[var(--border-subtle)] pt-4">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--accent-navy)]/[0.1] text-[12px] font-semibold text-[var(--accent-navy)]">
                    {item.initials}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold text-[var(--ink-primary)]">
                      {item.name}
                    </p>
                    <p className="truncate text-[11.5px] text-[var(--ink-tertiary)]">
                      {item.role}
                    </p>
                  </div>
                </figcaption>
                <span className="mt-3 inline-flex w-fit items-center rounded-full bg-[var(--surface-raised)] px-2.5 py-1 text-[10.5px] font-medium text-[var(--ink-secondary)]">
                  {item.tag}
                </span>
              </figure>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}