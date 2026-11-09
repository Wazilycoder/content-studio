import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Scale,
  Sparkles,
} from "lucide-react";
import LandingFooter from "@/components/landing/LandingFooter";
import ThemeToggle from "@/components/theme/ThemeToggle";

interface LegalArticle {
  index: string;
  title: string;
  highlight?: string;
  paragraphs?: string[];
  bullets?: string[];
}

const ARTICLES: LegalArticle[] = [
  {
    index: "01",
    title: "Chấp thuận điều khoản",
    paragraphs: [
      "Bằng việc truy cập, đăng ký tài khoản hoặc sử dụng bất kỳ tính năng nào của Content Studio (bao gồm website, ứng dụng web và các điểm cuối API), bạn xác nhận đã đọc, hiểu và đồng ý bị ràng buộc bởi toàn bộ Điều khoản sử dụng này.",
      "Nếu bạn không đồng ý với bất kỳ nội dung nào dưới đây, vui lòng ngừng sử dụng dịch vụ ngay lập tức.",
    ],
    bullets: [
      "Phạm vi áp dụng: toàn bộ người dùng truy cập website và API của Content Studio.",
      "Điều khoản có hiệu lực kể từ thời điểm bạn bắt đầu sử dụng dịch vụ.",
      "Content Studio có quyền cập nhật điều khoản và sẽ thông báo trước 07 ngày trên website.",
    ],
  },
  {
    index: "02",
    title: "Tài khoản & Xác thực",
    paragraphs: [
      "Bạn chịu trách nhiệm bảo mật thông tin đăng nhập (email, mật khẩu) và toàn bộ hoạt động phát sinh dưới tài khoản của mình.",
      "Hệ thống áp dụng xác minh chống bot bằng Math Captcha tại các thời điểm: đăng ký, đăng nhập và khôi phục mật khẩu, nhằm ngăn chặn truy cập tự động trái phép.",
    ],
    bullets: [
      "Không chia sẻ tài khoản cho nhiều người dùng chung một không gian làm việc.",
      "Mật khẩu được băm một chiều qua Supabase Auth — không ai, kể cả quản trị viên, có thể đọc được mật khẩu gốc.",
      "Vui lòng thông báo ngay cho chúng tôi khi phát hiện dấu hiệu truy cập trái phép.",
    ],
  },
  {
    index: "03",
    title: "Quyền sở hữu trí tuệ đối với Nội dung do AI tạo ra",
    highlight:
      "KHÁCH HÀNG SỞ HỮU 100% QUYỀN THƯƠNG MẠI đối với mọi bài viết, tiêu đề và hashtag được sinh ra từ Content Studio.",
    paragraphs: [
      "Content Studio không yêu cầu phí bản quyền, không thu hoa hồng trên doanh thu và không ràng buộc bất kỳ quyền tác quyền phụ thuộc nào đối với nội dung bạn tạo ra.",
      "Bạn được phép chỉnh sửa, xuất bản, chạy quảng cáo, in ấn và thương mại hóa nội dung trên mọi kênh mà không cần xin phép hay ghi nguồn.",
    ],
    bullets: [
      "Nội dung đầu ra thuộc toàn quyền định đoạt của khách hàng.",
      "Chúng tôi không tái sử dụng nội dung của bạn để huấn luyện mô hình AI công cộng.",
      "Thương hiệu, logo, giao diện và mã nguồn của Content Studio vẫn thuộc quyền sở hữu của chúng tôi.",
    ],
  },
  {
    index: "04",
    title: "Hành vi nghiêm cấm",
    paragraphs: [
      "Các hành vi dưới đây bị nghiêm cấm tuyệt đối và sẽ dẫn đến việc khóa tài khoản vĩnh viễn, không hoàn tiền:",
    ],
    bullets: [
      "Tạo nội dung vi phạm pháp luật Việt Nam: lừa đảo, cờ bạc, hàng cấm, xuyên tạc, chống phá Nhà nước.",
      "Tấn công từ chối dịch vụ (DDoS), quét lỗ hổng hoặc gửi request với tần suất bất thường.",
      "Reverse-engineer, dịch ngược, sao chép mã nguồn hoặc nhân bản mô hình của hệ thống.",
      "Sử dụng công cụ tự động để trục lợi credit hoặc vượt qua cơ chế xác thực.",
    ],
  },
  {
    index: "05",
    title: "Gói cước & Thanh toán",
    paragraphs: [
      "Mỗi lượt nạp được quy đổi thành credit. 1 credit tương ứng 1 lần tạo trọn bộ 3 góc bài viết kèm giật tít và bộ hashtag gợi ý.",
    ],
    bullets: [
      "Lượt nạp KHÔNG có hạn sử dụng — bạn dùng đến khi hết, kể cả sau nhiều tháng.",
      "Đối soát thanh toán tự động qua ngân hàng MB Bank theo chuẩn VietQR.",
      "Credit chỉ được cộng vào ví khi hệ thống xác nhận giao dịch thành công.",
      "Chi tiết về hoàn tiền được quy định tại Chính sách hoàn tiền.",
    ],
  },
  {
    index: "06",
    title: "Giới hạn trách nhiệm",
    paragraphs: [
      "Content Studio cam kết độ khả dụng (uptime) tối thiểu 99.5% mỗi tháng, không tính các cửa sổ bảo trì đã thông báo trước.",
      "Chúng tôi không chịu trách nhiệm về kết quả kinh doanh cuối cùng, hiệu quả chiến dịch quảng cáo hay bất kỳ quyết định thương mại nào của nhà quảng cáo.",
    ],
    bullets: [
      "Không bảo đảm nội dung AI tạo ra phù hợp với mọi ngành hàng đặc thù.",
      "Không chịu trách nhiệm cho thiệt hại gián tiếp, mất lợi nhuận hoặc mất cơ hội kinh doanh.",
      "Trong mọi trường hợp, trách nhiệm tối đa không vượt quá số tiền bạn đã thanh toán trong 30 ngày gần nhất.",
    ],
  },
  {
    index: "07",
    title: "Luật điều chỉnh & Giải quyết tranh chấp",
    paragraphs: [
      "Điều khoản này được điều chỉnh và giải thích theo pháp luật nước Cộng hòa Xã hội Chủ nghĩa Việt Nam.",
      "Các bên ưu tiên giải quyết tranh chấp thông qua thương lượng trong vòng 30 ngày kể từ ngày phát sinh. Nếu không đạt kết quả, tranh chấp sẽ được đưa ra Tòa án có thẩm quyền tại Việt Nam để giải quyết.",
    ],
  },
];

export default function TermsPage() {
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
                Legal &amp; Terms
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

      <main className="relative z-10 mx-auto max-w-4xl space-y-10 px-4 py-12 leading-relaxed text-slate-300 sm:px-6 sm:py-16">
        <section className="space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 shadow-sm">
            <Scale className="h-3.5 w-3.5" />
            Văn kiện pháp lý chính thức
          </span>
          <h1 className="text-3xl sm:text-4xl font-black leading-tight tracking-tight text-white">
            Điều khoản sử dụng dịch vụ
          </h1>
          <p className="max-w-2xl text-[15px] leading-relaxed text-slate-400">
            Quy định minh bạch về quyền hạn, trách nhiệm và cam kết pháp lý giữa Content Studio và khách hàng.
          </p>
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-slate-400">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.1] bg-[#0A0D15]/80 px-3 py-1 backdrop-blur-md">
              <CalendarDays className="h-3.5 w-3.5 text-emerald-400" />
              Ngày hiệu lực: 24/10/2026
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.1] bg-[#0A0D15]/80 px-3 py-1 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              Áp dụng cho toàn bộ người dùng
            </span>
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
            </article>
          ))}
        </div>

        <section className="rounded-2xl border border-white/[0.12] bg-[#0A0D15]/85 p-6 text-[13.5px] leading-relaxed text-slate-300 shadow-sm backdrop-blur-xl">
          Bằng việc tiếp tục sử dụng Content Studio sau ngày hiệu lực, bạn được xem là đã chấp thuận toàn bộ nội dung của Điều khoản sử dụng này. Mọi thắc mắc pháp lý vui lòng gửi về{" "}
          <a
            href="mailto:legal@contentstudio.ai"
            className="font-semibold text-emerald-400 underline underline-offset-4 hover:text-emerald-300"
          >
            legal@contentstudio.ai
          </a>
          .
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}