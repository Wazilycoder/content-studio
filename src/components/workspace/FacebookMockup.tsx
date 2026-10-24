"use client";

import { useEffect, useRef, useState } from "react";
import { Globe, MessageCircle, Share2, ThumbsUp } from "lucide-react";
import type { CaptionItem } from "@/types/content";

const FB_PREVIEW_LIMIT = 125;

function truncateToChars(text: string, limit: number) {
  const chars = Array.from(text);
  if (chars.length <= limit) {
    return { preview: text, truncated: false };
  }
  return { preview: chars.slice(0, limit).join("").trimEnd(), truncated: true };
}

interface FacebookMockupProps {
  captions: CaptionItem[];
}

export default function FacebookMockup({ captions }: FacebookMockupProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [fading, setFading] = useState(false);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    };
  }, []);

  const safeIndex = Math.min(activeIndex, captions.length - 1);
  const active = captions[safeIndex];
  if (!active) return null;

  const { preview, truncated } = truncateToChars(active.text, FB_PREVIEW_LIMIT);

  const handleSelectAngle = (index: number) => {
    if (index === safeIndex) return;
    if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    setFading(true);
    setExpanded(false);
    fadeTimerRef.current = setTimeout(() => {
      setActiveIndex(index);
      setFading(false);
    }, 150);
  };

  return (
    <div>
      {/* Swipeable angle tabs */}
      <div className="mb-3 flex snap-x gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {captions.map((caption, index) => {
          const isActive = index === safeIndex;
          return (
            <button
              key={caption.id}
              type="button"
              onClick={() => {
                setActiveIndex(index);
                setExpanded(false);
              }}
              className={`shrink-0 snap-start whitespace-nowrap rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors ${
                isActive
                  ? "border-[var(--accent-navy)] bg-[var(--accent-navy)] text-white"
                  : "border-[var(--border-subtle)] bg-white text-[var(--ink-secondary)] hover:border-[var(--border-strong)]"
              }`}
            >
              Góc {index + 1}
            </button>
          );
        })}
      </div>

      {/* Facebook post card */}
      <div className="mx-auto w-full max-w-[560px] overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-2.5 px-3 pt-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent-navy)] text-[13px] font-semibold text-white">
            CH
          </div>
          <div className="min-w-0">
            <p className="truncate text-[14px] font-semibold text-[#050505]">
              Cửa Hàng Của Bạn
            </p>
            <p className="flex items-center gap-1 text-[12px] text-[#65676B]">
              Vừa xong · <Globe className="h-3 w-3" />
            </p>
          </div>
        </div>

        <div className="px-3 py-2.5">
          <p className="whitespace-pre-wrap break-words text-[15px] leading-[1.4] text-[#050505]">
            {expanded || !truncated ? active.text : `${preview}... `}
            {truncated && !expanded ? (
              <button
                type="button"
                onClick={() => setExpanded(true)}
                className="font-medium text-[#65676B] hover:underline"
              >
                Xem thêm
              </button>
            ) : null}
            {truncated && expanded ? (
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="ml-1 font-medium text-[#65676B] hover:underline"
              >
                Ẩn bớt
              </button>
            ) : null}
          </p>
        </div>

        <div className="flex aspect-[4/3] w-full items-center justify-center border-y border-[#E4E6EB] bg-[#F0F2F5]">
          <span className="text-[13px] text-[#8A8D91]">Hình ảnh sản phẩm</span>
        </div>

        <div className="flex items-center justify-between px-3 py-2 text-[13px] text-[#65676B]">
          <div className="flex items-center gap-1">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#1877F2]">
              <ThumbsUp className="h-2.5 w-2.5 text-white" />
            </span>
            <span>128</span>
          </div>
          <div className="flex gap-3">
            <span>24 bình luận</span>
            <span>12 chia sẻ</span>
          </div>
        </div>

        <div className="flex items-center justify-around border-t border-[#E4E6EB] px-1 py-1">
          {[
            { icon: ThumbsUp, label: "Thích" },
            { icon: MessageCircle, label: "Bình luận" },
            { icon: Share2, label: "Chia sẻ" },
          ].map(({ icon: Icon, label }) => (
            <button
              key={label}
              type="button"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-[13px] font-medium text-[#65676B] transition-colors hover:bg-[#F0F2F5]"
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}