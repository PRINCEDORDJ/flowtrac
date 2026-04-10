'use client'
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { BadgeDollarSign, BriefcaseBusiness, CircleCheckBig, Clock3, MoveRight, Plus, ReceiptText, Users } from "lucide-react";
import { useContacts } from "@/context/ContactContext";
import { useSettings } from "@/context/SettingsContext";
import { useInvoices } from "@/context/InvoiceContext";
import ContactDetails from "@/components/ContactDetails";

interface MetricCardProps {
    title: string;
    value: string;
    icon: ReactNode;
    description?: string;
    className?: string;
}

const MetricCard = ({ title, value, icon, description, className = "" }: MetricCardProps) => (
    <article className={`group relative overflow-hidden rounded-[2rem] border border-red-950/60 bg-linear-to-br from-red-950/40 via-red-950/10 to-transparent p-6 transition-all duration-500 hover:-translate-y-1 hover:border-red-500/40 hover:bg-red-950/30 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] ${className}`}>
        <div className="absolute inset-0 translate-x-[-100%] bg-linear-to-r from-transparent via-red-500/5 to-transparent transition-transform duration-1000 group-hover:translate-x-[100%]" />
        
        <div className="relative flex h-full flex-col gap-5">
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-red-400 group-hover:text-red-300">{title}</h2>
                    {description && <p className="text-xs text-zinc-500">{description}</p>}
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-900/40 bg-linear-to-br from-red-600/10 to-red-950/50 text-red-400 shadow-inner group-hover:border-red-500/50 group-hover:text-red-300">
                    {icon}
                </div>
            </div>
            <div className="mt-auto">
                <p className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{value}</p>
            </div>
        </div>
    </article>
);

export default function Dashboard() {
    const { contacts, isLoading: contactsLoading } = useContacts();
    const { invoices, isLoading: invoicesLoading } = useInvoices();
    const { settings, isLoading: settingsLoading } = useSettings();
    const [nowTimestamp] = useState(() => Date.now());

    if (contactsLoading || settingsLoading || invoicesLoading) {
        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
                <div className="relative">
                    <div className="h-16 w-16 animate-spin rounded-full border-4 border-red-950 border-t-red-500" />
                    <div className="absolute inset-0 animate-pulse rounded-full bg-red-500/10 blur-xl" />
                </div>
                <p className="text-sm font-medium tracking-widest uppercase text-red-400/60 animate-pulse">Synchronizing Workspace</p>
            </div>
        );
    }

    const recentContacts = contacts.filter((contact) => {
        if (!contact.createdAt) return false;
        const createdAt = new Date(contact.createdAt).getTime();
        if (Number.isNaN(createdAt)) return false;
        const sevenDaysAgo = nowTimestamp - 7 * 24 * 60 * 60 * 1000;
        return createdAt >= sevenDaysAgo;
    });

    const companiesRepresented = new Set(
        contacts
            .map((contact) => contact.company.trim())
            .filter(Boolean)
            .map((company) => company.toLowerCase())
    ).size;

    const healthScore = contacts.length === 0
        ? 0
        : Math.round((contacts.filter(c => c.name && c.email && c.phone).length / contacts.length) * 100);

    // Billing Summary Calculations
    const totalRevenue = invoices
        .filter(inv => inv.status === 'paid')
        .reduce((sum, inv) => sum + inv.total, 0);
    
    const openInvoices = invoices
        .filter(inv => inv.status !== 'paid')
        .length;

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: settings.defaultCurrency || "USD",
        }).format(amount);

    const getHours = () => {
        const hours = new Date().getHours();
        if (hours < 12) return "Good Morning";
        if (hours < 17) return "Good Afternoon";
        return "Good Evening";
    };

    return (
      <div className="w-full space-y-8 pb-10 md:space-y-12">
        {/* Dynamic Hero Section */}
        <section className="relative overflow-hidden rounded-[2.5rem] border border-red-950/50 bg-linear-to-b from-red-950/30 via-red-950/15 to-transparent p-8 sm:p-12">
            <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-red-600/5 blur-[120px]" />
            <div className="absolute -left-24 -bottom-24 h-96 w-96 rounded-full bg-black/40 blur-[100px]" />
            
            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-4">
                    {settings.showDashboardGreeting && (
                        <div className="inline-flex items-center gap-2 rounded-full border border-red-900/30 bg-red-950/40 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.3em] text-red-400">
                             <span className="flex h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                             Workspace Live
                        </div>
                    )}
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                            {getHours()}, <span className="text-red-500">{settings.workspaceName.split(' ')[0]}</span>
                        </h1>
                        <p className="max-w-2xl text-sm leading-7 text-zinc-400 sm:text-lg">
                            Track your people activity, billing flow, and workspace health directly from your unified command center.
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4">
                    <Link href="/contact" className="group flex items-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-bold text-black transition-all hover:scale-[1.02] active:scale-95">
                        <Plus size={18} />
                        Add Contact
                    </Link>
                    <Link href="/invoice/Add" className="group flex items-center gap-2 rounded-2xl border border-red-900/40 bg-red-950/50 px-6 py-4 text-sm font-bold text-white backdrop-blur-md transition-all hover:bg-red-900/30 active:scale-95">
                        <ReceiptText size={18} />
                        New Invoice
                    </Link>
                </div>
            </div>
        </section>

        {/* Actionable Insights Grid */}
        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
                title="Total Revenue"
                value={formatCurrency(totalRevenue)}
                icon={<BadgeDollarSign size={24} />}
                description="Collected payments"
                className="lg:col-span-1"
            />
            <MetricCard
                title="Active Clients"
                value={companiesRepresented.toString()}
                icon={<BriefcaseBusiness size={24} />}
                description="Across industries"
                className="lg:col-span-1"
            />
            <MetricCard
                title="Open Invoices"
                value={openInvoices.toString()}
                icon={<ReceiptText size={24} />}
                description="Pending collection"
                className="lg:col-span-1"
            />
            <MetricCard
                title="Data Health"
                value={`${healthScore}%`}
                icon={<CircleCheckBig size={24} />}
                description="Profile completion"
                className="lg:col-span-1"
            />
        </section>

        {/* Featured Network Area */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
                <ContactDetails />
            </div>
            <div className="space-y-6">
                <article className="relative overflow-hidden rounded-[2.5rem] border border-red-950/60 bg-linear-to-b from-red-950/40 to-black/40 p-8 shadow-2xl">
                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center justify-between">
                             <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
                                <Users size={24} />
                             </div>
                             <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Pipeline</span>
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-4xl font-bold text-white">{contacts.length}</h2>
                            <p className="text-sm font-medium text-zinc-400">Total contacts in your workspace</p>
                        </div>
                        <div className="h-px w-full bg-linear-to-r from-red-900/50 to-transparent" />
                        <div className="flex items-center gap-3 text-xs text-red-400">
                            <Clock3 size={14} />
                            <span>{recentContacts.length} new connections this week</span>
                        </div>
                        <Link href="/contact" className="group flex items-center justify-between rounded-xl bg-red-950/50 p-4 transition-all hover:bg-red-900/20">
                            <span className="text-sm font-bold text-white">Full Directory</span>
                            <MoveRight size={18} className="transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </article>

                <div className="rounded-[2.5rem] border border-red-950/60 bg-black/20 p-8">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-red-500 mb-4">Quick Stats</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-zinc-400">Paid Invoices</span>
                            <span className="text-sm font-bold text-white">{invoices.filter(i => i.status === 'paid').length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-zinc-400">Total Companies</span>
                            <span className="text-sm font-bold text-white">{companiesRepresented}</span>
                        </div>
                         <div className="flex items-center justify-between">
                            <span className="text-sm text-zinc-400">Avg. Health</span>
                            <span className="text-sm font-bold text-white">{healthScore}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
}

