import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { checkRateLimit } from "@/lib/security/rateLimiter";

// Tập hợp các security headers chuẩn OWASP
function applySecurityHeaders(response: NextResponse) {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()"
  );
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';"
  );
  return response;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Phân tầng Rate Limit theo mức độ nhạy cảm của endpoint
  let tier: "auth" | "api" | "global" = "global";
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/auth")
  ) {
    tier = "auth";
  } else if (pathname.startsWith("/api")) {
    tier = "api";
  }

  // 2. Kiểm tra Rate Limit theo IP thực tế
  const rateLimit = checkRateLimit(request, tier);

  if (!rateLimit.allowed) {
    const isApi =
      pathname.startsWith("/api") ||
      request.headers.get("accept")?.includes("application/json");

    if (isApi) {
      const errorResponse = NextResponse.json(
        {
          error: `Hệ thống phát hiện tần suất yêu cầu bất thường từ IP của bạn. Vui lòng thử lại sau ${rateLimit.retryAfter} giây.`,
          status: 429,
          retryAfter: rateLimit.retryAfter,
        },
        { status: 429 }
      );
      errorResponse.headers.set("Retry-After", String(rateLimit.retryAfter));
      errorResponse.headers.set("X-RateLimit-Limit", String(rateLimit.limit));
      errorResponse.headers.set("X-RateLimit-Remaining", "0");
      errorResponse.headers.set("X-RateLimit-Reset", String(rateLimit.resetAt));
      return applySecurityHeaders(errorResponse);
    }

    // Với giao diện người dùng: Trả về trang 429 thân thiện
    const htmlResponse = new NextResponse(
      `<!DOCTYPE html>
      <html lang="vi">
        <head>
          <meta charset="utf-8">
          <title>429 — Thao tác quá nhanh</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #09090B; color: #FAFAFA; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
            .card { max-width: 420px; padding: 32px; border: 1px solid #27272A; border-radius: 16px; background: #121215; }
            h1 { font-size: 20px; margin-bottom: 8px; }
            p { font-size: 14px; color: #A1A1AA; line-height: 1.5; }
            .btn { display: inline-block; margin-top: 20px; padding: 10px 20px; background: #4F5DFF; color: white; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>🛡️ 429 · Thao tác quá nhanh</h1>
            <p>Hệ thống tạm thời giới hạn tần suất yêu cầu để bảo vệ hạ tầng khỏi tấn công. Vui lòng chờ <strong>${rateLimit.retryAfter} giây</strong> rồi tải lại trang.</p>
            <a href="/" class="btn">Quay lại Trang chủ</a>
          </div>
        </body>
      </html>`,
      {
        status: 429,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      }
    );
    htmlResponse.headers.set("Retry-After", String(rateLimit.retryAfter));
    return applySecurityHeaders(htmlResponse);
  }

  // 3. Chạy tiếp tục Supabase Auth Session Middleware
  const sessionResponse = await updateSession(request);

  // 4. Đính kèm Rate Limit telemetry headers & Security Headers
  sessionResponse.headers.set("X-RateLimit-Limit", String(rateLimit.limit));
  sessionResponse.headers.set(
    "X-RateLimit-Remaining",
    String(rateLimit.remaining)
  );
  sessionResponse.headers.set("X-RateLimit-Reset", String(rateLimit.resetAt));

  return applySecurityHeaders(sessionResponse);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
