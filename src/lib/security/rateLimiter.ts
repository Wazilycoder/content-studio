import { type NextRequest } from "next/server";

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// In-memory sliding window store
const rateLimitStore = new Map<string, RateLimitRecord>();

// Định kỳ dọn dẹp bộ nhớ mỗi 60 giây để tránh memory leak
let lastCleanup = Date.now();
function cleanupExpired() {
  const now = Date.now();
  if (now - lastCleanup > 60000) {
    lastCleanup = now;
    for (const [key, record] of rateLimitStore.entries()) {
      if (now > record.resetAt) {
        rateLimitStore.delete(key);
      }
    }
  }
}

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export const RATE_LIMIT_TIERS: Record<"auth" | "api" | "global", RateLimitConfig> = {
  // Chống brute-force đăng nhập / đăng ký / đổi mật khẩu
  auth: {
    maxRequests: 15,
    windowMs: 60 * 1000, // 15 lượt / 1 phút
  },
  // Chống spam API & cào dữ liệu
  api: {
    maxRequests: 30,
    windowMs: 60 * 1000, // 30 lượt / 1 phút
  },
  // Giới hạn chung toàn trang
  global: {
    maxRequests: 150,
    windowMs: 60 * 1000, // 150 lượt / 1 phút
  },
};

/**
 * Trích xuất địa chỉ IP client an toàn từ headers proxy
 */
export function getClientIp(request: NextRequest): string {
  const xForwardedFor = request.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    const firstIp = xForwardedFor.split(",")[0]?.trim();
    if (firstIp) return firstIp;
  }

  const xRealIp = request.headers.get("x-real-ip");
  if (xRealIp) return xRealIp.trim();

  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  if (cfConnectingIp) return cfConnectingIp.trim();

  return "127.0.0.1";
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfter: number; // giây
}

/**
 * Kiểm tra giới hạn tần suất theo IP và loại route
 */
export function checkRateLimit(
  request: NextRequest,
  tier: "auth" | "api" | "global" = "global"
): RateLimitResult {
  cleanupExpired();

  const ip = getClientIp(request);
  const key = `${tier}:${ip}`;
  const config = RATE_LIMIT_TIERS[tier];
  const now = Date.now();

  const current = rateLimitStore.get(key);

  if (!current || now > current.resetAt) {
    const resetAt = now + config.windowMs;
    rateLimitStore.set(key, { count: 1, resetAt });
    return {
      allowed: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - 1,
      resetAt,
      retryAfter: 0,
    };
  }

  if (current.count >= config.maxRequests) {
    const retryAfter = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
    return {
      allowed: false,
      limit: config.maxRequests,
      remaining: 0,
      resetAt: current.resetAt,
      retryAfter,
    };
  }

  current.count += 1;
  return {
    allowed: true,
    limit: config.maxRequests,
    remaining: config.maxRequests - current.count,
    resetAt: current.resetAt,
    retryAfter: 0,
  };
}
