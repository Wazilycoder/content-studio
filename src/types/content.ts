export type ToneOption = "hai-huoc" | "trang-trong" | "tre-trung";

export type PlatformGuidance = "facebook" | "instagram" | "all";

export interface ContentFormInput {
  productName: string;
  productDescription: string;
  targetAudience: string;
  tone: ToneOption;
}

export type CaptionAngle =
  | "Góc 1: Vấn đề & Giải pháp"
  | "Góc 2: Cảm xúc & Phong cách sống"
  | "Góc 3: Trực diện tính năng & Giá trị";

export interface CaptionItem {
  id: string;
  angle: CaptionAngle;
  text: string;
}

export interface GeneratedContent {
  captions: [CaptionItem, CaptionItem, CaptionItem];
  headlines: [string, string, string];
  hashtags: [string, string, string, string, string];
}

export interface HistoryRecord {
  id: string;
  createdAt: number;
  inputs: ContentFormInput;
  output: GeneratedContent;
}

export interface GenerationRecord {
  id: string;
  userId: string;
  productName: string;
  productDescription: string;
  targetAudience: string;
  tone: ToneOption;
  captions: [CaptionItem, CaptionItem, CaptionItem];
  headlines: [string, string, string];
  hashtags: [string, string, string, string, string];
  createdAt: string;
}