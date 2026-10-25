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
  qrImage: string;
  transferCode: string;
  tierBadge: string;
  tierFullTitle: string;
  statusDescription: string;
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
    tierBadge: "Pro Tuần",
    tierFullTitle: "Gói Pro Tuần (7 Ngày)",
    statusDescription: "Tài khoản Pro Tuần (7 Ngày) · Không giới hạn bài viết & 0s Chờ đợi",
    features: [
      "0s Cooldown — Tạo tức thì không cần chờ",
      "Không giới hạn số bài viết tạo ra",
      "Đầy đủ 3 góc tiếp cận & 7 tông giọng",
      "Xuất gói TXT & Banner PNG 1200x630",
    ],
    qrImage: "/images/qr-49k.png",
    transferCode: "GOI49K",
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
    tierBadge: "Chủ Shop Turbo",
    tierFullTitle: "Gói Chủ Shop Turbo (30 Ngày)",
    statusDescription: "Tài khoản Chủ Shop Turbo (30 Ngày) · Băng thông ưu tiên & 0s Chờ đợi",
    features: [
      "0s Cooldown — Tạo tức thì liên tục",
      "Không giới hạn số lượng bài viết",
      "Băng thông AI ưu tiên cao cấp nhất",
      "Lưu trữ & ghim bài viết lịch sử không giới hạn",
    ],
    qrImage: "/images/qr-99k.png",
    transferCode: "GOI99K",
  },
  {
    id: "yearly",
    name: "Doanh Nghiệp (1 Năm)",
    tagline: "Tiết kiệm nhất",
    price: 499000,
    formattedPrice: "499.000đ",
    duration: "1 năm (365 ngày) truy cập Turbo",
    description:
      "Giải pháp toàn diện 365 ngày, tối ưu chi phí cho cá nhân & doanh nghiệp.",
    badge: "VIP DOANH NGHIỆP",
    tierBadge: "Doanh Nghiệp VIP",
    tierFullTitle: "Gói Doanh Nghiệp VIP (1 Năm)",
    statusDescription: "Tài khoản Doanh Nghiệp VIP (1 Năm) · Đặc quyền tối cao & 0s Chờ đợi",
    features: [
      "0s Cooldown — Tạo tức thì liên tục 365 ngày",
      "Không giới hạn bài viết cho toàn bộ sản phẩm",
      "Băng thông AI ưu tiên cao cấp nhất",
      "Hỗ trợ kỹ thuật ưu tiên 24/7",
    ],
    qrImage: "/images/qr-499k.png",
    transferCode: "GOI499K",
  },
];

export function getPlanById(id?: string | null): PricingPlan {
  return PRICING_PLANS.find((pkg) => pkg.id === id) ?? PRICING_PLANS[1];
}

export const BANK_INFO = {
  bank: "MB Bank (Ngân hàng Quân Đội)",
  account: "7909082011",
  holder: "DUONG HUYNH TRONG NGHIA",
};
