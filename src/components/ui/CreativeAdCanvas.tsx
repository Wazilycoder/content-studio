"use client";

import { useEffect, useRef } from "react";

interface CreativeAdCanvasProps {
  tag: string;
  headline: string;
  sub: string;
  accentColor: string;
}

export function CreativeAdCanvas({
  tag,
  headline,
  sub,
  accentColor,
}: CreativeAdCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    let step = 0;

    const render = () => {
      step += 0.03;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Deep dark base
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, "#080C14");
      bgGrad.addColorStop(1, "#030508");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Optical dynamic grid
      ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
      ctx.lineWidth = 1;
      const gridSize = 24;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Generative dynamic wave / mesh
      ctx.save();
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        const offset = i * 1.8 + step;
        const colorAlpha = 0.25 - i * 0.06;

        ctx.strokeStyle =
          tag === "PAS"
            ? `rgba(244, 63, 94, ${colorAlpha})`
            : tag === "AIDA"
            ? `rgba(56, 189, 248, ${colorAlpha})`
            : `rgba(0, 212, 146, ${colorAlpha})`;

        ctx.lineWidth = 2.5 - i * 0.5;

        for (let x = 0; x <= width; x += 6) {
          const y =
            height * 0.55 +
            Math.sin(x * 0.015 + offset) * (18 + i * 8) +
            Math.cos(x * 0.03 - offset * 0.6) * 12;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.restore();

      // Ambient glowing core
      const glowGrad = ctx.createRadialGradient(
        width * 0.75,
        height * 0.45,
        5,
        width * 0.75,
        height * 0.45,
        height * 0.9
      );
      glowGrad.addColorStop(
        0,
        tag === "PAS"
          ? "rgba(244, 63, 94, 0.3)"
          : tag === "AIDA"
          ? "rgba(56, 189, 248, 0.3)"
          : "rgba(0, 212, 146, 0.3)"
      );
      glowGrad.addColorStop(1, "transparent");
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, width, height);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [tag]);

  return (
    <div className="relative aspect-[16/7] w-full overflow-hidden rounded-lg border border-white/10 bg-[#0B0F17]">
      <canvas
        ref={canvasRef}
        width={640}
        height={280}
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Living Glass Overlay with Typography */}
      <div className="relative z-10 flex h-full flex-col justify-between p-3.5 backdrop-blur-[1px]">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
            <span
              className="h-1.5 w-1.5 rounded-full animate-ping"
              style={{ backgroundColor: accentColor }}
            />
            <span>{tag} GENERATIVE ENGINE</span>
          </div>

          <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400">
            60 FPS GPU SYNTH
          </span>
        </div>

        <div className="rounded-lg border border-white/10 bg-black/50 p-2.5 backdrop-blur-md">
          <p className="text-xs sm:text-sm font-black tracking-tight text-white leading-snug">
            {headline}
          </p>
          <p className="mt-0.5 text-[10.5px] font-medium text-emerald-400 font-mono">
            {sub}
          </p>
        </div>
      </div>
    </div>
  );
}

