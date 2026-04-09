'use server'
import { db } from "@/lib/db";
import { invoices, invoiceItems } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";

export async function getInvoices() {
  try {
    const allInvoices = await db.select().from(invoices).orderBy(desc(invoices.createdAt));
    const allItems = await db.select().from(invoiceItems);
    
    return allInvoices.map(invoice => ({
      ...invoice,
      items: allItems.filter(item => item.invoiceId === invoice.id)
    }));
  } catch (error) {
    console.error("Failed to fetch invoices:", error);
    throw new Error("Failed to fetch invoices");
  }
}

export async function addInvoiceAction(data: {
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
  }[];
  notes?: string;
  currency: string;
  taxRate: number;
}) {
  try {
    const { items, taxRate, ...invoiceData } = data;
    
    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const tax = subtotal * (taxRate / 100);
    const total = subtotal + tax;

    const result = await db.transaction(async (tx) => {
      const [newInvoice] = await tx.insert(invoices).values({
        ...invoiceData,
        subtotal,
        tax,
        total,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();
      
      if (items && items.length > 0) {
        await tx.insert(invoiceItems).values(
          items.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            lineTotal: item.quantity * item.unitPrice,
            invoiceId: newInvoice.id,
          }))
        );
      }
      
      // Return the invoice with items for the context to use
      return {
        ...newInvoice,
        items: items.map((item, idx) => ({ 
          ...item, 
          id: idx, // Temporary ID for client-side
          invoiceId: newInvoice.id,
          lineTotal: item.quantity * item.unitPrice
        }))
      };
    });
    
    revalidatePath("/");
    return { success: true, invoice: result };
  } catch (error) {
    console.error("Failed to add invoice:", error);
    return { success: false, error: "Failed to add invoice" };
  }
}

export async function updateInvoiceAction(id: number, data: {
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
  }[];
  notes?: string;
  currency: string;
  taxRate: number;
}) {
  try {
    const { items, taxRate, ...invoiceData } = data;
    
    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const tax = subtotal * (taxRate / 100);
    const total = subtotal + tax;

    await db.transaction(async (tx) => {
      await tx.update(invoices)
        .set({ 
          ...invoiceData, 
          subtotal,
          tax,
          total,
          updatedAt: new Date() 
        })
        .where(eq(invoices.id, id));
      
      // Delete existing items and re-insert
      await tx.delete(invoiceItems).where(eq(invoiceItems.invoiceId, id));
      
      if (items && items.length > 0) {
        await tx.insert(invoiceItems).values(
          items.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            lineTotal: item.quantity * item.unitPrice,
            invoiceId: id,
          }))
        );
      }
    });
    
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to update invoice:", error);
    return { success: false, error: "Failed to update invoice" };
  }
}

export async function deleteInvoiceAction(id: number) {
  try {
    await db.delete(invoices).where(eq(invoices.id, id));
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete invoice:", error);
    return { success: false, error: "Failed to delete invoice" };
  }
}
