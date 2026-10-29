"use client";

import React, { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  className?: string;
}

export interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
  name: string;
  className?: string;
  background?: ReactNode;
  Icon?: React.ElementType;
  description: string;
  badge?: string;
  children?: ReactNode;
}

export const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid w-full grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  badge,
  children,
  ...props
}: BentoCardProps) => (
  <div
    key={name}
    className={cn(
      "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 dark:border-white/10 bg-[var(--surface)] p-6 transition-all duration-300 hover:border-teal-500/40 hover:shadow-[0_10px_30px_-10px_rgba(0,212,146,0.15)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]",
      className
    )}
    {...props}
  >
    {background && (
      <div className="absolute inset-0 -z-10 pointer-events-none opacity-40 transition-opacity duration-300 group-hover:opacity-60">
        {background}
      </div>
    )}

    <div>
      <div className="flex items-center justify-between gap-2">
        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-hairline)] bg-[var(--surface-raised)] text-[var(--accent-indigo)]">
            <Icon className="h-5 w-5" />
          </div>
        )}
        {badge && (
          <span className="rounded-full border border-[var(--border-hairline)] bg-[var(--surface-raised)] px-2.5 py-0.5 text-[10px] font-semibold text-[var(--ink-secondary)]">
            {badge}
          </span>
        )}
      </div>

      <h3 className="mt-4 text-base font-bold text-[var(--ink-primary)]">
        {name}
      </h3>
      <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[var(--ink-secondary)]">
        {description}
      </p>
    </div>

    {children && (
      <div className="mt-4">
        {children}
      </div>
    )}
  </div>
);

export default BentoGrid;

