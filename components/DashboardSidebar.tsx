'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, ReceiptText, Settings, LogOut } from "lucide-react";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    eyebrow: "Overview",
  },
  {
    href: "/contact",
    label: "Contacts",
    icon: Users,
    eyebrow: "People",
  },
  {
    href: "/invoice",
    label: "Invoices",
    icon: ReceiptText,
    eyebrow: "Billing",
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
    eyebrow: "Workspace",
  },
];

export default function DashboardSidebar() {
    const pathname = usePathname();

    return (
      <aside className="sticky top-0 z-30 mx-2 my-2 overflow-hidden rounded-[2rem] border border-red-950/60 bg-linear-to-b from-red-950/75 via-red-950/55 to-black/35 shadow-[0_24px_80px_rgba(0,0,0,0.3)] backdrop-blur-xl md:h-[calc(100vh-1rem)] md:w-[18rem] md:min-w-[18rem]">
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-red-400/60 to-transparent" />

        <div className="flex h-full flex-col gap-5 px-4 py-4 sm:px-5 sm:py-5 md:px-5 md:py-6">
          <div className="rounded-[1.5rem] border border-red-900/60 bg-black/10 px-4 py-4">
            <div className="space-y-2">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-red-300/60">
                Flowtrack
              </p>
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-zinc-50">Control Panel</h1>
                <p className="text-sm leading-6 text-zinc-400">
                  Navigate your workspace, contacts, and dashboard activity in one place.
                </p>
              </div>
            </div>
          </div>

          <nav className="flex w-full flex-row flex-wrap gap-2 md:flex-1 md:flex-col md:flex-nowrap">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex min-w-[9.25rem] flex-1 items-center gap-3 rounded-[1.4rem] border px-3 py-3 transition sm:min-w-[10rem] md:min-w-0 md:flex-none md:px-4 md:py-4 ${
                    isActive
                      ? "border-red-700/80 bg-red-900/45 text-zinc-50 shadow-[0_12px_30px_rgba(127,29,29,0.28)]"
                      : "border-red-950/50 bg-black/10 text-zinc-300 hover:border-red-800/70 hover:bg-red-950/30 hover:text-zinc-100"
                  }`}
                >
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${
                    isActive
                      ? "border-red-600/80 bg-red-800/40 text-red-100"
                      : "border-red-950/60 bg-red-950/35 text-red-200 group-hover:border-red-800/70"
                  }`}>
                    <Icon size={18} />
                  </div>

                  <div className="min-w-0">
                    <p className={`text-[0.65rem] font-semibold uppercase tracking-[0.28em] ${
                      isActive ? "text-red-200/75" : "text-red-300/55"
                    }`}>
                      {item.eyebrow}
                    </p>
                    <p className="truncate text-sm font-semibold sm:text-base">
                      {item.label}
                    </p>
                  </div>
                </Link>
              );
            })}
          </nav>

          <LogoutLink className="group flex items-center gap-3 rounded-[1.5rem] border border-red-950/60 bg-black/10 px-4 py-4 transition hover:bg-red-950/30">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-950/60 bg-red-950/35 text-red-200 group-hover:border-red-800/70">
              <LogOut size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-red-300/55">
                Account
              </p>
              <p className="truncate text-sm font-semibold text-zinc-400 group-hover:text-red-300">
                Logout
              </p>
            </div>
          </LogoutLink>
        </div>
      </aside>
    );
}
