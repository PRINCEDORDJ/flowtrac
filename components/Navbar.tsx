import Link from "next/link";
import { RegisterLink, LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/20 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-linear-to-br from-red-500 to-red-900 shadow-[0_0_20px_rgba(239,68,68,0.3)]" />
          <span className="text-xl font-bold tracking-tight text-white">FlowTrack</span>
        </Link>
        
        <div className="flex items-center gap-6">
          <Link href="/#features" className="text-sm font-medium text-zinc-400 transition hover:text-white">
            Features
          </Link>
          <div className="h-4 w-px bg-white/10" />
          <LoginLink className="text-sm font-medium text-zinc-400 transition hover:text-white">
            Log in
          </LoginLink>
          <RegisterLink className="rounded-full bg-white px-5 py-2 text-sm font-bold text-black transition hover:bg-zinc-200">
            Get Started
          </RegisterLink>
        </div>
      </div>
    </nav>
  );
}
