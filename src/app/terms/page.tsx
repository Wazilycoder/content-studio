import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Scale,
  Sparkles,
} from "lucide-react";
import LandingFooter from "@/components/landing/LandingFooter";
import { ThemeToggle } from "@/components/theme-toggle";

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
    <div className="min-h-screen bg-[var(--canvas)]">
      <header className="sticky top-0 z-40 border-b border-[var(--border-subtle)] bg-[var(--surface)]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-navy)] text-white shadow-xs">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="text-sm font-semibold tracking-tight text-[var(--ink-primary)]">
              Content Studio
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--ink-secondary)] transition-colors hover:text-[var(--ink-primary)]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Trang chủ
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-10 px-4 py-12 leading-relaxed text-[var(--ink-secondary)] sm:px-6 sm:py-16">
        <section className="space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--ink-secondary)]">
            <Scale className="h-3.5 w-3.5" />
            Pháp lý
          </span>
          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-[var(--ink-primary)] sm:text-4xl">
            Điều khoản sử dụng dịch vụ
          </h1>
          <p className="max-w-2xl text-[15px] leading-relaxed text-[var(--ink-secondary)]">
            Quy định rõ ràng về quyền hạn, trách nhiệm và cam kết pháp lý giữa
            Content Studio và khách hàng.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--ink-tertiary)]">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-1">
              <CalendarDays className="h-3.5 w-3.5" />
              Ngày hiệu lực: 24/10/2026
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-1">
              <Sparkles className="h-3.5 w-3.5" />
              Áp dụng cho toàn bộ người dùng
            </span>
          </div>
        </section>

        <div className="space-y-4">
          {ARTICLES.map((article) => (
            <article
              key={article.index}
              className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-6 shadow-xs sm:p-7"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--accent-navy)] text-[11px] font-bold text-white">
                  {article.index}
                </span>
                <h2 className="text-base font-semibold tracking-tight text-[var(--ink-primary)] sm:text-lg">
                  Điều {Number(article.index)}. {article.title}
                </h2>
              </div>

              {article.highlight ? (
                <p className="mt-4 rounded-lg border-l-2 border-[var(--accent-emerald)] bg-[var(--surface-raised)] px-4 py-3 text-[13.5px] font-semibold leading-relaxed text-[var(--ink-primary)]">
                  {article.highlight}
                </p>
              ) : null}

              {article.paragraphs?.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mt-3 text-[14px] leading-relaxed text-[var(--ink-secondary)]"
                >
                  {paragraph}
                </p>
              ))}

              {article.bullets ? (
                <ul className="mt-4 space-y-2">
                  {article.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex items-start gap-2.5 text-[14px] leading-relaxed text-[var(--ink-secondary)]"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-emerald)]" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>

        <section className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-6 text-[13.5px] leading-relaxed text-[var(--ink-secondary)]">
          Bằng việc tiếp tục sử dụng Content Studio sau ngày hiệu lực, bạn được
          xem là đã chấp thuận toàn bộ nội dung của Điều khoản sử dụng này. Mọi
          câu hỏi pháp lý vui lòng gửi về{" "}
          <a
            href="mailto:legal@contentstudio.ai"
            className="font-semibold text-[var(--accent-navy)] underline-offset-4 hover:underline"
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