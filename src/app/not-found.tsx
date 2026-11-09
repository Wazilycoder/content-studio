import Link from "next/link";
import { ArrowRight, Compass, Home, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-[#06080D] text-[#F3F4F6] selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Precision Micro-Grid & Ambient Lighting */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      <div className="pointer-events-none fixed top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-emerald-500/[0.08] blur-[140px]" />
      <div className="pointer-events-none fixed bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-cyan-500/[0.06] blur-[140px]" />

      {/* Obsidian Header */}
      <header className="relative z-20 w-full border-b border-white/[0.08] bg-[#06080D]/80 backdrop-blur-xl px-4 py-3 sm:px-8">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
          <Link href="/" className="group inline-flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 via-teal-300 to-sky-400 text-black font-black text-xs shadow-md shadow-emerald-500/25 transition-transform duration-200 group-hover:scale-105">
              CS
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-extrabold tracking-tight text-white leading-none">
                Content Studio
              </span>
              <span className="font-mono text-[8.5px] uppercase tracking-wider text-slate-400 mt-0.5">
                Error 404 Telemetry
              </span>
            </div>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.1] bg-[#0A0D15]/80 px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:border-white/20 hover:text-white active:scale-[0.98] backdrop-blur-md"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Về Trang chủ</span>
          </Link>
        </div>
      </header>

      {/* 404 Double-Bezel Glass Chassis */}
      <main className="relative z-10 mx-auto flex flex-1 w-full max-w-5xl items-center justify-center px-4 py-12 sm:px-6">
        <div className="relative w-full max-w-lg rounded-[2.5rem] border border-white/[0.12] bg-[#0A0D15]/85 p-8 sm:p-12 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.18)] backdrop-blur-2xl text-center">
          {/* Telemetry Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-[11px] font-mono font-bold text-rose-400 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-pulse" />
            <span>HTTP STATUS 404 · ROUTE NOT FOUND</span>
          </div>

          {/* Compass Icon Crucible */}
          <div className="mx-auto mt-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/[0.1] bg-[#0E131F]/90 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
            <Compass className="h-9 w-9 animate-spin [animation-duration:12s]" />
          </div>

          <h1 className="mt-6 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Trang này không tồn tại
          </h1>

          <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-400 max-w-sm mx-auto">
            Đường dẫn bạn vừa truy cập có thể đã được thay đổi hoặc bị gỡ bỏ. Hãy quay lại Studio để tiếp tục kiến tạo nội dung chuyển đổi cao.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/workspace"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 px-5 py-3 text-xs sm:text-sm font-black text-black shadow-lg shadow-emerald-500/25 transition-all hover:brightness-110 active:scale-[0.98]"
            >
              <span>Vào Studio làm việc</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.12] bg-[#07090E]/80 px-5 py-3 text-xs sm:text-sm font-semibold text-slate-200 transition-colors hover:border-white/25 hover:text-white active:scale-[0.98] backdrop-blur-md"
            >
              <Home className="h-4 w-4 text-slate-400" />
              <span>Về Trang chủ</span>
            </Link>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-mono text-slate-500">
            <Sparkles className="h-3 w-3 text-emerald-400" />
            <span>Content Studio · Zero-Slop Architecture 2026</span>
          </div>
        </div>
      </main>

      {/* Footer Strip */}
      <footer className="relative z-10 border-t border-white/[0.06] bg-[#06080D]/60 py-4 text-center font-mono text-[10px] text-slate-500">
        © 2026 Content Studio · All rights reserved.
      </footer>
    </div>
  );
}
