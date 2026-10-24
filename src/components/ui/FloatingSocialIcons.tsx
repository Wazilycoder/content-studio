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
    className: "top-16 left-6 sm:left-16 lg:left-28 w-11 h-11 sm:w-14 sm:h-14 animate-float-1",
  },
  {
    name: "Instagram",
    src: "/assets/social/instagram.png",
    className: "top-24 right-6 sm:right-16 lg:right-28 w-11 h-11 sm:w-14 sm:h-14 animate-float-2",
  },
  {
    name: "Twitter",
    src: "/assets/social/twitter.png",
    className: "bottom-24 left-8 sm:left-20 lg:left-32 w-10 h-10 sm:w-13 sm:h-13 animate-float-3",
  },
  {
    name: "YouTube",
    src: "/assets/social/youtube.png",
    className: "bottom-20 right-8 sm:right-20 lg:right-32 w-10 h-10 sm:w-13 sm:h-13 animate-float-4",
  },
  {
    name: "WhatsApp",
    src: "/assets/social/whatsapp.png",
    className: "top-1/2 -translate-y-1/2 left-3 sm:left-8 lg:left-14 w-9 h-9 sm:w-12 sm:h-12 animate-float-5",
  },
  {
    name: "LinkedIn",
    src: "/assets/social/linkedin.png",
    className: "top-1/2 -translate-y-1/2 right-3 sm:right-8 lg:right-14 w-9 h-9 sm:w-12 sm:h-12 animate-float-6",
  },
];

export default function FloatingSocialIcons({ variant = "landing" }: FloatingSocialIconsProps) {
  const icons = variant === "auth" ? ICONS_AUTH : ICONS_LANDING;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-5 overflow-hidden select-none"
    >
      {icons.map((icon) => (
        <div
          key={icon.name}
          className={`absolute transition-transform duration-300 ${icon.className}`}
        >
          <div className="relative h-full w-full opacity-70 drop-shadow-[0_8px_16px_rgba(0,0,0,0.12)] transition-opacity duration-300 hover:opacity-100 dark:opacity-50 dark:drop-shadow-[0_8px_20px_rgba(0,0,0,0.45)]">
            <Image
              src={icon.src}
              alt={icon.name}
              fill
              sizes="(max-width: 768px) 48px, 64px"
              className="object-contain"
              priority={false}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
