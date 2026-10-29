"use client";

import { memo, useEffect, useRef, useState } from "react";
import {
  Bookmark,
  CheckCircle2,
  Copy,
  Download,
  Globe,
  Heart,
  Layers3,
  Loader2,
  MessageCircle,
  MoreHorizontal,
  Send,
  Share2,
  ThumbsUp,
  X,
} from "lucide-react";
import { toSafeFileName } from "@/lib/utils/filename";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

const FB_PREVIEW_LIMIT = 125;

type Platform = "facebook" | "instagram";

const PLATFORM_TABS: Array<{ id: Platform; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { id: "facebook", label: "Facebook Mobile", icon: Globe },
  { id: "instagram", label: "Instagram Feed", icon: InstagramIcon },
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

function FacebookMockup({
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

  // Facebook states
  const [fbCommentsOpen, setFbCommentsOpen] = useState(false);
  const [fbShareOpen, setFbShareOpen] = useState(false);
  const [fbCommentsList, setFbCommentsList] = useState([
    {
      id: "fb-1",
      name: "Trần Hoàng Nam",
      time: "15 phút trước",
      text: "Bài viết viết rất trúng tâm lý, cho mình xin thông tin tư vấn nhé shop!",
      likes: 8,
    },
    {
      id: "fb-2",
      name: "Lê Minh Thảo",
      time: "42 phút trước",
      text: "Đã inbox shop qua fanpage rồi ạ, check tin nhắn giúp mình với.",
      likes: 3,
    },
  ]);
  const [fbNewComment, setFbNewComment] = useState("");

  // Instagram states
  const [igLiked, setIgLiked] = useState(false);
  const [igSaved, setIgSaved] = useState(false);
  const [igExpanded, setIgExpanded] = useState(false);
  const [igHeartPop, setIgHeartPop] = useState(false);
  const igHeartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleAddFbComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fbNewComment.trim()) return;
    setFbCommentsList((prev) => [
      ...prev,
      {
        id: `fb-${Date.now()}`,
        name: "Bạn (Khách hàng)",
        time: "Vừa xong",
        text: fbNewComment.trim(),
        likes: 0,
      },
    ]);
    setFbNewComment("");
    onNotify?.("Đã gửi bình luận Facebook mô phỏng!");
  };

  const handleIgDoubleTapLike = () => {
    setIgLiked(true);
    setIgHeartPop(true);
    if (igHeartTimerRef.current) clearTimeout(igHeartTimerRef.current);
    igHeartTimerRef.current = setTimeout(() => setIgHeartPop(false), 800);
  };

  const handleIgToggleLike = () => {
    setIgLiked((prev) => !prev);
  };

  // Mỗi khi đổi góc bài viết -> thu gọn lại phần "Xem thêm"
  useEffect(() => {
    setExpanded(false);
    setIgExpanded(false);
  }, [activeAngle]);

  useEffect(() => {
    return () => {
      if (bounceTimerRef.current) clearTimeout(bounceTimerRef.current);
      if (igHeartTimerRef.current) clearTimeout(igHeartTimerRef.current);
    };
  }, []);

  const { preview, truncated } = truncateToChars(activeText, FB_PREVIEW_LIMIT);
  const { preview: igPreview, truncated: igTruncated } = truncateToChars(activeText, 160);
  const brandName = pageName?.trim() || "Thương Hiệu Của Bạn";
  const brandInitials = (pageName?.trim() || "TB").slice(0, 2).toUpperCase();
  const brandHandle = slugifyHandle(pageName?.trim() || brandName);
  const bannerHeadline = headline?.trim() || activeAngle?.trim() || brandName;

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
      {/* Thanh chọn nền tảng (sliding pill) + tải banner PNG */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="relative inline-flex min-w-0 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-1">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-1 left-1 rounded-full bg-[var(--surface)] shadow-[0_1px_3px_rgba(0,0,0,0.1)] transition-transform duration-[280ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              width: "calc(50% - 4px)",
              transform: `translateX(${activePlatform === "facebook" ? 0 : 100}%)`,
            }}
          />
          {PLATFORM_TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activePlatform === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActivePlatform(tab.id)}
                aria-pressed={active}
                className={`btn-tactile relative z-10 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                  active
                    ? "text-[var(--accent-navy)]"
                    : "text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
                }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleDownloadAdBanner}
          disabled={exportingImage}
          className="btn-tactile inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-1.5 text-[12px] font-medium text-[var(--ink-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--ink-primary)] disabled:cursor-not-allowed disabled:opacity-60"
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
        <div className="mb-2.5 flex flex-wrap items-center gap-1.5">
          <span className="inline-flex min-w-0 items-center gap-1 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-2.5 py-0.5 text-[12px] font-medium text-[var(--ink-secondary)]">
            <span className="truncate">Đang hiển thị: {activeAngle}</span>
          </span>
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[12px] font-medium text-emerald-700 dark:text-emerald-300">
            Đồng bộ trực tiếp
          </span>
        </div>
      ) : null}

      {/* ── KHUNG THIẾT BỊ DI ĐỘNG + NỀN TẢNG 1: Facebook Mobile ── */}
      <div className="relative mx-auto w-full max-w-[392px]">
        {/* Ambient Halo Behind Mobile Phone */}
        <div aria-hidden="true" className="pointer-events-none absolute -inset-3 rounded-[3rem] bg-gradient-to-b from-indigo-500/15 via-purple-500/10 to-transparent blur-2xl -z-10 opacity-70 dark:opacity-90" />

        <div className="relative rounded-[2.4rem] border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-[7px] shadow-[0_24px_60px_-32px_rgba(15,23,42,0.55),0_0_20px_-5px_rgba(99,102,241,0.12)]">
          {/* Speaker / Dynamic Island on Phone Bezel */}
          <div aria-hidden="true" className="mx-auto mb-1 h-3.5 w-20 rounded-full bg-black/40 dark:bg-black/80 flex items-center justify-center">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1e293b]/70 mr-1.5" />
            <span className="h-1 w-8 rounded-full bg-[#334155]/60" />
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-[var(--border-subtle)] bg-white dark:bg-[#242526]">
            {/* Status bar */}
            <div className="flex items-center justify-between px-5 pb-1 pt-1.5 text-[12px] font-semibold tracking-tight text-[#050505] dark:text-[#E4E6EB]">
              <span className="tabular-nums">9:41</span>
              <div className="flex items-center gap-1">
                <span className="h-2 w-[3px] rounded-full bg-current opacity-70" />
                <span className="h-2.5 w-[3px] rounded-full bg-current opacity-70" />
                <span className="h-3 w-[3px] rounded-full bg-current opacity-70" />
                <span className="ml-1 inline-block h-2.5 w-5 rounded-[3px] border border-current opacity-60" />
              </div>
            </div>

            {activePlatform === "facebook" ? (
              <div className="relative bg-white dark:bg-[#242526]">
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

        {/* Post Text — hiển thị rõ điểm gấp khúc 125 ký tự */}
        <div className="px-3 py-2.5">
          <p className="whitespace-pre-wrap break-words text-[15px] leading-[1.45] text-[#050505] dark:text-[#E4E6EB]">
            {expanded || !truncated ? activeText : `${preview}… `}
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

          {truncated && !expanded ? (
            <p className="mt-1.5 flex items-center gap-1.5 text-[12px] font-medium text-[#65676B] dark:text-[#B0B3B8]">
              <span className="inline-block h-px w-4 bg-current opacity-60" />
              Cắt tại ký tự 125 · Hook
            </p>
          ) : null}

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
          <Layers3 className="h-5 w-5 text-white/80" />
          <p className="text-[15px] font-bold leading-tight text-white">{brandName}</p>
          <p className="text-[11.5px] leading-snug text-white/85">
            {headline?.trim() || "Giải pháp tối ưu cho khách hàng của bạn"}
          </p>
        </div>

        {/* Reaction counters */}
        <div className="flex items-center justify-between px-3 py-2 text-[13px] text-[#65676B] dark:text-[#B0B3B8]">
          <button
            type="button"
            onClick={handleToggleLike}
            className="flex items-center gap-1.5 hover:opacity-85 transition-opacity"
          >
            <span
              className={`flex h-4 w-4 items-center justify-center rounded-full bg-[#1877F2] ${
                likeBouncing ? "animate-like-bounce" : ""
              }`}
            >
              <ThumbsUp className="h-2.5 w-2.5 text-white" />
            </span>
            <span className="tabular-nums">{liked ? 129 : 128}</span>
          </button>
          <div className="flex gap-3 text-[12px]">
            <button
              type="button"
              onClick={() => {
                setFbCommentsOpen(!fbCommentsOpen);
                setFbShareOpen(false);
              }}
              className="hover:underline hover:text-[#050505] dark:hover:text-white"
            >
              {24 + fbCommentsList.length} bình luận
            </button>
            <button
              type="button"
              onClick={() => {
                setFbShareOpen(!fbShareOpen);
                setFbCommentsOpen(false);
              }}
              className="hover:underline hover:text-[#050505] dark:hover:text-white"
            >
              12 chia sẻ
            </button>
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
            onClick={() => {
              setFbCommentsOpen(!fbCommentsOpen);
              setFbShareOpen(false);
            }}
            className={`btn-tactile flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-[13px] font-medium transition-colors hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C] ${
              fbCommentsOpen
                ? "font-semibold text-[#1877F2] bg-[#F0F2F5] dark:bg-[#3A3B3C]"
                : "text-[#65676B] dark:text-[#B0B3B8]"
            }`}
          >
            <MessageCircle className="h-4 w-4" />
            <span>Bình luận</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setFbShareOpen(!fbShareOpen);
              setFbCommentsOpen(false);
            }}
            className={`btn-tactile flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-[13px] font-medium transition-colors hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C] ${
              fbShareOpen
                ? "font-semibold text-[#1877F2] bg-[#F0F2F5] dark:bg-[#3A3B3C]"
                : "text-[#65676B] dark:text-[#B0B3B8]"
            }`}
          >
            <Share2 className="h-4 w-4" />
            <span>Chia sẻ</span>
          </button>
        </div>

        {/* Facebook Backdrop for in-mockup drawers */}
        {(fbCommentsOpen || fbShareOpen) && (
          <div
            onClick={() => {
              setFbCommentsOpen(false);
              setFbShareOpen(false);
            }}
            className="absolute inset-0 z-30 bg-black/40 backdrop-blur-xs transition-opacity"
          />
        )}

        {/* Facebook Comments Bottom Sheet (Nhô từ dưới lên) */}
        <div
          className={`absolute inset-x-0 bottom-0 z-40 flex max-h-[82%] flex-col rounded-t-2xl border-t border-[var(--border-subtle)] bg-white shadow-2xl transition-transform duration-300 dark:border-[#3A3B3C] dark:bg-[#242526] ${
            fbCommentsOpen ? "translate-y-0" : "translate-y-full pointer-events-none"
          }`}
        >
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-4 py-2.5 dark:border-[#3A3B3C]">
            <span className="text-[13px] font-bold text-[#050505] dark:text-[#E4E6EB]">
              Bình luận ({24 + fbCommentsList.length})
            </span>
            <button
              type="button"
              onClick={() => setFbCommentsOpen(false)}
              className="rounded-full p-1 text-[#65676B] hover:bg-zinc-100 dark:text-[#B0B3B8] dark:hover:bg-zinc-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 max-h-[220px]">
            {fbCommentsList.map((c) => (
              <div key={c.id} className="flex gap-2.5 items-start text-[12px]">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-[10px]">
                  {c.name.slice(0, 1)}
                </div>
                <div className="flex-1 bg-[#F0F2F5] dark:bg-[#3A3B3C] rounded-2xl px-3 py-2">
                  <div className="font-semibold text-[#050505] dark:text-[#E4E6EB]">{c.name}</div>
                  <div className="text-[#050505] dark:text-[#E4E6EB] mt-0.5">{c.text}</div>
                  <div className="text-[10px] text-[#65676B] dark:text-[#B0B3B8] mt-1 flex gap-2">
                    <span>{c.time}</span>
                    <span className="font-semibold cursor-pointer hover:underline">Thích ({c.likes})</span>
                    <span className="font-semibold cursor-pointer hover:underline">Phản hồi</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddFbComment} className="border-t border-[var(--border-subtle)] p-2.5 flex items-center gap-2 dark:border-[#3A3B3C]">
            <input
              type="text"
              value={fbNewComment}
              onChange={(e) => setFbNewComment(e.target.value)}
              placeholder="Viết bình luận với vai trò khách hàng..."
              className="flex-1 rounded-full border border-zinc-300 bg-[#F0F2F5] px-3.5 py-1.5 text-[12px] text-zinc-900 placeholder:text-zinc-500 focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-[#3A3B3C] dark:text-white"
            />
            <button
              type="submit"
              disabled={!fbNewComment.trim()}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1877F2] text-white disabled:opacity-40"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>

        {/* Facebook Share Modal (in-mockup) */}
        <div
          className={`absolute inset-x-4 bottom-4 z-40 rounded-2xl border border-[var(--border-subtle)] bg-white p-4 shadow-2xl transition-all duration-200 dark:border-[#3A3B3C] dark:bg-[#242526] ${
            fbShareOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-700">
            <span className="text-[13px] font-bold text-zinc-900 dark:text-white">Chia sẻ bài viết</span>
            <button type="button" onClick={() => setFbShareOpen(false)} className="rounded-full p-1 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="pt-3 space-y-2">
            <button
              type="button"
              onClick={() => {
                if (typeof navigator !== "undefined" && navigator.clipboard) {
                  navigator.clipboard.writeText(window.location.href);
                }
                onNotify?.("Đã sao chép liên kết bài viết vào clipboard!");
                setFbShareOpen(false);
              }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[12.5px] font-medium text-zinc-800 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              <Copy className="h-4 w-4 text-indigo-500" />
              <span>Sao chép liên kết bài viết</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setFbShareOpen(false);
                handleDownloadAdBanner();
              }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[12.5px] font-medium text-zinc-800 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              <Download className="h-4 w-4 text-emerald-500" />
              <span>Tải banner quảng cáo (PNG 1200x630)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onNotify?.("Đã mô phỏng chia sẻ lên Bảng tin cá nhân!");
                setFbShareOpen(false);
              }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[12.5px] font-medium text-zinc-800 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
                    <Share2 className="h-4 w-4 text-blue-500" />
                    <span>Chia sẻ lên Bảng tin cá nhân</span>
                  </button>
                </div>
              </div>
                    </div>
                  ) : (
                    /* ── NỀN TẢNG 2: Instagram Feed Post (1:1) ── */
                    <div className="relative bg-white dark:bg-[#242526]">
            {/* Header */}
            <div className="flex items-center gap-2.5 px-3 py-2.5">
              <div className="rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-[2px]">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-[var(--accent-navy)] to-[var(--accent-emerald)] text-[11px] font-semibold text-white dark:border-black">
                  {brandInitials}
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1 truncate text-[13.5px] font-semibold text-[#262626] dark:text-[#F5F5F5]">
                  {brandHandle}
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#3897F0]" />
                </p>
                <p className="truncate text-[11.5px] text-[#8E8E8E]">
                  Hà Nội / TP. Hồ Chí Minh · Được tài trợ
                </p>
              </div>
              <button
                type="button"
                aria-label="Tùy chọn khác"
                className="rounded-full p-1 text-[#262626] transition-colors hover:bg-zinc-100 dark:text-[#F5F5F5] dark:hover:bg-white/10"
              >
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>

            {/* Media Canvas 1:1 */}
            <div
              onDoubleClick={handleIgDoubleTapLike}
              className="relative flex aspect-square w-full cursor-pointer select-none flex-col items-center justify-center gap-2 overflow-hidden bg-gradient-to-br from-[var(--accent-navy)] via-[#1e293b] to-[var(--accent-emerald)] px-8 text-center"
            >
              <Layers3 className="h-6 w-6 text-white/80" />
              <p className="text-[18px] font-bold leading-tight text-white">{brandName}</p>
              <p className="text-[12.5px] leading-snug text-white/85">
                {headline?.trim() || "Giải pháp tối ưu cho khách hàng của bạn"}
              </p>

              {igHeartPop && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <Heart className="h-20 w-20 animate-like-bounce fill-white text-white drop-shadow-lg" />
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between px-3 pt-2.5">
              <div className="flex items-center gap-3.5">
                <button
                  type="button"
                  onClick={handleIgToggleLike}
                  aria-label="Thích bài viết"
                  className="btn-tactile"
                >
                  <Heart
                    className={`h-6 w-6 transition-colors ${
                      igLiked
                        ? "fill-[#ED4956] text-[#ED4956]"
                        : "text-[#262626] dark:text-[#F5F5F5]"
                    }`}
                  />
                </button>
                <button type="button" aria-label="Bình luận" className="btn-tactile">
                  <MessageCircle className="h-6 w-6 text-[#262626] dark:text-[#F5F5F5]" />
                </button>
                <button type="button" aria-label="Chia sẻ" className="btn-tactile">
                  <Send className="h-6 w-6 text-[#262626] dark:text-[#F5F5F5]" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIgSaved((prev) => !prev);
                  onNotify?.(
                    igSaved ? "Đã bỏ lưu bài viết" : "Đã lưu bài viết vào Bộ sưu tập",
                  );
                }}
                aria-label="Lưu bài viết"
                className="btn-tactile"
              >
                <Bookmark
                  className={`h-6 w-6 transition-colors ${
                    igSaved
                      ? "fill-[#262626] text-[#262626] dark:fill-white dark:text-white"
                      : "text-[#262626] dark:text-[#F5F5F5]"
                  }`}
                />
              </button>
            </div>

            {/* Metrics */}
            <div className="px-3 pt-2">
              <p className="text-[13.5px] font-semibold text-[#262626] dark:text-[#F5F5F5]">
                {(1428 + (igLiked ? 1 : 0)).toLocaleString("en-US")} lượt thích
              </p>
            </div>

            {/* Caption & Hashtags */}
            <div className="px-3 pb-1 pt-1">
              <p className="whitespace-pre-wrap break-words text-[13.5px] leading-[1.5] text-[#262626] dark:text-[#F5F5F5]">
                <span className="mr-1 font-semibold">{brandHandle}</span>
                {igExpanded || !igTruncated ? activeText : `${igPreview}... `}
                {igTruncated && !igExpanded ? (
                  <button
                    type="button"
                    onClick={() => setIgExpanded(true)}
                    className="ml-1 font-medium text-[#8E8E8E] hover:text-[#262626] dark:hover:text-white"
                  >
                    Xem thêm
                  </button>
                ) : null}
              </p>

              {hashtags && hashtags.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-x-1.5 gap-y-0.5">
                  {hashtags.map((tag, idx) => {
                    const cleanTag = tag.trim().replace(/^#/, "");
                    return (
                      <span
                        key={idx}
                        className="cursor-pointer text-[13.5px] font-normal text-[#00376B] hover:underline dark:text-[#5B9BD5]"
                      >
                        #{cleanTag}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

                        {/* Comments Preview */}
                        <div className="px-3 pb-3 pt-1.5">
                          <p className="cursor-pointer text-[13px] text-[#8E8E8E]">
                            Xem tất cả 28 bình luận
                          </p>
                          <p className="mt-1 text-[11px] uppercase tracking-wide text-[#8E8E8E]">
                            2 giờ trước
                          </p>
                        </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="mt-2.5 text-center text-[12px] leading-relaxed text-[var(--ink-tertiary)]">
                      {activePlatform === "facebook"
                        ? "Mô phỏng Facebook Mobile · Đồng bộ trực tiếp từ vùng biên tập"
                        : "Mô phỏng Instagram Feed · Đồng bộ trực tiếp từ vùng biên tập"}
                    </p>
                  </div>
                </div>
              );
            }

export default memo(FacebookMockup);