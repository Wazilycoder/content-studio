"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  PlayCircle,
  Layers3,
  ThumbsUp,
  MessageCircle,
  Share2,
  Globe,
  CheckCircle2,
  Send,
  Check,
  Copy,
  X,
  ExternalLink,
} from "lucide-react";
import { getUserProfile } from "@/app/auth/actions";
import ScrollReveal from "@/components/ui/ScrollReveal";

type LandingUser = Awaited<ReturnType<typeof getUserProfile>>;

interface HeroSectionProps {
  user: LandingUser;
}

interface CommentItem {
  id: string;
  name: string;
  role: string;
  avatarColor: string;
  time: string;
  text: string;
  likes: number;
  userLiked?: boolean;
}

const TRUST_ITEMS = [
  "0đ chi phí bắt đầu",
  "10 lượt tạo miễn phí",
  "Chuẩn 125 ký tự 'Xem thêm'",
  "3 tông giọng chuẩn cuộc thi (Hài hước · Trang trọng · Trẻ trung)",
];

const DEMO_POSTS = [
  {
    tag: "PAS",
    label: "Vấn đề & Giải pháp",
    color: "from-blue-600 to-indigo-600",
    badgeBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    hook: "85% người bán hàng online bỏ cuộc sau 3 tháng đầu vì lý do này:",
    body: "Họ copy cùng 1 kiểu văn mẫu AI sáo rỗng: 'Chào mừng quý khách...', 'Sản phẩm siêu hot...' khiến khách hàng lướt qua trong 0.5s mà không đọng lại bất kỳ cảm xúc nào.",
    solution: "👉 Giải pháp: Tiếp cận trực diện nỗi đau thực tế của khách, biến giải pháp thành lý do duy nhất họ phải chốt đơn ngay hôm nay.",
    hashtags: "#ContentMarketing #AntiAISlop #BanHangOnline",
    initialLikes: 1842,
    initialComments: 248,
    initialShares: 96,
  },
  {
    tag: "Cảm xúc",
    label: "Cảm xúc & Phong cách",
    color: "from-rose-500 to-pink-600",
    badgeBg: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
    hook: "Từ ngày đổi sang phong cách viết này, khách tự nhắn hỏi mua không cần chèo kéo...",
    body: "Không đao to búa lớn. Không kêu gọi gượng ép. Chỉ kể lại câu chuyện chân thực khi khách hàng bước vào cuộc sống mới cùng sản phẩm.",
    solution: "✨ Mỗi câu từ là một bức tranh cảm xúc, khiến khách hàng nhìn thấy chính họ đang hạnh phúc và tự tin hơn mỗi ngày.",
    hashtags: "#PhongCachSong #Storytelling #ChamVaoCamXuc",
    initialLikes: 2410,
    initialComments: 312,
    initialShares: 142,
  },
  {
    tag: "FAB",
    label: "Tính năng & Lợi ích",
    color: "from-emerald-500 to-teal-600",
    badgeBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    hook: "Trực diện 3 nâng cấp công nghệ giúp bạn tiết kiệm 3 giờ viết bài mỗi ngày:",
    body: "1. Chuẩn hóa 125 ký tự đầu tiên tối ưu điểm nhìn trên Mobile Newsfeed. 2. Thuật toán phân giải 3 góc bài viết tự động. 3. 100% không trùng lặp văn mẫu.",
    solution: "⚡ Bán hàng bằng giá trị cốt lõi và thông số thuyết phục, biến người xem vãng lai thành khách hàng trung thành dài hạn.",
    hashtags: "#ProTurbo #HieuQuaCao #TuDongHoa",
    initialLikes: 1520,
    initialComments: 189,
    initialShares: 78,
  },
];

const INITIAL_COMMENTS: Record<string, CommentItem[]> = {
  PAS: [
    {
      id: "c1",
      name: "Minh Anh",
      role: "Chủ shop Thời trang thiết kế",
      avatarColor: "from-blue-600 to-indigo-600",
      time: "25 phút trước",
      text: "Áp dụng góc PAS này khách lạ inbox hỏi giá tăng gấp đôi thật sự, không còn ai lướt qua bơ bài viết nữa!",
      likes: 18,
    },
    {
      id: "c2",
      name: "Hoàng Long",
      role: "Digital Marketer",
      avatarColor: "from-emerald-600 to-teal-600",
      time: "1 giờ trước",
      text: "125 ký tự đầu tiên tối ưu điểm nhìn Mobile đúng chuẩn, tỷ lệ click 'Xem thêm' cao hơn hẳn văn mẫu cũ.",
      likes: 9,
    },
  ],
  "Cảm xúc": [
    {
      id: "c3",
      name: "Thu Trang",
      role: "Founder Mỹ phẩm Organic",
      avatarColor: "from-pink-500 to-rose-600",
      time: "34 phút trước",
      text: "Văn phong cảm xúc tự nhiên mà chạm quá, khách đọc xong tự động nhắn đặt 3 set làm quà tặng luôn ❤️",
      likes: 24,
    },
    {
      id: "c4",
      name: "Đức Thịnh",
      role: "Kinh doanh F&B",
      avatarColor: "from-amber-500 to-orange-600",
      time: "2 giờ trước",
      text: "Không đao to búa lớn nhưng đọc cực kỳ thấm. Góc viết này chạy quảng cáo rất giữ chân người xem.",
      likes: 12,
    },
  ],
  FAB: [
    {
      id: "c5",
      name: "Quốc Bảo",
      role: "Phụ kiện & Công nghệ",
      avatarColor: "from-purple-600 to-indigo-600",
      time: "15 phút trước",
      text: "Góc thông số & tính năng này trả lời đúng những câu khách hay lăn tăn nhất, chốt đơn nhanh gọn.",
      likes: 15,
    },
    {
      id: "c6",
      name: "Ngọc Lan",
      role: "Copywriter Agency",
      avatarColor: "from-cyan-600 to-blue-600",
      time: "45 phút trước",
      text: "Tiết kiệm 3 tiếng mỗi ngày cho cả team, chuẩn cấu trúc 3 góc bài viết độc bản 10/10.",
      likes: 8,
    },
  ],
};

export default function HeroSection({ user }: HeroSectionProps) {
  const [activeAngleIndex, setActiveAngleIndex] = useState(0);

  // Engagement State
  const [userLikes, setUserLikes] = useState<Record<string, boolean>>({
    PAS: false,
    "Cảm xúc": false,
    FAB: false,
  });
  const [shareCounts, setShareCounts] = useState<Record<string, number>>({
    PAS: DEMO_POSTS[0].initialShares,
    "Cảm xúc": DEMO_POSTS[1].initialShares,
    FAB: DEMO_POSTS[2].initialShares,
  });

  // In-Card Bottom Sheets State (Nhô từ dưới lên, gói gọn trong thẻ)
  const [showComments, setShowComments] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [commentsData, setCommentsData] = useState(INITIAL_COMMENTS);
  const [commentInput, setCommentInput] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  const activePost = DEMO_POSTS[activeAngleIndex];
  const isCurrentLiked = !!userLikes[activePost.tag];
  const currentPostLikes = activePost.initialLikes + (isCurrentLiked ? 1 : 0);
  const currentComments = commentsData[activePost.tag] || [];
  const totalCommentsCount =
    activePost.initialComments +
    currentComments.length -
    (INITIAL_COMMENTS[activePost.tag]?.length || 0);
  const currentSharesCount = shareCounts[activePost.tag] || activePost.initialShares;

  // Toggle Like Action
  const handleToggleLike = () => {
    setUserLikes((prev) => ({ ...prev, [activePost.tag]: !prev[activePost.tag] }));
  };

  // Toggle Comment Like
  const toggleCommentLike = (commentId: string) => {
    setCommentsData((prev) => {
      const list = prev[activePost.tag] || [];
      const updated = list.map((c) => {
        if (c.id === commentId) {
          const userLiked = !c.userLiked;
          return {
            ...c,
            userLiked,
            likes: userLiked ? c.likes + 1 : c.likes - 1,
          };
        }
        return c;
      });
      return { ...prev, [activePost.tag]: updated };
    });
  };

  // Submit New Comment
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = commentInput.trim();
    if (!trimmed) return;

    const newComment: CommentItem = {
      id: `comment-${Date.now()}`,
      name: user?.email ? user.email.split("@")[0] : "Bạn (Khách hàng)",
      role: "Chủ cửa hàng trực tuyến",
      avatarColor: "from-indigo-600 to-sky-600",
      time: "Vừa xong",
      text: trimmed,
      likes: 0,
      userLiked: false,
    };

    setCommentsData((prev) => ({
      ...prev,
      [activePost.tag]: [newComment, ...(prev[activePost.tag] || [])],
    }));
    setCommentInput("");
  };

  // Share Actions
  const handleCopyLink = async () => {
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(window.location.origin);
        setCopiedLink(true);
        setShareCounts((prev) => ({
          ...prev,
          [activePost.tag]: (prev[activePost.tag] || activePost.initialShares) + 1,
        }));
        setTimeout(() => setCopiedLink(false), 2400);
      }
    } catch {
      setCopiedLink(false);
    }
  };

  const handleFacebookShare = () => {
    if (typeof window !== "undefined") {
      const url = encodeURIComponent(window.location.origin);
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        "_blank",
        "width=600,height=500"
      );
      setShareCounts((prev) => ({
        ...prev,
        [activePost.tag]: (prev[activePost.tag] || activePost.initialShares) + 1,
      }));
    }
  };

  const primaryHref = user ? "/workspace" : "/register";

  return (
    <section className="relative overflow-x-clip py-4 sm:py-8 lg:py-0 lg:min-h-[calc(100dvh-5rem)] lg:flex lg:items-center">
      {/* 1. Background Grid Mesh Texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_20%,#000_70%,transparent_100%)]"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10 xl:gap-12">
          {/* ================= LEFT COLUMN: HERO CONTENT ================= */}
          <div className="flex flex-col items-start text-left lg:col-span-7">
            {/* Top Eyebrow Badge */}
            <ScrollReveal direction="down" duration={550}>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-3 py-1">
                <Layers3 className="h-3 w-3 text-[var(--ink-tertiary)]" />
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--ink-secondary)] sm:text-[11px]">
                  Chuẩn Anti-AI-Slop cho người bán hàng Việt
                </span>
              </div>
            </ScrollReveal>

            {/* Hero Title & Subtitle */}
            <ScrollReveal direction="up" delay={120} duration={700}>
              <h1 className="mt-3 text-balance text-3xl font-extrabold leading-[1.12] tracking-tight text-[var(--ink-primary)] sm:text-4xl lg:text-[2.85rem] xl:text-[3.25rem]">
                Tạo 3 góc bài viết bán hàng độc bản.
                <br />
                <span className="text-[var(--ink-secondary)]">
                  Không văn mẫu sáo rỗng.
                </span>
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--ink-secondary)] sm:text-base">
                Biến thông tin sản phẩm thô sơ thành 3 bài viết Facebook &amp; Instagram
                đa chiều: <span className="font-semibold text-[var(--ink-primary)]">Vấn đề &amp; Giải pháp</span>,{" "}
                <span className="font-semibold text-[var(--ink-primary)]">Cảm xúc phong cách sống</span>, và{" "}
                <span className="font-semibold text-[var(--ink-primary)]">Trực diện tính năng</span>. Đăng ngay lập tức, không mất công chỉnh sửa.
              </p>
            </ScrollReveal>

            {/* Interactive High-End CTAs */}
            <ScrollReveal direction="up" delay={240} duration={700}>
              <div className="mt-4.5 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
                <Link
                  href={primaryHref}
                  className="group inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-[var(--accent-navy)] px-6 py-3 text-sm font-semibold text-white transition-colors duration-150 ease-out hover:bg-[var(--accent-navy-hover)] sm:w-auto"
                >
                  <span>Bắt đầu sáng tạo ngay</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5" />
                </Link>

                <a
                  href="#demo"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-medium text-[var(--ink-secondary)] transition-colors duration-150 ease-out hover:text-[var(--ink-primary)] sm:w-auto"
                >
                  <PlayCircle className="h-4 w-4" />
                  <span>Xem bài viết mẫu</span>
                </a>
              </div>
            </ScrollReveal>

            {/* Trust Badges */}
            <ScrollReveal direction="up" delay={340} duration={700}>
              <div className="mt-4 flex flex-wrap items-center justify-start gap-2">
                {TRUST_ITEMS.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-2.5 py-1 text-xs text-[var(--ink-secondary)]"
                  >
                    <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                      ✓
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            {/* KeyForge-Style Metric Stats Bar */}
            <ScrollReveal direction="up" delay={420} duration={700}>
              <div className="mt-4.5 flex items-center gap-5 border-t border-[var(--border-subtle)] pt-3.5 sm:gap-8">
                <div>
                  <div className="text-xl font-extrabold tracking-tight text-[var(--ink-primary)] sm:text-2xl">
                    3.800+
                  </div>
                  <div className="mt-0.5 text-[11px] font-medium text-[var(--ink-tertiary)]">
                    Bài viết độc bản
                  </div>
                </div>
                <div className="h-7 w-px bg-[var(--border-subtle)]" />
                <div>
                  <div className="text-xl font-extrabold tracking-tight text-[var(--ink-primary)] sm:text-2xl">
                    100%
                  </div>
                  <div className="mt-0.5 text-[11px] font-medium text-[var(--ink-tertiary)]">
                    Chuẩn Anti-AI-Slop
                  </div>
                </div>
                <div className="h-7 w-px bg-[var(--border-subtle)]" />
                <div>
                  <div className="text-xl font-extrabold tracking-tight text-[var(--ink-primary)] sm:text-2xl">
                    0s
                  </div>
                  <div className="mt-0.5 text-[11px] font-medium text-[var(--ink-tertiary)]">
                    Chờ tạo bài (Pro)
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* ================= RIGHT COLUMN: INTERACTIVE 3D FACEBOOK POST SHOWCASE ================= */}
          <div className="hero-visual-container relative flex w-full items-center justify-center lg:col-span-5">
            {/* Clean Editorial Preview Card */}
            <div className="w-full max-w-[430px] select-none">
              <div className="relative overflow-hidden rounded-[1.75rem] border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-2 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.25)]">
                {/* Card Inner Face — Fixed Exact Height h-[516px] to lock layout position 100% */}
                <div className="relative z-10 flex h-[516px] flex-col overflow-hidden rounded-[calc(1.75rem-0.5rem)] border border-[var(--border-subtle)] bg-[var(--surface)] p-3.5 sm:p-4">
                  {/* 3 Interactive Angle Selector Tabs — Locked Top Position (Zero scale jitter) */}
                  <div className="mb-2.5 flex h-8.5 shrink-0 items-center gap-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)]/70 p-1">
                    {DEMO_POSTS.map((demo, idx) => (
                      <button
                        key={demo.tag}
                        type="button"
                        onClick={() => setActiveAngleIndex(idx)}
                        className={`flex-1 rounded-lg py-1 text-center text-[11px] font-semibold transition-[color,background-color,box-shadow] duration-150 touch-manipulation cursor-pointer ${
                          activeAngleIndex === idx
                            ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-800 dark:text-white"
                            : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                        }`}
                      >
                        {demo.tag}
                      </button>
                    ))}
                  </div>

                  {/* Facebook Post Header with Micro KeyForge Tech Hologram */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--ink-primary)] text-xs font-bold text-[var(--canvas)]">
                        CS
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[12.5px] font-bold text-zinc-900 dark:text-white">
                            Content Studio
                          </span>
                          <CheckCircle2 className="h-3.5 w-3.5 fill-blue-500 text-white" />
                        </div>
                        <div className="flex items-center gap-1 text-[10.5px] text-zinc-500 dark:text-zinc-400">
                          <span>Vừa xong</span>
                          <span>·</span>
                          <Globe className="h-3 w-3" />
                        </div>
                      </div>
                    </div>

                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${activePost.badgeBg}`}
                    >
                      Góc {activePost.tag}
                    </span>
                  </div>

                  {/* Facebook Post Copywriting Body — Fixed Height to prevent any height snapping */}
                  <div className="mt-2.5 h-[126px] overflow-hidden space-y-1.5 text-[12px] leading-relaxed text-zinc-800 dark:text-zinc-200 transition-opacity duration-150">
                    <p className="font-semibold text-zinc-950 dark:text-white line-clamp-2">
                      {activePost.hook}
                    </p>
                    <p className="text-zinc-700 dark:text-zinc-300 line-clamp-2 sm:line-clamp-3">
                      {activePost.body}
                    </p>
                    <p className="font-medium text-indigo-600 dark:text-indigo-400 truncate">
                      {activePost.solution}
                    </p>
                    <p className="text-[11px] font-medium text-blue-600 dark:text-blue-400 truncate">
                      {activePost.hashtags}
                    </p>
                  </div>

                  {/* Visual Media Showcase Mockup */}
                  <div className="relative mt-2.5 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-white dark:border-white/10 dark:bg-zinc-950">
                    <div className="flex items-center justify-between text-[10.5px] text-zinc-300">
                      <span className="font-mono tracking-wider">MOCKUP PREVIEW</span>
                      <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 font-semibold text-emerald-400">
                        Chuẩn 125 ký tự Hook
                      </span>
                    </div>
                    <div className="mt-1.5">
                      <div className="text-[13px] font-bold tracking-tight text-white">
                        Chiến dịch: {activePost.label}
                      </div>
                      <div className="mt-0.5 text-[11px] text-zinc-300">
                        Tự động tối ưu bảng tin Facebook &amp; Instagram Mobile
                      </div>
                    </div>
                  </div>

                  {/* Facebook Engagement Counters */}
                  <div className="mt-2 flex items-center justify-between border-b border-zinc-200/70 pb-2 text-[11px] text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                    <button
                      type="button"
                      onClick={handleToggleLike}
                      className="flex items-center gap-1.5 hover:opacity-85 transition-opacity"
                    >
                      <span className="inline-flex items-center justify-center rounded-full bg-blue-600 p-1 text-[9px] text-white">
                        👍
                      </span>
                      <span className="inline-flex items-center justify-center rounded-full bg-rose-500 p-1 text-[9px] text-white">
                        ❤️
                      </span>
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                        {currentPostLikes.toLocaleString("vi-VN")}
                      </span>
                    </button>
                    <div className="flex items-center gap-2 font-medium">
                      <button
                        type="button"
                        onClick={() => {
                          setShowComments(!showComments);
                          setShowShareModal(false);
                        }}
                        className="hover:underline hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                      >
                        {totalCommentsCount} bình luận
                      </button>
                      <span>·</span>
                      <button
                        type="button"
                        onClick={() => {
                          setShowShareModal(true);
                          setShowComments(false);
                        }}
                        className="hover:underline hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                      >
                        {currentSharesCount} chia sẻ
                      </button>
                    </div>
                  </div>

                  {/* Facebook Action Bar */}
                  <div className="mt-1 flex items-center justify-between pt-1 text-[12px] font-semibold text-zinc-600 dark:text-zinc-400">
                    <button
                      type="button"
                      onClick={handleToggleLike}
                      className={`btn-tactile flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 transition-colors touch-manipulation active:scale-95 ${
                        isCurrentLiked
                          ? "text-blue-600 dark:text-blue-400 animate-like-bounce"
                          : "hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white"
                      }`}
                    >
                      <ThumbsUp
                        className={`h-4 w-4 ${isCurrentLiked ? "fill-blue-600 dark:fill-blue-400" : ""}`}
                      />
                      <span>Thích</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowComments(!showComments);
                        setShowShareModal(false);
                      }}
                      className={`btn-tactile flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 transition-colors touch-manipulation active:scale-95 ${
                        showComments
                          ? "bg-zinc-100 text-indigo-600 dark:bg-zinc-800 dark:text-indigo-400"
                          : "hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white"
                      }`}
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>Bình luận</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowShareModal(true);
                        setShowComments(false);
                      }}
                      className="btn-tactile flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white touch-manipulation active:scale-95"
                    >
                      <Share2 className="h-4 w-4" />
                      <span>Chia sẻ</span>
                    </button>
                  </div>

                  {/* ================= IN-CARD BACKDROP ================= */}
                  <div
                    onClick={() => {
                      setShowComments(false);
                      setShowShareModal(false);
                    }}
                    className={`absolute inset-0 z-30 bg-black/45 backdrop-blur-xs transition-opacity duration-300 ${
                      showComments || showShareModal
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                    }`}
                  />

                  {/* ================= IN-CARD COMMENTS BOTTOM SHEET (Nhô từ dưới lên) ================= */}
                  <div
                    className={`absolute inset-x-0 bottom-0 z-40 flex h-[82%] flex-col rounded-t-[1.75rem] border-t border-zinc-200/90 bg-white/98 p-4 shadow-2xl backdrop-blur-md transition-transform duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] dark:border-white/10 dark:bg-[#18181B]/98 ${
                      showComments ? "translate-y-0" : "translate-y-full pointer-events-none"
                    }`}
                  >
                    {/* Pull down handle */}
                    <div
                      onClick={() => setShowComments(false)}
                      className="mx-auto -mt-1 mb-2.5 h-1.5 w-10 cursor-pointer rounded-full bg-zinc-300 hover:bg-zinc-400 dark:bg-zinc-600 dark:hover:bg-zinc-500 transition-colors"
                    />

                    {/* Sheet Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-zinc-200/70 dark:border-zinc-800">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-[12.5px] font-bold text-zinc-900 dark:text-white">
                          Bình luận ({currentComments.length})
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowComments(false)}
                        className="rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-white"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Scrollable Comment List */}
                    <div className="flex-1 space-y-2.5 overflow-y-auto py-2.5 pr-1 text-[12px] scrollbar-none">
                      {currentComments.map((c) => (
                        <div
                          key={c.id}
                          className="flex items-start gap-2.5 rounded-xl bg-zinc-50/90 p-2.5 dark:bg-zinc-900/90 border border-zinc-200/60 dark:border-white/5"
                        >
                          <div
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${c.avatarColor} text-[10.5px] font-bold text-white shadow-xs`}
                          >
                            {c.name.slice(0, 1)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline justify-between gap-1">
                              <span className="font-semibold text-zinc-900 dark:text-white text-[12px] truncate">
                                {c.name}
                              </span>
                              <span className="text-[9.5px] text-zinc-400 shrink-0">{c.time}</span>
                            </div>
                            <div className="text-[9.5px] text-zinc-400 mb-1">{c.role}</div>
                            <p className="leading-relaxed text-zinc-700 dark:text-zinc-300 text-[11.5px]">
                              {c.text}
                            </p>
                            <div className="mt-1.5 flex items-center gap-3 text-[10px] text-zinc-500">
                              <button
                                type="button"
                                onClick={() => toggleCommentLike(c.id)}
                                className={`font-semibold hover:underline ${
                                  c.userLiked ? "text-blue-600 dark:text-blue-400" : ""
                                }`}
                              >
                                Thích {c.likes > 0 && `(${c.likes})`}
                              </button>
                              <span>·</span>
                              <button
                                type="button"
                                onClick={() => setCommentInput(`@${c.name} `)}
                                className="hover:underline font-medium"
                              >
                                Trả lời
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Sticky Comment Input */}
                    <form
                      onSubmit={handleAddComment}
                      className="flex items-center gap-1.5 pt-2 border-t border-zinc-200/70 dark:border-zinc-800"
                    >
                      <input
                        type="text"
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        placeholder="Viết bình luận công khai..."
                        className="flex-1 rounded-full border border-zinc-200 bg-zinc-100/90 px-3.5 py-1.5 text-[11.5px] text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:bg-white focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800/90 dark:text-white dark:focus:bg-zinc-800"
                      />
                      <button
                        type="submit"
                        disabled={!commentInput.trim()}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white transition-opacity disabled:opacity-40 hover:bg-indigo-700"
                      >
                        <Send className="h-3.5 w-3.5" />
                      </button>
                    </form>
                  </div>

                  {/* ================= IN-CARD SHARE BOTTOM SHEET (Gói gọn trong thẻ như mô phỏng) ================= */}
                  <div
                    className={`absolute inset-x-0 bottom-0 z-40 flex flex-col rounded-t-[1.75rem] border-t border-zinc-200/90 bg-white/98 p-4 shadow-2xl backdrop-blur-md transition-transform duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] dark:border-white/10 dark:bg-[#18181B]/98 ${
                      showShareModal ? "translate-y-0" : "translate-y-full pointer-events-none"
                    }`}
                  >
                    {/* Drag pill handle */}
                    <div
                      onClick={() => setShowShareModal(false)}
                      className="mx-auto -mt-1.5 mb-2 h-1.5 w-10 cursor-pointer rounded-full bg-zinc-300 hover:bg-zinc-400 dark:bg-zinc-600 dark:hover:bg-zinc-500"
                    />

                    {/* Sheet Header */}
                    <div className="flex items-center justify-between pb-2.5 border-b border-zinc-200/70 dark:border-zinc-800">
                      <div className="flex items-center gap-2">
                        <Share2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        <h3 className="text-[12.5px] font-bold text-zinc-900 dark:text-white">
                          Chia sẻ góc bài viết ({activePost.tag})
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowShareModal(false)}
                        className="rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-white"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Share Action List */}
                    <div className="mt-3 space-y-2">
                      {/* Copy Link */}
                      <button
                        type="button"
                        onClick={handleCopyLink}
                        className="btn-tactile flex w-full items-center justify-between rounded-xl border border-zinc-200/80 bg-zinc-50/90 px-3.5 py-2.5 text-left text-[11.5px] font-semibold text-zinc-800 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/90 dark:text-zinc-200 dark:hover:bg-zinc-800"
                      >
                        <span className="flex items-center gap-2">
                          {copiedLink ? (
                            <Check className="h-3.5 w-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="h-3.5 w-3.5 text-zinc-500" />
                          )}
                          <span>
                            {copiedLink ? "Đã sao chép liên kết!" : "Sao chép liên kết bài viết"}
                          </span>
                        </span>
                        <span className="rounded-md bg-zinc-200/60 px-1.5 py-0.5 text-[9.5px] font-mono text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
                          Copy URL
                        </span>
                      </button>

                      {/* Facebook Share */}
                      <button
                        type="button"
                        onClick={handleFacebookShare}
                        className="btn-tactile flex w-full items-center justify-between rounded-xl bg-blue-600 px-3.5 py-2.5 text-left text-[11.5px] font-semibold text-white shadow-xs hover:bg-blue-700"
                      >
                        <span className="flex items-center gap-2">
                          <Globe className="h-3.5 w-3.5" />
                          <span>Chia sẻ lên Facebook</span>
                        </span>
                        <ExternalLink className="h-3 w-3 opacity-80" />
                      </button>

                      {/* Workspace Redirect */}
                      <Link
                        href={primaryHref}
                        onClick={() => setShowShareModal(false)}
                        className="btn-tactile flex w-full items-center justify-between rounded-xl border border-indigo-500/30 bg-indigo-50/90 px-3.5 py-2.5 text-left text-[11.5px] font-semibold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-300 dark:hover:bg-indigo-500/20"
                      >
                        <span className="flex items-center gap-2">
                          <Layers3 className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                          <span>Dùng mẫu trong Workspace</span>
                        </span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}