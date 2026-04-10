"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Eye, EyeOff, Loader2, Zap } from "lucide-react";

const G_ID  = process.env.NEXT_PUBLIC_KINDE_GOOGLE_CONNECTION_ID;
const GH_ID = process.env.NEXT_PUBLIC_KINDE_GITHUB_CONNECTION_ID;
const AP_ID = process.env.NEXT_PUBLIC_KINDE_APPLE_CONNECTION_ID;

function socialHref(base: string, id?: string) {
  return id ? `${base}?connection_id=${id}` : base;
}

export default function RegisterPage() {
  const [email, setEmail]       = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const params = new URLSearchParams();
    if (email) params.set("login_hint", email);
    const qs = params.toString();
    window.location.href = `/api/auth/register${qs ? "?" + qs : ""}`;
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <head>
        <title>Create Account | FlowTrack</title>
        <meta property="og:site_name" content="FlowTrack" />
        <meta property="description" content="Join FlowTrack today and start managing your workspace with ease." />
      </head>

      {/* Logo */}
      <div className="mb-8 flex flex-col items-center gap-2">
        <Link href="/" className="flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-red-900 shadow-lg shadow-red-900/40 transition-transform hover:scale-105 active:scale-95">
            <Zap size={22} className="fill-white text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">FlowTrack</span>
        </Link>
      </div>

      {/* Card */}
      <div className="rounded-3xl border border-white/8 bg-white/3 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white tracking-tight">Create your account</h1>
          <p className="mt-1.5 text-sm text-zinc-400">
            Start tracking your workflow for free — no credit card required
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="register-email" className="mb-1.5 block text-xs font-medium text-zinc-400">
              Work email
            </label>
            <input
              id="register-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full rounded-xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none ring-red-500/40 transition focus:border-red-500/40 focus:ring-2 focus:bg-white/8"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="register-pass" className="mb-1.5 block text-xs font-medium text-zinc-400">
              Password
            </label>
            <div className="relative">
              <input
                id="register-pass"
                type={showPass ? "text" : "password"}
                placeholder="Min. 8 characters"
                className="w-full rounded-xl border border-white/8 bg-white/5 px-4 py-3 pr-12 text-sm text-white placeholder-zinc-600 outline-none ring-red-500/40 transition focus:border-red-500/40 focus:ring-2 focus:bg-white/8"
              />
              <button
                type="button"
                onClick={() => setShowPass((p) => !p)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 transition hover:text-zinc-300"
                tabIndex={-1}
                aria-label="Toggle password visibility"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Terms */}
          <p className="text-xs leading-relaxed text-zinc-600">
            By creating an account, you agree to our{" "}
            <span className="cursor-pointer text-zinc-400 underline underline-offset-2 transition hover:text-white">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="cursor-pointer text-zinc-400 underline underline-offset-2 transition hover:text-white">
              Privacy Policy
            </span>
            .
          </p>

          {/* Submit */}
          <button
            id="register-submit-btn"
            type="submit"
            disabled={loading || !email}
            className="group mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-red-600 to-red-800 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-900/30 transition-all hover:brightness-110 hover:shadow-red-900/50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                Get Started Free
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/8" />
          <span className="text-xs text-zinc-600">or continue with</span>
          <div className="h-px flex-1 bg-white/8" />
        </div>

        {/* Social icon row */}
        <div className="flex items-center justify-center gap-3">
          <SocialBtn
            id="register-google-btn"
            href={socialHref("/api/auth/register", G_ID)}
            label="Sign up with Google"
            icon={<GoogleIcon />}
          />
          <SocialBtn
            id="register-github-btn"
            href={socialHref("/api/auth/register", GH_ID)}
            label="Sign up with GitHub"
            icon={<GitHubIcon />}
          />
          <SocialBtn
            id="register-apple-btn"
            href={socialHref("/api/auth/register", AP_ID)}
            label="Sign up with Apple"
            icon={<AppleIcon />}
          />
        </div>
      </div>

      {/* Footer */}
      <p className="mt-6 text-center text-sm text-zinc-500">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-red-400 transition hover:text-red-300 decoration-red-400/30 hover:underline hover:underline-offset-4">
          Sign in
        </Link>
      </p>
    </div>
  );
}

/* ── Reusable icon button ─────────────────────────────────────────── */
function SocialBtn({
  id,
  href,
  label,
  icon,
}: {
  id: string;
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      id={id}
      href={href}
      aria-label={label}
      title={label}
      className="group flex h-11 w-11 items-center justify-center rounded-xl border border-white/8 bg-white/4 transition hover:border-white/20 hover:bg-white/10 hover:scale-105 active:scale-95"
    >
      {icon}
    </a>
  );
}

/* ── SVG Icons ────────────────────────────────────────────────────── */
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
      <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05" />
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 6.294C4.672 4.167 6.656 3.58 9 3.58z" fill="#EA4335" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-white" aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-white" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}
