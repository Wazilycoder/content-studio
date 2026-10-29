"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";

interface MousePosition {
  x: number;
  y: number;
}

interface ParticlesProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  size?: number;
  refresh?: boolean;
  color?: string;
  vx?: number;
  vy?: number;
}

function hexToRgb(hex: string): number[] {
  let clean = hex.replace("#", "");
  if (clean.length === 3) {
    clean = clean.split("").map((c) => c + c).join("");
  }
  const hexInt = parseInt(clean, 16);
  if (isNaN(hexInt)) return [99, 102, 241];
  return [(hexInt >> 16) & 255, (hexInt >> 8) & 255, hexInt & 255];
}

type Circle = {
  x: number;
  y: number;
  translateX: number;
  translateY: number;
  size: number;
  alpha: number;
  targetAlpha: number;
  dx: number;
  dy: number;
  magnetism: number;
};

export function Particles({
  className = "",
  quantity = 40,
  staticity = 50,
  ease = 50,
  size = 0.5,
  refresh = false,
  color = "#6366f1",
  vx = 0,
  vy = 0,
  ...props
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const circles = useRef<Circle[]>([]);
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const rafID = useRef<number | null>(null);
  const [mousePos, setMousePos] = useState<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePos({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    // Check prefers-reduced-motion
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    if (canvasRef.current) {
      context.current = canvasRef.current.getContext("2d");
    }

    const initCanvas = () => {
      if (!canvasContainerRef.current || !canvasRef.current || !context.current) return;
      const dpr = window.devicePixelRatio || 1;
      canvasSize.current.w = canvasContainerRef.current.offsetWidth;
      canvasSize.current.h = canvasContainerRef.current.offsetHeight;

      canvasRef.current.width = canvasSize.current.w * dpr;
      canvasRef.current.height = canvasSize.current.h * dpr;
      canvasRef.current.style.width = `${canvasSize.current.w}px`;
      canvasRef.current.style.height = `${canvasSize.current.h}px`;
      context.current.scale(dpr, dpr);

      circles.current = [];
      const rgb = hexToRgb(color);
      for (let i = 0; i < quantity; i++) {
        const x = Math.floor(Math.random() * canvasSize.current.w);
        const y = Math.floor(Math.random() * canvasSize.current.h);
        const pSize = Math.floor(Math.random() * 2) + size;
        const targetAlpha = parseFloat((Math.random() * 0.6 + 0.1).toFixed(1));
        const circle: Circle = {
          x,
          y,
          translateX: 0,
          translateY: 0,
          size: pSize,
          alpha: 0,
          targetAlpha,
          dx: (Math.random() - 0.5) * 0.15,
          dy: (Math.random() - 0.5) * 0.15,
          magnetism: 0.1 + Math.random() * 3,
        };
        circles.current.push(circle);
      }
    };

    initCanvas();

    const render = () => {
      if (!context.current) return;
      const dpr = window.devicePixelRatio || 1;
      context.current.clearRect(0, 0, canvasSize.current.w, canvasSize.current.h);
      const rgb = hexToRgb(color);

      circles.current.forEach((circle, i) => {
        if (circle.alpha < circle.targetAlpha) {
          circle.alpha += 0.02;
        }

        circle.x += circle.dx + vx;
        circle.y += circle.dy + vy;
        circle.translateX += (mouse.current.x / (staticity / circle.magnetism) - circle.translateX) / ease;
        circle.translateY += (mouse.current.y / (staticity / circle.magnetism) - circle.translateY) / ease;

        if (
          circle.x < -circle.size ||
          circle.x > canvasSize.current.w + circle.size ||
          circle.y < -circle.size ||
          circle.y > canvasSize.current.h + circle.size
        ) {
          circles.current.splice(i, 1);
          circles.current.push({
            x: Math.floor(Math.random() * canvasSize.current.w),
            y: Math.floor(Math.random() * canvasSize.current.h),
            translateX: 0,
            translateY: 0,
            size: Math.floor(Math.random() * 2) + size,
            alpha: 0,
            targetAlpha: parseFloat((Math.random() * 0.6 + 0.1).toFixed(1)),
            dx: (Math.random() - 0.5) * 0.15,
            dy: (Math.random() - 0.5) * 0.15,
            magnetism: 0.1 + Math.random() * 3,
          });
          return;
        }

        context.current?.save();
        context.current?.translate(circle.translateX, circle.translateY);
        context.current?.beginPath();
        context.current?.arc(circle.x, circle.y, circle.size, 0, 2 * Math.PI);
        if (context.current) {
          context.current.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${circle.alpha})`;
          context.current.fill();
        }
        context.current?.restore();
      });

      rafID.current = window.requestAnimationFrame(render);
    };

    rafID.current = window.requestAnimationFrame(render);

    const handleResize = () => {
      initCanvas();
    };

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      if (rafID.current) window.cancelAnimationFrame(rafID.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [color, quantity, size, staticity, ease, vx, vy, refresh]);

  useEffect(() => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const { w, h } = canvasSize.current;
      const x = mousePos.x - rect.left - w / 2;
      const y = mousePos.y - rect.top - h / 2;
      if (x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2) {
        mouse.current.x = x;
        mouse.current.y = y;
      }
    }
  }, [mousePos]);

  return (
    <div
      ref={canvasContainerRef}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      {...props}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
