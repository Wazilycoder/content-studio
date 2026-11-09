import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Lock,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import LandingFooter from "@/components/landing/LandingFooter";
import ThemeToggle from "@/components/theme/ThemeToggle";

interface PrivacySection {
  index: string;
  title: string;
  highlight?: string;
  paragraphs?: string[];
  bullets?: string[];
}

const SECTIONS: PrivacySection[] = [
  {
    index: "1",
    title: "Dữ liệu thu thập",
    paragraphs: [
      "Chúng tôi chỉ thu thập những dữ liệu tối thiểu cần thiết để vận hành dịch vụ. Danh sách dưới đây là đầy đủ và không có dữ liệu nào khác được thu thập ngầm.",
    ],
    bullets: [
      "Địa chỉ Email dùng để đăng ký và đăng nhập tài khoản.",
      "Mật khẩu được mã hóa một chiều qua Supabase Auth — hệ thống không lưu trữ mật khẩu dạng văn bản thuần.",
      "Thông tin mô tả sản phẩm, USP và tệp khách hàng mà bạn chủ động nhập vào biểu mẫu.",
      "Lịch sử bài viết do AI tạo ra, gắn chặt với tài khoản của bạn.",
    ],
  },
  {
    index: "2",
    title: "Mục đích xử lý dữ liệu",
    paragraphs: [
      "Dữ liệu của bạn chỉ được xử lý cho các mục đích vận hành trực tiếp dưới đây, không sử dụng cho mục đích quảng cáo bên thứ ba.",
    ],
    bullets: [
      "Cung cấp tính năng tạo 3 góc bài viết bán hàng theo yêu cầu.",
      "Quản trị số dư credit và đối soát giao dịch nạp tiền.",
      "Cho phép bạn xem lại, khôi phục và quản lý lịch sử bài viết trong workspace.",
      "Gửi thông báo kỹ thuật liên quan đến bảo mật tài khoản khi cần thiết.",
    ],
  },
  {
    index: "3",
    title: "Cam kết Zero-Training đặc quyền",
    highlight:
      "Chúng tôi cam kết TUYỆT ĐỐI không chia sẻ hoặc sử dụng ý tưởng kinh doanh, mô tả sản phẩm của người dùng để huấn luyện mô hình AI công cộng.",
    paragraphs: [
      "Mọi dữ liệu bạn nhập vào Content Studio chỉ tồn tại trong phạm vi phiên xử lý của chính tài khoản bạn. Dữ liệu không được gộp vào tập huấn luyện, không được chia sẻ cho đối tác mô hình và không được dùng để cải thiện chất lượng cho người dùng khác.",
      "Đây là cam kết đặc quyền của Content Studio, được áp dụng cho toàn bộ khách hàng ở mọi gói cước — kể cả gói dùng thử.",
    ],
  },
  {
    index: "4",
    title: "Biện pháp an toàn bảo mật",
    bullets: [
      "Đường truyền mã hóa SSL/TLS 256-bit cho toàn bộ dữ liệu trao đổi giữa trình duyệt và máy chủ.",
      "Supabase Row-Level Security (RLS) ngăn chặn triệt để rò rỉ dữ liệu giữa các tài khoản — mỗi truy vấn chỉ trả về bản ghi thuộc chính chủ tài khoản đang đăng nhập.",
      "Token HMAC-SHA256 bảo vệ phiên làm việc, có thời hạn và được ký phía máy chủ.",
      "Cookie phiên được đặt cờ httpOnly, secure và sameSite để chống đánh cắp và chống CSRF.",
    ],
  },
  {
    index: "5",
    title: "Quyền của chủ thể dữ liệu",
    paragraphs: [
      "Theo Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân, bạn có toàn quyền kiểm soát dữ liệu của mình.",
    ],
    bullets: [
      "Quyền yêu cầu xóa toàn bộ tài khoản và mọi dữ liệu liên quan khỏi hệ thống.",
      "Quyền xóa từng bản ghi riêng lẻ trong Lịch sử tạo bài viết bất kỳ lúc nào.",
      "Quyền yêu cầu trích xuất bản sao dữ liệu cá nhân đang được lưu trữ.",
      "Quyền rút lại sự đồng ý xử lý dữ liệu, áp dụng ngay từ thời điểm gửi yêu cầu.",
    ],
  },
  {
    index: "6",
    title: "Thông tin liên hệ bảo mật",
    paragraphs: [
      "Mọi yêu cầu liên quan đến dữ liệu cá nhân, xóa tài khoản hoặc báo cáo sự cố bảo mật vui lòng gửi về địa chỉ dưới đây. Chúng tôi phản hồi trong vòng 72 giờ làm việc.",
    ],
  },
];

export default function PrivacyPage() {
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
                Privacy &amp; Security
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
            <Lock className="h-3.5 w-3.5" />
            Bảo mật &amp; Quyền riêng tư
          </span>
          <h1 className="text-3xl sm:text-4xl font-black leading-tight tracking-tight text-white">
            Chính sách bảo mật dữ liệu
          </h1>
          <p className="max-w-2xl text-[15px] leading-relaxed text-slate-400">
            Bảo vệ thông tin cá nhân và bảo mật dữ liệu sản phẩm theo tiêu chuẩn quốc tế và Nghị định 13/2023/NĐ-CP.
          </p>
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-slate-400">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-semibold text-emerald-300 backdrop-blur-md">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              Zero AI Model Training Guarantee
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.1] bg-[#0A0D15]/80 px-3 py-1 backdrop-blur-md">
              <CalendarDays className="h-3.5 w-3.5 text-emerald-400" />
              Cập nhật: 24/10/2026
            </span>
          </div>
        </section>

        <div className="space-y-4">
          {SECTIONS.map((section) => (
            <article
              key={section.index}
              className="rounded-2xl border border-white/[0.12] bg-[#0A0D15]/85 p-6 sm:p-7 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.14)] backdrop-blur-xl transition-all duration-300 hover:border-emerald-500/30"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 border border-emerald-500/30 font-mono text-[11px] font-bold text-emerald-400">
                  {section.index}
                </span>
                <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">
                  Mục {section.index}. {section.title}
                </h2>
              </div>

              {section.highlight ? (
                <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/[0.08] p-4 text-[13.5px] font-semibold leading-relaxed text-emerald-300 shadow-sm">
                  {section.highlight}
                </div>
              ) : null}

              {section.paragraphs?.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mt-3 text-[14px] leading-relaxed text-slate-300"
                >
                  {paragraph}
                </p>
              ))}

              {section.bullets ? (
                <ul className="mt-4 space-y-2">
                  {section.bullets.map((bullet) => (
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

              {section.index === "6" ? (
                <p className="mt-4 text-[14px] leading-relaxed text-slate-400">
                  Email hỗ trợ bảo mật:{" "}
                  <a
                    href="mailto:privacy@contentstudio.ai"
                    className="font-semibold text-emerald-400 underline underline-offset-4 hover:text-emerald-300"
                  >
                    privacy@contentstudio.ai
                  </a>
                </p>
              ) : null}
            </article>
          ))}
        </div>

        <section className="rounded-2xl border border-white/[0.12] bg-[#0A0D15]/85 p-6 text-[13.5px] leading-relaxed text-slate-300 shadow-sm backdrop-blur-xl">
          Chính sách này có thể được cập nhật để phản ánh thay đổi về tính năng hoặc quy định pháp luật. Mọi thay đổi quan trọng sẽ được thông báo qua email đăng ký của bạn trước khi có hiệu lực.
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}