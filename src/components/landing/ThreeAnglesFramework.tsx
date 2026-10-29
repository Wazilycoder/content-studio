"use client";

import { useState } from "react";
import { Check, X, ArrowRight, Sparkles } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

interface AngleData {
  id: string;
  num: string;
  tag: string;
  title: string;
  badgeBg: string;
  tagColor: string;
  formula: string;
  bestFor: string;
  aiSlopExample: string;
  studioExampleHook: string;
  studioExampleBody: string;
  keyBenefit: string;
}

const ANGLES_DATA: AngleData[] = [
  {
    id: "pas",
    num: "01",
    tag: "PAS",
    title: "Vấn đề & Giải pháp (Problem - Agitate - Solve)",
    badgeBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    tagColor: "text-blue-500",
    formula: "Xoáy trúng nỗi đau thực tế → Chỉ ra hậu quả nếu lờ đi → Đưa sản phẩm vào như lối thoát duy nhất",
    bestFor: "Sản phẩm giải quyết nỗi đau trực tiếp, đồ gia dụng, chăm sóc sức khỏe, hoặc shop mới cần phá vỡ rào cản hoài nghi.",
    aiSlopExample:
      "Bạn đang tìm kiếm một sản phẩm tiện lợi và chất lượng cao? Đừng bỏ lỡ siêu phẩm này! Hãy mua ngay hôm nay để nhận vô vàn ưu đãi hấp dẫn từ shop chúng tôi nhé! Inbox ngay để được tư vấn nhiệt tình...",
    studioExampleHook:
      "Cứ mỗi chiều tan làm, lưng lại ê ẩm, cổ vai gáy cứng đờ vì ngồi sai tư thế suốt 8 tiếng? Đừng đợi đến khi thoái hóa đốt sống mới chịu đổi ghế.",
    studioExampleBody:
      "Đệm công thái học Gel mát nâng đỡ trọn vẹn cột sống thắt lưng, phân tán 78% áp lực và giữ lưng thẳng tự nhiên. Ngồi êm suốt cả ngày dài mà không mỏi vai gáy. Trải nghiệm thử ngay hôm nay để yêu chiều sức khỏe chính mình.",
    keyBenefit: "Phá vỡ sự phòng thủ của khách hàng bằng sự đồng cảm sâu sắc, biến nhu cầu mơ hồ thành hành động chốt đơn tức thì.",
  },
  {
    id: "lifestyle",
    num: "02",
    tag: "AIDA",
    title: "Cảm xúc & Phong cách sống (Dream & Identity)",
    badgeBg: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
    tagColor: "text-pink-500",
    formula: "Kích hoạt khát khao bản ngã → Vẽ ra viễn cảnh hạnh phúc/tự tin → Biến sản phẩm thành biểu tượng sống",
    bestFor: "Thời trang, mỹ phẩm, trang sức, đồ trang trí nội thất, quán cafe, các thương hiệu xây dựng tệp khách trung thành.",
    aiSlopExample:
      "Chiếc váy này sẽ giúp bạn trở nên xinh đẹp hơn bao giờ hết! Hãy tự tin tỏa sáng với phong cách riêng của bạn. Chất vải cực xịn mịn, giá siêu hạt dẻ. Đặt hàng ngay kẻo hết size các nàng ơi...",
    studioExampleHook:
      "Có những buổi sáng bạn chỉ cần khoác lên mình một chiếc sơ mi lụa là đủ thấy tự tin bước vào phòng họp. Khí chất không đến từ sự phô trương...",
    studioExampleBody:
      "...mà đến từ cảm giác tự tin tuyệt đối vào chính mình. Từng thớ lụa Bảo Lộc mềm mát chạm vào da như lời nhắc nhở: bạn xứng đáng được trân trọng từ những điều tinh tế nhất. Một diện mạo chỉn chu cho một ngày bứt phá thành công.",
    keyBenefit: "Không bán tính năng cơ học — bán hình ảnh phiên bản tốt đẹp, sang trọng và hạnh phúc hơn của chính người mua.",
  },
  {
    id: "fab",
    num: "03",
    tag: "FAB",
    title: "Trực diện Tính năng & Giá trị (Feature - Advantage - Benefit)",
    badgeBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    tagColor: "text-emerald-500",
    formula: "Thông số vật liệu thật → Ưu thế vượt trội so với thị trường → Giá trị thực tế khách nhận được trên từng đồng bỏ ra",
    bestFor: "Đồ công nghệ, đồ thủ công làng nghề, thực phẩm sạch có chứng nhận, các sản phẩm cạnh tranh sòng phẳng bằng chất lượng.",
    aiSlopExample:
      "Sản phẩm được làm từ chất liệu cao cấp đạt tiêu chuẩn quốc tế. Thiết kế hiện đại sang trọng phù hợp với mọi gia đình. Giá cả vô cùng cạnh tranh. Đảm bảo uy tín 100% đổi trả nếu không ưng ý...",
    studioExampleHook:
      "100% tơ tằm dệt tay Bảo Lộc, mỗi mét vải mất 3 ngày hoàn thiện. Đường may 2 kim tỉ mỉ, phom suông thanh lịch, giặt trên 50 lần không xơ sợi.",
    studioExampleBody:
      "Trọng lượng chỉ 180g nhẹ như không khí, thấm hút mồ hôi gấp 3 lần cotton thông thường. Một chiếc áo mặc bền bỉ qua nhiều mùa mà vẫn giữ nguyên độ óng ả nguyên bản. Đầu tư thông minh cho tủ đồ trường tồn cùng thời gian.",
    keyBenefit: "Thuyết phục khách hàng khó tính bằng sự minh bạch và con số cụ thể, chứng minh sản phẩm xứng đáng từng đồng chi phí.",
  },
];

export default function ThreeAnglesFramework() {
  const [selectedAngleId, setSelectedAngleId] = useState<string>("pas");

  const currentAngle = ANGLES_DATA.find((a) => a.id === selectedAngleId) ?? ANGLES_DATA[0]!;

  return (
    <section id="framework" className="scroll-mt-20 bg-[var(--canvas)] py-16 sm:py-24 border-t border-[var(--border-subtle)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" duration={600}>
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center rounded-full border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-3.5 py-1 text-xs font-semibold text-[var(--ink-secondary)] shadow-xs">
              CHIẾN LƯỢC NỘI DUNG ĐA CHIỀU
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[var(--ink-primary)] sm:text-4xl">
              Tại sao lại là 3 góc tiếp cận?
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[var(--ink-secondary)] sm:text-base">
              Khách hàng không bao giờ mua hàng chỉ vì một lý do duy nhất. Content Studio tự động phân hóa sản phẩm thành 3 góc nhìn tâm lý bổ trợ nhau — đánh trúng 100% nhóm khách hàng và xóa sổ triệt để hiện tượng chai lì quảng cáo (Ad Fatigue).
            </p>
          </div>
        </ScrollReveal>

        {/* ================= INTERACTIVE ANATOMY STAGE ================= */}
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          {/* Left Column: The Dynamic Comparison Anatomy (7 cols) */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-6 sm:p-8 shadow-sm">
              {/* Header with Active Angle Badge & Formula */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
                <div className="flex items-center gap-2.5">
                  <span className={`text-base font-black tracking-wider ${currentAngle.tagColor}`}>
                    {currentAngle.num}
                  </span>
                  <span className={`rounded-full border px-3 py-0.5 text-xs font-bold uppercase tracking-wider ${currentAngle.badgeBg}`}>
                    {currentAngle.tag}
                  </span>
                </div>
                <span className="text-xs font-medium text-[var(--ink-tertiary)]">
                  Phân tích tâm lý chuyển đổi
                </span>
              </div>

              <div className="mt-4">
                <h3 className="text-xl font-bold text-[var(--ink-primary)]">
                  {currentAngle.title}
                </h3>
                <div className="mt-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-4 py-2.5 text-xs text-[var(--ink-secondary)] leading-relaxed">
                  <span className="font-semibold text-[var(--ink-primary)]">Cấu trúc công thức: </span>
                  {currentAngle.formula}
                </div>
              </div>

              {/* Side-by-side: Before (AI Slop) vs After (Content Studio) */}
              <div className="mt-6 space-y-4">
                {/* ❌ Generic AI Slop */}
                <div className="rounded-2xl border border-rose-500/20 bg-rose-500/[0.03] p-4 text-xs dark:bg-rose-950/10">
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-semibold mb-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500/10 text-[10px]">
                      <X className="h-3 w-3" />
                    </span>
                    <span>Văn mẫu AI sáo rỗng (Trùng lặp &amp; Vô cảm)</span>
                  </div>
                  <p className="line-through text-[var(--ink-tertiary)] italic leading-relaxed">
                    &quot;{currentAngle.aiSlopExample}&quot;
                  </p>
                </div>

                {/* ✅ Content Studio Custom Craft */}
                <div className="relative rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.04] p-5 text-[13px] dark:bg-emerald-950/15 shadow-xs">
                  <div className="flex items-center justify-between gap-2 text-emerald-600 dark:text-emerald-400 font-bold mb-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-[10px]">
                        <Check className="h-3 w-3" />
                      </span>
                      <span>Content Studio — Chuẩn 125 ký tự Hook</span>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                      CTR +42%
                    </span>
                  </div>
                  <p className="font-bold text-[var(--ink-primary)] leading-snug">
                    {currentAngle.studioExampleHook}
                  </p>
                  <p className="mt-2 text-[var(--ink-secondary)] leading-relaxed">
                    {currentAngle.studioExampleBody}
                  </p>
                </div>
              </div>

              {/* Audience Fit & Key Benefit */}
              <div className="mt-6 border-t border-[var(--border-subtle)] pt-4 text-xs text-[var(--ink-secondary)] flex flex-col gap-2">
                <div>
                  <strong className="text-[var(--ink-primary)]">🎯 Phù hợp nhất cho: </strong>
                  {currentAngle.bestFor}
                </div>
                <div>
                  <strong className="text-[var(--ink-primary)]">⚡ Hiệu quả chuyển đổi: </strong>
                  {currentAngle.keyBenefit}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 3 Interactive Angle Selector Cards (5 cols) */}
          <div className="flex flex-col gap-3.5 lg:col-span-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-tertiary)] px-1">
              Bấm để xem phân tích từng góc bài:
            </span>

            {ANGLES_DATA.map((angle) => {
              const isSelected = angle.id === selectedAngleId;
              return (
                <button
                  key={angle.id}
                  type="button"
                  onClick={() => setSelectedAngleId(angle.id)}
                  className={`group relative flex flex-col text-left rounded-2xl border p-5 transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "border-indigo-500/50 bg-[var(--surface)] shadow-[0_10px_30px_-10px_rgba(99,102,241,0.2)] ring-1 ring-indigo-500/30"
                      : "border-[var(--border-subtle)] bg-[var(--surface-raised)]/70 hover:border-[var(--border-strong)] hover:bg-[var(--surface)]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-black ${angle.tagColor}`}>
                        {angle.num}
                      </span>
                      <span className="font-bold text-sm text-[var(--ink-primary)]">
                        {angle.title.split("(")[0]}
                      </span>
                    </div>
                    <span className={`rounded-full border px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wider ${angle.badgeBg}`}>
                      {angle.tag}
                    </span>
                  </div>

                  <p className="mt-2.5 text-xs text-[var(--ink-secondary)] leading-relaxed">
                    {angle.formula}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-[11px] font-semibold">
                    <span className={isSelected ? "text-indigo-600 dark:text-indigo-400" : "text-[var(--ink-tertiary)]"}>
                      {isSelected ? "Đang chọn hiển thị" : "Bấm để xem mẫu bài"}
                    </span>
                    <ArrowRight className={`h-3.5 w-3.5 transition-transform ${isSelected ? "translate-x-1 text-indigo-500" : "text-[var(--ink-tertiary)] group-hover:translate-x-0.5"}`} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
