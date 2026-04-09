'use client'
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { AlertTriangle, BadgeDollarSign, FileSpreadsheet, Filter, FolderPen, Plus, ReceiptText, Trash2 } from "lucide-react";
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
            return "border-emerald-700/60 bg-emerald-900/20 text-emerald-200";
        case "sent":
            return "border-sky-700/60 bg-sky-900/20 text-sky-200";
        case "overdue":
            return "border-amber-700/60 bg-amber-900/20 text-amber-200";
        default:
            return "border-red-900/60 bg-red-950/35 text-red-200";
    }
};

const InvoiceCard = ({ title, value, icon }: InvoiceCardProps) => (
    <article className="rounded-3xl border border-red-950/60 bg-red-950/30 backdrop-blur-md">
        <div className="flex h-full flex-col gap-5 p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-lg font-semibold text-zinc-100">{title}</h2>
                </div>
                <div className="rounded-2xl border border-red-900/70 bg-red-900/25 p-3 text-red-200">{icon}</div>
            </div>
            <div className="space-y-1">
                <p className="text-3xl font-bold text-zinc-50 sm:text-4xl">{value}</p>
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
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-900 border-t-red-500" />
                <p className="text-zinc-400">Loading billing data...</p>
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
    const dueSoonCount = invoicesWithStatus.filter((invoice) =>
        invoice.effectiveStatus !== "paid"
        && invoice.dueDate >= todayString
        && invoice.dueDate <= dueSoonCutoff
    ).length;

    return (
        <div className="w-full space-y-8 md:space-y-10">
            <div className="px-1">

                <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-zinc-50 sm:text-4xl">Invoice Manager</h1>
                        <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400 sm:text-base">
                            Review invoice activity, manage statuses, and jump into a dedicated full-page editor when you need to add or update billing details.
                        </p>
                    </div>
                    <Link href="/invoice/Add" className="inline-flex items-center gap-2 self-start rounded-full border border-red-700/80 bg-red-900/40 px-5 py-3 text-sm font-medium text-zinc-100 transition hover:bg-red-800/60">
                        <Plus size={16} />
                        New Invoice
                    </Link>
                </div>
            </div>

            <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 xl:gap-5">
                <InvoiceCard title="Total Invoices" value={String(invoicesWithStatus.length)} icon={<ReceiptText size={20} />} />
                <InvoiceCard title="Open Invoices" value={String(openInvoicesCount)} icon={<FolderPen size={20} />} />
                <InvoiceCard title="Collected" value={formatCurrency(paidRevenue, settings.defaultCurrency)} icon={<BadgeDollarSign size={20} />} />
                <InvoiceCard title="Due Attention" value={String(overdueInvoices)} icon={<AlertTriangle size={20} />} />
            </section>

            <section className="grid gap-5 xl:grid-cols-[1.6fr_0.8fr]">
                <div className="space-y-5 rounded-[1.75rem] border border-red-950/60 bg-red-950/25 p-5 backdrop-blur-md sm:p-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div className="space-y-2">

                            <h2 className="text-2xl font-bold text-zinc-50">Invoice Activity</h2>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {(["all", "draft", "sent", "paid", "overdue"] as InvoiceFilter[]).map((statusOption) => (
                                <button key={statusOption} onClick={() => setFilter(statusOption)} className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${filter === statusOption ? "border-red-700/80 bg-red-900/45 text-zinc-100" : "border-red-950/60 bg-black/10 text-zinc-300 hover:bg-red-950/30"}`}>
                                    <Filter size={14} />
                                    {statusOption === "all" ? "All" : statusOption[0].toUpperCase() + statusOption.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {filteredInvoices.length === 0 ? (
                        <div className="rounded-3xl border border-dashed border-red-900/60 bg-black/10 px-5 py-10 text-center">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-900/60 bg-red-950/40 text-red-200"><FileSpreadsheet size={24} /></div>
                            <h3 className="mt-4 text-lg font-semibold text-zinc-100">No invoices in this view</h3>
                            <p className="mt-2 text-sm leading-6 text-zinc-400">Create your first invoice or switch filters to explore saved billing activity.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredInvoices.map((invoice) => (
                                <article key={invoice.id} className={`rounded-3xl border border-red-950/60 bg-black/10 ${settings.density === "compact" ? "p-4" : "p-5"} transition hover:border-red-800/70 hover:bg-red-950/20`}>
                                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                        <div className="space-y-3">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <h3 className="text-lg font-semibold text-zinc-50">{invoice.invoiceNumber}</h3>
                                                <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${getStatusPillClassName(invoice.effectiveStatus)}`}>{invoice.effectiveStatus}</span>
                                            </div>
                                            <div className="grid gap-2 text-sm text-zinc-300 sm:grid-cols-2">
                                                <p><span className="text-zinc-500">Client:</span> {invoice.clientName}</p>
                                                <p><span className="text-zinc-500">Email:</span> {invoice.clientEmail}</p>
                                                <p><span className="text-zinc-500">Issued:</span> {formatDate(invoice.issueDate)}</p>
                                                <p><span className="text-zinc-500">Due:</span> {formatDate(invoice.dueDate)}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-3 lg:text-right">
                                            <p className="text-2xl font-bold text-zinc-50">{formatCurrency(invoice.total, invoice.currency)}</p>
                                            <div className="flex flex-wrap gap-2 lg:justify-end">
                                                <Link href={`/invoice/Add?invoice=${invoice.id}`} className="inline-flex items-center gap-2 rounded-full border border-red-800/70 bg-red-900/30 px-4 py-2 text-sm font-medium text-zinc-100 transition hover:bg-red-800/50"><FolderPen size={14} />Edit</Link>
                                                <button onClick={() => deleteInvoice(invoice.id)} className="inline-flex items-center gap-2 rounded-full border border-red-900/70 bg-black/10 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:bg-red-950/30"><Trash2 size={14} />Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>

                <aside className="space-y-4 rounded-[1.75rem] border border-red-950/60 bg-red-950/25 p-5 backdrop-blur-md sm:p-6">
                    <div className="space-y-2">

                        <h2 className="text-2xl font-bold text-zinc-50">Billing Profile</h2>
                    </div>
                    <div className="rounded-3xl border border-red-950/60 bg-black/10 p-4 text-sm leading-6 text-zinc-300">
                        <p className="font-semibold text-zinc-100">{settings.workspaceName}</p>
                        <p>{settings.workspaceEmail || "No workspace email saved"}</p>
                        <p>{settings.workspacePhone || "No workspace phone saved"}</p>
                        <p>{settings.workspaceAddress || "No workspace address saved"}</p>
                    </div>
                    <div className="rounded-3xl border border-red-950/60 bg-black/10 p-4 text-sm leading-6 text-zinc-300">
                        <p><span className="text-zinc-500">Currency:</span> {settings.defaultCurrency}</p>
                        <p><span className="text-zinc-500">Tax Rate:</span> {settings.defaultTaxRate}%</p>
                        <p><span className="text-zinc-500">Terms:</span> {settings.paymentTerms}</p>
                    </div>
                </aside>
            </section>
        </div>
    );
}
