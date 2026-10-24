"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { AlertCircle, FlaskConical, Loader2, Sparkles } from "lucide-react";
import { countUnicodeChars } from "@/lib/utils/charCounter";
import type { ContentFormInput, ToneOption } from "@/types/content";

const MAX_PRODUCT_NAME = 100;
const MAX_DESCRIPTION = 1000;
const MAX_AUDIENCE = 200;

const TONE_OPTIONS: {
  value: ToneOption;
  label: string;
  hint: string;
  icon: string;
}[] = [
  {
    value: "hai-huoc",
    label: "Hài hước & Viral",
    hint: "Dí dỏm, chơi chữ tự nhiên, thân thiện",
    icon: "😄",
  },
  {
    value: "trang-trong",
    label: "Sang trọng & Cao cấp",
    hint: "Thanh lịch, chuẩn mực, tôn vinh giá trị",
    icon: "✨",
  },
  {
    value: "tre-trung",
    label: "Trẻ trung & Bắt trend",
    hint: "Năng động, hiện đại, phóng khoáng",
    icon: "⚡",
  },
  {
    value: "dong-cam",
    label: "Đồng cảm & Chữa lành",
    hint: "Thủ thỉ, sâu lắng, chạm cảm xúc",
    icon: "🌿",
  },
  {
    value: "chuyen-gia",
    label: "Chuyên gia & Logic",
    hint: "Dẫn chứng thực tế, lập luận chặt chẽ",
    icon: "🎯",
  },
  {
    value: "ke-chuyen",
    label: "Storytelling",
    hint: "Kể chuyện di sản, cảm hứng làng nghề",
    icon: "📖",
  },
  {
    value: "kich-thich",
    label: "Kích thích mua & FOMO",
    hint: "Khẩn trương, ưu đãi giới hạn, kêu gọi mua",
    icon: "🔥",
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
  "w-full rounded-md border bg-white px-3 py-2 text-[13px] text-[#18181B] placeholder:text-[#A1A1AA] transition-colors focus:outline-none focus:ring-2";
const inputNormalClass =
  "border-[#E4E4DE] focus:border-[#3B49DF] focus:ring-[#3B49DF]/15";
const inputErrorClass =
  "border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]/15";

export default function ProductForm({
  value,
  onChange,
  onSubmit,
  onLoadSample,
  loading,
}: ProductFormProps) {
  const [touched, setTouched] = useState<Record<FieldName, boolean>>({
    productName: false,
    productDescription: false,
    targetAudience: false,
  });
  const [submitted, setSubmitted] = useState(false);

  const errors = useMemo(() => validate(value), [value]);

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
      onSubmit={handleSubmit}
      noValidate
      className="overflow-hidden rounded-lg border border-[#E4E4DE] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
    >
      <div className="flex items-start justify-between gap-3 border-b border-[#E4E4DE] px-5 pb-4 pt-5">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold tracking-tight text-[#18181B]">
            Thông tin sản phẩm
          </h2>
          <p className="mt-1 text-[11.5px] leading-relaxed text-[#71717A]">
            Càng chi tiết, nội dung tạo ra càng sát ý bạn.
          </p>
        </div>

        <button
          type="button"
          onClick={onLoadSample}
          disabled={loading}
          title="Điền nhanh một bộ dữ liệu mẫu để thử nghiệm"
          className="inline-flex shrink-0 items-center gap-1 rounded-md border border-[#E4E4DE] bg-[#F8F8F6] px-2 py-1 text-[11px] font-medium text-[#71717A] transition-colors hover:border-[#D4D4D8] hover:text-[#18181B] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FlaskConical className="h-3 w-3" />
          Nạp dữ liệu mẫu
        </button>
      </div>

      <div className="space-y-4 px-5 py-4">
        {/* Tên sản phẩm */}
        <div>
          <div className="mb-1.5 flex items-baseline justify-between gap-2">
            <label
              htmlFor="productName"
              className="text-xs font-medium text-[#27272A]"
            >
              Tên sản phẩm <span className="text-[#DC2626]">*</span>
            </label>
            <span className="text-[10.5px] tabular-nums text-[#A1A1AA]">
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
            className={`${inputBaseClass} ${productNameError ? inputErrorClass : inputNormalClass}`}
          />

          {productNameError ? (
            <p className="mt-1.5 flex items-start gap-1 text-[11px] leading-relaxed text-[#DC2626]">
              <AlertCircle className="mt-[1px] h-3 w-3 shrink-0" />
              <span>{productNameError}</span>
            </p>
          ) : null}
        </div>

        {/* Mô tả sản phẩm */}
        <div>
          <label
            htmlFor="productDescription"
            className="mb-1.5 block text-xs font-medium text-[#27272A]"
          >
            Mô tả sản phẩm <span className="text-[#DC2626]">*</span>
          </label>

          <div className="relative">
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
              className={`${inputBaseClass} resize-y pb-7 leading-relaxed ${
                descriptionError ? inputErrorClass : inputNormalClass
              }`}
            />
            <span className="pointer-events-none absolute bottom-2 right-3 text-[10.5px] tabular-nums text-[#A1A1AA]">
              {countUnicodeChars(value.productDescription)} / 1.000 ký tự
            </span>
          </div>

          {descriptionError ? (
            <p className="mt-1.5 flex items-start gap-1 text-[11px] leading-relaxed text-[#DC2626]">
              <AlertCircle className="mt-[1px] h-3 w-3 shrink-0" />
              <span>{descriptionError}</span>
            </p>
          ) : null}
        </div>

        {/* Khách hàng mục tiêu */}
        <div>
          <div className="mb-1.5 flex items-baseline justify-between gap-2">
            <label
              htmlFor="targetAudience"
              className="text-xs font-medium text-[#27272A]"
            >
              Khách hàng mục tiêu <span className="text-[#DC2626]">*</span>
            </label>
            <span className="text-[10.5px] tabular-nums text-[#A1A1AA]">
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
            className={`${inputBaseClass} ${audienceError ? inputErrorClass : inputNormalClass}`}
          />

          {audienceError ? (
            <p className="mt-1.5 flex items-start gap-1 text-[11px] leading-relaxed text-[#DC2626]">
              <AlertCircle className="mt-[1px] h-3 w-3 shrink-0" />
              <span>{audienceError}</span>
            </p>
          ) : null}
        </div>

        {/* Tone of voice */}
        <div>
          <span className="mb-1.5 block text-xs font-medium text-[#27272A]">
            Tone of voice
          </span>

          <div
            role="group"
            aria-label="Chọn tone of voice"
            className="grid grid-cols-2 gap-1.5"
          >
            {TONE_OPTIONS.map((option) => {
              const active = value.tone === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => update({ tone: option.value })}
                  aria-pressed={active}
                  title={option.hint}
                  className={`rounded-lg border p-2 text-left transition-colors ${
                    active
                      ? "border-[#3B49DF] bg-[#3B49DF]/[0.06] ring-1 ring-[#3B49DF]/20"
                      : "border-[#E4E4DE] bg-white hover:border-[#D4D4D8] hover:bg-[#F8F8F6]"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs leading-none">{option.icon}</span>
                    <span
                      className={`block truncate text-[11px] font-semibold ${
                        active ? "text-[#3B49DF]" : "text-[#18181B]"
                      }`}
                    >
                      {option.label}
                    </span>
                  </div>
                  <span className="mt-1 line-clamp-1 block text-[9.5px] leading-tight text-[#71717A]">
                    {option.hint}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="px-5 pb-5">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#3B49DF] px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#2F3CBF] focus:outline-none focus:ring-2 focus:ring-[#3B49DF]/30 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Đang biên soạn bài viết...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>Tạo 3 góc bài viết</span>
            </>
          )}
        </button>

        <p className="mt-2 text-center text-[10.5px] text-[#A1A1AA]">
          3 góc nhìn · 3 headlines · 5 hashtags
        </p>
      </div>
    </form>
  );
}