export interface FacebookStatus {
  status: "optimal" | "recommended_exceeded";
  message: string;
}

export interface InstagramStatus {
  status: "optimal" | "limit_exceeded";
  message: string;
}

export const FACEBOOK_RECOMMENDED_LIMIT = 125;
export const INSTAGRAM_MAX_LIMIT = 2200;

/**
 * Đếm ký tự theo đơn vị Unicode code point.
 * `Array.from` xử lý đúng tiếng Việt có dấu tổ hợp và emoji (surrogate pairs).
 */
export function countUnicodeChars(text: string): number {
  return Array.from(text).length;
}

function formatNumber(value: number): string {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function getFacebookStatus(count: number): FacebookStatus {
  if (count <= FACEBOOK_RECOMMENDED_LIMIT) {
    return {
      status: "optimal",
      message: 'Độ dài tối ưu trước nút "Xem thêm"',
    };
  }

  return {
    status: "recommended_exceeded",
    message:
      "Vượt khuyến nghị 125 ký tự (vẫn đăng bài bình thường, không chặn sao chép)",
  };
}

export function getInstagramStatus(
  count: number,
  maxLimit: number = INSTAGRAM_MAX_LIMIT,
): InstagramStatus {
  if (count <= maxLimit) {
    return {
      status: "optimal",
      message: `Trong giới hạn ${formatNumber(maxLimit)} ký tự của Instagram`,
    };
  }

  return {
    status: "limit_exceeded",
    message: `Vượt quá giới hạn ${formatNumber(maxLimit)} ký tự của Instagram`,
  };
}