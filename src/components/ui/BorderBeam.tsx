"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";

export interface BorderBeamProps {
  className?: string;
  duration?: number;
  colorFrom?: string;
  colorTo?: string;
  colorVia?: string;
  borderWidth?: number;
  reverse?: boolean;
}

export function BorderBeam({
  className,
  duration = 6,
  colorFrom = "#6366f1",
  colorVia = "#a855f7",
  colorTo = "#10b981",
  borderWidth = 1.5,
  reverse = false,
}: BorderBeamProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute -inset-[1px] rounded-[inherit] overflow-hidden z-0",
        className
      )}
    >
      <div
        className={cn(
          "absolute inset-[-150%]",
          reverse ? "animate-[spin_6s_linear_infinite_reverse]" : "animate-[spin_6s_linear_infinite]"
        )}
        style={{
          animationDuration: `${duration}s`,
          background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 260deg, ${colorFrom} 300deg, ${colorVia} 330deg, ${colorTo} 355deg, transparent 360deg)`,
        }}
      />
    </div>
  );
}
