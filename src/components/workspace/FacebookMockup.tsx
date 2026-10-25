"use client";

import { useEffect, useRef, useState } from "react";
import { Globe, MessageCircle, Share2, Sparkles, ThumbsUp } from "lucide-react";

const FB_PREVIEW_LIMIT = 125;

function truncateToChars(text: string, limit: number) {
  const chars = Array.from(text);
  if (chars.length <= limit) {
    return { preview: text, truncated: false };
  }
  return { preview: chars.slice(0, limit).join("").trimEnd(), truncated: true };
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
}

export default function FacebookMockup({
  activeText,
  activeAngle,
  pageName,
  headline,
}: FacebookMockupProps) {
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeBouncing, setLikeBouncing] = useState(false);
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

  const handleToggleLike = () => {
    setLiked((prev) => !prev);
    setLikeBouncing(true);
    if (bounceTimerRef.current) clearTimeout(bounceTimerRef.current);
    bounceTimerRef.current = setTimeout(() => setLikeBouncing(false), 450);
  };

  return (
    <div className="animate-fade-in">
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

      {/* Facebook post card */}
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
                className="font-medium text-[#65676B] hover:underline dark:text-[#B0B3B8]"
              >
                Xem thêm
              </button>
            ) : null}
            {truncated && expanded ? (
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="ml-1 font-medium text-[#65676B] hover:underline dark:text-[#B0B3B8]"
              >
                Ẩn bớt
              </button>
            ) : null}
          </p>
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
    </div>
  );
}