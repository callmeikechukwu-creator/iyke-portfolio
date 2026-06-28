import { getSessionAdminId } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FolderKanban, Mail, Image as ImageIcon, LogOut, Shield } from "lucide-react";
import LogoutButton from "./LogoutButton";

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
}

export default async function AdminDashboardLayout({ children }: AdminDashboardLayoutProps) {
  // 1. Perform server-side authentication check
  const adminId = await getSessionAdminId();
  if (!adminId) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col md:flex-row selection:bg-orange/20 selection:text-ink">
      
      {/* 1. Sidebar Panel */}
      <aside className="w-full md:w-64 bg-ink text-cream p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5 md:sticky md:h-screen md:top-0 select-none">
        <div className="flex flex-col gap-8">
          
          {/* Header Title */}
          <div className="flex items-center gap-2 pb-6 border-b border-white/10">
            <Shield className="w-5 h-5 text-orange animate-pulse" />
            <span className="font-display font-bold tracking-tight text-lg">
              System Console
            </span>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
            <Link
              href="/admin/projects"
              className="flex items-center gap-2.5 px-4 py-3 hover:bg-white/5 hover:text-orange transition-all duration-300 rounded-xl text-sm font-semibold whitespace-nowrap"
            >
              <FolderKanban className="w-4 h-4 text-orange" />
              Projects CRUD
            </Link>
            <Link
              href="/admin/messages"
              className="flex items-center gap-2.5 px-4 py-3 hover:bg-white/5 hover:text-orange transition-all duration-300 rounded-xl text-sm font-semibold whitespace-nowrap"
            >
              <Mail className="w-4 h-4 text-blue" />
              Client Inbox
            </Link>
            <Link
              href="/admin/media"
              className="flex items-center gap-2.5 px-4 py-3 hover:bg-white/5 hover:text-orange transition-all duration-300 rounded-xl text-sm font-semibold whitespace-nowrap"
            >
              <ImageIcon className="w-4 h-4 text-orange" />
              Media Uploader
            </Link>
          </nav>
        </div>

        {/* Footer Logout */}
        <div className="mt-6 md:mt-0 pt-4 border-t border-white/10 flex items-center justify-between md:flex-col md:items-stretch gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-muted font-bold font-body">Authorized As</span>
            <span className="text-xs text-cream/70 font-semibold font-body truncate max-w-[120px] md:max-w-none">
              Admin Session
            </span>
          </div>
          <LogoutButton />
        </div>

      </aside>

      {/* 2. Main Content Workspace */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto max-w-7xl">
        <div className="bg-white min-h-[calc(100vh-6rem)] md:min-h-[calc(100vh-6rem)] p-6 md:p-8 rounded-3xl border border-ink/5 shadow-sm">
          {children}
        </div>
      </main>

    </div>
  );
}
