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
    <div className="flex min-h-screen flex-col bg-[var(--canvas)] text-[var(--ink-primary)] lg:h-screen lg:overflow-hidden">
      <WorkspaceContainer user={activeUser} onSignOutAction={signOut} />

      {/* Footer (Hiển thị trên mobile, ẩn trên Desktop Studio để nhường không gian cho 3 cột độc lập) */}
      <footer className="border-t border-[var(--border-subtle)] bg-[var(--surface)] py-3 text-center text-[12px] text-[var(--ink-tertiary)] lg:hidden">
        Content Studio — Không gian sáng tạo nội dung Facebook &amp; Instagram chuyên nghiệp. Zero AI-Slop.
      </footer>
    </div>
  );
}
