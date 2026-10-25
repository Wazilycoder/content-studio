"use client";

import { memo, useEffect, useRef, useState } from "react";
import {
  Bookmark,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  Globe,
  Heart,
  Layers3,
  Loader2,
  MessageCircle,
  Music2,
  Plus,
  Radio,
  Search,
  Send,
  Share2,
  ShoppingBag,
  ShoppingCart,
  Star,
  ThumbsUp,
  Video,
  X,
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

const SHOPEE_SLIDES = [
  {
    title: "Vấn đề & Giải pháp (PAS)",
    gradient: "from-[#EE4D2D] via-[#ea580c] to-[#fbbf24]",
    tag: "Flash Sale 45%",
    desc: "Đánh trúng nỗi đau, cam kết giải pháp tức thì",
  },
  {
    title: "Cảm Xúc & Phong Cách Sống",
    gradient: "from-[#ec4899] via-[#f43f5e] to-[#fb7185]",
    tag: "Độc Quyền Mall",
    desc: "Trải nghiệm vượt trội, khẳng định phong cách cá nhân",
  },
  {
    title: "Chi Tiết Tính Năng & Thông Số",
    gradient: "from-[#2563eb] via-[#3b82f6] to-[#0ea5e9]",
    tag: "Chính Hãng 100%",
    desc: "Độ bền chuẩn công nghiệp, chứng nhận tiêu chuẩn cao",
  },
  {
    title: "Feedback Khách Hàng Thực Tế",
    gradient: "from-[#059669] via-[#10b981] to-[#14b8a6]",
    tag: "4.9/5 Sao (1.8k Đánh Giá)",
    desc: "Khách hàng hài lòng và đánh giá 5 sao rộng rãi",
  },
  {
    title: "Chính Sách Hậu Mãi & Bảo Hành",
    gradient: "from-[#7c3aed] via-[#8b5cf6] to-[#6366f1]",
    tag: "Freeship Xtra Toàn Quốc",
    desc: "Đổi trả 7 ngày miễn phí, kiểm hàng trước khi nhận",
  },
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

  // TikTok states
  const [tiktokFollowed, setTiktokFollowed] = useState(false);
  const [tiktokCommentsOpen, setTiktokCommentsOpen] = useState(false);
  const [tiktokBookmarked, setTiktokBookmarked] = useState(false);
  const [tiktokShareOpen, setTiktokShareOpen] = useState(false);
  const [tiktokAudioPlaying, setTiktokAudioPlaying] = useState(true);
  const [tiktokCommentsList, setTiktokCommentsList] = useState([
    {
      id: "tt-1",
      user: "linh_dan_09",
      time: "2h trước",
      text: "Clip làm hook cuốn thật sự, xem hết clip mới nhận ra là quảng cáo haha 👏",
      likes: 142,
    },
    {
      id: "tt-2",
      user: "hailong.media",
      time: "5h trước",
      text: "Đúng nỗi đau luôn shop ơi, xin giá với ạ!",
      likes: 67,
    },
  ]);
  const [tiktokNewComment, setTiktokNewComment] = useState("");

  // Shopee states
  const [shopeeSlideIdx, setShopeeSlideIdx] = useState(0);
  const [shopeeCartCount, setShopeeCartCount] = useState(2);
  const [shopeeChatOpen, setShopeeChatOpen] = useState(false);
  const [shopeeBuyOpen, setShopeeBuyOpen] = useState(false);
  const [shopeeChatMessages, setShopeeChatMessages] = useState([
    {
      from: "shop",
      time: "Vừa xong",
      text: "Dạ Content Studio Official xin chào bạn! Shop có voucher giảm 30K cho đơn từ 200K ạ. Bạn cần shop hỗ trợ tư vấn chi tiết hơn về sản phẩm này không ạ?",
    },
  ]);
  const [shopeeChatInput, setShopeeChatInput] = useState("");

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

  const handleAddTiktokComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tiktokNewComment.trim()) return;
    setTiktokCommentsList((prev) => [
      ...prev,
      {
        id: `tt-${Date.now()}`,
        user: "ban_chushop",
        time: "Vừa xong",
        text: tiktokNewComment.trim(),
        likes: 0,
      },
    ]);
    setTiktokNewComment("");
    onNotify?.("Đã gửi bình luận TikTok mô phỏng!");
  };

  const handleSendShopeeChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopeeChatInput.trim()) return;
    const userMsg = shopeeChatInput.trim();
    setShopeeChatMessages((prev) => [
      ...prev,
      { from: "user", time: "Vừa xong", text: userMsg },
    ]);
    setShopeeChatInput("");
    setTimeout(() => {
      setShopeeChatMessages((prev) => [
        ...prev,
        {
          from: "shop",
          time: "Vừa xong",
          text: `Dạ shop đã nhận được tin nhắn "${userMsg}". Nhân viên tư vấn sẽ liên hệ gửi ưu đãi cho bạn ngay ạ!`,
        },
      ]);
    }, 500);
  };

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
      <div className="relative mx-auto w-full max-w-[560px] overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:border-[#393A3B] dark:bg-[#242526] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
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
            <div className="absolute bottom-24 right-2 flex flex-col items-center gap-3 z-20">
              <div className="relative mb-1">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-[var(--accent-navy)] to-[var(--accent-emerald)] text-[11px] font-bold text-white">
                  {brandInitials}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setTiktokFollowed((prev) => !prev);
                    onNotify?.(tiktokFollowed ? "Đã hủy theo dõi kênh" : `Đã theo dõi @${brandHandle}`);
                  }}
                  className={`absolute -bottom-1.5 left-1/2 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full text-white shadow-sm transition-colors cursor-pointer ${
                    tiktokFollowed ? "bg-emerald-500" : "bg-[#FE2C55]"
                  }`}
                  aria-label={tiktokFollowed ? "Đã theo dõi" : "Theo dõi"}
                >
                  {tiktokFollowed ? (
                    <Check className="h-2.5 w-2.5" strokeWidth={3} />
                  ) : (
                    <Plus className="h-2.5 w-2.5" strokeWidth={3} />
                  )}
                </button>
              </div>

              <button
                type="button"
                onClick={handleToggleLike}
                aria-label="Thích video"
                className="flex flex-col items-center gap-0.5 cursor-pointer"
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

              <button
                type="button"
                onClick={() => setTiktokCommentsOpen(true)}
                className="flex flex-col items-center gap-0.5 cursor-pointer"
                aria-label="Mở bình luận TikTok"
              >
                <MessageCircle className="h-6 w-6 text-white" />
                <span className="text-[10px] font-medium tabular-nums text-white/90">
                  {1.2 + (tiktokCommentsList.length > 2 ? 0.1 : 0)}K
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTiktokBookmarked((prev) => !prev);
                  onNotify?.(tiktokBookmarked ? "Đã bỏ lưu video" : "Đã lưu video vào mục Yêu thích");
                }}
                className="flex flex-col items-center gap-0.5 cursor-pointer"
                aria-label="Lưu video TikTok"
              >
                <Bookmark
                  className={`h-6 w-6 transition-colors ${
                    tiktokBookmarked ? "fill-[#FACD3D] text-[#FACD3D]" : "text-white"
                  }`}
                />
                <span className="text-[10px] font-medium tabular-nums text-white/90">
                  {tiktokBookmarked ? "3.5K" : "3.4K"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setTiktokShareOpen(true)}
                className="flex flex-col items-center gap-0.5 cursor-pointer"
                aria-label="Chia sẻ video TikTok"
              >
                <Share2 className="h-6 w-6 text-white" />
                <span className="text-[10px] font-medium tabular-nums text-white/90">892</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTiktokAudioPlaying((prev) => !prev);
                  onNotify?.(tiktokAudioPlaying ? "Đã tạm dừng âm thanh" : "Đang phát âm thanh thịnh hành");
                }}
                title={tiktokAudioPlaying ? "Tạm dừng âm thanh" : "Phát âm thanh"}
                className={`mt-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white/60 bg-gradient-to-br from-[#1f2937] to-[#0f172a] shadow-lg transition-transform cursor-pointer ${
                  tiktokAudioPlaying ? "animate-spin" : ""
                }`}
                style={{ animationDuration: "6s" }}
              >
                <Music2 className="h-3.5 w-3.5 text-white" />
              </button>
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

            {/* TikTok Comments Drawer (Inside 9:16 frame) */}
            {(tiktokCommentsOpen || tiktokShareOpen) && (
              <div
                onClick={() => {
                  setTiktokCommentsOpen(false);
                  setTiktokShareOpen(false);
                }}
                className="absolute inset-0 z-30 bg-black/60 backdrop-blur-xs transition-opacity"
              />
            )}
            <div
              className={`absolute inset-x-0 bottom-0 z-40 flex h-[70%] flex-col rounded-t-2xl border-t border-white/10 bg-[#1e1e1e] text-white shadow-2xl transition-transform duration-300 ${
                tiktokCommentsOpen ? "translate-y-0" : "translate-y-full pointer-events-none"
              }`}
            >
              <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-white/10">
                <span className="text-[12px] font-bold">Bình luận ({1200 + tiktokCommentsList.length})</span>
                <button type="button" onClick={() => setTiktokCommentsOpen(false)} className="rounded-full p-1 text-white/70 hover:bg-white/10">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2.5 text-[11px]">
                {tiktokCommentsList.map((c) => (
                  <div key={c.id} className="flex gap-2 items-start">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-pink-500 to-indigo-500 text-[10px] font-bold">
                      {c.user.slice(0, 1).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-white/80">@{c.user}</div>
                      <div className="text-white/95 mt-0.5">{c.text}</div>
                      <div className="text-[9.5px] text-white/50 mt-1 flex gap-2">
                        <span>{c.time}</span>
                        <span className="cursor-pointer hover:underline">Trả lời</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleAddTiktokComment} className="p-2 border-t border-white/10 flex items-center gap-2 bg-[#121212]">
                <input
                  type="text"
                  value={tiktokNewComment}
                  onChange={(e) => setTiktokNewComment(e.target.value)}
                  placeholder="Thêm bình luận..."
                  className="flex-1 rounded-full bg-white/10 px-3 py-1.5 text-[11px] text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-[#FE2C55]"
                />
                <button
                  type="submit"
                  disabled={!tiktokNewComment.trim()}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FE2C55] text-white disabled:opacity-40"
                >
                  <Send className="h-3 w-3" />
                </button>
              </form>
            </div>

            {/* TikTok Share Sheet */}
            <div
              className={`absolute inset-x-0 bottom-0 z-40 rounded-t-2xl border-t border-white/10 bg-[#1e1e1e] p-3.5 text-white shadow-2xl transition-transform duration-300 ${
                tiktokShareOpen ? "translate-y-0" : "translate-y-full pointer-events-none"
              }`}
            >
              <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
                <span className="text-[12px] font-bold">Chia sẻ lên</span>
                <button type="button" onClick={() => setTiktokShareOpen(false)} className="rounded-full p-1 text-white/70 hover:bg-white/10">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="pt-2.5 space-y-1.5">
                <button
                  type="button"
                  onClick={() => {
                    if (typeof navigator !== "undefined" && navigator.clipboard) {
                      navigator.clipboard.writeText(window.location.href);
                    }
                    onNotify?.("Đã sao chép liên kết TikTok vào clipboard!");
                    setTiktokShareOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-left text-[11.5px] text-white/90 hover:bg-white/10"
                >
                  <Copy className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Sao chép liên kết</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onNotify?.("Đã mô phỏng lưu video TikTok!");
                    setTiktokShareOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-left text-[11.5px] text-white/90 hover:bg-white/10"
                >
                  <Download className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Lưu video về máy</span>
                </button>
              </div>
            </div>
          </div>

          <p className="mt-2 text-center text-[11px] text-[var(--ink-tertiary)]">
            Mô phỏng khung 9:16 · Kịch bản video TikTok đồng bộ trực tiếp từ Vùng 2
          </p>
        </div>
      ) : (
        /* ── NỀN TẢNG 3: Shopee / E-commerce product feed ── */
        <div className="mx-auto w-full max-w-[420px]">
          <div className="relative overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-white text-[#222] shadow-md dark:bg-[#242526] dark:text-[#eee]">
            {/* Ảnh sản phẩm 1:1 với Gallery Carousel */}
            <div className={`relative aspect-square w-full overflow-hidden bg-gradient-to-br ${SHOPEE_SLIDES[shopeeSlideIdx].gradient} transition-all duration-300`}>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 px-7 text-center">
                <Layers3 className="h-5 w-5 text-white/85" />
                <p className="text-[16px] font-bold leading-tight text-white drop-shadow-sm">
                  {brandName}
                </p>
                <p className="text-[12.5px] font-medium leading-snug text-white/95">
                  {SHOPEE_SLIDES[shopeeSlideIdx].title}
                </p>
                <p className="text-[11px] leading-snug text-white/80">
                  {SHOPEE_SLIDES[shopeeSlideIdx].desc}
                </p>
              </div>

              {/* Header Badge + Giỏ hàng */}
              <div className="absolute left-2 top-2 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded bg-[#EE4D2D] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white shadow-sm">
                  <Star className="h-2.5 w-2.5 fill-current" />
                  Mall · Yêu thích
                </span>
                <span className="inline-flex items-center rounded bg-black/45 px-1.5 py-0.5 text-[9px] font-semibold text-white">
                  {SHOPEE_SLIDES[shopeeSlideIdx].tag}
                </span>
              </div>

              <div className="absolute right-2 top-2 flex items-center gap-1.5">
                <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-xs">
                  <ShoppingCart className="h-3.5 w-3.5" />
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#EE4D2D] text-[9px] font-bold text-white">
                    {shopeeCartCount}
                  </span>
                </div>
              </div>

              {/* Prev / Next Carousel Buttons */}
              <button
                type="button"
                onClick={() => setShopeeSlideIdx((prev) => (prev === 0 ? SHOPEE_SLIDES.length - 1 : prev - 1))}
                aria-label="Ảnh trước"
                className="absolute left-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setShopeeSlideIdx((prev) => (prev === SHOPEE_SLIDES.length - 1 ? 0 : prev + 1))}
                aria-label="Ảnh sau"
                className="absolute right-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              <span className="absolute bottom-2 right-2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-medium text-white">
                {shopeeSlideIdx + 1}/{SHOPEE_SLIDES.length} ảnh
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
                  onClick={() => setShopeeChatOpen(true)}
                  className="btn-tactile rounded border border-[#EE4D2D] bg-white px-2.5 py-1.5 text-[11px] font-semibold text-[#EE4D2D] dark:bg-transparent cursor-pointer"
                >
                  Chat ngay
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShopeeCartCount((prev) => prev + 1);
                    onNotify?.(`Đã thêm 1x "${brandName}" vào giỏ hàng Shopee!`);
                  }}
                  className="btn-tactile rounded border border-[#EE4D2D] bg-[#EE4D2D]/10 px-2.5 py-1.5 text-[11px] font-semibold text-[#EE4D2D] cursor-pointer"
                >
                  Thêm vào giỏ
                </button>
                <button
                  type="button"
                  onClick={() => setShopeeBuyOpen(true)}
                  className="btn-tactile flex-1 rounded bg-[#EE4D2D] px-3 py-1.5 text-[11.5px] font-bold text-white transition-colors hover:bg-[#d73211] cursor-pointer"
                >
                  Mua ngay
                </button>
              </div>
            </div>

            {/* Shopee Chat Popup */}
            {shopeeChatOpen && (
              <div className="absolute inset-0 z-40 flex flex-col bg-white dark:bg-[#242526]">
                <div className="flex items-center justify-between bg-[#EE4D2D] p-3 text-white">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-white text-[#EE4D2D] font-bold flex items-center justify-center text-xs">
                      {brandInitials}
                    </div>
                    <div>
                      <div className="text-[12.5px] font-bold leading-tight">{brandName}</div>
                      <div className="text-[10px] text-white/80">Thường phản hồi trong vài phút</div>
                    </div>
                  </div>
                  <button type="button" onClick={() => setShopeeChatOpen(false)} className="rounded-full p-1 hover:bg-black/10">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-2 text-[11.5px]">
                  {shopeeChatMessages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col ${m.from === "user" ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-3 py-2 leading-relaxed ${
                          m.from === "user"
                            ? "bg-[#EE4D2D] text-white rounded-br-xs"
                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-xs"
                        }`}
                      >
                        {m.text}
                      </div>
                      <span className="text-[9px] text-zinc-400 mt-0.5 px-1">{m.time}</span>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendShopeeChat} className="border-t border-zinc-200 dark:border-zinc-700 p-2 flex items-center gap-2">
                  <input
                    type="text"
                    value={shopeeChatInput}
                    onChange={(e) => setShopeeChatInput(e.target.value)}
                    placeholder="Hỏi shop về sản phẩm..."
                    className="flex-1 rounded-full border border-zinc-300 dark:border-zinc-700 px-3.5 py-1.5 text-[11.5px] focus:outline-none focus:border-[#EE4D2D] dark:bg-zinc-800 dark:text-white"
                  />
                  <button
                    type="submit"
                    disabled={!shopeeChatInput.trim()}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EE4D2D] text-white disabled:opacity-40"
                  >
                    <Send className="h-3 w-3" />
                  </button>
                </form>
              </div>
            )}

            {/* Shopee Buy Now Order Summary Modal */}
            {shopeeBuyOpen && (
              <div className="absolute inset-0 z-40 flex flex-col justify-end bg-black/50 backdrop-blur-xs">
                <div className="rounded-t-2xl bg-white p-4 text-[#222] shadow-2xl dark:bg-[#242526] dark:text-[#eee]">
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-700">
                    <span className="text-[13px] font-bold">Xác nhận đơn hàng</span>
                    <button type="button" onClick={() => setShopeeBuyOpen(false)} className="rounded-full p-1 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="py-3 space-y-2 text-[12px]">
                    <div className="flex justify-between">
                      <span className="text-zinc-500 dark:text-zinc-400">Sản phẩm:</span>
                      <span className="font-semibold text-right max-w-[200px] truncate">{brandName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500 dark:text-zinc-400">Giá ưu đãi:</span>
                      <span className="font-bold text-[#EE4D2D]">₫249.000 <span className="line-through text-[10px] text-zinc-400">₫450.000</span></span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500 dark:text-zinc-400">Vận chuyển:</span>
                      <span className="text-emerald-600 font-semibold dark:text-emerald-400">Miễn phí (Freeship Xtra)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500 dark:text-zinc-400">Thời gian giao:</span>
                      <span>1 - 2 ngày làm việc</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onNotify?.("Đã tạo đơn hàng Shopee mô phỏng thành công! Cảm ơn bạn.");
                      setShopeeBuyOpen(false);
                    }}
                    className="w-full rounded-xl bg-[#EE4D2D] py-2.5 text-[12.5px] font-bold text-white shadow-md transition-colors hover:bg-[#d73211]"
                  >
                    Thanh toán ngay · ₫249.000
                  </button>
                </div>
              </div>
            )}
          </div>

          <p className="mt-2 text-center text-[11px] text-[var(--ink-tertiary)]">
            Mô phỏng gian hàng Shopee · Tiêu đề &amp; lợi ích đồng bộ từ Vùng 2
          </p>
        </div>
      )}
                </div>
              );
            }

export default memo(FacebookMockup);