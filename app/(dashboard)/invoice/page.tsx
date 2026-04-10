'use client'
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { AlertTriangle, BadgeDollarSign, FileSpreadsheet, Filter, FolderPen, Plus, ReceiptText, Trash2, MoveRight } from "lucide-react";
import { useInvoices, type Invoice, type InvoiceStatus } from "@/context/InvoiceContext";
import { useSettings } from "@/context/SettingsContext";

type InvoiceFilter = "all" | InvoiceStatus;

interface InvoiceCardProps {
    title: string;
    value: string;
    icon: ReactNode;
}

const formatCurrency = (amount: number, currency: string) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency || "USD",
        maximumFractionDigits: 2,
    }).format(amount);

const formatDate = (date: string) => {
    if (!date) return "No date";
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return "No date";

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(parsedDate);
};

const getEffectiveStatus = (invoice: Invoice, todayString: string): InvoiceStatus => {
    if (invoice.status === "paid") return "paid";
    if (invoice.dueDate && invoice.dueDate < todayString) return "overdue";
    return invoice.status;
};

const getStatusPillClassName = (status: InvoiceStatus) => {
    switch (status) {
        case "paid":
            return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
        case "sent":
            return "border-sky-500/30 bg-sky-500/10 text-sky-400";
        case "overdue":
            return "border-amber-500/30 bg-amber-500/10 text-amber-400";
        default:
            return "border-red-500/30 bg-red-500/10 text-red-400";
    }
};

const InvoiceCard = ({ title, value, icon }: InvoiceCardProps) => (
    <article className="group relative overflow-hidden rounded-[2rem] border border-red-950/60 bg-linear-to-br from-red-950/40 via-red-950/10 to-transparent p-6 transition-all duration-500 hover:-translate-y-1 hover:border-red-500/40 hover:bg-red-950/30 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]">
        <div className="absolute inset-0 translate-x-[-100%] bg-linear-to-r from-transparent via-red-500/5 to-transparent transition-transform duration-1000 group-hover:translate-x-[100%]" />
        
        <div className="relative flex h-full flex-col gap-5">
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-red-400 group-hover:text-red-300">{title}</h2>
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

export default function InvoicePage() {
    const { invoices, deleteInvoice, isLoading: invoicesLoading } = useInvoices();
    const { settings, isLoading: settingsLoading } = useSettings();
    const [filter, setFilter] = useState<InvoiceFilter>("all");
    const [todayString] = useState(() => new Date().toISOString().slice(0, 10));

    if (invoicesLoading || settingsLoading) {
        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
                <div className="relative">
                    <div className="h-16 w-16 animate-spin rounded-full border-4 border-red-950 border-t-red-500" />
                    <div className="absolute inset-0 animate-pulse rounded-full bg-red-500/10 blur-xl" />
                </div>
                <p className="text-sm font-medium tracking-widest uppercase text-red-400/60 animate-pulse">Synchronizing Billing</p>
            </div>
        );
    }

    const dueSoonCutoff = new Date(new Date(todayString).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const invoicesWithStatus = invoices.map((invoice) => ({
        ...invoice,
        effectiveStatus: getEffectiveStatus(invoice, todayString),
    }));

    const filteredInvoices = invoicesWithStatus.filter((invoice) =>
        filter === "all" ? true : invoice.effectiveStatus === filter
    );

    const openInvoicesCount = invoicesWithStatus.filter((invoice) => invoice.effectiveStatus !== "paid").length;
    const paidRevenue = invoicesWithStatus.filter((invoice) => invoice.effectiveStatus === "paid").reduce((sum, invoice) => sum + invoice.total, 0);
    const overdueInvoices = invoicesWithStatus.filter((invoice) => invoice.effectiveStatus === "overdue").length;

    return (
        <div className="relative w-full space-y-8 pb-10 md:space-y-12">
            {/* Page Header */}
            <section className="relative overflow-hidden rounded-[2.5rem] border border-red-950/50 bg-linear-to-b from-red-950/30 via-red-950/15 to-transparent p-6 sm:p-10">
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-red-600/5 blur-[100px]" />
          
                <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 rounded-full border border-red-900/30 bg-red-950/40 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-red-400">
                            <ReceiptText size={12} />
                            Billing Center
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                            Invoice <span className="text-red-500">Manager</span>
                        </h1>
                        <p className="max-w-2xl text-sm leading-7 text-zinc-400">
                            Track revenue streams, manage collections, and maintain detailed billing records for all your clients.
                        </p>
                    </div>

                    <Link
                        href="/invoice/Add"
                        className="group relative flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-sm font-bold text-black transition-all hover:scale-[1.02] active:scale-95"
                    >
                        <Plus size={18} />
                        New Invoice
                    </Link>
                </div>
            </section>

            {/* Global Billing Stats */}
            <section className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
                <InvoiceCard title="Total Volume" value={String(invoicesWithStatus.length)} icon={<ReceiptText size={20} />} />
                <InvoiceCard title="Open Billing" value={String(openInvoicesCount)} icon={<FolderPen size={20} />} />
                <InvoiceCard title="Total Collected" value={formatCurrency(paidRevenue, settings.defaultCurrency)} icon={<BadgeDollarSign size={20} />} />
                <InvoiceCard title="Overdue Items" value={String(overdueInvoices)} icon={<AlertTriangle size={20} />} />
            </section>

            {/* Main Content Layout */}
            <div className="grid gap-8 lg:grid-cols-3">
                {/* Activity Feed */}
                <div className="relative space-y-6 lg:col-span-2">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-xl font-bold text-white">Invoice Activity</h2>
                        <div className="flex flex-wrap gap-2">
                            {(["all", "draft", "sent", "paid", "overdue"] as InvoiceFilter[]).map((statusOption) => (
                                <button key={statusOption} onClick={() => setFilter(statusOption)} className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${filter === statusOption ? "border-red-700/80 bg-red-900/45 text-white shadow-[0_0_15px_rgba(153,27,27,0.2)]" : "border-red-950/60 bg-black/20 text-zinc-400 hover:bg-red-950/30 hover:text-zinc-200"}`}>
                                    {statusOption === "all" ? "All Activity" : statusOption[0].toUpperCase() + statusOption.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {filteredInvoices.length === 0 ? (
                        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[2.5rem] border border-dashed border-red-900/30 bg-black/10 p-12 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-red-900/40 bg-red-950/30 text-red-400 mb-6">
                                <FileSpreadsheet size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-white">No activity to show</h3>
                            <p className="mt-2 text-sm text-zinc-500 max-w-xs">Start your billing flow by creating a new invoice or adjust your filters.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredInvoices.map((invoice) => (
                                <article
                                    key={invoice.id}
                                    className={`group relative overflow-hidden rounded-[2rem] border border-red-950/60 bg-linear-to-br from-red-950/40 via-red-950/10 to-transparent transition-all duration-300 hover:border-red-500/40 hover:bg-red-950/30 ${settings.density === "compact" ? "p-4" : "p-6"}`}
                                >
                                    <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                                        <div className="space-y-4">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <h3 className="text-lg font-bold text-white">#{invoice.invoiceNumber}</h3>
                                                <span className={`rounded-full border px-3 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] shadow-sm ${getStatusPillClassName(invoice.effectiveStatus)}`}>
                                                    {invoice.effectiveStatus}
                                                </span>
                                            </div>
                                            <div className="grid gap-y-2 gap-x-8 text-xs font-medium text-zinc-400 sm:grid-cols-2">
                                                <p className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-red-500" />{invoice.clientName}</p>
                                                <p className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-zinc-700" />Due {formatDate(invoice.dueDate)}</p>
                                                <p className="text-zinc-600 truncate max-w-[200px]">{invoice.clientEmail}</p>
                                                <p className="text-zinc-600">Issued {formatDate(invoice.issueDate)}</p>
                                            </div>
                                        </div>
                                  
                                        <div className="flex items-center justify-between gap-6 lg:flex-col lg:items-end">
                                            <p className="text-2xl font-bold text-white lg:text-3xl">{formatCurrency(invoice.total, invoice.currency)}</p>
                                            <div className="flex gap-2">
                                                <Link href={`/invoice/Add?invoice=${invoice.id}`} className="flex h-10 items-center gap-2 rounded-xl bg-red-900/20 px-4 text-xs font-bold text-red-400 transition-all hover:bg-red-900/40 hover:text-white">
                                                    <FolderPen size={14} />
                                                    Edit
                                                </Link>
                                                <button onClick={() => deleteInvoice(invoice.id)} className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/20 text-zinc-500 transition-all hover:bg-red-950 hover:text-red-500">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar Context */}
                <aside className="space-y-8">
                    <section className="rounded-[2.5rem] border border-red-950/60 bg-linear-to-b from-red-950/40 to-black/40 p-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <h2 className="text-sm font-bold uppercase tracking-widest text-red-500">Workspace Profile</h2>
                                <h3 className="text-xl font-bold text-white">{settings.workspaceName}</h3>
                            </div>
                            <div className="space-y-4 rounded-[1.5rem] border border-red-950/50 bg-black/20 p-5 text-sm font-medium text-zinc-400">
                                <p className="flex flex-col gap-1">
                                    <span className="text-[10px] uppercase tracking-widest text-zinc-600">Primary Contact</span>
                                    <span className="text-zinc-200">{settings.workspaceEmail || "No email saved"}</span>
                                </p>
                                <p className="flex flex-col gap-1">
                                    <span className="text-[10px] uppercase tracking-widest text-zinc-600">Registered Phone</span>
                                    <span className="text-zinc-200">{settings.workspacePhone || "No phone saved"}</span>
                                </p>
                                <p className="flex flex-col gap-1 leading-relaxed">
                                    <span className="text-[10px] uppercase tracking-widest text-zinc-600">Company Address</span>
                                    <span className="text-zinc-200">{settings.workspaceAddress || "No address saved"}</span>
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="rounded-2xl border border-red-950/40 bg-black/20 p-4 text-center">
                                    <p className="text-[10px] uppercase tracking-widest text-zinc-600 mb-1">Currency</p>
                                    <p className="text-lg font-bold text-white">{settings.defaultCurrency}</p>
                                </div>
                                <div className="rounded-2xl border border-red-950/40 bg-black/20 p-4 text-center">
                                    <p className="text-[10px] uppercase tracking-widest text-zinc-600 mb-1">Tax Rate</p>
                                    <p className="text-lg font-bold text-white">{settings.defaultTaxRate}%</p>
                                </div>
                            </div>
                            <Link href="/settings" className="flex items-center justify-between rounded-xl bg-red-900/10 p-4 text-sm font-bold text-red-400 hover:bg-red-900/20 transition-all">
                                Edit Billing Defaults
                                <MoveRight size={18} />
                            </Link>
                        </div>
                    </section>

                    <div className="rounded-[2.5rem] border border-red-950/60 bg-black/20 p-8 text-center">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-4">Billing Health</h3>
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative flex h-24 w-24 items-center justify-center">
                                <svg className="h-full w-full transform -rotate-90">
                                    <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-red-950" />
                                    <circle
                                        cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent"
                                        className="text-red-600"
                                        strokeDasharray={2 * Math.PI * 40}
                                        strokeDashoffset={(2 * Math.PI * 40) * (1 - (invoices.length > 0 ? (invoices.filter(i => i.status === 'paid').length / invoices.length) : 0))}
                                    />
                                </svg>
                                <span className="absolute text-xl font-bold text-white">{invoices.length > 0 ? Math.round((invoices.filter(i => i.status === 'paid').length / invoices.length) * 100) : 0}%</span>
                            </div>
                            <p className="text-xs text-zinc-500 font-medium">Invoices fully collected</p>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
}
