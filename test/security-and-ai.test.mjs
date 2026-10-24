import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";

// 1. Logic Captcha HMAC
const CAPTCHA_SECRET = "test-secret-key-32-bytes-secure";

function generateMathCaptcha(num1, num2, op) {
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

function verifyMathCaptcha(userAnswer, token, secret = CAPTCHA_SECRET) {
  if (!userAnswer || !token) return false;
  const [timestampRaw, signature] = token.split(".");
  const timestamp = Number(timestampRaw);
  if (!Number.isFinite(timestamp) || !signature) return false;

  if (Date.now() - timestamp > 5 * 60 * 1000) return false;

  const expected = createHmac("sha256", secret)
    .update(`${String(userAnswer).trim()}:${timestamp}`)
    .digest("hex");

  const expectedBuf = Buffer.from(expected, "hex");
  const providedBuf = Buffer.from(signature, "hex");
  if (expectedBuf.length !== providedBuf.length) return false;
  return timingSafeEqual(expectedBuf, providedBuf);
}

// 2. Logic Ký và xác thực Cookie Dev Session
function signDevSession(session, secret = CAPTCHA_SECRET) {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  const sig = createHmac("sha256", secret).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

function verifyDevSession(cookieValue, secret = CAPTCHA_SECRET) {
  if (!cookieValue) return null;
  const parts = cookieValue.split(".");
  if (parts.length !== 2) return null;
  const [payload, sig] = parts;
  if (!payload || !sig) return null;

  const expectedSig = createHmac("sha256", secret).update(payload).digest("hex");
  const expectedBuf = Buffer.from(expectedSig, "hex");
  const providedBuf = Buffer.from(sig, "hex");
  if (expectedBuf.length !== providedBuf.length || !timingSafeEqual(expectedBuf, providedBuf)) {
    return null;
  }

  try {
    const raw = Buffer.from(payload, "base64url").toString("utf-8");
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.email === "string") {
      return parsed;
    }
  } catch {
    return null;
  }
  return null;
}

// 3. Zod Schemas
const InputSchema = z.object({
  productName: z.string().trim().min(2).max(100),
  productDescription: z.string().trim().min(1).max(1000),
  targetAudience: z.string().trim().min(1).max(200),
  tone: z.enum([
    "hai-huoc",
    "trang-trong",
    "tre-trung",
    "dong-cam",
    "chuyen-gia",
    "ke-chuyen",
    "kich-thich",
  ]),
});

const AiOutputSchema = z.object({
  captions: z
    .array(
      z.object({
        id: z.string(),
        angle: z.string().min(3),
        text: z.string().trim().min(30),
      })
    )
    .length(3),
  headlines: z.array(z.string().trim().min(5)).length(3),
  hashtags: z.array(z.string().trim().min(2)).length(5),
});

// 4. Rate Limiting logic test
class MemoryRateLimiter {
  constructor(limit = 5, windowMs = 60000) {
    this.limit = limit;
    this.windowMs = windowMs;
    this.map = new Map();
  }

  check(userId) {
    const now = Date.now();
    const record = this.map.get(userId);
    if (!record || now > record.resetAt) {
      this.map.set(userId, { count: 1, resetAt: now + this.windowMs });
      return true;
    }
    if (record.count >= this.limit) {
      return false;
    }
    record.count += 1;
    return true;
  }
}

// SUITE TESTS
describe("Content Studio Security & Logic Tests", () => {
  test("1. Math Captcha verifies correct answer and rejects wrong answer", () => {
    const captcha = generateMathCaptcha(7, 8, "+");
    assert.equal(verifyMathCaptcha("15", captcha.token), true);
    assert.equal(verifyMathCaptcha("14", captcha.token), false);
    assert.equal(verifyMathCaptcha("", captcha.token), false);
    assert.equal(verifyMathCaptcha("15", "forged.token"), false);
  });

  test("2. Dev session cookie HMAC signature prevents tampering", () => {
    const session = { id: "user-1", email: "shop@gmail.com", credits: 10 };
    const signedCookie = signDevSession(session);
    const verified = verifyDevSession(signedCookie);
    assert.deepEqual(verified, session);

    // Tampered payload (e.g. attacker changes credits to 99999)
    const [payload, sig] = signedCookie.split(".");
    const tamperedPayload = Buffer.from(
      JSON.stringify({ id: "user-1", email: "shop@gmail.com", credits: 99999 })
    ).toString("base64url");
    const tamperedCookie = `${tamperedPayload}.${sig}`;

    assert.equal(verifyDevSession(tamperedCookie), null);
  });

  test("3. Input validation blocks invalid or missing product data", () => {
    const valid = {
      productName: "Áo sơ mi lụa tơ tằm",
      productDescription: "Lụa dệt tay Bảo Lộc tự nhiên",
      targetAudience: "Phụ nữ công sở 25-40 tuổi",
      tone: "trang-trong",
    };
    assert.equal(InputSchema.safeParse(valid).success, true);

    const invalidTone = { ...valid, tone: "invalid-tone" };
    assert.equal(InputSchema.safeParse(invalidTone).success, false);

    const emptyDesc = { ...valid, productDescription: "" };
    assert.equal(InputSchema.safeParse(emptyDesc).success, false);
  });

  test("4. AI Output Schema blocks empty captions and enforce 3-3-5 format", () => {
    const validAiData = {
      captions: [
        { id: "c1", angle: "Vấn đề", text: "Nội dung bài viết góc 1 dài hơn 30 ký tự để bán hàng chuẩn." },
        { id: "c2", angle: "Cảm xúc", text: "Nội dung bài viết góc 2 dài hơn 30 ký tự để bán hàng chuẩn." },
        { id: "c3", angle: "Tính năng", text: "Nội dung bài viết góc 3 dài hơn 30 ký tự để bán hàng chuẩn." },
      ],
      headlines: ["Tiêu đề thu hút 1", "Tiêu đề thu hút 2", "Tiêu đề thu hút 3"],
      hashtags: ["#thoitrang", "#aosomi", "#lua", "#congso", "#ootd"],
    };
    assert.equal(AiOutputSchema.safeParse(validAiData).success, true);

    // Empty text caption must be rejected
    const emptyCaption = JSON.parse(JSON.stringify(validAiData));
    emptyCaption.captions[0].text = "ngắn";
    assert.equal(AiOutputSchema.safeParse(emptyCaption).success, false);

    // Less than 3 captions must be rejected
    const missingCaption = JSON.parse(JSON.stringify(validAiData));
    missingCaption.captions.pop();
    assert.equal(AiOutputSchema.safeParse(missingCaption).success, false);
  });

  test("5. Rate limiter allows 5 calls then blocks 6th call within window", () => {
    const limiter = new MemoryRateLimiter(5, 60000);
    const userId = "test-user-limit";

    for (let i = 0; i < 5; i++) {
      assert.equal(limiter.check(userId), true, `Call #${i + 1} should be allowed`);
    }
    assert.equal(limiter.check(userId), false, "Call #6 should be blocked by rate limit");
  });
});
