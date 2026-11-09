import Link from "next/link";
import type { ComponentType } from "react";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  CreditCard,
  Heart,
  Keyboard,
  Layers,
  Lightbulb,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import LandingFooter from "@/components/landing/LandingFooter";
import ThemeToggle from "@/components/theme/ThemeToggle";

interface IconProps {
  className?: string;
}

interface QuickstartStep {
  step: string;
  title: string;
  summary: string;
  bullets: string[];
  icon: ComponentType<IconProps>;
}

interface Angle {
  code: string;
  name: string;
  tagline: string;
  description: string;
  bullets: string[];
  icon: ComponentType<IconProps>;
}

interface HookTechnique {
  title: string;
  description: string;
  example: string;
}

const QUICKSTART: QuickstartStep[] = [
  {
    step: "01",
    title: "Nhập thông tin & Điểm khác biệt (USP) sản phẩm",
    summary:
      "Mô tả chất liệu, giá trị cốt lõi và giải pháp sản phẩm đem lại cho khách hàng. Dữ liệu đầu vào càng cụ thể, đầu ra càng sắc nét.",
    bullets: [
      "Tên sản phẩm, ngành hàng và khoảng giá bán thực tế",
      "Chất liệu, thông số kỹ thuật, xuất xứ, chứng nhận",
      "Nỗi đau lớn nhất mà khách hàng đang gặp phải",
    ],
    icon: Layers,
  },
  {
    step: "02",
    title: "Chọn Tone of Voice & Đối tượng mục tiêu",
    summary:
      "Tùy biến giọng văn (Chuyên gia, Thân mật, Hài hước, Sang trọng) và khai báo tệp khách hàng bạn muốn chinh phục.",
    bullets: [
      "Giọng văn phải khớp với nhân khẩu học của tệp khách",
      "Chọn độ tuổi, giới tính và khu vực sinh sống",
      "Khai báo mức thu nhập để AI chọn thông điệp phù hợp",
    ],
    icon: Target,
  },
  {
    step: "03",
    title: "Khởi tạo & Tinh chỉnh góc nhìn",
    summary:
      "Nhận ngay 3 góc bài viết (PAS, Cảm xúc, FAB) và tinh chỉnh trực tiếp trên bộ soạn thảo mà không cần rời trang.",
    bullets: [
      "Mỗi góc đã kèm giật tít và bộ hashtag gợi ý sẵn",
      "Chỉnh sửa tại chỗ, không cần copy sang công cụ khác",
      "Lưu vào Lịch sử để tái sử dụng cho chiến dịch sau",
    ],
    icon: Sparkles,
  },
];

const ANGLES: Angle[] = [
  {
    code: "GÓC 1",
    name: "PAS — Đào sâu nỗi đau, thức tỉnh nhu cầu",
    tagline: "Problem · Agitate · Solution",
    description:
      "Khơi gợi đúng vấn đề khách hàng đang gặp, khuếch đại hệ quả nếu tiếp tục trì hoãn, rồi mới đưa sản phẩm ra như lối thoát duy nhất.",
    bullets: [
      "Mở đầu bằng tình huống nhận diện được ngay",
      "Khuếch đại cảm giác mất mát, chi phí cơ hội",
      "Chốt bằng giải pháp cụ thể và lời hứa kết quả",
    ],
    icon: Zap,
  },
  {
    code: "GÓC 2",
    name: "Cảm xúc & Phong cách sống",
    tagline: "Lifestyle · Aspiration · Identity",
    description:
      "Bán trải nghiệm và hình mẫu khách hàng muốn hướng tới. Sản phẩm trở thành phương tiện để họ bước vào một phiên bản tốt hơn của chính mình.",
    bullets: [
      "Vẽ nên bối cảnh sử dụng giàu hình ảnh, chạm giác quan",
      "Định vị sản phẩm như biểu tượng của phong cách sống",
      "Tạo cảm giác thuộc về một cộng đồng, một tuyên ngôn",
    ],
    icon: Heart,
  },
  {
    code: "GÓC 3",
    name: "FAB — Phân tích trực diện tính năng",
    tagline: "Features · Advantages · Benefits",
    description:
      "Dành cho tệp khách lý trí: liệt kê thông số, độ bền, tính năng vượt trội và quy chiếu trực tiếp sang lợi ích mà người mua nhận được.",
    bullets: [
      "Nêu thông số kỹ thuật đã kiểm chứng, có con số",
      "So sánh ưu thế trực tiếp so với phương án thay thế",
      "Quy đổi từng tính năng thành lợi ích tiền bạc và thời gian",
    ],
    icon: Target,
  },
];

const HOOK_TECHNIQUES: HookTechnique[] = [
  {
    title: "Mở bằng nỗi đau cụ thể",
    description:
      "Đừng bắt đầu bằng tên sản phẩm. Hãy đặt người đọc vào đúng tình huống khó chịu mà họ vừa trải qua hôm qua — sự đồng cảm tạo ra lượt dừng chân.",
    example:
      "Da bạn nổi mụn ẩn dai dẳng dù đã đổi tới 5 loại sữa rửa mặt?",
  },
  {
    title: "Dẫn bằng con số và bằng chứng",
    description:
      "Não bộ ưu tiên dữ liệu cụ thể. Một con số chính xác trong 125 ký tự đầu tạo cảm giác chuyên nghiệp và đáng tin hơn mọi tính từ hoa mỹ.",
    example:
      "3.000 khách hàng đã giảm 2 size chỉ sau 6 tuần mặc định kỳ đầu tiên.",
  },
  {
    title: "Đặt câu hỏi đảo ngược",
    description:
      "Khi câu hỏi chạm đúng điều người đọc đang tự vấn, họ buộc phải bấm “Xem thêm” để tìm câu trả lời. Đây là đòn bẩy mạnh nhất để tăng chỉ số đọc.",
    example:
      "Bạn đang trả 500.000đ mỗi tháng cho thứ mà shop khác chỉ cần 0đ?",
  },
];

function GuideHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#06080D]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 via-teal-300 to-sky-400 text-black font-black text-xs shadow-md shadow-emerald-500/25 transition-transform duration-200 group-hover:scale-105">
            CS
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-extrabold tracking-tight text-white leading-none">
              Content Studio
            </span>
            <span className="font-mono text-[8.5px] uppercase tracking-wider text-slate-400 mt-0.5">
              Knowledge Base &amp; Guide
            </span>
          </div>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/"
            className="hidden text-[13px] font-medium text-slate-400 transition-colors hover:text-white sm:inline"
          >
            Trang chủ
          </Link>
          <Link
            href="/workspace"
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 px-3.5 py-1.5 text-xs font-bold text-black shadow-md shadow-emerald-500/25 transition-transform hover:brightness-110 active:scale-[0.98]"
          >
            <span>Vào Studio</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

export default function GuidePage() {
  return (
    <div className="relative min-h-screen bg-[#06080D] text-[#F3F4F6] selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Precision Micro-Grid & Ambient Mesh */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      <div className="pointer-events-none fixed top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-emerald-500/[0.08] blur-[140px]" />
      <div className="pointer-events-none fixed bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-cyan-500/[0.06] blur-[140px]" />

      <GuideHeader />

      <main className="relative z-10 mx-auto max-w-4xl space-y-12 px-4 py-12 sm:px-6 sm:py-16 text-slate-300">
        {/* Section 1 — Hero */}
        <section className="space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 shadow-sm">
            <BookOpen className="h-3.5 w-3.5" />
            Cẩm nang kiến tạo chuyển đổi
          </span>
          <h1 className="text-3xl sm:text-4xl font-black leading-tight tracking-tight text-white">
            Hướng dẫn sử dụng Content Studio AI
          </h1>
          <p className="max-w-2xl text-[15px] leading-relaxed text-slate-400">
            Làm chủ quy trình kiến tạo 3 góc bài viết bán hàng Facebook &amp; Instagram chuyển đổi cao, chinh phục thuật toán với ngưỡng 125 ký tự vàng.
          </p>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-[#0A0D15]/80 px-3 py-1 font-mono text-xs text-slate-400 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Phiên bản v3.2 · Cập nhật mới nhất Tháng 10/2026
          </div>
        </section>

        {/* Section 2 — Quickstart */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Quy trình 3 bước khởi tạo
            </h2>
            <p className="text-[14px] leading-relaxed text-slate-400">
              Từ mô tả sản phẩm thô đến trọn bộ nội dung sẵn sàng lên sóng — chỉ mất chưa đầy một phút.
            </p>
          </div>

          <div className="grid gap-4">
            {QUICKSTART.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="rounded-2xl border border-white/[0.12] bg-[#0A0D15]/85 p-6 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.14)] backdrop-blur-xl transition-all duration-300 hover:border-emerald-500/30"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                          Bước {item.step}
                        </span>
                        <h3 className="text-[15px] font-bold tracking-tight text-white">
                          {item.title}
                        </h3>
                      </div>
                      <p className="mt-2 text-[14px] leading-relaxed text-slate-300">
                        {item.summary}
                      </p>
                      <ul className="mt-3 space-y-1.5">
                        {item.bullets.map((bullet) => (
                          <li
                            key={bullet}
                            className="flex items-start gap-2 text-[13.5px] leading-relaxed text-slate-300"
                          >
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 3 — 125-char hook */}
        <section className="space-y-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              <Lightbulb className="h-3.5 w-3.5" />
              Bí quyết then chốt
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Ngưỡng 125 Ký Tự Vàng
            </h2>
            <p className="text-[14px] leading-relaxed text-slate-400">
              Trên News Feed Facebook &amp; Instagram, nội dung bài viết chỉ hiển thị trọn vẹn trong khoảng 125 ký tự trước khi xuất hiện nút “Xem thêm”. Toàn bộ phần phía sau bị ẩn đi và chỉ hiện khi người đọc chủ động nhấn vào.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.12] bg-[#0A0D15]/85 p-5 sm:p-6 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.14)] backdrop-blur-xl">
            <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Minh họa hiển thị thực tế trên News Feed
            </p>
            <div className="mt-4 rounded-xl border border-white/[0.1] bg-[#07090E]/90 p-4">
              <p className="text-[15px] leading-relaxed text-white">
                Da bạn nổi mụn ẩn dai dẳng dù đã đổi tới 5 loại sữa rửa mặt? 3.000 khách hàng đã sạch mụn sau 6 tuần — và bạn có thể là người tiếp theo.
              </p>
              <div className="my-3 flex items-center gap-2">
                <span className="h-px flex-1 bg-white/[0.08]" />
                <span className="rounded-full border border-white/[0.1] bg-[#0E131F] px-2.5 py-0.5 font-mono text-[11px] font-bold text-slate-400">
                  Xem thêm
                </span>
                <span className="h-px flex-1 bg-white/[0.08]" />
              </div>
              <p className="text-[15px] leading-relaxed text-slate-500">
                Bảng thành phần chi tiết, hướng dẫn sử dụng từng bước và ưu đãi freeship toàn quốc trong 48 giờ…
              </p>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/[0.08] p-4">
                <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  Vùng vàng · 0 – 125 ký tự
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-slate-300">
                  Hiển thị trọn vẹn trên News Feed, không bị cắt. Đây là toàn bộ những gì phần lớn người đọc sẽ thấy.
                </p>
              </div>
              <div className="rounded-xl border border-dashed border-white/[0.14] bg-[#07090E]/60 p-4">
                <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Vùng mở rộng · sau 125 ký tự
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-slate-400">
                  Bị ẩn sau nút “Xem thêm”. Chỉ hiện khi người đọc đã thực sự bị hook thuyết phục.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {HOOK_TECHNIQUES.map((technique, index) => (
              <div
                key={technique.title}
                className="rounded-2xl border border-white/[0.12] bg-[#0A0D15]/85 p-5 shadow-sm backdrop-blur-xl"
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/15 border border-emerald-500/30 font-mono text-[11px] font-bold text-emerald-400">
                  {index + 1}
                </span>
                <h3 className="mt-3 text-[14px] font-bold tracking-tight text-white">
                  {technique.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-slate-400">
                  {technique.description}
                </p>
                <p className="mt-3 rounded-lg border border-white/[0.08] bg-[#07090E]/80 px-3 py-2 text-[12.5px] italic leading-relaxed text-slate-200">
                  “{technique.example}”
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4 — 3 conversion angles */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              3 Góc nhìn tâm lý chuyển đổi
            </h2>
            <p className="text-[14px] leading-relaxed text-slate-400">
              Mỗi lần khởi tạo, hệ thống trả về đồng thời 3 góc tiếp cận khác nhau. Bạn chọn góc phù hợp nhất với từng tệp khách và từng giai đoạn chiến dịch.
            </p>
          </div>

          <div className="grid gap-4">
            {ANGLES.map((angle) => {
              const Icon = angle.icon;
              return (
                <div
                  key={angle.code}
                  className="rounded-2xl border border-white/[0.12] bg-[#0A0D15]/85 p-6 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.14)] backdrop-blur-xl transition-all duration-300 hover:border-emerald-500/30"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                          {angle.code}
                        </span>
                        <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">
                          {angle.tagline}
                        </span>
                      </div>
                      <h3 className="mt-2 text-[15px] font-bold tracking-tight text-white">
                        {angle.name}
                      </h3>
                      <p className="mt-2 text-[14px] leading-relaxed text-slate-300">
                        {angle.description}
                      </p>
                      <ul className="mt-3 space-y-1.5">
                        {angle.bullets.map((bullet) => (
                          <li
                            key={bullet}
                            className="flex items-start gap-2 text-[13.5px] leading-relaxed text-slate-300"
                          >
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 5 — Credits */}
        <section className="space-y-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              <CreditCard className="h-3.5 w-3.5" />
              Ví lượt tạo
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Cơ chế Lượt tạo (Credits) &amp; Hướng dẫn nạp tiền
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/[0.12] bg-[#0A0D15]/85 p-6 shadow-sm backdrop-blur-xl">
              <h3 className="text-[14px] font-bold tracking-tight text-white">
                1 Credit = 1 lần tạo trọn gói
              </h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-slate-300">
                Mỗi credit tương ứng một lần sinh ra đầy đủ 3 góc bài viết, kèm giật tít và bộ hashtag gợi ý. Không phát sinh chi phí ẩn, không tính thêm lượt cho từng phần.
              </p>
            </div>
            <div className="rounded-2xl border border-white/[0.12] bg-[#0A0D15]/85 p-6 shadow-sm backdrop-blur-xl">
              <h3 className="text-[14px] font-bold tracking-tight text-white">
                Nạp tiền bằng VietQR
              </h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-slate-300">
                Quét mã VietQR bằng ứng dụng ngân hàng bất kỳ. Hệ thống đối soát tự động và cộng lượt vào ví trong khoảng 30 giây kể từ khi giao dịch được xác nhận.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/[0.08] p-6 shadow-sm backdrop-blur-xl">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <RefreshCw className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-[14px] font-bold tracking-tight text-white">
                Cam kết hoàn credit tự động (Atomic Auto-Refund)
              </h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-slate-300">
                Nếu API AI gặp gián đoạn hoặc kết quả trả về sai cấu trúc, credit được hoàn lại 100% ngay trong cùng transaction — bạn không cần gửi khiếu nại và không bao giờ bị mất lượt oan.
              </p>
            </div>
          </div>
        </section>

        {/* Section 6 — Pro tips */}
        <section className="space-y-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              Tối ưu năng suất
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Phím tắt &amp; Mẹo năng suất
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/[0.12] bg-[#0A0D15]/85 p-5 shadow-sm backdrop-blur-xl">
              <div className="flex items-center gap-2 text-[13.5px] font-bold text-white">
                <Keyboard className="h-4 w-4 text-emerald-400" />
                Tạo bài viết tức thì
              </div>
              <p className="mt-2 text-[13.5px] leading-relaxed text-slate-300">
                Nhấn{" "}
                <kbd className="rounded-md border border-white/[0.14] bg-[#07090E] px-1.5 py-0.5 font-mono text-[11px] font-bold text-emerald-300">
                  Ctrl
                </kbd>{" "}
                +{" "}
                <kbd className="rounded-md border border-white/[0.14] bg-[#07090E] px-1.5 py-0.5 font-mono text-[11px] font-bold text-emerald-300">
                  Enter
                </kbd>{" "}
                ngay trong bộ soạn thảo để khởi tạo 3 góc bài viết mà không cần rời bàn phím.
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.12] bg-[#0A0D15]/85 p-5 shadow-sm backdrop-blur-xl">
              <div className="flex items-center gap-2 text-[13.5px] font-bold text-white">
                <Layers className="h-4 w-4 text-emerald-400" />
                Khôi phục từ Lịch sử
              </div>
              <p className="mt-2 text-[13.5px] leading-relaxed text-slate-300">
                Mở Lịch sử bài viết (History Drawer) để xem lại và khôi phục nội dung cũ. Thao tác này hoàn toàn miễn phí và không tiêu tốn thêm credit.
              </p>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="relative overflow-hidden rounded-[2.5rem] border border-white/[0.14] bg-[#0A0D15]/90 p-8 sm:p-12 text-center shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.18)] backdrop-blur-2xl">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-emerald-500/[0.15] blur-3xl pointer-events-none" />
          <h2 className="relative text-2xl sm:text-3xl font-black tracking-tight text-white">
            Bắt đầu tạo bài viết đầu tiên ngay hôm nay
          </h2>
          <p className="relative mx-auto mt-3 max-w-xl text-[14px] leading-relaxed text-slate-300">
            Chỉ mất khoảng 30 giây để có trọn bộ 3 góc nội dung sẵn sàng lên sóng cho Facebook &amp; Instagram.
          </p>
          <div className="relative mt-8">
            <Link
              href="/workspace"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 px-6 py-3 text-sm font-black text-black shadow-lg shadow-emerald-500/30 transition-transform hover:brightness-110 active:scale-[0.98]"
            >
              <span>Vào không gian sáng tạo</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}