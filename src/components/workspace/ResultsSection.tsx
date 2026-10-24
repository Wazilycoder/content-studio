"use client";

import { AlignLeft, RefreshCw, Sparkles } from "lucide-react";
import CaptionCard from "./CaptionCard";
import EmptyState from "./EmptyState";
import HashtagGroup from "./HashtagGroup";
import HeadlineCard from "./HeadlineCard";
import SkeletonResults from "./SkeletonResults";
import type { GeneratedContent } from "@/types/content";

interface ResultsSectionProps {
  result: GeneratedContent | null;
  loading: boolean;
  onRegenerate: () => void;
  onNotify: (message: string) => void;
}

export default function ResultsSection({
  result,
  loading,
  onRegenerate,
  onNotify,
}: ResultsSectionProps) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="flex items-center gap-1.5 text-sm font-semibold tracking-tight text-[#18181B]">
            <Sparkles className="h-3.5 w-3.5 text-[#3B49DF]" />
            Kết quả
          </h2>
          <p className="mt-0.5 truncate text-[11.5px] text-[#71717A]">
            {result
              ? "3 góc nhìn · 3 headlines · 5 hashtags"
              : "Chưa có nội dung được tạo"}
          </p>
        </div>

        <button
          type="button"
          onClick={onRegenerate}
          disabled={loading || !result}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-[#E4E4DE] bg-white px-2.5 py-1.5 text-[11.5px] font-medium text-[#3F3F46] transition-colors hover:border-[#D4D4D8] hover:text-[#18181B] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Tạo lại
        </button>
      </div>

      {loading ? (
        <SkeletonResults />
      ) : !result ? (
        <EmptyState />
      ) : (
        <div className="space-y-6">
          <section>
            <h3 className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
              <AlignLeft className="h-3.5 w-3.5" />
              3 góc bài viết
            </h3>
            <div className="space-y-3">
              {result.captions.map((caption) => (
                <CaptionCard
                  key={caption.id}
                  caption={caption}
                  onNotify={onNotify}
                />
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
              <Sparkles className="h-3.5 w-3.5" />
              3 headlines
            </h3>
            <div className="space-y-2">
              {result.headlines.map((headline, index) => (
                <HeadlineCard
                  key={`${index}-${headline}`}
                  headline={headline}
                  index={index}
                  onNotify={onNotify}
                />
              ))}
            </div>
          </section>

          <section>
            <HashtagGroup hashtags={result.hashtags} onNotify={onNotify} />
          </section>
        </div>
      )}
    </div>
  );
}