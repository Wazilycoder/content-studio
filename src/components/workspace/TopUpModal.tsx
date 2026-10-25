"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, CheckCircle2, Copy, Crown, Loader2, ShieldCheck, Sparkles, X, Zap, ZoomIn } from "lucide-react";
import { topUpCredits } from "@/app/auth/actions";
import { copyToClipboard } from "@/lib/utils/clipboard";
import { PRICING_PLANS as PACKAGES, BANK_INFO } from "@/lib/config/pricing";

export interface TopUpModalProps {
  open: boolean;
  onClose: () => void;
  userIdentifier?: string | null;
  currentPlanId?: string;
  onSuccess?: (newCredits: number, message: string, planId?: string) => void;
}

export default function TopUpModal({
  open,
  onClose,
  userIdentifier,
  currentPlanId,
  onSuccess,
}: TopUpModalProps) {
  const [selectedId, setSelectedId] = useState(currentPlanId || "monthly");
  const [isZoomed, setIsZoomed] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (open && currentPlanId) {
      setSelectedId(currentPlanId);
    }
  }, [open, currentPlanId]);

  const selected = useMemo(
    () => PACKAGES.find((pkg) => pkg.id === selectedId) ?? PACKAGES[1],
    [selectedId],
  );

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isZoomed) {
          setIsZoomed(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose, isZoomed]);

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
    copyTimerRef.current = setTimeout(() => setCopiedKey(null), 1800);
  };

  const handleSimulate = async () => {
    if (pending) return;
    setPending(true);
    setError(null);
    try {
      const result = await topUpCredits(50, selected.id);
      if (!result.success) {
        setError(result.message);
        return;
      }
      onSuccess?.(
        result.newCredits,
        `Đã kích hoạt ${selected.tierFullTitle} thành công! 0s Cooldown và sẵn sàng sáng tạo.`,
        selected.id,
      );
      onClose();
    } catch {
      setError("Không thể kết nối máy chủ nâng cấp. Vui lòng thử lại.");
    } finally {
      setPending(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div
        className="animate-fade-in fixed inset-0 bg-black/75 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="topup-title"
        className="animate-fade-in relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 shadow-[0_24px_64px_rgba(0,0,0,0.5)] sm:p-6"
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
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-sm transition-all duration-300 ${
              selected.id === "yearly"
                ? "bg-gradient-to-br from-purple-600 to-indigo-700 shadow-[0_0_16px_rgba(147,51,234,0.35)]"
                : selected.id === "monthly"
                ? "bg-gradient-to-br from-amber-500 to-emerald-600 shadow-[0_0_16px_rgba(245,158,11,0.3)]"
                : "bg-gradient-to-br from-emerald-600 to-teal-700 shadow-[0_0_16px_rgba(16,185,129,0.3)]"
            }`}
          >
            {selected.id === "yearly" ? (
              <Crown className="h-5 w-5 fill-white text-white" />
            ) : selected.id === "monthly" ? (
              <Sparkles className="h-5 w-5 fill-white text-white" />
            ) : (
              <Zap className="h-5 w-5 fill-white text-white" />
            )}
          </div>
          <div>
            <h3
              id="topup-title"
              className="text-[17px] font-bold tracking-tight text-[var(--ink-primary)]"
            >
              Nâng Cấp Gói Dịch Vụ
            </h3>
            <p className="text-[12px] text-[var(--ink-secondary)]">
              Mở khóa 0s Cooldown tức thì · Không giới hạn bài viết · Đa dạng gói theo nhu cầu
            </p>
          </div>
        </div>

        {/* 2-Column Responsive Body */}
        <div className="relative mt-4 grid grid-cols-1 items-stretch gap-4 md:grid-cols-12">
          {/* Left Column: 3 Packages (6 cols) */}
          <div className="flex flex-col justify-between gap-3 md:col-span-6">
            <div className="space-y-2">
              <span className="text-[10.5px] font-semibold uppercase tracking-wider text-[var(--ink-tertiary)]">
                1. Chọn gói nâng cấp (49k · 99k · 499k)
              </span>
              {PACKAGES.map((pkg) => {
                const active = pkg.id === selectedId;
                const isYearly = pkg.id === "yearly";
                const isMonthly = pkg.id === "monthly";
                return (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => setSelectedId(pkg.id)}
                    aria-pressed={active}
                    className={`btn-tactile flex w-full items-center justify-between gap-3 rounded-2xl border p-3 text-left transition-all duration-200 ${
                      active
                        ? isYearly
                          ? "border-purple-500/70 bg-purple-500/[0.1] ring-1 ring-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.12)]"
                          : isMonthly
                          ? "border-amber-500/70 bg-amber-500/[0.1] ring-1 ring-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.12)]"
                          : "border-emerald-500/70 bg-emerald-500/[0.1] ring-1 ring-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.12)]"
                        : "border-[var(--border-subtle)] bg-[var(--surface-raised)]/40 hover:border-[var(--border-strong)] hover:bg-[var(--surface-raised)]"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        {isYearly ? (
                          <Crown className="h-3.5 w-3.5 shrink-0 fill-purple-500 text-purple-500" />
                        ) : isMonthly ? (
                          <Sparkles className="h-3.5 w-3.5 shrink-0 fill-amber-500 text-amber-500" />
                        ) : (
                          <Zap className="h-3.5 w-3.5 shrink-0 fill-emerald-500 text-emerald-500" />
                        )}
                        <span
                          className={`text-[13px] font-bold ${
                            active
                              ? isYearly
                                ? "text-purple-600 dark:text-purple-400"
                                : isMonthly
                                ? "text-amber-600 dark:text-amber-400"
                                : "text-emerald-600 dark:text-emerald-400"
                              : "text-[var(--ink-primary)]"
                          }`}
                        >
                          {pkg.name}
                        </span>
                        {pkg.badge ? (
                          <span
                            className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${
                              isYearly
                                ? "bg-purple-500/15 text-purple-600 dark:text-purple-400"
                                : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                            }`}
                          >
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
                      <p
                        className={`mt-0.5 text-[10.5px] font-semibold ${
                          isYearly
                            ? "text-purple-600 dark:text-purple-400"
                            : isMonthly
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-emerald-600 dark:text-emerald-400"
                        }`}
                      >
                        {pkg.duration}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Confirm Transfer Button */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleSimulate}
                disabled={pending}
                className={`btn-tactile flex w-full items-center justify-center gap-2 rounded-xl border px-3.5 py-2.5 text-[12.5px] font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-60 shadow-xs ${
                  selected.id === "yearly"
                    ? "border-purple-500/40 bg-purple-500/[0.12] text-purple-600 hover:bg-purple-500/20 dark:text-purple-400"
                    : selected.id === "monthly"
                    ? "border-amber-500/40 bg-amber-500/[0.12] text-amber-600 hover:bg-amber-500/20 dark:text-amber-400"
                    : "border-emerald-500/40 bg-emerald-500/[0.1] text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400"
                }`}
              >
                {pending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : selected.id === "yearly" ? (
                  <Crown className="h-4 w-4 fill-purple-500 text-purple-500" />
                ) : selected.id === "monthly" ? (
                  <Sparkles className="h-4 w-4 fill-amber-500 text-amber-500" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                )}
                <span>Xác nhận đã chuyển khoản ({selected.tierBadge})</span>
              </button>
            </div>
          </div>

          {/* Right Column: Unified SePay VietQR & Bank Info (6 cols) */}
          <div className="flex flex-col justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-raised)]/60 p-3.5 sm:p-4 md:col-span-6">
            <div className="space-y-3">
              {/* Header: Unified Single QR Header */}
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
                <div>
                  <h4 className="text-[13px] font-bold text-[var(--ink-primary)]">
                    Quét mã VietQR
                  </h4>
                  <p className="text-[11px] text-[var(--ink-tertiary)]">
                    Tự động kích hoạt gói qua SePay 24/7
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10.5px] font-semibold text-emerald-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Napas 24/7
                </span>
              </div>

              {/* Single Unified QR Code Container */}
              <div className="flex flex-col items-center justify-center pt-0.5">
                <div
                  onClick={() => setIsZoomed(true)}
                  title="Nhấn để phóng to mã QR"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setIsZoomed(true);
                    }
                  }}
                  className="group relative cursor-zoom-in rounded-2xl border border-neutral-200 bg-white p-2.5 shadow-sm transition-all duration-200 hover:scale-[1.02] hover:ring-2 hover:ring-emerald-500/40 dark:border-neutral-700/60"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selected.qrImage}
                    alt={`Mã VietQR ${selected.name}`}
                    width={150}
                    height={200}
                    loading="lazy"
                    className="max-h-[195px] w-[150px] rounded-lg object-contain"
                  />
                  <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 opacity-0 backdrop-blur-[1px] transition-opacity group-hover:opacity-100">
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/85 px-2.5 py-1 text-[10.5px] font-semibold text-white shadow-sm">
                      <ZoomIn className="h-3 w-3" /> Phóng to
                    </span>
                  </div>
                </div>

                <p className="mt-1.5 text-[11px] font-medium text-emerald-500">
                  ✓ Đã tự động điền {selected.price.toLocaleString("vi-VN")}đ &amp; cú pháp {selected.transferCode}
                </p>
              </div>

              {/* Transfer Details Card */}
              <div className="space-y-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)]/90 p-2.5 text-[11.5px]">
                {/* Bank */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[var(--ink-tertiary)]">Ngân hàng</span>
                  <span className="font-semibold text-[var(--ink-primary)]">
                    {BANK_INFO.bank}
                  </span>
                </div>

                {/* Account Holder - Displayed full, no ellipsis */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[var(--ink-tertiary)]">Chủ tài khoản</span>
                  <span className="font-bold uppercase tracking-tight text-[var(--ink-primary)]">
                    {BANK_INFO.holder}
                  </span>
                </div>

                {/* Account Number */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[var(--ink-tertiary)]">Số tài khoản</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold tracking-wide text-emerald-500 dark:text-emerald-400">
                      {BANK_INFO.account}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy("account", BANK_INFO.account)}
                      className="btn-tactile inline-flex items-center gap-1 rounded-md bg-[var(--surface-raised)] px-1.5 py-0.5 text-[10.5px] font-medium text-[var(--ink-secondary)] transition-colors hover:text-emerald-500"
                      title="Sao chép số tài khoản"
                    >
                      {copiedKey === "account" ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-500" />
                          <span className="font-semibold text-emerald-500">Đã sao chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-2.5 w-2.5 text-[var(--ink-tertiary)]" />
                          <span>Sao chép</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Amount */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[var(--ink-tertiary)]">Số tiền</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold tabular-nums text-[var(--ink-primary)]">
                      {selected.price.toLocaleString("vi-VN")} VNĐ
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy("amount", String(selected.price))}
                      className="btn-tactile inline-flex items-center gap-1 rounded-md bg-[var(--surface-raised)] px-1.5 py-0.5 text-[10.5px] font-medium text-[var(--ink-secondary)] transition-colors hover:text-emerald-500"
                      title="Sao chép số tiền"
                    >
                      {copiedKey === "amount" ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-500" />
                          <span className="font-semibold text-emerald-500">Đã sao chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-2.5 w-2.5 text-[var(--ink-tertiary)]" />
                          <span>Sao chép</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Transfer Memo */}
                <div className="flex items-center justify-between gap-2 border-t border-[var(--border-subtle)] pt-1">
                  <span className="text-[var(--ink-tertiary)]">Cú pháp CK</span>
                  <div className="flex items-center gap-1.5">
                    <span className="rounded bg-emerald-500/10 px-2 py-0.5 font-mono text-[12px] font-bold text-emerald-400">
                      {selected.transferCode}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy("memo", selected.transferCode)}
                      className="btn-tactile inline-flex items-center gap-1 rounded-md bg-[var(--surface-raised)] px-1.5 py-0.5 text-[10.5px] font-medium text-[var(--ink-secondary)] transition-colors hover:text-emerald-500"
                      title="Sao chép cú pháp chuyển khoản"
                    >
                      {copiedKey === "memo" ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-500" />
                          <span className="font-semibold text-emerald-500">Đã sao chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-2.5 w-2.5 text-[var(--ink-tertiary)]" />
                          <span>Sao chép</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-[var(--ink-tertiary)]">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              Tự động kích hoạt sau khi hệ thống nhận chuyển khoản
            </p>
          </div>
        </div>

        {/* Zoom Lightbox Modal */}
        {isZoomed && (
          <div
            className="animate-fade-in fixed inset-0 z-60 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
            onClick={() => setIsZoomed(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Phóng to mã QR"
          >
            <div
              className="relative flex w-full max-w-sm flex-col items-center gap-3 rounded-3xl border border-neutral-700/60 bg-neutral-900 p-5 text-center shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setIsZoomed(false)}
                className="btn-tactile absolute right-3.5 top-3.5 rounded-full p-1.5 text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-neutral-100"
                aria-label="Đóng phóng to"
              >
                <X className="h-5 w-5" />
              </button>

              <p className="text-[14px] font-bold text-neutral-100">
                Mã VietQR — Gói {selected.name}
              </p>

              <div className="rounded-2xl bg-white p-3 shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selected.qrImage}
                  alt={`Mã VietQR gói ${selected.name}`}
                  width={280}
                  height={370}
                  className="max-h-[380px] w-[280px] rounded-xl object-contain"
                />
              </div>

              <div className="w-full space-y-1 border-t border-neutral-800 pt-3 text-left text-[12px]">
                <p className="font-bold text-neutral-100">
                  {BANK_INFO.bank} · <span className="font-mono text-emerald-400">{BANK_INFO.account}</span>
                </p>
                <p className="text-neutral-300">
                  Chủ TK: <span className="font-semibold text-white">{BANK_INFO.holder}</span>
                </p>
                <p className="font-semibold text-emerald-400">
                  Số tiền: {selected.price.toLocaleString("vi-VN")} VNĐ
                </p>
                <p className="font-mono text-[11px] text-neutral-400">
                  Cú pháp: <span className="font-bold text-white">{selected.transferCode}</span>
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsZoomed(false)}
                className="btn-tactile mt-1 w-full rounded-xl bg-neutral-800 py-2 text-[12px] font-semibold text-neutral-200 transition-colors hover:bg-neutral-700"
              >
                Đóng
              </button>
            </div>
          </div>
        )}

        {error ? (
          <p className="mt-2 text-center text-[11.5px] text-[#DC2626]">{error}</p>
        ) : null}
      </div>
    </div>
  );
}