'use client'
import { createContext, useContext, useEffect, useState } from "react";
import { getSettings, updateSettingsAction } from "@/lib/actions/settings";

export type DensityMode = "compact" | "comfortable";

export interface WorkspaceSettings {
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
}

interface SettingsContextValue {
    settings: WorkspaceSettings;
    isLoading: boolean;
    updateSettings: (updates: Partial<WorkspaceSettings>) => Promise<void>;
    resetSettings: () => Promise<void>;
}

export const defaultWorkspaceSettings: WorkspaceSettings = {
    workspaceName: "Flowtrack Studio",
    workspaceEmail: "",
    workspacePhone: "",
    workspaceAddress: "",
    defaultCurrency: "USD",
    defaultTaxRate: 10,
    paymentTerms: "Due on receipt",
    defaultNotes: "Thank you for your business.",
    density: "comfortable",
    showDashboardGreeting: true,
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
    const [settings, setSettings] = useState<WorkspaceSettings>(defaultWorkspaceSettings);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const dbSettings = await getSettings();
                if (dbSettings) {
                    setSettings(dbSettings as WorkspaceSettings);
                }
            } catch (error) {
                console.error("Failed to load settings from DB:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadSettings();
    }, []);

    const updateSettings = async (updates: Partial<WorkspaceSettings>) => {
        const newSettings = { ...settings, ...updates };
        // Optimistic update
        setSettings(newSettings);
        
        const result = await updateSettingsAction(newSettings);
        if (!result.success) {
            console.error("Failed to sync settings to DB:", result.error);
            // Optionally revert on failure if needed
        }
    };

    const resetSettings = async () => {
        setSettings(defaultWorkspaceSettings);
        await updateSettingsAction(defaultWorkspaceSettings);
    };

    return (
        <SettingsContext.Provider value={{ settings, isLoading, updateSettings, resetSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);

    if (!context) {
        throw new Error("useSettings must be used within a SettingsProvider");
    }

    return context;
};
