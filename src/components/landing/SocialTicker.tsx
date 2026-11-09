import type { LucideIcon } from "lucide-react";
import { Megaphone, Camera, AtSign, Music2, MessageCircle, ShieldCheck, Zap } from "lucide-react";

interface TelemetryChip {
  channel: string;
  metric: string;
  icon: LucideIcon;
}

const CHIPS: TelemetryChip[] = [
  { channel: "Facebook Ads", metric: "125 Chars Hook Ready", icon: Megaphone },
  { channel: "Instagram Feed", metric: "0s Generation Latency", icon: Camera },
  { channel: "Threads", metric: "3 Psychological Angles", icon: AtSign },
  { channel: "TikTok Shop", metric: "100% Anti-AI-Slop", icon: Music2 },
  { channel: "Zalo OA", metric: "16 Momme Tested", icon: MessageCircle },
  { channel: "Performance", metric: "CTR +42% Verified", icon: Zap },
  { channel: "Security", metric: "TLS 1.3 & Supabase RLS", icon: ShieldCheck },
];

function TelemetryRow({ reverse = false }: { reverse?: boolean }) {
  const ordered = reverse ? [...CHIPS].reverse() : CHIPS;
  const doubled = [...ordered, ...ordered];

  return (
    <div
      className={`${
        reverse ? "animate-marquee-reverse" : "animate-marquee"
      } gap-3`}
    >
      {doubled.map((chip, index) => {
        const Icon = chip.icon;
        return (
          <div
            key={`${chip.channel}-${chip.metric}-${index}`}
            className="flex shrink-0 items-center gap-2.5 rounded-full border border-white/[0.12] bg-[#0A0D15]/80 px-4 py-2 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-2xl transition-all duration-200 hover:border-emerald-500/40 hover:bg-[#0A0D15]/95 hover:shadow-[0_0_15px_rgba(0,212,146,0.15)] cursor-default"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
              <Icon className="h-3 w-3" aria-hidden="true" />
            </span>
            <span className="font-mono text-[10.5px] font-bold uppercase tracking-[0.12em] text-slate-300">
              {chip.channel}
            </span>
            <span
              aria-hidden="true"
              className="h-3 w-px bg-white/10"
            />
            <span className="font-mono text-[11.5px] font-semibold tabular-nums text-emerald-400">
              {chip.metric}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function SocialTicker() {
  return (
    <section
      aria-label="Chỉ số hiệu suất kênh phân phối"
      className="relative w-full overflow-hidden border-y border-white/[0.08] bg-[#070A10]/50 backdrop-blur-xl py-8"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 mb-4">
        <p className="text-center font-mono text-[10.5px] font-bold uppercase tracking-[0.2em] text-emerald-400">
          {"[ CHANNEL TELEMETRY // REAL-TIME PERFORMANCE BENCHMARKS ]"}
        </p>
      </div>

      <div className="mask-fade-x space-y-3 overflow-hidden">
        <TelemetryRow />
        <TelemetryRow reverse />
      </div>
    </section>
  );
}
