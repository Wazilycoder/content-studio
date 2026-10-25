/**
 * BẢNG GIÁ VÀ GÓI TÀI NGUYÊN DUY NHẤT (Single Source of Truth)
 * Đồng bộ hóa 100% giữa Landing Page (PricingSection) và Workspace (TopUpModal)
 */

export interface PricingPlan {
  id: string;
  name: string;
  tagline: string;
  price: number;
  formattedPrice: string;
  duration: string;
  description: string;
  badge?: string;
  highlight?: boolean;
  features: string[];
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "weekly",
    name: "Pro Tuần (7 Ngày)",
    tagline: "Trải nghiệm nhanh",
    price: 49000,
    formattedPrice: "49.000đ",
    duration: "7 ngày truy cập Turbo",
    description:
      "Phù hợp chạy chiến dịch ngắn hạn, không giới hạn số bài tạo.",
    features: [
      "0s Cooldown — Tạo tức thì không cần chờ",
      "Không giới hạn số bài viết tạo ra",
      "Đầy đủ 3 góc tiếp cận & 7 tông giọng",
      "Xuất gói TXT & Banner PNG 1200x630",
    ],
  },
  {
    id: "monthly",
    name: "Chủ Shop (Pro Tháng)",
    tagline: "Phổ biến nhất",
    price: 99000,
    formattedPrice: "99.000đ",
    duration: "30 ngày truy cập Turbo",
    description:
      "Lựa chọn tối ưu cho chủ shop kinh doanh đều đặn mỗi ngày.",
    badge: "TIẾT KIỆM 50%",
    highlight: true,
    features: [
      "0s Cooldown — Tạo tức thì liên tục",
      "Không giới hạn số lượng bài viết",
      "Băng thông AI ưu tiên cao cấp nhất",
      "Lưu trữ & ghim bài viết lịch sử không giới hạn",
    ],
  },
  {
    id: "lifetime",
    name: "Doanh Nghiệp / Trọn Đời",
    tagline: "Đầu tư 1 lần",
    price: 199000,
    formattedPrice: "199.000đ",
    duration: "Sở hữu vĩnh viễn",
    description:
      "Thanh toán 1 lần dùng mãi mãi, giải phóng hoàn toàn thời gian viết content.",
    features: [
      "Vĩnh viễn 0s Cooldown trọn đời",
      "Không giới hạn bài viết cho toàn bộ sản phẩm",
      "Ưu tiên cập nhật tính năng mới sớm nhất",
      "Hỗ trợ kỹ thuật ưu tiên 24/7",
    ],
  },
];

export const BANK_INFO = {
  bank: "MB Bank (Ngân hàng Quân Đội)",
  account: "0388888888",
  holder: "CONTENT STUDIO AI",
};
