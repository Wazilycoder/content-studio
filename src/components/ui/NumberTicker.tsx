"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";

export interface NumberTickerProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: number;
  startValue?: number;
  direction?: "up" | "down";
  delay?: number;
  decimalPlaces?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}

export function NumberTicker({
  value,
  startValue = 0,
  direction = "up",
  delay = 0,
  decimalPlaces = 0,
  duration = 1200,
  prefix = "",
  suffix = "",
  className,
  ...props
}: NumberTickerProps) {
  const [displayValue, setDisplayValue] = useState<number>(direction === "down" ? value : startValue);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let rafId: number | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          timeoutId = setTimeout(() => {
            const start = performance.now();
            const from = direction === "down" ? value : startValue;
            const to = direction === "down" ? startValue : value;

            const step = (timestamp: number) => {
              const elapsed = timestamp - start;
              const progress = Math.min(elapsed / duration, 1);
              // Apple fluid cubic ease-out: 1 - (1 - progress)^3
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = from + (to - from) * eased;
              setDisplayValue(current);

              if (progress < 1) {
                rafId = requestAnimationFrame(step);
              } else {
                setDisplayValue(to);
              }
            };
            rafId = requestAnimationFrame(step);
          }, delay * 1000);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timeoutId) clearTimeout(timeoutId);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [value, startValue, direction, delay, duration]);

  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(displayValue);

  return (
    <span
      ref={ref}
      className={cn("inline-block tabular-nums tracking-tight", className)}
      {...props}
    >
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
