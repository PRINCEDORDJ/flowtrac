'use server'
import { db } from "@/lib/db";
import { contacts, users } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getUser, getAuthenticatedUser } from "@/lib/kinde";

export async function getContacts() {
  try {
    const user = await getAuthenticatedUser();
    return await db.select()
      .from(contacts)
      .where(eq(contacts.userId, user.id))
      .orderBy(desc(contacts.createdAt));
  } catch (error) {
    console.error("Failed to fetch contacts:", error);
    throw new Error("Failed to fetch contacts");
  }
}

export async function addContactAction(data: { name: string; email: string; phone: string; company: string }) {
  try {
    const user = await getAuthenticatedUser();
    const [newContact] = await db.insert(contacts).values({
      ...data,
      userId: user.id,
    }).returning();
    revalidatePath("/");
    return { success: true, contact: newContact };
  } catch (error) {
    console.error("Failed to add contact:", error);
    return { success: false, error: "Failed to add contact" };
  }
}

export async function updateContactAction(id: number, data: { name: string; email: string; phone: string; company: string }) {
  try {
    const user = await getAuthenticatedUser();
    const [updatedContact] = await db.update(contacts)
      .set(data)
      .where(and(eq(contacts.id, id), eq(contacts.userId, user.id)))
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
    const user = await getAuthenticatedUser();
    await db.delete(contacts).where(and(eq(contacts.id, id), eq(contacts.userId, user.id)));
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete contact:", error);
    return { success: false, error: "Failed to delete contact" };
  }
}
