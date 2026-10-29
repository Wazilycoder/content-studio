"use client";

import React, { type ComponentPropsWithoutRef, type CSSProperties } from "react";
import { cn } from "@/lib/utils/cn";

export interface ShimmerButtonProps extends ComponentPropsWithoutRef<"button"> {
  shimmerColor?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children?: React.ReactNode;
}

export const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      shimmerColor = "rgba(255, 255, 255, 0.35)",
      shimmerDuration = "3s",
      borderRadius = "9999px",
      background,
      className,
      children,
      style,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        style={
          {
            "--radius": borderRadius,
            "--shimmer-color": shimmerColor,
            ...(background ? { background } : {}),
            ...style,
          } as CSSProperties
        }
        className={cn(
          "group relative isolate inline-flex cursor-pointer items-center justify-center overflow-hidden [border-radius:var(--radius)]",
          "px-7 py-3.5 text-sm font-semibold text-white",
          "bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-[length:200%_auto] hover:bg-[right_center]",
          "border border-white/20 shadow-[0_0_25px_rgba(99,102,241,0.4)] hover:shadow-[0_0_35px_rgba(99,102,241,0.65)]",
          "transform-gpu transition-all duration-300 ease-out active:scale-95",
          className
        )}
        {...props}
      >
        {/* Sleek linear specular sheen sweeping smoothly across the button without cutting text */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -translate-x-full animate-[shimmer-sweep_3s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/25 to-transparent group-hover:duration-1000"
        />

        {/* Top edge glass reflection highlight */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent"
        />

        {/* Content */}
        <span className="relative z-10 flex items-center gap-2 tracking-wide">
          {children}
        </span>
      </button>
    );
  }
);

ShimmerButton.displayName = "ShimmerButton";
export default ShimmerButton;
