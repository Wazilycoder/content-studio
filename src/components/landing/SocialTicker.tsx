import type { LucideIcon } from "lucide-react";
import {
  Megaphone,
  Camera,
  Music2,
  AtSign,
  Play,
  MessageCircle,
  ShoppingBag,
  Headphones,
} from "lucide-react";

interface Channel {
  name: string;
  tagline: string;
  icon: LucideIcon;
  iconClass: string;
}

const CHANNELS: Channel[] = [
  {
    name: "Facebook Ads",
    tagline: "Facebook Post & Ads",
    icon: Megaphone,
    iconClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    name: "Instagram",
    tagline: "Instagram Reels & Feed",
    icon: Camera,
    iconClass: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
  },
  {
    name: "TikTok Shop",
    tagline: "TikTok Viral Hook",
    icon: Music2,
    iconClass: "bg-slate-800/10 text-slate-800 dark:bg-white/10 dark:text-slate-100",
  },
  {
    name: "Threads",
    tagline: "Threads Storytelling",
    icon: AtSign,
    iconClass: "bg-neutral-800/10 text-neutral-800 dark:bg-white/10 dark:text-neutral-100",
  },
  {
    name: "YouTube",
    tagline: "YouTube Shorts & SEO",
    icon: Play,
    iconClass: "bg-red-500/10 text-red-600 dark:text-red-400",
  },
  {
    name: "Zalo",
    tagline: "Zalo OA Broadcast",
    icon: MessageCircle,
    iconClass: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  },
  {
    name: "Shopee",
    tagline: "Shopee & TikTok Live Copy",
    icon: ShoppingBag,
    iconClass: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  },
  {
    name: "Spotify",
    tagline: "Podcast & Audio Ad Read",
    icon: Headphones,
    iconClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
];

function ChannelChip({ channel }: { channel: Channel }) {
  const Icon = channel.icon;
  return (
    <div className="inline-flex items-center gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] px-4 py-2 shadow-xs transition-all hover:scale-105 hover:border-[var(--accent-navy)]/40">
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${channel.iconClass}`}
      >
        <Icon className="h-4 w-4" />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-xs font-semibold text-[var(--ink-primary)]">
          {channel.name}
        </span>
        <span className="text-[11px] text-[var(--ink-tertiary)]">
          {channel.tagline}
        </span>
      </span>
    </div>
  );
}

function MarqueeStrip({
  channels,
  reverse,
}: {
  channels: Channel[];
  reverse: boolean;
}) {
  return (
    <div className={reverse ? "animate-marquee-reverse" : "animate-marquee"}>
      <ul className="flex shrink-0 items-center gap-4 pr-4">
        {channels.map((channel) => (
          <li key={channel.name}>
            <ChannelChip channel={channel} />
          </li>
        ))}
      </ul>
      <ul className="flex shrink-0 items-center gap-4 pr-4" aria-hidden="true">
        {channels.map((channel) => (
          <li key={`clone-${channel.name}`}>
            <ChannelChip channel={channel} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function SocialTicker() {
  const stripOne = CHANNELS;
  const stripTwo = [...CHANNELS.slice(4), ...CHANNELS.slice(0, 4)];

  return (
    <section className="relative w-full overflow-hidden border-y border-[var(--border-subtle)] bg-[var(--surface-raised)]/30 py-10 backdrop-blur-xs">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[var(--canvas)] to-transparent sm:w-40" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[var(--canvas)] to-transparent sm:w-40" />

      <div className="mb-6 flex justify-center px-4">
        <span className="text-center text-[11px] font-semibold uppercase tracking-widest text-[var(--ink-tertiary)]">
          Tối ưu hóa nội dung đa kênh &amp; mạng xã hội hàng đầu
        </span>
      </div>

      <div className="space-y-4">
        <MarqueeStrip channels={stripOne} reverse={false} />
        <MarqueeStrip channels={stripTwo} reverse />
      </div>
    </section>
  );
}