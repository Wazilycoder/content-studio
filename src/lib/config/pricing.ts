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
  credits: number;
  perCredit: string;
  description: string;
  badge?: string;
  highlight?: boolean;
  features: string[];
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "starter",
    name: "Khởi Đầu",
    tagline: "Khởi động",
    price: 49000,
    formattedPrice: "49.000đ",
    credits: 50,
    perCredit: "~980đ/lượt",
    description: "Phù hợp thử nghiệm ý tưởng và nhịp đăng bài nhẹ nhàng.",
    features: [
      "50 lượt tạo bài viết AI",
      "Đầy đủ 3 góc nhìn (PAS, Cảm xúc, FAB)",
      "3 headlines + 5 hashtags chuẩn SEO",
      "Bộ đếm 125 ký tự trước nút 'Xem thêm'",
    ],
  },
  {
    id: "pro",
    name: "Chủ Shop (Pro)",
    tagline: "Phổ biến nhất",
    price: 99000,
    formattedPrice: "99.000đ",
    credits: 170,
    perCredit: "~580đ/lượt",
    description: "150 lượt + tặng 20 lượt. Lựa chọn tối ưu cho shop bán hàng đều.",
    badge: "TIẾT KIỆM 40%",
    highlight: true,
    features: [
      "170 lượt tạo (150 + tặng 20)",
      "Lưu lịch sử bài viết không giới hạn",
      "Đầy đủ 7 tông giọng chuyên sâu",
      "Thanh toán 1 lần, không tự động gia hạn",
    ],
  },
  {
    id: "agency",
    name: "Đội Ngũ / Agency",
    tagline: "Quy mô lớn",
    price: 199000,
    formattedPrice: "199.000đ",
    credits: 500,
    perCredit: "~398đ/lượt",
    description: "500 lượt tạo + băng thông ưu tiên cao nhất.",
    features: [
      "500 lượt tạo bài viết",
      "Xử lý hàng trăm sản phẩm mỗi tháng",
      "Băng thông AI ưu tiên cao nhất",
      "Hỗ trợ kỹ thuật & đối soát 24/7",
    ],
  },
];

export const BANK_INFO = {
  bank: "MB Bank (Ngân hàng Quân Đội)",
  account: "0388888888",
  holder: "CONTENT STUDIO AI",
};
