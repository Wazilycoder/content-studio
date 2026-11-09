import { Inbox } from "lucide-react";

export default function HistoryEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-400 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
        <Inbox className="h-5 w-5 text-emerald-400" />
      </div>
      <p className="mt-3 text-sm font-semibold tracking-tight text-white">
        Chưa có bản thảo nào
      </p>
      <p className="mt-1 max-w-[260px] text-[12px] leading-relaxed text-slate-400">
        Mỗi lần tạo nội dung thành công, bài viết sẽ tự động lưu vào đây và hiển thị ngay trên thanh tác vụ trên cùng để khôi phục 1-chạm.
      </p>
    </div>
  );
}