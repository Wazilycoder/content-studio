"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  CSSProperties,
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Layers3,
  Pause,
  Play,
  Quote,
  Star,
} from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

interface Testimonial {
  name: string;
  role: string;
  shop: string;
  location: string;
  metric: string;
  quote: string;
  avatar: string;
  initials: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Nguyễn Thu Hà",
    role: "Chủ shop Thời trang",
    shop: "Lụa Mây",
    location: "Hà Nội",
    metric: "CTR 4.2% Facebook Ads",
    quote:
      "Mình bỏ hẳn kiểu content AI chung chung. Content Studio trả về 3 góc bài PAS khác nhau trong 15 giây, đọc là thấy đúng giọng shop. CTR quảng cáo tăng từ 1.8% lên 4.2%.",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&h=160&q=80",
    initials: "TH",
  },
  {
    name: "Trần Hoàng Nam",
    role: "Founder Mỹ phẩm Nam",
    shop: "MenGlow",
    location: "TP.HCM",
    metric: "+320% Doanh thu TikTok",
    quote:
      "Tính năng xem trước TikTok 9:16 và Shopee Feed cực thực dụng. Một người viết, xuất 1-click là team đăng đa kênh ngay — tiết kiệm 2 nhân sự content, doanh thu tăng 320%.",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&h=160&q=80",
    initials: "HN",
  },
  {
    name: "Lê Minh Trang",
    role: "Kênh Gia dụng thông minh",
    shop: "HomeGenZ",
    location: "Đà Nẵng",
    metric: "100K+ Followers TikTok Shop",
    quote:
      "Gói Free không giới hạn bài viết rất hào phóng. Mình dùng 3 góc bài mỗi ngày cho kênh gia dụng, giọng văn tự nhiên không sáo rỗng, giờ đã chạm 100K followers.",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=160&h=160&q=80",
    initials: "MT",
  },
  {
    name: "Phạm Quốc Bảo",
    role: "Chủ chuỗi F&B 7 chi nhánh",
    shop: "Ăn Vặt Sài Gòn",
    location: "TP.HCM",
    metric: "Đơn ShopeeFood x2.5",
    quote:
      "Content PAS do Content Studio tạo ra không bị kiểu “văn máy”. Đơn ShopeeFood của cả 7 chi nhánh tăng 2.5 lần chỉ sau 6 tuần đăng bài đều đặn.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&h=160&q=80",
    initials: "QB",
  },
  {
    name: "Vũ Thu Thủy",
    role: "Đại lý Phụ kiện Công nghệ",
    shop: "TechSavvy",
    location: "Hải Phòng",
    metric: "Tiết kiệm 15h mỗi tuần",
    quote:
      "Trước đây mỗi tuần mình mất 15 tiếng viết bài cho 4 sàn. Giờ chỉ cần duyệt lại và tinh chỉnh, thời gian còn lại dồn hết cho việc nhập hàng và chốt đơn.",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&h=160&q=80",
    initials: "TT",
  },
];

const AUTO_PLAY_MS = 4000;
const SWIPE_THRESHOLD = 45;

function getOffset(index: number, activeIndex: number, total: number): number {
  let offset = index - activeIndex;
  if (offset > total / 2) offset -= total;
  if (offset < -total / 2) offset += total;
  return offset;
}

function getCardStyle(offset: number): CSSProperties {
  if (offset === 0) {
    return {
      transform:
        "translate(-50%, -50%) translateX(0) translateZ(0) rotateY(0deg) scale(1.04)",
      opacity: 1,
      zIndex: 20,
    };
  }
  if (offset === -1) {
    return {
      transform:
        "translate(-50%, -50%) translateX(-65%) rotateY(18deg) scale(0.92)",
      opacity: 0.55,
      zIndex: 10,
    };
  }
  if (offset === 1) {
    return {
      transform:
        "translate(-50%, -50%) translateX(65%) rotateY(-18deg) scale(0.92)",
      opacity: 0.55,
      zIndex: 10,
    };
  }
  return {
    transform: `translate(-50%, -50%) translateX(${offset * 70}%) rotateY(${
      offset > 0 ? -28 : 28
    }deg) scale(0.82)`,
    opacity: 0,
    zIndex: 0,
  };
}

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef<number | null>(null);
  const total = TESTIMONIALS.length;

  const goTo = useCallback(
    (direction: 1 | -1) => {
      setActiveIndex((prev) => (prev + direction + total) % total);
    },
    [total],
  );

  useEffect(() => {
    if (!isAutoPlaying || isHovering || isDragging) return;
    const timer = window.setInterval(() => {
      setActiveIndex((activeIndex + 1) % total);
    }, AUTO_PLAY_MS);
    return () => window.clearInterval(timer);
  }, [activeIndex, isAutoPlaying, isDragging, isHovering, total]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    dragStartX.current = event.clientX;
    setIsDragging(true);
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const startX = dragStartX.current;
    dragStartX.current = null;
    setIsDragging(false);
    if (startX === null) return;
    const delta = event.clientX - startX;
    if (delta <= -SWIPE_THRESHOLD) goTo(1);
    else if (delta >= SWIPE_THRESHOLD) goTo(-1);
  };

  const handlePointerCancel = () => {
    dragStartX.current = null;
    setIsDragging(false);
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(1);
    }
  };

  return (
    <section
      id="testimonials"
      className="scroll-mt-20 overflow-hidden bg-[var(--surface-raised)]/50 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal direction="up" duration={600}>
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-1 text-[11px] font-medium text-[var(--ink-secondary)]">
              <Layers3 className="h-3 w-3" aria-hidden="true" />
              Đánh giá đã xác thực
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

        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="Đánh giá từ nhà bán hàng"
          tabIndex={0}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onPointerLeave={handlePointerCancel}
          onKeyDown={handleKeyDown}
          className="relative mx-auto mt-12 h-[420px] w-full max-w-4xl rounded-3xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-navy)]/40 sm:h-[400px]"
          style={{ perspective: "1200px", touchAction: "pan-y" }}
        >
          <div
            className="relative h-full w-full"
            style={{ transformStyle: "preserve-3d" }}
          >
            {TESTIMONIALS.map((item, index) => {
              const offset = getOffset(index, activeIndex, total);
              const isActive = offset === 0;
              const isAdjacent = Math.abs(offset) === 1;

              return (
                <article
                  key={item.name}
                  aria-hidden={!isActive}
                  onClick={() => {
                    if (isAdjacent) setActiveIndex(index);
                  }}
                  style={{
                    ...getCardStyle(offset),
                    transition: "all 500ms cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                  className={[
                    "absolute left-1/2 top-1/2 h-full w-[86%] max-w-[24rem] flex-col overflow-hidden rounded-3xl border bg-[var(--surface)] p-6 text-left",
                    isActive ? "flex" : isAdjacent ? "hidden md:flex" : "hidden",
                    isAdjacent ? "cursor-pointer" : "",
                    isActive
                      ? "border-[var(--accent-navy)]/25 ring-1 ring-[var(--accent-navy)]/10 shadow-[0_28px_60px_-28px_rgba(15,23,42,0.45)]"
                      : "border-[var(--border-subtle)] shadow-[0_18px_40px_-30px_rgba(15,23,42,0.35)] dark:border-white/10",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-3">
                    <span className="relative inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] p-[2px] ring-2 ring-[var(--accent-navy)]/10">
                      <span className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-[var(--accent-navy)]/[0.1] text-[12px] font-semibold text-[var(--accent-navy)]">
                        {item.initials}
                        <img
                          src={item.avatar}
                          alt={item.name}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          className="absolute inset-0 h-full w-full object-cover"
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                        />
                      </span>
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate text-[13.5px] font-semibold text-[var(--ink-primary)]">
                          {item.name}
                        </p>
                        <CheckCircle2
                          className="h-3.5 w-3.5 shrink-0 text-emerald-500"
                          aria-label="Đã xác thực doanh thu"
                        />
                      </div>
                      <p className="truncate text-[11.5px] text-[var(--ink-tertiary)]">
                        {item.role}
                      </p>
                      <p className="truncate text-[11.5px] font-medium text-[var(--ink-secondary)]">
                        {item.shop} · {item.location}
                      </p>
                    </div>
                  </div>

                  <span className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <Layers3 className="h-3 w-3" aria-hidden="true" />
                    {item.metric}
                  </span>

                  <div
                    className="mt-3 flex items-center gap-0.5 text-amber-500"
                    aria-label="Đánh giá 5 trên 5 sao"
                  >
                    {[0, 1, 2, 3, 4].map((star) => (
                      <Star
                        key={star}
                        className="h-3.5 w-3.5 fill-amber-400 text-amber-500 drop-shadow-[0_0_3px_rgba(251,191,36,0.45)]"
                        aria-hidden="true"
                      />
                    ))}
                  </div>

                  <blockquote className="mt-3 flex-1 overflow-hidden text-[13px] leading-relaxed text-[var(--ink-secondary)]">
                    <Quote
                      className="mb-1 h-4 w-4 text-[var(--accent-navy)]/30"
                      aria-hidden="true"
                    />
                    <p>&ldquo;{item.quote}&rdquo;</p>
                  </blockquote>
                </article>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => goTo(-1)}
            aria-label="Đánh giá trước"
            className="absolute left-0 top-1/2 z-30 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--surface)]/90 text-[var(--ink-secondary)] shadow-lg backdrop-blur transition hover:text-[var(--ink-primary)] hover:shadow-xl md:flex"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => goTo(1)}
            aria-label="Đánh giá tiếp theo"
            className="absolute right-0 top-1/2 z-30 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--surface)]/90 text-[var(--ink-secondary)] shadow-lg backdrop-blur transition hover:text-[var(--ink-primary)] hover:shadow-xl md:flex"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => goTo(-1)}
            aria-label="Đánh giá trước"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] text-[var(--ink-secondary)] transition hover:text-[var(--ink-primary)] md:hidden"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>

          <div className="flex items-center gap-1.5">
            {TESTIMONIALS.map((item, index) => (
              <button
                key={item.name}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Xem đánh giá của ${item.name}`}
                aria-current={index === activeIndex ? "true" : undefined}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? "w-7 bg-[var(--accent-navy)]"
                    : "w-2 bg-[var(--border-subtle)] hover:bg-[var(--ink-tertiary)]/60"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => goTo(1)}
            aria-label="Đánh giá tiếp theo"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] text-[var(--ink-secondary)] transition hover:text-[var(--ink-primary)] md:hidden"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => setIsAutoPlaying((prev) => !prev)}
            aria-label={
              isAutoPlaying ? "Tạm dừng tự động chuyển" : "Bật tự động chuyển"
            }
            aria-pressed={isAutoPlaying}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] text-[var(--ink-tertiary)] transition hover:text-[var(--ink-primary)]"
          >
            {isAutoPlaying ? (
              <Pause className="h-3 w-3" aria-hidden="true" />
            ) : (
              <Play className="h-3 w-3" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
}