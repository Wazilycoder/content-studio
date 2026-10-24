import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { callUnifiedAi } from "@/lib/ai";
import type { CaptionAngle, GeneratedContent } from "@/types/content";

// 1. Schema kiểm tra đầu vào Form
const InputSchema = z.object({
  productName: z
    .string()
    .trim()
    .min(2, "Tên sản phẩm tối thiểu 2 ký tự")
    .max(100, "Tên sản phẩm tối đa 100 ký tự"),
  productDescription: z
    .string()
    .trim()
    .min(1, "Mô tả sản phẩm không được để trống")
    .max(1000, "Mô tả sản phẩm tối đa 1.000 ký tự"),
  targetAudience: z
    .string()
    .trim()
    .min(1, "Khách hàng mục tiêu không được để trống")
    .max(200, "Khách hàng mục tiêu tối đa 200 ký tự"),
  tone: z.enum(
    [
      "hai-huoc",
      "trang-trong",
      "tre-trung",
      "dong-cam",
      "chuyen-gia",
      "ke-chuyen",
      "kich-thich",
    ],
    {
      message: "Tông giọng không hợp lệ",
    }
  ),
});

// 2. Schema kiểm tra đầu ra từ AI
const AiOutputSchema = z.object({
  captions: z
    .array(
      z.object({
        id: z.string(),
        angle: z.string(),
        text: z.string(),
      })
    )
    .length(3, "Bắt buộc phải có đúng 3 bài viết captions"),
  headlines: z
    .array(z.string())
    .length(3, "Bắt buộc phải có đúng 3 tiêu đề headlines"),
  hashtags: z.array(z.string()).length(5, "Bắt buộc phải có đúng 5 hashtags"),
});

const TONE_DESCRIPTIONS: Record<string, string> = {
  "hai-huoc":
    "Hóm hỉnh, duyên dáng, chơi chữ tự nhiên, mang hơi thở đời thường và gen Z hiện đại, tạo nụ cười nhẹ nhưng bán hàng khéo léo, tuyệt đối không lố lăng cợt nhả.",
  "trang-trong":
    "Sang trọng, thanh lịch, chuẩn mực và đẳng cấp; dùng từ ngữ chỉn chu, gãy gọn, tôn vinh chất lượng tinh tế và vị thế của người dùng.",
  "tre-trung":
    "Năng động, tươi mới, nhiệt huyết, bắt nhịp lối sống hiện đại, câu từ ngắn gọn, dứt khoát, phóng khoáng, khơi dậy tinh thần trải nghiệm.",
  "dong-cam":
    "Thủ thỉ, sâu lắng, tâm tình như một người bạn tri kỷ; thấu hiểu nỗi vất vả, mệt mỏi hay những trăn trở thầm kín của khách hàng (rất hợp ngành mẹ bé, chăm sóc sức khỏe, gia đình).",
  "chuyen-gia":
    "Lập luận logic, đi thẳng vào nguyên lý khoa học, phân tích cơ chế hoạt động và thông số minh bạch; tạo độ tin cậy tuyệt đối bằng kiến thức ngành sâu sắc.",
  "ke-chuyen":
    "Văn phong tự sự giàu hình ảnh (Storytelling); đưa người đọc vào hành trình tìm tòi nguồn gốc, công sức của nghệ nhân/nhà sáng lập hoặc khoảnh khắc đời thực tạo nên sản phẩm.",
  "kich-thich":
    "Trực diện, nhịp điệu nhanh, tạo cảm giác khẩn trương và khan hiếm (FOMO tinh tế); nêu bật ưu đãi giới hạn và thôi thúc ra quyết định mua hàng ngay mà không bị phản cảm.",
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

  const systemInstruction = `Bạn là Giám đốc Sáng tạo (Creative Director) kiêm Chuyên gia Copywriting Chuyển đổi (Conversion Copywriting Specialist) hàng đầu Việt Nam với 10+ năm kinh nghiệm tư vấn cho các thương hiệu D2C, bán lẻ và chủ shop thời trang, F&B, mỹ phẩm.
Nhiệm vụ của bạn là sáng tác nội dung quảng cáo Facebook và Instagram độc bản, sắc bén và thuyết phục cao, giúp người bán hàng ra đơn mà không bị cảm giác "chợ búa" hay "văn mẫu bot AI".

QUY TẮC BẮT BUỘC (ANTI-AI-SLOP & CHẤT LƯỢNG NỘI DUNG ĐẠT GIẢI):
1. BANNED CLICHÉS (CẤM TUYỆT ĐỐI CÁC CÂU MỞ ĐẦU RẬP KHUÔN):
   - CẤM: "Chào các bạn...", "Bạn đang tìm kiếm...", "Bạn có biết...", "Hôm nay shop xin giới thiệu...", "Đừng bỏ lỡ siêu phẩm...", "Hãy cùng chúng tôi khám phá...".
   - CẤM các tính từ sáo rỗng vô nghĩa: "tuyệt vời", "đỉnh cao", "siêu phẩm", "hoàn hảo không tì vết", "đẹp mê hồn".
   - Mở bài PHẢI đi thẳng vào một quan sát thực tế (insight), một phiền toái có thật, hoặc một lát cắt đời thường sinh động.

2. NGUYÊN TẮC TRUNG THỰC (ANTI-HALLUCINATION):
   - Tuyệt đối KHÔNG tự ý bịa đặt mức giảm giá %, giá tiền cụ thể, chứng chỉ y tế/quốc tế hay đánh giá của khách hàng nếu người dùng không cung cấp trong mô tả.
   - Bám sát sự thật của sản phẩm, làm nổi bật bản chất của chất liệu và công năng.

3. NHỊP ĐIỆU VĂN BẢN & ĐỊNH DẠNG (RHYTHM & FORMATTING):
   - Ngắt nhịp tự nhiên, câu văn gãy gọn. Xuống dòng thoáng mắt (mỗi đoạn ngắn chỉ 1–3 câu).
   - Chỉ dùng tối đa 1–2 emoji có ý nghĩa làm bullet point hoặc nhấn mạnh tự nhiên. Tuyệt đối không rải rác emoji bừa bãi như bot spam.

4. BỘ 3 GÓC TIẾP CẬN RIÊNG BIỆT (3 CREATIVE ANGLES):
   - Góc 1: Vấn đề & Giải pháp (PAS - Problem, Agitate, Solution)
     Chỉ ra một sai lầm hoặc phiền toái đời thường mà khách hàng hay chịu đựng -> Sản phẩm giải quyết êm đẹp và triệt để thế nào.
   - Góc 2: Cảm xúc & Phong cách sống (Lifestyle, Identity & Emotion)
     Không bán món đồ, bán cảm giác tự tin, sự nhẹ nhõm và hình ảnh người mua muốn thấy ở chính mình khi sở hữu sản phẩm.
   - Góc 3: Trực diện tính năng & Giá trị (FAB - Feature, Advantage, Benefit)
     Đi sâu vào chất liệu, thông số, đường may/độ hoàn thiện, sự tiện lợi thực tế; chứng minh món đồ xứng đáng từng đồng chi ra.

5. ĐÚNG 3 TIÊU ĐỀ HEADLINES (5–15 từ):
   - Headline 1: Gợi mở & Tò mò (Curiosity Hook)
   - Headline 2: Lợi ích trực diện & Lời hứa giá trị (Direct Benefit)
   - Headline 3: Tuyên ngôn định vị & Khẳng định chất lượng (Authority Statement)

6. ĐÚNG 5 HASHTAGS:
   - 1 hashtag tên sản phẩm/thương hiệu, 2 hashtag ngành hàng/ngách sâu, 2 hashtag hành vi mua sắm xu hướng. Viết liền chuẩn format Facebook & Instagram.

7. ĐẦU RA BẮT BUỘC:
   - Trả về duy nhất 1 chuỗi JSON hợp lệ theo đúng cấu trúc schema, không kèm bất kỳ câu dẫn hay giải thích nào bên ngoài.`;

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
    const rawAiResponse = await callUnifiedAi({
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
