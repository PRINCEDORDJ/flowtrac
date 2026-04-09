'use server'
import { db } from "@/lib/db";
import { settings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type DensityMode = "compact" | "comfortable";

export async function getSettings() {
  try {
    const result = await db.select().from(settings).where(eq(settings.id, 1));
    return result[0] || null;
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    throw new Error("Failed to fetch settings");
  }
}

export async function updateSettingsAction(data: {
  workspaceName: string;
  workspaceEmail: string;
  workspacePhone: string;
  workspaceAddress: string;
  defaultCurrency: string;
  defaultTaxRate: number;
  paymentTerms: string;
  defaultNotes: string;
  density: DensityMode;
  showDashboardGreeting: boolean;
}) {
  try {
    const { ...settingsData } = data;
    
    await db.insert(settings)
      .values({ 
        id: 1, 
        ...settingsData, 
        updatedAt: new Date() 
      })
      .onConflictDoUpdate({
        target: settings.id,
        set: { 
          ...settingsData, 
          updatedAt: new Date() 
        },
      });
    
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to update settings:", error);
    return { success: false, error: "Failed to update settings" };
  }
}
