"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  Copy,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { getUserProfile } from "@/app/auth/actions";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { ShimmerButton } from "@/components/ui/ShimmerButton";
import { BorderBeam } from "@/components/ui/BorderBeam";

type LandingUser = Awaited<ReturnType<typeof getUserProfile>>;

interface HeroSectionProps {
  user: LandingUser;
}

interface TransformationAngle {
  id: string;
  num: string;
  tag: string;
  name: string;
  accentColor: string;
  glowColor: string;
  activeBg: string;
  activeBorder: string;
  hook: string;
  body: string;
  hashtags: string;
  psychology: string;
}

interface PresetScenario {
  id: string;
  niche: string;
  name: string;
  tone: string;
  rawBrief: string;
  angles: TransformationAngle[];
}

const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: "silk",
    niche: "THỜI TRANG CÔNG SỞ",
    name: "Áo sơ mi lụa tơ tằm Bảo Lộc",
    tone: "Trang trọng",
    rawBrief: "Ra mắt bộ sưu tập áo sơ mi lụa tơ tằm dệt tay Bảo Lộc dành cho nữ 25–45 tuổi. Thoáng mát, không nhăn, sang trọng tinh tế.",
    angles: [
      {
        id: "pas",
        num: "01",
        tag: "PAS",
        name: "Vấn đề & Giải pháp",
        accentColor: "#f43f5e",
        glowColor: "rgba(244, 63, 94, 0.25)",
        activeBg: "bg-rose-500/15",
        activeBorder: "border-rose-500/40",
        hook: "Áo sơ mi công sở khiến bạn bí bách cả ngày dài, ngứa cổ và nhăn nhúm sau 2 lần giặt? Đã đến lúc chấm dứt sự khó chịu đó.",
        body: "Sợi tơ tằm Bảo Lộc tự nhiên 100% với cấu trúc protein thoáng khí giúp hạ nhiệt tức thì 2-3°C khi tiếp xúc với da. Kỹ thuật dệt tay giữ nếp rũ mềm mại tự nhiên, không nhăn nhúm, cho bạn vẻ chỉn chu từ cuộc họp sáng sớm đến bữa tối đối tác.",
        hashtags: "#AoSoMiLua #LuaToTamBaoLoc #ThoiTrangCongSo #ThanhLichTuNhien",
        psychology: "Bí bách khó chịu → Giải pháp lụa tự nhiên → Tự tin suốt ngày dài",
      },
      {
        id: "aida",
        num: "02",
        tag: "AIDA",
        name: "Cảm xúc & Phong cách",
        accentColor: "#38bdf8",
        glowColor: "rgba(56, 189, 248, 0.25)",
        activeBg: "bg-sky-500/15",
        activeBorder: "border-sky-500/40",
        hook: "Không cần phô trương logo, chiếc áo sơ mi lụa tơ tằm dệt tay Bảo Lộc tự toát lên thần thái sang trọng, tĩnh lặng của người phụ nữ tinh tế.",
        body: "Chạm nhẹ vào làn da mỗi sáng thứ Hai như một lời khẳng định dịu dàng về gu thẩm mỹ thượng thừa. Ánh bóng mờ tự nhiên của tơ dệt thủ công tôn vinh nét quý phái mà không cần bất kỳ sự gượng ép nào — bước vào phòng làm việc và thu hút mọi ánh nhìn.",
        hashtags: "#QuietLuxury #ThoiTrangQuyPhai #LuaBaoLoc #ThanhLichTinhLang",
        psychology: "Gu thẩm mỹ tinh tế → Khẳng định vị thế thầm lặng → Tự hào sở hữu",
      },
      {
        id: "fab",
        num: "03",
        tag: "FAB",
        name: "Tính năng & Giá trị",
        accentColor: "#00d492",
        glowColor: "rgba(0, 212, 146, 0.25)",
        activeBg: "bg-teal-500/15",
        activeBorder: "border-teal-500/40",
        hook: "36 giờ dệt tay thủ công từ 100% kén tơ tằm tự nhiên vùng cao nguyên Bảo Lộc cùng cúc vỏ trai khảm xà cừ tạo nên kiệt tác độc bản.",
        body: "Mỗi chiếc áo sở hữu mật độ dệt 16 momme tối ưu cho độ bền gấp 3 lần lụa công nghiệp, không tích điện và thân thiện với làn da nhạy cảm. Từng đường may giấu chỉ chuẩn may đo cao cấp (Haute Couture), bảo toàn trọn vẹn giá trị di sản thủ công Việt.",
        hashtags: "#ThuCongTruyenThong #GiaTriThat #ChatLieuTuNhien #BaoLocSilk",
        psychology: "Chế tác 36h thủ công → Bền gấp 3 lần lụa dệt máy → Đầu tư xứng đáng",
      },
    ],
  },
  {
    id: "fish-sauce",
    niche: "ẨM THỰC ĐẶC SẢN",
    name: "Nước mắm cá cơm Phú Quốc 40N",
    tone: "Mộc mạc & Uy tín",
    rawBrief: "Nước mắm truyền thống Phú Quốc ủ chượp thùng gỗ bời lời 12 tháng. 40 độ đạm tự nhiên, không phẩm màu, không chất bảo quản.",
    angles: [
      {
        id: "pas",
        num: "01",
        tag: "PAS",
        name: "Vấn đề & Giải pháp",
        accentColor: "#f43f5e",
        glowColor: "rgba(244, 63, 94, 0.25)",
        activeBg: "bg-rose-500/15",
        activeBorder: "border-rose-500/40",
        hook: "Mệt mỏi vì mua phải nước mắm pha hương liệu, vị ngọt lợ của mì chính và toàn chất điều vị hóa học?",
        body: "Nước mắm cá cơm Phú Quốc 40N chắt lọc từ 100% cá cơm than tươi đánh bắt tại vùng biển sâu và muối hạt Bà Rịa. Vị mặn đượm đầu lưỡi chuyển hóa tức thì thành hậu vị ngọt béo tự nhiên của đạm cá nguyên bản, đưa bữa cơm gia đình trở về đúng vị ấm nồng truyền thống.",
        hashtags: "#NuocMamPhuQuoc #ViTruyenThong #AnLanhChoGiaDinh #DamThat",
        psychology: "Sợ hóa chất công nghiệp → Nguồn gốc nguyên bản 100% → Bữa ăn an tâm",
      },
      {
        id: "aida",
        num: "02",
        tag: "AIDA",
        name: "Cảm xúc & Ký ức",
        accentColor: "#38bdf8",
        glowColor: "rgba(56, 189, 248, 0.25)",
        activeBg: "bg-sky-500/15",
        activeBorder: "border-sky-500/40",
        hook: "Mùi thơm nồng đượm của chén nước mắm nguyên chất mẹ rót mỗi buổi chiều mưa — ký ức tuổi thơ vẫn vẹn nguyên trong từng giọt nâu cánh gián.",
        body: "Mở nắp chai là cảm nhận ngay hương thơm quyến rũ đặc trưng của mắm ủ chượp tự nhiên. Dù chỉ là đĩa rau luộc đơn sơ hay mâm cỗ tất niên trang trọng, một chén nước mắm ngon đủ sức đánh thức mọi giác quan và gắn kết các thế hệ bên mâm cơm gia đình.",
        hashtags: "#HuongViQueNha #MamTruyenThong #KyUcMeNau #ComNhaThomNgon",
        psychology: "Khơi gợi tình thân & ký ức → Gắn kết bữa cơm nhà → Mua tặng gia đình",
      },
      {
        id: "fab",
        num: "03",
        tag: "FAB",
        name: "Chế tác & Độ đạm",
        accentColor: "#00d492",
        glowColor: "rgba(0, 212, 146, 0.25)",
        activeBg: "bg-teal-500/15",
        activeBorder: "border-teal-500/40",
        hook: "12 tháng ủ chượp ròng rã trong thùng gỗ bời lời rừng nguyên sinh tạo nên giọt nước mắm 40 độ đạm acid amin tinh khiết.",
        body: "Áp dụng phương pháp gài nén truyền thống hơn 200 năm của ngư dân đảo ngọc. Mỗi mẻ chượp đạt tỷ lệ vàng 3 cá 1 muối, kiểm soát nghiêm ngặt chỉ số vi sinh và không pha loãng bất kỳ giọt nước nào, cam kết chất lượng chuẩn xuất khẩu EU.",
        hashtags: "#CheTacTruyenThong #UChuongThungGo #PhuQuocTradition #40DoDam",
        psychology: "Quy trình 12 tháng khắc khe → Đạm tự nhiên 40N → Chất lượng đỉnh cao",
      },
    ],
  },
  {
    id: "serum",
    niche: "DƯỢC MỸ PHẨM THUẦN CHAY",
    name: "Serum B5 Rau Má Phục Hồi Da",
    tone: "Khoa học & Chuyên sâu",
    rawBrief: "Serum dưỡng ẩm phục hồi hàng rào bảo vệ da, chứa 5% Vitamin B5 tinh khiết và chiết xuất rau má Madagascar. Dành cho da nhạy cảm sau treatment.",
    angles: [
      {
        id: "pas",
        num: "01",
        tag: "PAS",
        name: "Vấn đề & Giải pháp",
        accentColor: "#f43f5e",
        glowColor: "rgba(244, 63, 94, 0.25)",
        activeBg: "bg-rose-500/15",
        activeBorder: "border-rose-500/40",
        hook: "Da ửng đỏ, rát rát và bong tróc sau khi peel hoặc dùng retinol khiến bạn mất tự tin không dám ra ngoài?",
        body: "Công thức độc quyền kết hợp 5% D-Panthenol y khoa cùng hoạt chất Asiaticoside từ rau má hữu cơ giúp làm dịu cảm giác châm chích chỉ sau 15 phút. Khóa ẩm sâu 72 giờ, tái thiết lập lớp màng lipid bảo vệ để làn da nhanh chóng căng mọng và khỏe mạnh trở lại.",
        hashtags: "#PhucHoiDa #SerumB5RauMa #DaNhayCam #TreatmentSkincare",
        psychology: "Hoảng loạn vì da tổn thương → Làm dịu sau 15 phút → Phục hồi bền vững",
      },
      {
        id: "aida",
        num: "02",
        tag: "AIDA",
        name: "Tự tin & Rạng rỡ",
        accentColor: "#38bdf8",
        glowColor: "rgba(56, 189, 248, 0.25)",
        activeBg: "bg-sky-500/15",
        activeBorder: "border-sky-500/40",
        hook: "Tạm biệt lớp nền dày cộm che khuyết điểm, bạn hoàn toàn có thể tự tin sải bước với làn da mộc mọng nước, bóng khỏe tự nhiên.",
        body: "Cảm giác mát lành tan ngay khi chạm vào bề mặt da, thẩm thấu không tì vết mà không gây bết dính. Một bước dưỡng đơn giản mỗi sáng tối đem lại sự chuyển hóa kỳ diệu, cho làn da thần thái trong veo đầy sức sống.",
        hashtags: "#DaMocKhoeDep #GlassSkinVietnam #SkincareToiGian #TuTinToaSang",
        psychology: "Khao khát làn da mộc hoàn hảo → Cảm giác nhẹ tênh thẩm thấu → Tự tin tỏa sáng",
      },
      {
        id: "fab",
        num: "03",
        tag: "FAB",
        name: "Thành phần & Lâm sàng",
        accentColor: "#00d492",
        glowColor: "rgba(0, 212, 146, 0.25)",
        activeBg: "bg-teal-500/15",
        activeBorder: "border-teal-500/40",
        hook: "Kiểm nghiệm lâm sàng chứng minh hiệu quả giảm đỏ 68% và tăng độ ẩm tức thì 84% sau lần thoa đầu tiên.",
        body: "Đạt chứng nhận thuần chay quốc tế The Vegan Society. Bảng thành phần tối giản chuẩn Clean Beauty: 0 cồn khô, 0 hương liệu nhân tạo, 0 paraben. Công nghệ phân tử nano siêu nhỏ đưa dưỡng chất thẩm thấu tận lớp hạ bì của da.",
        hashtags: "#KiemNghiemLamSang #CleanBeauty #ThuanChay #DermatologistTested",
        psychology: "Số liệu lâm sàng 68% giảm đỏ → Chứng nhận thuần chay → An tâm tuyệt đối",
      },
    ],
  },
];

export default function HeroSection({ user }: HeroSectionProps) {
  const router = useRouter();
  const [presetIndex, setPresetIndex] = useState(0);
  const [activeAngleIndex, setActiveAngleIndex] = useState(0);
  const [copiedPost, setCopiedPost] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  const currentScenario = PRESET_SCENARIOS[presetIndex];
  const activeAngle = currentScenario.angles[activeAngleIndex];
  const primaryHref = user ? "/workspace" : "/register";

  const handleCopy = async () => {
    const fullText = `${activeAngle.hook}\n\n${activeAngle.body}\n\n${activeAngle.hashtags}`;
    try {
      await navigator.clipboard.writeText(fullText);
      setCopiedPost(true);
      window.setTimeout(() => setCopiedPost(false), 1600);
    } catch {
      setCopiedPost(false);
    }
  };

  const handleTriggerSynthesis = (targetPreset?: number) => {
    if (typeof targetPreset === "number") setPresetIndex(targetPreset);
    setIsSynthesizing(true);
    window.setTimeout(() => setIsSynthesizing(false), 220);
  };

  return (
    <section className="relative overflow-hidden py-4 sm:py-6 lg:py-8 lg:max-h-[820px]">
      {/* 1. ReactBits Atmospheric Grid & Radial Lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]"
      />

      {/* 2. Layered Ambient Neon Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[550px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,212,146,0.18),rgba(37,99,235,0.12),transparent_70%)] blur-[50px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 -right-40 -z-10 h-[450px] w-[550px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,212,146,0.12),transparent_70%)] blur-[45px]"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
          {/* ================= LEFT COLUMN: EDITORIAL INTELLIGENCE ================= */}
          <div className="flex flex-col items-start text-left lg:col-span-6 xl:col-span-6">
            {/* ReactBits Glass Pill Eyebrow */}
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/10 px-3.5 py-1.5 text-xs font-mono font-medium tracking-wider uppercase text-teal-300 shadow-[0_0_15px_rgba(0,212,146,0.15)] backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-400" />
              </span>
              <span>THE LIVE CONTENT SYNTHESIZER // LINEAR TIER</span>
            </div>

            {/* Kinetic High-Contrast Display Headline */}
            <h1 className="mt-3 text-balance text-3xl font-extrabold tracking-tight text-[var(--ink-primary)] sm:text-4xl lg:text-[2.75rem] leading-[1.12]">
              Tạo Kịch Bản Quảng Cáo <br />
              <span className="bg-gradient-to-r from-teal-500 via-sky-500 to-indigo-500 bg-clip-text text-transparent dark:from-teal-300 dark:via-sky-300 dark:to-indigo-400 drop-shadow-[0_0_35px_rgba(0,212,146,0.3)]">
                Chuẩn Xác Như Một Cỗ Máy Kỹ Thuật.
              </span>
            </h1>

            {/* Subtitle with Clear Multi-Angle Value */}
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-[var(--ink-secondary)] sm:text-[15px]">
              Trực tiếp chứng kiến một đề bài thô sơ được bóc tách và gia công thành 3 kịch bản chuyển đổi cao ngay trên màn hình:{" "}
              <strong className="font-semibold text-rose-500 dark:text-rose-400">PAS</strong> đánh trúng nỗi đau,{" "}
              <strong className="font-semibold text-sky-600 dark:text-sky-400">AIDA</strong> khơi gợi cảm xúc và{" "}
              <strong className="font-semibold text-teal-600 dark:text-teal-400">FAB</strong> chứng minh độ đạm & chế tác.
            </p>

            {/* Call To Action Buttons (ReactBits Island Button Architecture) */}
            <div className="mt-5 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => router.push(primaryHref)}
                className="btn-tactile group inline-flex items-center justify-center gap-2.5 rounded-lg bg-[var(--brand)] px-6 py-2.5 text-xs font-bold text-white dark:text-black shadow-[0_0_25px_rgba(0,212,146,0.35)] transition hover:opacity-90"
              >
                <span>Khởi Động Studio</span>
                <span className="flex h-5 w-5 items-center justify-center rounded-md bg-black/15 transition-transform duration-200 group-hover:translate-x-1">
                  <ArrowRight className="h-3 w-3" />
                </span>
              </button>

              <a
                href="#demo"
                className="btn-tactile inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-5 py-2.5 text-xs font-semibold text-[var(--ink-secondary)] transition hover:border-[var(--border-strong)] hover:text-[var(--ink-primary)] sm:w-auto"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 text-[var(--brand)]" />
                <span>Xem quy trình 3 bước</span>
              </a>
            </div>

            {/* Linear Precision Spec Bar */}
            <div className="mt-5 flex flex-wrap items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)]/60 px-3 py-1.5 text-xs text-[var(--ink-secondary)]">
              <span className="flex items-center gap-1.5 font-semibold text-[var(--ink-primary)]">
                <Sparkles className="h-3.5 w-3.5 text-[var(--brand)]" />
                Quy trình:
              </span>
              <span className="rounded-md border border-[var(--border-subtle)] bg-[var(--surface)] px-2 py-0.5 font-mono text-[11px]">
                Brief thô
              </span>
              <span className="text-[var(--ink-tertiary)]">→</span>
              <span className="rounded-md border border-[var(--brand)]/30 bg-[var(--brand)]/10 px-2 py-0.5 font-mono text-[11px] font-medium text-[var(--brand)]">
                3 Góc tâm lý
              </span>
              <span className="text-[var(--ink-tertiary)]">→</span>
              <span className="rounded-md border border-sky-500/30 bg-sky-500/10 px-2 py-0.5 font-mono text-[11px] font-medium text-sky-600 dark:text-sky-300">
                Canh Newsfeed
              </span>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: PRODUCT TRANSFORMATION THEATRE ================= */}
          <div className="relative flex w-full flex-col items-center justify-center lg:col-span-6 xl:col-span-6">
            {/* The 3-Layer Z-Axis Stage — Double-Bezel Chassis + BorderBeam */}
            <div className="double-bezel relative w-full max-w-[540px]">
              <BorderBeam duration={8} colorFrom="#00D492" colorVia="#38BDF8" colorTo="#00D492" />
              <div className="double-bezel-inner custom-scrollbar max-h-[470px] overflow-y-auto p-3">
              {/* TẦNG 0: BƯỚC 1 CHỌN ĐỀ BÀI DOANH NGHIỆP THẬT */}
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-black/60 p-2.5 text-xs font-mono shadow-md">
                <span className="text-[11px] text-gray-400 uppercase tracking-wider pl-1 font-semibold">
                  MẪU NGÀNH HÀNG:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_SCENARIOS.map((scenario, idx) => (
                    <button
                      key={scenario.id}
                      type="button"
                      onClick={() => handleTriggerSynthesis(idx)}
                      className={`btn-tactile px-2 py-0.5 rounded-md text-[10.5px] font-bold transition ${
                        presetIndex === idx
                          ? "bg-teal-500/25 border border-teal-400/60 text-teal-300 shadow-[0_0_12px_rgba(0,212,146,0.2)]"
                          : "bg-white/5 border border-white/10 text-gray-400 hover:text-white"
                      }`}
                    >
                      [{idx + 1}] {scenario.name.split(" ")[0]} {scenario.name.split(" ")[1]}
                    </button>
                  ))}
                </div>
              </div>

              {/* TẦNG 1: RAW BRIEF DISPLAY BAR */}
              <div className="mb-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-xs backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.08)]">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="rounded-md bg-teal-500/20 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-teal-300">
                      {currentScenario.niche}
                    </span>
                    <span className="text-[11px] text-gray-400 font-mono">Tone: {currentScenario.tone}</span>
                  </div>
                  <p className="line-clamp-2 font-medium text-slate-200 text-xs sm:text-[13px] leading-relaxed">
                    &quot;{currentScenario.rawBrief}&quot;
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleTriggerSynthesis()}
                  className="btn-tactile shrink-0 self-start sm:self-auto px-3.5 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-black font-mono text-[11px] uppercase font-bold transition shadow-md shadow-teal-500/20"
                >
                  ⚡ TỔNG HỢP (0.5s)
                </button>
              </div>

              {/* TẦNG 2: REACTBITS SEGMENTED ANGLE CONTROLLER */}
              <div className="mb-3.5 grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-slate-950/80 p-1.5 backdrop-blur-2xl shadow-xl">
                {currentScenario.angles.map((angle, idx) => {
                  const isActive = activeAngleIndex === idx;
                  return (
                    <button
                      key={angle.id}
                      type="button"
                      onClick={() => setActiveAngleIndex(idx)}
                      aria-pressed={isActive}
                      className={`group relative flex min-w-0 flex-col items-start gap-0.5 rounded-lg p-2 text-left transition-all duration-300 ${
                        isActive
                          ? `${angle.activeBg} border ${angle.activeBorder} shadow-[0_0_20px_rgba(0,0,0,0.6),inset_0_1px_0_0_rgba(255,255,255,0.2)]`
                          : "border border-transparent hover:bg-white/5 hover:border-white/5"
                      }`}
                    >
                      <div className="flex w-full items-center justify-between">
                        <span
                          className="flex items-center gap-1.5 font-mono text-[11px] font-bold tracking-wider"
                          style={{ color: isActive ? angle.accentColor : "#94a3b8" }}
                        >
                          <span
                            className="h-1.5 w-1.5 rounded-full transition-transform group-hover:scale-125"
                            style={{
                              backgroundColor: angle.accentColor,
                              boxShadow: isActive ? `0 0 10px ${angle.accentColor}` : "none",
                            }}
                          />
                          {angle.num}. {angle.tag}
                        </span>
                        {isActive && (
                          <span
                            className="h-1 w-1 rounded-full animate-ping"
                            style={{ backgroundColor: angle.accentColor }}
                          />
                        )}
                      </div>
                      <span
                        className={`w-full truncate text-[11px] font-medium transition-colors ${
                          isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                        }`}
                      >
                        {angle.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* TẦNG 3: EDITORIAL SHEET (ReactBits Glass Stage Card) */}
              <div className={`relative transition-all duration-200 ${isSynthesizing ? "opacity-60 blur-xs scale-[0.99]" : "opacity-100 blur-0 scale-100"}`}>
                <SpotlightCard
                  spotlightColor={activeAngle.glowColor}
                  className="rounded-[28px] border border-white/10 bg-[#0E1017]/90 backdrop-blur-2xl shadow-[0_30px_70px_-15px_rgba(0,0,0,0.85),inset_0_1px_0_0_rgba(255,255,255,0.08)]"
                >
                  <div className="p-5 sm:p-7">
                    {/* Sheet Header */}
                    <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span
                          className="h-2 w-2 shrink-0 rounded-full"
                          style={{
                            backgroundColor: activeAngle.accentColor,
                            boxShadow: `0 0 12px ${activeAngle.accentColor}`,
                          }}
                        />
                        <span className="font-mono text-xs font-bold uppercase tracking-widest text-slate-200">
                          Editorial Sheet · {activeAngle.num} {activeAngle.tag}
                        </span>
                      </div>
                      <span
                        className="shrink-0 rounded-full border px-3 py-0.5 text-xs font-semibold backdrop-blur-md"
                        style={{
                          borderColor: `${activeAngle.accentColor}40`,
                          backgroundColor: `${activeAngle.accentColor}15`,
                          color: activeAngle.accentColor,
                        }}
                      >
                        {activeAngle.name}
                      </span>
                    </div>

                    {/* Hook Mở Đầu Box */}
                    <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/80 p-4 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]">
                      <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span
                          className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider"
                          style={{ color: activeAngle.accentColor }}
                        >
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: activeAngle.accentColor }}
                          />
                          Hook đầu trang
                        </span>
                        <span className="rounded-md border border-white/5 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-slate-400">
                          {activeAngle.hook.length} ký tự · hiển thị trước &quot;Xem thêm&quot;
                        </span>
                      </div>
                      <p className="text-[14px] font-semibold leading-relaxed text-slate-100 sm:text-[14.5px]">
                        {activeAngle.hook}
                      </p>
                    </div>

                    {/* Thân bài */}
                    <div className="mt-4">
                      <p className="text-[13.5px] leading-[1.8] text-slate-300">
                        {activeAngle.body}
                      </p>
                    </div>

                    {/* Hashtag & Chiến lược tâm lý */}
                    <div className="mt-4 space-y-2.5 border-t border-white/10 pt-4">
                      <p
                        className="font-mono text-xs font-semibold tracking-wide"
                        style={{ color: activeAngle.accentColor }}
                      >
                        {activeAngle.hashtags}
                      </p>
                      <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3 text-xs text-slate-300">
                        <p className="flex items-start gap-2 leading-relaxed">
                          <span
                            className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full"
                            style={{ backgroundColor: activeAngle.accentColor }}
                          />
                          <span>
                            <strong className="text-white">Chiến lược tâm lý: </strong>
                            {activeAngle.psychology}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Action Footer */}
                    <div className="mt-6 flex flex-col gap-2.5 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
                      <button
                        type="button"
                        onClick={handleCopy}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-200 transition-all hover:border-white/25 hover:bg-white/10 hover:text-white active:scale-95"
                      >
                        {copiedPost ? (
                          <>
                            <Check className="h-4 w-4 text-emerald-400" />
                            <span className="text-emerald-400 font-semibold">Đã sao chép bản thảo!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            <span>Sao chép bản thảo</span>
                          </>
                        )}
                      </button>

                      <Link
                        href="/workspace"
                        className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-95"
                        style={{
                          backgroundColor: activeAngle.accentColor === "#818cf8" ? "#4f46e5" : activeAngle.accentColor === "#fb7185" ? "#e11d48" : "#059669",
                          boxShadow: `0 0 20px ${activeAngle.glowColor}`,
                        }}
                      >
                        <span>Mở Studio biên tập</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                                        </div>
                                      </div>
                                    </SpotlightCard>
                                  </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </section>
                      );
                    }
