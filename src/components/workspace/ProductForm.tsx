"use client";

import { memo, useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  AlertCircle,
  AlignLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Clock,
  FlaskConical,
  Loader2,
  ShoppingBag,
  Sparkles,
  Tag,
  Target,
  Users,
  Wand2,
} from "lucide-react";
import { countUnicodeChars } from "@/lib/utils/charCounter";
import type { ContentFormInput, ToneOption } from "@/types/content";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useToast } from "@/components/ui/SonnerToast";

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
  "w-full rounded-lg border bg-[#07090E] px-3.5 py-2.5 text-[13.5px] text-[#F8FAFC] placeholder:text-slate-500 transition-colors duration-150 focus:outline-none focus:ring-1";
const inputNormalClass =
  "border-[#1E2333] hover:border-[#2D354B] focus:border-emerald-500 focus:ring-emerald-500/30";
const inputErrorClass =
  "border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/20 bg-rose-950/20 text-white";

function MicroBar({ value, max }: { value: number; max: number }) {
  const ratio = Math.min(value / max, 1);
  const nearLimit = ratio >= 0.9;
  return (
    <div className="h-1 w-full overflow-hidden rounded-full bg-[#1E2333]">
      <div
        className={`h-full rounded-full transition-all duration-300 ease-out ${
          nearLimit ? "bg-amber-400" : "bg-emerald-400"
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
  const toast = useToast();

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
    toast.info(`Đã nạp nhanh: ${preset.title}`, {
      description: "Nhấn Tạo 3 góc bài viết hoặc Ctrl+Enter để biên soạn.",
    });
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
      className="rounded-xl border border-[#1E2333] bg-[#0E121B] shadow-sm"
    >
      <div className="flex items-start justify-between gap-3 border-b border-[#1E2333] px-4 pb-3.5 pt-4">
        <div className="min-w-0">
          <div className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
            <Sparkles className="h-2.5 w-2.5" />
            <span>Đề bài sản phẩm</span>
          </div>
          <h2 className="text-[14px] font-semibold tracking-tight text-white">
            Thông tin sản phẩm
          </h2>
          <p className="mt-0.5 text-[12px] leading-relaxed text-slate-400">
            Càng chi tiết, nội dung tạo ra càng sát ý bạn.
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium uppercase tracking-wider text-slate-400">
            <FlaskConical className="h-3 w-3 text-emerald-400" />
            Nạp mẫu nhanh
          </span>
          <div className="flex items-center gap-1">
            {INDUSTRY_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handlePresetFill(preset)}
                disabled={loading}
                title={preset.title}
                className="btn-tactile rounded-lg border border-white/[0.12] bg-[#0A0D15]/80 px-2.5 py-1 text-[11px] font-medium text-slate-300 transition-all hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-300 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 shadow-xs"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4 px-4 py-4">
        {/* 01. Tên sản phẩm */}
        <div>
          <div className="mb-1.5 flex items-baseline justify-between gap-2">
            <label
              htmlFor="productName"
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate-200"
            >
              <span className="flex h-4 w-4 items-center justify-center rounded-md bg-emerald-500/20 border border-emerald-500/30 text-[10px] font-mono font-bold text-emerald-400">
                1
              </span>
              <span>Tên sản phẩm</span>
              <span className="text-rose-400">*</span>
            </label>
            <span className="font-mono text-[11px] tabular-nums text-slate-400">
              {countUnicodeChars(value.productName)} / 100
            </span>
          </div>

          <div className="relative">
            <input
              id="productName"
              type="text"
              value={value.productName}
              onChange={(event) => update({ productName: event.target.value })}
              onBlur={() => markTouched("productName")}
              maxLength={MAX_PRODUCT_NAME}
              placeholder="Ví dụ: Áo sơ mi lụa tơ tằm dệt tay Bảo Lộc"
              aria-invalid={Boolean(productNameError)}
              className={`${inputBaseClass} pl-9.5 ${
                productNameError ? inputErrorClass : inputNormalClass
              } ${isSamplePulsing ? "sample-pulse ring-2 ring-emerald-500/35" : ""}`}
            />
            <ShoppingBag className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
          </div>

          <div className="mt-1.5">
            <MicroBar
              value={countUnicodeChars(value.productName)}
              max={MAX_PRODUCT_NAME}
            />
          </div>

          {productNameError ? (
            <p className="mt-1.5 flex items-start gap-1 text-[12px] leading-relaxed text-rose-400">
              <AlertCircle className="mt-[1px] h-3.5 w-3.5 shrink-0" />
              <span>{productNameError}</span>
            </p>
          ) : null}
        </div>

        {/* 02. Mô tả & Chất liệu */}
        <div>
          <div className="mb-1.5 flex items-baseline justify-between gap-2">
            <label
              htmlFor="productDescription"
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate-200"
            >
              <span className="flex h-4 w-4 items-center justify-center rounded-md bg-emerald-500/20 border border-emerald-500/30 text-[10px] font-mono font-bold text-emerald-400">
                2
              </span>
              <span>Mô tả &amp; Chất liệu</span>
              <span className="text-rose-400">*</span>
            </label>
            <span className="font-mono text-[11px] tabular-nums text-slate-400">
              {countUnicodeChars(value.productDescription)} / 1.000
            </span>
          </div>

          <div className="relative">
            <textarea
              id="productDescription"
              rows={4}
              value={value.productDescription}
              onChange={(event) =>
                update({ productDescription: event.target.value })
              }
              onBlur={() => markTouched("productDescription")}
              maxLength={MAX_DESCRIPTION}
              placeholder="Chất liệu, công dụng, điểm khác biệt, quy cách đóng gói..."
              aria-invalid={Boolean(descriptionError)}
              className={`${inputBaseClass} pl-9.5 resize-y leading-relaxed ${
                descriptionError ? inputErrorClass : inputNormalClass
              } ${isSamplePulsing ? "sample-pulse ring-2 ring-emerald-500/35" : ""}`}
            />
            <AlignLeft className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
          </div>

          <div className="mt-1.5">
            <MicroBar
              value={countUnicodeChars(value.productDescription)}
              max={MAX_DESCRIPTION}
            />
          </div>

          {descriptionError ? (
            <p className="mt-1.5 flex items-start gap-1 text-[12px] leading-relaxed text-rose-400">
              <AlertCircle className="mt-[1px] h-3.5 w-3.5 shrink-0" />
              <span>{descriptionError}</span>
            </p>
          ) : null}
        </div>

        {/* 03. Khách hàng mục tiêu */}
        <div>
          <div className="mb-1.5 flex items-baseline justify-between gap-2">
            <label
              htmlFor="targetAudience"
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate-200"
            >
              <span className="flex h-4 w-4 items-center justify-center rounded-md bg-emerald-500/20 border border-emerald-500/30 text-[10px] font-mono font-bold text-emerald-400">
                3
              </span>
              <span>Khách hàng mục tiêu</span>
              <span className="text-rose-400">*</span>
            </label>
            <span className="font-mono text-[11px] tabular-nums text-slate-400">
              {countUnicodeChars(value.targetAudience)} / 200
            </span>
          </div>

          <div className="relative">
            <input
              id="targetAudience"
              type="text"
              value={value.targetAudience}
              onChange={(event) => update({ targetAudience: event.target.value })}
              onBlur={() => markTouched("targetAudience")}
              maxLength={MAX_AUDIENCE}
              placeholder="Ví dụ: Nữ chuyên viên văn phòng 28–45 tuổi"
              aria-invalid={Boolean(audienceError)}
              className={`${inputBaseClass} pl-9.5 ${
                audienceError ? inputErrorClass : inputNormalClass
              } ${isSamplePulsing ? "sample-pulse ring-2 ring-emerald-500/35" : ""}`}
            />
            <Users className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
          </div>

          <div className="mt-1.5">
            <MicroBar
              value={countUnicodeChars(value.targetAudience)}
              max={MAX_AUDIENCE}
            />
          </div>

          {audienceError ? (
            <p className="mt-1.5 flex items-start gap-1 text-[12px] leading-relaxed text-rose-400">
              <AlertCircle className="mt-[1px] h-3.5 w-3.5 shrink-0" />
              <span>{audienceError}</span>
            </p>
          ) : null}
        </div>

        {/* Tông giọng */}
        <div>
          <span className="mb-2 block text-[13px] font-semibold text-slate-200">
            Tông giọng
          </span>

          <div role="group" aria-label="Chọn tông giọng" className="space-y-1.5">
            {PRIMARY_TONES.map((option) => {
              const active = value.tone === option.value;
              const toneColors: Record<string, { activeBorder: string; activeBg: string; text: string; dot: string }> = {
                "hai-huoc": {
                  activeBorder: "border-amber-400/60",
                  activeBg: "bg-amber-500/10",
                  text: "text-amber-300",
                  dot: "bg-amber-400",
                },
                "trang-trong": {
                  activeBorder: "border-emerald-400/60",
                  activeBg: "bg-emerald-500/10",
                  text: "text-emerald-300",
                  dot: "bg-emerald-400",
                },
                "tre-trung": {
                  activeBorder: "border-sky-400/60",
                  activeBg: "bg-sky-500/10",
                  text: "text-sky-300",
                  dot: "bg-sky-400",
                },
              };
              const colors = toneColors[option.value] || {
                activeBorder: "border-emerald-400/60",
                activeBg: "bg-emerald-500/10",
                text: "text-emerald-300",
                dot: "bg-emerald-400",
              };

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => update({ tone: option.value })}
                  aria-pressed={active}
                  title={option.hint}
                  className={`btn-tactile flex w-full items-center justify-between gap-2.5 rounded-lg border px-3 py-2 text-left transition-colors ${
                    active
                      ? `${colors.activeBorder} ${colors.activeBg} ring-1 ring-emerald-500/30`
                      : "border-[#1E2333] bg-[#07090E] text-slate-300 hover:border-[#2D354B] hover:bg-[#121622]"
                  }`}
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <span className={`h-2 w-2 rounded-full shrink-0 ${active ? colors.dot : "bg-slate-600"}`} />
                    <span className="min-w-0">
                      <span
                        className={`block text-[13px] font-semibold ${
                          active ? colors.text : "text-white"
                        }`}
                      >
                        {option.label}
                      </span>
                      <span className="mt-0.5 block truncate text-[11.5px] text-slate-400">
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
            className="mt-2 inline-flex items-center gap-1 text-[12px] font-medium text-slate-400 transition-colors hover:text-white"
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
                    className={`btn-tactile flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left transition-colors ${
                      active
                        ? "border-emerald-400/60 bg-emerald-500/10 ring-1 ring-emerald-500/30 text-emerald-300"
                        : "border-[#1E2333] bg-[#07090E] text-slate-300 hover:border-[#2D354B] hover:bg-[#121622]"
                    }`}
                  >
                    <span className="min-w-0">
                      <span
                        className={`block text-[13px] font-semibold ${
                          active ? "text-emerald-300" : "text-white"
                        }`}
                      >
                        {option.label}
                      </span>
                      <span className="mt-0.5 block truncate text-[11.5px] text-slate-400">
                        {option.hint}
                      </span>
                    </span>
                    {active ? (
                      <Check className="h-4 w-4 shrink-0 text-emerald-400" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>

      <div className="sticky bottom-0 z-10 hidden border-t border-[#1E2333]/80 bg-[#0A0D15]/95 px-4 py-3 backdrop-blur-xl md:block shadow-[0_-10px_20px_rgba(0,0,0,0.4)]">
        <MagneticButton as="div" strength={0.12} className="w-full">
          <button
            type={cooldownActive ? "button" : "submit"}
            onClick={cooldownActive ? onOpenUpgrade : undefined}
            disabled={loading}
            className={`btn-tactile group relative inline-flex w-full items-center justify-between gap-3 overflow-hidden rounded-lg py-3 pl-4 pr-3 text-sm font-extrabold transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${
              cooldownActive
                ? "border border-[#1E2333] bg-[#07090E] text-slate-400 hover:border-white/20"
                : "bg-emerald-500 text-black shadow-md shadow-emerald-500/25 hover:bg-emerald-400"
            }`}
          >
            <span className="flex items-center gap-2">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-black" />
                  <span>Đang biên soạn 3 góc bài viết...</span>
                </>
              ) : cooldownActive ? (
                <>
                  <Clock className="h-4 w-4 animate-pulse text-amber-400" />
                  <span className="text-amber-300">Đang sạc AI: {cooldownSeconds}s (Mở khóa Pro)</span>
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 text-black" />
                  <span>Tạo 3 góc bài viết</span>
                </>
              )}
            </span>

            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black/15 text-black shadow-inner transition-transform duration-200 group-hover:translate-x-0.5">
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </button>
        </MagneticButton>

        <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-[11px] leading-relaxed text-slate-400">
          <span className="font-bold text-emerald-400">✓</span>
          Gói Miễn Phí: Không giới hạn bài viết · Cooldown 45s điều tiết AI
        </p>

        <p className="mt-1 text-center font-mono text-[10.5px] text-slate-400">
          Nhấn{" "}
          <kbd className="rounded border border-[#1E2333] bg-[#07090E] px-1.5 py-0.5 font-medium text-slate-300 font-mono text-[10px]">
            Ctrl
          </kbd>{" "}
          +{" "}
          <kbd className="rounded border border-[#1E2333] bg-[#07090E] px-1.5 py-0.5 font-medium text-slate-300 font-mono text-[10px]">
            Enter
          </kbd>{" "}
          để tạo nhanh
        </p>
      </div>
    </form>
  );
}

export default memo(ProductForm);