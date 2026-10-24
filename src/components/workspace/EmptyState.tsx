import { PenLine } from "lucide-react";

const STEPS = [
  {
    index: "01",
    title: "Điền thông tin",
    detail: "Tên, mô tả sản phẩm và khách hàng mục tiêu.",
  },
  {
    index: "02",
    title: "Chọn tone",
    detail: "Hài hước, trang trọng hoặc trẻ trung.",
  },
  {
    index: "03",
    title: "Bấm tạo",
    detail: "Nhận 3 góc bài viết, 3 headlines, 5 hashtags.",
  },
];

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-[#E4E4DE] bg-white px-5 py-12 text-center sm:px-6 sm:py-14">
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#F1F1ED] text-[#A1A1AA]">
        <PenLine className="h-5 w-5" />
      </div>

      <h3 className="mt-4 text-sm font-semibold tracking-tight text-[#18181B]">
        Chưa có nội dung được tạo
      </h3>
      <p className="mt-1.5 max-w-sm text-[12.5px] leading-relaxed text-[#71717A]">
        Điền thông tin sản phẩm ở cột bên trái, chọn tone phù hợp và bấm tạo — kết quả
        sẽ xuất hiện ngay tại đây.
      </p>

      <ol className="mt-6 grid w-full max-w-md gap-2 text-left sm:grid-cols-3">
        {STEPS.map((step) => (
          <li
            key={step.index}
            className="rounded-md border border-[#E4E4DE] bg-[#F8F8F6] px-3 py-2.5"
          >
            <span className="text-[10.5px] font-semibold tabular-nums text-[#A1A1AA]">
              {step.index}
            </span>
            <p className="mt-1 text-[12px] font-medium text-[#27272A]">{step.title}</p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-[#71717A]">
              {step.detail}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}