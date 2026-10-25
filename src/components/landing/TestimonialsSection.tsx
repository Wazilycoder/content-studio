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
    avatar: "/images/avatars/avatar-1.jpg",
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
    avatar: "/images/avatars/avatar-2.jpg",
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
    avatar: "/images/avatars/avatar-3.jpg",
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
    avatar: "/images/avatars/avatar-4.jpg",
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
    avatar: "/images/avatars/avatar-5.jpg",
    initials: "TT",
  },
];

const AUTO_PLAY_MS = 4000;
const SWIPE_THRESHOLD = 45;

type Slot = "center" | "left" | "right" | "far-left" | "far-right";

function getSlot(index: number, activeIndex: number, total: number): Slot {
  const diff = (index - activeIndex + total) % total;
  if (diff === 0) return "center";
  if (diff === 1) return "right";
  if (diff === 2) return "far-right";
  if (diff === 3) return "far-left";
  if (diff === 4) return "left";
  return "far-right";
}

function getSlotStyle(slot: Slot): CSSProperties {
  switch (slot) {
    case "center":
      return {
        transform:
          "translate3d(-50%, -50%, 0px) translateX(0px) rotateY(0deg) scale(1)",
        opacity: 1,
        zIndex: 20,
        pointerEvents: "auto",
      };
    case "left":
      return {
        transform:
          "translate3d(-50%, -50%, -40px) translateX(-68%) rotateY(18deg) scale(0.88)",
        opacity: 0.55,
        zIndex: 10,
        pointerEvents: "auto",
      };
    case "right":
      return {
        transform:
          "translate3d(-50%, -50%, -40px) translateX(68%) rotateY(-18deg) scale(0.88)",
        opacity: 0.55,
        zIndex: 10,
        pointerEvents: "auto",
      };
    case "far-left":
      return {
        transform:
          "translate3d(-50%, -50%, -100px) translateX(-125%) rotateY(28deg) scale(0.75)",
        opacity: 0,
        zIndex: 0,
        pointerEvents: "none",
      };
    case "far-right":
      return {
        transform:
          "translate3d(-50%, -50%, -100px) translateX(125%) rotateY(-28deg) scale(0.75)",
        opacity: 0,
        zIndex: 0,
        pointerEvents: "none",
      };
  }
}

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHoveringCard, setIsHoveringCard] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef<number | null>(null);
  const prevSlotsRef = useRef<Record<number, Slot>>({});
  const total = TESTIMONIALS.length;

  const goTo = useCallback(
    (direction: 1 | -1) => {
      setActiveIndex((prev) => (prev + direction + total) % total);
    },
    [total],
  );

  // Lưu lịch sử slot để nhận diện thẻ nhảy giữa far-left và far-right
  useEffect(() => {
    const nextSlots: Record<number, Slot> = {};
    TESTIMONIALS.forEach((_, idx) => {
      nextSlots[idx] = getSlot(idx, activeIndex, total);
    });
    prevSlotsRef.current = nextSlots;
  }, [activeIndex, total]);

  // Auto-play ticking: chạy đều đặn ngay cả khi chuột ở trạng thái idle
  useEffect(() => {
    if (!isAutoPlaying || isDragging || isHoveringCard) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, AUTO_PLAY_MS);

    return () => clearInterval(timer);
  }, [isAutoPlaying, isDragging, isHoveringCard, total]);

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

        {/* 3D Perspective Carousel Container */}
        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="Đánh giá từ nhà bán hàng"
          tabIndex={0}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onPointerLeave={handlePointerCancel}
          onKeyDown={handleKeyDown}
          className="relative mx-auto mt-12 h-[450px] w-full max-w-4xl select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-navy)]/40 sm:h-[420px]"
          style={{
            perspective: "1200px",
            touchAction: "pan-y",
          }}
        >
          <div
            className="relative h-full w-full"
            style={{ transformStyle: "preserve-3d" }}
          >
            {TESTIMONIALS.map((item, index) => {
              const slot = getSlot(index, activeIndex, total);
              const isActive = slot === "center";
              const isAdjacent = slot === "left" || slot === "right";

              const prevSlot = prevSlotsRef.current[index];
              const isJumping =
                (prevSlot === "far-left" && slot === "far-right") ||
                (prevSlot === "far-right" && slot === "far-left");

              return (
                <div
                  key={item.name}
                  aria-hidden={!isActive}
                  onClick={() => {
                    if (isAdjacent) setActiveIndex(index);
                  }}
                  onMouseEnter={() => {
                    if (isActive) setIsHoveringCard(true);
                  }}
                  onMouseLeave={() => {
                    if (isActive) setIsHoveringCard(false);
                  }}
                  style={{
                    ...getSlotStyle(slot),
                    transition: isJumping
                      ? "none"
                      : "transform 700ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 500ms ease",
                    backfaceVisibility: "hidden",
                    WebkitFontSmoothing: "antialiased",
                    willChange: "transform, opacity",
                  }}
                  className={[
                    "absolute left-1/2 top-1/2 h-full w-[90%] max-w-[25.5rem]",
                    isAdjacent ? "cursor-pointer hover:opacity-85" : "",
                  ].join(" ")}
                >
                  {/* Outer Bezel (Doppelrand luxury styling) */}
                  <div
                    className={[
                      "h-full w-full rounded-[2rem] p-1.5 sm:p-2 transition-colors duration-300",
                      isActive
                        ? "bg-gradient-to-b from-indigo-500/30 via-indigo-500/10 to-transparent border border-indigo-500/40 shadow-[0_24px_60px_-15px_rgba(99,102,241,0.25)]"
                        : "bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] dark:border-white/10 shadow-lg",
                    ].join(" ")}
                  >
                    {/* Inner Core */}
                    <article className="flex h-full w-full flex-col justify-between rounded-[calc(2rem-0.375rem)] border border-[var(--border-subtle)] bg-[var(--surface)] p-6 text-left shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] dark:border-white/10 sm:p-7">
                      <div>
                        {/* Header: Avatar, Name, Verified Badge */}
                        <div className="flex items-center gap-3.5">
                          <div className="relative inline-flex h-13 w-13 shrink-0 items-center justify-center rounded-full p-[2px] ring-2 ring-indigo-500/30">
                            <div className="relative h-full w-full overflow-hidden rounded-full bg-gradient-to-br from-indigo-600 to-sky-600">
                              <img
                                src={item.avatar}
                                alt={item.name}
                                className="h-full w-full object-cover"
                                loading="eager"
                                onError={(e) => {
                                  // Fallback nếu ảnh không nạp được
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                              <span className="absolute inset-0 flex items-center justify-center text-[13px] font-bold text-white">
                                {item.initials}
                              </span>
                            </div>
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <h3 className="truncate text-[15px] font-bold tracking-tight text-[var(--ink-primary)]">
                                {item.name}
                              </h3>
                              <CheckCircle2
                                className="h-4 w-4 shrink-0 text-emerald-500 drop-shadow-[0_0_4px_rgba(16,185,129,0.4)]"
                                aria-label="Đã xác thực doanh thu"
                              />
                            </div>
                            <p className="truncate text-[12px] font-medium text-[var(--ink-secondary)]">
                              {item.role}
                            </p>
                            <p className="truncate text-[11.5px] text-[var(--ink-tertiary)]">
                              {item.shop} · {item.location}
                            </p>
                          </div>
                        </div>

                        {/* Metric Badge */}
                        <div className="mt-4 flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-[11.5px] font-semibold text-emerald-600 dark:text-emerald-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            {item.metric}
                          </span>
                        </div>

                        {/* 5-Star Rating */}
                        <div
                          className="mt-3.5 flex items-center gap-1 text-amber-400"
                          aria-label="Đánh giá 5 trên 5 sao"
                        >
                          {[0, 1, 2, 3, 4].map((star) => (
                            <Star
                              key={star}
                              className="h-4 w-4 fill-amber-400 text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]"
                              aria-hidden="true"
                            />
                          ))}
                          <span className="ml-1.5 text-[11px] font-semibold text-[var(--ink-tertiary)]">
                            5.0
                          </span>
                        </div>

                        {/* Quote Text */}
                        <blockquote className="mt-3.5 text-[14px] leading-[1.7] text-[var(--ink-secondary)] sm:text-[14.5px]">
                          <Quote
                            className="mb-1.5 h-4 w-4 text-indigo-500/40"
                            aria-hidden="true"
                          />
                          <p>&ldquo;{item.quote}&rdquo;</p>
                        </blockquote>
                      </div>

                      {/* Footer verified status */}
                      <div className="mt-4 border-t border-[var(--border-subtle)] pt-3 text-[11px] font-medium text-[var(--ink-tertiary)] dark:border-white/5">
                        Xác nhận nhà bán hàng thực tế · Q2/2026
                      </div>
                    </article>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Floating Pill Nav Buttons (Desktop) */}
          <button
            type="button"
            onClick={() => goTo(-1)}
            aria-label="Đánh giá trước"
            className="absolute left-0 top-1/2 z-30 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] text-[var(--ink-secondary)] shadow-xl transition-all hover:scale-105 hover:border-indigo-500/40 hover:text-[var(--ink-primary)] md:flex"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => goTo(1)}
            aria-label="Đánh giá tiếp theo"
            className="absolute right-0 top-1/2 z-30 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] text-[var(--ink-secondary)] shadow-xl transition-all hover:scale-105 hover:border-indigo-500/40 hover:text-[var(--ink-primary)] md:flex"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Controls: Dots, Prev/Next, Play/Pause Indicator */}
        <div className="mt-8 flex items-center justify-center gap-3">
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
                    ? "w-8 bg-indigo-600 shadow-[0_0_8px_rgba(99,102,241,0.5)]"
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
            title={isAutoPlaying ? "Tạm dừng tự xoay" : "Bật tự xoay"}
            className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all ${
              isAutoPlaying
                ? "border-indigo-500/30 bg-indigo-500/10 text-indigo-500"
                : "border-[var(--border-subtle)] bg-[var(--surface)] text-[var(--ink-tertiary)] hover:text-[var(--ink-primary)]"
            }`}
          >
            {isAutoPlaying ? (
              <Pause className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <Play className="h-3.5 w-3.5 ml-0.5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
}