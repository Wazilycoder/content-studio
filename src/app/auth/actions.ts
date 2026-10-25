"use server";

import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const COOKIE_DEV_SESSION = "cs_dev_session";

// Khoá ký HMAC cho Math Captcha. Ưu tiên biến môi trường server-side.
// Fallback chỉ dùng khi chạy local chưa cấu hình gì (dev-only).
const CAPTCHA_SECRET =
  process.env.CAPTCHA_SECRET ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "content-studio-local-captcha-signing-key";

interface DevSession {
  id: string;
  email: string;
  credits: number;
  planId?: string;
}

interface AuthResult {
  error?: string;
  success?: boolean;
  message?: string;
}

function isLocalDev(): boolean {
  if (process.env.NODE_ENV === "production") return false;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return (
    process.env.NODE_ENV === "development" ||
    !url ||
    url.includes("your-project")
  );
}

function isDemoEmail(email: string): boolean {
  if (process.env.NODE_ENV === "production") return false;
  const lower = email.toLowerCase();
  return (
    lower.includes("demo") ||
    lower.includes("chushop") ||
    lower.endsWith("@local.dev")
  );
}

function signDevSession(session: DevSession): string {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  const sig = createHmac("sha256", CAPTCHA_SECRET).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

function verifyDevSession(cookieValue: string): DevSession | null {
  if (!cookieValue || process.env.NODE_ENV === "production") return null;
  const parts = cookieValue.split(".");
  if (parts.length !== 2) return null;
  const [payload, sig] = parts;
  if (!payload || !sig) return null;

  const expectedSig = createHmac("sha256", CAPTCHA_SECRET).update(payload).digest("hex");
  const expectedBuf = Buffer.from(expectedSig, "hex");
  const providedBuf = Buffer.from(sig, "hex");
  if (expectedBuf.length !== providedBuf.length || !timingSafeEqual(expectedBuf, providedBuf)) {
    return null;
  }

  try {
    const raw = Buffer.from(payload, "base64url").toString("utf-8");
    const parsed = JSON.parse(raw) as Partial<DevSession>;
    if (parsed && typeof parsed.email === "string") {
      return {
        id: parsed.id ?? "local-dev-user",
        email: parsed.email,
        credits: typeof parsed.credits === "number" ? parsed.credits : 10,
        planId: typeof parsed.planId === "string" ? parsed.planId : "monthly",
      };
    }
  } catch {
    return null;
  }
  return null;
}

async function setDevSession(email: string, planId: string = "monthly"): Promise<void> {
  if (process.env.NODE_ENV === "production") return;
  const cookieStore = await cookies();
  const session: DevSession = {
    id: "local-dev-user",
    email,
    credits: 10,
    planId,
  };
  cookieStore.set(COOKIE_DEV_SESSION, signDevSession(session), {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

async function clearDevSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_DEV_SESSION, "", {
    httpOnly: true,
    secure: (process.env.NODE_ENV as string) === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

// Sinh phép tính + token HMAC. Đáp án KHÔNG bao giờ lộ ra client.
function generateMathCaptcha(): { question: string; token: string } {
  const num1 = Math.floor(Math.random() * 20) + 1; // 1..20
  const num2 = Math.floor(Math.random() * 10) + 1; // 1..10
  const op = Math.random() < 0.5 ? "+" : "-";
  const answer = op === "+" ? num1 + num2 : num1 - num2;
  const timestamp = Date.now();
  const signature = createHmac("sha256", CAPTCHA_SECRET)
    .update(`${answer}:${timestamp}`)
    .digest("hex");
  return {
    question: `${num1} ${op} ${num2} = ?`,
    token: `${timestamp}.${signature}`,
  };
}

function verifyMathCaptcha(userAnswer: string, token: string): boolean {
  if (!userAnswer || !token) return false;
  const [timestampRaw, signature] = token.split(".");
  const timestamp = Number(timestampRaw);
  if (!Number.isFinite(timestamp) || !signature) return false;

  // Token hết hạn sau 5 phút
  if (Date.now() - timestamp > 5 * 60 * 1000) return false;

  const expected = createHmac("sha256", CAPTCHA_SECRET)
    .update(`${userAnswer.trim()}:${timestamp}`)
    .digest("hex");

  const expectedBuf = Buffer.from(expected, "hex");
  const providedBuf = Buffer.from(signature, "hex");
  if (expectedBuf.length !== providedBuf.length) return false;
  return timingSafeEqual(expectedBuf, providedBuf);
}

export async function getMathCaptcha(): Promise<{ question: string; token: string }> {
  return generateMathCaptcha();
}

export async function login(formData: FormData): Promise<AuthResult> {
  const email = (formData.get("email") as string) || "";
  const password = (formData.get("password") as string) || "";
  const captchaAnswer = (formData.get("captchaAnswer") as string) || "";
  const captchaToken = (formData.get("captchaToken") as string) || "";

  if (!email || !password) {
    return { error: "Vui lòng nhập đầy đủ email và mật khẩu." };
  }

  if (!verifyMathCaptcha(captchaAnswer, captchaToken)) {
    return { error: "Kết quả phép tính bảo mật không đúng." };
  }

  let authFailed = false;
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) authFailed = true;
  } catch {
    // Lỗi mạng / project paused / chưa cấu hình Supabase
    authFailed = true;
  }

  if (authFailed) {
    // Local fallback: cấp session dev để vào Dashboard với 10 lượt tạo
    if (isLocalDev() || isDemoEmail(email)) {
      await setDevSession(email);
      revalidatePath("/", "layout");
      redirect("/workspace");
    }
    return { error: "Email hoặc mật khẩu không chính xác." };
  }

  revalidatePath("/", "layout");
  redirect("/workspace");
}

export async function signup(formData: FormData): Promise<AuthResult> {
  const email = (formData.get("email") as string) || "";
  const password = (formData.get("password") as string) || "";
  const captchaAnswer = (formData.get("captchaAnswer") as string) || "";
  const captchaToken = (formData.get("captchaToken") as string) || "";

  if (!email || !password) {
    return { error: "Vui lòng nhập đầy đủ email và mật khẩu." };
  }

  if (password.length < 6) {
    return { error: "Mật khẩu phải có ít nhất 6 ký tự." };
  }

  if (!verifyMathCaptcha(captchaAnswer, captchaToken)) {
    return { error: "Kết quả phép tính bảo mật không chính xác." };
  }

  let signupError: string | null = null;
  let needsEmailConfirm = false;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      signupError = error.message || "signup_failed";
    } else if (data.user && !data.session) {
      needsEmailConfirm = true;
    }
  } catch (err) {
    signupError = err instanceof Error ? err.message : "fetch failed";
  }

  if (signupError) {
    const lower = signupError.toLowerCase();
    const recoverable =
      lower.includes("rate limit") ||
      lower.includes("fetch failed") ||
      lower.includes("failed to fetch") ||
      lower.includes("timeout") ||
      lower.includes("network") ||
      lower.includes("paused") ||
      lower.includes("invalid api key");

    // Local fallback: tự tạo tài khoản local với 10 credits
    if (isLocalDev() || recoverable) {
      await setDevSession(email);
      revalidatePath("/", "layout");
      redirect("/workspace");
    }

    return { error: signupError };
  }

  // Supabase yêu cầu xác nhận email (session trả về null)
  if (needsEmailConfirm) {
    return {
      success: true,
      message:
        "Đăng ký thành công! Vui lòng kiểm tra hộp thư email để kích hoạt tài khoản.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/workspace");
}

export async function signOut(): Promise<void> {
  await clearDevSession();
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch {
    // Bỏ qua khi chưa cấu hình Supabase (local dev)
  }
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function getUserProfile(): Promise<DevSession | null> {
  // 1. Chỉ dùng dev session cookie khi chạy local development và chữ ký HMAC hợp lệ
  if (process.env.NODE_ENV !== "production") {
    const cookieStore = await cookies();
    const devCookie = cookieStore.get(COOKIE_DEV_SESSION)?.value;
    if (devCookie) {
      const verified = verifyDevSession(devCookie);
      if (verified) return verified;
    }
  }

  // 2. Supabase auth chuẩn cho production & authenticated users
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("credits_remaining, email")
      .eq("id", user.id)
      .single();

    if (!profile || error) {
      // Tự động khởi tạo profile với 10 credits (Self-healing nếu trigger DB chưa chạy)
      const { data: newProfile } = await supabase
        .from("profiles")
        .upsert({ id: user.id, email: user.email, credits_remaining: 10 })
        .select("credits_remaining")
        .single();

      return {
        id: user.id,
        email: user.email ?? "",
        credits: newProfile?.credits_remaining ?? 10,
      };
    }

    return {
      id: user.id,
      email: user.email ?? "",
      credits: profile.credits_remaining ?? 10,
    };
  } catch {
    return null;
  }
}

interface TopUpResult {
  success: boolean;
  newCredits: number;
  message: string;
  planId?: string;
}

/**
 * Nạp thêm lượt tạo cho người dùng hiện tại.
 * RULE 1: Supabase Auth -> cộng trực tiếp vào profiles.credits_remaining.
 * RULE 2: Dev session -> cộng vào payload HMAC và ký lại COOKIE_DEV_SESSION.
 */
export async function topUpCredits(amount: number, planId?: string): Promise<TopUpResult> {
  const safeAmount = Math.floor(amount);
  if (!Number.isFinite(safeAmount) || safeAmount <= 0 || safeAmount > 100000) {
    return { success: false, newCredits: 0, message: "Số lượt nạp không hợp lệ." };
  }

  // RULE 2: Local dev session
  if (process.env.NODE_ENV !== "production") {
    const cookieStore = await cookies();
    const devCookie = cookieStore.get(COOKIE_DEV_SESSION)?.value;
    const session = devCookie ? verifyDevSession(devCookie) : null;

    if (session) {
      const newCredits = session.credits + safeAmount;
      const targetPlan = planId || session.planId || "monthly";
      cookieStore.set(
        COOKIE_DEV_SESSION,
        signDevSession({ ...session, credits: newCredits, planId: targetPlan }),
        {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        },
      );
      revalidatePath("/workspace");
      return {
        success: true,
        newCredits,
        planId: targetPlan,
        message: `Đã nạp thành công ${safeAmount} lượt tạo vào tài khoản của bạn.`,
      };
    }
  }

  // RULE 1: Supabase Auth
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        newCredits: 0,
        message: "Vui lòng đăng nhập để nạp thêm lượt tạo.",
      };
    }

    const { data: profile, error: readError } = await supabase
      .from("profiles")
      .select("credits_remaining")
      .eq("id", user.id)
      .single();

    const currentCredits = readError ? 0 : profile?.credits_remaining ?? 0;
    const newCredits = currentCredits + safeAmount;

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ credits_remaining: newCredits })
      .eq("id", user.id);

    if (updateError) {
      console.error("[Top-up Update Error]:", updateError);
      return {
        success: false,
        newCredits: currentCredits,
        message: "Không thể cập nhật số lượt. Vui lòng thử lại sau.",
      };
    }

    revalidatePath("/workspace");
    return {
      success: true,
      newCredits,
      message: `Đã nạp thành công ${safeAmount} lượt tạo vào tài khoản của bạn.`,
    };
  } catch (error) {
    console.error("[Top-up Exception]:", error);
    return {
      success: false,
      newCredits: 0,
      message: "Không thể kết nối máy chủ nạp lượt. Vui lòng thử lại.",
    };
  }
}

export async function forgotPassword(email: string): Promise<AuthResult> {
  const trimmed = (email || "").trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(trimmed)) {
    return { error: "Vui lòng nhập một địa chỉ email hợp lệ." };
  }

  if (!isLocalDev()) {
    try {
      const supabase = await createClient();
      await supabase.auth.resetPasswordForEmail(trimmed);
    } catch {
      // Luôn trả về thông báo trung tính để không lộ email có tồn tại hay không
    }
  }

  return {
    success: true,
    message:
      "Nếu email tồn tại trong hệ thống, link khôi phục mật khẩu đã được gửi đến hộp thư của bạn.",
  };
}
