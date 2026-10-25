"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { AlertCircle, Check, ChevronDown, FlaskConical, Loader2, Sparkles } from "lucide-react";
import { countUnicodeChars } from "@/lib/utils/charCounter";
import type { ContentFormInput, ToneOption } from "@/types/content";

const MAX_PRODUCT_NAME = 100;
const MAX_DESCRIPTION = 1000;
const MAX_AUDIENCE = 200;

interface ToneMeta {
  value: ToneOption;
  label: string;
  hint: string;
}

const PRIMARY_TONES: ToneMeta[] = [
  {
    value: "trang-trong",
    label: "Sang trọng & Cao cấp",
    hint: "Thanh lịch, chuẩn mực, tôn vinh giá trị",
  },
  {
    value: "hai-huoc",
    label: "Hài hước & Đời thường",
    hint: "Dí dỏm, viral, gần gũi",
  },
  {
    value: "chuyen-gia",
    label: "Trực diện & Chuyên gia",
    hint: "Lập luận logic, số liệu và nguyên lý",
  },
];

const EXTENDED_TONES: ToneMeta[] = [
  {
    value: "tre-trung",
    label: "Trẻ trung & Bắt trend",
    hint: "Năng động, hiện đại, phóng khoáng",
  },
  {
    value: "dong-cam",
    label: "Đồng cảm & Chữa lành",
    hint: "Thủ thỉ, sâu lắng, chạm cảm xúc",
  },
  {
    value: "ke-chuyen",
    label: "Storytelling",
    hint: "Kể chuyện di sản, cảm hứng làng nghề",
  },
  {
    value: "kich-thich",
    label: "Kích thích mua & FOMO",
    hint: "Khẩn trương, ưu đãi giới hạn",
  },
];

type FieldName = "productName" | "productDescription" | "targetAudience";
type FieldErrors = Partial<Record<FieldName, string>>;

interface ProductFormProps {
  value: ContentFormInput;
  onChange: (next: ContentFormInput) => void;
  onSubmit: () => void;
  onLoadSample: () => void;
  loading: boolean;
  cooldownSeconds?: number;
  isPro?: boolean;
  onOpenUpgrade?: () => void;
}

function validate(values: ContentFormInput): FieldErrors {
  const errors: FieldErrors = {};

  const productName = values.productName.trim();
  const productDescription = values.productDescription.trim();
  const targetAudience = values.targetAudience.trim();

  if (productName.length === 0) {
    errors.productName = "Vui lòng nhập tên sản phẩm.";
  } else if (productName.length < 2) {
    errors.productName = "Tên sản phẩm cần tối thiểu 2 ký tự.";
  }

  if (productDescription.length === 0) {
    errors.productDescription = "Vui lòng mô tả sản phẩm.";
  }

  if (targetAudience.length === 0) {
    errors.targetAudience = "Vui lòng nhập khách hàng mục tiêu.";
  }

  return errors;
}

const inputBaseClass =
  "w-full rounded-lg border bg-[var(--surface)] px-3 py-2.5 text-[14px] text-[var(--ink-primary)] placeholder:text-[var(--ink-tertiary)] transition-colors focus:outline-none focus:ring-2";
const inputNormalClass =
  "border-[var(--border-subtle)] focus:border-[var(--border-strong)] focus:ring-[var(--accent-navy)]/15";
const inputErrorClass =
  "border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]/15";

function MicroBar({ value, max }: { value: number; max: number }) {
  const ratio = Math.min(value / max, 1);
  const nearLimit = ratio >= 0.9;
  return (
    <div className="h-1 w-full overflow-hidden rounded-full bg-[var(--surface-raised)]">
      <div
        className={`h-full rounded-full transition-all duration-500 ease-out ${
          nearLimit ? "bg-amber-500" : "bg-emerald-500"
        }`}
        style={{ width: `${ratio * 100}%` }}
      />
    </div>
  );
}

export default function ProductForm({
  value,
  onChange,
  onSubmit,
  onLoadSample,
  loading,
  cooldownSeconds = 0,
  isPro = false,
  onOpenUpgrade,
}: ProductFormProps) {
  const [touched, setTouched] = useState<Record<FieldName, boolean>>({
    productName: false,
    productDescription: false,
    targetAudience: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [showExtendedTones, setShowExtendedTones] = useState(false);
  const [isSamplePulsing, setIsSamplePulsing] = useState(false);

  const errors = useMemo(() => validate(value), [value]);

  const selectedIsExtended = EXTENDED_TONES.some(
    (tone) => tone.value === value.tone,
  );
  const extendedVisible = showExtendedTones || selectedIsExtended;
  const cooldownActive = Boolean(cooldownSeconds > 0 && !isPro);

  const showError = (field: FieldName): string | undefined => {
    if (!submitted && !touched[field]) return undefined;
    return errors[field];
  };

  const update = (patch: Partial<ContentFormInput>) => {
    onChange({ ...value, ...patch });
  };

  const markTouched = (field: FieldName) => {
    setTouched((previous) => ({ ...previous, [field]: true }));
  };

  const handleSampleClick = () => {
    onLoadSample();
    setIsSamplePulsing(true);
    window.setTimeout(() => setIsSamplePulsing(false), 850);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    if (loading) return;
    if (Object.keys(validate(value)).length > 0) return;
    onSubmit();
  };

  const productNameError = showError("productName");
  const descriptionError = showError("productDescription");
  const audienceError = showError("targetAudience");

  return (
    <form
      id="product-form"
      onSubmit={handleSubmit}
      noValidate
      className="overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
    >
      <div className="flex items-start justify-between gap-3 border-b border-[var(--border-subtle)] px-5 pb-4 pt-5">
        <div className="min-w-0">
          <h2 className="text-[15px] font-semibold tracking-tight text-[var(--ink-primary)]">
            Thông tin sản phẩm
          </h2>
          <p className="mt-1 text-[13px] leading-relaxed text-[var(--ink-secondary)]">
            Càng chi tiết, nội dung tạo ra càng sát ý bạn.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSampleClick}
          disabled={loading}
          title="Điền nhanh một bộ dữ liệu mẫu để thử nghiệm"
          className="btn-tactile inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-2.5 py-1.5 text-[12px] font-medium text-[var(--ink-secondary)] transition-all duration-150 hover:border-[var(--border-strong)] hover:text-[var(--ink-primary)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FlaskConical className="h-3.5 w-3.5 text-[var(--accent-navy)]" />
          Dữ liệu mẫu
        </button>
      </div>

      <div className="space-y-5 px-5 py-5">
        {/* 01. Tên sản phẩm */}
        <div>
          <div className="mb-2 flex items-baseline justify-between gap-2">
            <label
              htmlFor="productName"
              className="text-[13px] font-medium text-[var(--ink-primary)]"
            >
              01. Tên sản phẩm <span className="text-[#DC2626]">*</span>
            </label>
            <span className="text-[12px] tabular-nums text-[var(--ink-tertiary)]">
              {countUnicodeChars(value.productName)} / 100
            </span>
          </div>

          <input
            id="productName"
            type="text"
            value={value.productName}
            onChange={(event) => update({ productName: event.target.value })}
            onBlur={() => markTouched("productName")}
            maxLength={MAX_PRODUCT_NAME}
            placeholder="Ví dụ: Áo sơ mi lụa tơ tằm dệt tay Bảo Lộc"
            aria-invalid={Boolean(productNameError)}
            className={`${inputBaseClass} ${
              productNameError ? inputErrorClass : inputNormalClass
            } ${isSamplePulsing ? "sample-pulse ring-2 ring-[var(--accent-navy)]/35" : ""}`}
          />

          <div className="mt-1.5">
            <MicroBar
              value={countUnicodeChars(value.productName)}
              max={MAX_PRODUCT_NAME}
            />
          </div>

          {productNameError ? (
            <p className="mt-1.5 flex items-start gap-1 text-[12px] leading-relaxed text-[#DC2626]">
              <AlertCircle className="mt-[1px] h-3.5 w-3.5 shrink-0" />
              <span>{productNameError}</span>
            </p>
          ) : null}
        </div>

        {/* 02. Mô tả & Chất liệu */}
        <div>
          <div className="mb-2 flex items-baseline justify-between gap-2">
            <label
              htmlFor="productDescription"
              className="text-[13px] font-medium text-[var(--ink-primary)]"
            >
              02. Mô tả &amp; Chất liệu <span className="text-[#DC2626]">*</span>
            </label>
            <span className="text-[12px] tabular-nums text-[var(--ink-tertiary)]">
              {countUnicodeChars(value.productDescription)} / 1.000
            </span>
          </div>

          <textarea
            id="productDescription"
            rows={5}
            value={value.productDescription}
            onChange={(event) =>
              update({ productDescription: event.target.value })
            }
            onBlur={() => markTouched("productDescription")}
            maxLength={MAX_DESCRIPTION}
            placeholder="Chất liệu, công dụng, điểm khác biệt, quy cách đóng gói..."
            aria-invalid={Boolean(descriptionError)}
            className={`${inputBaseClass} resize-y leading-relaxed ${
              descriptionError ? inputErrorClass : inputNormalClass
            } ${isSamplePulsing ? "sample-pulse ring-2 ring-[var(--accent-navy)]/35" : ""}`}
          />

          <div className="mt-1.5">
            <MicroBar
              value={countUnicodeChars(value.productDescription)}
              max={MAX_DESCRIPTION}
            />
          </div>

          {descriptionError ? (
            <p className="mt-1.5 flex items-start gap-1 text-[12px] leading-relaxed text-[#DC2626]">
              <AlertCircle className="mt-[1px] h-3.5 w-3.5 shrink-0" />
              <span>{descriptionError}</span>
            </p>
          ) : null}
        </div>

        {/* 03. Khách hàng mục tiêu */}
        <div>
          <div className="mb-2 flex items-baseline justify-between gap-2">
            <label
              htmlFor="targetAudience"
              className="text-[13px] font-medium text-[var(--ink-primary)]"
            >
              03. Khách hàng mục tiêu <span className="text-[#DC2626]">*</span>
            </label>
            <span className="text-[12px] tabular-nums text-[var(--ink-tertiary)]">
              {countUnicodeChars(value.targetAudience)} / 200
            </span>
          </div>

          <input
            id="targetAudience"
            type="text"
            value={value.targetAudience}
            onChange={(event) => update({ targetAudience: event.target.value })}
            onBlur={() => markTouched("targetAudience")}
            maxLength={MAX_AUDIENCE}
            placeholder="Ví dụ: Nữ chuyên viên văn phòng 28–45 tuổi"
            aria-invalid={Boolean(audienceError)}
            className={`${inputBaseClass} ${
              audienceError ? inputErrorClass : inputNormalClass
            } ${isSamplePulsing ? "sample-pulse ring-2 ring-[var(--accent-navy)]/35" : ""}`}
          />

          <div className="mt-1.5">
            <MicroBar
              value={countUnicodeChars(value.targetAudience)}
              max={MAX_AUDIENCE}
            />
          </div>

          {audienceError ? (
            <p className="mt-1.5 flex items-start gap-1 text-[12px] leading-relaxed text-[#DC2626]">
              <AlertCircle className="mt-[1px] h-3.5 w-3.5 shrink-0" />
              <span>{audienceError}</span>
            </p>
          ) : null}
        </div>

        {/* Tông giọng */}
        <div>
          <span className="mb-2 block text-[13px] font-medium text-[var(--ink-primary)]">
            Tông giọng
          </span>

          <div role="group" aria-label="Chọn tông giọng" className="space-y-1.5">
            {PRIMARY_TONES.map((option) => {
              const active = value.tone === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => update({ tone: option.value })}
                  aria-pressed={active}
                  title={option.hint}
                  className={`btn-tactile flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left transition-all duration-200 ${
                    active
                      ? "border-[var(--accent-navy)] bg-[var(--accent-navy)]/[0.06] ring-2 ring-[var(--accent-navy)]/25 shadow-[0_4px_14px_rgba(37,52,199,0.12)]"
                      : "border-[var(--border-subtle)] bg-[var(--surface)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-raised)]"
                  }`}
                >
                  <span className="min-w-0">
                    <span
                      className={`block text-[13px] font-semibold ${
                        active
                          ? "text-[var(--accent-navy)]"
                          : "text-[var(--ink-primary)]"
                      }`}
                    >
                      {option.label}
                    </span>
                    <span className="mt-0.5 block truncate text-[12px] text-[var(--ink-tertiary)]">
                      {option.hint}
                    </span>
                  </span>
                  {active ? (
                    <Check className="h-4 w-4 shrink-0 text-[var(--accent-navy)]" />
                  ) : null}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setShowExtendedTones((previous) => !previous)}
            aria-expanded={extendedVisible}
            className="mt-2 inline-flex items-center gap-1 text-[12px] font-medium text-[var(--ink-secondary)] transition-colors hover:text-[var(--ink-primary)]"
          >
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform ${extendedVisible ? "rotate-180" : ""}`}
            />
            {extendedVisible ? "Thu gọn tông giọng" : "Tông giọng mở rộng..."}
          </button>

          {extendedVisible ? (
            <div
              role="group"
              aria-label="Tông giọng mở rộng"
              className="mt-2 space-y-1.5"
            >
              {EXTENDED_TONES.map((option) => {
                const active = value.tone === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => update({ tone: option.value })}
                    aria-pressed={active}
                    title={option.hint}
                    className={`btn-tactile flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left transition-all duration-200 ${
                      active
                        ? "border-[var(--accent-navy)] bg-[var(--accent-navy)]/[0.06] ring-2 ring-[var(--accent-navy)]/25 shadow-[0_4px_14px_rgba(37,52,199,0.12)]"
                        : "border-[var(--border-subtle)] bg-[var(--surface)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-raised)]"
                    }`}
                  >
                    <span className="min-w-0">
                      <span
                        className={`block text-[13px] font-semibold ${
                          active
                            ? "text-[var(--accent-navy)]"
                            : "text-[var(--ink-primary)]"
                        }`}
                      >
                        {option.label}
                      </span>
                      <span className="mt-0.5 block truncate text-[12px] text-[var(--ink-tertiary)]">
                        {option.hint}
                      </span>
                    </span>
                    {active ? (
                      <Check className="h-4 w-4 shrink-0 text-[var(--accent-navy)]" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>

      <div className="hidden px-5 pb-5 md:block">
        <button
          type={cooldownActive ? "button" : "submit"}
          onClick={cooldownActive ? onOpenUpgrade : undefined}
          disabled={loading}
          className={
            cooldownActive
              ? "inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-4 py-3 text-[14px] font-semibold text-[var(--ink-secondary)] transition-all duration-200 hover:border-[var(--border-strong)]"
              : "inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--accent-navy)] px-4 py-3 text-[14px] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--accent-navy-hover)] hover:shadow-[0_6px_16px_rgba(37,52,199,0.18)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-navy)]/30 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none"
          }
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Đang biên soạn bài viết...</span>
            </>
          ) : cooldownActive ? (
            <>
              <span aria-hidden="true">⏱️</span>
              <span>Đang sạc AI: {cooldownSeconds}s (Mở khóa Pro để tạo ngay)</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>Tạo 3 góc bài viết</span>
            </>
          )}
        </button>

        <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-[11.5px] leading-relaxed text-[var(--ink-tertiary)]">
          <span className="text-[var(--accent-emerald)]">✓</span>
          Gói Miễn Phí: Không giới hạn số bài tạo · Chờ 45s để điều tiết tài nguyên AI
        </p>

        <p className="mt-2 text-center text-[12px] text-[var(--ink-tertiary)]">
          Nhấn{" "}
          <kbd className="rounded border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-1 py-0.5 text-[11px] font-medium text-[var(--ink-secondary)]">
            Ctrl
          </kbd>{" "}
          +{" "}
          <kbd className="rounded border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-1 py-0.5 text-[11px] font-medium text-[var(--ink-secondary)]">
            Enter
          </kbd>{" "}
          để tạo nhanh
        </p>
      </div>
    </form>
  );
}