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

  // Ưu tiên 1: OpenRouter hoặc Custom Gateway
  if (provider === "openrouter" || provider === "custom") {
    try {
      return await callOpenRouter(options);
    } catch (err: unknown) {
      console.warn("[AI Provider] OpenRouter thất bại, thử fallback sang Gemini nếu có key:", err);
      if (process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY) {
        return await callGemini(options);
      }
      throw err;
    }
  }

  // Ưu tiên 2: Google Gemini Cloud
  try {
    return await callGemini(options);
  } catch (err: unknown) {
    console.warn("[AI Provider] Gemini thất bại, thử fallback sang OpenRouter nếu có key:", err);
    if (process.env.OPENROUTER_API_KEY || process.env.CUSTOM_AI_API_KEY) {
      return await callOpenRouter(options);
    }
    throw err;
  }
}

export { callGemini, callOpenRouter };
