"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Copy, Hash, Layers3 } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

interface AngleCaption {
  angle: string;
  text: string;
}

interface DemoProduct {
  id: string;
  tab: string;
  name: string;
  description: string;
  audience: string;
  toneLabel: string;
  captions: [AngleCaption, AngleCaption, AngleCaption];
  headlines: [string, string, string];
  hashtags: [string, string, string, string, string];
}

const PRODUCTS: DemoProduct[] = [
  {
    id: "ao-lua-bao-loc",
    tab: "Áo lụa Bảo Lộc",
    name: "Áo sơ mi lụa tơ tằm dệt tay Bảo Lộc",
    description:
      "Sơ mi nữ chất liệu 100% tơ tằm tự nhiên dệt tay tại làng nghề Bảo Lộc, form suông thanh lịch, phù hợp môi trường công sở cao cấp.",
    audience:
      "Phụ nữ công sở 28–45 tuổi, thu nhập khá, ưu tiên chất liệu tự nhiên và phong cách tinh tế.",
    toneLabel: "Trang trọng",
    captions: [
      {
        angle: "Góc 1: Vấn đề & Giải pháp",
        text: "Mặc áo công sở cả ngày khiến bạn bứt rứt, vai mỏi vì chất liệu polyester bí hơi? Sơ mi lụa tơ tằm dệt tay Bảo Lộc với sợi tơ tự nhiên mềm mại cho cảm giác như làn da thứ hai — thoáng khí, thấm hút mồ hôi và giữ phom thanh lịch suốt 12 tiếng. Đã đến lúc bạn ngừng chịu đựng chiếc áo chỉ để 'cho có'.",
      },
      {
        angle: "Góc 2: Cảm xúc & Phong cách sống",
        text: "Có những buổi sáng bạn chỉ cần khoác lên mình một chiếc sơ mi lụa là đủ thấy tự tin bước vào phòng họp. Sắc lụa Bảo Lộc không phô trương nhưng khiến người đối diện phải nhìn lại lần thứ hai — đó là sự sang trọng đến từ chất liệu thật, dành cho người phụ nữ biết mình xứng đáng với điều tử tế.",
      },
      {
        angle: "Góc 3: Trực diện tính năng & Giá trị",
        text: "100% tơ tằm tự nhiên dệt tay tại làng nghề Bảo Lộc, mỗi mét vải mất 3 ngày hoàn thiện. Đường may 2 kim tỉ mỉ, khuy đá ép thủ công, form suông chuẩn phom cho người Việt. Trọng lượng nhẹ chỉ 180g, độ bền màu trên 50 lần giặt. Một chiếc áo — dùng được nhiều mùa.",
      },
    ],
    headlines: [
      "Chiếc sơ mi lụa khiến cả phòng họp phải nhìn lại",
      "Bí quyết mặc đẹp 12 tiếng không bứt rứt của phụ nữ công sở",
      "Lụa tơ tằm Bảo Lộc — sang trọng từ sợi chỉ đầu tiên",
    ],
    hashtags: [
      "#sominu",
      "#luatotam",
      "#baoloc",
      "#thoitrangcaocap",
      "#sominuluato",
    ],
  },
  {
    id: "ca-phe-cau-dat",
    tab: "Cà phê Cầu Đất",
    name: "Cà phê Robusta mộc Cầu Đất nguyên chất",
    description:
      "Cà phê Robusta hạt trồng tại Cầu Đất (Đà Lạt), rang mộc 100%, không hương liệu, vị đậm đà đặc trưng.",
    audience:
      "Gen Z và dân văn phòng 20–35 tuổi, thích cà phê nguyên chất, sống nhanh nhưng chất.",
    toneLabel: "Trẻ trung",
    captions: [
      {
        angle: "Góc 1: Vấn đề & Giải pháp",
        text: "Sáng nào cũng uống cà phê hòa tan mà vị nhạt như nước lã, tỉnh dậy chẳng thấy sảng khoái gì? Robusta mộc Cầu Đất rang mộc nguyên chất đánh thức vị giác bằng hương đắng đậm đà đặc trưng — một ngụm là tỉnh cả người, không đường không sữa vẫn phê.",
      },
      {
        angle: "Góc 2: Cảm xúc & Phong cách sống",
        text: "Có một ly cà phê mộc trên bàn làm việc, deadline ập tới cũng thấy chill hơn hẳn. Robusta Cầu Đất không chỉ là cà phê, đó là 'nghi thức' bắt đầu ngày mới của một thế hệ trẻ sống chậm mà vẫn chất — uống là thấy mình ngầu hơn một chút.",
      },
      {
        angle: "Góc 3: Trực diện tính năng & Giá trị",
        text: "100% Robusta hạt Cầu Đất trồng ở độ cao 1.500m, hái chín 100%, rang mộc trong 15 phút để giữ trọn hương. Hàm lượng caffeine tự nhiên 2.2%, không hương liệu, không chất bảo quản. Gói 500g pha được 40 ly — tính ra chưa tới 3.000đ/ly đậm đặc.",
      },
    ],
    headlines: [
      "Robusta mộc Cầu Đất — tỉnh thức không cần đường",
      "Deadline chất cao cũng chill với ly cà phê này",
      "Một gói pha 40 ly — đậm đặc chuẩn vị",
    ],
    hashtags: [
      "#caphemoc",
      "#caudat",
      "#robusta",
      "#caphesach",
      "#caphemoingay",
    ],
  },
  {
    id: "dau-goi-buoi-boket",
    tab: "Dầu gội bồ kết",
    name: "Dầu gội bưởi bồ kết cô đặc thảo mộc",
    description:
      "Dầu gội nấu thủ công từ bồ kết, vỏ bưởi, sả chanh và cỏ mần trầu, cô đặc gấp 3 lần, không sulfate.",
    audience:
      "Phụ nữ 25–45 tuổi quan tâm chăm sóc tóc tự nhiên, ngại hóa chất, thích sản phẩm nội địa.",
    toneLabel: "Hài hước",
    captions: [
      {
        angle: "Góc 1: Vấn đề & Giải pháp",
        text: "Tóc bết dầu sau 1 ngày, gãy rụng lả tả mỗi lần gội — mà bạn vẫn đang dùng chai dầu gội 'công nghiệp' đầy silicone? Dầu gội bưởi bồ kết cô đặc thảo mộc nấu từ bồ kết, vỏ bưởi và sả chanh, gội là thấy da đầu sạch thoáng, tóc mọc lên như mạ non sau mưa.",
      },
      {
        angle: "Góc 2: Cảm xúc & Phong cách sống",
        text: "Gội đầu cũng là khoảnh khắc thư giãn tự thưởng. Mùi bồ kết nướng, vỏ bưởi sấy và sả chanh lan tỏa cả phòng tắm — combo 'spa tại gia' giá hạt dẻ. Ai bảo chăm sóc tóc phải tốn kém? Bạn xứng đáng được nuông chiều mỗi ngày.",
      },
      {
        angle: "Góc 3: Trực diện tính năng & Giá trị",
        text: "Cô đặc từ bồ kết, vỏ bưởi, sả chanh và cỏ mần trầu nấu thủ công 8 tiếng, không sulfate, không paraben. Nồng độ tinh chất gấp 3 lần dầu gội thông thường, mỗi lần chỉ cần 1 nắp. Chai 500ml dùng được 2-3 tháng cho cả gia đình.",
      },
    ],
    headlines: [
      "Gội xong tóc mọc như mạ non sau mưa",
      "Dầu gội bồ kết nấu tay — sạch tóc, thơm cả phòng",
      "Bỏ silicone, da đầu sạch thoáng chỉ sau 1 lần gội",
    ],
    hashtags: [
      "#daugoibuoi",
      "#boket",
      "#tocbongdep",
      "#thaomoc",
      "#chamsocktoc",
    ],
  },
];

function countChars(text: string): number {
  return Array.from(text).length;
}

export default function InteractivePlayground() {
  const [activeId, setActiveId] = useState<string>(PRODUCTS[0]!.id);
  const [copied, setCopied] = useState<string | null>(null);

  const active = PRODUCTS.find((p) => p.id === activeId) ?? PRODUCTS[0]!;

  async function handleCopy(key: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      setCopied(null);
    }
  }

  return (
    <section
      id="demo"
      className="scroll-mt-20 border-y border-[var(--border-subtle)] bg-[var(--surface)] py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal direction="up" duration={600}>
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-3 py-1 text-[11px] font-medium text-[var(--ink-secondary)]">
              Trải nghiệm thử
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--ink-primary)] sm:text-4xl">
              Xem AI viết thế nào — ngay trên trang này
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--ink-secondary)] sm:text-base">
              Chọn một sản phẩm mẫu để xem trọn bộ 3 caption đa góc nhìn, 3 headline
              và 5 hashtag được sinh ra chỉ trong vài giây. Không cần đăng nhập.
            </p>
          </div>
        </ScrollReveal>

        {/* Tabs */}
        <ScrollReveal direction="up" delay={120} duration={600}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {PRODUCTS.map((p) => {
              const isActive = p.id === activeId;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActiveId(p.id)}
                  className={`btn-tactile rounded-lg border px-4 py-2 text-xs font-bold transition-all duration-150 ${
                    isActive
                      ? "border-teal-400 bg-[#00D492] text-black shadow-[0_0_15px_rgba(0,212,146,0.25)]"
                      : "border-[var(--border-subtle)] bg-[var(--surface)] text-[var(--ink-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--ink-primary)]"
                  }`}
                >
                  {p.tab}
                </button>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Two column result */}
        <div
          key={active.id}
          className="animate-fade-in mt-8 grid gap-6 lg:grid-cols-[minmax(0,340px)_1fr]"
        >
          {/* Left: input summary */}
          <aside className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-tertiary)]">
                Thông tin đầu vào
              </span>
              <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--accent-navy)]">
                {active.toneLabel}
              </span>
            </div>
            <dl className="mt-4 space-y-3.5">
              <div>
                <dt className="text-[11px] font-medium text-[var(--ink-tertiary)]">
                  Tên sản phẩm
                </dt>
                <dd className="mt-0.5 text-sm font-semibold text-[var(--ink-primary)]">
                  {active.name}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-medium text-[var(--ink-tertiary)]">Mô tả</dt>
                <dd className="mt-0.5 text-[13px] leading-relaxed text-[var(--ink-secondary)]">
                  {active.description}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-medium text-[var(--ink-tertiary)]">
                  Khách hàng mục tiêu
                </dt>
                <dd className="mt-0.5 text-[13px] leading-relaxed text-[var(--ink-secondary)]">
                  {active.audience}
                </dd>
              </div>
            </dl>
          </aside>

          {/* Right: output */}
          <div className="space-y-4">
            {active.captions.map((caption, index) => {
              const copyKey = `cap-${index}`;
              const total = countChars(caption.text);
              const hook = Math.min(total, 125);
              return (
                <div
                  key={caption.angle}
                  className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center rounded-md bg-[var(--surface-raised)] px-2 py-0.5 text-[11px] font-semibold text-[var(--accent-navy)]">
                      {caption.angle}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(copyKey, caption.text)}
                      aria-label="Sao chép caption"
                      className="btn-tactile text-[var(--ink-tertiary)] transition-colors hover:text-[var(--accent-navy)]"
                    >
                      {copied === copyKey ? (
                        <Check className="check-pop h-3.5 w-3.5 text-[var(--accent-emerald)]" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                  <p className="mt-3 whitespace-pre-line text-[13px] leading-relaxed text-[var(--ink-primary)]">
                    {caption.text}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[var(--border-subtle)] pt-2.5">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--ink-secondary)]">
                      <span className="font-semibold text-[var(--ink-primary)]">Facebook Hook</span>
                      <span className="text-[var(--accent-emerald)]">{hook}/125</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--ink-secondary)]">
                      <span className="font-semibold text-[var(--ink-primary)]">Instagram</span>
                      <span
                        className={
                          total > 2200
                            ? "text-rose-600 dark:text-rose-400"
                            : "text-[var(--accent-emerald)]"
                        }
                      >
                        {total.toLocaleString("vi-VN")}/2.200
                      </span>
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Headlines */}
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-2">
                <Layers3 className="h-4 w-4 text-[var(--accent-navy)]" />
                <span className="text-xs font-semibold text-[var(--ink-primary)]">
                  3 Headlines giật tít
                </span>
              </div>
              <ul className="mt-3 space-y-2">
                {active.headlines.map((headline, index) => {
                  const copyKey = `head-${index}`;
                  return (
                    <li
                      key={headline}
                      className="flex items-start justify-between gap-3 rounded-lg bg-[var(--surface-raised)] px-3 py-2"
                    >
                      <span className="text-[13px] font-medium text-[var(--ink-primary)]">
                        {headline}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(copyKey, headline)}
                        aria-label="Sao chép headline"
                        className="btn-tactile shrink-0 text-[var(--ink-tertiary)] transition-colors hover:text-[var(--accent-navy)]"
                      >
                        {copied === copyKey ? (
                          <Check className="check-pop h-3.5 w-3.5 text-[var(--accent-emerald)]" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Hashtags */}
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-[var(--accent-navy)]" />
                  <span className="text-xs font-semibold text-[var(--ink-primary)]">
                    5 Hashtags chuẩn ngách
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy("hashtags", active.hashtags.join(" "))}
                  className="btn-tactile inline-flex items-center gap-1 text-[11px] font-medium text-[var(--ink-secondary)] transition-colors hover:text-[var(--accent-navy)]"
                >
                  {copied === "hashtags" ? (
                    <Check className="check-pop h-3.5 w-3.5 text-[var(--accent-emerald)]" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  Copy tất cả
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {active.hashtags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-[var(--surface-raised)] px-2.5 py-1 text-xs font-medium text-[var(--accent-navy)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <Link
              href="/workspace"
              className="btn-tactile inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent-navy)] px-5 py-3 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-[var(--accent-navy-hover)]"
            >
              Mở trong Workspace để tạo bài cho sản phẩm của bạn
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}