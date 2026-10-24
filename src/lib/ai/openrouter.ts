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
  const apiKey =
    process.env.OPENROUTER_API_KEY || process.env.CUSTOM_AI_API_KEY || "";

  if (!apiKey) {
    throw new Error(
      "Chưa cấu hình OPENROUTER_API_KEY hoặc CUSTOM_AI_API_KEY trong file .env.local."
    );
  }

  const baseUrl =
    process.env.OPENROUTER_BASE_URL ||
    process.env.CUSTOM_AI_BASE_URL ||
    "https://openrouter.ai/api/v1";

  const model =
    process.env.OPENROUTER_MODEL ||
    process.env.CUSTOM_AI_MODEL ||
    "deepseek/deepseek-chat";

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

  const body: Record<string, unknown> = {
    model,
    messages,
    temperature: options.temperature ?? 0.7,
  };

  if (options.responseMimeType === "application/json") {
    body.response_format = { type: "json_object" };
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "Content Studio",
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage =
      errorData?.error?.message ||
      errorData?.message ||
      `HTTP ${response.status} ${response.statusText}`;
    throw new Error(`Lỗi Router API (${model}): ${errorMessage}`);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;

  if (!text) {
    throw new Error(`Model ${model} không trả về nội dung (Empty Content).`);
  }

  return text;
}
