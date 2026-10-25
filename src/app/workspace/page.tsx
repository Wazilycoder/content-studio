import { redirect } from "next/navigation";
import { getUserProfile, signOut } from "@/app/auth/actions";
import WorkspaceContainer from "@/components/workspace/WorkspaceContainer";

export const dynamic = "force-dynamic";

export default async function WorkspacePage() {
  const user = await getUserProfile();

  if (!user) {
    redirect("/login?from=/workspace");
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--canvas)] text-[var(--ink-primary)] lg:h-screen lg:overflow-hidden">
      <WorkspaceContainer user={user} onSignOutAction={signOut} />

      {/* Footer (Hiển thị trên mobile, ẩn trên Desktop Studio để nhường không gian cho 3 cột độc lập) */}
      <footer className="border-t border-[var(--border-subtle)] bg-[var(--surface)] py-3 text-center text-[12px] text-[var(--ink-tertiary)] lg:hidden">
        Content Studio — Không gian sáng tạo nội dung Facebook &amp; Instagram chuyên nghiệp. Zero AI-Slop.
      </footer>
    </div>
  );
}
