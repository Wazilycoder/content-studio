/**
 * Module kết nối OpenRouter / OrcaRouter / OpenAI-compatible API
 * Hỗ trợ DeepSeek-V3, Claude 3.5 Sonnet, GPT-4o, Llama 3.3
 */

export interface OpenRouterGenerateOptions {
  prompt: string;
  systemInstruction?: string;
  responseMimeType?: "application/json" | "text/plain";
  temperature?: number;
}

export async function callOpenRouter(options: OpenRouterGenerateOptions): Promise<string> {
  const provider = (process.env.AI_PROVIDER || "").toLowerCase();
  const isOrca = provider === "orcarouter" || provider === "orca";

  const apiKey =
    process.env.ORCAROUTER_API_KEY ||
    process.env.ORCA_API_KEY ||
    process.env.CUSTOM_AI_API_KEY ||
    process.env.OPENROUTER_API_KEY ||
    "";

  if (!apiKey) {
    const keyHint = isOrca
      ? "ORCAROUTER_API_KEY"
      : "ORCAROUTER_API_KEY hoặc OPENROUTER_API_KEY";
    throw new Error(
      `Chưa cấu hình ${keyHint} trong file .env.local. Vui lòng thêm API key để tiếp tục.`
    );
  }

  const defaultBaseUrl = isOrca
    ? "https://api.orcarouter.ai/v1"
    : "https://openrouter.ai/api/v1";

  const baseUrl =
    process.env.ORCAROUTER_BASE_URL ||
    process.env.ORCA_BASE_URL ||
    process.env.CUSTOM_AI_BASE_URL ||
    process.env.OPENROUTER_BASE_URL ||
    defaultBaseUrl;

  const primaryModel =
    process.env.ORCAROUTER_MODEL ||
    process.env.ORCA_MODEL ||
    process.env.CUSTOM_AI_MODEL ||
    process.env.OPENROUTER_MODEL ||
    "deepseek/deepseek-v4.1-flash-free";

  // Đọc danh sách model dự phòng từ biến môi trường (phân tách bởi dấu phẩy)
  const envFallbackModels = process.env.ORCAROUTER_FALLBACK_MODELS
    ? process.env.ORCAROUTER_FALLBACK_MODELS.split(",")
        .map((m) => m.trim())
        .filter(Boolean)
    : [
        "deepseek/deepseek-v4.1-flash-free",
        "deepseek/deepseek-v4-flash-free",
        "orcarouter/free",
        "z-ai/glm-5.3-flash-free",
        "tencent/hy4-preview-free",
      ];

  // Danh sách các model Free chất lượng cao của OrcaRouter để tự động fallback khi cao điểm
  const candidateModels: string[] = isOrca
    ? Array.from(new Set([primaryModel, ...envFallbackModels]))
    : [primaryModel];

  const endpoint = baseUrl.endsWith("/chat/completions")
    ? baseUrl
    : `${baseUrl.replace(/\/$/, "")}/chat/completions`;

  const messages: Array<{ role: "system" | "user"; content: string }> = [];

  if (options.systemInstruction) {
    messages.push({
      role: "system",
      content: options.systemInstruction,
    });
  }

  messages.push({
    role: "user",
    content: options.prompt,
  });

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "Content Studio",
  };

  let lastError: Error | null = null;

  // Lặp qua danh sách model fallback để đảm bảo tỷ lệ phản hồi 99.9%
  for (let i = 0; i < candidateModels.length; i++) {
    const currentModel = candidateModels[i];
    const body: Record<string, unknown> = {
      model: currentModel,
      messages,
      temperature: options.temperature ?? 0.7,
    };

    if (options.responseMimeType === "application/json") {
      body.response_format = { type: "json_object" };
    }

    try {
      let response = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(35000),
      });

      // Tự động fallback nếu model không hỗ trợ response_format { type: "json_object" }
      if (!response.ok && body.response_format) {
        const errorData = await response.clone().json().catch(() => ({}));
        const errText = String(errorData?.error?.message || errorData?.message || "");
        if (
          response.status === 400 &&
          (errText.toLowerCase().includes("response_format") ||
            errText.toLowerCase().includes("json_object") ||
            errText.toLowerCase().includes("not supported"))
        ) {
          delete body.response_format;
          response = await fetch(endpoint, {
            method: "POST",
            headers,
            body: JSON.stringify(body),
            signal: AbortSignal.timeout(35000),
          });
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData?.error?.message ||
          errorData?.message ||
          `HTTP ${response.status} ${response.statusText}`;

        // Nếu gặp lỗi rate limit / quota / server error và còn model fallback, tiếp tục thử
        if (
          i < candidateModels.length - 1 &&
          (response.status === 429 ||
            response.status === 500 ||
            response.status === 502 ||
            response.status === 503 ||
            response.status === 504 ||
            response.status === 402)
        ) {
          console.warn(
            `[OrcaRouter Fallback] Model ${currentModel} gặp sự cố (${response.status}: ${errorMessage}). Đang tự động chuyển sang model: ${candidateModels[i + 1]}`
          );
          lastError = new Error(`Model ${currentModel}: ${errorMessage}`);
          continue;
        }

        throw new Error(`Lỗi Router API (${currentModel}): ${errorMessage}`);
      }

      const data = await response.json();
      const text = data?.choices?.[0]?.message?.content;

      if (!text) {
        throw new Error(`Model ${currentModel} không trả về nội dung (Empty Content).`);
      }

      return text;
    } catch (err: unknown) {
      const e = err instanceof Error ? err : new Error(String(err));
      lastError = e;
      if (i < candidateModels.length - 1) {
        console.warn(
          `[OrcaRouter Fallback] Thử model ${currentModel} thất bại: ${e.message}. Đang thử model kế tiếp: ${candidateModels[i + 1]}`
        );
        continue;
      }
    }
  }

  throw (
    lastError ||
    new Error(`Tất cả các model OrcaRouter (${candidateModels.join(", ")}) đều không khả dụng.`)
  );
}
