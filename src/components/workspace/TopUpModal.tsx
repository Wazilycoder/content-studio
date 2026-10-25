"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Copy, Loader2, ShieldCheck, Sparkles, X, Zap } from "lucide-react";
import { topUpCredits } from "@/app/auth/actions";
import { copyToClipboard } from "@/lib/utils/clipboard";
import { PRICING_PLANS as PACKAGES, BANK_INFO } from "@/lib/config/pricing";

export interface TopUpModalProps {
  open: boolean;
  onClose: () => void;
  userIdentifier?: string | null;
  onSuccess?: (newCredits: number, message: string) => void;
}

export default function TopUpModal({
  open,
  onClose,
  userIdentifier,
  onSuccess,
}: TopUpModalProps) {
  const [selectedId, setSelectedId] = useState("monthly");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selected = useMemo(
    () => PACKAGES.find((pkg) => pkg.id === selectedId) ?? PACKAGES[1],
    [selectedId],
  );

  const identifier = (userIdentifier ?? "").trim() || "guest";
  const addInfo = `NAP CS ${identifier}`;
  const qrUrl = `https://img.vietqr.io/image/MB-0388888888-compact2.png?amount=${selected.price}&addInfo=${encodeURIComponent(addInfo)}&accountName=${encodeURIComponent(BANK_INFO.holder)}`;

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  const handleCopy = async (key: string, value: string) => {
    const ok = await copyToClipboard(value);
    if (!ok) return;
    setCopiedKey(key);
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => setCopiedKey(null), 1600);
  };

  const handleSimulate = async () => {
    if (pending) return;
    setPending(true);
    setError(null);
    try {
      const result = await topUpCredits(50);
      if (!result.success) {
        setError(result.message);
        return;
      }
        onSuccess?.(
          result.newCredits,
          "Đã nâng cấp Pro Turbo thành công! Bạn có thể tạo ngay lập tức không cần chờ.",
        );
        onClose();
      } catch {
        setError("Không thể kết nối máy chủ nâng cấp. Vui lòng thử lại.");
    } finally {
      setPending(false);
    }
  };

  if (!open) return null;

  const transferRows = [
    { key: "bank", label: "Ngân hàng", value: BANK_INFO.bank },
    { key: "account", label: "Số tài khoản", value: BANK_INFO.account },
    { key: "holder", label: "Chủ tài khoản", value: BANK_INFO.holder },
    {
      key: "amount",
      label: "Số tiền",
      value: `${selected.price.toLocaleString("vi-VN")} VNĐ`,
    },
    { key: "memo", label: "Cú pháp", value: addInfo },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="animate-fade-in fixed inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="topup-title"
        className="animate-fade-in relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.35)]"
      >
        <div className="pointer-events-none absolute -right-20 -top-24 h-48 w-48 rounded-full bg-[var(--accent-navy)]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-48 w-48 rounded-full bg-fuchsia-500/10 blur-3xl" />

        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng"
          className="absolute right-4 top-4 z-10 rounded-lg p-1.5 text-[var(--ink-tertiary)] transition-colors hover:bg-[var(--surface-raised)] hover:text-[var(--ink-primary)]"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative flex items-start gap-3 pr-8">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white shadow-[0_10px_24px_rgba(37,52,199,0.35)]"
            style={{
              backgroundImage:
                "linear-gradient(135deg, var(--accent-navy) 0%, #6366F1 55%, #A855F7 100%)",
            }}
          >
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3
              id="topup-title"
              className="text-[16px] font-semibold tracking-tight text-[var(--ink-primary)]"
            >
              Nạp thêm lượt tạo AI Studio
            </h3>
            <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--ink-secondary)]">
              Mở khóa giới hạn sáng tạo nội dung Facebook &amp; Instagram không ngừng nghỉ.
            </p>
          </div>
        </div>

        <div className="relative mt-5 space-y-2">
          {PACKAGES.map((pkg) => {
            const active = pkg.id === selectedId;
            return (
              <button
                key={pkg.id}
                type="button"
                onClick={() => setSelectedId(pkg.id)}
                aria-pressed={active}
                className={`flex w-full items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-all duration-200 ${
                  active
                    ? "border-[var(--accent-navy)]/60 bg-[var(--accent-navy)]/[0.07] ring-2 ring-[var(--accent-navy)]/25"
                    : "border-[var(--border-subtle)] bg-[var(--surface)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-raised)]"
                }`}
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span
                      className={`text-[13px] font-semibold ${
                        active
                          ? "text-[var(--accent-navy)]"
                          : "text-[var(--ink-primary)]"
                      }`}
                    >
                      Gói {pkg.name}
                    </span>
                    <span className="rounded-full bg-[var(--surface-raised)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--ink-tertiary)]">
                      {pkg.tagline}
                    </span>
                    {pkg.badge ? (
                      <span className="rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-600 dark:text-amber-400">
                        {pkg.badge}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-[11.5px] leading-relaxed text-[var(--ink-tertiary)]">
                    {pkg.description}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[13px] font-semibold tabular-nums text-[var(--ink-primary)]">
                    {pkg.price.toLocaleString("vi-VN")}đ
                  </p>
                  <p className="mt-0.5 text-[11px] text-[var(--ink-tertiary)]">{pkg.duration}</p>
                  <p className="mt-0.5 inline-flex items-center gap-1 text-[10.5px] font-semibold text-[var(--accent-emerald)]">
                    <Zap className="h-3 w-3 fill-emerald-500 text-emerald-500" />
                    <span>0s Cooldown tức thì</span>
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="relative mt-4 grid gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)]/60 p-3 sm:grid-cols-[128px_1fr]">
          <div className="flex items-center justify-center rounded-lg bg-white p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrUrl}
              alt={`Mã VietQR nạp gói ${selected.name}`}
              width={112}
              height={112}
              loading="lazy"
              className="h-28 w-28 object-contain"
            />
          </div>
          <div className="min-w-0 space-y-1">
            {transferRows.map((row) => (
              <div key={row.key} className="flex items-center justify-between gap-2">
                <span className="shrink-0 text-[11.5px] text-[var(--ink-tertiary)]">
                  {row.label}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(row.key, row.value)}
                  title="Bấm để sao chép"
                  className="group inline-flex min-w-0 items-center gap-1.5 rounded-md px-1.5 py-0.5 text-[11.5px] font-medium text-[var(--ink-primary)] transition-colors hover:bg-[var(--surface)]"
                >
                  <span className="truncate">{row.value}</span>
                  {copiedKey === row.key ? (
                    <Check className="h-3 w-3 shrink-0 text-emerald-500" />
                  ) : (
                    <Copy className="h-3 w-3 shrink-0 text-[var(--ink-tertiary)] group-hover:text-[var(--ink-primary)]" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {copiedKey ? (
          <div className="animate-fade-in relative mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
            <Check className="h-3 w-3" />
            Đã chép!
          </div>
        ) : null}

        {error ? (
          <p className="relative mt-3 text-[12px] leading-relaxed text-[#DC2626]">{error}</p>
        ) : null}

        <div className="relative mt-4 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={handleSimulate}
            disabled={pending}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--accent-navy)]/50 bg-[var(--accent-navy)]/[0.06] px-3 py-2.5 text-[12px] font-semibold text-[var(--accent-navy)] transition-all hover:border-[var(--accent-navy)] hover:bg-[var(--accent-navy)]/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Zap className="h-3.5 w-3.5 fill-current text-[var(--accent-navy)]" />
            <span>Kích hoạt nhanh (Mô phỏng nâng cấp Pro Turbo)</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] px-4 py-2.5 text-[12px] font-medium text-[var(--ink-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--ink-primary)]"
          >
            Để sau
          </button>
        </div>

        <p className="relative mt-3 flex items-center justify-center gap-1.5 text-[11px] text-[var(--ink-tertiary)]">
          <ShieldCheck className="h-3 w-3 text-emerald-500" />
          Giao dịch được đối soát thủ công trong 1–3 phút và kích hoạt Pro Turbo tự động.
        </p>
      </div>
    </div>
  );
}