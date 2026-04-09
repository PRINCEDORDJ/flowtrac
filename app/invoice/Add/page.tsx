"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, type FormEvent } from "react";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import {
  useInvoices,
  type InvoiceInput,
  type InvoiceItemInput,
  type InvoiceStatus,
} from "@/context/InvoiceContext";
import { useSettings } from "@/context/SettingsContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type InvoiceFormState = Omit<InvoiceInput, "taxRate"> & { taxRate: string };

const fieldClassName =
  "w-full rounded-2xl border border-red-900/70 bg-black/15 px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-red-800/60";

const createInvoiceItem = (): InvoiceItemInput => ({
  id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  description: "",
  quantity: 1,
  unitPrice: 0,
});

const getNextInvoiceNumber = (invoiceNumbers: { invoiceNumber: string }[]) => {
  const maxSuffix = invoiceNumbers.reduce((currentMax, invoice) => {
    const match = invoice.invoiceNumber.match(/(\d+)$/);
    const suffix = match ? Number(match[1]) : 0;
    return Number.isFinite(suffix) ? Math.max(currentMax, suffix) : currentMax;
  }, 0);

  return `INV-${String(maxSuffix + 1).padStart(3, "0")}`;
};

const formatCurrency = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    maximumFractionDigits: 2,
  }).format(amount);

const calculateDraftTotals = (items: InvoiceItemInput[], taxRate: number) => {
  const normalizedItems = items.filter(
    (item) =>
      item.description.trim() !== "" || item.quantity > 0 || item.unitPrice > 0,
  );
  const subtotal = normalizedItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
  const tax = (subtotal * Math.max(0, taxRate)) / 100;

  return {
    subtotal,
    tax,
    total: subtotal + tax,
    hasItems: normalizedItems.length > 0,
  };
};

const createInitialFormState = ({
  editingInvoice,
  defaultTaxRate,
  defaultCurrency,
  defaultNotes,
  nextInvoiceNumber,
  todayString,
}: {
  editingInvoice: ReturnType<typeof useInvoices>["invoices"][number] | null;
  defaultTaxRate: number;
  defaultCurrency: string;
  defaultNotes: string;
  nextInvoiceNumber: string;
  todayString: string;
}): InvoiceFormState => {
  if (!editingInvoice) {
    return {
      invoiceNumber: nextInvoiceNumber,
      clientName: "",
      clientEmail: "",
      status: "draft",
      issueDate: todayString,
      dueDate: todayString,
      items: [createInvoiceItem()],
      notes: defaultNotes,
      currency: defaultCurrency,
      taxRate: String(defaultTaxRate),
    };
  }

  const taxRate =
    editingInvoice.subtotal > 0
      ? (editingInvoice.tax / editingInvoice.subtotal) * 100
      : defaultTaxRate;

  return {
    invoiceNumber: editingInvoice.invoiceNumber,
    clientName: editingInvoice.clientName,
    clientEmail: editingInvoice.clientEmail,
    status: editingInvoice.status,
    issueDate: editingInvoice.issueDate,
    dueDate: editingInvoice.dueDate,
    items: editingInvoice.items.map((item) => ({
      id: item.id,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    })),
    notes: editingInvoice.notes ?? "",
    currency: editingInvoice.currency,
    taxRate: taxRate.toFixed(2),
  };
};

interface InvoiceAddFormProps {
  editingInvoice: ReturnType<typeof useInvoices>["invoices"][number] | null;
  nextInvoiceNumber: string;
  todayString: string;
  defaultCurrency: string;
  defaultNotes: string;
  defaultTaxRate: number;
  paymentTerms: string;
  addInvoice: ReturnType<typeof useInvoices>["addInvoice"];
  updateInvoice: ReturnType<typeof useInvoices>["updateInvoice"];
}

function InvoiceAddForm({
  editingInvoice,
  nextInvoiceNumber,
  todayString,
  defaultCurrency,
  defaultNotes,
  defaultTaxRate,
  paymentTerms,
  addInvoice,
  updateInvoice,
}: InvoiceAddFormProps) {
  const router = useRouter();
  const [formState, setFormState] = useState<InvoiceFormState>(() =>
    createInitialFormState({
      editingInvoice,
      defaultTaxRate,
      defaultCurrency,
      defaultNotes,
      nextInvoiceNumber,
      todayString,
    }),
  );
  const [lineItemError, setLineItemError] = useState("");

  const formTotals = calculateDraftTotals(
    formState.items,
    Number(formState.taxRate),
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formTotals.hasItems) {
      setLineItemError("Add at least one line item before saving the invoice.");
      return;
    }

    const payload: InvoiceInput = {
      invoiceNumber: formState.invoiceNumber.trim(),
      clientName: formState.clientName.trim(),
      clientEmail: formState.clientEmail.trim(),
      status: formState.status,
      issueDate: formState.issueDate,
      dueDate: formState.dueDate,
      items: formState.items,
      notes: formState.notes?.trim() ?? "",
      currency: formState.currency.trim(),
      taxRate: Number(formState.taxRate) || 0,
    };

    if (editingInvoice) {
      updateInvoice(editingInvoice.id, payload);
    } else {
      addInvoice(payload);
    }

    router.push("/invoice");
  };

  return (
    <div className="w-full space-y-8 md:space-y-10">
      <div className="flex flex-col gap-4 px-1">
        <Link
          href="/invoice"
          className="inline-flex items-center gap-2 self-start rounded-full border border-red-900/70 bg-black/10 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:bg-red-950/30"
        >
          <ArrowLeft size={16} />
          Back to Invoices
        </Link>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-red-300/60">
            Billing Editor
          </p>
          <h1 className="mt-2 text-3xl font-bold text-zinc-50 sm:text-4xl">
            {editingInvoice ? "Edit Invoice" : "Create Invoice"}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400 sm:text-base">
            Use this full-page editor to build invoice details, line items,
            totals, and notes without leaving the billing workflow.
          </p>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-red-900/60 bg-linear-to-br from-red-950/90 via-red-950/75 to-black/50 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-6">
        <form
          onSubmit={handleSubmit}
          className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr]"
        >
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <input
                required
                value={formState.invoiceNumber}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    invoiceNumber: event.target.value,
                  }))
                }
                placeholder="Invoice Number"
                className={fieldClassName}
              />
              <Select
                value={formState.status}
                onValueChange={(value) =>
                  setFormState((current) => ({
                    ...current,
                    status: value as InvoiceStatus,
                  }))
                }
              >
                <SelectTrigger className={fieldClassName}>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
              <input
                required
                value={formState.clientName}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    clientName: event.target.value,
                  }))
                }
                placeholder="Client Name"
                className={fieldClassName}
              />
              <input
                required
                type="email"
                value={formState.clientEmail}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    clientEmail: event.target.value,
                  }))
                }
                placeholder="Client Email"
                className={fieldClassName}
              />
              <input
                required
                type="date"
                value={formState.issueDate}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    issueDate: event.target.value,
                  }))
                }
                className={fieldClassName}
              />
              <input
                required
                type="date"
                value={formState.dueDate}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    dueDate: event.target.value,
                  }))
                }
                className={fieldClassName}
              />
            </div>

            <div className="rounded-3xl border border-red-950/60 bg-black/10 p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-zinc-100">
                  Line Items
                </p>
                <button
                  type="button"
                  onClick={() =>
                    setFormState((current) => ({
                      ...current,
                      items: [...current.items, createInvoiceItem()],
                    }))
                  }
                  className="inline-flex items-center gap-2 rounded-full border border-red-800/70 bg-red-900/30 px-4 py-2 text-sm font-medium text-zinc-100 transition hover:bg-red-800/50"
                >
                  <Plus size={14} />
                  Add Item
                </button>
              </div>
              <div className="mt-4 space-y-3">
                {formState.items.map((item, index) => (
                  <div
                    key={item.id}
                    className="grid gap-3 rounded-3xl border border-red-950/60 bg-red-950/20 p-4 lg:grid-cols-[1.8fr_0.7fr_0.8fr_auto]"
                  >
                    <input
                      value={item.description}
                      onChange={(event) =>
                        setFormState((current) => ({
                          ...current,
                          items: current.items.map((currentItem) =>
                            currentItem.id === item.id
                              ? {
                                  ...currentItem,
                                  description: event.target.value,
                                }
                              : currentItem,
                          ),
                        }))
                      }
                      placeholder={`Line item ${index + 1}`}
                      className={fieldClassName}
                    />
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={item.quantity}
                      onChange={(event) =>
                        setFormState((current) => ({
                          ...current,
                          items: current.items.map((currentItem) =>
                            currentItem.id === item.id
                              ? {
                                  ...currentItem,
                                  quantity: Number(event.target.value),
                                }
                              : currentItem,
                          ),
                        }))
                      }
                      className={fieldClassName}
                    />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(event) =>
                        setFormState((current) => ({
                          ...current,
                          items: current.items.map((currentItem) =>
                            currentItem.id === item.id
                              ? {
                                  ...currentItem,
                                  unitPrice: Number(event.target.value),
                                }
                              : currentItem,
                          ),
                        }))
                      }
                      className={fieldClassName}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFormState((current) => ({
                          ...current,
                          items:
                            current.items.length === 1
                              ? current.items
                              : current.items.filter(
                                  (currentItem) => currentItem.id !== item.id,
                                ),
                        }))
                      }
                      className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-red-900/70 bg-black/10 text-zinc-200 transition hover:bg-red-900/30"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
              {lineItemError ? (
                <p className="mt-3 text-sm text-amber-300">{lineItemError}</p>
              ) : null}
            </div>

            <textarea
              rows={4}
              value={formState.notes}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  notes: event.target.value,
                }))
              }
              placeholder="Notes"
              className={`${fieldClassName} rounded-3xl`}
            />
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-red-950/60 bg-black/10 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-300/60">
                Defaults in use
              </p>
              <p className="mt-3 text-sm text-zinc-300">
                Currency: {defaultCurrency}
              </p>
              <p className="text-sm text-zinc-300">
                Tax Rate: {defaultTaxRate}%
              </p>
              <p className="text-sm text-zinc-300">Terms: {paymentTerms}</p>
            </div>
            <div className="rounded-3xl border border-red-950/60 bg-black/10 p-5">
              <input
                value={formState.currency}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    currency: event.target.value.toUpperCase(),
                  }))
                }
                className={fieldClassName}
              />
              <input
                type="number"
                min="0"
                step="0.01"
                value={formState.taxRate}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    taxRate: event.target.value,
                  }))
                }
                className={`mt-4 ${fieldClassName}`}
              />
            </div>
            <div className="rounded-3xl border border-red-950/60 bg-red-950/25 p-5">
              <div className="flex items-center justify-between text-sm text-zinc-300">
                <span>Subtotal</span>
                <span>
                  {formatCurrency(formTotals.subtotal, formState.currency)}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm text-zinc-300">
                <span>Tax</span>
                <span>
                  {formatCurrency(formTotals.tax, formState.currency)}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-red-950/60 pt-3 text-base font-semibold text-zinc-50">
                <span>Total</span>
                <span>
                  {formatCurrency(formTotals.total, formState.currency)}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-2xl bg-red-800 px-6 py-3 text-sm font-semibold text-zinc-50 transition hover:bg-red-700"
              >
                {editingInvoice ? "Save invoice" : "Create invoice"}
              </button>
              <Link
                href="/invoice"
                className="inline-flex items-center justify-center rounded-2xl border border-red-900/70 px-6 py-3 text-sm font-medium text-zinc-200 transition hover:bg-red-950/30"
              >
                Cancel
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function InvoiceAddPageClient() {
  const searchParams = useSearchParams();
  const { invoices, addInvoice, updateInvoice } = useInvoices();
  const { settings } = useSettings();
  const [todayString] = useState(() => new Date().toISOString().slice(0, 10));
  const editingId = Number(searchParams.get("invoice"));
  const editingInvoice = Number.isFinite(editingId)
    ? (invoices.find((invoice) => invoice.id === editingId) ?? null)
    : null;
  const nextInvoiceNumber = getNextInvoiceNumber(invoices);
  const formKey = editingInvoice
    ? `invoice-edit-${editingInvoice.id}-${editingInvoice.updatedAt}`
    : `invoice-new-${nextInvoiceNumber}-${settings.defaultCurrency}-${settings.defaultTaxRate}-${settings.defaultNotes}`;

  return (
    <InvoiceAddForm
      key={formKey}
      editingInvoice={editingInvoice}
      nextInvoiceNumber={nextInvoiceNumber}
      todayString={todayString}
      defaultCurrency={settings.defaultCurrency}
      defaultNotes={settings.defaultNotes}
      defaultTaxRate={settings.defaultTaxRate}
      paymentTerms={settings.paymentTerms}
      addInvoice={addInvoice}
      updateInvoice={updateInvoice}
    />
  );
}

export default function InvoiceAddPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InvoiceAddPageClient />
    </Suspense>
  );
}
