"use client";

import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface VaulDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxHeight?: string;
}

export function VaulDrawer({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxHeight = "85vh",
}: VaulDrawerProps) {
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setCurrentY(0);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setStartY(e.touches[0].clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const diff = e.touches[0].clientY - startY;
    if (diff > 0) {
      setCurrentY(diff);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (currentY > 120) {
      onClose();
    } else {
      setCurrentY(0);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Drawer Panel */}
      <div
        ref={drawerRef}
        style={{
          maxHeight,
          transform: isDragging
            ? `translateY(${currentY}px)`
            : "translateY(0)",
          transition: isDragging ? "none" : "transform 300ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        className={cn(
          "relative w-full max-w-2xl bg-[var(--surface)] text-[var(--ink-primary)]",
          "rounded-t-[2rem] border-t border-x border-[var(--border-hairline)] shadow-2xl flex flex-col",
          "overflow-hidden z-10"
        )}
      >
        {/* Grab Handle Header */}
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="pt-3 pb-2 px-6 flex flex-col items-center cursor-grab active:cursor-grabbing border-b border-[var(--border-subtle)]"
        >
          <div className="w-12 h-1.5 rounded-full bg-[var(--ink-tertiary)]/20 mb-3" />
          <div className="w-full flex items-center justify-between">
            <div>
              {title && <h3 className="text-sm font-semibold tracking-tight">{title}</h3>}
              {description && (
                <p className="text-xs text-[var(--ink-secondary)] mt-0.5">{description}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full flex items-center justify-center text-[var(--ink-tertiary)] hover:text-[var(--ink-primary)] hover:bg-[var(--surface-raised)] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1 overscroll-contain">
          {children}
        </div>
      </div>
    </div>
  );
}
