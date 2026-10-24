/**
 * Sao chép văn bản vào clipboard với fallback cho trình duyệt cũ / non-secure context.
 * Trả về `true` nếu sao chép thành công.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (
      typeof navigator !== "undefined" &&
      typeof navigator.clipboard?.writeText === "function" &&
      (typeof window === "undefined" || window.isSecureContext)
    ) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Rơi xuống fallback bên dưới.
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "-9999px";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);
    const succeeded = document.execCommand("copy");
    document.body.removeChild(textarea);
    return succeeded;
  } catch {
    return false;
  }
}