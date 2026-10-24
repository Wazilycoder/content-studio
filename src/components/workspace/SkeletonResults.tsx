const SKELETON_ROWS: string[][] = [
  ["w-[92%]", "w-full", "w-[88%]", "w-[64%]"],
  ["w-full", "w-[90%]", "w-[76%]"],
  ["w-[86%]", "w-full", "w-[70%]", "w-[52%]"],
];

export default function SkeletonResults() {
  return (
    <div role="status">
      <span className="sr-only">Đang biên soạn nội dung...</span>

      <div aria-hidden="true" className="space-y-3">
        {SKELETON_ROWS.map((rows, cardIndex) => (
          <div
            key={cardIndex}
            className="animate-pulse rounded-lg border border-[#E4E4DE] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="h-5 w-40 rounded-md bg-[#F1F1ED]" />
              <div className="h-6 w-16 rounded-md bg-[#F1F1ED]" />
            </div>

            <div className="mt-4 space-y-2.5">
              {rows.map((width, rowIndex) => (
                <div
                  key={rowIndex}
                  className={`h-2.5 rounded bg-[#F1F1ED] ${width}`}
                />
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="h-2.5 w-20 rounded bg-[#F1F1ED]" />
              <div className="h-2.5 w-32 rounded bg-[#F1F1ED]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}