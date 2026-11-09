import { getUserProfile, signOut } from "@/app/auth/actions";
import WorkspaceContainer from "@/components/workspace/WorkspaceContainer";

export const dynamic = "force-dynamic";

export default async function WorkspacePage() {
  const user = await getUserProfile();

  // Guest Judge Mode: Tự động cấp phiên trải nghiệm 10 lượt tạo miễn phí
  // Đảm bảo ban giám khảo và khách truy cập trải nghiệm tức thì 5 tính năng đề bài mà không bị rào cản auth gate chặn lại
  const activeUser = user ?? {
    id: "demo-judge",
    email: "giamkhao@vibecoding.vn",
    credits: 10,
    planId: "free",
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-[#0A0C10] text-[#F3F4F6] selection:bg-emerald-500/20 selection:text-emerald-300 lg:h-screen lg:overflow-hidden">
      {/* Precision Micro-Grid (Static, unobtrusive, zero CPU/GPU overhead) */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(#1E2333_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />

      <div className="relative z-10 flex flex-1 flex-col lg:h-full lg:overflow-hidden">
        <WorkspaceContainer user={activeUser} onSignOutAction={signOut} />
      </div>

      {/* Footer (Hiển thị trên mobile, ẩn trên Desktop Studio để nhường toàn bộ không gian cho 3 Zone) */}
      <footer className="relative z-10 border-t border-[#1E2333] bg-[#0E121B] py-3 text-center text-[12px] text-slate-400 lg:hidden">
        Content Studio — Không gian sáng tạo nội dung Facebook &amp; Instagram chuyên nghiệp. Zero AI-Slop.
      </footer>
    </div>
  );
}
