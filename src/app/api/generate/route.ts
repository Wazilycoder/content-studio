import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { callGemini } from "@/lib/ai/gemini";
import type { CaptionAngle, GeneratedContent } from "@/types/content";

// 1. Schema kiểm tra đầu vào Form
const InputSchema = z.object({
  productName: z.string().trim().min(2, "Tên sản phẩm tối thiểu 2 ký tự").max(100, "Tên sản phẩm tối đa 100 ký tự"),
  productDescription: z.string().trim().min(1, "Mô tả sản phẩm không được để trống").max(1000, "Mô tả sản phẩm tối đa 1.000 ký tự"),
  targetAudience: z.string().trim().min(1, "Khách hàng mục tiêu không được để trống").max(200, "Khách hàng mục tiêu tối đa 200 ký tự"),
  tone: z.enum(["hai-huoc", "trang-trong", "tre-trung"], {
    message: "Tone phải là hài hước, trang trọng hoặc trẻ trung",
  }),
});

// 2. Schema kiểm tra đầu ra từ AI
const AiOutputSchema = z.object({
  captions: z.array(
    z.object({
      id: z.string(),
      angle: z.string(),
      text: z.string(),
    })
  ).length(3, "Bắt buộc phải có đúng 3 bài viết captions"),
  headlines: z.array(z.string()).length(3, "Bắt buộc phải có đúng 3 tiêu đề headlines"),
  hashtags: z.array(z.string()).length(5, "Bắt buộc phải có đúng 5 hashtags"),
});

const TONE_DESCRIPTIONS: Record<string, string> = {
  "hai-huoc": "Hóm hỉnh, duyên dáng, chơi chữ tự nhiên, thân thiện và gần gũi như trò chuyện đời thường, tuyệt đối không lố lăng cợt nhả.",
  "trang-trong": "Lịch thiệp, chuẩn mực, thanh lịch, uy tín, nhấn mạnh chất lượng, giá trị cốt lõi và sự tinh tế.",
  "tre-trung": "Năng động, hiện đại, bắt nhịp lối sống đương đại, câu từ gãy gọn, phóng khoáng, không lạm dụng teencode phản cảm.",
};

export async function POST(request: Request) {
  const supabase = await createClient();

  // BƯỚC 1: Xác thực người dùng
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Vui lòng đăng nhập để tạo nội dung quảng cáo." },
      { status: 401 }
    );
  }

  // BƯỚC 2: Kiểm tra dữ liệu đầu vào
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Dữ liệu gửi lên không đúng định dạng JSON." },
      { status: 400 }
    );
  }

  const parseResult = InputSchema.safeParse(body);
  if (!parseResult.success) {
    const errorMsg = parseResult.error.issues.map((e: { message: string }) => e.message).join(", ");
    return NextResponse.json({ error: errorMsg }, { status: 400 });
  }

  const input = parseResult.data;

  // BƯỚC 3: Trừ Credit Atomic trong Database (Khóa dòng chống double-spending)
  const { data: deductSuccess, error: deductError } = await supabase.rpc(
    "deduct_credit_atomic",
    { p_user_id: user.id }
  );

  if (deductError) {
    console.error("[Database RPC Error]:", deductError);
    return NextResponse.json(
      { error: "Lỗi hệ thống khi kiểm tra số dư lượt tạo. Vui lòng thử lại sau." },
      { status: 500 }
    );
  }

  if (!deductSuccess) {
    return NextResponse.json(
      { error: "Bạn đã sử dụng hết lượt tạo nội dung miễn phí (0 lượt khả dụng)." },
      { status: 402 }
    );
  }

  // BƯỚC 4: Soạn thảo Prompt chống AI-slop chặt chẽ cho Gemini
  const toneDesc = TONE_DESCRIPTIONS[input.tone] || input.tone;

  const systemInstruction = `Bạn là Senior Copywriter kiêm Giám đốc Sáng tạo nội dung quảng cáo hàng đầu tại Việt Nam.
Nhiệm vụ của bạn là viết nội dung quảng cáo Facebook và Instagram cho chủ shop, mang phong thái tự nhiên, sắc sảo, thuyết phục cao.

QUY TẮC BẮT BUỘC (ANTI-AI-SLOP & ANTI-HALLUCINATION):
1. TUYỆT ĐỐI KHÔNG BỊA ĐẶT: Không tự ý sáng tác giá tiền, mức giảm giá %, đánh giá của khách hàng, hay chứng chỉ y tế/quốc tế không có trong mô tả.
2. KHÔNG DÙNG VĂN MẪU SÁO RỖNG: Tránh hoàn toàn các câu mở đầu rập khuôn kiểu: "Chào các bạn...", "Bạn đang tìm kiếm...", "Đừng bỏ lỡ siêu phẩm...".
3. BA GÓC TIẾP CẬN RIÊNG BIỆT CHO 3 CAPTION:
   - Góc 1: Vấn đề & Giải pháp (Đặt ra khó khăn/trăn trở đời thường và cách sản phẩm giải quyết triệt để).
   - Góc 2: Cảm xúc & Phong cách sống (Gắn sản phẩm vào không gian sống, phong thái, cảm xúc tích cực).
   - Góc 3: Trực diện tính năng & Giá trị (Nêu bật chất liệu, thông số, sự tiện lợi, độ bền).
4. HEADLINES: Đúng 3 tiêu đề giật tít súc tích (5-15 từ), mạnh mẽ, không trùng lặp ý tưởng.
5. HASHTAGS: Đúng 5 hashtags chọn lọc, gắn liền ngách sản phẩm, không spam tag đại trà vô nghĩa.
6. ĐẦU RA BẮT BUỘC: Trả về duy nhất 1 chuỗi JSON hợp lệ theo đúng cấu trúc schema, không kèm giải thích bên ngoài.`;

  const userPrompt = `Hãy tạo nội dung quảng cáo cho sản phẩm sau:

THÔNG TIN SẢN PHẨM:
- Tên sản phẩm: ${input.productName}
- Mô tả chi tiết: ${input.productDescription}
- Khách hàng mục tiêu: ${input.targetAudience}
- Tone giọng yêu cầu: ${input.tone} (${toneDesc})

CẤU TRÚC JSON BẮT BUỘC TRẢ VỀ:
{
  "captions": [
    {
      "id": "cap-1",
      "angle": "Góc 1: Vấn đề & Giải pháp",
      "text": "Nội dung caption góc 1..."
    },
    {
      "id": "cap-2",
      "angle": "Góc 2: Cảm xúc & Phong cách sống",
      "text": "Nội dung caption góc 2..."
    },
    {
      "id": "cap-3",
      "angle": "Góc 3: Trực diện tính năng & Giá trị",
      "text": "Nội dung caption góc 3..."
    }
  ],
  "headlines": [
    "Tiêu đề 1...",
    "Tiêu đề 2...",
    "Tiêu đề 3..."
  ],
  "hashtags": [
    "#hashtag1",
    "#hashtag2",
    "#hashtag3",
    "#hashtag4",
    "#hashtag5"
  ]
}`;

  // BƯỚC 5: Gọi AI với cơ chế HOÀN CREDIT TỰ ĐỘNG khi lỗi (Refund Safety)
  try {
    const rawAiResponse = await callGemini({
      prompt: userPrompt,
      systemInstruction,
      responseMimeType: "application/json",
      temperature: 0.7,
    });

    // Parse JSON
    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(rawAiResponse);
    } catch {
      // Làm sạch markdown backticks nếu model lỡ kèm ```json ... ```
      const cleaned = rawAiResponse.replace(/```json/gi, "").replace(/```/g, "").trim();
      parsedJson = JSON.parse(cleaned);
    }

    const validateResult = AiOutputSchema.safeParse(parsedJson);
    if (!validateResult.success) {
      console.error("[AI Output Validation Error]:", validateResult.error);
      throw new Error("Dữ liệu AI trả về không khớp với cấu trúc 3 captions, 3 headlines, 5 hashtags.");
    }

    const aiData = validateResult.data;

    // Chuẩn hóa góc nhìn và kiểu dữ liệu
    const formattedOutput: GeneratedContent = {
      captions: [
        {
          id: `cap-${Date.now()}-1`,
          angle: "Góc 1: Vấn đề & Giải pháp" as CaptionAngle,
          text: aiData.captions[0].text.trim(),
        },
        {
          id: `cap-${Date.now()}-2`,
          angle: "Góc 2: Cảm xúc & Phong cách sống" as CaptionAngle,
          text: aiData.captions[1].text.trim(),
        },
        {
          id: `cap-${Date.now()}-3`,
          angle: "Góc 3: Trực diện tính năng & Giá trị" as CaptionAngle,
          text: aiData.captions[2].text.trim(),
        },
      ],
      headlines: [
        aiData.headlines[0].trim(),
        aiData.headlines[1].trim(),
        aiData.headlines[2].trim(),
      ],
      hashtags: [
        aiData.hashtags[0].trim(),
        aiData.hashtags[1].trim(),
        aiData.hashtags[2].trim(),
        aiData.hashtags[3].trim(),
        aiData.hashtags[4].trim(),
      ],
    };

    // BƯỚC 6: Lưu bản ghi vào bảng generations trên Supabase (Background save)
    await supabase.from("generations").insert({
      user_id: user.id,
      product_name: input.productName,
      product_description: input.productDescription,
      target_audience: input.targetAudience,
      tone: input.tone,
      captions: formattedOutput.captions,
      headlines: formattedOutput.headlines,
      hashtags: formattedOutput.hashtags,
    });

    // Lấy số credit mới nhất sau khi trừ thành công
    const { data: updatedProfile } = await supabase
      .from("profiles")
      .select("credits_remaining")
      .eq("id", user.id)
      .single();

    return NextResponse.json({
      success: true,
      data: formattedOutput,
      creditsRemaining: updatedProfile?.credits_remaining ?? 0,
    });
  } catch (error: unknown) {
    console.error("[AI Generation Failed]:", error);

    // KÍCH HOẠT CƠ CHẾ HOÀN CREDIT TỨC THÌ
    await supabase.rpc("refund_credit_atomic", { p_user_id: user.id });

    const message =
      error instanceof Error
        ? error.message
        : "Không thể kết nối đến máy chủ AI. Lượt tạo của bạn đã được hoàn lại 100%.";

    return NextResponse.json(
      {
        error: `Quá trình tạo thất bại: ${message}. Lượt tạo của bạn đã được hoàn lại đầy đủ.`,
      },
      { status: 500 }
    );
  }
}
