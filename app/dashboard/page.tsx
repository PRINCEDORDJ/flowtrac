'use client'
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { BriefcaseBusiness, CircleCheckBig, Clock3, MoveRight, Users } from "lucide-react";
import { useContacts } from "@/context/ContactContext";
import { useSettings } from "@/context/SettingsContext";
import ContactDetails from "@/components/ContactDetails";

interface MetricCardProps {
    eyebrow: string;
    title: string;
    value: string;
    detail: string;
    icon: ReactNode;
    className?: string;
}

const MetricCard = ({ eyebrow, title, value, detail, icon, className = "" }: MetricCardProps) => (
    <article className={`rounded-3xl border border-red-950/60 bg-red-950/35 backdrop-blur-md ${className}`}>
        <div className="flex h-full flex-col gap-5 p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-red-300/70">{eyebrow}</p>
                    <h2 className="text-lg font-semibold text-zinc-100 sm:text-xl">{title}</h2>
                </div>
                <div className="rounded-2xl border border-red-900/70 bg-red-900/30 p-3 text-red-200">
                    {icon}
                </div>
            </div>
            <div className="space-y-2">
                <p className="text-3xl font-bold text-zinc-50 sm:text-4xl">{value}</p>
                <p className="text-sm leading-6 text-zinc-400">{detail}</p>
            </div>
        </div>
    </article>
);

export default function Dashboard() {
    const { contacts } = useContacts();
    const { settings } = useSettings();
    const [nowTimestamp] = useState(() => Date.now());

    const recentContacts = contacts.filter((contact) => {
        if (!contact.createdAt) {
            return false;
        }

        const createdAt = new Date(contact.createdAt).getTime();

        if (Number.isNaN(createdAt)) {
            return false;
        }

        const sevenDaysAgo = nowTimestamp - 7 * 24 * 60 * 60 * 1000;
        return createdAt >= sevenDaysAgo;
    });

    const companiesRepresented = new Set(
        contacts
            .map((contact) => contact.company.trim())
            .filter(Boolean)
            .map((company) => company.toLowerCase())
    ).size;

    const completeContacts = contacts.filter((contact) =>
        [contact.name, contact.email, contact.phone, contact.company].every((value) => value.trim() !== "")
    ).length;

    const healthScore = contacts.length === 0
        ? 0
        : Math.round((completeContacts / contacts.length) * 100);

    const totalContactsLabel = contacts.length === 0
        ? "Start building your people pipeline by adding the first contact."
        : contacts.length === 1
            ? "You have one active contact ready to manage."
            : `${contacts.length} contacts are available across your workspace.`;

    const getHours = () => {
        const hours = new Date().getHours();

        if (hours < 12) return "Good Morning";
        if (hours < 17) return "Good Afternoon";

        return "Good Evening";
    };

    return (
      <div className="w-full space-y-8 md:space-y-10">
        {settings.showDashboardGreeting ? (
          <div className="flex flex-col gap-3 px-1">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-red-300/60">Overview</p>
            <h1 className="text-3xl font-bold text-zinc-50 sm:text-4xl">{getHours()}</h1>
            <p className="max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
              Here&apos;s a quick view of your contact activity and data quality across {settings.workspaceName}.
            </p>
          </div>
        ) : null}

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 xl:gap-5">
          <article className="overflow-hidden rounded-[1.75rem] border border-red-900/60 bg-linear-to-br from-red-950/85 via-red-950/60 to-red-900/30 xl:col-span-2">
            <div className="flex h-full flex-col justify-between gap-8 p-6 sm:p-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-red-200/70">Total Contacts</p>
                  <div className="space-y-2">
                    <h2 className="text-4xl font-bold text-zinc-50 sm:text-5xl">{contacts.length}</h2>
                    <p className="max-w-xl text-sm leading-6 text-zinc-300 sm:text-base">{totalContactsLabel}</p>
                  </div>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-3xl border border-red-800/70 bg-black/10 text-red-100 shadow-[0_0_40px_rgba(127,29,29,0.35)]">
                  <Users size={28} />
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-sm text-red-200/80">
                  <Clock3 size={16} />
                  <span>{recentContacts.length} added in the last 7 days</span>
                </div>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 self-start rounded-full border border-red-700/80 bg-red-900/40 px-4 py-2 text-sm font-medium text-zinc-100 transition hover:bg-red-800/60"
                >
                  Open Contacts
                  <MoveRight size={16} />
                </Link>
              </div>
            </div>
          </article>

          <MetricCard
            eyebrow="Freshness"
            title="Recently Added"
            value={recentContacts.length.toString()}
            detail={recentContacts.length === 0 ? "No new contacts were added in the last week." : "Contacts added within the last 7 days."}
            icon={<Clock3 size={20} />}
          />

          <MetricCard
            eyebrow="Coverage"
            title="Companies Represented"
            value={companiesRepresented.toString()}
            detail={companiesRepresented === 0 ? "No company names have been captured yet." : "Unique companies across your saved contacts."}
            icon={<BriefcaseBusiness size={20} />}
          />

          <MetricCard
            eyebrow="Quality"
            title="Data Health"
            value={`${healthScore}%`}
            detail={contacts.length === 0 ? "Add contacts to begin tracking profile completeness." : `${completeContacts} of ${contacts.length} contacts have every field filled in.`}
            icon={<CircleCheckBig size={20} />}
            className="md:col-span-2 xl:col-span-1"
          />
            </section>
            <div>
                <ContactDetails />
            </div>
      </div>
    );
}
