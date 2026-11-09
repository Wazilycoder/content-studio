"use client";

import { useEffect, useState } from "react";
import { Sparkles, Zap, ShieldCheck } from "lucide-react";

const TELEMETRY_STEPS = [
  "KHỞI ĐỘNG HỆ ĐIỀU HÀNH NỘI DUNG...",
  "KÍCH HOẠT BỘ LỌC ANTI-AI-SLOP 2026...",
  "ĐỒNG BỘ 3 GÓC TIẾP CẬN TÂM LÝ (PAS · AIDA · FAB)...",
  "HOÀN TẤT THIẾT LẬP LUXURY GLASS STUDIO.",
];

export function StudioPreloader() {
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Check if user already saw preloader in this session
    try {
      if (sessionStorage.getItem("cs_preloader_seen") === "1") {
        setShouldRender(false);
        return;
      }
      sessionStorage.setItem("cs_preloader_seen", "1");
    } catch {
      // Ignore in case of strict privacy mode
    }

    setMounted(true);

    // Lock body scroll immediately
    const originalOverflow = document.body.style.overflow;
    const originalTouchAction = document.body.style.touchAction;
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    const startTime = performance.now();
    const duration = 1400; // 1.4 seconds smooth cinematic load

    let animationFrameId: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const rawProgress = Math.min(1, elapsed / duration);
      // Apple-style ease-out curve
      const easedProgress = Math.round(
        (1 - Math.pow(1 - rawProgress, 3)) * 100
      );

      setProgress(easedProgress);

      if (easedProgress < 30) {
        setStepIndex(0);
      } else if (easedProgress < 65) {
        setStepIndex(1);
      } else if (easedProgress < 95) {
        setStepIndex(2);
      } else {
        setStepIndex(3);
      }

      if (rawProgress < 1) {
        animationFrameId = requestAnimationFrame(tick);
      } else {
        setProgress(100);
        setStepIndex(3);

        // Hold 200ms at 100%, then trigger curtain fade out
        setTimeout(() => {
          setIsDone(true);
          // Unlock body scroll smoothly
          document.body.style.overflow = originalOverflow;
          document.body.style.touchAction = originalTouchAction;

          // Remove DOM after transition finishes
          setTimeout(() => {
            setShouldRender(false);
          }, 800);
        }, 220);
      }
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationFrameId);
      document.body.style.overflow = originalOverflow;
      document.body.style.touchAction = originalTouchAction;
    };
  }, []);

  if (!mounted || !shouldRender) return null;

  return (
    <aside
      aria-label="Đang khởi tạo Content Studio"
      aria-live="polite"
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#06080D] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isDone
          ? "pointer-events-none opacity-0 scale-[1.04] backdrop-blur-0"
          : "opacity-100 scale-100 backdrop-blur-3xl"
      }`}
    >
      {/* Background Ambient Mesh */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-emerald-500/[0.12] blur-[120px] animate-pulse" />
        <div className="absolute left-1/3 top-1/3 h-[300px] w-[300px] rounded-full bg-cyan-500/[0.08] blur-[90px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      {/* Center Double-Bezel Glass Chassis */}
      <div className="relative mx-4 w-full max-w-md rounded-[2.5rem] p-2.5 bg-gradient-to-b from-white/[0.18] via-white/[0.05] to-white/[0.02] border border-white/[0.15] shadow-[0_30px_90px_-20px_rgba(0,0,0,0.85),inset_0_1.5px_1px_rgba(255,255,255,0.25)] backdrop-blur-3xl">
        <div className="relative overflow-hidden rounded-[calc(2.5rem-0.625rem)] bg-[#0A0D15]/90 p-8 sm:p-10 border border-white/[0.08] text-center backdrop-blur-2xl">
          {/* Glowing Brand Monogram */}
          <div className="mx-auto relative flex h-16 w-16 items-center justify-center">
            <div className="absolute inset-0 rounded-2xl bg-emerald-500/30 blur-xl animate-pulse" />
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-400 font-black text-slate-950 text-xl shadow-[0_0_25px_rgba(0,212,146,0.5),inset_0_1px_1px_rgba(255,255,255,0.4)]">
              CS
            </div>
          </div>

          {/* Title & Badge */}
          <h2 className="mt-5 text-xl font-extrabold tracking-tight text-white">
            CONTENT STUDIO
          </h2>
          <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-emerald-400">
            <Sparkles className="h-2.5 w-2.5 animate-spin text-emerald-400" />
            <span>Luxury Glass Edition · 2026</span>
          </div>

          {/* Percentage Counter */}
          <div className="mt-8 flex items-baseline justify-center gap-1 font-mono">
            <span className="text-4xl font-black tabular-nums tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-emerald-300">
              {progress}
            </span>
            <span className="text-sm font-bold text-emerald-400">%</span>
          </div>

          {/* Hairline Progress Track */}
          <div className="mt-4 relative h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06] border border-white/[0.08]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-300 shadow-[0_0_15px_rgba(0,212,146,0.8)] transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Dynamic Status Text */}
          <p className="mt-4 h-5 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-slate-400 truncate">
            {TELEMETRY_STEPS[stepIndex]}
          </p>

          {/* Telemetry Footnote */}
          <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span className="flex items-center gap-1">
              <Zap className="h-3 w-3 text-emerald-400" />
              0s Cooldown
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-teal-400" />
              Anti-AI-Slop Active
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
