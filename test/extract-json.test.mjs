import { test, describe } from "node:test";
import assert from "node:assert";

function extractAndParseAiJson(raw) {
  const trimmed = (raw || "").trim();

  try {
    return JSON.parse(trimmed);
  } catch {}

  const markdownMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (markdownMatch && markdownMatch[1]) {
    try {
      return JSON.parse(markdownMatch[1].trim());
    } catch {}
  }

  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    const jsonSubstring = trimmed.slice(firstBrace, lastBrace + 1).trim();
    try {
      return JSON.parse(jsonSubstring);
    } catch {}
  }

  const cleaned = trimmed
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/g, "")
    .replace(/`{3,}/g, "")
    .trim();

  return JSON.parse(cleaned);
}

describe("extractAndParseAiJson", () => {
  test("parses plain json", () => {
    const res = extractAndParseAiJson('{"test": 123}');
    assert.deepStrictEqual(res, { test: 123 });
  });

  test("parses markdown json block", () => {
    const res = extractAndParseAiJson('```json\n{"test": 123}\n```');
    assert.deepStrictEqual(res, { test: 123 });
  });

  test("parses markdown block without json tag", () => {
    const res = extractAndParseAiJson('```\n{"test": 123}\n```');
    assert.deepStrictEqual(res, { test: 123 });
  });

  test("parses json with conversational preamble and postscript", () => {
    const res = extractAndParseAiJson('Dưới đây là kết quả:\n```json\n{"test": 123}\n```\nChúc bạn thành công!');
    assert.deepStrictEqual(res, { test: 123 });
  });

  test("parses json when 4 backticks are used", () => {
    const res = extractAndParseAiJson('````json\n{"test": 123}\n````');
    assert.deepStrictEqual(res, { test: 123 });
  });

  test("parses json with backticks inside text fields", () => {
    const res = extractAndParseAiJson('{"text": "Chất lụa `mềm mịn` tuyệt đối"}');
    assert.strictEqual(res.text, "Chất lụa `mềm mịn` tuyệt đối");
  });
});
