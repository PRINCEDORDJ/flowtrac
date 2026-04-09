'use server'
import { db } from "@/lib/db";
import { settings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getAuthenticatedUser } from "@/lib/kinde";

export type DensityMode = "compact" | "comfortable";

const DEFAULT_SETTINGS = {
  workspaceName: "My Workspace",
  workspaceEmail: "",
  workspacePhone: "",
  workspaceAddress: "",
  defaultCurrency: "USD",
  defaultTaxRate: 0,
  paymentTerms: "Net 30",
  defaultNotes: "",
  density: "comfortable" as DensityMode,
  showDashboardGreeting: true,
};

export async function getSettings() {
  try {
    const user = await getAuthenticatedUser();
    const result = await db.select().from(settings).where(eq(settings.userId, user.id));
    
    if (result.length === 0) {
      // In a real app we might want to auto-create this on first login
      return { ...DEFAULT_SETTINGS, userId: user.id };
    }
    
    return result[0];
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
    const user = await getAuthenticatedUser();
    const { ...settingsData } = data;
    
    await db.insert(settings)
      .values({ 
        userId: user.id, 
        ...settingsData, 
        updatedAt: new Date() 
      })
      .onConflictDoUpdate({
        target: settings.userId,
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
