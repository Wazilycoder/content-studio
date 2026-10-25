"use client";

import Image from "next/image";

interface FloatingSocialIconsProps {
  variant?: "landing" | "auth";
}

const ICONS_LANDING = [
  {
    name: "Facebook",
    src: "/assets/social/facebook.png",
    className: "top-20 left-4 sm:left-12 lg:left-20 w-12 h-12 sm:w-16 sm:h-16 animate-float-1",
    delay: "0s",
  },
  {
    name: "Instagram",
    src: "/assets/social/instagram.png",
    className: "top-32 right-4 sm:right-12 lg:right-24 w-12 h-12 sm:w-16 sm:h-16 animate-float-2",
    delay: "1.2s",
  },
  {
    name: "Twitter",
    src: "/assets/social/twitter.png",
    className: "top-[480px] left-2 sm:left-8 lg:left-16 w-10 h-10 sm:w-14 sm:h-14 animate-float-3",
    delay: "0.5s",
  },
  {
    name: "YouTube",
    src: "/assets/social/youtube.png",
    className: "top-[520px] right-2 sm:right-8 lg:right-20 w-11 h-11 sm:w-15 sm:h-15 animate-float-4",
    delay: "2.1s",
  },
  {
    name: "WhatsApp",
    src: "/assets/social/whatsapp.png",
    className: "top-[780px] left-6 sm:left-16 lg:left-28 w-10 h-10 sm:w-13 sm:h-13 animate-float-5",
    delay: "1.8s",
  },
  {
    name: "LinkedIn",
    src: "/assets/social/linkedin.png",
    className: "top-[820px] right-6 sm:right-16 lg:right-28 w-10 h-10 sm:w-13 sm:h-13 animate-float-6",
    delay: "0.9s",
  },
];

const ICONS_AUTH = [
  {
    name: "Facebook",
    src: "/assets/social/facebook.png",
    className: "top-16 left-4 sm:left-12 lg:left-24 animate-float-1",
  },
  {
    name: "Instagram",
    src: "/assets/social/instagram.png",
    className: "top-20 right-4 sm:right-12 lg:right-24 animate-float-2",
  },
  {
    name: "Twitter",
    src: "/assets/social/twitter.png",
    className: "bottom-28 left-6 sm:left-16 lg:left-28 animate-float-3",
  },
  {
    name: "WhatsApp",
    src: "/assets/social/whatsapp.png",
    className: "bottom-24 right-6 sm:right-16 lg:right-28 animate-float-4",
  },
  {
    name: "Messenger",
    src: "/assets/social/messenger.png",
    className: "top-1/2 -translate-y-1/2 left-2 sm:left-6 lg:left-12 animate-float-5",
  },
  {
    name: "YouTube",
    src: "/assets/social/youtube.png",
    className: "top-1/2 -translate-y-1/2 right-2 sm:right-6 lg:right-12 animate-float-6",
  },
];

export default function FloatingSocialIcons({ variant = "auth" }: FloatingSocialIconsProps) {
  const icons = ICONS_AUTH;

  return (
    <div
      aria-hidden="true"
      style={{ contain: "layout paint" }}
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none"
    >
      {icons.map((icon) => (
        <div
          key={icon.name}
          style={{ transform: "translateZ(0)", contain: "layout paint" }}
          className={`absolute [content-visibility:auto] ${icon.className}`}
        >
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-200/80 bg-white/90 p-2 shadow-sm transition-transform duration-150 ease-out hover:-translate-y-0.5 sm:h-14 sm:w-14 sm:p-2.5 dark:border-white/15 dark:bg-white/[0.07]">
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
