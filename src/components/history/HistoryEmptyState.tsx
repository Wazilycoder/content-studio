import { Inbox } from "lucide-react";

export default function HistoryEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E4E4DE] bg-[#F1F1ED]">
        <Inbox className="h-5 w-5 text-[#71717A]" />
      </div>
      <p className="mt-3 text-sm font-semibold tracking-tight text-[#18181B]">
        Chưa có bài viết nào
      </p>
      <p className="mt-1 max-w-[260px] text-[12px] leading-relaxed text-[#71717A]">
        Mỗi lần tạo nội dung thành công, bài viết sẽ được lưu tự động tại đây để
        xem lại hoặc khôi phục vào form.
      </p>
    </div>
  );
}