'use server'
import { db } from "@/lib/db";
import { contacts } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getContacts() {
  try {
    return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
  } catch (error) {
    console.error("Failed to fetch contacts:", error);
    throw new Error("Failed to fetch contacts");
  }
}

export async function addContactAction(data: { name: string; email: string; phone: string; company: string }) {
  try {
    const [newContact] = await db.insert(contacts).values(data).returning();
    revalidatePath("/");
    return { success: true, contact: newContact };
  } catch (error) {
    console.error("Failed to add contact:", error);
    return { success: false, error: "Failed to add contact" };
  }
}

export async function updateContactAction(id: number, data: { name: string; email: string; phone: string; company: string }) {
  try {
    const [updatedContact] = await db.update(contacts)
      .set(data)
      .where(eq(contacts.id, id))
      .returning();
    revalidatePath("/");
    return { success: true, contact: updatedContact };
  } catch (error) {
    console.error("Failed to update contact:", error);
    return { success: false, error: "Failed to update contact" };
  }
}

export async function deleteContactAction(id: number) {
  try {
    await db.delete(contacts).where(eq(contacts.id, id));
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete contact:", error);
    return { success: false, error: "Failed to delete contact" };
  }
}
