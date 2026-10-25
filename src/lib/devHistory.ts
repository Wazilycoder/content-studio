import { promises as fs } from "fs";
import path from "path";

export interface DevHistoryRecord {
  id: string;
  userId: string;
  productName: string;
  productDescription: string;
  targetAudience: string;
  tone: string;
  captions: { id: string; angle: string; text: string }[];
  headlines: string[];
  hashtags: string[];
  createdAt: string;
}

const DEV_HISTORY_DIR = path.join(process.cwd(), ".data");
const DEV_HISTORY_FILE = path.join(DEV_HISTORY_DIR, "dev_history.json");

export async function readDevHistory(): Promise<DevHistoryRecord[]> {
  try {
    const raw = await fs.readFile(DEV_HISTORY_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as DevHistoryRecord[]) : [];
  } catch {
    return [];
  }
}

export async function appendDevHistory(record: DevHistoryRecord): Promise<void> {
  try {
    await fs.mkdir(DEV_HISTORY_DIR, { recursive: true });
    const existing = await readDevHistory();
    const next = [record, ...existing.filter((r) => r.id !== record.id)].slice(0, 100);
    await fs.writeFile(DEV_HISTORY_FILE, JSON.stringify(next, null, 2), "utf-8");
  } catch (err) {
    console.error("[Dev History Write Error]:", err);
  }
}

export async function deleteDevHistoryItem(
  id: string,
  userId: string
): Promise<boolean> {
  try {
    const existing = await readDevHistory();
    const next = existing.filter((r) => !(r.id === id && r.userId === userId));
    if (next.length === existing.length) return false;
    await fs.mkdir(DEV_HISTORY_DIR, { recursive: true });
    await fs.writeFile(DEV_HISTORY_FILE, JSON.stringify(next, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("[Dev History Delete Error]:", err);
    return false;
  }
}

export async function fetchDevHistory(
  userId?: string
): Promise<DevHistoryRecord[]> {
  const all = await readDevHistory();
  const filtered =
    userId && userId !== "local-dev-user"
      ? all.filter((r) => r.userId === userId)
      : all;
  return filtered.slice(0, 50);
}