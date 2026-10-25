/**
 * Chuẩn hoá chuỗi tiếng Việt thành phần tên file an toàn (bỏ dấu, chỉ giữ a-z0-9_).
 * Dùng cho việc xuất file .txt và .png hoàn toàn phía client.
 */
export function toSafeFileName(value: string, fallback = "content_studio"): string {
  const normalized = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, (match) => (match === "đ" ? "d" : "D"))
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();

  return normalized.length > 0 ? normalized : fallback;
}