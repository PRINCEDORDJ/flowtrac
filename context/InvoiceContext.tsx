'use client'
import { createContext, useContext, useSyncExternalStore } from "react";

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";

export interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
}

export interface Invoice {
    id: number;
    invoiceNumber: string;
    clientName: string;
    clientEmail: string;
    status: InvoiceStatus;
    issueDate: string;
    dueDate: string;
    items: InvoiceItem[];
    notes?: string;
    currency: string;
    subtotal: number;
    tax: number;
    total: number;
    createdAt: string;
    updatedAt: string;
}

export interface InvoiceItemInput {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
}

export interface InvoiceInput {
    invoiceNumber: string;
    clientName: string;
    clientEmail: string;
    status: InvoiceStatus;
    issueDate: string;
    dueDate: string;
    items: InvoiceItemInput[];
    notes?: string;
    currency: string;
    taxRate: number;
}

interface InvoiceContextValue {
    invoices: Invoice[];
    addInvoice: (invoice: InvoiceInput) => void;
    updateInvoice: (id: number, invoice: InvoiceInput) => void;
    deleteInvoice: (id: number) => void;
}

const InvoiceContext = createContext<InvoiceContextValue | null>(null);

const INVOICES_STORAGE_KEY = "flowtrack:invoices";
const INVOICES_STORAGE_EVENT = "flowtrack:invoices-updated";
const EMPTY_INVOICES: Invoice[] = [];

let cachedInvoicesRaw: string | null = null;
let cachedInvoices: Invoice[] = EMPTY_INVOICES;

const normalizeNumber = (value: unknown) => {
    if (typeof value === "number" && Number.isFinite(value)) {
        return value;
    }

    if (typeof value === "string") {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : 0;
    }

    return 0;
};

const normalizeInvoiceItem = (value: unknown): InvoiceItem | null => {
    if (!value || typeof value !== "object") {
        return null;
    }

    const rawItem = value as Partial<InvoiceItem>;

    if (typeof rawItem.id !== "string") {
        return null;
    }

    const quantity = normalizeNumber(rawItem.quantity);
    const unitPrice = normalizeNumber(rawItem.unitPrice);

    return {
        id: rawItem.id,
        description: typeof rawItem.description === "string" ? rawItem.description : "",
        quantity,
        unitPrice,
        lineTotal: quantity * unitPrice,
    };
};

const normalizeInvoiceStatus = (status: unknown): InvoiceStatus => {
    if (status === "draft" || status === "sent" || status === "paid" || status === "overdue") {
        return status;
    }

    return "draft";
};

const calculateInvoiceTotals = (items: InvoiceItemInput[], taxRate: number) => {
    const normalizedItems = items.map((item) => {
        const quantity = Math.max(0, normalizeNumber(item.quantity));
        const unitPrice = Math.max(0, normalizeNumber(item.unitPrice));

        return {
            id: item.id,
            description: item.description.trim(),
            quantity,
            unitPrice,
            lineTotal: quantity * unitPrice,
        };
    }).filter((item) => item.description !== "" || item.quantity > 0 || item.unitPrice > 0);

    const subtotal = normalizedItems.reduce((sum, item) => sum + item.lineTotal, 0);
    const tax = subtotal * Math.max(0, taxRate) / 100;
    const total = subtotal + tax;

    return {
        items: normalizedItems,
        subtotal,
        tax,
        total,
    };
};

const buildInvoice = (input: InvoiceInput, options: { id?: number; createdAt?: string } = {}): Invoice => {
    const nowIso = new Date().toISOString();
    const totals = calculateInvoiceTotals(input.items, input.taxRate);
    const normalizedStatus = normalizeInvoiceStatus(input.status);
    const shouldBeOverdue = normalizedStatus !== "paid"
        && input.dueDate !== ""
        && new Date(input.dueDate).getTime() < new Date(nowIso).getTime();

    return {
        id: options.id ?? Date.now(),
        invoiceNumber: input.invoiceNumber.trim(),
        clientName: input.clientName.trim(),
        clientEmail: input.clientEmail.trim(),
        status: shouldBeOverdue ? "overdue" : normalizedStatus,
        issueDate: input.issueDate,
        dueDate: input.dueDate,
        items: totals.items,
        notes: input.notes?.trim() ?? "",
        currency: input.currency.trim() || "USD",
        subtotal: totals.subtotal,
        tax: totals.tax,
        total: totals.total,
        createdAt: options.createdAt ?? nowIso,
        updatedAt: nowIso,
    };
};

const normalizeInvoice = (value: unknown): Invoice | null => {
    if (!value || typeof value !== "object") {
        return null;
    }

    const rawInvoice = value as Partial<Invoice>;

    if (typeof rawInvoice.id !== "number" || typeof rawInvoice.invoiceNumber !== "string") {
        return null;
    }

    const items = Array.isArray(rawInvoice.items)
        ? rawInvoice.items
            .map(normalizeInvoiceItem)
            .filter((item): item is InvoiceItem => item !== null)
        : [];

    const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
    const tax = normalizeNumber(rawInvoice.tax);
    const total = subtotal + tax;
    const rawStatus = normalizeInvoiceStatus(rawInvoice.status);
    const overdue = rawStatus !== "paid"
        && typeof rawInvoice.dueDate === "string"
        && rawInvoice.dueDate !== ""
        && new Date(rawInvoice.dueDate).getTime() < Date.now();

    return {
        id: rawInvoice.id,
        invoiceNumber: rawInvoice.invoiceNumber,
        clientName: typeof rawInvoice.clientName === "string" ? rawInvoice.clientName : "",
        clientEmail: typeof rawInvoice.clientEmail === "string" ? rawInvoice.clientEmail : "",
        status: overdue ? "overdue" : rawStatus,
        issueDate: typeof rawInvoice.issueDate === "string" ? rawInvoice.issueDate : "",
        dueDate: typeof rawInvoice.dueDate === "string" ? rawInvoice.dueDate : "",
        items,
        notes: typeof rawInvoice.notes === "string" ? rawInvoice.notes : "",
        currency: typeof rawInvoice.currency === "string" ? rawInvoice.currency : "USD",
        subtotal,
        tax,
        total,
        createdAt: typeof rawInvoice.createdAt === "string" ? rawInvoice.createdAt : new Date(rawInvoice.id).toISOString(),
        updatedAt: typeof rawInvoice.updatedAt === "string" ? rawInvoice.updatedAt : new Date(rawInvoice.id).toISOString(),
    };
};

const readInvoices = (): Invoice[] => {
    if (typeof window === "undefined") {
        return EMPTY_INVOICES;
    }

    const savedInvoices = window.localStorage.getItem(INVOICES_STORAGE_KEY);

    if (!savedInvoices) {
        cachedInvoicesRaw = null;
        cachedInvoices = EMPTY_INVOICES;
        return cachedInvoices;
    }

    if (savedInvoices === cachedInvoicesRaw) {
        return cachedInvoices;
    }

    try {
        const parsedInvoices = JSON.parse(savedInvoices);

        if (!Array.isArray(parsedInvoices)) {
            cachedInvoicesRaw = null;
            cachedInvoices = EMPTY_INVOICES;
            return cachedInvoices;
        }

        cachedInvoicesRaw = savedInvoices;
        cachedInvoices = parsedInvoices
            .map(normalizeInvoice)
            .filter((invoice): invoice is Invoice => invoice !== null);

        return cachedInvoices;
    } catch {
        window.localStorage.removeItem(INVOICES_STORAGE_KEY);
        cachedInvoicesRaw = null;
        cachedInvoices = EMPTY_INVOICES;
        return cachedInvoices;
    }
};

const subscribeToInvoices = (callback: () => void) => {
    if (typeof window === "undefined") {
        return () => undefined;
    }

    const handleStorageChange = () => {
        callback();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(INVOICES_STORAGE_EVENT, handleStorageChange);

    return () => {
        window.removeEventListener("storage", handleStorageChange);
        window.removeEventListener(INVOICES_STORAGE_EVENT, handleStorageChange);
    };
};

const saveInvoices = (invoices: Invoice[]) => {
    const serializedInvoices = JSON.stringify(invoices);

    cachedInvoicesRaw = serializedInvoices;
    cachedInvoices = invoices;

    window.localStorage.setItem(INVOICES_STORAGE_KEY, serializedInvoices);
    window.dispatchEvent(new Event(INVOICES_STORAGE_EVENT));
};

export const InvoiceProvider = ({ children }: { children: React.ReactNode }) => {
    const invoices = useSyncExternalStore(subscribeToInvoices, readInvoices, () => EMPTY_INVOICES);

    const addInvoice = (invoice: InvoiceInput) => {
        saveInvoices([
            ...invoices,
            buildInvoice(invoice),
        ]);
    };

    const updateInvoice = (id: number, invoice: InvoiceInput) => {
        const existingInvoice = invoices.find((currentInvoice) => currentInvoice.id === id);

        saveInvoices(
            invoices.map((currentInvoice) =>
                currentInvoice.id === id
                    ? buildInvoice(invoice, {
                        id,
                        createdAt: existingInvoice?.createdAt,
                    })
                    : currentInvoice
            )
        );
    };

    const deleteInvoice = (id: number) => {
        saveInvoices(invoices.filter((invoice) => invoice.id !== id));
    };

    return (
        <InvoiceContext.Provider value={{ invoices, addInvoice, updateInvoice, deleteInvoice }}>
            {children}
        </InvoiceContext.Provider>
    );
};

export const useInvoices = () => {
    const context = useContext(InvoiceContext);

    if (!context) {
        throw new Error("useInvoices must be used within an InvoiceProvider");
    }

    return context;
};
