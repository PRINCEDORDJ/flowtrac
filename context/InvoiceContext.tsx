'use client'
import { createContext, useContext, useEffect, useState } from "react";
import { getInvoices, addInvoiceAction, updateInvoiceAction, deleteInvoiceAction } from "@/lib/actions/invoices";

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";

export interface InvoiceItem {
    id?: number | string;
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
    createdAt: Date | string;
    updatedAt: Date | string;
}

export interface InvoiceItemInput {
    id?: string | number;
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
    isLoading: boolean;
    addInvoice: (invoice: InvoiceInput) => Promise<void>;
    updateInvoice: (id: number, invoice: InvoiceInput) => Promise<void>;
    deleteInvoice: (id: number) => Promise<void>;
}

const InvoiceContext = createContext<InvoiceContextValue | null>(null);

export const InvoiceProvider = ({ children }: { children: React.ReactNode }) => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadInvoices = async () => {
            try {
                const data = await getInvoices();
                setInvoices(data as Invoice[]);
            } catch (error) {
                console.error("Failed to load invoices:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadInvoices();
    }, []);

    const addInvoice = async (invoice: InvoiceInput) => {
        // Sanitize items for the action
        const sanitizedInvoice = {
            ...invoice,
            items: invoice.items.map(item => ({
                description: item.description,
                quantity: item.quantity,
                unitPrice: item.unitPrice
            }))
        };

        const result = await addInvoiceAction(sanitizedInvoice);
        if (result.success && result.invoice) {
            setInvoices((prev) => [result.invoice as Invoice, ...prev]);
        }
    };

    const updateInvoice = async (id: number, invoice: InvoiceInput) => {
        // Sanitize items for the action
        const sanitizedInvoice = {
            ...invoice,
            items: invoice.items.map(item => ({
                description: item.description,
                quantity: item.quantity,
                unitPrice: item.unitPrice
            }))
        };

        const result = await updateInvoiceAction(id, sanitizedInvoice);
        if (result.success) {
            // Re-fetch or update locally
            const data = await getInvoices();
            setInvoices(data as Invoice[]);
        }
    };

    const deleteInvoice = async (id: number) => {
        const previousInvoices = [...invoices];
        setInvoices((prev) => prev.filter((inv) => inv.id !== id));

        const result = await deleteInvoiceAction(id);
        if (!result.success) {
            setInvoices(previousInvoices);
        }
    };

    return (
        <InvoiceContext.Provider value={{ invoices, isLoading, addInvoice, updateInvoice, deleteInvoice }}>
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
