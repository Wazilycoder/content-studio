import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  CheckCircle2,
  Mail,
  Receipt,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import LandingFooter from "@/components/landing/LandingFooter";
import ThemeToggle from "@/components/theme/ThemeToggle";

interface RefundArticle {
  index: string;
  title: string;
  highlight?: string;
  paragraphs?: string[];
  bullets?: string[];
}

const ARTICLES: RefundArticle[] = [
  {
    index: "01",
    title: "Hoàn Credit tức thì — Atomic Instant Refund",
    highlight:
      "Khi API AI gặp sự cố hoặc kết quả trả về không đúng chuẩn cấu trúc JSON, hệ thống tự động hoàn lại 100% credit trong cùng transaction — bạn không cần gửi khiếu nại.",
    paragraphs: [
      "Cơ chế Atomic Refund được thiết kế để đảm bảo bạn không bao giờ mất lượt oan. Credit bị trừ và credit hoàn lại nằm trong cùng một giao dịch nguyên tử: hoặc cả hai cùng thành công, hoặc cả hai cùng được hủy bỏ.",
      "Sau khi hoàn, số dư ví được cập nhật ngay lập tức và bạn có thể khởi tạo lại bài viết mà không phải chờ đợi bất kỳ bước xử lý thủ công nào.",
    ],
    bullets: [
      "Áp dụng tự động cho mọi lỗi timeout, lỗi mô hình và lỗi định dạng đầu ra.",
      "Không giới hạn số lần hoàn tự động trong một ngày.",
      "Lịch sử hoàn credit được ghi nhận minh bạch trong workspace của bạn.",
    ],
  },
  {
    index: "02",
    title: "Điều kiện hoàn tiền thanh toán chuyển khoản",
    paragraphs: [
      "Ngoài cơ chế hoàn credit tự động, khách hàng thanh toán bằng chuyển khoản được áp dụng chính sách hoàn tiền mặt theo các điều kiện dưới đây.",
    ],
    bullets: [
      "Áp dụng trong vòng 07 ngày kể từ thời điểm nạp tiền thành công.",
      "Áp dụng khi hệ thống gặp sự cố kỹ thuật không thể sử dụng dịch vụ và khách hàng chưa dùng quá 20% số lượt của gói nạp.",
      "Hỗ trợ đổi gói hoặc hoàn tiền chênh lệch nếu khách hàng nạp nhầm gói trong vòng 24 giờ kể từ giao dịch.",
      "Số tiền hoàn lại tương ứng với phần credit chưa sử dụng, quy đổi theo đơn giá của gói đã nạp.",
    ],
  },
  {
    index: "03",
    title: "Quy trình tiếp nhận hoàn tiền",
    paragraphs: [
      "Quy trình được thiết kế tối giản, không yêu cầu giấy tờ rườm rà. Toàn bộ trao đổi diễn ra qua email hoặc Telegram hỗ trợ.",
    ],
    bullets: [
      "Bước 1: Khách hàng gửi yêu cầu qua Email hoặc Telegram hỗ trợ, kèm email tài khoản và ảnh biên lai chuyển khoản.",
      "Bước 2: Bộ phận kỹ thuật và kế toán đối soát dữ liệu trong vòng 2 – 4 giờ làm việc.",
      "Bước 3: Chuyển khoản hoàn tiền trực tiếp về tài khoản ngân hàng của khách hàng trong vòng 24 – 48 giờ làm việc.",
    ],
  },
  {
    index: "04",
    title: "Các trường hợp không áp dụng hoàn tiền",
    paragraphs: [
      "Để bảo vệ tính công bằng cho toàn bộ người dùng, các trường hợp sau đây không thuộc phạm vi hoàn tiền:",
    ],
    bullets: [
      "Tài khoản đã sử dụng trên 50% số lượt tạo của gói đã nạp.",
      "Các trường hợp vi phạm nghiêm trọng Điều khoản sử dụng hoặc cố tình spam hệ thống.",
      "Yêu cầu được gửi sau thời hạn 07 ngày kể từ ngày nạp tiền thành công.",
      "Sai sót phát sinh từ phía ngân hàng của khách hàng, không thuộc hệ thống Content Studio.",
    ],
  },
  {
    index: "05",
    title: "Đầu mối liên hệ thanh toán",
    paragraphs: [
      "Mọi yêu cầu về hoàn tiền, đổi gói hoặc đối soát giao dịch vui lòng liên hệ trực tiếp bộ phận thanh toán. Chúng tôi phản hồi trong vòng 4 giờ làm việc.",
    ],
  },
];

export default function RefundPage() {
  return (
    <div className="relative min-h-screen bg-[#06080D] text-[#F3F4F6] selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Precision Micro-Grid & Ambient Mesh */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      <div className="pointer-events-none fixed top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-emerald-500/[0.08] blur-[140px]" />
      <div className="pointer-events-none fixed bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-cyan-500/[0.06] blur-[140px]" />

      {/* Obsidian Header */}
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
                Refund &amp; Guarantee
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.1] bg-[#0A0D15]/80 px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:border-white/20 hover:text-white active:scale-[0.98] backdrop-blur-md"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Trang chủ</span>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-4xl space-y-10 px-4 py-12 sm:px-6 sm:py-16 text-slate-300">
        <section className="space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 shadow-sm">
            <Receipt className="h-3.5 w-3.5" />
            Chính sách thanh toán &amp; Cam kết
          </span>
          <h1 className="text-3xl sm:text-4xl font-black leading-tight tracking-tight text-white">
            Chính sách hoàn tiền &amp; Bảo vệ quyền lợi
          </h1>
          <p className="max-w-2xl text-[15px] leading-relaxed text-slate-400">
            Minh bạch, công bằng và tôn trọng khách hàng. Cam kết hoàn tiền 100% khi hệ thống gặp lỗi kỹ thuật hoặc sự cố mô hình.
          </p>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-xs font-semibold text-emerald-300 backdrop-blur-md">
            <RefreshCw className="h-3.5 w-3.5 text-emerald-400" />
            Cơ chế hoàn credit tự động (Atomic Refund)
          </div>
        </section>

        <div className="space-y-4">
          {ARTICLES.map((article) => (
            <article
              key={article.index}
              className="rounded-2xl border border-white/[0.12] bg-[#0A0D15]/85 p-6 sm:p-7 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.14)] backdrop-blur-xl transition-all duration-300 hover:border-emerald-500/30"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 border border-emerald-500/30 font-mono text-[11px] font-bold text-emerald-400">
                  {article.index}
                </span>
                <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">
                  Điều {Number(article.index)}. {article.title}
                </h2>
              </div>

              {article.highlight ? (
                <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/[0.08] p-4 text-[13.5px] font-semibold leading-relaxed text-emerald-300 shadow-sm">
                  {article.highlight}
                </div>
              ) : null}

              {article.paragraphs?.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mt-3 text-[14px] leading-relaxed text-slate-300"
                >
                  {paragraph}
                </p>
              ))}

              {article.bullets ? (
                <ul className="mt-4 space-y-2">
                  {article.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex items-start gap-2.5 text-[14px] leading-relaxed text-slate-300"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              {article.index === "05" ? (
                <div className="mt-4 flex flex-col gap-2 text-[14px] leading-relaxed text-slate-300">
                  <span className="inline-flex items-center gap-2">
                    <Mail className="h-4 w-4 shrink-0 text-emerald-400" />
                    Email tiếp nhận:{" "}
                    <a
                      href="mailto:billing@contentstudio.ai"
                      className="font-semibold text-emerald-400 underline underline-offset-4 hover:text-emerald-300"
                    >
                      billing@contentstudio.ai
                    </a>
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <BadgeCheck className="h-4 w-4 shrink-0 text-emerald-400" />
                    Hotline giải quyết khiếu nại: 1900 6868 (8:00 – 18:00, Thứ 2 – Thứ 7)
                  </span>
                </div>
              ) : null}
            </article>
          ))}
        </div>

        <section className="rounded-2xl border border-white/[0.12] bg-[#0A0D15]/85 p-6 text-[13.5px] leading-relaxed text-slate-300 shadow-sm backdrop-blur-xl">
          Chính sách này được áp dụng song hành cùng Điều khoản sử dụng dịch vụ. Trong trường hợp có khác biệt về cách hiểu, nội dung có lợi hơn cho khách hàng sẽ được ưu tiên áp dụng.
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}