"use client";

import React, { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils/cn";

export interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  strength?: number;
  padding?: number;
  as?: "button" | "div";
}

export function MagneticButton({
  children,
  className,
  strength = 0.35,
  as = "button",
  onClick,
  type = "button",
  ...props
}: MagneticButtonProps) {
  const elementRef = useRef<HTMLButtonElement | HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsTouch(window.matchMedia("(pointer: coarse)").matches);
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (isTouch || !elementRef.current) return;
    const rect = elementRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseEnter = () => {
    if (!isTouch) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setPosition({ x: 0, y: 0 });
  };

  const sharedStyle = {
    transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
    transition: isHovered
      ? "transform 150ms cubic-bezier(0.16, 1, 0.3, 1)"
      : "transform 400ms cubic-bezier(0.16, 1, 0.3, 1)",
  };

  if (as === "div") {
    return (
      <div
        ref={elementRef as React.RefObject<HTMLDivElement>}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick as any}
        style={sharedStyle}
        className={cn(
          "relative inline-flex items-center justify-center select-none",
          className
        )}
      >
        {children}
      </div>
    );
  }

  return (
    <button
      ref={elementRef as React.RefObject<HTMLButtonElement>}
      type={type}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={sharedStyle}
      className={cn(
        "relative inline-flex items-center justify-center cursor-pointer select-none",
        "active:scale-[0.97] active:transition-transform active:duration-100",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
