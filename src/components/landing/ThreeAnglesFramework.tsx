import { Target, Heart, BadgeCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface AngleItem {
  index: string;
  tag: string;
  title: string;
  description: string;
  Icon: LucideIcon;
}

const ANGLES: AngleItem[] = [
  {
    index: "Góc 1",
    tag: "PAS",
    title: "Vấn đề & Giải pháp",
    description:
      "Đánh trúng phiền toái, sai lầm hay thói quen cũ mà khách hàng đang chịu đựng, đưa sản phẩm vào như lời giải tối ưu.",
    Icon: Target,
  },
  {
    index: "Góc 2",
    tag: "Cảm xúc",
    title: "Cảm xúc & Phong cách sống",
    description:
      "Bán hình ảnh người mua muốn thấy ở chính mình: sự tự tin, thư thái và chuẩn mực sống cao cấp.",
    Icon: Heart,
  },
  {
    index: "Góc 3",
    tag: "FAB",
    title: "Trực diện tính năng & Giá trị",
    description:
      "Phân tích chất liệu, độ bền, thông số và nguồn gốc; chứng minh sản phẩm xứng đáng từng đồng chi ra.",
    Icon: BadgeCheck,
  },
];

export default function ThreeAnglesFramework() {
  return (
    <section
      id="framework"
      className="scroll-mt-20 bg-[#F8F8F6] py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full border border-[#E4E4DE] bg-[#F1F1ED] px-3 py-1 text-[11px] font-medium text-[#52525B]">
            Phương pháp luận
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#18181B] sm:text-4xl">
            Tại sao lại là 3 góc tiếp cận?
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[#71717A] sm:text-base">
            Chạy quảng cáo hoặc đăng 1 nội dung lặp đi lặp lại khiến khách hàng bị
            chai lì (Ad Fatigue). Content Studio tự động phân hóa thành 3 góc nhìn
            bổ trợ nhau hoàn hảo:
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {ANGLES.map(({ index, tag, title, description, Icon }) => (
            <div
              key={index}
              className="flex flex-col rounded-2xl border border-[#E4E4DE] bg-white p-6 transition-colors hover:border-[#3B49DF]/40"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1F1ED] text-[#3B49DF]">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="rounded-md bg-[#F1F1ED] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#71717A]">
                  {tag}
                </span>
              </div>
              <span className="mt-5 text-[11px] font-semibold uppercase tracking-wider text-[#3B49DF]">
                {index}
              </span>
              <h3 className="mt-1 text-lg font-semibold tracking-tight text-[#18181B]">
                {title}
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-[#71717A]">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}