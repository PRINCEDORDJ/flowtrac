'use client'
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, ReceiptText, Settings, LogOut, Menu as MenuIcon, X } from "lucide-react";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import Image from 'next/image'
import Logo from '@/public/flow.png';

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/contact",
    label: "Contacts",
    icon: Users,
  },
  {
    href: "/invoice",
    label: "Invoices",
    icon: ReceiptText,
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
  },
];

export default function DashboardSidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
      <aside className={`sticky top-0 z-30 mx-2 my-2 overflow-hidden rounded-[2rem] border border-red-950/60 transition-all duration-300 backdrop-blur-xl ${
        isOpen ? "bg-red-950/90" : "bg-linear-to-b from-red-950/75 via-red-950/55 to-black/35"
      } shadow-[0_24px_80px_rgba(0,0,0,0.3)] md:h-[calc(100vh-1rem)] md:w-[18rem] md:min-w-[18rem] md:bg-linear-to-b`}>
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-red-400/60 to-transparent" />

        <div className="flex flex-col h-full px-4 py-4 sm:px-5 sm:py-5 md:px-5 md:py-6 text-zinc-50">
          {/* Mobile Header & Desktop Logo */}
          <div className="flex items-center justify-between px-2 mb-2 md:mb-5">
            <Link href="/dashboard" className="flex items-center gap-3 group transition-all" onClick={() => setIsOpen(false)}>
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-800/50 bg-red-950/40 p-2 shadow-[0_0_20px_rgba(153,27,27,0.2)] transition-all group-hover:border-red-600/80 group-hover:shadow-[0_0_30px_rgba(153,27,27,0.4)]">
                  <Image src={Logo} width={40} height={40} alt="FT"/>
              </div>
              <span className="text-xl font-bold tracking-tight bg-linear-to-b from-zinc-50 to-zinc-400 bg-clip-text text-transparent group-hover:from-white group-hover:to-zinc-200">
                  flowtrack
              </span>
            </Link>

            {/* Mobile Toggle Button */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-800/50 bg-red-950/40 text-red-200 md:hidden hover:border-red-600/80 transition-all"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={20} /> : <MenuIcon size={20} />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className={`flex w-full flex-col gap-2 transition-all duration-300 ease-in-out md:flex md:flex-1 ${
            isOpen ? "max-h-[500px] opacity-100 mt-4 pb-4" : "max-h-0 opacity-0 md:max-h-none md:opacity-100 overflow-hidden md:overflow-visible"
          }`}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`group flex items-center gap-3 rounded-[1.4rem] border px-4 py-4 transition ${
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
                    <p className="truncate text-base font-semibold">
                      {item.label}
                    </p>
                  </div>
                </Link>
              );
            })}

            <div className="mt-auto pt-2 md:pt-0">
              <LogoutLink className="group flex items-center gap-3 rounded-[1.5rem] border border-red-950/60 bg-black/10 px-4 py-4 transition hover:bg-red-950/30">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-950/60 bg-red-950/35 text-red-200 group-hover:border-red-800/70">
                  <LogOut size={16} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-zinc-400 group-hover:text-red-300">
                    Logout
                  </p>
                </div>
              </LogoutLink>
            </div>
          </nav>
        </div>
      </aside>
    );
}

