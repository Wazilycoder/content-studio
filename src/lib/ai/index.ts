import { callGemini, type GeminiGenerateOptions } from "./gemini";
import { callOpenRouter, type OpenRouterGenerateOptions } from "./openrouter";

export interface UnifiedAiOptions {
  prompt: string;
  systemInstruction?: string;
  responseMimeType?: "application/json" | "text/plain";
  temperature?: number;
}

export async function callUnifiedAi(options: UnifiedAiOptions): Promise<string> {
  const provider = (process.env.AI_PROVIDER || "gemini").toLowerCase();

  try {
    if (
      provider === "openrouter" ||
      provider === "orcarouter" ||
      provider === "orca" ||
      provider === "custom"
    ) {
      return await callOpenRouter(options);
    }
    return await callGemini(options);
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error(String(err));
    if (error.name === "TimeoutError" || error.message.includes("aborted")) {
      throw new Error("Quá thời gian kết nối đến máy chủ AI (30 giây). Vui lòng thử lại.");
    }
    throw error;
  }
}

export { callGemini, callOpenRouter };
