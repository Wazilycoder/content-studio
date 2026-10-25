import { getUserProfile, signOut } from "@/app/auth/actions";
import WorkspaceContainer from "@/components/workspace/WorkspaceContainer";

export const dynamic = "force-dynamic";

export default async function WorkspacePage() {
  const user = await getUserProfile();

  return (
    <div className="flex min-h-screen flex-col bg-[var(--canvas)] text-[var(--ink-primary)]">
      <WorkspaceContainer user={user} onSignOutAction={signOut} />

      {/* Footer */}
      <footer className="border-t border-[var(--border-subtle)] bg-[var(--surface)] py-4 text-center text-[12px] text-[var(--ink-tertiary)]">
        Content Studio — Không gian sáng tạo nội dung Facebook &amp; Instagram chuyên nghiệp. Zero AI-Slop.
      </footer>
    </div>
  );
}
