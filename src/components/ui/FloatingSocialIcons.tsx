"use client";

import Image from "next/image";

interface FloatingSocialIconsProps {
  variant?: "landing" | "auth";
}

const ICONS_AUTH = [
  {
    name: "Facebook",
    src: "/assets/social/facebook.png",
    className: "top-16 left-4 sm:left-12 lg:left-24",
  },
  {
    name: "Instagram",
    src: "/assets/social/instagram.png",
    className: "top-20 right-4 sm:right-12 lg:right-24",
  },
  {
    name: "Twitter",
    src: "/assets/social/twitter.png",
    className: "bottom-28 left-6 sm:left-16 lg:left-28",
  },
  {
    name: "WhatsApp",
    src: "/assets/social/whatsapp.png",
    className: "bottom-24 right-6 sm:right-16 lg:right-28",
  },
  {
    name: "Messenger",
    src: "/assets/social/messenger.png",
    className: "top-1/2 -translate-y-1/2 left-2 sm:left-6 lg:left-12",
  },
  {
    name: "YouTube",
    src: "/assets/social/youtube.png",
    className: "top-1/2 -translate-y-1/2 right-2 sm:right-6 lg:right-12",
  },
];

export default function FloatingSocialIcons({ variant = "auth" }: FloatingSocialIconsProps) {
  if (variant === "landing") return null;

  return (
    <div
      aria-hidden="true"
      style={{ contain: "layout paint" }}
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none"
    >
      {ICONS_AUTH.map((icon) => (
        <div
          key={icon.name}
          style={{ transform: "translateZ(0)", contain: "layout paint" }}
          className={`absolute [content-visibility:auto] ${icon.className}`}
        >
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-200/80 bg-white/90 p-2 shadow-sm sm:h-14 sm:w-14 sm:p-2.5 dark:border-white/15 dark:bg-white/[0.07]">
            <div className="relative h-full w-full">
              <Image
                src={icon.src}
                alt={icon.name}
                fill
                sizes="(max-width: 640px) 48px, 56px"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
