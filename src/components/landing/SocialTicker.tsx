import type { LucideIcon } from "lucide-react";
import { Megaphone, Camera, AtSign, Music2, MessageCircle } from "lucide-react";

interface Channel {
  name: string;
  icon: LucideIcon;
}

const CHANNELS: Channel[] = [
  { name: "Facebook", icon: Megaphone },
  { name: "Instagram", icon: Camera },
  { name: "Threads", icon: AtSign },
  { name: "TikTok Shop", icon: Music2 },
  { name: "Zalo", icon: MessageCircle },
];

export default function SocialTicker() {
  return (
    <section className="w-full border-y border-[var(--border-subtle)] bg-[var(--canvas)] py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-4 sm:px-6">
        <p className="text-center text-[13px] font-medium text-[var(--ink-secondary)]">
          Tối ưu hóa chuyển đổi cho Facebook, Instagram, Threads, TikTok Shop &amp; Zalo
        </p>

        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {CHANNELS.map((channel) => {
            const Icon = channel.icon;
            return (
              <li
                key={channel.name}
                className="flex items-center gap-2 text-[var(--ink-tertiary)]"
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span className="text-[12.5px] font-medium text-[var(--ink-secondary)]">
                  {channel.name}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}