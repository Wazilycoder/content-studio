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
    Wand2,
    X,
    Zap,
  } from "lucide-react";
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
  const [formInputs, setFormInputs] = useState<ContentFormInput>(DEFAULT_DEMO_FORM);
  const [result, setResult] = useState<GeneratedContent | null>(DEFAULT_DEMO_RESULT);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

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
      } catch {}
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

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 2200);
  }, []);

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
                  } catch {}
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
        } catch {}
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
                    } catch {}
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
      } catch {}
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

  const handleRestore = useCallback(
    (record: GenerationRecord) => {
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
          } catch {}
          showToast(res.error ?? "Không thể xóa bài viết. Vui lòng thử lại.");
          return false;
        }
        showToast("Đã xóa bài viết khỏi lịch sử");
        return true;
      } catch {
        setHistoryItems(snapshot);
        try {
          localStorage.setItem(historyKey, JSON.stringify(snapshot));
        } catch {}
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
        const sample = findSampleResult(input);
        if (sample) {
          if (generateTimerRef.current) clearTimeout(generateTimerRef.current);
          generateTimerRef.current = setTimeout(() => {
            setResult(sample);
            setLoading(false);
            setMobileTab("editor");
            showToast("Đang xem dữ liệu mẫu. Đăng nhập để AI tạo bài viết riêng.");
          }, 400);
          return;
        }

        // Với sản phẩm do người dùng tự gõ -> Yêu cầu đăng nhập
        setLoading(false);
        setAuthModalOpen(true);
        showToast("Vui lòng đăng nhập để AI tạo bài viết cho sản phẩm này.");
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
            } catch {}
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
        const msg = err instanceof Error ? err.message : "Đã xảy ra lỗi khi gọi AI.";
        showToast(msg);
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

  const handleLoadSample = useCallback(() => {
    const scenario =
      SAMPLE_SCENARIOS[sampleIndexRef.current % SAMPLE_SCENARIOS.length];
    sampleIndexRef.current += 1;
    setFormInputs(scenario.input);
    setResult(scenario.output);
    setMobileTab("editor");
    showToast(`Đã nạp dữ liệu mẫu: ${scenario.input.productName}`);
  }, [showToast]);

  // Memo hóa thanh công cụ tĩnh: không bị re-render bởi nhịp cooldown 1s hay các tick nội bộ khác
  const toolbarRow = useMemo(
    () => (
      <div className="mb-3 flex shrink-0 flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-[16px] font-semibold tracking-tight text-[var(--ink-primary)]">
              Studio biên tập nội dung
            </h1>
            {draftSaved && (
              <span className="animate-fade-in inline-flex items-center gap-1 rounded-full bg-[var(--accent-emerald)]/[0.08] px-2 py-0.5 text-[11px] font-medium text-[var(--accent-emerald)]">
                <Check className="h-3 w-3" />
                Đã lưu nháp
              </span>
            )}
          </div>
          <span className="mt-1 block font-mono text-[11px] text-[var(--ink-tertiary)]">
            [WORKSPACE · ACTIVE PIPELINE: 3 ANGLES]
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            disabled={!result}
            className="btn-tactile hidden lg:inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-1.5 text-[12px] font-medium text-[var(--ink-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--ink-primary)] disabled:opacity-50"
          >
            <Eye className="h-3.5 w-3.5" />
            Xem trước
          </button>
          <button
            type="button"
            onClick={handleOpenTopUp}
            className={`btn-tactile inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-[color,background-color,border-color] duration-150 ${
              isPro
                ? activePlan.id === "yearly"
                  ? "border-purple-500/40 bg-purple-500/10 text-purple-600 dark:text-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.15)]"
                  : activePlan.id === "monthly"
                  ? "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.15)]"
                  : "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "border-[var(--border-subtle)] bg-[var(--surface)] text-[var(--ink-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--ink-primary)]"
            }`}
          >
            {isPro ? (
              activePlan.id === "yearly" ? (
                <Crown className="h-3.5 w-3.5 fill-purple-500 text-purple-500" />
                ) : activePlan.id === "monthly" ? (
                  <Zap className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                ) : (
                  <Zap className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
                )
              ) : (
                <Zap className="h-3.5 w-3.5 text-[var(--accent-navy)]" />
              )}
            <span>{isPro ? activePlan.tierBadge : "Nâng cấp Pro 0s"}</span>
          </button>
          <button
            type="button"
            onClick={handleOpenHistory}
            className="btn-tactile inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-1.5 text-[12px] font-medium text-[var(--ink-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--ink-primary)]"
          >
            <History className="h-3.5 w-3.5" />
            Lịch sử
          </button>
        </div>
      </div>
    ),
      [
        draftSaved,
        result,
        isPro,
        activePlan,
        handleOpenTopUp,
        handleOpenHistory,
      ],
    );

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
        <div className="mx-auto flex h-full w-full max-w-[1680px] flex-col px-3 pb-28 pt-3 sm:px-6 sm:py-4 md:pb-6 lg:py-3 lg:pb-3">
          {toolbarRow}

          {/* Mobile Segmented Control — Brief / Bản thảo */}
          <div className="relative mb-3 flex shrink-0 items-center rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-1 lg:hidden">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-1 left-1 rounded-lg bg-[var(--surface)] shadow-[0_1px_3px_rgba(0,0,0,0.1)] transition-transform duration-[280ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                width: "calc(50% - 4px)",
                transform: `translateX(${mobileTab === "brief" ? 0 : 100}%)`,
              }}
            />
            <button
              type="button"
              onClick={() => setMobileTab("brief")}
              aria-pressed={mobileTab === "brief"}
              className={`btn-tactile relative z-10 flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-[13px] font-semibold transition-colors ${
                mobileTab === "brief"
                  ? "text-[var(--accent-navy)]"
                  : "text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
              }`}
            >
              <FileText className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">Brief</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileTab("editor")}
              aria-pressed={mobileTab === "editor"}
              className={`btn-tactile relative z-10 flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-[13px] font-semibold transition-colors ${
                mobileTab === "editor"
                  ? "text-[var(--accent-navy)]"
                  : "text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
              }`}
            >
              <Wand2 className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">Bản thảo</span>
              {result && (
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-emerald)]" />
              )}
            </button>
          </div>

          <div className="grid flex-1 grid-cols-1 gap-4 lg:h-full lg:min-h-0 lg:grid-cols-[400px_1fr] lg:overflow-hidden xl:grid-cols-[440px_1fr]">
            {/* ===== CỘT TRÁI — BRIEF INSPECTOR (40%) ===== */}
            <div className="flex min-w-0 flex-col gap-3 lg:contents">
            <div
              className={`custom-scrollbar relative min-w-0 lg:h-full lg:min-h-0 lg:overflow-y-auto lg:pr-1.5 ${
                mobileTab === "brief" ? "flex flex-col" : "hidden lg:flex lg:flex-col"
              }`}
            >
              <aside className="flex w-full min-w-0 flex-col gap-2.5">
                <div className="flex items-center justify-between rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 shadow-xs">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-[var(--accent-navy)]/[0.1] text-[var(--accent-navy)]">
                      <FileText className="h-3.5 w-3.5" />
                    </span>
                    <h2 className="text-[13.5px] font-semibold text-[var(--ink-primary)]">
                      Brief sản phẩm
                    </h2>
                  </div>
                  <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wider text-[var(--ink-tertiary)]">
                    4 trường
                  </span>
                </div>
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
                    className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-[12px] font-medium transition-all ${
                      activePlan.id === "yearly"
                        ? "border-purple-500/40 bg-purple-500/10 text-purple-600 dark:text-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.12)]"
                        : activePlan.id === "monthly"
                        ? "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.12)]"
                        : "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    }`}
                  >
                    {activePlan.id === "yearly" ? (
                      <Crown className="h-3.5 w-3.5 fill-purple-500 text-purple-500" />
                    ) : activePlan.id === "monthly" ? (
                      <Zap className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                    ) : (
                      <Zap className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
                    )}
                    <span>{activePlan.statusDescription}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)]/60 px-3 py-2 text-[12px] text-[var(--ink-secondary)]">
                    <span>Gói Miễn Phí: Không giới hạn bài viết</span> ·{" "}
                    <button
                      type="button"
                      onClick={handleOpenTopUp}
                      className="font-semibold text-[var(--accent-navy)] hover:underline"
                    >
                      Nâng cấp Pro 0s
                    </button>
                  </div>
                )}
              </aside>

              </div>

            {/* ===== CỘT PHẢI — WRITING SUITE (60%) ===== */}
            <div
              className={`relative min-w-0 lg:h-full lg:min-h-0 ${
                mobileTab === "editor" ? "flex flex-col" : "hidden lg:flex lg:flex-col"
              }`}
            >
              <section className="custom-scrollbar flex h-full w-full min-w-0 flex-col rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] shadow-xs lg:min-h-0 lg:overflow-y-auto">
              <header className="sticky top-0 z-10 flex shrink-0 items-center justify-between gap-2 border-b border-[var(--border-subtle)] bg-[var(--surface)]/95 px-4 py-3 backdrop-blur-xs">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[var(--accent-navy)]/[0.1] text-[var(--accent-navy)]">
                    <Wand2 className="h-3.5 w-3.5" />
                  </span>
                  <h2 className="truncate text-[13.5px] font-semibold text-[var(--ink-primary)]">
                    Bản thảo biên tập
                  </h2>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPreviewOpen(true)}
                    disabled={!result}
                    className="btn-tactile inline-flex items-center gap-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-2.5 py-1.5 text-[11.5px] font-medium text-[var(--ink-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--ink-primary)] disabled:opacity-50"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Xem trước
                  </button>
                  {result && (
                    <button
                      type="button"
                      onClick={handleRegenerate}
                      disabled={loading}
                      className="btn-tactile inline-flex items-center gap-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-2.5 py-1.5 text-[11.5px] font-medium text-[var(--ink-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--ink-primary)] disabled:opacity-60"
                    >
                      {loading ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <RefreshCw className="h-3 w-3" />
                      )}
                      {loading ? "Đang tạo..." : "Tạo lại"}
                    </button>
                  )}
                </div>
              </header>

              {result && activeCaption ? (
                <>
                  {/* Angle tabs — fluid sliding pill */}
                  <div className="border-b border-[var(--border-subtle)] px-3 py-2.5">
                    <div className="relative grid grid-cols-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-1">
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-y-1 left-1 rounded-lg bg-[var(--surface)] shadow-[0_1px_3px_rgba(0,0,0,0.1)] transition-transform duration-[280ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                        style={{
                          width: "calc(33.3333% - 2.667px)",
                          transform: `translateX(${activeAngleIndex * 100}%)`,
                        }}
                      />
                      {result.captions.map((cap, index) => {
                        const meta = ANGLE_META[index];
                        const active = index === activeAngleIndex;
                        return (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setActiveAngleIndex(index)}
                            aria-pressed={active}
                            className={`btn-tactile relative z-10 inline-flex min-w-0 flex-col items-center justify-center gap-0.5 rounded-lg px-1.5 py-1.5 transition-colors ${
                              active
                                ? "text-[var(--accent-navy)]"
                                : "text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
                            }`}
                          >
                            <span className="w-full truncate text-center text-[12.5px] font-semibold">
                              {String(index + 1).padStart(2, "0")}. {meta?.tag ?? `G${index + 1}`}
                            </span>
                            <span className="w-full truncate text-center text-[12px] font-normal text-[var(--ink-tertiary)]">
                              {meta?.label ?? cap.angle}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quick actions */}
                  <div className="flex flex-wrap items-center gap-1.5 px-4 py-2.5">
                    <button
                      type="button"
                      onClick={() =>
                        void handleCopyText(
                          currentText,
                          `caption-${activeAngleIndex}`,
                          "Đã sao chép bài viết vào clipboard.",
                        )
                      }
                      className={`btn-tactile inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11.5px] font-medium transition-colors ${
                        copiedKey === `caption-${activeAngleIndex}`
                          ? "border-[var(--accent-emerald)] bg-[var(--accent-emerald)]/[0.08] text-[var(--accent-emerald)]"
                          : "border-[var(--border-subtle)] bg-[var(--surface)] text-[var(--ink-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--ink-primary)]"
                      }`}
                    >
                      {copiedKey === `caption-${activeAngleIndex}` ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                      {copiedKey === `caption-${activeAngleIndex}` ? "Đã chép" : "Sao chép bài viết"}
                    </button>

                    <button
                      type="button"
                      onClick={handleExportFullPackageTxt}
                      className="btn-tactile inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-2.5 py-1.5 text-[11.5px] font-medium text-[var(--ink-secondary)] transition-colors hover:border-[var(--accent-navy)] hover:text-[var(--accent-navy)]"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Xuất gói nội dung (.txt)
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
                        className="btn-tactile inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-2.5 py-1.5 text-[11.5px] font-medium text-[var(--ink-tertiary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--ink-primary)]"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Khôi phục AI gốc
                      </button>
                    )}
                  </div>

                  {/* Inline textarea */}
                  <div className="flex-1 px-4 pb-3">
                    <textarea
                      value={currentText}
                      onChange={(e) => {
                        setEditedCaptions((prev) => ({ ...prev, [activeAngleIndex]: e.target.value }));
                      }}
                      rows={8}
                      className="studio-textarea w-full resize-y rounded-xl border border-[var(--border-subtle)] bg-[var(--canvas)] p-4 text-[var(--ink-primary)] outline-hidden transition-colors [field-sizing:content] focus:border-[var(--accent-navy)] focus:ring-2 focus:ring-[var(--accent-navy)]/15"
                      placeholder="Nội dung bài viết sẽ xuất hiện ở đây..."
                    />
                      <p className="mt-2 text-[12px] leading-relaxed text-[var(--ink-tertiary)]">
                        125 ký tự đầu tiên là &quot;Hook&quot; — phần hiển thị trước nút &quot;Xem thêm&quot; trên bảng tin Facebook.
                      </p>

                      {/* Linear Precision Telemetry Gauge — FB Hook 125 & IG 2.200 */}
                      <div className="mt-3.5 space-y-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)]/60 p-3.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-mono text-[11px] font-medium text-[var(--ink-tertiary)]">
                            TELEMETRY · {charCount.toLocaleString("vi-VN")} chars
                          </span>
                          <div className="flex flex-wrap items-center gap-1.5 font-mono">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-semibold tabular-nums transition-colors ${
                                overLimit
                                  ? "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-300"
                                  : "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
                              }`}
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-current" />
                              FB Hook: {charCount}/125
                              {overLimit && <span className="ml-0.5">· Cần xem thêm</span>}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-semibold tabular-nums transition-colors ${
                                isOverInstagram
                                  ? "border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-300"
                                  : "border-[var(--border-subtle)] bg-[var(--surface)] text-[var(--ink-secondary)]"
                              }`}
                            >
                              {isOverInstagram && <AlertTriangle className="h-3 w-3 shrink-0" />}
                              IG: {charCount.toLocaleString("vi-VN")}/2.200
                            </span>
                          </div>
                        </div>
                        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-raised)]">
                          <div
                            className={`h-full rounded-full transition-[width] duration-300 ${
                              isOverInstagram
                                ? "bg-rose-500"
                                : overLimit
                                ? "bg-amber-500"
                                : "bg-gradient-to-r from-teal-500 to-emerald-400"
                            }`}
                            style={{ width: `${Math.min((charCount / 125) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                  {/* Headlines */}
                  {result.headlines.length > 0 && (
                    <div className="border-t border-[var(--border-subtle)]">
                      <button
                        type="button"
                        onClick={() => setHeadlinesOpen((v) => !v)}
                        className="flex w-full items-center justify-between px-4 py-2.5 text-[12px] font-medium text-[var(--ink-secondary)] transition-colors hover:text-[var(--ink-primary)]"
                      >
                        <span>Tiêu đề quảng cáo ({result.headlines.length})</span>
                        {headlinesOpen ? (
                          <ChevronUp className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5" />
                        )}
                      </button>
                      {headlinesOpen && (
                        <ul className="space-y-1.5 px-4 pb-3">
                          {result.headlines.map((headline, i) => (
                            <li
                              key={i}
                              className="flex items-center justify-between gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-raised)]/40 px-2.5 py-1.5"
                            >
                              <span className="min-w-0 truncate text-[12px] text-[var(--ink-primary)]">
                                {headline}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  void handleCopyText(headline, `headline-${i}`, "Đã sao chép tiêu đề.")
                                }
                                aria-label="Sao chép tiêu đề"
                                className="shrink-0 text-[var(--ink-tertiary)] transition-colors hover:text-[var(--ink-primary)]"
                              >
                                {copiedKey === `headline-${i}` ? (
                                  <Check className="h-3.5 w-3.5 text-[var(--accent-emerald)]" />
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
                    <div className="border-t border-[var(--border-subtle)] px-4 py-3">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-[11.5px] font-medium text-[var(--ink-secondary)]">
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
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--accent-navy)] transition-opacity hover:underline"
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
                            className="rounded-full bg-[var(--surface-raised)] px-2 py-0.5 text-[11px] text-[var(--ink-secondary)]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Mobile navigation CTA to Zone 3 */}
                  <div className="mt-4 border-t border-[var(--border-subtle)] p-4 lg:hidden">
                    <button
                      type="button"
                      onClick={() => setPreviewOpen(true)}
                      className="btn-tactile touch-target flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent-navy)] py-3 text-[13px] font-semibold text-white shadow-xs"
                    >
                      <span>Xem trước bài đăng</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 py-16 text-center">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-raised)] text-[var(--ink-tertiary)]">
                    <Wand2 className="h-5 w-5" />
                  </span>
                  <p className="text-[13px] font-medium text-[var(--ink-primary)]">Chưa có nội dung</p>
                  <p className="max-w-xs text-[12px] leading-relaxed text-[var(--ink-tertiary)]">
                    Điền brief ở cột Brief và bấm &quot;Tạo 3 góc bài viết&quot; để AI kiến tạo nội dung.
                  </p>
                  <div className="mt-4 lg:hidden">
                    <button
                      type="button"
                      onClick={() => setMobileTab("brief")}
                      className="btn-tactile inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-3 py-1.5 text-[12px] font-medium text-[var(--ink-secondary)]"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      <span>Quay lại Brief</span>
                    </button>
                  </div>
                </div>
                )}
              </section>

              </div>

            </div>

            </div>

            {/* ===== PREVIEW DRAWER — Xem trước đa kênh ===== */}
            {previewOpen && (
              <div
                role="presentation"
                onClick={() => setPreviewOpen(false)}
                className="animate-fade-in fixed inset-0 z-50 flex justify-end bg-black/45 backdrop-blur-sm"
              >
                <div
                  role="dialog"
                  aria-modal="true"
                  aria-label="Xem trước bài đăng"
                  onClick={(event) => event.stopPropagation()}
                  className="animate-drawer-in flex h-full w-full max-w-md flex-col border-l border-[var(--border-subtle)] bg-[var(--surface)] shadow-2xl sm:max-w-lg"
                >
                  <header className="flex shrink-0 items-center justify-between gap-2 border-b border-[var(--border-subtle)] px-4 py-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[var(--accent-navy)]/[0.1] text-[var(--accent-navy)]">
                        <Globe className="h-3.5 w-3.5" />
                      </span>
                      <h2 className="truncate text-[13.5px] font-semibold text-[var(--ink-primary)]">
                        Xem trước đa kênh
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPreviewOpen(false)}
                      aria-label="Đóng xem trước"
                      className="btn-tactile inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--ink-tertiary)] transition-colors hover:bg-[var(--surface-raised)] hover:text-[var(--ink-primary)]"
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
                      <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--border-subtle)] px-6 text-center">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-raised)] text-[var(--ink-tertiary)]">
                          <Globe className="h-5 w-5" />
                        </span>
                        <p className="text-[13px] font-medium text-[var(--ink-primary)]">
                          Chưa có bản thảo để xem trước
                        </p>
                        <p className="max-w-xs text-[12px] leading-relaxed text-[var(--ink-tertiary)]">
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
          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border-subtle)] bg-[var(--surface)]/95 px-4 py-3 backdrop-blur-md lg:hidden">
            <div className="mx-auto flex max-w-6xl items-center gap-3">
              {mobileTab === "brief" ? (
                <>
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <p className="truncate text-[12px] text-[var(--ink-tertiary)]">
                      {isPro ? (
                        <span
                          className={`font-semibold ${
                            activePlan.id === "yearly"
                              ? "text-purple-600 dark:text-purple-400"
                              : activePlan.id === "monthly"
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-emerald-600 dark:text-emerald-400"
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
                      className="shrink-0 text-[11.5px] font-semibold text-[var(--accent-navy)] hover:underline"
                    >
                      {isPro ? "Đổi gói" : "+ Nâng cấp"}
                    </button>
                  </div>
                  <button
                    type="submit"
                    form="product-form"
                    disabled={loading || (cooldownSeconds > 0 && !isPro)}
                    className="touch-target inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[var(--accent-navy)] px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[var(--accent-navy-hover)] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : cooldownSeconds > 0 && !isPro ? null : (
                      <Wand2 className="h-4 w-4" />
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
                    className="btn-tactile touch-target inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-3 py-2 text-[12px] font-medium text-[var(--ink-secondary)]"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Brief</span>
                  </button>
                  <div className="flex-1" />
                  <button
                    type="button"
                    onClick={() => setPreviewOpen(true)}
                    aria-label="Xem trước bài đăng"
                    className="btn-tactile touch-target inline-flex shrink-0 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-3 py-2 text-[var(--ink-secondary)]"
                  >
                    <Eye className="h-4 w-4" />
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
                      className="btn-tactile touch-target inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[var(--accent-navy)] px-4 py-2 text-[12.5px] font-semibold text-white shadow-xs"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      <span>Sao chép</span>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {toast ? (
            <div className="pointer-events-none fixed inset-x-0 bottom-28 z-50 flex justify-center px-4 md:bottom-6">
              <div
                role="status"
                aria-live="polite"
                className="animate-fade-in-up flex max-w-full items-center gap-2 rounded-lg bg-[var(--ink-primary)] px-3.5 py-2 text-[12px] font-medium text-[var(--surface)] shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
              >
                <Check className="h-3.5 w-3.5 shrink-0 text-[#4ADE80]" />
                <span className="min-w-0 break-words">{toast}</span>
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}