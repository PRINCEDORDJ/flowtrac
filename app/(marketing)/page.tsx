import Link from "next/link";
import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import { ArrowRight, BriefcaseBusiness, CircleCheckBig, Clock3, MoveRight, Users, Zap } from "lucide-react";
import type { ReactNode } from "react";

export default async function Home() {
  const { isAuthenticated } = getKindeServerSession();
  
  if (await isAuthenticated()) {
    redirect("/dashboard");
  }

  return (
    <div className="relative min-h-screen bg-[rgb(16,12,12)] text-white selection:bg-red-500/30">
      <Navbar />
      
      {/* Background Decor */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-red-900/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-red-800/10 blur-[120px]" />
      </div>

      <main className="relative z-10 mx-auto max-w-7xl px-6 pt-32 pb-24 lg:pt-48">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-red-300">
            <Zap size={14} className="fill-red-300" />
            <span>Built for Speed & Efficiency</span>
          </div>
          
          <h1 className="max-w-4xl bg-linear-to-b from-white via-white to-white/50 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-7xl lg:text-8xl">
            Track your Workflow <br className="hidden sm:block" /> with Precision
          </h1>
          
          <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-400 sm:text-xl">
            The all-in-one platform to manage your contacts, automate your invoicing, and scale your business without the friction.
          </p>
          
          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row">
            <RegisterLink className="group relative flex items-center gap-2 rounded-full bg-linear-to-b from-red-600 to-red-800 px-8 py-4 font-bold shadow-[0_0_40px_rgba(220,38,38,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_60px_rgba(220,38,38,0.5)]">
              Start Building Now
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </RegisterLink>
            <Link href="#features" className="rounded-full border border-white/10 bg-white/5 px-8 py-4 font-bold transition hover:bg-white/10">
              See How It Works
            </Link>
          </div>
        </div>

        {/* Brand/Social Proof Mock */}
        <div className="mt-24 border-y border-white/5 py-12">
          <p className="text-center text-sm font-medium uppercase tracking-[0.3em] text-zinc-500">Trusted by modern teams</p>
          <div className="mt-8 flex flex-wrap justify-center gap-8 opacity-40 grayscale filter lg:gap-16">
            <div className="text-2xl font-bold">FLOW</div>
            <div className="text-2xl font-bold">PRECISION</div>
            <div className="text-2xl font-bold">CORE</div>
            <div className="text-2xl font-bold">VELOCITY</div>
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="mt-32 space-y-24">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard 
              icon={<Users className="text-red-400" />}
              title="Contact Management"
              description="Keep your people pipeline organized with a powerful, searchable contact database tailored for your workflow."
            />
            <FeatureCard 
              icon={<BriefcaseBusiness className="text-red-400" />}
              title="Invoice Lifecycle"
              description="From draft to paid, track every invoice. Automate tax calculations and currency adjustments seamlessly."
            />
            <FeatureCard 
              icon={<CircleCheckBig className="text-red-400" />}
              title="Data Quality"
              description="In-depth health scoring for your records. Never lose track of missing client details again."
            />
          </div>

          <div className="rounded-3xl border border-white/5 bg-linear-to-b from-white/5 to-transparent p-8 lg:p-12">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white">Real-time Insights</h2>
                <p className="text-lg leading-relaxed text-zinc-400">
                  Our dashboard gives you an instant overview of your business health. Monitor freshness, coverage, and total impact with beautifully rendered analytics.
                </p>
                <ul className="space-y-4 text-zinc-300">
                  <li className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-900/30 text-red-400">
                      <MoveRight size={14} />
                    </div>
                    Automated tracking of recent activity
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-900/30 text-red-400">
                      <MoveRight size={14} />
                    </div>
                    Unique company representation analytics
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-900/30 text-red-400">
                      <MoveRight size={14} />
                    </div>
                    Smart data health indicators
                  </li>
                </ul>
              </div>
              <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl">
                 <div className="absolute inset-0 bg-linear-to-br from-red-600/20 to-transparent" />
                 <div className="flex h-full items-center justify-center text-zinc-600 font-mono text-xs">
                    [Preview: Dashboard Visualization]
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="mt-32 flex flex-col items-center rounded-3xl bg-linear-to-br from-red-900/40 via-red-950/20 to-black p-12 text-center border border-red-900/30">
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl text-white">Ready to elevate your workflow?</h2>
          <p className="mt-6 max-w-xl text-lg text-zinc-400">
             Join hundreds of developers and businesses using FlowTrack to manage their operations with precision.
          </p>
          <div className="mt-10">
            <RegisterLink className="rounded-full bg-white px-10 py-5 text-lg font-bold text-black transition hover:bg-zinc-200">
              Create Free Account
            </RegisterLink>
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-7xl px-6 py-12 text-center text-sm text-zinc-500 border-t border-white/5">
        <p>&copy; {new Date().getFullYear()} FlowTrack. All rights reserved.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: ReactNode, title: string, description: string }) {
  return (
    <div className="group rounded-3xl border border-white/5 bg-white/2 bg-linear-to-b from-white/5 to-transparent p-8 transition hover:border-red-900/50 hover:bg-white/5">
      <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-red-400 transition group-hover:bg-red-900/20">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <p className="mt-4 leading-relaxed text-zinc-400">{description}</p>
    </div>
  );
}