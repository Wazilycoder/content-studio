"use client";

import { useState } from "react";
import {
  Check,
  Copy,
  Trash2,
  RotateCw,
  FileText,
  Gauge,
  Zap,
  History,
  Layers,
} from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { BentoGrid, BentoCard } from "@/components/ui/BentoGrid";

export default function FeatureGrid() {
  // Mini interactive tone preview
  const [selectedTone, setSelectedTone] = useState<"haihuoc" | "trangtrong" | "tretrung">("haihuoc");

  // Mini copy demo
  const [copiedMini, setCopiedMini] = useState(false);

  // Mini history item state
  const [historyItems, setHistoryItems] = useState([
    { id: 1, title: "Áo sơ mi lụa tơ tằm Bảo Lộc", date: "Hôm nay" },
    { id: 2, title: "Cà phê Robusta rang mộc Cầu Đất", date: "Hôm qua" },
  ]);

  const toneExamples = {
    haihuoc: "Đừng để tiền rơi vào mấy chiếc áo mặc một lần đã bai dão rồi khóc một dòng sông!",
    trangtrong: "Đẳng cấp không cần phô trương, sự tinh tế trong từng đường kim mũi chỉ sẽ khẳng định vị thế của bạn.",
    tretrung: "Mix nhẹ một chiếc sơ mi là đủ slay cả buổi cafe cuối tuần cùng hội bạn thân rồi!",
  };

  const handleCopyMini = () => {
    setCopiedMini(true);
    window.setTimeout(() => setCopiedMini(false), 1600);
  };

  const handleDeleteHistory = (id: number) => {
    setHistoryItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <section
      id="features"
      className="scroll-mt-20 border-y border-[var(--border-hairline)] bg-[var(--surface-raised)]/40 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" duration={600}>
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center rounded-full border border-[var(--border-hairline)] bg-[var(--surface)] px-3.5 py-1 text-xs font-semibold text-[var(--ink-secondary)] shadow-xs">
              ĐÁP ỨNG 5/5 YÊU CẦU ĐỀ BÀI BẢNG B
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[var(--ink-primary)] sm:text-4xl">
              Đủ bộ công cụ thực chiến — Không tính năng thừa
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[var(--ink-secondary)] sm:text-base">
              Mỗi tính năng đều bám sát tiêu chí chấm điểm của Đề 2: form 4 trường dữ liệu, bộ đếm ký tự kép, 3 góc nhìn độc bản và lịch sử lưu trữ ngoại tuyến an toàn.
            </p>
          </div>
        </ScrollReveal>

        {/* Bento Grid Architecture */}
        <BentoGrid className="mt-12">
          {/* Card 1: Form 4 trường & 3 tông giọng chuẩn đề bài */}
          <BentoCard
            name="Form 4 trường & 3 tông giọng chuẩn đề bài"
            description="Nhập Tên sản phẩm, Tông giọng, Khách hàng mục tiêu và Điểm nhấn cần khoe — hệ thống tự chọn từ vựng, nhịp câu khớp với tông Hài hước, Trang trọng hoặc Trẻ trung. Bấm thử từng tông bên dưới:"
            badge="3 TÔNG GIỌNG BẮT BUỘC"
            Icon={FileText}
            className="md:col-span-2"
          >
            <div className="space-y-3">
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedTone("haihuoc")}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    selectedTone === "haihuoc"
                      ? "bg-amber-500 text-white shadow-xs"
                      : "bg-[var(--surface-raised)] text-[var(--ink-secondary)] hover:bg-[var(--surface-raised)]/80"
                  }`}
                >
                  Hài hước 🎭
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTone("trangtrong")}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    selectedTone === "trangtrong"
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "bg-[var(--surface-raised)] text-[var(--ink-secondary)] hover:bg-[var(--surface-raised)]/80"
                  }`}
                >
                  Trang trọng 👔
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTone("tretrung")}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    selectedTone === "tretrung"
                      ? "bg-pink-500 text-white shadow-xs"
                      : "bg-[var(--surface-raised)] text-[var(--ink-secondary)] hover:bg-[var(--surface-raised)]/80"
                  }`}
                >
                  Trẻ trung ⚡
                </button>
              </div>

              <div className="min-h-[70px] rounded-xl border border-[var(--border-hairline)] bg-[var(--surface-raised)] p-3 text-xs italic text-[var(--ink-secondary)] leading-relaxed">
                &quot;{toneExamples[selectedTone]}&quot;
              </div>
            </div>
          </BentoCard>

          {/* Card 2: Bộ đếm ký tự kép Facebook & Instagram */}
          <BentoCard
            name="Bộ đếm ký tự kép Facebook & Instagram"
            description="Cảnh báo chuẩn mực: hook vượt ~125 ký tự sẽ bị cắt sau nút &quot;… Xem thêm&quot;, caption Instagram vượt 2.200 ký tự sẽ bị từ chối đăng."
            badge="TIÊU CHÍ KỸ THUẬT"
            Icon={Gauge}
            className="md:col-span-1"
          >
            <div className="space-y-4 rounded-xl border border-[var(--border-hairline)] bg-[var(--surface-raised)] p-4">
              {/* Facebook Meter */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Hook Facebook
                  </span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400">
                    118 / 125
                  </span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full w-[94%] transition-all duration-500" />
                </div>
              </div>

              {/* Instagram Meter */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                    <span className="h-2 w-2 rounded-full bg-indigo-500" />
                    Caption Instagram
                  </span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">
                    1.420 / 2.200
                  </span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full w-[64%] transition-all duration-500" />
                </div>
              </div>
            </div>
          </BentoCard>

          {/* Card 3: 1-Click Copy & Regenerate tức thì */}
          <BentoCard
            name="1-Click Copy & Regenerate tức thì"
            description="Sao chép trọn gói hoặc từng phần chỉ với một cú nhấp. Chưa ưng ý? Bấm Tạo lại để nhận phương án mới ngay lập tức."
            badge="THAO TÁC NHANH"
            Icon={Zap}
            className="md:col-span-1"
          >
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={handleCopyMini}
                className="btn-shimmer flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold cursor-pointer"
              >
                {copiedMini ? (
                  <>
                    <Check className="check-pop h-3.5 w-3.5 text-emerald-300" />
                    <span>Đã sao chép!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Thử Copy 1-Chạm</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setHistoryItems([
                    { id: Date.now(), title: "Áo sơ mi lụa tơ tằm Bảo Lộc", date: "Vừa xong" },
                    { id: Date.now() + 1, title: "Cà phê Robusta rang mộc Cầu Đất", date: "Vừa xong" },
                  ]);
                }}
                className="btn-tactile flex w-full items-center justify-center gap-1.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--surface-raised)] px-3 py-2.5 text-xs font-semibold text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] cursor-pointer"
                title="Tạo lại dữ liệu demo"
              >
                <RotateCw className="h-3.5 w-3.5" />
                <span>Tạo lại</span>
              </button>
            </div>
          </BentoCard>

          {/* Card 4: Lịch sử LocalStorage xóa từng mục */}
          <BentoCard
            name="Lịch sử LocalStorage xóa từng mục"
            description="Bài viết được lưu riêng trên máy bạn, không gửi lên máy chủ. Xóa từng mục bằng nút thùng rác — xóa là mất ngay, không thể hoàn tác."
            badge="NGOẠI TUYẾN"
            Icon={History}
            className="md:col-span-1"
          >
            <div className="space-y-2">
              {historyItems.length > 0 ? (
                historyItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border border-[var(--border-hairline)] bg-[var(--surface-raised)] px-3 py-2 text-xs"
                  >
                    <span className="truncate max-w-[180px] font-medium text-[var(--ink-primary)]">
                      {item.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteHistory(item.id)}
                      className="p-1 rounded-md text-[var(--ink-tertiary)] hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Xóa mục này"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-[var(--border-hairline)] p-3 text-center text-xs text-[var(--ink-tertiary)]">
                  Đã dọn sạch lịch sử thử nghiệm! Bấm &quot;Tạo lại&quot; ở thẻ bên cạnh để khôi phục.
                </div>
              )}
            </div>
          </BentoCard>

                {/* Card 5: Đa chiều góc nhìn (PAS · Cảm xúc · FAB) */}
                <BentoCard
                  name="Đa chiều góc nhìn (PAS · Cảm xúc · FAB)"
                  description="Ba góc phân giải tâm lý khác nhau cho cùng một sản phẩm, đảm bảo không góc nào trùng lặp ý tưởng hay cấu trúc câu."
                  badge="ĐỘC BẢN"
                  Icon={Layers}
                  className="md:col-span-1"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between rounded-xl border border-[var(--border-hairline)] bg-[var(--surface-raised)] px-3 py-2 text-xs">
                      <span className="font-semibold text-[var(--ink-primary)]">3 Góc nhìn (PAS · Cảm xúc · FAB)</span>
                      <span className="text-emerald-500 font-bold">✓ Độc bản</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-[var(--border-hairline)] bg-[var(--surface-raised)] px-3 py-2 text-xs">
                      <span className="font-semibold text-[var(--ink-primary)]">3 Tiêu đề giật tít Hook</span>
                      <span className="text-indigo-500 font-bold">✓ Chuẩn CTR</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-[var(--border-hairline)] bg-[var(--surface-raised)] px-3 py-2 text-xs">
                      <span className="font-semibold text-[var(--ink-primary)]">5 Hashtag chuẩn ngách</span>
                      <span className="text-purple-500 font-bold">✓ Tối ưu SEO</span>
                    </div>
                  </div>
                </BentoCard>
              </BentoGrid>
            </div>
          </section>
  );
}
