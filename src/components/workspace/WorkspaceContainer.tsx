"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  Download,
  Globe,
  History,
  Loader2,
  RotateCcw,
  Sparkles,
  Wand2,
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
import { countUnicodeChars } from "@/lib/utils/charCounter";
import { toSafeFileName } from "@/lib/utils/filename";
import type {
  ContentFormInput,
  GeneratedContent,
  GenerationRecord,
} from "@/types/content";

export interface WorkspaceUser {
  credits?: number | null;
  email?: string | null;
}

export interface WorkspaceContainerProps {
  user?: WorkspaceUser | null;
  onSignOutAction?: () => Promise<void>;
}

const EMPTY_FORM: ContentFormInput = {
  productName: "",
  productDescription: "",
  targetAudience: "",
  tone: "trang-trong",
};

const ANGLE_META: Array<{ tag: string; label: string }> = [
  { tag: "PAS", label: "Vấn đề & Giải pháp" },
  { tag: "Cảm xúc", label: "Cảm xúc & Phong cách" },
  { tag: "FAB", label: "Tính năng & Lợi ích" },
];

const ANGLE_SECTION_TITLES: string[] = [
  "VẤN ĐỀ & GIẢI PHÁP (PAS)",
  "CẢM XÚC & PHONG CÁCH SỐNG",
  "TRỰC DIỆN TÍNH NĂNG & GIÁ TRỊ (FAB)",
];

export default function WorkspaceContainer({ user, onSignOutAction }: WorkspaceContainerProps) {
  const [formInputs, setFormInputs] = useState<ContentFormInput>(EMPTY_FORM);
  const [result, setResult] = useState<GeneratedContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyItems, setHistoryItems] = useState<GenerationRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [outOfCreditsOpen, setOutOfCreditsOpen] = useState(false);
  const [topUpModalOpen, setTopUpModalOpen] = useState(false);

  const [draftSaved, setDraftSaved] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

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

  // Khôi phục bản nháp tự động từ localStorage khi tải lại trang
  useEffect(() => {
    try {
      const saved = localStorage.getItem("content_studio_form_draft");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.productName || parsed.productDescription) {
          setFormInputs(parsed);
        }
      }
    } catch {
      // Bỏ qua lỗi parse nếu localStorage bị lỗi
    }
  }, []);

  // Tự động lưu nháp (debounce 500ms) khi người dùng gõ
  useEffect(() => {
    if (formInputs.productName.trim() || formInputs.productDescription.trim()) {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = setTimeout(() => {
        try {
          localStorage.setItem(
            "content_studio_form_draft",
            JSON.stringify(formInputs)
          );
          setDraftSaved(true);
          setTimeout(() => setDraftSaved(false), 2000);
        } catch {
          // localStorage full or unavailable
        }
      }, 500);
    }
  }, [formInputs]);

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
    if (!user) return;
    try {
      const res = await fetchUserHistory();
      if (!res.error) setHistoryItems(res.data ?? []);
    } catch {
      // Làm mới ngầm thất bại không được chặn luồng tạo nội dung.
    }
  }, [user]);

  const loadHistory = useCallback(async () => {
    if (!user) return;
    setHistoryLoading(true);
    setHistoryError(null);
    try {
      const res = await fetchUserHistory();
      if (res.error) {
        setHistoryError(res.error);
        setHistoryItems([]);
      } else {
        setHistoryItems(res.data ?? []);
      }
    } catch {
      setHistoryError("Không thể tải lịch sử bài viết. Vui lòng thử lại.");
      setHistoryItems([]);
    } finally {
      setHistoryLoading(false);
    }
  }, [user]);

  const handleOpenHistory = useCallback(() => {
    if (!user) {
      showToast("Đăng nhập để xem và quản lý lịch sử bài viết đã tạo.");
      return;
    }
    setHistoryOpen(true);
    void loadHistory();
  }, [user, showToast, loadHistory]);

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
      setHistoryItems((prev) => prev.filter((item) => item.id !== id));

      try {
        const res = await deleteHistoryItem(id);
        if (!res.success) {
          setHistoryItems(snapshot);
          showToast(res.error ?? "Không thể xóa bài viết. Vui lòng thử lại.");
          return false;
        }
        showToast("Đã xóa bài viết khỏi lịch sử");
        return true;
      } catch {
        setHistoryItems(snapshot);
        showToast("Mất kết nối khi xóa. Bài viết đã được khôi phục.");
        return false;
      }
    },
    [historyItems, showToast],
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
          if (typeof resData.creditsRemaining === "number") {
            setCredits(resData.creditsRemaining);
          }
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
      [user, showToast, refreshHistorySilently, isPro],
    );

  const handleSubmit = () => {
    if (cooldownSeconds > 0 && !isPro) {
      showToast(
        `Vui lòng chờ ${cooldownSeconds}s để AI sạc lại, hoặc nâng cấp Pro để tạo tức thì.`,
      );
      return;
    }
    generate(formInputs, "Đã tạo 3 góc bài viết thành công!");
  };

  const handleRegenerate = () => {
    if (loading || !result) return;
    if (cooldownSeconds > 0 && !isPro) {
      showToast(
        `Vui lòng chờ ${cooldownSeconds}s để AI sạc lại, hoặc nâng cấp Pro để tạo tức thì.`,
      );
      return;
    }
    generate(formInputs, "Đã tạo lại nội dung thành công!");
  };

  const handleLoadSample = () => {
    const scenario =
      SAMPLE_SCENARIOS[sampleIndexRef.current % SAMPLE_SCENARIOS.length];
    sampleIndexRef.current += 1;
    setFormInputs(scenario.input);
      setResult(scenario.output);
      showToast(`Đã nạp dữ liệu mẫu: ${scenario.input.productName}`);
    };

    const activeCaption =
      result?.captions[activeAngleIndex] ?? result?.captions[0] ?? null;
    const originalText = activeCaption?.text ?? "";
    const currentText = editedCaptions[activeAngleIndex] ?? originalText;
    const charCount = countUnicodeChars(currentText);
    const isModified = currentText !== originalText;
    const overLimit = charCount > 125;

    return (
    <div className="flex min-h-screen flex-col">
      <WorkspaceHeader
        user={user}
        credits={credits}
        onOpenTopUp={() => setTopUpModalOpen(true)}
        onSignOutAction={onSignOutAction}
      />

      <main className="w-full flex-1">
        <div className="mx-auto w-full max-w-[1680px] px-3 pb-28 pt-4 sm:px-6 sm:py-6 md:pb-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-[15px] font-semibold tracking-tight text-[var(--ink-primary)]">
                  Không gian sáng tạo 3 vùng
                </h1>
                {draftSaved && (
                  <span className="animate-fade-in inline-flex items-center gap-1 rounded-full bg-[var(--accent-emerald)]/[0.08] px-2 py-0.5 text-[11px] font-medium text-[var(--accent-emerald)]">
                    <Check className="h-3 w-3" />
                    Đã lưu nháp
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-[13px] text-[var(--ink-secondary)]">
                Nhập thông tin · Tinh chỉnh góc bài viết · Xem trước bảng tin Facebook thời gian thực.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTopUpModalOpen(true)}
                className="btn-tactile inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-1.5 text-[12px] font-medium text-[var(--ink-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--ink-primary)]"
              >
                {isPro ? (
                  <Zap className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5 text-[var(--accent-navy)]" />
                )}
                <span>{isPro ? "Pro Turbo" : "Nâng cấp Pro 0s"}</span>
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

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-[360px_minmax(0,1fr)_380px]">
            {/* ===== ZONE 1 — INPUT SPECIFICATION ===== */}
            <aside className="flex min-w-0 flex-col gap-2.5 lg:col-span-1 xl:col-span-1">
              <ProductForm
                value={formInputs}
                onChange={setFormInputs}
                onSubmit={handleSubmit}
                onLoadSample={handleLoadSample}
                loading={loading}
                cooldownSeconds={cooldownSeconds}
                isPro={isPro}
                onOpenUpgrade={() => setTopUpModalOpen(true)}
              />

              {isPro ? (
                <div className="flex items-center justify-center gap-2 rounded-xl border border-[var(--accent-emerald)]/30 bg-[var(--accent-emerald)]/10 px-3 py-2 text-[12px] font-medium text-[var(--accent-emerald)]">
                  <Zap className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
                  <span>Tài khoản Pro Turbo · Không giới hạn &amp; 0s Chờ đợi</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)]/60 px-3 py-2 text-[12px] text-[var(--ink-secondary)]">
                  <span>Gói Miễn Phí: Không giới hạn bài viết</span> ·{" "}
                  <button
                    type="button"
                    onClick={() => setTopUpModalOpen(true)}
                    className="font-semibold text-[var(--accent-navy)] hover:underline"
                  >
                    Nâng cấp Pro 0s
                  </button>
                </div>
              )}
            </aside>

            {/* ===== ZONE 2 — ACTIVE ANGLE LIVE EDITOR ===== */}
            <section className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] shadow-xs lg:col-span-1 xl:col-span-1">
              <header className="flex items-center justify-between gap-2 border-b border-[var(--border-subtle)] bg-[var(--surface-raised)]/40 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-[var(--accent-navy)]/[0.1] text-[var(--accent-navy)]">
                    <Wand2 className="h-3.5 w-3.5" />
                  </span>
                  <h2 className="text-[13px] font-semibold text-[var(--ink-primary)]">
                    Vùng 2 · Biên tập góc bài viết
                  </h2>
                </div>
                {result && (
                  <button
                    type="button"
                    onClick={handleRegenerate}
                    disabled={loading}
                    className="btn-tactile inline-flex items-center gap-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-2.5 py-1 text-[11.5px] font-medium text-[var(--ink-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--ink-primary)] disabled:opacity-60"
                  >
                          {loading ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Sparkles className="h-3 w-3" />
                          )}
                          {loading ? "Đang tạo..." : "Tạo lại"}
                        </button>
                      )}
                    </header>

              {result && activeCaption ? (
                <>
                  {/* Angle tabs */}
                  <div className="flex flex-wrap gap-1.5 border-b border-[var(--border-subtle)] px-3 py-2.5">
                    {result.captions.map((cap, index) => {
                      const meta = ANGLE_META[index];
                      const active = index === activeAngleIndex;
                      return (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setActiveAngleIndex(index)}
                          className={`btn-tactile inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11.5px] font-medium transition-colors ${
                            active
                              ? "bg-[var(--accent-navy)] text-white"
                              : "bg-[var(--surface-raised)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
                          }`}
                        >
                          <span
                            className={`rounded px-1 py-0.5 text-[9.5px] font-bold uppercase ${
                              active
                                ? "bg-white/20 text-white"
                                : "bg-[var(--surface)] text-[var(--ink-tertiary)]"
                            }`}
                          >
                            {meta?.tag ?? `G${index + 1}`}
                          </span>
                          <span className="max-w-[150px] truncate">
                            {meta?.label ?? cap.angle}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Hook metric — thước đo 125 ký tự vàng */}
                  <div className="space-y-2 border-b border-[var(--border-subtle)] px-4 py-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[12px] font-medium tabular-nums text-[var(--ink-tertiary)]">
                        <strong className="text-[var(--ink-primary)]">{charCount}</strong> ký tự
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-medium ${
                          overLimit
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            : "bg-[var(--accent-emerald)]/[0.08] text-[var(--accent-emerald)]"
                        }`}
                      >
                        {overLimit ? (
                          <>
                            <AlertTriangle className="h-3 w-3" />
                            Vượt 125 ký tự — người xem cần bấm &quot;Xem thêm&quot;
                          </>
                        ) : (
                          <>
                            <Check className="h-3 w-3" />
                            Hook vàng — hiển thị trọn vẹn trước &quot;Xem thêm&quot;
                          </>
                        )}
                      </span>
                    </div>
                    <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-raised)]">
                      <div
                        className={`h-full rounded-full transition-[width] duration-300 ${
                          overLimit ? "bg-amber-500" : "bg-[var(--accent-emerald)]"
                        }`}
                        style={{ width: `${Math.min((charCount / 125) * 100, 100)}%` }}
                      />
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
                      ref={(el) => {
                        if (el) {
                          el.style.height = "auto";
                          el.style.height = `${el.scrollHeight}px`;
                        }
                      }}
                      value={currentText}
                      onChange={(e) => {
                        const value = e.target.value;
                        setEditedCaptions((prev) => ({ ...prev, [activeAngleIndex]: value }));
                        e.target.style.height = "auto";
                        e.target.style.height = `${e.target.scrollHeight}px`;
                      }}
                      rows={8}
                      className="w-full resize-none rounded-xl border border-[var(--border-subtle)] bg-[var(--canvas)] p-3.5 text-[14.5px] leading-[1.75] text-[var(--ink-primary)] outline-hidden transition-colors focus:border-[var(--accent-navy)] focus:ring-2 focus:ring-[var(--accent-navy)]/15"
                      placeholder="Nội dung bài viết sẽ xuất hiện ở đây..."
                    />
                    <p className="mt-1.5 text-[11px] leading-relaxed text-[var(--ink-tertiary)]">
                      125 ký tự đầu tiên là &quot;Hook&quot; — phần hiển thị trước nút &quot;Xem thêm&quot; trên bảng tin Facebook.
                    </p>
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
                </>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 py-16 text-center">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-raised)] text-[var(--ink-tertiary)]">
                    <Wand2 className="h-5 w-5" />
                  </span>
                  <p className="text-[13px] font-medium text-[var(--ink-primary)]">Chưa có nội dung</p>
                  <p className="max-w-xs text-[12px] leading-relaxed text-[var(--ink-tertiary)]">
                    Nhập thông tin sản phẩm ở Vùng 1 và bấm &quot;Tạo 3 góc bài viết&quot; để AI kiến tạo nội dung.
                  </p>
                </div>
              )}
            </section>

            {/* ===== ZONE 3 — LIVE FACEBOOK POST SIMULATOR ===== */}
            <aside className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] shadow-xs lg:col-span-2 xl:col-span-1">
              <header className="flex items-center justify-between gap-2 border-b border-[var(--border-subtle)] bg-[var(--surface-raised)]/40 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-[var(--accent-navy)]/[0.1] text-[var(--accent-navy)]">
                    <Globe className="h-3.5 w-3.5" />
                  </span>
                  <h2 className="text-[13px] font-semibold text-[var(--ink-primary)]">
                    Vùng 3 · Xem trước đa kênh
                  </h2>
                </div>
                <span className="rounded-full bg-[var(--surface-raised)] px-2 py-0.5 text-[10.5px] font-medium text-[var(--ink-tertiary)]">
                  Live
                </span>
              </header>

              <div className="flex-1 p-3">
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
                      Bản xem trước trực tiếp
                    </p>
                    <p className="max-w-xs text-[12px] leading-relaxed text-[var(--ink-tertiary)]">
                      Bài viết bạn tinh chỉnh ở Vùng 2 sẽ đồng bộ thời gian thực tại đây, mô phỏng đúng bảng tin Facebook, TikTok và Shopee.
                    </p>
                  </div>
                )}
              </div>
            </aside>
          </div>

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
            onSuccess={(newCredits, message) => {
              setCredits(newCredits);
              showToast(message);
            }}
          />

          {/* Mobile sticky action bar */}
          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border-subtle)] bg-[var(--surface)]/95 px-4 py-3 backdrop-blur-md md:hidden">
            <div className="mx-auto flex max-w-6xl items-center gap-3">
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <p className="truncate text-[12px] text-[var(--ink-tertiary)]">
                  {typeof credits === "number" ? (
                    <>
                      Còn{" "}
                      <strong className="font-semibold tabular-nums text-[var(--ink-primary)]">
                        {credits}
                      </strong>{" "}
                      lượt
                    </>
                  ) : (
                    "Đăng nhập để lưu lịch sử"
                  )}
                </p>
                {typeof credits === "number" && (
                  <button
                    type="button"
                    onClick={() => setTopUpModalOpen(true)}
                    className="text-[11.5px] font-semibold text-[var(--accent-navy)] hover:underline"
                  >
                    + Nạp thêm
                  </button>
                )}
              </div>
              <button
                type="submit"
                form="product-form"
                disabled={loading || (cooldownSeconds > 0 && !isPro)}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[var(--accent-navy)] px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[var(--accent-navy-hover)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : cooldownSeconds > 0 && !isPro ? null : (
                  <Sparkles className="h-4 w-4" />
                )}
                <span>
                  {loading
                    ? "Đang tạo..."
                    : cooldownSeconds > 0 && !isPro
                      ? `Sạc AI: ${cooldownSeconds}s`
                      : "Tạo 3 góc"}
                </span>
              </button>
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