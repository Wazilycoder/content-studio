"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { forgotPassword, getMathCaptcha, login, signup } from "@/app/auth/actions";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Check,
  CheckCircle2,
  ChevronRight,
  Copy,
  Eye,
  EyeOff,
  Globe,
  Heart,
  Loader2,
  Lock,
  Mail,
  MessageCircle,
  MoreHorizontal,
  RefreshCw,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  ThumbsUp,
  Zap,
  X,
} from "lucide-react";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { useToast } from "@/components/ui/SonnerToast";
import { NumberTicker } from "@/components/ui/NumberTicker";
import { BorderBeam } from "@/components/ui/BorderBeam";
import { AnimatedBeam } from "@/components/ui/AnimatedBeam";
import { copyToClipboard } from "@/lib/utils/clipboard";

interface AuthPageProps {
  initialMode?: "login" | "signup";
}

type Platform = "facebook" | "instagram";

interface CommentItem {
  id: string;
  author: string;
  avatarBg: string;
  avatarInitials: string;
  badge?: string;
  badgeType?: "buyer" | "topfan" | "agency";
  text: string;
  time: string;
  likes: number;
  isLiked: boolean;
  reply?: {
    author: string;
    isAuthor: boolean;
    text: string;
    time: string;
  };
}

const SHOWCASE_ANGLES = [
  {
    tag: "PAS",
    angleName: "01. PAS",
    angleDesc: "Vấn đề & Lối thoát",
    productName: "Serum Vitamin C Tinh Khiết 15%",
    brandName: "Lumina Skin Lab",
    subHeadline: "#1 Bán Chạy — Da Sáng Mờ Thâm Sau 14 Ngày",
    hook125:
      "Da bạn xỉn màu vì thức khuya? Đừng để làn da tố cáo tuổi tác khi bạn hoàn toàn có thể sở hữu làn da căng bóng...",
    fullText:
      "Da bạn xỉn màu vì thức khuya? Đừng để làn da tố cáo tuổi tác khi bạn hoàn toàn có thể sở hữu làn da căng bóng, rạng rỡ chỉ sau 14 ngày với Serum Vitamin C nguyên chất thế hệ mới. Công thức thẩm thấu sâu, mờ thâm nám và phục hồi hàng rào ẩm tự nhiên.",
    hashtags: ["#SerumVitaminC", "#TrangDaMoTham", "#ChamSocDa", "#LamDepTuNhien"],
    ctaLabel: "Nhận ưu đãi 35%",
    domain: "LUMINA-SKINLAB.VN",
    linkTitle: "Serum Vitamin C Nguyên Chất 15% - Mua 1 Tặng 1 Mini",
    linkSubtext: "Ưu đãi chỉ áp dụng cho 100 khách hàng đầu tiên trong hôm nay.",
    accentColor: "#F43F5E",
    badgeColor: "border-rose-500/30 bg-rose-500/10 text-rose-400",
    discountTag: "GIẢM 35% HÔM NAY · MUA 1 TẶNG 1",
    rating: "4.9",
    reviewsCount: "1.824",
    productSpecs: ["Nồng độ 15% Vit C", "HA Phân Tử Siêu Nhỏ", "Thẩm Thấu 3s"],
    visualType: "cosmetics",
  },
  {
    tag: "AIDA",
    angleName: "02. AIDA",
    angleDesc: "Cảm xúc & Phong cách",
    productName: "Áo Sơ Mi Lụa Tơ Tằm Bảo Lộc",
    brandName: "Maison De Soie",
    subHeadline: "Phong Thái Tự Tin — Khí Chất Nữ Doanh Nhân",
    hook125:
      "6 giờ sáng, bạn xứng đáng bước ra đường với diện mạo tự tin như vừa rời spa. Từng thớ lụa dệt tay Bảo Lộc...",
    fullText:
      "6 giờ sáng, bạn xứng đáng bước ra đường với diện mạo tự tin như vừa rời spa. Từng thớ lụa dệt tay Bảo Lộc nâng niu làn da, mát dịu 2-3°C suốt 8 tiếng công sở. Người bạn đồng hành thầm lặng của phụ nữ hiện đại, giúp bạn tỏa sáng trong mọi buổi họp quan trọng.",
    hashtags: ["#QuietLuxury", "#AoSoMiLua", "#PhuNuHienDai", "#ThoiTrangCongSo"],
    ctaLabel: "Xem bộ sưu tập",
    domain: "MAISONDESOIE.VN",
    linkTitle: "Áo Sơ Mi Lụa Tơ Tằm Bảo Lộc - Khí Chất Doanh Nhân",
    linkSubtext: "Bộ sưu tập giới hạn xuân hè 2026. Miễn phí đổi trả 15 ngày.",
    accentColor: "#38BDF8",
    badgeColor: "border-sky-500/30 bg-sky-500/10 text-sky-400",
    discountTag: "BỘ SƯU TẬP MỚI · 100% LỤA THỦ CÔNG",
    rating: "5.0",
    reviewsCount: "940",
    productSpecs: ["100% Tơ Tằm Thủ Công", "Không Nhăn Tự Nhiên", "Hạ Nhiệt 2-3°C"],
    visualType: "fashion",
  },
  {
    tag: "FAB",
    angleName: "03. FAB",
    angleDesc: "Thông số & Chế tác",
    productName: "Đệm Công Thái Học Gel Mát LumbarPro",
    brandName: "ErgoStudio Tech",
    subHeadline: "Phân Tán 78% Áp Lực — Chấm Dứt Đau Cổ Vai Gáy",
    hook125:
      "Cứ mỗi chiều tan làm, lưng lại ê ẩm vì ngồi sai tư thế 8 tiếng? Đệm Gel tổ ong y tế phân tán 78% áp lực...",
    fullText:
      "Cứ mỗi chiều tan làm, lưng lại ê ẩm vì ngồi sai tư thế 8 tiếng? Đệm Gel tổ ong y tế phân tán 78% áp lực thắt lưng, giữ cột sống thẳng tự nhiên. Bề mặt vải 3D Cooling thoáng khí tối đa, không tích nhiệt. Cam kết giảm đau mỏi sau 7 ngày hoặc hoàn tiền 100%.",
    hashtags: ["#DemCongThaiHoc", "#GheCongThaiHoc", "#GiamDauLung", "#DanVanPhong"],
    ctaLabel: "Đặt thử 7 ngày",
    domain: "ERGOSTUDIO.VN",
    linkTitle: "Đệm Công Thái Học Gel Mát LumbarPro - Hết Đau Lưng",
    linkSubtext: "Cam kết giảm đau lưng sau 7 ngày hoặc hoàn tiền 100%.",
    accentColor: "#00D492",
    badgeColor: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    discountTag: "BẢO HÀNH 5 NĂM · THỬ 7 NGÀY TẠI NHÀ",
    rating: "4.9",
    reviewsCount: "2.410",
    productSpecs: ["Gel Polymer Y Tế", "Thiết Kế W-Curved", "Vải Thoáng 3D"],
    visualType: "ergonomic",
  },
] as const;

const EMAIL_PLACEHOLDER_WORDS = [
  "chushop@gmail.com",
  "giamkhao@vibecoding.vn",
  "founder.agency@ai.vn",
  "marketing.lead@gmail.com",
];

export default function AuthPage({ initialMode = "login" }: AuthPageProps) {
  const sonnerToast = useToast();
  const [isLogin, setIsLogin] = useState(initialMode === "login");
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);

  // Form states with real-time reactive feedback
  const [emailVal, setEmailVal] = useState("");
  const [passwordVal, setPasswordVal] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Captcha states
  const [captchaQuestion, setCaptchaQuestion] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "error" | "success"; message: string } | null>(null);

  // Showcase states
  const [platform, setPlatform] = useState<Platform>("facebook");
  const [showcaseAngle, setShowcaseAngle] = useState(0);
  const [showcaseExpanded, setShowcaseExpanded] = useState(false);
  const [copiedShowcase, setCopiedShowcase] = useState(false);

  // Social interactions state for Facebook/Instagram
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(1824);
  const [showComments, setShowComments] = useState(false);
  const [commentsList, setCommentsList] = useState<CommentItem[]>([
    {
      id: "c1",
      author: "Hà My Nguyễn",
      avatarBg: "from-purple-500 to-pink-500",
      avatarInitials: "HM",
      badge: "Đã mua hàng ⭐⭐⭐⭐⭐",
      badgeType: "buyer" as const,
      text: "Shop tư vấn mẫu này giúp mình với ạ, da nhạy cảm dùng được không?",
      time: "5 phút trước",
      likes: 12,
      isLiked: false,
      reply: {
        author: "Lumina Skin Lab",
        isAuthor: true,
        text: "Dạ chào bạn, Serum 15% Vit C đã kiểm nghiệm an toàn cho da nhạy cảm ạ! Shop có gửi kèm quà tặng mini trải nghiệm trong inbox bạn nhé ❤️",
        time: "3 phút trước",
      },
    },
    {
      id: "c2",
      author: "Trần Bảo Long",
      avatarBg: "from-sky-500 to-cyan-400",
      avatarInitials: "TL",
      badge: "Top Fan 🏆",
      badgeType: "topfan" as const,
      text: "Đã chốt đơn góc 01 PAS, hook 125 ký tự đọc cuốn thực sự!",
      time: "12 phút trước",
      likes: 8,
      isLiked: false,
    },
    {
      id: "c3",
      author: "Hoàng Minh Trí",
      avatarBg: "from-amber-500 to-emerald-400",
      avatarInitials: "MT",
      badge: "Agency Lead",
      badgeType: "agency" as const,
      text: "Kịch bản test thử chạy ads Facebook CTR tăng đột biến từ 1.2% lên 3.8% luôn!",
      time: "25 phút trước",
      likes: 19,
      isLiked: true,
    },
  ]);
  const [commentInput, setCommentInput] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const totalCommentsCount = 23 + commentsList.length;

  // Silky Motion & Tactile States (Emil Kowalski & Apple Standard)
  const [mounted, setMounted] = useState(false);
  const [isAngleChanging, setIsAngleChanging] = useState(false);
  const [likePopping, setLikePopping] = useState(false);
  const [floatingLike, setFloatingLike] = useState(false);
  const [showReactionDock, setShowReactionDock] = useState(false);
  const [activeReactionEmoji, setActiveReactionEmoji] = useState("👍");
  const [showDoubleTapHeart, setShowDoubleTapHeart] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [remember1h, setRemember1h] = useState(true);
  const [isInteractingAuth, setIsInteractingAuth] = useState(false);

  // Typewriter animation effect cho email placeholder
  const [typedPlaceholder, setTypedPlaceholder] = useState("");

  useEffect(() => {
    if (emailVal) {
      setTypedPlaceholder("");
      return;
    }
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    const type = () => {
      const currentWord = EMAIL_PLACEHOLDER_WORDS[wordIndex] ?? "";
      if (isDeleting) {
        charIndex--;
        setTypedPlaceholder(currentWord.slice(0, charIndex));
        if (charIndex <= 0) {
          isDeleting = false;
          wordIndex = (wordIndex + 1) % EMAIL_PLACEHOLDER_WORDS.length;
          timeoutId = setTimeout(type, 400);
          return;
        }
        timeoutId = setTimeout(type, 35);
      } else {
        charIndex++;
        setTypedPlaceholder(currentWord.slice(0, charIndex));
        if (charIndex >= currentWord.length) {
          isDeleting = true;
          timeoutId = setTimeout(type, 1800);
          return;
        }
        timeoutId = setTimeout(type, 70);
      }
    };

    timeoutId = setTimeout(type, 600);
    return () => clearTimeout(timeoutId);
  }, [emailVal]);

  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem("cs_remember_email");
      if (savedEmail) {
        setEmailVal(savedEmail);
      }
    } catch {
      // ignore
    }
  }, []);

  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const containerStageRef = useRef<HTMLDivElement | null>(null);
  const authGatewayNodeRef = useRef<HTMLDivElement | null>(null);
  const liveShowcaseNodeRef = useRef<HTMLDivElement | null>(null);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);
  const passwordStrength =
    passwordVal.length === 0
      ? 0
      : passwordVal.length < 6
      ? 1
      : passwordVal.length < 10
      ? 2
      : 3;

  const refreshCaptcha = useCallback(async () => {
    setCaptchaLoading(true);
    try {
      const captcha = await getMathCaptcha();
      setCaptchaQuestion(captcha.question);
      setCaptchaToken(captcha.token);
    } catch {
      setCaptchaQuestion("12 - 5 = ?");
    } finally {
      setCaptchaLoading(false);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (initialMode === "signup") {
      emailInputRef.current?.focus();
    }
  }, [initialMode]);

  useEffect(() => {
    void refreshCaptcha();
  }, [refreshCaptcha]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 6000);
    return () => clearTimeout(timer);
  }, [toast]);

  async function handleSubmit(formData: FormData) {
    if (!isLogin && !termsAccepted) {
      setToast({ type: "error", message: "Vui lòng đọc và đồng ý với Điều khoản dịch vụ và Chính sách bảo mật." });
      sonnerToast.error("Chưa đồng ý điều khoản", { description: "Vui lòng chọn chấp nhận Điều khoản dịch vụ để tiếp tục." });
      return;
    }
    if (remember1h && emailVal) {
      try {
        localStorage.setItem("cs_remember_email", emailVal);
      } catch {}
    } else {
      try {
        localStorage.removeItem("cs_remember_email");
      } catch {}
    }
    setToast(null);
    setLoading(true);

    try {
      const result = isLogin ? await login(formData) : await signup(formData);
      if (result?.error) {
        setToast({ type: "error", message: result.error });
        sonnerToast.error("Xác thực thất bại", { description: result.error });
        void refreshCaptcha();
      } else if (result?.success && result?.message) {
        setToast({ type: "success", message: result.message });
        sonnerToast.success(isLogin ? "Đăng nhập thành công" : "Khởi tạo thành công", { description: result.message });
      }
    } catch {
      // redirect() throws an internal NEXT_REDIRECT error which is expected
    } finally {
      setLoading(false);
    }
  }

  async function handleForgot(formData: FormData) {
    setToast(null);
    setLoading(true);
    try {
      const email = (formData.get("email") as string) || "";
      const result = await forgotPassword(email);
      if (result?.error) {
        setToast({ type: "error", message: result.error });
        sonnerToast.error("Khôi phục thất bại", { description: result.error });
      } else if (result?.success) {
        const msg = result.message ?? "Yêu cầu khôi phục đã được gửi.";
        setToast({
          type: "success",
          message: msg,
        });
        sonnerToast.success("Đã gửi email khôi phục", { description: msg });
        setForgotMode(false);
      }
    } catch {
      setToast({ type: "error", message: "Không thể gửi yêu cầu. Vui lòng thử lại." });
      sonnerToast.error("Lỗi hệ thống", { description: "Không thể gửi yêu cầu khôi phục. Vui lòng thử lại sau." });
    } finally {
      setLoading(false);
    }
  }

  const handleCopyShowcaseText = async () => {
    const textToCopy = SHOWCASE_ANGLES[showcaseAngle].fullText;
    const ok = await copyToClipboard(textToCopy);
    if (ok) {
      setCopiedShowcase(true);
      sonnerToast.success("Đã sao chép kịch bản mẫu", {
        description: `Đã lưu kịch bản góc ${SHOWCASE_ANGLES[showcaseAngle].tag} vào bộ nhớ tạm.`,
      });
      setTimeout(() => setCopiedShowcase(false), 2000);
    }
  };

  const handleSwitchAngle = (index: number) => {
    if (index === showcaseAngle || isAngleChanging) return;
    setIsAngleChanging(true);
    setTimeout(() => {
      setShowcaseAngle(index);
      setShowcaseExpanded(false);
      setIsAngleChanging(false);
    }, 160);
  };

  const handleToggleLike = (emoji = "👍") => {
    setActiveReactionEmoji(emoji);
    if (isLiked && emoji === activeReactionEmoji) {
      setIsLiked(false);
      setLikeCount((prev) => prev - 1);
    } else {
      setIsLiked(true);
      setLikePopping(true);
      setFloatingLike(true);
      if (!isLiked) setLikeCount((prev) => prev + 1);
      sonnerToast.info(`Đã bày tỏ cảm xúc: ${emoji}`, {
        description: "Tương tác thực tế với Facebook Mobile Ad.",
      });
      setTimeout(() => setLikePopping(false), 380);
      setTimeout(() => setFloatingLike(false), 750);
    }
  };

  const handleDoubleTapCreative = () => {
    setShowDoubleTapHeart(true);
    if (!isLiked) {
      setIsLiked(true);
      setLikeCount((prev) => prev + 1);
    }
    setTimeout(() => setShowDoubleTapHeart(false), 650);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    const authorName = emailVal ? emailVal.split("@")[0] : "Bạn (Khách hàng)";
    const initials = authorName.slice(0, 2).toUpperCase();
    const newComment: CommentItem = {
      id: "c-" + Date.now(),
      author: authorName,
      avatarBg: "from-emerald-400 to-teal-500",
      avatarInitials: initials,
      badge: "Vừa gửi ⚡",
      badgeType: "buyer",
      text: commentInput.trim(),
      time: "Vừa xong",
      likes: 0,
      isLiked: false,
    };
    setCommentsList((prev) => [newComment, ...prev]);
    setCommentInput("");
    sonnerToast.success("Đã gửi bình luận mẫu!", {
      description: "Bình luận đã được đồng bộ vào giao diện mạng xã hội.",
    });
  };

  const handleToggleCommentLike = (id: string) => {
    setCommentsList((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            isLiked: !c.isLiked,
            likes: c.isLiked ? c.likes - 1 : c.likes + 1,
          };
        }
        return c;
      })
    );
  };

  const activeAngle = SHOWCASE_ANGLES[showcaseAngle];
  const igHandle =
    showcaseAngle === 0
      ? "lumina.skinlab"
      : showcaseAngle === 1
      ? "maisondesoie.paris"
      : "ergostudio.official";

  const renderCreativeBody = (withFbLinkStrip: boolean) => (
    <div className="px-2 pb-2">
      <div
        onDoubleClick={handleDoubleTapCreative}
        title="Nhấp đúp (Double-tap) để thả tim bài viết"
        className="relative aspect-[16/7.5] w-full overflow-hidden rounded-lg border border-[#1E2333] bg-gradient-to-br from-[#0B0F19] via-[#121A28] to-[#0A0E17] p-2.5 flex flex-col justify-between shadow-inner cursor-pointer select-none group/creative"
      >
        {/* Double tap heart overlay */}
        {showDoubleTapHeart && (
          <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
            <Heart className="h-16 w-16 fill-rose-500 text-rose-500 animate-heart-pop drop-shadow-[0_0_35px_rgba(244,63,94,0.95)]" />
          </div>
        )}

        {/* Ambient Radial Spotlight */}
        <div
          className="pointer-events-none absolute -right-8 -top-8 h-48 w-48 rounded-full blur-3xl opacity-30 transition-colors duration-500"
          style={{ backgroundColor: activeAngle.accentColor }}
        />

        {/* Top Creative Tag & CTR Benchmark Pill */}
        <div className="relative z-10 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/60 px-2 py-0.5 font-mono text-[8.5px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: activeAngle.accentColor }} />
            {activeAngle.tag} STRATEGY · VERIFIED
          </span>
          <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[8.5px] font-bold text-emerald-300 font-mono">
            ⚡ CTR +42% BENCHMARK
          </span>
        </div>

        {/* Middle: Split Layout (Product Graphic Simulation + Offer Specs) */}
        <div className="relative z-10 grid grid-cols-12 items-center gap-3 my-auto">
          {/* Left Column: Product Visual Render */}
          <div className="col-span-4 flex items-center justify-center">
            {activeAngle.visualType === "cosmetics" && (
              <div className="relative flex flex-col items-center">
                <div className="h-2.5 w-3 rounded-t-full bg-slate-200 border border-slate-400" />
                <div className="h-1.5 w-4 bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 rounded-sm shadow-xs" />
                <div className="relative h-16 w-10 rounded-b-xl border border-amber-400/40 bg-gradient-to-b from-amber-500/30 via-amber-600/50 to-amber-950/80 p-1 flex flex-col justify-between items-center shadow-[0_0_20px_rgba(245,158,11,0.35)]">
                  <div className="absolute left-1 top-1 bottom-1 w-1 bg-gradient-to-b from-white/60 to-transparent rounded-full opacity-70" />
                  <span className="font-mono text-[7px] font-black text-amber-200 tracking-tighter mt-1">15% C</span>
                  <div className="h-1 w-6 rounded-full bg-amber-400/80 mb-1" />
                </div>
                <span className="mt-1 font-mono text-[7.5px] text-amber-300 font-bold bg-amber-500/20 px-1 rounded border border-amber-500/30">
                  PURE VIT-C
                </span>
              </div>
            )}

            {activeAngle.visualType === "fashion" && (
              <div className="relative flex flex-col items-center">
                <div className="relative h-18 w-14 rounded-xl border border-sky-400/40 bg-gradient-to-tr from-sky-950/90 via-sky-800/40 to-slate-900/90 p-1.5 flex flex-col justify-between items-center shadow-[0_0_20px_rgba(56,189,248,0.35)]">
                  <div className="w-6 h-3 border-b-2 border-sky-300/80 rounded-b-full" />
                  <div className="space-y-1 w-full px-1">
                    <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                    <div className="h-0.5 w-3/4 mx-auto bg-gradient-to-r from-transparent via-sky-300/40 to-transparent" />
                  </div>
                  <div className="flex gap-1 mb-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-white shadow-xs" />
                    <span className="h-1.5 w-1.5 rounded-full bg-white shadow-xs" />
                  </div>
                </div>
                <span className="mt-1 font-mono text-[7.5px] text-sky-300 font-bold bg-sky-500/20 px-1 rounded border border-sky-500/30">
                  BẢO LỘC SILK
                </span>
              </div>
            )}

            {activeAngle.visualType === "ergonomic" && (
              <div className="relative flex flex-col items-center">
                <div className="relative h-18 w-14 rounded-xl border border-emerald-400/40 bg-gradient-to-b from-emerald-950/90 via-emerald-800/40 to-slate-950/90 p-1 flex flex-col justify-between items-center shadow-[0_0_20px_rgba(0,212,146,0.35)]">
                  <div className="mt-1 flex items-center justify-center w-full">
                    <div className="h-2 w-8 border-b-2 border-emerald-400 rounded-full" />
                  </div>
                  <div className="grid grid-cols-3 gap-0.5 w-full px-1 py-1">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="h-2 rounded-xs border border-emerald-400/60 bg-emerald-500/20" />
                    ))}
                  </div>
                  <span className="font-mono text-[6.5px] text-emerald-200 font-black">78% RELIEF</span>
                </div>
                <span className="mt-1 font-mono text-[7.5px] text-emerald-300 font-bold bg-emerald-500/20 px-1 rounded border border-emerald-500/30">
                  MEDICAL GEL
                </span>
              </div>
            )}
          </div>

          {/* Right Column: High-Conversion Headline, Rating, USPs */}
          <div className="col-span-8 pl-1">
            <div className="mb-1">
              <span className="inline-block rounded bg-red-600/80 px-1.5 py-0.5 text-[8.5px] font-black uppercase tracking-wider text-white shadow-xs">
                {activeAngle.discountTag}
              </span>
            </div>

            <p className="text-xs sm:text-sm font-black tracking-tight text-white leading-tight">
              {activeAngle.productName}
            </p>
            <p className="text-[10px] font-semibold text-emerald-400 mt-0.5">
              {activeAngle.subHeadline}
            </p>

            <div className="mt-1 flex items-center gap-1.5 text-[9.5px]">
              <div className="flex items-center text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-bold text-white font-mono">{activeAngle.rating}/5</span>
              <span className="text-slate-400 text-[8.5px]">({activeAngle.reviewsCount} đánh giá)</span>
            </div>

            <div className="mt-1.5 flex flex-wrap gap-1">
              {activeAngle.productSpecs.map((spec) => (
                <span
                  key={spec}
                  className="inline-flex items-center gap-1 rounded bg-[#0E121B] border border-[#1E2333] px-1.5 py-0.5 text-[8.5px] text-slate-300 font-mono"
                >
                  <span className="h-1 w-1 rounded-full bg-emerald-400" />
                  <span>{spec}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Facebook Ad Link Strip (Only for Facebook) */}
        {withFbLinkStrip && (
          <div className="relative z-10 flex items-center justify-between border-t border-[#1E2333] pt-2 bg-[#0E121B] -mx-3 -mb-3 px-3 py-2.5">
            <div className="truncate pr-2">
              <span className="font-mono text-[8px] uppercase tracking-wider text-slate-400">
                {activeAngle.domain}
              </span>
              <p className="truncate text-[10.5px] font-bold text-white">
                {activeAngle.linkTitle}
              </p>
              <p className="truncate text-[9px] text-slate-400">
                {activeAngle.linkSubtext}
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                sonnerToast.success(`Đã nhấn CTA: ${activeAngle.ctaLabel}`, {
                  description: "Mô phỏng khách hàng click vào trang đích chuyển đổi của bạn.",
                })
              }
              className="shrink-0 rounded-lg bg-emerald-500 hover:bg-emerald-400 active:scale-95 px-3 py-1.5 text-[10px] font-bold text-black transition-all shadow-sm cursor-pointer"
            >
              {activeAngle.ctaLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen lg:h-screen lg:overflow-hidden flex flex-col justify-between bg-[#06080D] text-[#F3F4F6] selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Precision Micro-Grid & Ambient Mesh */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      <div className="pointer-events-none fixed top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-emerald-500/[0.08] blur-[140px]" />
      <div className="pointer-events-none fixed bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-cyan-500/[0.06] blur-[140px]" />

      {/* Embedded Silky Physics CSS Animations (Apple & Emil Kowalski Standard) */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes like-bounce {
          0% { transform: scale(1); }
          35% { transform: scale(1.38) rotate(-10deg); }
          65% { transform: scale(0.92) rotate(4deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        @keyframes float-up-fade {
          0% { opacity: 1; transform: translate(-50%, 0) scale(0.85); }
          50% { opacity: 1; transform: translate(-50%, -18px) scale(1.15); }
          100% { opacity: 0; transform: translate(-50%, -34px) scale(1); }
        }
        @keyframes heart-pop {
          0% { transform: scale(0); opacity: 0; }
          45% { transform: scale(1.35); opacity: 0.95; }
          75% { transform: scale(0.95); opacity: 0.85; }
          100% { transform: scale(1.1); opacity: 0; }
        }
        @keyframes scale-dock-reveal {
          0% { opacity: 0; transform: translateY(8px) scale(0.92); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes slide-down-fade {
          0% { opacity: 0; transform: translateY(-8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-like-bounce {
          animation: like-bounce 360ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-float-up {
          animation: float-up-fade 700ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-heart-pop {
          animation: heart-pop 650ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-dock-reveal {
          animation: scale-dock-reveal 200ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-slide-down-fade {
          animation: slide-down-fade 250ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(10, 13, 21, 0.35);
          border-radius: 9999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.12);
          border-radius: 9999px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.5);
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.4);
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.15) transparent;
        }
      `}} />

      {/* ===== 1. OBSIDIAN LINEAR HEADER ===== */}
      <header className="shrink-0 sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#06080D]/90 backdrop-blur-xl px-4 py-2.5 shadow-sm sm:px-8">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
          <Link href="/" className="group inline-flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 via-teal-300 to-sky-400 text-black font-black text-xs shadow-md shadow-emerald-500/25 transition-transform duration-200 group-hover:scale-105">
              CS
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-extrabold tracking-tight text-white leading-none">
                Content Studio
              </span>
              <span className="font-mono text-[8.5px] uppercase tracking-wider text-slate-400 mt-0.5">
                Obsidian Auth Gateway
              </span>
            </div>
            <span className="hidden rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[9.5px] font-bold text-emerald-400 sm:inline-block font-mono">
              v3.2 Production
            </span>
          </Link>

          <div className="flex items-center gap-2.5">
            {/* Live Synapse Conduit Pill */}
            <div className="hidden lg:inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-mono font-bold text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.25)] backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isInteractingAuth ? "bg-emerald-300" : "bg-emerald-400"} opacity-75`}></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>SYNAPSE: 0ms DUAL-STREAM</span>
            </div>

            <div className="hidden items-center gap-2 rounded-lg border border-white/[0.08] bg-[#0A0D15]/80 px-3 py-1 text-[11px] font-medium text-slate-300 md:inline-flex font-mono backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>TLS 1.3 · Supabase RLS Guard</span>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.1] bg-[#0A0D15]/80 px-3 py-1 text-xs font-semibold text-slate-200 transition-colors hover:border-white/20 hover:text-white active:scale-[0.98] backdrop-blur-md"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Trang chủ</span>
            </Link>

            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* ===== 2. SYNTHESIZER ATELIER (2-COLUMN BALANCED STAGE) ===== */}
      <main
        ref={containerStageRef}
        className="relative z-10 mx-auto w-full max-w-7xl px-4 py-3 sm:px-6 lg:px-8 flex-1 min-h-0 lg:h-[calc(100vh-6.5rem)] lg:overflow-hidden flex flex-col"
      >
        {/* Animated Beam Visual Bridge: Connects Gateway Node to Showcase Node */}
        <AnimatedBeam
          containerRef={containerStageRef}
          fromRef={authGatewayNodeRef}
          toRef={liveShowcaseNodeRef}
          duration={3.2}
          curvature={-25}
          pathColor="rgba(30, 35, 51, 0.8)"
          gradientStartColor="#00D492"
          gradientStopColor={platform === "facebook" ? "#1877F2" : "#E1306C"}
          className="hidden lg:block z-0 pointer-events-none"
        />

        <div className="grid w-full grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8 lg:h-full lg:overflow-hidden relative z-10 flex-1 min-h-0">
          
          {/* ================= COLUMN A: HIGH-CRAFT AUTH GATEWAY (5 COLS) ================= */}
          <div
            className="w-full lg:col-span-5 lg:h-full lg:overflow-y-auto lg:pr-2 lg:pb-6 custom-scrollbar"
            onFocus={() => setIsInteractingAuth(true)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) {
                setIsInteractingAuth(false);
              }
            }}
          >
            <div
              ref={authGatewayNodeRef}
              className={`relative rounded-[2rem] border bg-[#0A0D15]/85 p-6 sm:p-7 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.18)] backdrop-blur-2xl transition-all duration-300 ${
                isInteractingAuth
                  ? "border-emerald-500/40 shadow-[0_0_35px_rgba(16,185,129,0.15)]"
                  : "border-white/[0.12]"
              }`}
            >
              {/* Emitter Socket Node on Right Edge */}
              <div className="hidden lg:flex absolute -right-3.5 top-28 z-20 items-center">
                <span className={`relative flex h-7 w-7 items-center justify-center rounded-full border bg-[#060A12] shadow-md transition-all duration-300 ${
                  isInteractingAuth
                    ? "border-emerald-400 bg-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.6)] scale-110"
                    : "border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.25)]"
                }`}>
                  <Zap className={`h-3.5 w-3.5 ${isInteractingAuth ? "text-emerald-300 animate-bounce" : "text-emerald-400"}`} />
                </span>
              </div>
              {/* Gateway Chip & Title */}
              <div className="mb-4">
                <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
                  <Sparkles className="h-3 w-3" />
                  <span>Secure Gateway · 0s Handshake</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight">
                  {forgotMode ? "Khôi phục mật khẩu" : isLogin ? "Chào mừng trở lại" : "Khởi tạo tài khoản"}
                </h1>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">
                  {forgotMode
                    ? "Nhập email của bạn để nhận liên kết đặt lại mật khẩu an toàn."
                    : "Không gian kiến tạo 3 góc kịch bản chuyển đổi cao chuẩn Facebook & Instagram Ads."}
                </p>
              </div>

                {/* In-form Notification Toast */}
                {toast && (
                  <div
                    className={`mb-3 flex items-start gap-2 rounded-xl border p-2.5 text-xs leading-relaxed ${
                      toast.type === "error"
                        ? "border-red-500/30 bg-red-500/10 text-red-300"
                        : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                    }`}
                  >
                    {toast.type === "error" ? (
                      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    ) : (
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    )}
                    <span className="flex-1 font-medium">{toast.message}</span>
                    <button
                      type="button"
                      onClick={() => setToast(null)}
                      aria-label="Đóng"
                      className="shrink-0 opacity-60 hover:opacity-100"
                    >
                      ✕
                    </button>
                  </div>
                )}

                {forgotMode ? (
                  <form action={handleForgot} className="space-y-3">
                    <div>
                      <label
                        htmlFor="forgot-email"
                        className="mb-1 block text-xs font-semibold text-slate-300"
                      >
                        Email nhận liên kết
                      </label>
                      <div className="relative">
                        <input
                          id="forgot-email"
                          name="email"
                          type="email"
                          required
                          autoComplete="email"
                          placeholder="chushop@gmail.com"
                          className="w-full rounded-xl border border-[#1E2333] bg-[#07090E] py-2 pl-9 pr-3 text-xs text-slate-100 placeholder-slate-500 transition-colors focus:border-emerald-500/70 focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
                        />
                        <Mail className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                      </div>
                      <p className="mt-1 text-[10.5px] text-slate-500 font-mono">
                        Hệ thống sẽ gửi email xác nhận trong 30 giây.
                      </p>
                    </div>

                    <div className="w-full pt-1">
                      <button
                        type="submit"
                        disabled={loading}
                        className="group flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-black transition-all hover:bg-emerald-400 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-sm cursor-pointer"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-black" />
                            <span>Đang gửi yêu cầu...</span>
                          </>
                        ) : (
                          <>
                            <Mail className="h-3.5 w-3.5" />
                            <span>Gửi liên kết khôi phục</span>
                          </>
                        )}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setForgotMode(false);
                        setToast(null);
                      }}
                      className="inline-flex w-full items-center justify-center gap-1.5 pt-1 text-xs font-semibold text-slate-400 transition-colors hover:text-white"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      <span>Quay lại đăng nhập</span>
                    </button>
                  </form>
                ) : (
                  <>
                    {/* VIP Giám Khảo Quick-Access Header Banner */}
                    <div className="mb-3.5 rounded-xl border border-emerald-500/40 bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-transparent p-2.5 shadow-md shadow-emerald-500/10">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            <Zap className="h-3.5 w-3.5" />
                          </span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[12px] font-bold text-white truncate">Dành cho Giám khảo Cuộc thi</span>
                              <span className="rounded bg-emerald-400/20 border border-emerald-400/30 px-1 py-0.2 font-mono text-[9px] font-bold text-emerald-300">
                                1-CLICK
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-300 truncate">
                              Vào thẳng Studio trải nghiệm, không cần mật khẩu
                            </p>
                          </div>
                        </div>
                        <Link
                          href="/workspace"
                          className="shrink-0 inline-flex items-center gap-1 rounded-lg bg-emerald-500 px-3 py-1.5 text-[11px] font-bold text-black shadow-md hover:bg-emerald-400 active:scale-95 transition-all"
                        >
                          <span>Vào ngay</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>

                    {/* Fluid Segmented Control (Obsidian Tab Rail) */}
                    <div className="relative mb-3 flex rounded-lg bg-[#07090E] p-1 border border-[#1E2333]">
                      <span
                        aria-hidden
                        className={`absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-md bg-[#0E121B] border border-[#1E2333] transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                          isLogin ? "translate-x-0" : "translate-x-full"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setIsLogin(true);
                          setToast(null);
                        }}
                        className={`relative z-10 flex-1 rounded-md py-1.5 text-xs font-bold transition-colors ${
                          isLogin ? "text-emerald-400 font-extrabold" : "text-slate-400 hover:text-white"
                        }`}
                      >
                        Đăng nhập
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsLogin(false);
                          setToast(null);
                        }}
                        className={`relative z-10 flex-1 rounded-md py-1.5 text-xs font-bold transition-colors ${
                          !isLogin ? "text-emerald-400 font-extrabold" : "text-slate-400 hover:text-white"
                        }`}
                      >
                        Đăng ký mới
                      </button>
                    </div>

                    {!isLogin && (
                      <div className="mb-2.5 flex items-start gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2 text-[11px] text-emerald-300 leading-snug">
                        <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-emerald-400" />
                        <span>
                          <strong className="text-white">Free Tier:</strong> Tạo bài viết không giới hạn trọn đời (Cooldown 45s bảo vệ tài nguyên).
                        </span>
                      </div>
                    )}

                    <form action={handleSubmit} className="space-y-2.5">
                      {/* Reactive Email Input with Realtime Checkmark */}
                      <div>
                        <div className="mb-1 flex items-center justify-between text-xs">
                          <label
                            htmlFor="email"
                            className="font-semibold text-slate-300"
                          >
                            Địa chỉ Email
                          </label>
                          {emailVal && (
                            <span
                              className={`flex items-center gap-1 font-mono text-[10px] ${
                                isEmailValid ? "text-emerald-400" : "text-amber-400"
                              }`}
                            >
                              {isEmailValid ? (
                                <>
                                  <Check className="h-3 w-3" />
                                  <span>Hợp lệ</span>
                                </>
                              ) : (
                                <span>Chưa đúng định dạng</span>
                              )}
                            </span>
                          )}
                        </div>
                        <div className="relative">
                          <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            ref={emailInputRef}
                            autoComplete="email"
                            value={emailVal}
                            onChange={(e) => setEmailVal(e.target.value)}
                            placeholder={typedPlaceholder ? `${typedPlaceholder}|` : "chushop@gmail.com"}
                            className="w-full rounded-xl border border-[#1E2333] bg-[#07090E] py-2 pl-9 pr-8 text-xs text-slate-100 placeholder-slate-400 font-mono transition-all duration-200 focus:border-emerald-500/70 focus:bg-[#0A0D15] focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:shadow-[0_0_18px_rgba(16,185,129,0.2)]"
                          />
                          <Mail className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                          {isEmailValid && (
                            <CheckCircle2 className="pointer-events-none absolute right-2.5 top-2.5 h-3.5 w-3.5 text-emerald-400" />
                          )}
                        </div>
                      </div>

                      {/* Reactive Password Input with Strength Meter & Show/Hide */}
                      <div>
                        <div className="mb-1 flex items-center justify-between">
                          <label
                            htmlFor="password"
                            className="text-xs font-semibold text-slate-300"
                          >
                            Mật khẩu
                          </label>
                        </div>
                        <div className="relative">
                          <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            required
                            autoComplete={isLogin ? "current-password" : "new-password"}
                            value={passwordVal}
                            onChange={(e) => setPasswordVal(e.target.value)}
                            placeholder="••••••••"
                            className="w-full rounded-xl border border-[#1E2333] bg-[#07090E] py-2 pl-9 pr-9 text-xs text-slate-100 placeholder-slate-500 transition-all duration-200 focus:border-emerald-500/70 focus:bg-[#0A0D15] focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:shadow-[0_0_18px_rgba(16,185,129,0.2)]"
                          />
                          <Lock className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                            className="absolute right-2.5 top-2.5 text-slate-500 hover:text-white transition-colors"
                          >
                            {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                          </button>
                        </div>

                        {/* Interactive Password Strength Indicator */}
                        {!isLogin && passwordVal && (
                          <div className="mt-1 flex items-center gap-1.5">
                            <div className="flex flex-1 gap-1">
                              <span
                                className={`h-1 flex-1 rounded-full transition-colors ${
                                  passwordStrength >= 1 ? "bg-red-500" : "bg-[#1E2333]"
                                }`}
                              />
                              <span
                                className={`h-1 flex-1 rounded-full transition-colors ${
                                  passwordStrength >= 2 ? "bg-amber-400" : "bg-[#1E2333]"
                                }`}
                              />
                              <span
                                className={`h-1 flex-1 rounded-full transition-colors ${
                                  passwordStrength >= 3 ? "bg-emerald-400" : "bg-[#1E2333]"
                                }`}
                              />
                            </div>
                            <span className="font-mono text-[9px] text-slate-400">
                              {passwordStrength === 1 ? "Yếu" : passwordStrength === 2 ? "Khá" : "Rất mạnh"}
                            </span>
                          </div>
                        )}

                        {/* Remember Password & Save Session 1 Hour (Login Mode) */}
                        {isLogin && (
                          <div className="mt-2 flex items-center justify-between text-xs">
                            <label className="flex items-center gap-1.5 cursor-pointer select-none text-[11px] text-slate-300 hover:text-white transition-colors">
                              <input
                                type="checkbox"
                                id="remember1h"
                                name="remember1h"
                                checked={remember1h}
                                onChange={(e) => setRemember1h(e.target.checked)}
                                className="h-3.5 w-3.5 rounded border-[#1E2333] bg-[#07090E] text-emerald-500 focus:ring-emerald-500/30 accent-emerald-500 cursor-pointer"
                              />
                              <span>Nhớ mật khẩu &amp; lưu phiên 1 giờ</span>
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                setForgotMode(true);
                                setToast(null);
                              }}
                              className="text-[10.5px] font-semibold text-emerald-400 hover:underline"
                            >
                              Quên mật khẩu?
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Ergonomic Inline Hardware Captcha */}
                      <div className="flex items-center gap-1.5 rounded-xl border border-[#1E2333] bg-[#07090E] p-1.5">
                        <div className="flex shrink-0 items-center gap-1 pl-1 text-[11px] font-medium text-slate-300">
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                          <span className="rounded bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 font-mono text-xs font-bold text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                            {captchaQuestion || "..."}
                          </span>
                        </div>
                        <input
                          id="captchaAnswer"
                          name="captchaAnswer"
                          type="text"
                          inputMode="numeric"
                          required
                          autoComplete="off"
                          placeholder="Đáp án số"
                          className="w-full rounded-lg border border-[#1E2333] bg-[#0E121B] px-2 py-1 text-center font-mono text-xs font-bold text-white placeholder-slate-500 transition-colors focus:border-emerald-500/70 focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
                        />
                        <button
                          type="button"
                          onClick={() => void refreshCaptcha()}
                          disabled={captchaLoading}
                          aria-label="Đổi câu hỏi ngẫu nhiên"
                          title="Đổi câu hỏi ngẫu nhiên"
                          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#1E2333] bg-[#0E121B] text-slate-400 hover:text-white hover:bg-[#151A26] transition-colors active:scale-95"
                        >
                          <RefreshCw
                            className={`h-3 w-3 ${captchaLoading ? "animate-spin" : ""}`}
                          />
                        </button>
                        <input type="hidden" name="captchaToken" value={captchaToken} />
                      </div>

                      {/* Box Xác nhận điều khoản dịch vụ (Bắt buộc khi đăng ký mới) */}
                      {!isLogin && (
                        <div className="rounded-xl border border-emerald-500/40 bg-gradient-to-r from-emerald-500/[0.12] via-emerald-500/[0.05] to-transparent p-2.5 shadow-sm">
                          <label className="flex items-start gap-2.5 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              id="termsAccepted"
                              name="termsAccepted"
                              checked={termsAccepted}
                              onChange={(e) => setTermsAccepted(e.target.checked)}
                              className="mt-0.5 h-4 w-4 shrink-0 rounded border-emerald-500/40 bg-[#07090E] text-emerald-500 focus:ring-emerald-500/40 accent-emerald-500 cursor-pointer"
                            />
                            <div className="text-[11.5px] leading-snug text-slate-200">
                              <span className="font-bold text-white">Xác nhận điều khoản: </span>
                              <span>Tôi đồng ý với </span>
                              <Link
                                href="/terms"
                                target="_blank"
                                className="font-bold text-emerald-400 underline underline-offset-2 hover:text-emerald-300"
                              >
                                Điều khoản dịch vụ
                              </Link>
                              <span> &amp; </span>
                              <Link
                                href="/privacy"
                                target="_blank"
                                className="font-bold text-emerald-400 underline underline-offset-2 hover:text-emerald-300"
                              >
                                Chính sách bảo mật
                              </Link>
                              <p className="text-[10px] text-slate-400 mt-0.5">Cam kết tuân thủ quy chế sử dụng AI văn minh</p>
                            </div>
                          </label>
                        </div>
                      )}

                      {/* Tactile Emerald Submit Button */}
                      <div className="w-full pt-1">
                        <button
                          type="submit"
                          disabled={loading}
                          className="group relative flex w-full items-center justify-between rounded-xl bg-emerald-500 px-4 py-2.5 text-xs sm:text-sm font-bold text-black transition-all hover:bg-emerald-400 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-sm cursor-pointer"
                        >
                          {loading ? (
                            <div className="flex w-full items-center justify-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin text-black" />
                              <span>{isLogin ? "Đang xác thực an toàn..." : "Đang khởi tạo tài khoản..."}</span>
                            </div>
                          ) : (
                            <>
                              <span>{isLogin ? "Đăng nhập vào Studio" : "Khởi tạo tài khoản Free"}</span>
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black/15 transition-transform duration-200 group-hover:translate-x-0.5">
                                <ArrowRight className="h-3 w-3 text-black" />
                              </span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>

                    {/* Social Fast-Auth Options */}
                    <div className="mt-2.5 flex items-center gap-2">
                      <div className="h-px flex-1 bg-[#1E2333]" />
                      <span className="font-mono text-[8.5px] uppercase tracking-wider text-slate-500">
                        hoặc đăng nhập nhanh
                      </span>
                      <div className="h-px flex-1 bg-[#1E2333]" />
                    </div>

                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEmailVal("giamkhao@vibecoding.vn");
                          setPasswordVal("ContentStudio2026!");
                          sonnerToast.info("Đã điền tài khoản Giám khảo mẫu", {
                            description: "giamkhao@vibecoding.vn · Sẵn sàng đăng nhập",
                          });
                        }}
                        className="col-span-2 inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 py-1.5 px-3 text-[11px] font-semibold text-emerald-300 transition-colors hover:border-emerald-500/50 hover:bg-emerald-500/20 active:scale-[0.98]"
                      >
                        <Zap className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Nạp tài khoản Giám khảo (giamkhao@vibecoding.vn)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEmailVal("demo.creator@gmail.com");
                          setPasswordVal("ContentStudio2026!");
                          sonnerToast.info("Đã điền tài khoản Google Creator mẫu");
                        }}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#1E2333] bg-[#07090E] py-1.5 px-3 text-[11px] font-semibold text-slate-300 transition-colors hover:border-[#2D3548] hover:bg-[#121722] hover:text-white active:scale-[0.98]"
                      >
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                          />
                        </svg>
                        <span>Google</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEmailVal("dev.agency@github.com");
                          setPasswordVal("ContentStudio2026!");
                          sonnerToast.info("Đã điền tài khoản GitHub Developer mẫu");
                        }}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#1E2333] bg-[#07090E] py-1.5 px-3 text-[11px] font-semibold text-slate-300 transition-colors hover:border-[#2D3548] hover:bg-[#121722] hover:text-white active:scale-[0.98]"
                      >
                        <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                        </svg>
                        <span>GitHub</span>
                      </button>
                    </div>
                  </>
                )}

                <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-slate-500 font-mono">
                  <ShieldCheck className="h-3 w-3 text-emerald-400" />
                  <span>Dữ liệu cô lập độc quyền theo Supabase RLS Policy</span>
                </div>
              </div>
            </div>

          {/* ================= COLUMN B: FULLY INTERACTIVE SOCIAL AD THEATRE (7 COLS) ================= */}
          <div className={`w-full lg:col-span-7 lg:h-full lg:overflow-y-auto lg:pl-1 lg:pb-6 custom-scrollbar transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}>
            <div
              ref={liveShowcaseNodeRef}
              className={`relative rounded-[2rem] border bg-[#0A0D15]/85 p-5 sm:p-6 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.18)] backdrop-blur-2xl transition-all duration-300 ${
                isInteractingAuth
                  ? "border-cyan-500/40 shadow-[0_0_35px_rgba(56,189,248,0.12)]"
                  : "border-white/[0.12]"
              }`}
            >
              {/* Receiver Socket Node on Left Edge */}
              <div className="hidden lg:flex absolute -left-3.5 top-28 z-20 items-center">
                <span className={`relative flex h-7 w-7 items-center justify-center rounded-full border bg-[#060A12] shadow-md transition-all duration-300 ${
                  isInteractingAuth
                    ? "border-cyan-400 bg-cyan-500/20 shadow-[0_0_15px_rgba(56,189,248,0.6)] scale-110"
                    : "border-cyan-500/40 shadow-[0_0_10px_rgba(56,189,248,0.25)]"
                }`}>
                  <Sparkles className={`h-3.5 w-3.5 ${isInteractingAuth ? "text-cyan-300 animate-spin" : "text-cyan-400"}`} />
                </span>
              </div>
              <BorderBeam
                duration={7}
                colorFrom="#00D492"
                colorVia={activeAngle.accentColor}
                colorTo="#38BDF8"
                borderWidth={1.5}
              />

              {/* Theatre Header & Platform Switcher Tabs */}
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
                    <Sparkles className="h-3 w-3" />
                    Live Interactive Inspector
                  </span>
                </div>

                {/* Facebook vs Instagram Platform Tabs */}
                <div className="flex rounded-lg bg-[#07090E] p-0.5 border border-[#1E2333] font-mono text-[10px]">
                  <button
                    type="button"
                    onClick={() => setPlatform("facebook")}
                    className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 font-bold transition-colors ${
                      platform === "facebook"
                        ? "bg-[#1877F2] text-white shadow-xs"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Globe className="h-3 w-3" />
                    <span>Facebook Mobile</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlatform("instagram")}
                    className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 font-bold transition-colors ${
                      platform === "instagram"
                        ? "bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white shadow-xs"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Heart className="h-3 w-3" />
                    <span>Instagram Feed</span>
                  </button>
                </div>
              </div>

              {/* 3-Angle Switcher Buttons */}
              <div className="mb-3 flex flex-wrap gap-1.5">
                {SHOWCASE_ANGLES.map((angle, index) => {
                  const active = showcaseAngle === index;
                  return (
                    <button
                      key={angle.tag}
                      type="button"
                      onClick={() => handleSwitchAngle(index)}
                      className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.97] cursor-pointer ${
                        active
                          ? "border-emerald-500/60 bg-emerald-500/20 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.25)]"
                          : "border-[#1E2333] bg-[#07090E] text-slate-400 hover:border-[#2D3548] hover:text-white hover:bg-[#121722]"
                      }`}
                    >
                      <span
                        className={`rounded px-1.5 py-0.5 font-mono text-[9px] uppercase transition-colors ${
                          active
                            ? "bg-emerald-400/25 text-emerald-300 font-extrabold border border-emerald-400/40"
                            : "bg-white/5 text-slate-500"
                        }`}
                      >
                        {angle.tag}
                      </span>
                      <span className="font-semibold">{angle.angleDesc}</span>
                    </button>
                  );
                })}
              </div>

              {/* REALISTIC, FULLY-INTERACTIVE SOCIAL AD MOCKUP CHASSIS */}
              <div className="w-full">
                <div className={`overflow-hidden rounded-xl border border-[#1E2333] bg-[#07090E] text-slate-100 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isAngleChanging ? "opacity-40 scale-[0.99]" : "opacity-100 scale-100"
                }`}>
                  {platform === "facebook" ? (
                    <>
                      {/* Header: Brand Profile, Sponsored, Live Hook Badge */}
                  <div className="flex items-center justify-between border-b border-[#1E2333] px-3 py-2 bg-[#0E121B]">
                    <div className="flex items-center gap-2">
                      <div
                        className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-black text-black"
                        style={{
                          background:
                            platform === "facebook"
                              ? "linear-gradient(135deg, #1877F2, #00D492)"
                              : "linear-gradient(135deg, #F58529, #DD2A7B, #8134AF)",
                        }}
                      >
                        {activeAngle.brandName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <p className="text-xs font-bold text-white leading-none">
                            {activeAngle.brandName}
                          </p>
                          <span className="flex h-3 w-3 items-center justify-center rounded-full bg-blue-500 text-[8px] text-white">
                            ✓
                          </span>
                        </div>
                        <p className="mt-0.5 flex items-center gap-1 text-[9.5px] text-slate-400 font-mono">
                          Được tài trợ · {platform === "facebook" ? "Facebook Ads" : "Instagram Sponsored"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[9px] font-bold text-emerald-400 font-mono">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        125 HOOK ACTIVE
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyShowcaseText}
                        className="inline-flex items-center gap-1 rounded-md border border-[#1E2333] bg-[#0E121B] px-2 py-0.5 text-[9.5px] font-semibold text-slate-300 hover:text-white hover:bg-[#151A26] active:scale-95 transition-all"
                      >
                        {copiedShowcase ? <Check className="h-2.5 w-2.5 text-emerald-400" /> : <Copy className="h-2.5 w-2.5" />}
                        <span>{copiedShowcase ? "Đã chép" : "Sao chép"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Primary Text / Ad Caption with 125-Char Hook Gold Highlight */}
                  <div className="p-3 text-xs leading-[1.6]">
                    <div className="relative">
                      {showcaseExpanded ? (
                        <p className="whitespace-pre-wrap break-words text-slate-200">
                          {activeAngle.fullText}{" "}
                          <button
                            type="button"
                            onClick={() => setShowcaseExpanded(false)}
                            className="font-bold text-slate-400 hover:text-white underline cursor-pointer"
                          >
                            Ẩn bớt
                          </button>
                        </p>
                      ) : (
                        <p className="whitespace-pre-wrap break-words text-slate-200">
                          <span className="rounded bg-emerald-500/15 border-b border-emerald-500/40 px-1 py-0.5 font-semibold text-emerald-300">
                            {activeAngle.hook125}
                          </span>
                          {"… "}
                          <button
                            type="button"
                            onClick={() => setShowcaseExpanded(true)}
                            className="font-bold text-sky-400 hover:underline cursor-pointer"
                          >
                            Xem thêm
                          </button>
                        </p>
                      )}
                    </div>

                    {/* Hashtags */}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {activeAngle.hashtags.map((tag) => (
                        <span
                          key={tag}
                          className="font-medium text-[10px] text-sky-400/90 hover:underline cursor-pointer font-mono"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* AUTHENTIC HIGH-CONVERTING AD CREATIVE BANNER */}
                  <div className="px-2 pb-2">
                    <div
                      onDoubleClick={handleDoubleTapCreative}
                      title="Nhấp đúp (Double-tap) để thả tim bài viết"
                      className="relative aspect-[16/7.5] w-full overflow-hidden rounded-lg border border-[#1E2333] bg-gradient-to-br from-[#0B0F19] via-[#121A28] to-[#0A0E17] p-2.5 flex flex-col justify-between shadow-inner cursor-pointer select-none group/creative"
                    >
                      {/* Double tap heart overlay */}
                      {showDoubleTapHeart && (
                        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
                          <Heart className="h-16 w-16 fill-rose-500 text-rose-500 animate-heart-pop drop-shadow-[0_0_35px_rgba(244,63,94,0.95)]" />
                        </div>
                      )}

                      {/* Ambient Radial Spotlight */}
                      <div
                        className="pointer-events-none absolute -right-8 -top-8 h-48 w-48 rounded-full blur-3xl opacity-30 transition-colors duration-500"
                        style={{ backgroundColor: activeAngle.accentColor }}
                      />

                      {/* Top Creative Tag & CTR Benchmark Pill */}
                      <div className="relative z-10 flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/60 px-2 py-0.5 font-mono text-[8.5px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: activeAngle.accentColor }} />
                          {activeAngle.tag} STRATEGY · VERIFIED
                        </span>
                        <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[8.5px] font-bold text-emerald-300 font-mono">
                          ⚡ CTR +42% BENCHMARK
                        </span>
                      </div>

                      {/* Middle: Split Layout (Product Graphic Simulation + Offer Specs) */}
                      <div className="relative z-10 grid grid-cols-12 items-center gap-3 my-auto">
                        {/* Left Column: Product Visual Render */}
                        <div className="col-span-4 flex items-center justify-center">
                          {activeAngle.visualType === "cosmetics" && (
                            <div className="relative flex flex-col items-center">
                              {/* Dropper Bulb */}
                              <div className="h-2.5 w-3 rounded-t-full bg-slate-200 border border-slate-400" />
                              {/* Gold Collar */}
                              <div className="h-1.5 w-4 bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 rounded-sm shadow-xs" />
                              {/* Glass Bottle Body */}
                              <div className="relative h-16 w-10 rounded-b-xl border border-amber-400/40 bg-gradient-to-b from-amber-500/30 via-amber-600/50 to-amber-950/80 p-1 flex flex-col justify-between items-center shadow-[0_0_20px_rgba(245,158,11,0.35)]">
                                {/* Glass Specular Reflection */}
                                <div className="absolute left-1 top-1 bottom-1 w-1 bg-gradient-to-b from-white/60 to-transparent rounded-full opacity-70" />
                                <span className="font-mono text-[7px] font-black text-amber-200 tracking-tighter mt-1">15% C</span>
                                <div className="h-1 w-6 rounded-full bg-amber-400/80 mb-1" />
                              </div>
                              <span className="mt-1 font-mono text-[7.5px] text-amber-300 font-bold bg-amber-500/20 px-1 rounded border border-amber-500/30">
                                PURE VIT-C
                              </span>
                            </div>
                          )}

                          {activeAngle.visualType === "fashion" && (
                            <div className="relative flex flex-col items-center">
                              {/* Silk Blouse Simulation */}
                              <div className="relative h-18 w-14 rounded-xl border border-sky-400/40 bg-gradient-to-tr from-sky-950/90 via-sky-800/40 to-slate-900/90 p-1.5 flex flex-col justify-between items-center shadow-[0_0_20px_rgba(56,189,248,0.35)]">
                                {/* Collar Cutout */}
                                <div className="w-6 h-3 border-b-2 border-sky-300/80 rounded-b-full" />
                                {/* Silk Drape Ripples */}
                                <div className="space-y-1 w-full px-1">
                                  <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                                  <div className="h-0.5 w-3/4 mx-auto bg-gradient-to-r from-transparent via-sky-300/40 to-transparent" />
                                </div>
                                {/* Pearl Buttons */}
                                <div className="flex gap-1 mb-1">
                                  <span className="h-1.5 w-1.5 rounded-full bg-white shadow-xs" />
                                  <span className="h-1.5 w-1.5 rounded-full bg-white shadow-xs" />
                                </div>
                              </div>
                              <span className="mt-1 font-mono text-[7.5px] text-sky-300 font-bold bg-sky-500/20 px-1 rounded border border-sky-500/30">
                                BẢO LỘC SILK
                              </span>
                            </div>
                          )}

                          {activeAngle.visualType === "ergonomic" && (
                            <div className="relative flex flex-col items-center">
                              {/* Honeycomb Ergonomic Cushion Simulation */}
                              <div className="relative h-18 w-14 rounded-xl border border-emerald-400/40 bg-gradient-to-b from-emerald-950/90 via-emerald-800/40 to-slate-950/90 p-1 flex flex-col justify-between items-center shadow-[0_0_20px_rgba(0,212,146,0.35)]">
                                {/* Spine Curve Alignment Wave */}
                                <div className="mt-1 flex items-center justify-center w-full">
                                  <div className="h-2 w-8 border-b-2 border-emerald-400 rounded-full" />
                                </div>
                                {/* Hex Grid Matrix */}
                                <div className="grid grid-cols-3 gap-0.5 w-full px-1 py-1">
                                  {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="h-2 rounded-xs border border-emerald-400/60 bg-emerald-500/20" />
                                  ))}
                                </div>
                                <span className="font-mono text-[6.5px] text-emerald-200 font-black">78% RELIEF</span>
                              </div>
                              <span className="mt-1 font-mono text-[7.5px] text-emerald-300 font-bold bg-emerald-500/20 px-1 rounded border border-emerald-500/30">
                                MEDICAL GEL
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Right Column: High-Conversion Headline, Rating, USPs */}
                        <div className="col-span-8 pl-1">
                          {/* Promo Tag */}
                          <div className="mb-1">
                            <span className="inline-block rounded bg-red-600/80 px-1.5 py-0.5 text-[8.5px] font-black uppercase tracking-wider text-white shadow-xs">
                              {activeAngle.discountTag}
                            </span>
                          </div>

                          {/* Headline */}
                          <p className="text-xs sm:text-sm font-black tracking-tight text-white leading-tight">
                            {activeAngle.productName}
                          </p>
                          <p className="text-[10px] font-semibold text-emerald-400 mt-0.5">
                            {activeAngle.subHeadline}
                          </p>

                          {/* Star Rating & Social Proof */}
                          <div className="mt-1 flex items-center gap-1.5 text-[9.5px]">
                            <div className="flex items-center text-amber-400">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                              ))}
                            </div>
                            <span className="font-bold text-white font-mono">{activeAngle.rating}/5</span>
                            <span className="text-slate-400 text-[8.5px]">({activeAngle.reviewsCount} đánh giá)</span>
                          </div>

                          {/* Key Bullet Specs */}
                          <div className="mt-1.5 flex flex-wrap gap-1">
                            {activeAngle.productSpecs.map((spec) => (
                              <span
                                key={spec}
                                className="inline-flex items-center gap-1 rounded bg-[#0E121B] border border-[#1E2333] px-1.5 py-0.5 text-[8.5px] text-slate-300 font-mono"
                              >
                                <span className="h-1 w-1 rounded-full bg-emerald-400" />
                                <span>{spec}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Facebook Ad Link Strip with Call-to-Action Button */}
                      <div className="relative z-10 flex items-center justify-between border-t border-[#1E2333] pt-2 bg-[#0E121B] -mx-3 -mb-3 px-3 py-2.5">
                        <div className="truncate pr-2">
                          <span className="font-mono text-[8px] uppercase tracking-wider text-slate-400">
                            {activeAngle.domain}
                          </span>
                          <p className="truncate text-[10.5px] font-bold text-white">
                            {activeAngle.linkTitle}
                          </p>
                          <p className="truncate text-[9px] text-slate-400">
                            {activeAngle.linkSubtext}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            sonnerToast.success(`Đã nhấn CTA: ${activeAngle.ctaLabel}`, {
                              description: "Mô phỏng khách hàng click vào trang đích chuyển đổi của bạn.",
                            })
                          }
                          className="shrink-0 rounded-lg bg-emerald-500 hover:bg-emerald-400 active:scale-95 px-3 py-1.5 text-[10px] font-bold text-black transition-all shadow-sm cursor-pointer"
                        >
                          {activeAngle.ctaLabel}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Social Reaction Bar with Live Interactive Likes & Comments */}
                  <div className="flex items-center justify-between border-t border-[#1E2333] px-3 py-1.5 text-[10px] text-slate-400 font-mono bg-[#0A0D14]">
                    <div className="flex items-center gap-1">
                      <span className="flex -space-x-1">
                        <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#1877F2] text-white">
                          <ThumbsUp className="h-2 w-2 fill-white" />
                        </span>
                        <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#FA383E] text-white">
                          <Heart className="h-2 w-2 fill-white" />
                        </span>
                      </span>
                      <span className="font-semibold text-slate-200">
                        {isLiked ? (likeCount).toLocaleString("vi-VN") : "1.8k"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowComments(!showComments)}
                        className="hover:underline cursor-pointer"
                      >
                        {totalCommentsCount} bình luận
                      </button>
                      <span>·</span>
                      <span>150 chia sẻ</span>
                    </div>
                  </div>

                  {/* Interactive Action Row: Thích, Bình luận, Chia sẻ, Lưu */}
                  <div className="grid grid-cols-4 border-t border-[#1E2333] text-xs font-semibold text-slate-400 bg-[#0E121B]">
                    <div
                      className="relative"
                      onMouseEnter={() => setShowReactionDock(true)}
                      onMouseLeave={() => setShowReactionDock(false)}
                    >
                      {/* Reaction dock popover on hover */}
                      {showReactionDock && (
                        <div className="absolute -top-11 left-0 z-40 flex items-center gap-1.5 rounded-full border border-[#1E2333] bg-[#121722]/95 px-2.5 py-1 shadow-2xl backdrop-blur-xl animate-dock-reveal">
                          {["👍", "❤️", "🥰", "😆", "😮", "🔥"].map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleLike(emoji);
                                setShowReactionDock(false);
                              }}
                              className="text-base transform transition-transform duration-150 hover:scale-135 active:scale-95 cursor-pointer"
                              title={`Bày tỏ ${emoji}`}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => handleToggleLike(activeReactionEmoji || "👍")}
                        className={`relative inline-flex items-center justify-center gap-1.5 py-2 w-full transition-all active:scale-90 cursor-pointer ${
                          isLiked ? "text-[#1877F2] font-black" : "hover:text-white"
                        }`}
                      >
                        {/* Floating +1 particle */}
                        {floatingLike && (
                          <span className="pointer-events-none absolute -top-5 left-1/2 -translate-x-1/2 font-black text-xs text-[#1877F2] animate-float-up whitespace-nowrap drop-shadow-md">
                            {activeReactionEmoji || "👍"} +1
                          </span>
                        )}

                        <span className={likePopping ? "animate-like-bounce inline-block" : "inline-block"}>
                          {isLiked && activeReactionEmoji !== "👍" ? (
                            <span className="text-sm leading-none">{activeReactionEmoji}</span>
                          ) : (
                            <ThumbsUp className={`h-3.5 w-3.5 ${isLiked ? "fill-[#1877F2]" : ""}`} />
                          )}
                        </span>
                        <span>
                          {isLiked
                            ? activeReactionEmoji === "❤️"
                              ? "Yêu thích"
                              : activeReactionEmoji === "🔥"
                              ? "Hào hứng"
                              : activeReactionEmoji === "😆"
                              ? "Haha"
                              : activeReactionEmoji === "🥰"
                              ? "Thương thương"
                              : "Đã thích"
                            : "Thích"}
                        </span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowComments(!showComments)}
                      className={`inline-flex items-center justify-center gap-1.5 py-2 transition-all hover:text-white active:scale-90 cursor-pointer ${
                        showComments ? "text-emerald-400 font-bold" : ""
                      }`}
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      <span>Bình luận</span>
                    </button>

                    <button
                      type="button"
                      onClick={async () => {
                        await copyToClipboard(activeAngle.fullText);
                        sonnerToast.success("Đã sao chép liên kết chia sẻ bài viết!");
                      }}
                      className="inline-flex items-center justify-center gap-1.5 py-2 transition-all hover:text-white active:scale-90 cursor-pointer"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                      <span>Chia sẻ</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsSaved(!isSaved);
                        sonnerToast.info(isSaved ? "Đã bỏ lưu bài viết" : "Đã lưu kịch bản vào bộ sưu tập!");
                      }}
                      className={`inline-flex items-center justify-center gap-1.5 py-2 transition-all active:scale-90 cursor-pointer ${
                        isSaved ? "text-amber-400 font-black" : "hover:text-white"
                      }`}
                    >
                      <Bookmark className={`h-3.5 w-3.5 ${isSaved ? "fill-amber-400" : ""}`} />
                      <span>Lưu</span>
                    </button>
                  </div>
                </>
              ) : (
                /* ================= INSTAGRAM FEED AD MOCKUP ================= */
                <>
                  {/* Instagram Header with Sunset Gradient Story Ring */}
                  <div className="flex items-center justify-between border-b border-[#1E2333] px-3.5 py-2 bg-[#0C0F17]">
                    <div className="flex items-center gap-2.5">
                      {/* Iconic Instagram Story Gradient Ring */}
                      <div className="p-[2px] rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] shadow-sm">
                        <div className="p-[1.5px] bg-[#0C0F17] rounded-full">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-black font-black text-[10px]">
                            {activeAngle.brandName.slice(0, 2).toUpperCase()}
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-1">
                          <p className="text-xs font-extrabold text-white leading-none tracking-tight">
                            {igHandle}
                          </p>
                          <span className="flex h-3 w-3 items-center justify-center rounded-full bg-sky-500 text-[8px] text-white">
                            ✓
                          </span>
                        </div>
                        <p className="mt-0.5 text-[9.5px] text-slate-400 font-sans">
                          Được tài trợ · Instagram Sponsored
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[9px] font-bold text-emerald-400 font-mono">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        125 HOOK
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyShowcaseText}
                        className="inline-flex items-center gap-1 rounded-md border border-[#1E2333] bg-[#0E121B] px-2 py-0.5 text-[9.5px] font-semibold text-slate-300 hover:text-white hover:bg-[#151A26] active:scale-95 transition-all cursor-pointer"
                      >
                        {copiedShowcase ? <Check className="h-2.5 w-2.5 text-emerald-400" /> : <Copy className="h-2.5 w-2.5" />}
                        <span>{copiedShowcase ? "Đã chép" : "Sao chép"}</span>
                      </button>
                      <button
                        type="button"
                        aria-label="Tùy chọn quảng cáo"
                        className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Instagram Media FIRST (Directly beneath Header) */}
                  {renderCreativeBody(false)}

                  {/* Instagram Full-Width Sponsored Action Bar */}
                  <div
                    onClick={() =>
                      sonnerToast.success(`Đã nhấn CTA Instagram: ${activeAngle.ctaLabel}`, {
                        description: "Mô phỏng khách hàng click vào trang đích chuyển đổi của bạn.",
                      })
                    }
                    className="flex items-center justify-between bg-[#151D2C] hover:bg-[#1C273C] px-3.5 py-2.5 border-t border-[#1E2333] cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[11.5px] font-bold text-white tracking-wide">
                        {activeAngle.ctaLabel}
                      </span>
                      <span className="text-slate-400 text-[10px]">·</span>
                      <span className="text-slate-400 text-[10px] font-medium">Cửa hàng trực tuyến</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-300" />
                  </div>

                  {/* Instagram Iconic Action Icons Bar */}
                  <div className="flex items-center justify-between px-3.5 py-2 border-t border-[#1E2333] bg-[#0A0D15]">
                    <div className="flex items-center gap-4">
                      {/* Heart Like Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleLike("❤️")}
                        className="relative text-white hover:text-rose-500 active:scale-75 transition-all cursor-pointer"
                      >
                        {floatingLike && (
                          <span className="pointer-events-none absolute -top-5 left-1/2 -translate-x-1/2 font-black text-xs text-rose-500 animate-float-up whitespace-nowrap drop-shadow-md">
                            ❤️ +1
                          </span>
                        )}
                        <Heart className={`h-5 w-5 ${isLiked ? "fill-rose-500 text-rose-500 animate-like-bounce" : "text-white"}`} />
                      </button>

                      {/* Comment Bubble */}
                      <button
                        type="button"
                        onClick={() => setShowComments(!showComments)}
                        className={`active:scale-75 transition-all cursor-pointer ${showComments ? "text-emerald-400" : "text-white hover:text-slate-300"}`}
                      >
                        <MessageCircle className="h-5 w-5" />
                      </button>

                      {/* Paper Airplane Share */}
                      <button
                        type="button"
                        onClick={async () => {
                          await copyToClipboard(activeAngle.fullText);
                          sonnerToast.success("Đã sao chép liên kết chia sẻ Instagram Post!");
                        }}
                        className="text-white hover:text-slate-300 active:scale-75 transition-all cursor-pointer"
                      >
                        <Send className="h-4.5 w-4.5" />
                      </button>
                    </div>

                    {/* Carousel Dots */}
                    <div className="flex items-center gap-1">
                      <span className={`h-1.5 rounded-full ${showcaseAngle === 0 ? "bg-sky-400 w-3" : "bg-slate-600 w-1.5"} transition-all`} />
                      <span className={`h-1.5 rounded-full ${showcaseAngle === 1 ? "bg-sky-400 w-3" : "bg-slate-600 w-1.5"} transition-all`} />
                      <span className={`h-1.5 rounded-full ${showcaseAngle === 2 ? "bg-sky-400 w-3" : "bg-slate-600 w-1.5"} transition-all`} />
                    </div>

                    {/* Bookmark */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsSaved(!isSaved);
                        sonnerToast.info(isSaved ? "Đã bỏ lưu bài viết" : "Đã lưu kịch bản vào bộ sưu tập Instagram!");
                      }}
                      className="active:scale-75 transition-all cursor-pointer"
                    >
                      <Bookmark className={`h-5 w-5 ${isSaved ? "fill-amber-400 text-amber-400" : "text-white hover:text-slate-300"}`} />
                    </button>
                  </div>

                  {/* Instagram Social Proof & Caption */}
                  <div className="px-3.5 pb-3 pt-1 space-y-1.5 bg-[#07090E]">
                    <p className="text-[11px] font-medium text-slate-300">
                      Được thích bởi <strong className="text-white font-bold">ha.my.nguyen</strong> và{" "}
                      <strong className="text-white font-bold">{isLiked ? likeCount.toLocaleString("vi-VN") : "1.824"} người khác</strong>
                    </p>

                    <div className="text-xs leading-relaxed text-slate-200">
                      <strong className="text-white font-bold mr-1.5">{igHandle}</strong>
                      {showcaseExpanded ? (
                        <span>
                          {activeAngle.fullText}{" "}
                          <button
                            type="button"
                            onClick={() => setShowcaseExpanded(false)}
                            className="text-slate-400 hover:text-white underline cursor-pointer ml-1"
                          >
                            Ẩn bớt
                          </button>
                        </span>
                      ) : (
                        <span>
                          <span className="bg-emerald-500/15 border-b border-emerald-500/40 px-1 py-0.5 font-semibold text-emerald-300">
                            {activeAngle.hook125}
                          </span>
                          {"… "}
                          <button
                            type="button"
                            onClick={() => setShowcaseExpanded(true)}
                            className="text-slate-400 hover:text-white font-medium cursor-pointer ml-1"
                          >
                            xem thêm
                          </button>
                        </span>
                      )}
                    </div>

                    {/* Hashtags in Instagram Blue */}
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {activeAngle.hashtags.map((tag) => (
                        <span key={tag} className="font-medium text-[10.5px] text-[#0095F6] hover:underline cursor-pointer">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Comments link */}
                    <button
                      type="button"
                      onClick={() => setShowComments(!showComments)}
                      className="text-[11px] text-slate-400 hover:text-slate-300 cursor-pointer block font-medium"
                    >
                      Xem tất cả {totalCommentsCount} bình luận
                    </button>

                    {/* Timestamp */}
                    <p className="text-[9px] uppercase tracking-wider text-slate-500 font-mono">
                      3 GIỜ TRƯỚC · ĐƯỢC TÀI TRỢ
                    </p>
                  </div>
                </>
              )}

                  {/* Interactive High-Craft Social Comments Sheet / Drawer */}
                  {showComments && (
                    <div className="border-t border-[#1E2333] bg-[#0A0D15]/95 backdrop-blur-xl animate-in fade-in duration-200">
                      {/* Drawer Header */}
                      <div className="flex items-center justify-between px-3.5 py-2 border-b border-[#1E2333]/80 bg-[#0C101A]">
                        <div className="flex items-center gap-2">
                          <MessageCircle className="h-4 w-4 text-emerald-400" />
                          <h4 className="text-xs font-bold text-white tracking-tight">
                            Bình luận ({totalCommentsCount})
                          </h4>
                          <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.2 text-[9px] font-mono font-bold text-emerald-300">
                            Trực tiếp
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowComments(false)}
                          aria-label="Đóng bình luận"
                          className="flex h-6 w-6 items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-white/10 active:scale-90 transition-all cursor-pointer"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Comments Scrollable Stream */}
                      <div className="max-h-56 overflow-y-auto space-y-2.5 p-3 custom-scrollbar">
                        {commentsList.map((c) => (
                          <div key={c.id} className="space-y-1.5">
                            {/* Top Level Comment */}
                            <div className="flex items-start gap-2.5 group">
                              {/* User Avatar */}
                              <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr ${c.avatarBg} text-white font-bold text-[10px] shadow-sm shadow-black/40`}>
                                {c.avatarInitials}
                              </div>

                              {/* Comment Content Bubble */}
                              <div className="flex-1 min-w-0">
                                <div className="rounded-2xl rounded-tl-sm bg-[#121622] border border-[#1E2333] p-2.5 shadow-sm">
                                  <div className="flex items-center justify-between gap-1 mb-1">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className="font-bold text-xs text-white">
                                        {c.author}
                                      </span>
                                      {c.badge && (
                                        <span className={`rounded-full px-1.5 py-0.2 text-[8.5px] font-mono font-semibold border ${
                                          c.badgeType === "buyer"
                                            ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                                            : c.badgeType === "topfan"
                                            ? "bg-amber-500/15 border-amber-500/30 text-amber-300"
                                            : "bg-sky-500/15 border-sky-500/30 text-sky-300"
                                        }`}>
                                          {c.badge}
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <p className="text-xs text-slate-200 leading-relaxed break-words">
                                    {c.text}
                                  </p>
                                </div>

                                {/* Comment Meta Row */}
                                <div className="mt-1 flex items-center gap-3 text-[10px] text-slate-400 pl-1 font-mono">
                                  <span>{c.time}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleToggleCommentLike(c.id)}
                                    className={`font-semibold hover:text-white transition-colors cursor-pointer flex items-center gap-1 ${
                                      c.isLiked ? "text-rose-400 font-bold" : ""
                                    }`}
                                  >
                                    <Heart className={`h-2.5 w-2.5 ${c.isLiked ? "fill-rose-400 text-rose-400" : ""}`} />
                                    <span>Thích{c.likes > 0 ? ` (${c.likes})` : ""}</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setCommentInput(`@${c.author} `);
                                    }}
                                    className="font-semibold hover:text-white transition-colors cursor-pointer"
                                  >
                                    Phản hồi
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Nested Official Brand Response (if any) */}
                            {c.reply && (
                              <div className="flex items-start gap-2 pl-7 pt-0.5">
                                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-black font-extrabold text-[8px] shadow-sm">
                                  LU
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="rounded-2xl rounded-tl-sm bg-[#0E131E] border border-emerald-500/30 p-2 text-xs shadow-sm">
                                    <div className="flex items-center gap-1.5 mb-0.5">
                                      <span className="font-bold text-[11px] text-emerald-300">
                                        {c.reply.author}
                                      </span>
                                      <span className="rounded-full bg-emerald-500/20 px-1 py-0.2 text-[8px] font-mono text-emerald-400 border border-emerald-500/30">
                                        Tác giả ✓
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-slate-300 leading-relaxed">
                                      {c.reply.text}
                                    </p>
                                  </div>
                                  <div className="mt-0.5 flex items-center gap-2 text-[9.5px] text-slate-500 pl-1 font-mono">
                                    <span>{c.reply.time}</span>
                                    <span>·</span>
                                    <span className="text-emerald-400">Đã trả lời</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Quick Reaction Emoji Row */}
                      <div className="flex items-center gap-1.5 px-3 py-1 border-t border-[#1E2333]/60 bg-[#0A0D15]/80 overflow-x-auto no-scrollbar">
                        <span className="text-[9.5px] font-mono text-slate-500 shrink-0 mr-0.5">Emoji nhanh:</span>
                        {["❤️", "🔥", "👍", "😍", "👏", "💯", "🙌", "✨"].map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => setCommentInput((prev) => prev + emoji)}
                            className="rounded hover:bg-white/10 px-1 py-0.5 text-xs transition-transform active:scale-90 cursor-pointer"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>

                      {/* Comment Input Bar */}
                      <form onSubmit={handleAddComment} className="p-2.5 border-t border-[#1E2333] bg-[#0E121B] flex items-center gap-2">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[9px] border border-emerald-500/30">
                          {emailVal ? emailVal.slice(0, 1).toUpperCase() : "B"}
                        </div>
                        <input
                          type="text"
                          value={commentInput}
                          onChange={(e) => setCommentInput(e.target.value)}
                          placeholder="Viết bình luận với vai trò khách hàng..."
                          className="flex-1 rounded-full border border-[#1E2333] bg-[#07090E] px-3 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/70 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                        />
                        <button
                          type="submit"
                          disabled={!commentInput.trim()}
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:hover:bg-emerald-500 text-black font-bold active:scale-90 transition-all cursor-pointer shadow-sm shadow-emerald-500/30"
                          title="Gửi bình luận"
                        >
                          <Send className="h-3 w-3" />
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>

              {/* Spec Telemetry Strip */}
              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className="rounded-xl border border-[#1E2333] bg-[#07090E] p-2 text-center">
                  <div className="text-sm font-black tabular-nums text-emerald-400 font-mono">
                    0s
                  </div>
                  <div className="text-[9px] text-slate-400 font-mono">
                    Tạo tức thì
                  </div>
                </div>
                <div className="rounded-xl border border-[#1E2333] bg-[#07090E] p-2 text-center">
                  <div className="text-sm font-black tabular-nums text-white font-mono">
                    <NumberTicker value={125} />
                  </div>
                  <div className="text-[9px] text-slate-400 font-mono">
                    Ký tự vàng Hook
                  </div>
                </div>
                <div className="rounded-xl border border-[#1E2333] bg-[#07090E] p-2 text-center">
                  <div className="text-sm font-black tabular-nums text-emerald-400 font-mono">
                    +<NumberTicker value={300} />%
                  </div>
                  <div className="text-[9px] text-slate-400 font-mono">
                    Tỷ lệ Click CTR
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-2.5 flex flex-wrap items-center justify-between gap-1 border-t border-[#1E2333] pt-2 text-[9.5px] font-medium text-slate-500 font-mono">
                <span className="flex items-center gap-1">🔒 SSL 256-bit</span>
                <span className="flex items-center gap-1">🛡️ Supabase RLS</span>
                <span className="flex items-center gap-1">⚡ Zero-Training</span>
                <span className="flex items-center gap-1">✓ 100% Anti-AI Slop</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ===== 3. COMPACT MINIMALIST FOOTER ===== */}
      <footer className="mt-auto relative z-10 w-full border-t border-[#1E2333] bg-[#0E121B] px-4 py-2 text-center text-[10px] text-slate-400 font-mono">
        © 2026 Content Studio. Editorial SaaS &amp; Karpathy Discipline. Zero AI-Slop Architecture.
      </footer>
    </div>
  );
}
