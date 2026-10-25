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
  const qrUrl = `https://img.vietqr.io/image/MB-${BANK_INFO.account}-compact2.png?amount=${selected.price}&addInfo=${encodeURIComponent(addInfo)}&accountName=${encodeURIComponent(BANK_INFO.holder)}`;

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
        className="animate-fade-in relative w-full max-w-3xl overflow-hidden rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 shadow-[0_24px_64px_rgba(0,0,0,0.5)] sm:p-6"
      >
        <div className="pointer-events-none absolute -right-20 -top-24 h-48 w-48 rounded-full bg-[var(--accent-navy)]/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />

        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng"
          className="btn-tactile absolute right-4 top-4 z-10 rounded-full p-2 text-[var(--ink-tertiary)] transition-colors hover:bg-[var(--surface-raised)] hover:text-[var(--ink-primary)]"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="relative flex items-center gap-3 border-b border-[var(--border-subtle)] pb-4 pr-10">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
            style={{
              backgroundImage:
                "linear-gradient(135deg, var(--accent-navy) 0%, #10b981 100%)",
            }}
          >
            <Zap className="h-5 w-5 fill-white text-white" />
          </div>
          <div>
            <h3
              id="topup-title"
              className="text-[17px] font-bold tracking-tight text-[var(--ink-primary)]"
            >
              Nâng Cấp Gói Pro Turbo
            </h3>
            <p className="text-[12px] text-[var(--ink-secondary)]">
              Mở khóa 0s Cooldown tức thì · Không giới hạn số bài viết · Băng thông AI ưu tiên
            </p>
          </div>
        </div>

        {/* 2-Column Responsive Body (0 Scrollbars) */}
        <div className="relative mt-4 grid grid-cols-1 items-stretch gap-4 md:grid-cols-12">
          {/* Left Column: 3 Packages (7 cols) */}
          <div className="flex flex-col justify-between gap-3 md:col-span-7">
            <div className="space-y-2">
              <span className="text-[10.5px] font-semibold uppercase tracking-wider text-[var(--ink-tertiary)]">
                1. Chọn gói Pro Turbo
              </span>
              {PACKAGES.map((pkg) => {
                const active = pkg.id === selectedId;
                return (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => setSelectedId(pkg.id)}
                    aria-pressed={active}
                    className={`btn-tactile flex w-full items-center justify-between gap-3 rounded-2xl border p-2.5 sm:p-3 text-left transition-all duration-200 ${
                      active
                        ? "border-emerald-500/60 bg-emerald-500/[0.08] ring-1 ring-emerald-500/30"
                        : "border-[var(--border-subtle)] bg-[var(--surface-raised)]/40 hover:border-[var(--border-strong)] hover:bg-[var(--surface-raised)]"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[13px] font-bold ${
                            active
                              ? "text-emerald-500 dark:text-emerald-400"
                              : "text-[var(--ink-primary)]"
                          }`}
                        >
                          {pkg.name}
                        </span>
                        {pkg.badge ? (
                          <span className="rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-500">
                            {pkg.badge}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-0.5 line-clamp-1 text-[11px] text-[var(--ink-tertiary)]">
                        {pkg.description}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-[13.5px] font-bold tabular-nums text-[var(--ink-primary)]">
                        {pkg.price.toLocaleString("vi-VN")}đ
                      </p>
                      <p className="mt-0.5 text-[10.5px] font-semibold text-emerald-500">
                        {pkg.duration}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Simulate Button */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleSimulate}
                disabled={pending}
                className="btn-tactile flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--accent-navy)]/60 bg-[var(--accent-navy)]/[0.08] px-3.5 py-2.5 text-[12px] font-semibold text-[var(--accent-navy)] transition-all hover:bg-[var(--accent-navy)]/15 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Zap className="h-3.5 w-3.5 fill-current text-[var(--accent-navy)]" />
                )}
                <span>Kích hoạt nhanh (Mô phỏng nâng cấp Pro Turbo)</span>
              </button>
            </div>
          </div>

          {/* Right Column: QR Code & Transfer Details (5 cols) */}
          <div className="flex flex-col justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-raised)]/60 p-3.5 md:col-span-5">
            <div className="space-y-2">
              <span className="text-[10.5px] font-semibold uppercase tracking-wider text-[var(--ink-tertiary)]">
                2. Quét mã VietQR chuyển khoản
              </span>

              <div className="flex justify-center rounded-xl bg-white p-2 shadow-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrUrl}
                  alt={`Mã VietQR gói ${selected.name}`}
                  width={120}
                  height={120}
                  loading="lazy"
                  className="h-[120px] w-[120px] object-contain"
                />
              </div>

              <div className="space-y-1 pt-0.5">
                {transferRows.map((row) => (
                  <div
                    key={row.key}
                    className="flex items-center justify-between gap-1 text-[11px]"
                  >
                    <span className="text-[var(--ink-tertiary)]">{row.label}:</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(row.key, row.value)}
                      title="Bấm để sao chép"
                      className="group inline-flex items-center gap-1 font-semibold text-[var(--ink-primary)] hover:text-emerald-500"
                    >
                      <span className="max-w-[140px] truncate">{row.value}</span>
                      {copiedKey === row.key ? (
                        <Check className="h-3 w-3 shrink-0 text-emerald-500" />
                      ) : (
                        <Copy className="h-2.5 w-2.5 shrink-0 text-[var(--ink-tertiary)] group-hover:text-emerald-500" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-2 flex items-center justify-center gap-1 text-[10.5px] text-[var(--ink-tertiary)]">
              <ShieldCheck className="h-3 w-3 text-emerald-500" />
              Tự động kích hoạt sau khi nhận chuyển khoản
            </p>
          </div>
        </div>

        {copiedKey ? (
          <div className="animate-fade-in absolute bottom-2 left-6 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10.5px] font-medium text-emerald-600 dark:text-emerald-400">
            <Check className="h-3 w-3" />
            Đã chép nội dung!
          </div>
        ) : null}

        {error ? (
          <p className="mt-2 text-center text-[11.5px] text-[#DC2626]">{error}</p>
        ) : null}
      </div>
    </div>
  );
}