"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Settings, 
  FolderGit2, 
  Users, 
  ListTodo, 
  Briefcase, 
  MessageCircleQuestion, 
  Image as ImageIcon,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useEffect, useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Datos del Sitio", href: "/admin/site", icon: Settings },
  { name: "Proyectos", href: "/admin/projects", icon: FolderGit2 },
  { name: "Equipo", href: "/admin/team", icon: Users },
  { name: "Servicios", href: "/admin/services", icon: Briefcase },
  { name: "Proceso", href: "/admin/process", icon: ListTodo },
  { name: "FAQs", href: "/admin/faqs", icon: MessageCircleQuestion },
  { name: "Media", href: "/admin/media", icon: ImageIcon },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setUser(data.user))
      .catch(() => router.push("/admin/login"));
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="flex h-screen bg-neutral-950 font-sans overflow-hidden">
      {/* Sidebar Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-ink/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform flex-col bg-ink text-paper transition-transform duration-300 ease-in-out lg:static lg:flex lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0 flex" : "-translate-x-full hidden"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-white/10">
          <span className="text-lg font-extrabold tracking-tight text-brand">ZainSoft Admin</span>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5 text-paper/70 hover:text-paper" />
          </button>
        </div>
        
        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-brand text-white"
                    : "text-paper/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 ${
                    isActive ? "text-white" : "text-paper/50 group-hover:text-white"
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {user && (
          <div className="border-t border-white/10 p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand font-bold text-white">
                {user.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="truncate text-sm font-bold text-white">{user.name}</p>
                <p className="truncate text-xs text-paper/50">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-4 flex w-full items-center justify-center rounded-lg border border-white/10 px-3 py-2 text-sm font-medium text-paper/70 transition-colors hover:bg-white/5 hover:text-white"
            >
              <LogOut className="mr-2 h-4 w-4" /> Cerrar Sesión
            </button>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-4 border-b border-white/10 bg-ink px-4 shadow-sm sm:gap-6 sm:px-6 lg:px-8">
          <button
            className="text-white/70 hover:text-white lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex flex-1 items-center justify-end gap-x-4 self-stretch lg:gap-x-6">
            {/* Header Content can go here */}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-neutral-950 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
