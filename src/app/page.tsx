import Link from "next/link";
import { getUserProfile, signOut } from "@/app/auth/actions";
import WorkspaceContainer from "@/components/workspace/WorkspaceContainer";
import { Sparkles, LogOut, ArrowRight, Coins } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getUserProfile();

  return (
    <div className="min-h-screen bg-[#F8F8F6] text-[#18181B] flex flex-col">
      {/* Top Navigation */}
      <header className="border-b border-[#E4E4DE] bg-white sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#3B49DF] text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-semibold text-sm tracking-tight text-[#18181B]">
              Content Studio
            </span>
            <span className="hidden sm:inline-block text-[11px] font-medium text-[#71717A] bg-[#F1F1ED] px-2 py-0.5 rounded-md">
              v3.1 Cloud
            </span>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* Credit Badge */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F1F1ED] border border-[#E4E4DE] text-xs font-medium text-[#27272A]">
                  <Coins className="w-3.5 h-3.5 text-[#3B49DF]" />
                  <span>
                    <strong className="text-[#18181B]">{user.credits}</strong> lượt tạo
                  </span>
                </div>

                {/* User email */}
                <span className="hidden md:inline-block text-xs text-[#71717A]">
                  {user.email}
                </span>

                {/* Logout action */}
                <form action={signOut}>
                  <button
                    type="submit"
                    className="flex items-center gap-1 text-xs font-medium text-[#71717A] hover:text-[#DC2626] transition-colors p-1.5"
                    title="Đăng xuất"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Thoát</span>
                  </button>
                </form>
              </>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#3B49DF] hover:bg-[#2F3CBF] rounded-lg transition-colors shadow-xs"
              >
                <span>Đăng nhập</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 w-full">
        <WorkspaceContainer user={user} />
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E4E4DE] bg-white py-4 text-center text-xs text-[#A1A1AA]">
        Content Studio — Thiết kế theo chuẩn Editorial SaaS & Karpathy Discipline. Zero AI-Slop.
      </footer>
    </div>
  );
}
