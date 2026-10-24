"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, History, Loader2, Sparkles } from "lucide-react";
import ProductForm from "./ProductForm";
import ResultsSection from "./ResultsSection";
import AuthModal from "./AuthModal";
import HistoryDrawer from "@/components/history/HistoryDrawer";
import { deleteHistoryItem, fetchUserHistory } from "@/app/history/actions";
import { SAMPLE_SCENARIOS, findSampleResult } from "./sampleScenarios";
import type {
  ContentFormInput,
  GeneratedContent,
  GenerationRecord,
} from "@/types/content";

export interface WorkspaceUser {
  credits?: number | null;
  email?: string | null;
}

interface WorkspaceContainerProps {
  user?: WorkspaceUser | null;
}

const EMPTY_FORM: ContentFormInput = {
  productName: "",
  productDescription: "",
  targetAudience: "",
  tone: "trang-trong",
};

export default function WorkspaceContainer({ user }: WorkspaceContainerProps) {
  const [formInputs, setFormInputs] = useState<ContentFormInput>(EMPTY_FORM);
  const [result, setResult] = useState<GeneratedContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyItems, setHistoryItems] = useState<GenerationRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const [draftSaved, setDraftSaved] = useState(false);

  const sampleIndexRef = useRef(0);
  const generateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  useEffect(() => {
    return () => {
      if (generateTimerRef.current) clearTimeout(generateTimerRef.current);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, []);

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

  const [credits, setCredits] = useState<number | null>(user?.credits ?? null);

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
          throw new Error(resData?.error || "Không thể tạo nội dung từ AI.");
        }

        if (resData.success && resData.data) {
          setResult(resData.data);
          if (typeof resData.creditsRemaining === "number") {
            setCredits(resData.creditsRemaining);
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
    [user, showToast, refreshHistorySilently],
  );

  const handleSubmit = () => {
    generate(formInputs, "Đã tạo 3 góc bài viết thành công!");
  };

  const handleRegenerate = () => {
    if (loading || !result) return;
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

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-28 pt-6 sm:px-6 sm:py-8 md:pb-8">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-[15px] font-semibold tracking-tight text-[var(--ink-primary)]">
              Không gian sáng tạo
            </h1>
            {draftSaved && (
              <span className="animate-fade-in inline-flex items-center gap-1 rounded-full bg-[var(--accent-emerald)]/[0.08] px-2 py-0.5 text-[11px] font-medium text-[var(--accent-emerald)]">
                <Check className="h-3 w-3" />
                Đã lưu nháp
              </span>
            )}
          </div>
          <p className="mt-0.5 text-[13px] text-[var(--ink-secondary)]">
            Nhập thông tin sản phẩm, nhận về 3 góc bài viết tối ưu.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenHistory}
          className="btn-tactile inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-1.5 text-[12px] font-medium text-[var(--ink-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--ink-primary)]"
        >
          <History className="h-3.5 w-3.5" />
          Lịch sử
        </button>
      </div>

      <div className="flex flex-col items-start gap-5 lg:flex-row lg:gap-6">
        <aside className="w-full shrink-0 lg:sticky lg:top-[72px] lg:w-[420px]">
          <ProductForm
            value={formInputs}
            onChange={setFormInputs}
            onSubmit={handleSubmit}
            onLoadSample={handleLoadSample}
            loading={loading}
          />

          <p className="mt-2 text-center text-[12px] text-[var(--ink-tertiary)]">
            {typeof credits === "number" ? (
              <>
                Còn{" "}
                <span className="font-semibold tabular-nums text-[var(--ink-secondary)]">
                  {credits}
                </span>{" "}
                lượt tạo trong tài khoản của bạn
              </>
            ) : (
              "Đăng nhập để lưu lịch sử nội dung đã tạo"
            )}
          </p>
        </aside>

        <section className="w-full min-w-0 flex-1">
          <ResultsSection
            result={result}
            loading={loading}
            onRegenerate={handleRegenerate}
            onNotify={showToast}
          />
        </section>
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

      {/* Mobile sticky action bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border-subtle)] bg-[var(--surface)]/95 px-4 py-3 backdrop-blur-md md:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] text-[var(--ink-tertiary)]">
              {typeof credits === "number" ? (
                <>
                  Còn{" "}
                  <span className="font-semibold tabular-nums text-[var(--ink-primary)]">
                    {credits}
                  </span>{" "}
                  lượt tạo
                </>
              ) : (
                "Đăng nhập để lưu lịch sử"
              )}
            </p>
          </div>
          <button
            type="submit"
            form="product-form"
            disabled={loading}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[var(--accent-navy)] px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[var(--accent-navy-hover)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            <span>{loading ? "Đang tạo..." : "Tạo 3 góc"}</span>
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
  );
}