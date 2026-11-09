"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  Copy,
  Layers,
  Sparkles,
  Zap,
  SlidersHorizontal,
} from "lucide-react";
import { getUserProfile } from "@/app/auth/actions";
import { BorderBeam } from "@/components/ui/BorderBeam";
import { NumberTicker } from "@/components/ui/NumberTicker";
import { MorphingText } from "@/components/ui/MorphingText";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Tilt } from "@/components/ui/Tilt";
import { Particles } from "@/components/ui/Particles";
import { useToast } from "@/components/ui/SonnerToast";

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
    rawBrief:
      "Ra mắt bộ sưu tập áo sơ mi lụa tơ tằm dệt tay Bảo Lộc dành cho nữ 25–45 tuổi. Thoáng mát, không nhăn, sang trọng tinh tế.",
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
    rawBrief:
      "Nước mắm truyền thống Phú Quốc ủ chượp thùng gỗ bời lời 12 tháng. 40 độ đạm tự nhiên, không phẩm màu, không chất bảo quản.",
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
    rawBrief:
      "Serum phục hồi làm dịu da nhạy cảm kích ứng sau treatment. Rau má Centella Asiatica 85% kết hợp Vitamin B5 10% và HA phân tử nhỏ.",
    angles: [
      {
        id: "pas",
        num: "01",
        tag: "PAS",
        name: "Vấn đề & Cứu cánh",
        accentColor: "#f43f5e",
        glowColor: "rgba(244, 63, 94, 0.25)",
        activeBg: "bg-rose-500/15",
        activeBorder: "border-rose-500/40",
        hook: "Da bỏng rát, ửng đỏ và bong tróc từng mảng sau khi peel da hay dùng retinol? Đừng liều thoa thêm kem đặc gây bít tắc.",
        body: "Serum B5 thế hệ mới chứa 85% dịch chiết rau má tươi cô đặc giúp làm dịu ngứa rát chỉ sau 15 phút. Công thức cấp nước đa tầng với Hyaluronic Acid phân tử siêu nhỏ len lỏi sâu vào biểu bì, khôi phục lớp màng bảo vệ tự nhiên mà không gây nhờn dính.",
        hashtags: "#PhucHoiDa #SerumB5RauMa #DaNhayCam #TreatmentSkincare",
        psychology: "Hoảng loạn vì da tổn thương → Hạ nhiệt tức thì 15 phút → Khôi phục rào cản ẩm",
      },
      {
        id: "aida",
        num: "02",
        tag: "AIDA",
        name: "Chữa lành & Tự tin",
        accentColor: "#38bdf8",
        glowColor: "rgba(56, 189, 248, 0.25)",
        activeBg: "bg-sky-500/15",
        activeBorder: "border-sky-500/40",
        hook: "Tạm biệt những ngày phải đeo khẩu trang che đi làn da mẩn đỏ — tìm lại sự trong trẻo, căng mướt mà bạn hằng ao ước.",
        body: "Được nâng niu làn da mỗi tối bằng kết cấu trong vắt như giọt sương mai. Cảm nhận sự dịu mát lan tỏa qua từng tế bào da, để mỗi sớm mai thức dậy là một ngày bạn mỉm cười trước gương khi thấy làn da căng bóng, khỏe khoắn từ gốc rễ.",
        hashtags: "#DaKhoeTuNhien #YeuThuongLanDa #SkincareRoutine #TuTinMoiNgay",
        psychology: "Tự ti vì da khuyết điểm → Trải nghiệm êm dịu → Đón nhận diện mạo rạng rỡ",
      },
      {
        id: "fab",
        num: "03",
        tag: "FAB",
        name: "Thông số lâm sàng",
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
  const toast = useToast();
  const [presetIndex, setPresetIndex] = useState(0);
  const [activeAngleIndex, setActiveAngleIndex] = useState(0);
  const [copiedPost, setCopiedPost] = useState(false);

  const currentScenario = PRESET_SCENARIOS[presetIndex];
  const activeAngle = currentScenario.angles[activeAngleIndex];
  const primaryHref = user ? "/workspace" : "/register";

  const handleCopy = async () => {
    const fullText = `${activeAngle.hook}\n\n${activeAngle.body}\n\n${activeAngle.hashtags}`;
    try {
      await navigator.clipboard.writeText(fullText);
      setCopiedPost(true);
      toast.success("Đã sao chép kịch bản vào clipboard!", {
        description: `Góc tiếp cận: ${activeAngle.name} (${activeAngle.tag}) - Sẵn sàng đăng Facebook Ads.`,
      });
      window.setTimeout(() => setCopiedPost(false), 1600);
    } catch {
      setCopiedPost(false);
      toast.error("Không thể sao chép kịch bản.");
    }
  };

  const handleSelectPreset = (idx: number) => {
    setPresetIndex(idx);
    setActiveAngleIndex(0);
    toast.info(`Đã nạp đề bài: ${PRESET_SCENARIOS[idx].name}`, {
      description: `Ngành hàng: ${PRESET_SCENARIOS[idx].niche} · 3 góc tiếp cận đã sẵn sàng.`,
    });
  };

  return (
    <section className="relative overflow-hidden pt-20 pb-24 sm:pt-28 sm:pb-32 lg:pt-36 lg:pb-40">
      {/* 1. Canvas Particles Background */}
      <Particles
        className="pointer-events-none absolute inset-0 -z-10"
        quantity={45}
        staticity={60}
        color="#00D492"
      />

      {/* 2. Deep Atmospheric Mesh & Radial Lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -z-20 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,212,146,0.18),rgba(56,189,248,0.12),transparent_70%)] blur-[70px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 -right-40 -z-20 h-[500px] w-[600px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.12),transparent_70%)] blur-[60px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-30 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_35%,#000_70%,transparent_100%)]"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ================= HERO EDITORIAL CENTER ================= */}
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          {/* Eyebrow badge (Pure Frosted Glass Pill) */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-mono font-medium tracking-wider uppercase text-emerald-400 shadow-[0_0_25px_rgba(0,212,146,0.25)] backdrop-blur-xl">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span>{"[ AI SYNTHESIS PIPELINE · "}</span>
            <MorphingText
              texts={["01. GÓC PAS", "02. GÓC AIDA", "03. GÓC FAB", "0s VĂN MẪU"]}
              className="text-emerald-300 font-mono inline-block text-[11px]"
            />
            <span>{"]"}</span>
          </div>

          {/* Kinetic Display Headline (2-3 lines max, grand typography) */}
          <h1 className="mt-6 text-balance text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.12]">
            Biến Sản Phẩm Thô Thành <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(0,212,146,0.4)]">
              3 Kịch Bản Quảng Cáo Độc Bản.
            </span>
          </h1>

          {/* Wide editorial subtitle */}
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Không còn văn mẫu AI sáo rỗng. Bóc tách một đề bài duy nhất thành 3 góc nhìn tâm lý:{" "}
            <strong className="font-semibold text-rose-400">PAS</strong> đánh trúng nỗi đau,{" "}
            <strong className="font-semibold text-sky-400">AIDA</strong> khơi gợi phong cách sống, và{" "}
            <strong className="font-semibold text-emerald-400">FAB</strong> minh bạch thông số chế tác — chuẩn 125 ký tự Hook Facebook Ads.
          </p>

          {/* Dual CTAs with Button-in-Button architecture */}
          <div className="mt-8 flex w-full flex-col items-center justify-center gap-3.5 sm:w-auto sm:flex-row">
            <MagneticButton as="div" strength={0.12}>
              <button
                type="button"
                onClick={() => router.push(primaryHref)}
                className="group relative inline-flex items-center justify-between gap-3 overflow-hidden rounded-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 py-3.5 pl-7 pr-3 text-sm font-extrabold text-black shadow-[inset_0_1px_1px_rgba(255,255,255,0.45),0_15px_35px_-5px_rgba(0,212,146,0.5)] transition-all hover:brightness-110 active:scale-[0.98] cursor-pointer"
              >
                <span>Khởi Động Studio Miễn Phí</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/15 text-black shadow-inner transition-transform duration-200 group-hover:translate-x-0.5">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </button>
            </MagneticButton>

            <a
              href="#framework"
              className="inline-flex items-center gap-2 rounded-full border border-white/[0.14] bg-white/[0.04] px-6 py-3.5 text-xs font-semibold text-slate-200 backdrop-blur-xl transition-all hover:bg-white/[0.08] hover:border-white/25 hover:text-white active:scale-[0.98]"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-emerald-400" />
              <span>Khám phá 3 góc tiếp cận ↓</span>
            </a>
          </div>

          {/* Spec Bar (Frosted Glass Telemetry Numbers) */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5 rounded-full border border-white/[0.12] bg-[#0A0D15]/80 px-5 py-2 text-xs text-slate-300 backdrop-blur-xl shadow-inner">
            <span className="flex items-center gap-1.5 font-semibold text-white">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              Chỉ số kỹ thuật:
            </span>
            <span className="rounded-md border border-white/[0.10] bg-white/[0.05] px-2 py-0.5 font-mono text-[11px] font-medium text-slate-200">
              <NumberTicker value={125} suffix=" Ký tự vàng" />
            </span>
            <span className="text-slate-600">·</span>
            <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[11px] font-medium text-emerald-400">
              <NumberTicker value={3} prefix="0" suffix=" Góc tâm lý" />
            </span>
            <span className="text-slate-600">·</span>
            <span className="rounded-md border border-sky-500/30 bg-sky-500/10 px-2 py-0.5 font-mono text-[11px] font-medium text-sky-400">
              <NumberTicker value={42} prefix="+" suffix="% CTR Facebook" />
            </span>
            <span className="text-slate-600">·</span>
            <span className="rounded-md border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 font-mono text-[11px] font-medium text-purple-300">
              0s Độ trễ
            </span>
          </div>
        </div>

        {/* ================= INTERACTIVE SYNTHESIS THEATRE (DOUBLE-BEZEL LUXURY GLASS) ================= */}
        <div id="demo" className="mt-14 w-full scroll-mt-24">
          <Tilt rotationFactor={1.5} perspective={1600} className="w-full">
            <div className="rounded-[2.25rem] p-2 sm:p-2.5 bg-gradient-to-b from-white/[0.18] via-white/[0.05] to-white/[0.01] border border-white/[0.15] shadow-[0_30px_90px_-20px_rgba(0,0,0,0.8),inset_0_1.5px_1px_rgba(255,255,255,0.25)] backdrop-blur-3xl">
              <div className="relative overflow-hidden rounded-[calc(2.25rem-0.625rem)] bg-[#0A0D15]/90 p-5 sm:p-7 border border-white/[0.08] backdrop-blur-2xl">
                <BorderBeam duration={9} colorFrom="#00D492" colorVia="#38BDF8" colorTo="#00D492" borderWidth={1.5} />

                {/* THEATRE TOP BAR: Preset switcher */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400 text-xs font-black border border-emerald-500/30">
                      <Zap className="h-3.5 w-3.5" />
                    </span>
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                      SÂN KHẤU TỔNG HỢP NỘI DUNG (LIVE STAGE)
                    </span>
                  </div>

                  {/* Preset Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
                    <span className="mr-1 text-[11px] text-slate-400 uppercase tracking-wider">
                      Đề bài mẫu:
                    </span>
                    {PRESET_SCENARIOS.map((scenario, idx) => (
                      <button
                        key={scenario.id}
                        type="button"
                        onClick={() => handleSelectPreset(idx)}
                        className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all active:scale-95 cursor-pointer ${
                          idx === presetIndex
                            ? "bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 shadow-[0_0_15px_rgba(0,212,146,0.3)] font-bold"
                            : "bg-white/[0.04] border border-white/[0.10] text-slate-300 hover:text-white hover:bg-white/[0.08]"
                        }`}
                      >
                        {String(idx + 1).padStart(2, "0")}. {scenario.name.split(" ")[0]} {scenario.name.split(" ")[1] ?? ""}
                      </button>
                    ))}
                  </div>
                </div>

                {/* THEATRE MAIN GRID: Brief (Left) -> Synthesis Pipeline (Center) -> Generated Angles (Right) */}
                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch">
                  {/* COLUMN 1: CLIENT BRIEF (4 cols - Frosted Glass Container) */}
                  <div className="flex flex-col justify-between rounded-2xl border border-white/[0.10] bg-white/[0.02] p-5 backdrop-blur-xl lg:col-span-4 shadow-inner">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10.5px] font-bold text-emerald-400 uppercase tracking-wider">
                          {currentScenario.niche}
                        </span>
                        <span className="font-mono text-[11px] text-slate-400">
                          Tông: {currentScenario.tone}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white">
                        {currentScenario.name}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-slate-300">
                        &quot;{currentScenario.rawBrief}&quot;
                      </p>
                    </div>

                    <div className="mt-5 border-t border-white/[0.08] pt-3 text-[11px] text-slate-400 font-mono flex items-center justify-between">
                      <span>Pipeline: 3 Angles Active</span>
                      <span className="text-emerald-400 font-bold">Ready in 0s</span>
                    </div>
                  </div>

                  {/* COLUMN 2: 3 LIVE GENERATED ANGLES (8 cols - High-Contrast Frosted Core) */}
                  <div className="flex flex-col rounded-2xl border border-white/[0.10] bg-[#0E121B]/95 p-5 lg:col-span-8 shadow-sm backdrop-blur-2xl">
                    {/* Angle Selector Tabs */}
                    <div className="grid grid-cols-3 gap-2 rounded-xl bg-[#07090E] p-1.5 border border-white/[0.08] relative">
                      {currentScenario.angles.map((ang, idx) => {
                        const active = idx === activeAngleIndex;
                        return (
                          <button
                            key={ang.id}
                            type="button"
                            onClick={() => setActiveAngleIndex(idx)}
                            className={`group relative rounded-xl py-2 px-2 text-center transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.97] cursor-pointer overflow-hidden ${
                              active
                                ? "bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 shadow-[0_0_20px_rgba(0,212,146,0.25),inset_0_1px_1px_rgba(255,255,255,0.2)]"
                                : "text-slate-400 hover:text-white hover:bg-white/[0.05] border border-transparent"
                            }`}
                          >
                            <span className="flex items-center justify-center gap-1 font-mono text-[11px] font-bold">
                              {active && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                              <span>{ang.num}. {ang.tag}</span>
                            </span>
                            <span className="block text-[11px] truncate opacity-90 mt-0.5 font-medium">
                              {ang.name.split("—")[1] ?? ang.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Active Angle Content Display */}
                    <div className="mt-4 flex-1 rounded-xl border border-white/[0.08] bg-[#07090E] p-4">
                      {/* Hook callout (125 characters gold hook) */}
                      <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="font-mono text-[10.5px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                            125 Ký tự Hook Facebook (Hiển thị trước &quot;Xem thêm&quot;)
                          </span>
                          <span className="font-mono text-[10.5px] text-emerald-400 font-semibold">
                            {activeAngle.hook.length} chars
                          </span>
                        </div>
                        <p className="text-sm font-bold text-white leading-snug">
                          {activeAngle.hook}
                        </p>
                      </div>

                      {/* Body copy */}
                      <div className="mt-3">
                        <p className="text-xs leading-relaxed text-slate-200">
                          {activeAngle.body}
                        </p>
                        <p className="mt-2 font-mono text-[11px] text-emerald-400 font-medium">
                          {activeAngle.hashtags}
                        </p>
                      </div>

                      {/* Psychology insight */}
                      <div className="mt-3 border-t border-white/[0.08] pt-2.5 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                        <span className="text-slate-400">
                          <strong className="text-white">Tâm lý:</strong> {activeAngle.psychology}
                        </span>

                        <button
                          type="button"
                          onClick={handleCopy}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/25 transition-all active:scale-95 cursor-pointer shadow-xs"
                        >
                          {copiedPost ? (
                            <>
                              <Check className="h-3 w-3" />
                              <span>Đã sao chép</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              <span>Sao chép kịch bản</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* THEATRE FOOTER SPECS */}
                <div className="mt-5 border-t border-white/[0.08] pt-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      100% Anti-AI-Slop Engine
                    </span>
                    <span>·</span>
                    <span>Facebook Mobile Ready</span>
                    <span>·</span>
                    <span>Instagram Feed Ready</span>
                  </div>

                  <Link
                    href={primaryHref}
                    className="inline-flex items-center gap-1 font-bold text-emerald-400 hover:underline"
                  >
                    <span>Mở kịch bản trong Studio</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </Tilt>
        </div>
      </div>
    </section>
  );
}
