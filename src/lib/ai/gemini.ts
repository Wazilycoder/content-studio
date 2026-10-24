/**
 * Module kết nối Google Gemini AI Cloud
 * Hỗ trợ Pool nhiều API Key (dạng mới AQ... hoặc AIza...), tự động fallback khi gặp Rate Limit (429)
 * Endpoint: https://generativelanguage.googleapis.com/v1beta
 */

function getApiKeys(): string[] {
  const raw = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || "";
  return raw
    .split(",")
    .map((k) => k.trim())
    .filter((k) => k.length > 0);
}

export interface GeminiGenerateOptions {
  prompt: string;
  systemInstruction?: string;
  responseMimeType?: "application/json" | "text/plain";
  temperature?: number;
}

export async function callGemini(options: GeminiGenerateOptions) {
  const keys = getApiKeys();
  if (keys.length === 0) {
    throw new Error(
      "Chưa cấu hình GEMINI_API_KEYS trong file .env.local. Vui lòng thêm ít nhất 1 API key."
    );
  }

  const endpoint =
    process.env.GEMINI_API_ENDPOINT ||
    "https://generativelanguage.googleapis.com/v1beta";
  // KHÓA MODEL: Khóa mặc định gemini-3.5-flash (đã xác minh thực tế Status 200)
  const model = process.env.GEMINI_MODEL || "gemini-3.5-flash";

  let lastError: Error | null = null;

  // Lặp qua danh sách keys (Pool rotation & fallback)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const url = `${endpoint}/models/${model}:generateContent?key=${key}`;

    const body: Record<string, unknown> = {
      contents: [
        {
          role: "user",
          parts: [{ text: options.prompt }],
        },
      ],
      generationConfig: {
        temperature: options.temperature ?? 0.7,
        responseMimeType: options.responseMimeType || "text/plain",
        maxOutputTokens: 1500, // Tối ưu Free-Tier: Chặn runaway token
      },
    };

    if (options.systemInstruction) {
      body.systemInstruction = {
        parts: [{ text: options.systemInstruction }],
      };
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(15000),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData?.error?.message || `HTTP ${response.status} ${response.statusText}`;

        // Nếu chạm Rate Limit (429) hoặc Quota Limit và còn key dự phòng -> Thử key tiếp theo
        if ((response.status === 429 || response.status === 403) && i < keys.length - 1) {
          console.warn(`[Gemini Pool] Key #${i + 1} bị rate limit (${response.status}). Đang chuyển sang key #${i + 2}...`);
          continue;
        }

        throw new Error(`Lỗi Gemini API: ${errorMessage}`);
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        throw new Error("Gemini không trả về nội dung (Empty Candidate).");
      }

      return text;
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      lastError = error;

      // Nếu còn key khác trong pool thì tiếp tục thử
      if (i < keys.length - 1) {
        console.warn(`[Gemini Pool] Thử key #${i + 2} do lỗi: ${error.message}`);
        continue;
      }
    }
  }

  throw lastError || new Error("Không thể gọi Gemini API qua tất cả các keys đã cấu hình.");
}
