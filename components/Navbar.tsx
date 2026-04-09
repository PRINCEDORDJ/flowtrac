'use client'
import Link from "next/link"
import { Home, NotebookText, SettingsIcon, User } from "lucide-react";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/",
    label: "Home",
    icon: Home,
    eyebrow: "Overview",
  },
  {
    href: "/contact",
    label: "Contact",
    icon: User,
    eyebrow: "People",
  },
  {
    href: "/invoice",
    label: "Invoice",
    icon: NotebookText,
    eyebrow: "Billing",
  },
  {
    href: "/settings",
    label: "Settings",
    icon: SettingsIcon,
    eyebrow: "Workspace",
  },
];

export default function Navbar() {
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

          <div className="hidden rounded-[1.5rem] border border-red-950/60 bg-black/10 px-4 py-4 md:block">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-red-300/55">
              Workspace
            </p>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Keep your contacts current and your dashboard metrics ready at a glance.
            </p>
          </div>
        </div>
      </aside>
    );
}
