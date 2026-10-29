"use client";

import { memo, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { AlertCircle, Check, ChevronDown, Clock, FlaskConical, Loader2, Wand2 } from "lucide-react";
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
    value: "hai-huoc",
    label: "Hài hước",
    hint: "Dí dỏm, viral, gần gũi và tự nhiên",
  },
  {
    value: "trang-trong",
    label: "Trang trọng",
    hint: "Chuẩn mực, lịch thiệp, tôn vinh giá trị",
  },
  {
    value: "tre-trung",
    label: "Trẻ trung",
    hint: "Năng động, hiện đại, bắt trend",
  },
];

const EXTENDED_TONES: ToneMeta[] = [
  {
    value: "chuyen-gia",
    label: "Trực diện & Chuyên gia",
    hint: "Lập luận logic, số liệu và nguyên lý",
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

interface IndustryPreset {
  label: string;
  title: string;
  input: ContentFormInput;
}

const INDUSTRY_PRESETS: IndustryPreset[] = [
  {
    label: "Áo sơ mi lụa",
    title: "Preset thời trang công sở",
    input: {
      productName: "Áo sơ mi lụa tơ tằm dệt tay Bảo Lộc",
      productDescription:
        "Chất liệu lụa tơ tằm 100% dệt thủ công tại làng nghề Bảo Lộc, bề mặt mềm mại óng ả tự nhiên, thấm hút mồ hôi tốt, form áo thanh lịch phù hợp môi trường công sở. Đường may tỉ mỉ, cổ áo cứng cáp giữ phom chuẩn.",
      targetAudience:
        "Nữ chuyên viên văn phòng 28–45 tuổi, yêu thích phong cách thanh lịch tối giản",
      tone: "trang-trong",
    },
  },
  {
    label: "Serum B5",
    title: "Preset mỹ phẩm skincare",
    input: {
      productName: "Serum Vitamin B5 phục hồi da chuyên sâu",
      productDescription:
        "Nồng độ Panthenol 10% kết hợp HA phân tử thấp, phục hồi hàng rào ẩm, làm dịu da kích ứng sau treatment. Kết cấu mỏng nhẹ thẩm thấu nhanh, không gây bít lỗ chân lông, phù hợp cả da nhạy cảm.",
      targetAudience:
        "Phụ nữ 25–40 tuổi có làn da nhạy cảm, thường xuyên trang điểm",
      tone: "chuyen-gia",
    },
  },
  {
    label: "Nước mắm",
    title: "Preset thực phẩm đặc sản",
    input: {
      productName: "Nước mắm cá cơm Phú Quốc ủ thùng gỗ 12 tháng",
      productDescription:
        "Ủ chượp truyền thống trong thùng gỗ từ cá cơm than tươi, độ đạm 40N, vị mặn dịu hậu ngọt tự nhiên, màu cánh gián sánh quyện. Không chất bảo quản, đóng chai thủy tinh nguyên chất.",
      targetAudience:
        "Nội trợ gia đình quan tâm thực phẩm sạch, người sành ăn",
      tone: "ke-chuyen",
    },
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
  "w-full rounded-xl border bg-[var(--canvas)] px-3.5 py-2.5 text-[14px] text-[var(--ink-primary)] placeholder:text-[var(--ink-tertiary)] transition-all duration-150 focus:outline-none focus:ring-2";
const inputNormalClass =
  "border-[var(--border-subtle)] focus:border-teal-400 focus:ring-teal-400/20";
const inputErrorClass =
  "border-red-500 focus:border-red-500 focus:ring-red-500/20";

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

function ProductForm({
  value,
  onChange,
  onSubmit,
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

  const handlePresetFill = (preset: IndustryPreset) => {
    onChange(preset.input);
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
      className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
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

        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="inline-flex items-center gap-1 text-[10.5px] font-medium uppercase tracking-wider text-[var(--ink-tertiary)]">
            <FlaskConical className="h-3 w-3 text-[var(--accent-navy)]" />
            Thử nhanh
          </span>
          <div className="flex items-center gap-1">
            {INDUSTRY_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handlePresetFill(preset)}
                disabled={loading}
                title={preset.title}
                className="btn-tactile rounded-md border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-2 py-1 text-[11px] font-medium text-[var(--ink-secondary)] transition-all duration-150 hover:border-[var(--border-strong)] hover:text-[var(--ink-primary)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
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

          <div role="group" aria-label="Chọn tông giọng" className="space-y-2">
            {PRIMARY_TONES.map((option) => {
              const active = value.tone === option.value;
              const toneColors: Record<string, { activeBorder: string; activeBg: string; text: string; dot: string }> = {
                "hai-huoc": {
                  activeBorder: "border-amber-500/50 dark:border-amber-400/50",
                  activeBg: "bg-amber-500/10",
                  text: "text-amber-700 dark:text-amber-400",
                  dot: "bg-amber-400",
                },
                "trang-trong": {
                  activeBorder: "border-teal-500/50 dark:border-teal-400/50",
                  activeBg: "bg-teal-500/10",
                  text: "text-teal-700 dark:text-teal-300",
                  dot: "bg-teal-400",
                },
                "tre-trung": {
                  activeBorder: "border-sky-500/50 dark:border-sky-400/50",
                  activeBg: "bg-sky-500/10",
                  text: "text-sky-700 dark:text-sky-400",
                  dot: "bg-sky-400",
                },
              };
              const colors = toneColors[option.value] || {
                activeBorder: "border-teal-500",
                activeBg: "bg-teal-500/10",
                text: "text-teal-400",
                dot: "bg-teal-400",
              };

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => update({ tone: option.value })}
                  aria-pressed={active}
                  title={option.hint}
                  className={`btn-tactile flex w-full items-center justify-between gap-2.5 rounded-xl border px-3.5 py-2.5 text-left transition-all duration-150 ${
                    active
                      ? `${colors.activeBorder} ${colors.activeBg} ring-2 ring-indigo-500/20 shadow-sm`
                      : "border-[var(--border-subtle)] bg-[var(--surface)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-raised)]"
                  }`}
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <span className={`h-2 w-2 rounded-full shrink-0 ${active ? colors.dot : "bg-zinc-400 dark:bg-zinc-600"}`} />
                    <span className="min-w-0">
                      <span
                        className={`block text-[13px] font-semibold ${
                          active ? colors.text : "text-[var(--ink-primary)]"
                        }`}
                      >
                        {option.label}
                      </span>
                      <span className="mt-0.5 block truncate text-[11.5px] text-[var(--ink-tertiary)]">
                        {option.hint}
                      </span>
                    </span>
                  </span>
                  {active ? (
                    <Check className={`h-4 w-4 shrink-0 ${colors.text}`} />
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
              ? "btn-tactile inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-4 py-3.5 text-[14px] font-semibold text-[var(--ink-secondary)] transition-all duration-200 hover:border-[var(--border-strong)]"
              : "btn-tactile inline-flex w-full items-center justify-center gap-2.5 rounded-xl py-3.5 text-[14px] font-bold bg-[#00D492] hover:bg-teal-400 text-black shadow-[0_0_20px_rgba(0,212,146,0.3)] transition-all disabled:cursor-not-allowed disabled:opacity-60"
          }
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Đang biên soạn bài viết...</span>
            </>
          ) : cooldownActive ? (
            <>
              <Clock className="h-4 w-4 animate-pulse text-[var(--ink-secondary)]" />
              <span>Đang sạc AI: {cooldownSeconds}s (Mở khóa Pro để tạo ngay)</span>
            </>
          ) : (
            <>
              <Wand2 className="h-4 w-4" />
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

export default memo(ProductForm);