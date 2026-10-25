"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bookmark,
  CheckCircle2,
  Download,
  Globe,
  Heart,
  Loader2,
  MessageCircle,
  Music2,
  Plus,
  Radio,
  Search,
  Share2,
  ShoppingBag,
  Sparkles,
  Star,
  ThumbsUp,
  Video,
  Zap,
} from "lucide-react";
import { toSafeFileName } from "@/lib/utils/filename";

const FB_PREVIEW_LIMIT = 125;

type Platform = "facebook" | "tiktok" | "shopee";

const PLATFORM_TABS: Array<{ id: Platform; label: string; icon: typeof Globe }> = [
  { id: "facebook", label: "Facebook Ads", icon: Globe },
  { id: "tiktok", label: "TikTok Video", icon: Video },
  { id: "shopee", label: "Shopee Feed", icon: ShoppingBag },
];

const DEFAULT_HIGHLIGHTS = [
  "Chất lượng hoàn thiện tỉ mỉ, bền bỉ theo thời gian",
  "Giao hàng toàn quốc, được kiểm tra trước khi thanh toán",
  "Bảo hành chính hãng, hỗ trợ đổi trả trong 7 ngày",
];

function truncateToChars(text: string, limit: number) {
  const chars = Array.from(text);
  if (chars.length <= limit) {
    return { preview: text, truncated: false };
  }
  return { preview: chars.slice(0, limit).join("").trimEnd(), truncated: true };
}

function slugifyHandle(value: string) {
  const normalized = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, (match) => (match === "đ" ? "d" : "D"))
    .replace(/[^a-zA-Z0-9]+/g, "")
    .toLowerCase();
  return normalized || "chushop";
}

function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number,
): string[] {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return [];

  const words = normalized.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (current === "" || ctx.measureText(candidate).width <= maxWidth) {
      current = candidate;
      continue;
    }
    lines.push(current);
    current = word;
    if (lines.length === maxLines) break;
  }

  if (lines.length < maxLines && current) {
    lines.push(current);
    current = "";
  }

  // Còn từ chưa hiển thị -> rút gọn dòng cuối bằng dấu "…"
  if (lines.length === maxLines && current) {
    let last = lines[maxLines - 1] ?? "";
    while (last.length > 1 && ctx.measureText(`${last}…`).width > maxWidth) {
      last = last.slice(0, -1);
    }
    lines[maxLines - 1] = `${last.trimEnd()}…`;
  }

  return lines;
}

interface FacebookMockupProps {
  /** Nội dung đang biên tập trực tiếp tại Vùng 2 — đồng bộ thời gian thực */
  activeText: string;
  /** Tên góc bài viết đang chọn (PAS / Cảm xúc / FAB) */
  activeAngle?: string;
  /** Tên trang Facebook, suy ra từ tên sản phẩm */
  pageName?: string;
  /** Tiêu đề quảng cáo hiển thị trên ảnh mô phỏng */
  headline?: string;
    /** Danh sách hashtag do AI đề xuất từ workspace */
    hashtags?: string[];
    /** Callback hiển thị toast (tải ảnh PNG, lỗi Canvas…) */
    onNotify?: (message: string) => void;
  }

export default function FacebookMockup({
  activeText,
  activeAngle,
  pageName,
  headline,
  hashtags,
  onNotify,
}: FacebookMockupProps) {
  const [activePlatform, setActivePlatform] = useState<Platform>("facebook");
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeBouncing, setLikeBouncing] = useState(false);
  const [exportingImage, setExportingImage] = useState(false);
  const bounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mỗi khi đổi góc bài viết -> thu gọn lại phần "Xem thêm"
  useEffect(() => {
    setExpanded(false);
  }, [activeAngle]);

  useEffect(() => {
    return () => {
      if (bounceTimerRef.current) clearTimeout(bounceTimerRef.current);
    };
  }, []);

  const { preview, truncated } = truncateToChars(activeText, FB_PREVIEW_LIMIT);
  const brandName = pageName?.trim() || "Thương Hiệu Của Bạn";
  const brandInitials = (pageName?.trim() || "TB").slice(0, 2).toUpperCase();
  const brandHandle = slugifyHandle(pageName?.trim() || brandName);
  const bannerHeadline = headline?.trim() || activeAngle?.trim() || brandName;

  // Rút trích 3 gạch đầu dòng FAB từ chính nội dung đang biên tập
  const highlightBullets = (() => {
    const extracted = Array.from(
      new Set(
        activeText
          .split(/[\n•·]+/)
          .map((line) => line.trim())
          .filter((line) => line.length >= 12),
      ),
    )
      .slice(0, 3)
      .map((line) => (line.length > 96 ? `${line.slice(0, 93).trimEnd()}…` : line));

    return extracted.length > 0 ? extracted : DEFAULT_HIGHLIGHTS;
  })();

  const handleToggleLike = () => {
    setLiked((prev) => !prev);
    setLikeBouncing(true);
    if (bounceTimerRef.current) clearTimeout(bounceTimerRef.current);
    bounceTimerRef.current = setTimeout(() => setLikeBouncing(false), 450);
  };

  const handleDownloadAdBanner = () => {
    if (exportingImage) return;
    setExportingImage(true);

    window.setTimeout(() => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 1200;
        canvas.height = 630;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          onNotify?.("Trình duyệt không hỗ trợ Canvas 2D để tạo ảnh banner.");
          return;
        }

        const FONT =
          '"Segoe UI", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif';

        // 1. Nền gradient radial: Deep Navy -> Emerald -> Forest
        const bg = ctx.createRadialGradient(300, 120, 40, 720, 560, 900);
        bg.addColorStop(0, "#0f172a");
        bg.addColorStop(0.55, "#064e3b");
        bg.addColorStop(1, "#022c22");
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, 1200, 630);

        // 2. Quầng sáng emerald góc phải trên
        const glow = ctx.createRadialGradient(980, 120, 20, 980, 120, 420);
        glow.addColorStop(0, "rgba(16, 185, 129, 0.32)");
        glow.addColorStop(1, "rgba(16, 185, 129, 0)");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, 1200, 630);

        // 3. Lưới mảnh tạo chiều sâu
        ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
        ctx.lineWidth = 1;
        for (let x = 60; x < 1200; x += 60) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, 630);
          ctx.stroke();
        }
        for (let y = 60; y < 630; y += 60) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(1200, y);
          ctx.stroke();
        }

        // 4. Badge thương hiệu
        ctx.fillStyle = "rgba(16, 185, 129, 0.16)";
        drawRoundRect(ctx, 72, 58, 350, 46, 23);
        ctx.fill();
        ctx.strokeStyle = "rgba(110, 231, 183, 0.45)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.fillStyle = "#6ee7b7";
        ctx.font = `700 18px ${FONT}`;
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText("CONTENT STUDIO · AI VERIFIED", 96, 82);

        // 5. Logo tròn + chữ viết tắt thương hiệu
        const logoGradient = ctx.createLinearGradient(72, 150, 144, 222);
        logoGradient.addColorStop(0, "#34d399");
        logoGradient.addColorStop(1, "#0f766e");
        ctx.fillStyle = logoGradient;
        ctx.beginPath();
        ctx.arc(108, 186, 36, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.28)";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = "#ffffff";
        ctx.font = `700 26px ${FONT}`;
        ctx.textAlign = "center";
        ctx.fillText(brandInitials, 108, 188);
        ctx.textAlign = "left";

        // 6. Tên thương hiệu + tick xác thực
        ctx.fillStyle = "#ffffff";
        ctx.font = `700 36px ${FONT}`;
        ctx.fillText(brandName, 162, 176, 600);
        const nameWidth = Math.min(ctx.measureText(brandName).width, 600);
        const tickX = 162 + nameWidth + 22;
        ctx.fillStyle = "#10b981";
        ctx.beginPath();
        ctx.arc(tickX, 176, 13, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#022c22";
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(tickX - 6, 176);
        ctx.lineTo(tickX - 1, 181);
        ctx.lineTo(tickX + 6, 170);
        ctx.stroke();

        ctx.fillStyle = "rgba(255, 255, 255, 0.62)";
        ctx.font = `500 19px ${FONT}`;
        ctx.fillText("Thương hiệu đã xác thực · Facebook Ads", 162, 214);

        // 7. Headline chính (tối đa 3 dòng)
        ctx.fillStyle = "#f8fafc";
        ctx.font = `700 46px ${FONT}`;
        ctx.textBaseline = "alphabetic";
        const headlineLines = wrapCanvasText(ctx, bannerHeadline, 940, 3);
        const headlineTop = 318;
        headlineLines.forEach((line, index) => {
          ctx.fillText(line, 72, headlineTop + index * 58);
        });

        // 8. Pill lợi ích vàng
        const pillY = headlineTop + (headlineLines.length - 1) * 58 + 40;
        const pillText = "✓ Hook vàng Facebook Ads · Chuẩn AIDA & PAS";
        ctx.font = `600 21px ${FONT}`;
        const pillWidth = ctx.measureText(pillText).width + 56;
        ctx.fillStyle = "rgba(250, 204, 21, 0.14)";
        drawRoundRect(ctx, 72, pillY, pillWidth, 52, 26);
        ctx.fill();
        ctx.strokeStyle = "rgba(250, 204, 21, 0.45)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.fillStyle = "#fde68a";
        ctx.textBaseline = "middle";
        ctx.fillText(pillText, 100, pillY + 27);

        // 9. Nút CTA
        const ctaY = pillY + 76;
        const ctaLabel = "XEM NGAY";
        ctx.font = `700 23px ${FONT}`;
        const ctaWidth = ctx.measureText(ctaLabel).width + 104;
        const ctaGradient = ctx.createLinearGradient(72, ctaY, 72 + ctaWidth, ctaY + 60);
        ctaGradient.addColorStop(0, "#10b981");
        ctaGradient.addColorStop(1, "#059669");
        ctx.fillStyle = ctaGradient;
        drawRoundRect(ctx, 72, ctaY, ctaWidth, 60, 30);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.fillText(ctaLabel, 106, ctaY + 31);
        const arrowX = 72 + ctaWidth - 44;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(arrowX, ctaY + 30);
        ctx.lineTo(arrowX + 15, ctaY + 30);
        ctx.moveTo(arrowX + 9, ctaY + 24);
        ctx.lineTo(arrowX + 15, ctaY + 30);
        ctx.lineTo(arrowX + 9, ctaY + 36);
        ctx.stroke();

        // 10. Footer
        ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
        ctx.font = `500 18px ${FONT}`;
        ctx.textAlign = "right";
        ctx.textBaseline = "alphabetic";
        ctx.fillText("content-studio · 1200 × 630", 1128, 596);
        ctx.textAlign = "left";

        // 11. Xuất file PNG
        const dataUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `${toSafeFileName(
          pageName?.trim() || brandName,
          "content_studio",
        )}_banner_1200x630.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        onNotify?.("Đã tải ảnh banner quảng cáo 1200x630 (PNG) thành công!");
      } catch {
        onNotify?.("Không thể tạo ảnh banner. Vui lòng thử lại.");
      } finally {
        setExportingImage(false);
      }
    }, 60);
  };

  return (
    <div className="animate-fade-in">
      {/* Thanh chọn nền tảng + tải banner PNG */}
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="inline-flex min-w-0 flex-wrap rounded-full border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-1">
          {PLATFORM_TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activePlatform === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActivePlatform(tab.id)}
                aria-pressed={active}
                className={`btn-tactile inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11.5px] font-medium transition-all duration-200 ${
                  active
                    ? "bg-[var(--accent-navy)] text-white shadow-xs"
                    : "text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleDownloadAdBanner}
          disabled={exportingImage}
          className="btn-tactile inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-1.5 text-[11.5px] font-medium text-[var(--ink-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--ink-primary)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {exportingImage ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-[var(--accent-navy)]" />
          ) : (
            <Download className="h-3.5 w-3.5" />
          )}
          {exportingImage ? "Đang tạo ảnh..." : "Tải ảnh banner (PNG)"}
        </button>
      </div>

      {activeAngle ? (
        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--accent-navy)]/[0.08] px-2.5 py-0.5 text-[11px] font-medium text-[var(--accent-navy)]">
            Đang hiển thị: {activeAngle}
          </span>
          <span className="rounded-full bg-[var(--surface-raised)] px-2 py-0.5 text-[10.5px] font-medium text-[var(--ink-tertiary)]">
            Đồng bộ trực tiếp
          </span>
        </div>
      ) : null}

      {/* ── NỀN TẢNG 1: Facebook Ads post ── */}
      {activePlatform === "facebook" ? (
      <div className="mx-auto w-full max-w-[560px] overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:border-[#393A3B] dark:bg-[#242526] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
        {/* Post Header */}
        <div className="flex items-center gap-2.5 px-3 pt-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent-navy)] to-[var(--accent-emerald)] text-[13px] font-semibold text-white">
            {brandInitials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[14px] font-semibold text-[#050505] dark:text-[#E4E6EB]">
              {brandName}
            </p>
            <p className="flex items-center gap-1 text-[12px] text-[#65676B] dark:text-[#B0B3B8]">
              Được tài trợ · <Globe className="h-3 w-3" />
            </p>
          </div>
        </div>

        {/* Post Text with smooth fade transition */}
        <div className="px-3 py-2.5">
          <p className="whitespace-pre-wrap break-words text-[15px] leading-[1.4] text-[#050505] dark:text-[#E4E6EB]">
            {expanded || !truncated ? activeText : `${preview}... `}
            {truncated && !expanded ? (
              <button
                type="button"
                onClick={() => setExpanded(true)}
                className="font-medium text-[#0866FF] hover:underline"
              >
                Xem thêm
              </button>
            ) : null}
            {truncated && expanded ? (
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="ml-1.5 font-medium text-[#65676B] hover:underline dark:text-[#B0B3B8]"
              >
                Ẩn bớt
              </button>
            ) : null}
          </p>

          {/* Hashtags do AI đề xuất — bung ra cùng nội dung bài viết */}
          {(expanded || !truncated) && hashtags && hashtags.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1.5 pt-1">
              {hashtags.map((tag, idx) => {
                const cleanTag = tag.trim();
                const displayTag = cleanTag.startsWith("#") ? cleanTag : `#${cleanTag}`;
                return (
                  <span
                    key={idx}
                    className="cursor-pointer text-[14.5px] font-normal text-[#1877F2] transition-colors hover:underline dark:text-[#4599FF]"
                  >
                    {displayTag}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* Post Media — lấy tiêu đề quảng cáo làm visual mô phỏng */}
        <div className="relative flex aspect-[4/3] w-full flex-col items-center justify-center gap-1.5 overflow-hidden border-y border-[#E4E6EB] bg-gradient-to-br from-[var(--accent-navy)] via-[#1e293b] to-[var(--accent-emerald)] px-6 text-center dark:border-[#3A3B3C]">
          <Sparkles className="h-5 w-5 text-white/80" />
          <p className="text-[15px] font-bold leading-tight text-white">{brandName}</p>
          <p className="text-[11.5px] leading-snug text-white/85">
            {headline?.trim() || "Giải pháp tối ưu cho khách hàng của bạn"}
          </p>
        </div>

        {/* Reaction counters */}
        <div className="flex items-center justify-between px-3 py-2 text-[13px] text-[#65676B] dark:text-[#B0B3B8]">
          <div className="flex items-center gap-1.5">
            <span
              className={`flex h-4 w-4 items-center justify-center rounded-full bg-[#1877F2] ${
                likeBouncing ? "animate-like-bounce" : ""
              }`}
            >
              <ThumbsUp className="h-2.5 w-2.5 text-white" />
            </span>
            <span className="tabular-nums">{liked ? 129 : 128}</span>
          </div>
          <div className="flex gap-3 text-[12px]">
            <span>24 bình luận</span>
            <span>12 chia sẻ</span>
          </div>
        </div>

        {/* Reaction action buttons */}
        <div className="flex items-center justify-around border-t border-[#E4E6EB] px-1 py-1 dark:border-[#3A3B3C]">
          <button
            type="button"
            onClick={handleToggleLike}
            className={`btn-tactile flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-[13px] font-medium transition-colors hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C] ${
              liked
                ? "font-semibold text-[#1877F2]"
                : "text-[#65676B] dark:text-[#B0B3B8]"
            }`}
          >
            <ThumbsUp
              className={`h-4 w-4 ${
                likeBouncing ? "animate-like-bounce" : ""
              } ${liked ? "fill-[#1877F2]" : ""}`}
            />
            <span>{liked ? "Đã thích" : "Thích"}</span>
          </button>

          <button
            type="button"
            className="btn-tactile flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-[13px] font-medium text-[#65676B] transition-colors hover:bg-[#F0F2F5] dark:text-[#B0B3B8] dark:hover:bg-[#3A3B3C]"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Bình luận</span>
          </button>

          <button
            type="button"
            className="btn-tactile flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-[13px] font-medium text-[#65676B] transition-colors hover:bg-[#F0F2F5] dark:text-[#B0B3B8] dark:hover:bg-[#3A3B3C]"
          >
            <Share2 className="h-4 w-4" />
                        <span>Chia sẻ</span>
                      </button>
                    </div>
                  </div>
                  ) : activePlatform === "tiktok" ? (
                    /* ── NỀN TẢNG 2: TikTok Video (khung dọc 9:16) ── */
                    <div className="mx-auto w-full max-w-[340px]">
                      <div className="relative aspect-[9/16] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#121212] text-white shadow-2xl">
                        {/* Nền video ambient */}
                        <div
                          className="absolute inset-0"
                          style={{
                            background:
                              "radial-gradient(circle at 28% 18%, rgba(16,185,129,0.32), transparent 55%), radial-gradient(circle at 78% 72%, rgba(59,130,246,0.26), transparent 58%), linear-gradient(180deg, #0b1120 0%, #111827 52%, #08080c 100%)",
                          }}
                        />
                        <div className="pointer-events-none absolute inset-0">
                          <span className="absolute left-[18%] top-[22%] h-1 w-1 rounded-full bg-white/70" />
                          <span className="absolute left-[64%] top-[16%] h-1.5 w-1.5 rounded-full bg-emerald-300/70" />
                          <span className="absolute left-[42%] top-[38%] h-1 w-1 rounded-full bg-white/50" />
                          <span className="absolute left-[80%] top-[46%] h-1 w-1 rounded-full bg-sky-300/60" />
                          <span className="absolute left-[26%] top-[58%] h-1.5 w-1.5 rounded-full bg-white/40" />
                        </div>

                        {/* Thanh điều hướng trên cùng */}
                        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-3 pt-2.5">
                          <div className="flex items-center gap-3 text-[11px]">
                            <span className="text-white/55">Đang theo dõi</span>
                            <span className="relative font-semibold text-white">
                              Dành cho bạn
                              <span className="absolute -bottom-1 left-1/2 h-[2px] w-5 -translate-x-1/2 rounded-full bg-white" />
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-white/80">
                            <Radio className="h-3.5 w-3.5" />
                            <Search className="h-3.5 w-3.5" />
                          </div>
                        </div>

                        {/* Cột hành động bên phải */}
                        <div className="absolute bottom-24 right-2 flex flex-col items-center gap-3">
                          <div className="relative mb-1">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-[var(--accent-navy)] to-[var(--accent-emerald)] text-[11px] font-bold text-white">
                              {brandInitials}
                            </div>
                            <span className="absolute -bottom-1.5 left-1/2 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full bg-[#FE2C55] text-white shadow-sm">
                              <Plus className="h-2.5 w-2.5" strokeWidth={3} />
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={handleToggleLike}
                            aria-label="Thích video"
                            className="flex flex-col items-center gap-0.5"
                          >
                            <Heart
                              className={`h-6 w-6 transition-colors ${
                                liked ? "fill-[#FE2C55] text-[#FE2C55]" : "text-white"
                              } ${likeBouncing ? "animate-like-bounce" : ""}`}
                            />
                            <span className="text-[10px] font-medium tabular-nums text-white/90">
                              {liked ? "24.9K" : "24.8K"}
                            </span>
                          </button>

                          <div className="flex flex-col items-center gap-0.5">
                            <MessageCircle className="h-6 w-6 text-white" />
                            <span className="text-[10px] font-medium tabular-nums text-white/90">1.2K</span>
                          </div>

                          <div className="flex flex-col items-center gap-0.5">
                            <Bookmark className="h-6 w-6 text-white" />
                            <span className="text-[10px] font-medium tabular-nums text-white/90">3.4K</span>
                          </div>

                          <div className="flex flex-col items-center gap-0.5">
                            <Share2 className="h-6 w-6 text-white" />
                            <span className="text-[10px] font-medium tabular-nums text-white/90">892</span>
                          </div>

                          <div
                            className="mt-1 flex h-9 w-9 animate-spin items-center justify-center rounded-full border-2 border-white/60 bg-gradient-to-br from-[#1f2937] to-[#0f172a] shadow-lg"
                            style={{ animationDuration: "6s" }}
                          >
                            <Music2 className="h-3.5 w-3.5 text-white" />
                          </div>
                        </div>

                        {/* Lớp phủ nội dung dưới cùng */}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/55 to-transparent px-3 pb-3 pt-12">
                          <span className="inline-flex max-w-full items-center gap-1 rounded-full bg-[var(--accent-emerald)] px-2 py-0.5 text-[9.5px] font-semibold text-white shadow-sm">
                            <Zap className="h-2.5 w-2.5 shrink-0" />
                            <span className="truncate">3s Hook đầu: Gây tò mò &amp; giữ chân người xem</span>
                          </span>

                          <p className="mt-1.5 flex items-center gap-1 text-[12.5px] font-semibold">
                            @{brandHandle}
                            <CheckCircle2 className="h-3 w-3 text-[#20D5EC]" />
                          </p>

                          <p className="mt-1 max-h-[92px] overflow-y-auto whitespace-pre-wrap break-words pr-12 text-[11px] leading-[1.55] text-white/90">
                            {activeText || "Nội dung kịch bản video sẽ đồng bộ từ Vùng 2 tại đây."}
                          </p>

                          {hashtags && hashtags.length > 0 ? (
                            <p className="mt-1 flex flex-wrap gap-x-1.5 gap-y-0.5 pr-12 text-[10.5px] font-semibold">
                              {hashtags.map((tag, index) => {
                                const cleanTag = tag.trim().replace(/^#/, "");
                                return (
                                  <span key={index} className="text-white/95">
                                    #{cleanTag}
                                  </span>
                                );
                              })}
                            </p>
                          ) : null}

                          <p className="mt-1.5 flex items-center gap-1 text-[10px] text-white/80">
                            <Music2 className="h-3 w-3" />
                            Âm thanh thịnh hành — {brandName}
                          </p>
                        </div>
                      </div>

                      <p className="mt-2 text-center text-[11px] text-[var(--ink-tertiary)]">
                        Mô phỏng khung 9:16 · Kịch bản video TikTok đồng bộ trực tiếp từ Vùng 2
                      </p>
                    </div>
                  ) : (
                    /* ── NỀN TẢNG 3: Shopee / E-commerce product feed ── */
                    <div className="mx-auto w-full max-w-[420px]">
                      <div className="overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-white text-[#222] shadow-md dark:bg-[#242526] dark:text-[#eee]">
                        {/* Ảnh sản phẩm 1:1 */}
                        <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-[#EE4D2D] via-[#f97316] to-[#fbbf24]">
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-7 text-center">
                            <Sparkles className="h-5 w-5 text-white/85" />
                            <p className="text-[16px] font-bold leading-tight text-white drop-shadow-sm">
                              {brandName}
                            </p>
                            <p className="text-[12px] leading-snug text-white/90">{bannerHeadline}</p>
                          </div>
                          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded bg-[#EE4D2D] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white shadow-sm">
                            <Star className="h-2.5 w-2.5 fill-current" />
                            Mall · Yêu thích
                          </span>
                          <span className="absolute bottom-2 right-2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-medium text-white">
                            1/5 ảnh
                          </span>
                        </div>

                        {/* Thông tin sản phẩm */}
                        <div className="space-y-2 px-3 py-2.5">
                          <h3 className="line-clamp-2 text-[13.5px] font-semibold leading-snug text-[#222] dark:text-[#eee]">
                            {brandName} — {bannerHeadline}
                          </h3>

                          <div className="flex flex-wrap items-baseline gap-2">
                            <span className="text-[17px] font-bold text-[#EE4D2D]">₫249.000</span>
                            <span className="text-[11.5px] text-[#9ca3af] line-through">₫450.000</span>
                            <span className="rounded bg-[#EE4D2D]/10 px-1.5 py-0.5 text-[10px] font-bold text-[#EE4D2D]">
                              -45%
                            </span>
                            <span className="rounded border border-[#EE4D2D]/40 px-1.5 py-0.5 text-[9.5px] font-semibold uppercase text-[#EE4D2D]">
                              Flash Sale
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-[11px] text-[#6b7280] dark:text-[#b0b3b8]">
                            <span className="flex items-center gap-0.5 text-[#EE4D2D]">
                              {[0, 1, 2, 3, 4].map((index) => (
                                <Star key={index} className="h-3 w-3 fill-current" />
                              ))}
                              <span className="ml-1 font-semibold">4.9</span>
                            </span>
                            <span className="h-3 w-px bg-[var(--border-subtle)]" />
                            <span>Đã bán 1.8k</span>
                          </div>

                          <ul className="space-y-1 rounded-lg bg-[#EE4D2D]/[0.06] px-2.5 py-2">
                            {highlightBullets.map((bullet, index) => (
                              <li
                                key={index}
                                className="flex gap-1.5 text-[11px] leading-snug text-[#374151] dark:text-[#d1d5db]"
                              >
                                <CheckCircle2 className="mt-[1px] h-3 w-3 shrink-0 text-[#EE4D2D]" />
                                <span className="min-w-0">{bullet}</span>
                              </li>
                            ))}
                          </ul>

                          <div className="flex items-center gap-1.5 pt-0.5">
                            <button
                              type="button"
                              className="btn-tactile rounded border border-[#EE4D2D] bg-white px-2.5 py-1.5 text-[11px] font-semibold text-[#EE4D2D] dark:bg-transparent"
                            >
                              Chat ngay
                            </button>
                            <button
                              type="button"
                              className="btn-tactile rounded border border-[#EE4D2D] bg-[#EE4D2D]/10 px-2.5 py-1.5 text-[11px] font-semibold text-[#EE4D2D]"
                            >
                              Thêm vào giỏ
                            </button>
                            <button
                              type="button"
                              className="btn-tactile flex-1 rounded bg-[#EE4D2D] px-3 py-1.5 text-[11.5px] font-bold text-white transition-colors hover:bg-[#d73211]"
                            >
                              Mua ngay
                            </button>
                          </div>
                        </div>
                      </div>

                      <p className="mt-2 text-center text-[11px] text-[var(--ink-tertiary)]">
                        Mô phỏng gian hàng Shopee · Tiêu đề &amp; lợi ích đồng bộ từ Vùng 2
                      </p>
                    </div>
                  )}
                </div>
              );
            }