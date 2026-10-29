import type { LucideIcon } from "lucide-react";
import { Megaphone, Camera, AtSign, Music2, MessageCircle } from "lucide-react";

interface TelemetryChip {
  channel: string;
  metric: string;
  icon: LucideIcon;
}

const CHIPS: TelemetryChip[] = [
  { channel: "Facebook", metric: "FB Hook: 125 chars", icon: Megaphone },
  { channel: "Instagram", metric: "0s Latency", icon: Camera },
  { channel: "Threads", metric: "3 Angles Synthesis", icon: AtSign },
  { channel: "TikTok Shop", metric: "100% Anti-AI-Slop", icon: Music2 },
  { channel: "Zalo", metric: "16 Momme Silk Tested", icon: MessageCircle },
  { channel: "Facebook Ads", metric: "CTR +42%", icon: Megaphone },
  { channel: "Instagram Shop", metric: "Zero Watermark", icon: Camera },
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
            className="flex shrink-0 items-center gap-2.5 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-raised)]/40 px-4 py-2"
          >
            <Icon className="h-3.5 w-3.5 text-[var(--brand)]" aria-hidden="true" />
            <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[var(--ink-tertiary)]">
              {chip.channel}
            </span>
            <span
              aria-hidden="true"
              className="h-3 w-px bg-[var(--border-strong)]"
            />
            <span className="font-mono text-[12px] font-medium tabular-nums text-[var(--ink-primary)]">
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
      className="w-full overflow-hidden border-y border-[var(--border-subtle)] bg-[var(--canvas)] py-8"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-center font-mono text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[var(--ink-tertiary)]">
          {"[Channel Telemetry // Live Benchmarks]"}
        </p>
      </div>

      <div className="mask-fade-x mt-5 space-y-3 overflow-hidden">
        <TelemetryRow />
        <TelemetryRow reverse />
      </div>
    </section>
  );
}