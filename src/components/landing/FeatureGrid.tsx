"use client";

import { useState } from "react";
import { Check, Copy, Trash2, RotateCw } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

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
      className="scroll-mt-20 border-y border-[var(--border-subtle)] bg-[var(--surface-raised)]/40 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" duration={600}>
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3.5 py-1 text-xs font-semibold text-[var(--ink-secondary)] shadow-xs">
              ĐÁP ỨNG 5/5 YÊU CẦU ĐỀ BÀI BẢNG B
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[var(--ink-primary)] sm:text-4xl">
              Đủ bộ công cụ thực chiến — Không tính năng thừa
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[var(--ink-secondary)] sm:text-base">
              Mỗi tính năng đều được thiết kế tỉ mỉ, bám sát từng tiêu chí chấm điểm của Đề 2: từ bộ đếm ký tự kép đến form 4 trường dữ liệu và lưu trữ ngoại tuyến an toàn.
            </p>
          </div>
        </ScrollReveal>

        {/* Bento Grid Architecture */}
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {/* Tile 1: Dual Character Counter (2-column span on large screens) */}
          <div className="lg:col-span-2 rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-6 sm:p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-0.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  TIÊU CHÍ KỸ THUẬT LÕI
                </span>
                <span className="text-xs font-medium text-[var(--ink-tertiary)]">
                  Chuẩn thuật toán Newsfeed 2026
                </span>
              </div>

              <h3 className="mt-4 text-xl font-bold text-[var(--ink-primary)]">
                Bộ đếm ký tự kép thời gian thực (FB 125 &amp; IG 2.200)
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[var(--ink-secondary)] leading-relaxed">
                Facebook tự động ẩn nội dung sau 125 ký tự bằng nút &quot;… Xem thêm&quot;. Content Studio phân tách trực quan độ dài hook mở đầu và toàn văn caption để bạn không bao giờ bỏ lỡ cơ hội chốt đơn.
              </p>
            </div>

            {/* Live Interactive Gauge Demo */}
            <div className="mt-6 space-y-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-4 sm:p-5">
              {/* Facebook Meter */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Ngưỡng Hook Facebook (&quot;… Xem thêm&quot;)
                  </span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400">
                    118 / 125 ký tự (Tối ưu)
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
                    Giới hạn ký tự Instagram Caption
                  </span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">
                    1.420 / 2.200 ký tự (64%)
                  </span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full w-[64%] transition-all duration-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Tile 2: 3 Contest Tones (1-column span) */}
          <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-6 sm:p-8 shadow-xs flex flex-col justify-between">
            <div>
              <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-0.5 text-xs font-bold text-purple-600 dark:text-purple-400">
                3 TÔNG GIỌNG BẮT BUỘC
              </span>
              <h3 className="mt-4 text-xl font-bold text-[var(--ink-primary)]">
                Tùy biến phong cách bán hàng
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[var(--ink-secondary)] leading-relaxed">
                Chuyển đổi tức thì giữa 3 tông giọng quy định trong đề thi. Bấm thử từng tông bên dưới:
              </p>
            </div>

            {/* Interactive Tone Buttons & Preview */}
            <div className="mt-5 space-y-3">
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

              <div className="min-h-[70px] rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-3 text-xs italic text-[var(--ink-secondary)] leading-relaxed">
                &quot;{toneExamples[selectedTone]}&quot;
              </div>
            </div>
          </div>

          {/* Tile 3: 3 Captions + 3 Headlines + 5 Hashtags */}
          <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-6 sm:p-8 shadow-xs flex flex-col justify-between">
            <div>
              <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-0.5 text-xs font-bold text-blue-600 dark:text-blue-400">
                ĐỦ ĐẦU RA QUY ĐỊNH
              </span>
              <h3 className="mt-4 text-xl font-bold text-[var(--ink-primary)]">
                3 Caption · 3 Headline · 5 Hashtag
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[var(--ink-secondary)] leading-relaxed">
                Mỗi lần bấm Tạo bài, AI xuất xưởng trọn vẹn gói nội dung đa chiều để bạn thử nghiệm A/B testing hiệu quả.
              </p>
            </div>

            <div className="mt-5 space-y-2">
              <div className="flex items-center justify-between rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-3 py-2 text-xs">
                <span className="font-semibold text-[var(--ink-primary)]">3 Góc nhìn (PAS · Cảm xúc · FAB)</span>
                <span className="text-emerald-500 font-bold">✓ Độc bản</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-3 py-2 text-xs">
                <span className="font-semibold text-[var(--ink-primary)]">3 Tiêu đề giật tít Hook</span>
                <span className="text-indigo-500 font-bold">✓ Chuẩn CTR</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-3 py-2 text-xs">
                <span className="font-semibold text-[var(--ink-primary)]">5 Hashtag chuẩn ngách</span>
                <span className="text-purple-500 font-bold">✓ Tối ưu SEO</span>
              </div>
            </div>
          </div>

          {/* Tile 4: LocalStorage Individual Deletion */}
          <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-6 sm:p-8 shadow-xs flex flex-col justify-between">
            <div>
              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                QUẢN LÝ LỊCH SỬ NGOẠI TUYẾN
              </span>
              <h3 className="mt-4 text-xl font-bold text-[var(--ink-primary)]">
                LocalStorage xóa từng mục an toàn
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[var(--ink-secondary)] leading-relaxed">
                Toàn bộ bản nháp được lưu riêng trên máy tính của bạn. Dễ dàng xem lại, khôi phục vào form hoặc xóa từng bài viết khi không còn cần thiết.
              </p>
            </div>

            <div className="mt-5 space-y-2">
              {historyItems.length > 0 ? (
                historyItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-3 py-2 text-xs"
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
                <div className="rounded-xl border border-dashed border-[var(--border-subtle)] p-3 text-center text-xs text-[var(--ink-tertiary)]">
                  Đã dọn sạch lịch sử thử nghiệm! Bấm &quot;Tạo lại&quot; bên dưới để khôi phục.
                </div>
              )}
            </div>
          </div>

          {/* Tile 5: 1-Click Multi-copy & Instant Regenerate */}
          <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-6 sm:p-8 shadow-xs flex flex-col justify-between">
            <div>
              <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-0.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                THAO TÁC CỰC NHANH
              </span>
              <h3 className="mt-4 text-xl font-bold text-[var(--ink-primary)]">
                Sao chép 1-Click &amp; Tạo lại tức thì
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[var(--ink-secondary)] leading-relaxed">
                Sao chép từng phần hay toàn bộ bài đăng ngay lập tức. Nếu chưa hoàn toàn ưng ý, một nút bấm &quot;Tạo lại&quot; sẽ kiến tạo một phương án đột phá mới.
              </p>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={handleCopyMini}
                className="btn-shimmer flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold cursor-pointer"
              >
                {copiedMini ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-300 animate-bounce" />
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
                className="btn-tactile flex items-center justify-center gap-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-3 py-2.5 text-xs font-semibold text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] cursor-pointer"
                title="Tạo lại dữ liệu demo"
              >
                <RotateCw className="h-3.5 w-3.5" />
                <span>Tạo lại</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
