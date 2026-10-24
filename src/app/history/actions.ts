"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type {
  CaptionAngle,
  CaptionItem,
  GenerationRecord,
  ToneOption,
} from "@/types/content";

interface GenerationRow {
  id: string;
  user_id: string;
  product_name: string | null;
  product_description: string | null;
  target_audience: string | null;
  tone: string | null;
  captions: unknown;
  headlines: unknown;
  hashtags: unknown;
  created_at: string;
}

const TONE_OPTIONS: ToneOption[] = [
  "hai-huoc",
  "trang-trong",
  "tre-trung",
  "dong-cam",
  "chuyen-gia",
  "ke-chuyen",
  "kich-thich",
];

const CAPTION_ANGLES = [
  "Góc 1: Vấn đề & Giải pháp",
  "Góc 2: Cảm xúc & Phong cách sống",
  "Góc 3: Trực diện tính năng & Giá trị",
] as const;

function normalizeCaptionAt(rows: unknown[], index: number): CaptionItem {
  const raw = rows[index];
  const record: Record<string, unknown> =
    raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};

  const angleRaw = typeof record.angle === "string" ? record.angle : "";
  const angle = (CAPTION_ANGLES as readonly string[]).includes(angleRaw)
    ? (angleRaw as CaptionAngle)
    : CAPTION_ANGLES[index];

  const id =
    typeof record.id === "string" && record.id.length > 0
      ? record.id
      : `caption-${index + 1}`;

  const text = typeof record.text === "string" ? record.text : "";

  return { id, angle, text };
}

function normalizeCaptions(
  value: unknown,
): [CaptionItem, CaptionItem, CaptionItem] {
  const rows = Array.isArray(value) ? value : [];
  return [
    normalizeCaptionAt(rows, 0),
    normalizeCaptionAt(rows, 1),
    normalizeCaptionAt(rows, 2),
  ];
}

function pickStrings(value: unknown, count: number): string[] {
  const rows = Array.isArray(value) ? value : [];
  return Array.from({ length: count }, (_, index) => {
    const item = rows[index];
    return typeof item === "string" ? item : "";
  });
}

function mapGenerationRow(row: GenerationRow): GenerationRecord {
  const tone = TONE_OPTIONS.includes(row.tone as ToneOption)
    ? (row.tone as ToneOption)
    : "trang-trong";

  return {
    id: row.id,
    userId: row.user_id,
    productName: row.product_name ?? "",
    productDescription: row.product_description ?? "",
    targetAudience: row.target_audience ?? "",
    tone,
    captions: normalizeCaptions(row.captions),
    headlines: pickStrings(row.headlines, 3) as [string, string, string],
    hashtags: pickStrings(row.hashtags, 5) as [
      string,
      string,
      string,
      string,
      string,
    ],
    createdAt: row.created_at,
  };
}

export async function fetchUserHistory(): Promise<{
  data?: GenerationRecord[];
  error?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { data: [] };

  const { data, error } = await supabase
    .from("generations")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return { data: [], error: "Không thể tải lịch sử bài viết. Vui lòng thử lại." };
  }

  const rows = (data ?? []) as unknown as GenerationRow[];
  return { data: rows.map(mapGenerationRow) };
}

export async function deleteHistoryItem(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  if (!id) {
    return { success: false, error: "Thiếu mã bài viết cần xóa." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Bạn cần đăng nhập để xóa bài viết." };
  }

  const { error } = await supabase
    .from("generations")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: "Không thể xóa bài viết. Vui lòng thử lại." };
  }

  revalidatePath("/");
  return { success: true };
}