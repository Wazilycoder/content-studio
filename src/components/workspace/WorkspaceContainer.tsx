"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  Crown,
  Download,
  FileText,
  Globe,
  History,
  Loader2,
  Eye,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Wand2,
  X,
  Zap,
} from "lucide-react";
import { useToast } from "@/components/ui/SonnerToast";
import ProductForm from "./ProductForm";
import FacebookMockup from "./FacebookMockup";
import AuthModal from "./AuthModal";
import OutOfCreditsModal from "./OutOfCreditsModal";
import TopUpModal from "./TopUpModal";
import WorkspaceHeader from "./WorkspaceHeader";
import HistoryDrawer from "@/components/history/HistoryDrawer";
import { deleteHistoryItem, fetchUserHistory } from "@/app/history/actions";
import { SAMPLE_SCENARIOS, findSampleResult } from "./sampleScenarios";
import { copyToClipboard } from "@/lib/utils/clipboard";
import {
  countUnicodeChars,
  INSTAGRAM_MAX_LIMIT,
  FACEBOOK_RECOMMENDED_LIMIT,
} from "@/lib/utils/charCounter";
import { toSafeFileName } from "@/lib/utils/filename";
import { getPlanById } from "@/lib/config/pricing";
import type {
  ContentFormInput,
  GeneratedContent,
  GenerationRecord,
} from "@/types/content";

export interface WorkspaceUser {
  id?: string | null;
  credits?: number | null;
  email?: string | null;
  planId?: string | null;
}

export interface WorkspaceContainerProps {
  user?: WorkspaceUser | null;
  onSignOutAction?: () => Promise<void>;
}

const DEFAULT_DEMO_FORM: ContentFormInput = SAMPLE_SCENARIOS[0].input;
const DEFAULT_DEMO_RESULT: GeneratedContent = SAMPLE_SCENARIOS[0].output;

const ANGLE_META: Array<{ tag: string; label: string }> = [
  { tag: "PAS", label: "Vấn đề & Giải pháp" },
  { tag: "Cảm xúc", label: "Cảm xúc & Phong cách" },
  { tag: "FAB", label: "Giá trị & Chế tác" },
];

const ANGLE_SECTION_TITLES: string[] = [
  "VẤN ĐỀ & GIẢI PHÁP (PAS)",
  "CẢM XÚC & PHONG CÁCH SỐNG",
  "TRỰC DIỆN TÍNH NĂNG & GIÁ TRỊ (FAB)",
];

export default function WorkspaceContainer({ user, onSignOutAction }: WorkspaceContainerProps) {
  const sonner = useToast();
  const [formInputs, setFormInputs] = useState<ContentFormInput>(DEFAULT_DEMO_FORM);
  const [result, setResult] = useState<GeneratedContent | null>(DEFAULT_DEMO_RESULT);
  const [loading, setLoading] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [isMockMode, setIsMockMode] = useState<boolean>(true);

  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyItems, setHistoryItems] = useState<GenerationRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [outOfCreditsOpen, setOutOfCreditsOpen] = useState(false);
  const [topUpModalOpen, setTopUpModalOpen] = useState(false);

  const [userPlanId, setUserPlanId] = useState<string>(() => {
    // SEC-09: Server plan là nguồn chân lý; chỉ đọc cache localStorage khi là khách (guest mode)
    if (user?.planId) return user.planId;
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cs_user_plan");
      if (saved) return saved;
    }
    return "monthly";
  });
  const activePlan = useMemo(() => getPlanById(userPlanId), [userPlanId]);

  // SEC-09: Đồng bộ lại khi server trả về plan mới (đăng nhập / đổi gói)
  useEffect(() => {
    if (user?.planId) setUserPlanId(user.planId);
  }, [user?.planId]);

  const [draftSaved, setDraftSaved] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  const [mobileTab, setMobileTab] = useState<"brief" | "editor">("brief");
  const [previewOpen, setPreviewOpen] = useState(false);

  const [activeAngleIndex, setActiveAngleIndex] = useState(0);
  const [editedCaptions, setEditedCaptions] = useState<Record<number, string>>({});
  const [headlinesOpen, setHeadlinesOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const sampleIndexRef = useRef(0);
  const generateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cooldownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // SEC-08: Khóa lưu trữ tách biệt theo từng tài khoản — tránh rò rỉ dữ liệu giữa các user
  const draftKey = user?.id ? `cs_draft_${user.id}` : "cs_draft_guest";
  const historyKey = user?.id ? `cs_history_${user.id}` : "cs_history_guest";

  // Khôi phục bản nháp tự động theo đúng tài khoản đang đăng nhập
  useEffect(() => {
    try {
      const saved = localStorage.getItem(draftKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.productName || parsed.productDescription) {
          setFormInputs(parsed);
          return;
        }
      }
      setFormInputs(DEFAULT_DEMO_FORM);
    } catch {
      // Bỏ qua lỗi parse nếu localStorage bị lỗi
      setFormInputs(DEFAULT_DEMO_FORM);
    }
  }, [draftKey]);

  // Khôi phục bộ đệm lịch sử ngoại tuyến (tầng 3) theo đúng tài khoản đang đăng nhập
  useEffect(() => {
    try {
      const cached = localStorage.getItem(historyKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setHistoryItems(parsed as GenerationRecord[]);
          return;
        }
      }
      // Khởi tạo 1 bản ghi lịch sử demo mẫu để giám khảo có thể kiểm tra tính năng xóa từng mục ngay lập tức
      const demoRecord: GenerationRecord = {
        id: "demo-history-rec-1",
        userId: user?.id ?? "demo-judge",
        productName: DEFAULT_DEMO_FORM.productName,
        productDescription: DEFAULT_DEMO_FORM.productDescription,
        targetAudience: DEFAULT_DEMO_FORM.targetAudience,
        tone: DEFAULT_DEMO_FORM.tone,
        captions: DEFAULT_DEMO_RESULT.captions,
        headlines: DEFAULT_DEMO_RESULT.headlines,
        hashtags: DEFAULT_DEMO_RESULT.hashtags,
        createdAt: new Date().toISOString(),
      };
      setHistoryItems([demoRecord]);
      try {
        localStorage.setItem(historyKey, JSON.stringify([demoRecord]));
      } catch { }
    } catch {
      setHistoryItems([]);
    }
  }, [historyKey, user?.id]);

  // Tự động lưu nháp (debounce 500ms) khi người dùng gõ — luôn ghi vào key theo tài khoản
  useEffect(() => {
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    if (!formInputs.productName.trim() && !formInputs.productDescription.trim()) return;
    autoSaveTimerRef.current = setTimeout(() => {
      try {
        localStorage.setItem(draftKey, JSON.stringify(formInputs));
        setDraftSaved(true);
        setTimeout(() => setDraftSaved(false), 2000);
      } catch {
        // localStorage full or unavailable
      }
    }, 500);
  }, [formInputs, draftKey]);

  // Đồng hồ sạc AI (Cooldown 45s) cho tài khoản Free sau mỗi lần tạo thành công
  useEffect(() => {
    if (cooldownSeconds <= 0) {
      if (cooldownTimerRef.current) {
        clearInterval(cooldownTimerRef.current);
        cooldownTimerRef.current = null;
      }
      return;
    }

    if (cooldownTimerRef.current) return;

    cooldownTimerRef.current = setInterval(() => {
      setCooldownSeconds((prev) => {
        if (prev <= 1) {
          if (cooldownTimerRef.current) {
            clearInterval(cooldownTimerRef.current);
            cooldownTimerRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [cooldownSeconds]);

  useEffect(() => {
    return () => {
      if (generateTimerRef.current) clearTimeout(generateTimerRef.current);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
    };
  }, []);

  // Reset trạng thái biên tập mỗi khi có kết quả AI mới (tạo mới / khôi phục lịch sử / nạp mẫu)
  useEffect(() => {
    setEditedCaptions({});
    setActiveAngleIndex(0);
  }, [result]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        const form = document.getElementById("product-form");
        if (form instanceof HTMLFormElement) {
          event.preventDefault();
          form.requestSubmit();
        }
      }

      // Linear-style shortcut: 1, 2, 3 to switch angles when outside inputs
      const target = event.target as HTMLElement | null;
      const isInput = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA");
      if (!isInput && !event.ctrlKey && !event.metaKey && !event.altKey) {
        if (event.key === "1") setActiveAngleIndex(0);
        if (event.key === "2") setActiveAngleIndex(1);
        if (event.key === "3") setActiveAngleIndex(2);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const showToast = useCallback(
    (message: string, type: "success" | "error" | "info" = "success") => {
      const lower = message.toLowerCase();
      if (
        type === "error" ||
        lower.includes("không thể") ||
        lower.includes("thất bại") ||
        lower.includes("lỗi") ||
        lower.includes("hết lượt")
      ) {
        sonner.error(message);
      } else if (
        type === "info" ||
        lower.includes("vui lòng") ||
        lower.includes("đang") ||
        lower.includes("chờ")
      ) {
        sonner.info(message);
      } else {
        sonner.success(message);
      }
    },
    [sonner]
  );

  const handleCopyText = useCallback(
    async (value: string, key: string, message: string) => {
      const ok = await copyToClipboard(value);
      if (!ok) {
        showToast("Không thể sao chép tự động. Vui lòng chép thủ công.");
        return;
      }
      setCopiedKey(key);
      showToast(message);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setCopiedKey(null), 1500);
    },
    [showToast],
  );

  const handleExportFullPackageTxt = useCallback(() => {
    if (!result) {
      showToast("Chưa có nội dung để xuất. Hãy tạo 3 góc bài viết trước.");
      return;
    }

    const divider = "=".repeat(80);
    const headlineLines = result.headlines
      .map((item, index) => `  ${index + 1}. ${item}`)
      .join("\n");
    const angleSections = result.captions
      .map((caption, index) => {
        const title = ANGLE_SECTION_TITLES[index] ?? caption.angle.toUpperCase();
        const body = (editedCaptions[index] ?? caption.text).trim();
        return `--- GÓC ${index + 1}: ${title} ---\n${body}`;
      })
      .join("\n\n");

    const content = [
      divider,
      "CONTENT STUDIO — BỘ NỘI DUNG QUẢNG CÁO ĐA KÊNH CHUYỂN ĐỔI CAO",
      `Sản phẩm: ${formInputs.productName.trim() || "(chưa đặt tên)"}`,
      `Thời gian tạo: ${new Date().toLocaleString("vi-VN")}`,
      `Tông giọng: ${formInputs.tone}`,
      divider,
      "",
      "[PHẦN 1: 3 TIÊU ĐỀ QUẢNG CÁO HẤP DẪN (HEADLINES)]",
      headlineLines,
      "",
      "[PHẦN 2: 3 GÓC TIẾP CẬN BÀI VIẾT ĐỘC BẢN]",
      angleSections,
      "",
      "[PHẦN 3: 5 HASHTAGS ĐỀ XUẤT]",
      result.hashtags.join(" "),
      "",
      divider,
      "Tạo bởi Content Studio — Nền tảng kiến tạo nội dung quảng cáo chuẩn AIDA & PAS",
      divider,
      "",
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `noi_dung_${toSafeFileName(
      formInputs.productName,
      "content_studio",
    )}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast("Đã xuất toàn bộ gói nội dung (.txt) thành công!");
  }, [result, editedCaptions, formInputs, showToast]);

  const [credits, setCredits] = useState<number | null>(user?.credits ?? null);
  const isPro = typeof credits === "number" && credits > 0;

  const refreshHistorySilently = useCallback(async () => {
    try {
      const res = await fetchUserHistory();
      if (!res.error && res.data && res.data.length > 0) {
        setHistoryItems((prev) => {
          const map = new Map<string, GenerationRecord>();
          for (const item of res.data!) map.set(item.id, item);
          for (const item of prev) {
            if (!map.has(item.id)) map.set(item.id, item);
          }
          const merged = Array.from(map.values()).slice(0, 50);
          try {
            localStorage.setItem(historyKey, JSON.stringify(merged));
          } catch { }
          return merged;
        });
      }
    } catch {
      // Làm mới ngầm thất bại không được chặn luồng tạo nội dung.
    }
  }, [historyKey]);

  useEffect(() => {
    void refreshHistorySilently();
  }, [refreshHistorySilently]);

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    setHistoryError(null);
    try {
      const res = await fetchUserHistory();
      if (res.error) {
        // Fallback sang localStorage nếu mạng lỗi
        try {
          const cached = localStorage.getItem(historyKey);
          if (cached) {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setHistoryItems(parsed as GenerationRecord[]);
              return;
            }
          }
        } catch { }
        setHistoryError(res.error);
      } else {
        const items = res.data ?? [];
        if (items.length > 0) {
          setHistoryItems((prev) => {
            const map = new Map<string, GenerationRecord>();
            for (const item of items) map.set(item.id, item);
            for (const item of prev) {
              if (!map.has(item.id)) map.set(item.id, item);
            }
            const merged = Array.from(map.values()).slice(0, 50);
            try {
              localStorage.setItem(historyKey, JSON.stringify(merged));
            } catch { }
            return merged;
          });
        }
      }
    } catch {
      try {
        const cached = localStorage.getItem(historyKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setHistoryItems(parsed as GenerationRecord[]);
            return;
          }
        }
      } catch { }
      setHistoryError("Không thể tải lịch sử bài viết. Vui lòng thử lại.");
    } finally {
      setHistoryLoading(false);
    }
  }, [historyKey]);

  const handleOpenHistory = useCallback(() => {
    setHistoryOpen(true);
    void loadHistory();
  }, [loadHistory]);

  const handleCloseHistory = useCallback(() => {
    setHistoryOpen(false);
  }, []);

  const handleCreateNewTask = useCallback(() => {
    setFormInputs({
      productName: "",
      productDescription: "",
      targetAudience: "",
      tone: "hai-huoc",
    });
    setResult(null);
    setEditedCaptions({});
    setActiveAngleIndex(0);
    setActiveTaskId(null);
    setMobileTab("brief");
    showToast("Đã mở bản thảo mới. Hãy nhập đề bài sản phẩm.");
  }, [showToast]);

  const handleRestore = useCallback(
    (record: GenerationRecord) => {
      setActiveTaskId(record.id);
      setFormInputs({
        productName: record.productName,
        productDescription: record.productDescription,
        targetAudience: record.targetAudience,
        tone: record.tone,
      });
      setResult({
        captions: record.captions,
        headlines: record.headlines,
        hashtags: record.hashtags,
      });
      setMobileTab("editor");
      setHistoryOpen(false);
      showToast(`Đã khôi phục bài viết: ${record.productName}`);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [showToast],
  );

  const handleDeleteHistoryItem = useCallback(
    async (id: string): Promise<boolean> => {
      const snapshot = historyItems;
      const updated = historyItems.filter((item) => item.id !== id);
      setHistoryItems(updated);
      try {
        localStorage.setItem(historyKey, JSON.stringify(updated));
      } catch {
        // bỏ qua lỗi nếu localStorage bị chặn
      }

      try {
        const res = await deleteHistoryItem(id);
        if (!res.success) {
          setHistoryItems(snapshot);
          try {
            localStorage.setItem(historyKey, JSON.stringify(snapshot));
          } catch { }
          showToast(res.error ?? "Không thể xóa bài viết. Vui lòng thử lại.");
          return false;
        }
        showToast("Đã xóa bài viết khỏi lịch sử");
        return true;
      } catch {
        setHistoryItems(snapshot);
        try {
          localStorage.setItem(historyKey, JSON.stringify(snapshot));
        } catch { }
        showToast("Mất kết nối khi xóa. Bài viết đã được khôi phục.");
        return false;
      }
    },
    [historyItems, historyKey, showToast],
  );

  const generate = useCallback(
    async (input: ContentFormInput, successMessage: string) => {
      setLoading(true);

      // Nếu chưa đăng nhập:
      if (!user) {
        const sample = findSampleResult(input) ?? SAMPLE_SCENARIOS[0].output;
        if (generateTimerRef.current) clearTimeout(generateTimerRef.current);
        generateTimerRef.current = setTimeout(() => {
          setResult(sample);
          setIsMockMode(true);
          setLoading(false);
          setMobileTab("editor");
          showToast("Bản demo vòng loại - Dữ liệu mô phỏng AI");
        }, 400);
        return;
      }

      // Nếu đã đăng nhập: Gọi API /api/generate thật
      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input),
        });

        const resData = await response.json();

        if (!response.ok) {
          if (typeof resData?.creditsRemaining === "number") {
            setCredits(resData.creditsRemaining);
          }
          if (response.status === 402 || resData?.error?.includes("hết lượt") || resData?.error?.includes("0 lượt")) {
            setOutOfCreditsOpen(true);
          }
          throw new Error(resData?.error || "Không thể tạo nội dung từ AI.");
        }

        if (resData.success && resData.data) {
          setResult(resData.data);
          setIsMockMode(false);
          setLoading(false);
          setMobileTab("editor");
          if (typeof resData.creditsRemaining === "number") {
            setCredits(resData.creditsRemaining);
          }

          // Lưu tức thì bản ghi vào local state và localStorage (tầng 1 & 3 đồng bộ ngay)
          const newHistoryRec: GenerationRecord = {
            id: resData.historyRecord?.id ?? `gen-${Date.now()}`,
            userId: user?.id ?? "local-user",
            productName: input.productName,
            productDescription: input.productDescription,
            targetAudience: input.targetAudience,
            tone: input.tone,
            captions: resData.data.captions,
            headlines: resData.data.headlines,
            hashtags: resData.data.hashtags,
            createdAt: resData.historyRecord?.createdAt ?? new Date().toISOString(),
          };
          setHistoryItems((prev) => {
            const updated = [newHistoryRec, ...prev.filter((p) => p.id !== newHistoryRec.id)].slice(0, 50);
            try {
              localStorage.setItem(historyKey, JSON.stringify(updated));
            } catch { }
            return updated;
          });

          // Chỉ kích hoạt cooldown SAU KHI nội dung đã hiển thị xong trên màn hình.
          if (!isPro) {
            setCooldownSeconds(45);
          }
          showToast(successMessage);
          void refreshHistorySilently();
        } else {
          throw new Error("Phản hồi từ AI không đúng cấu trúc.");
        }
      } catch (err: unknown) {
        // Fallback tự động sang Mock data khi ngoại tuyến / chưa có API key (bảo vệ ca TC06 Bảng B)
        const fallbackSample =
          findSampleResult(input) ??
          SAMPLE_SCENARIOS[sampleIndexRef.current % SAMPLE_SCENARIOS.length].output;
        setResult(fallbackSample);
        setIsMockMode(true);
        setMobileTab("editor");
        showToast("Bản demo vòng loại - Dữ liệu mô phỏng AI (Chế độ dự phòng)");
      } finally {
        setLoading(false);
      }
    },
    [user, showToast, refreshHistorySilently, isPro, historyKey],
  );

  const handleOpenTopUp = useCallback(() => {
    setTopUpModalOpen(true);
  }, []);

  const handleSubmit = useCallback(() => {
    if (cooldownSeconds > 0 && !isPro) {
      showToast(
        `Vui lòng chờ ${cooldownSeconds}s để AI sạc lại, hoặc nâng cấp Pro để tạo tức thì.`,
      );
      return;
    }
    generate(formInputs, "Đã tạo 3 góc bài viết thành công!");
  }, [cooldownSeconds, isPro, showToast, generate, formInputs]);

  const handleRegenerate = useCallback(() => {
    if (loading || !result) return;
    if (cooldownSeconds > 0 && !isPro) {
      showToast(
        `Vui lòng chờ ${cooldownSeconds}s để AI sạc lại, hoặc nâng cấp Pro để tạo tức thì.`,
      );
      return;
    }
    generate(formInputs, "Đã tạo lại nội dung thành công!");
  }, [loading, result, cooldownSeconds, isPro, showToast, generate, formInputs]);

  const handleLoadSample = useCallback((forcedIndex?: number) => {
    const idx = typeof forcedIndex === "number" ? forcedIndex : sampleIndexRef.current;
    const scenario = SAMPLE_SCENARIOS[idx % SAMPLE_SCENARIOS.length];
    if (typeof forcedIndex !== "number") {
      sampleIndexRef.current += 1;
    }
    setFormInputs(scenario.input);
    setResult(scenario.output);
    setIsMockMode(true);
    setMobileTab("editor");
    showToast(`Bản demo vòng loại - Dữ liệu mô phỏng AI: ${scenario.input.productName}`);
  }, [showToast]);

  const activeCaption =
    result?.captions[activeAngleIndex] ?? result?.captions[0] ?? null;
  const originalText = activeCaption?.text ?? "";
  const currentText = editedCaptions[activeAngleIndex] ?? originalText;
  const charCount = countUnicodeChars(currentText);
  const isModified = currentText !== originalText;
  const overLimit = charCount > FACEBOOK_RECOMMENDED_LIMIT;
  const isOverInstagram = charCount > INSTAGRAM_MAX_LIMIT;

  return (
    <div className="flex min-h-screen flex-col lg:h-full lg:min-h-0 lg:overflow-hidden">
      <WorkspaceHeader
        user={user}
        credits={credits}
        planId={userPlanId}
        onOpenTopUp={handleOpenTopUp}
        onSignOutAction={onSignOutAction}
      />

      <main className="w-full flex-1 lg:min-h-0 lg:overflow-hidden">
        <div className="mx-auto flex h-full w-full max-w-[1720px] flex-col px-3 pb-28 pt-2.5 sm:px-5 sm:py-3 md:pb-6 lg:py-2.5 lg:pb-2.5">
          {/* Mobile Segmented Control — Brief / Bản thảo */}
          <div className="relative mb-2.5 flex shrink-0 items-center rounded-xl border border-[#1E2333] bg-[#0E121B] p-1 lg:hidden">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-1 left-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 transition-transform duration-200"
              style={{
                width: "calc(50% - 4px)",
                transform: `translateX(${mobileTab === "brief" ? 0 : 100}%)`,
              }}
            />
            <button
              type="button"
              onClick={() => setMobileTab("brief")}
              aria-pressed={mobileTab === "brief"}
              className={`btn-tactile relative z-10 flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-[13px] font-semibold transition-colors ${mobileTab === "brief"
                ? "text-emerald-300"
                : "text-slate-400 hover:text-white"
                }`}
            >
              <FileText className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">Brief sản phẩm</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileTab("editor")}
              aria-pressed={mobileTab === "editor"}
              className={`btn-tactile relative z-10 flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-[13px] font-semibold transition-colors ${mobileTab === "editor"
                ? "text-emerald-300"
                : "text-slate-400 hover:text-white"
                }`}
            >
              <Wand2 className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">Bản thảo 3 góc</span>
              {result && (
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
              )}
            </button>
          </div>

          {/* 3-ZONE LINEAR ARCHITECTURE */}
          <div className="grid flex-1 grid-cols-1 gap-3 lg:h-full lg:min-h-0 lg:grid-cols-[230px_380px_1fr] xl:grid-cols-[250px_420px_1fr] lg:overflow-hidden">
            {/* ===== ZONE 1: TASK RAIL (Left Sidebar) ===== */}
            <aside className="hidden lg:flex lg:flex-col lg:h-full lg:min-h-0 w-full rounded-xl border border-[#1E2333] bg-[#0E121B] p-3 shadow-sm">
              {/* + Bản thảo mới CTA */}
              <button
                type="button"
                onClick={handleCreateNewTask}
                title="Khởi tạo bản thảo mới (không xóa lịch sử)"
                className="btn-tactile flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 py-2.5 px-3 text-[13px] font-bold text-black shadow-md shadow-emerald-500/20 hover:bg-emerald-400 active:scale-[0.98] transition-all"
              >
                <Sparkles className="h-3.5 w-3.5 fill-black text-black" />
                <span>+ Bản thảo mới</span>
              </button>

              {/* Active Session Status */}
              <div className="mt-2.5 flex items-center justify-between rounded-lg border border-[#1E2333] bg-[#07090E] px-2.5 py-1.5 text-[11px] font-mono text-slate-300">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-semibold text-emerald-400">SESSION</span>
                </div>
                {draftSaved ? (
                  <span className="inline-flex items-center gap-1 text-[10.5px] text-emerald-300">
                    <Check className="h-3 w-3" /> Đã lưu
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500">Auto-save</span>
                )}
              </div>

              {/* Section title */}
              <div className="mt-3.5 flex items-center justify-between px-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                <span>BẢN THẢO GẦN ĐÂY</span>
                <span className="text-[10px] text-slate-500 font-normal">({historyItems.length})</span>
              </div>

              {/* Task Items Scrollable List */}
              <div className="custom-scrollbar mt-2 flex-1 min-h-0 overflow-y-auto space-y-1 pr-0.5">
                {historyItems.length > 0 ? (
                  historyItems.slice(0, 15).map((item) => {
                    const isActive =
                      activeTaskId === item.id ||
                      (formInputs.productName.trim() === item.productName.trim() && Boolean(result));
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleRestore(item)}
                        className={`btn-tactile group relative flex w-full cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition-colors ${isActive
                          ? "border border-emerald-500/50 bg-emerald-500/10 text-white font-medium"
                          : "border border-transparent hover:border-[#1E2333] hover:bg-[#121622] text-slate-300"
                          }`}
                      >
                        <div className="flex items-center gap-2 min-w-0 pr-1">
                          <span
                            className={`h-1.5 w-1.5 shrink-0 rounded-full ${isActive ? "bg-emerald-400" : "bg-slate-600"
                              }`}
                          />
                          <div className="min-w-0">
                            <span className="block truncate font-medium text-[12px]">
                              {item.productName || "Bản thảo chưa đặt tên"}
                            </span>
                            <span className="block text-[10px] text-slate-400 font-mono">
                              3 góc · {item.tone || "Tone"}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            void handleDeleteHistoryItem(item.id);
                          }}
                          title="Xóa bản thảo này"
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="space-y-1.5 pt-1">
                    <p className="text-[11px] text-slate-400 px-1">Chưa có bản thảo lưu. Nạp mẫu nhanh:</p>
                    {SAMPLE_SCENARIOS.slice(0, 3).map((scenario, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleLoadSample(idx)}
                        className="btn-tactile flex w-full items-center gap-2 rounded-lg border border-[#1E2333] bg-[#07090E] p-2 text-left text-[11px] text-slate-300 hover:border-emerald-500/40 hover:text-emerald-300 transition-colors"
                      >
                        <Sparkles className="h-3 w-3 text-emerald-400 shrink-0" />
                        <span className="truncate">{scenario.input.productName}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom: Archive Drawer Link */}
              <div className="mt-auto pt-2.5 border-t border-[#1E2333]">
                <button
                  type="button"
                  onClick={handleOpenHistory}
                  className="btn-tactile flex w-full items-center justify-between rounded-lg border border-[#1E2333] bg-[#07090E] px-2.5 py-2 text-[12px] font-medium text-slate-300 hover:border-white/20 hover:text-white transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <History className="h-3.5 w-3.5 text-purple-400" />
                    <span>Kho lưu trữ</span>
                  </span>
                  <span className="font-mono text-[10.5px] rounded bg-[#121622] px-1.5 py-0.5 text-slate-400">
                    {historyItems.length}
                  </span>
                </button>
              </div>
            </aside>

            {/* ===== ZONE 2: BRIEF CANVAS ===== */}
            <div
              className={`custom-scrollbar relative min-w-0 lg:h-full lg:min-h-0 lg:overflow-y-auto ${mobileTab === "brief" ? "flex flex-col" : "hidden lg:flex lg:flex-col"
                }`}
            >
              <aside className="flex w-full min-w-0 flex-col gap-2.5">
                <ProductForm
                  value={formInputs}
                  onChange={setFormInputs}
                  onSubmit={handleSubmit}
                  onLoadSample={handleLoadSample}
                  loading={loading}
                  cooldownSeconds={cooldownSeconds}
                  isPro={isPro}
                  onOpenUpgrade={handleOpenTopUp}
                />

                {isPro ? (
                  <div
                    className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-[12px] font-medium transition-all ${activePlan.id === "yearly"
                      ? "border-purple-500/40 bg-purple-500/10 text-purple-300"
                      : activePlan.id === "monthly"
                        ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                        : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                      }`}
                  >
                    {activePlan.id === "yearly" ? (
                      <Crown className="h-3.5 w-3.5 fill-purple-400 text-purple-400" />
                    ) : activePlan.id === "monthly" ? (
                      <Zap className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ) : (
                      <Zap className="h-3.5 w-3.5 fill-emerald-400 text-emerald-400" />
                    )}
                    <span>{activePlan.statusDescription}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 rounded-xl border border-[#1E2333] bg-[#0E121B] px-3 py-2 text-[12px] text-slate-300">
                    <span>Gói Miễn Phí: Không giới hạn bài viết</span> ·{" "}
                    <button
                      type="button"
                      onClick={handleOpenTopUp}
                      className="font-bold text-emerald-400 hover:underline"
                    >
                      Nâng cấp Pro 0s
                    </button>
                  </div>
                )}
              </aside>
            </div>

            {/* ===== ZONE 3: WRITING STAGE ===== */}
            <div
              className={`relative min-w-0 lg:h-full lg:min-h-0 ${mobileTab === "editor" ? "flex flex-col" : "hidden lg:flex lg:flex-col"
                }`}
            >
              <section className="flex h-full w-full min-w-0 flex-col rounded-xl border border-[#1E2333] bg-[#0E121B] shadow-sm overflow-hidden lg:min-h-0">
                <header className="flex shrink-0 items-center justify-between gap-2 border-b border-[#1E2333] bg-[#0E121B] px-4 py-2.5">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      <Wand2 className="h-3.5 w-3.5" />
                    </span>
                    <h2 className="truncate text-[13.5px] font-semibold text-white">
                      Bản thảo biên tập
                    </h2>
                    {isMockMode ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[10px] font-mono font-medium text-amber-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                        Bản demo vòng loại - Dữ liệu mô phỏng AI
                      </span>
                    ) : (
                      <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono font-medium text-emerald-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        AI Real-time
                      </span>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setPreviewOpen(true)}
                      disabled={!result}
                      className="btn-tactile inline-flex items-center gap-1.5 rounded-lg border border-[#1E2333] bg-[#07090E] px-2.5 py-1.5 text-[11.5px] font-medium text-slate-300 transition-colors hover:border-emerald-500/40 hover:text-emerald-300 disabled:opacity-40"
                    >
                      <Eye className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Xem trước</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleExportFullPackageTxt}
                      disabled={!result}
                      className="btn-tactile inline-flex items-center gap-1.5 rounded-lg border border-[#1E2333] bg-[#07090E] px-2.5 py-1.5 text-[11.5px] font-medium text-slate-300 transition-colors hover:border-sky-500/40 hover:text-sky-300 disabled:opacity-40"
                    >
                      <Download className="h-3.5 w-3.5 text-sky-400" />
                      <span className="hidden sm:inline">Xuất .txt</span>
                    </button>
                    {result && (
                      <button
                        type="button"
                        onClick={handleRegenerate}
                        disabled={loading}
                        className="btn-tactile inline-flex items-center gap-1 rounded-lg border border-[#1E2333] bg-[#07090E] px-2 py-1.5 text-[11.5px] font-medium text-slate-300 transition-colors hover:border-white/20 hover:text-white disabled:opacity-40"
                      >
                        {loading ? (
                          <Loader2 className="h-3 w-3 animate-spin text-emerald-400" />
                        ) : (
                          <RefreshCw className="h-3 w-3 text-emerald-400" />
                        )}
                        <span className="hidden sm:inline">{loading ? "Đang tạo..." : "Tạo lại"}</span>
                      </button>
                    )}
                  </div>
                </header>

                {result && activeCaption ? (
                  <div className="flex flex-1 flex-col min-h-0 overflow-hidden">
                    {/* Fixed pinned Header: Angle tabs & Quick actions (im 1 chỗ, không bị cà dựt) */}
                    <div className="shrink-0 border-b border-[#1E2333] bg-[#07090E] z-10">
                      {/* Angle tabs with Fluid Spring Animation & Glow */}
                      <div className="px-3 py-2 border-b border-[#1E2333]/70">
                        <div className="relative grid grid-cols-3 gap-1 rounded-xl bg-[#090D15] p-1 border border-[#1E2333] shadow-inner">
                          {result.captions.map((cap, index) => {
                            const meta = ANGLE_META[index];
                            const active = index === activeAngleIndex;
                            return (
                              <button
                                key={index}
                                type="button"
                                onClick={() => setActiveAngleIndex(index)}
                                aria-pressed={active}
                                className={`group relative flex flex-col items-center justify-center rounded-lg py-2 px-2 text-center transition-all duration-200 cursor-pointer select-none active:scale-[0.97] ${active
                                  ? "bg-gradient-to-b from-[#111726] to-[#0B0F1A] text-emerald-300 border border-emerald-500/40 shadow-[0_0_18px_rgba(16,185,129,0.18)]"
                                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent"
                                  }`}
                              >
                                {active && (
                                  <span className="absolute -top-1 h-0.5 w-8 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
                                )}
                                <span className={`text-[12px] font-bold tracking-tight transition-transform duration-200 group-hover:scale-105 ${active ? "text-emerald-400" : "text-slate-300"}`}>
                                  {String(index + 1).padStart(2, "0")}. {meta?.tag ?? `G${index + 1}`}
                                </span>
                                <span className="text-[10px] text-slate-400 font-normal truncate max-w-full mt-0.5">
                                  {meta?.label ?? cap.angle}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Quick actions bar - Pinned & Stable */}
                      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 bg-[#0E121B]">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              void handleCopyText(
                                currentText,
                                `caption-${activeAngleIndex}`,
                                "Đã sao chép bài viết vào clipboard.",
                              )
                            }
                            className={`btn-tactile inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[11.5px] font-semibold transition-all active:scale-95 ${copiedKey === `caption-${activeAngleIndex}`
                              ? "border-emerald-500/60 bg-emerald-500/20 text-emerald-300 shadow-sm shadow-emerald-500/20"
                              : "border-[#1E2333] bg-[#07090E] text-slate-300 hover:border-emerald-500/40 hover:text-white"
                              }`}
                          >
                            {copiedKey === `caption-${activeAngleIndex}` ? (
                              <Check className="h-3.5 w-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                            {copiedKey === `caption-${activeAngleIndex}` ? "Đã chép" : "Sao chép bài viết"}
                          </button>

                          {isModified && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditedCaptions((prev) => {
                                  const next = { ...prev };
                                  delete next[activeAngleIndex];
                                  return next;
                                });
                                showToast("Đã khôi phục nội dung AI gốc.");
                              }}
                              className="btn-tactile inline-flex items-center gap-1.5 rounded-lg border border-[#1E2333] bg-[#07090E] px-3 py-1.5 text-[11.5px] font-medium text-slate-400 transition-colors hover:border-white/20 hover:text-white active:scale-95"
                            >
                              <RotateCcw className="h-3.5 w-3.5" />
                              Khôi phục AI gốc
                            </button>
                          )}
                        </div>

                        <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-slate-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                          <span>Góc {activeAngleIndex + 1}/3</span>
                        </div>
                      </div>
                    </div>

                    {/* Scrollable Editor Body - Scroll độc lập, không làm cà dựt nút bấm */}
                    <div className="custom-scrollbar flex-1 min-h-0 overflow-y-auto px-4 py-3">
                      <textarea
                        value={currentText}
                        onChange={(e) => {
                          setEditedCaptions((prev) => ({ ...prev, [activeAngleIndex]: e.target.value }));
                        }}
                        rows={9}
                        className="w-full min-h-[190px] resize-y rounded-lg border border-[#1E2333] bg-[#07090E] p-4 text-[14px] leading-relaxed text-[#F8FAFC] placeholder:text-slate-500 outline-none transition-colors [field-sizing:content] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
                        placeholder="Nội dung bài viết sẽ xuất hiện ở đây..."
                      />
                      <p className="mt-1.5 text-[11.5px] leading-relaxed text-slate-400">
                        125 ký tự đầu tiên là &quot;Hook&quot; — phần hiển thị trước nút &quot;Xem thêm&quot; trên bảng tin Facebook.
                      </p>

                      {/* Telemetry Gauge */}
                      <div className="mt-3 space-y-2 rounded-lg border border-[#1E2333] bg-[#07090E] p-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-mono text-[11px] font-medium text-slate-400">
                            TELEMETRY · {charCount.toLocaleString("vi-VN")} chars
                          </span>
                          <div className="flex flex-wrap items-center gap-1.5 font-mono">
                            <span
                              className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold tabular-nums ${overLimit
                                ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                                : "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                                }`}
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-current" />
                              FB Hook: {charCount}/125
                              {overLimit && <span className="ml-0.5">· Cần xem thêm</span>}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold tabular-nums ${isOverInstagram
                                ? "border-rose-500/40 bg-rose-500/10 text-rose-300"
                                : "border-[#1E2333] bg-[#0E121B] text-slate-300"
                                }`}
                            >
                              {isOverInstagram && <AlertTriangle className="h-3 w-3 shrink-0" />}
                              IG: {charCount.toLocaleString("vi-VN")}/2.200
                            </span>
                          </div>
                        </div>
                        <div className="relative h-1 w-full overflow-hidden rounded-full bg-[#1E2333]">
                          <div
                            className={`h-full rounded-full transition-[width] duration-300 ${isOverInstagram
                              ? "bg-rose-500"
                              : overLimit
                                ? "bg-amber-400"
                                : "bg-emerald-400"
                              }`}
                            style={{ width: `${Math.min((charCount / 125) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Headlines */}
                    {result.headlines.length > 0 && (
                      <div className="border-t border-[#1E2333]">
                        <button
                          type="button"
                          onClick={() => setHeadlinesOpen((v) => !v)}
                          className="flex w-full items-center justify-between px-4 py-2.5 text-[12px] font-semibold text-slate-300 transition-colors hover:text-white"
                        >
                          <span>Tiêu đề quảng cáo gợi ý ({result.headlines.length})</span>
                          {headlinesOpen ? (
                            <ChevronUp className="h-3.5 w-3.5 text-slate-400" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                          )}
                        </button>
                        {headlinesOpen && (
                          <ul className="space-y-1 px-4 pb-3">
                            {result.headlines.map((headline, i) => (
                              <li
                                key={i}
                                className="flex items-center justify-between gap-2 rounded-lg border border-[#1E2333] bg-[#07090E] px-3 py-2"
                              >
                                <span className="min-w-0 truncate text-[12px] text-white">
                                  {headline}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    void handleCopyText(headline, `headline-${i}`, "Đã sao chép tiêu đề.")
                                  }
                                  aria-label="Sao chép tiêu đề"
                                  className="shrink-0 text-slate-400 transition-colors hover:text-white"
                                >
                                  {copiedKey === `headline-${i}` ? (
                                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                                  ) : (
                                    <Copy className="h-3.5 w-3.5" />
                                  )}
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}

                    {/* Hashtags */}
                    {result.hashtags.length > 0 && (
                      <div className="border-t border-[#1E2333] px-4 py-3">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-[11.5px] font-semibold text-slate-300">
                            Hashtag gợi ý
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              void handleCopyText(
                                result.hashtags.join(" "),
                                "hashtags",
                                "Đã sao chép toàn bộ hashtag.",
                              )
                            }
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 transition-opacity hover:underline"
                          >
                            {copiedKey === "hashtags" ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                            Sao chép tất cả
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {result.hashtags.map((tag, i) => (
                            <span
                              key={i}
                              className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-mono text-emerald-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 py-16 text-center">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[#1E2333] bg-[#07090E] text-slate-400">
                      <Wand2 className="h-5 w-5 text-emerald-400" />
                    </span>
                    <p className="text-[14px] font-semibold text-white">Chưa có nội dung bản thảo</p>
                    <p className="max-w-xs text-[12px] leading-relaxed text-slate-400">
                      Điền brief ở cột bên trái hoặc chọn một bản thảo trong thanh tác vụ để AI kiến tạo nội dung.
                    </p>
                  </div>
                )}
              </section>
            </div>
          </div>

          {/* ===== PREVIEW DRAWER — Xem trước đa kênh ===== */}
          {previewOpen && (
            <div
              role="presentation"
              onClick={() => setPreviewOpen(false)}
              className="animate-fade-in fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm"
            >
              <div
                role="dialog"
                aria-modal="true"
                aria-label="Xem trước bài đăng"
                onClick={(event) => event.stopPropagation()}
                className="animate-drawer-in flex h-full w-full max-w-md flex-col border-l border-[#1E2333] bg-[#0E121B] shadow-2xl sm:max-w-lg"
              >
                <header className="flex shrink-0 items-center justify-between gap-2 border-b border-[#1E2333] bg-[#0E121B] px-4 py-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      <Globe className="h-3.5 w-3.5" />
                    </span>
                    <h2 className="truncate text-[13.5px] font-semibold text-white">
                      Xem trước đa kênh Facebook &amp; Instagram
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPreviewOpen(false)}
                    aria-label="Đóng xem trước"
                    className="btn-tactile inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#1E2333] bg-[#07090E] text-slate-300 transition-colors hover:border-white/20 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </header>
                <div className="custom-scrollbar flex-1 overflow-y-auto p-3">
                  {result && activeCaption ? (
                    <FacebookMockup
                      activeText={currentText}
                      activeAngle={activeCaption.angle}
                      pageName={formInputs.productName}
                      headline={result.headlines[0]}
                      hashtags={result.hashtags}
                      onNotify={showToast}
                    />
                  ) : (
                    <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#1E2333] bg-[#07090E] px-6 text-center">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#1E2333] bg-[#0E121B] text-slate-400">
                        <Globe className="h-5 w-5 text-emerald-400" />
                      </span>
                      <p className="text-[13px] font-semibold text-white">
                        Chưa có bản thảo để xem trước
                      </p>
                      <p className="max-w-xs text-[12px] leading-relaxed text-slate-400">
                        Tạo 3 góc bài viết ở cột Brief, sau đó mở lại Drawer này để xem mockup Facebook và Instagram.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <HistoryDrawer
            open={historyOpen}
            loading={historyLoading}
            error={historyError}
            items={historyItems}
            onClose={handleCloseHistory}
            onRestore={handleRestore}
            onDelete={handleDeleteHistoryItem}
          />

          <AuthModal
            open={authModalOpen}
            onClose={() => setAuthModalOpen(false)}
            productName={formInputs.productName}
          />

          <OutOfCreditsModal
            open={outOfCreditsOpen}
            onClose={() => setOutOfCreditsOpen(false)}
            onUpgrade={() => {
              setOutOfCreditsOpen(false);
              setTopUpModalOpen(true);
            }}
          />

          <TopUpModal
            open={topUpModalOpen}
            onClose={() => setTopUpModalOpen(false)}
            userIdentifier={user?.email}
            currentPlanId={userPlanId}
            onSuccess={(newCredits, message, planId) => {
              setCredits(newCredits);
              if (planId) {
                setUserPlanId(planId);
                try {
                  localStorage.setItem("cs_user_plan", planId);
                } catch {
                  // Ignore localStorage error in private mode
                }
              }
              showToast(message);
            }}
          />

          {/* Mobile sticky action bar */}
          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#1E2333] bg-[#0E121B]/95 px-4 py-3 backdrop-blur-md lg:hidden">
            <div className="mx-auto flex max-w-6xl items-center gap-3">
              {mobileTab === "brief" ? (
                <>
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <p className="truncate text-[12px] text-slate-400">
                      {isPro ? (
                        <span
                          className={`font-semibold ${activePlan.id === "yearly"
                            ? "text-purple-400"
                            : activePlan.id === "monthly"
                              ? "text-amber-400"
                              : "text-emerald-400"
                            }`}
                        >
                          {activePlan.tierBadge} · 0s chờ
                        </span>
                      ) : user ? (
                        "Gói Miễn Phí (45s chờ)"
                      ) : (
                        "Đăng nhập để lưu lịch sử"
                      )}
                    </p>
                    <button
                      type="button"
                      onClick={() => setTopUpModalOpen(true)}
                      className="shrink-0 text-[11.5px] font-semibold text-emerald-400 hover:underline"
                    >
                      {isPro ? "Đổi gói" : "+ Nâng cấp"}
                    </button>
                  </div>
                  <button
                    type="submit"
                    form="product-form"
                    disabled={loading || (cooldownSeconds > 0 && !isPro)}
                    className="touch-target inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-[13px] font-bold text-black transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin text-black" />
                    ) : cooldownSeconds > 0 && !isPro ? null : (
                      <Wand2 className="h-4 w-4 text-black" />
                    )}
                    <span>
                      {loading
                        ? "Đang tạo..."
                        : cooldownSeconds > 0 && !isPro
                          ? `Sạc AI: ${cooldownSeconds}s`
                          : "Tạo 3 góc"}
                    </span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setMobileTab("brief")}
                    className="btn-tactile touch-target inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[#1E2333] bg-[#07090E] px-3 py-2 text-[12px] font-medium text-slate-300"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Brief</span>
                  </button>
                  <div className="flex-1" />
                  <button
                    type="button"
                    onClick={() => setPreviewOpen(true)}
                    aria-label="Xem trước bài đăng"
                    className="btn-tactile touch-target inline-flex shrink-0 items-center justify-center rounded-lg border border-[#1E2333] bg-[#07090E] px-3 py-2 text-slate-300"
                  >
                    <Eye className="h-4 w-4 text-emerald-400" />
                  </button>
                  {result && activeCaption && (
                    <button
                      type="button"
                      onClick={() =>
                        void handleCopyText(
                          currentText,
                          `caption-mobile`,
                          "Đã sao chép bài viết.",
                        )
                      }
                      className="btn-tactile touch-target inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-[12.5px] font-bold text-black shadow-xs"
                    >
                      <Copy className="h-3.5 w-3.5 text-black" />
                      <span>Sao chép</span>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}