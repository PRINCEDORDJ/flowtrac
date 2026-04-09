'use client'
import { createContext, useContext, useSyncExternalStore } from "react";

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
    updateSettings: (updates: Partial<WorkspaceSettings>) => void;
    resetSettings: () => void;
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

const SETTINGS_STORAGE_KEY = "flowtrack:settings";
const SETTINGS_STORAGE_EVENT = "flowtrack:settings-updated";

let cachedSettingsRaw: string | null = null;
let cachedSettings: WorkspaceSettings = defaultWorkspaceSettings;

const normalizeDensity = (density: unknown): DensityMode =>
    density === "compact" ? "compact" : "comfortable";

const normalizeSettings = (value: unknown): WorkspaceSettings => {
    if (!value || typeof value !== "object") {
        return defaultWorkspaceSettings;
    }

    const rawSettings = value as Partial<WorkspaceSettings>;
    const parsedTaxRate = typeof rawSettings.defaultTaxRate === "number"
        ? rawSettings.defaultTaxRate
        : Number(rawSettings.defaultTaxRate ?? defaultWorkspaceSettings.defaultTaxRate);

    return {
        workspaceName: typeof rawSettings.workspaceName === "string" ? rawSettings.workspaceName : defaultWorkspaceSettings.workspaceName,
        workspaceEmail: typeof rawSettings.workspaceEmail === "string" ? rawSettings.workspaceEmail : defaultWorkspaceSettings.workspaceEmail,
        workspacePhone: typeof rawSettings.workspacePhone === "string" ? rawSettings.workspacePhone : defaultWorkspaceSettings.workspacePhone,
        workspaceAddress: typeof rawSettings.workspaceAddress === "string" ? rawSettings.workspaceAddress : defaultWorkspaceSettings.workspaceAddress,
        defaultCurrency: typeof rawSettings.defaultCurrency === "string" ? rawSettings.defaultCurrency : defaultWorkspaceSettings.defaultCurrency,
        defaultTaxRate: Number.isFinite(parsedTaxRate) ? parsedTaxRate : defaultWorkspaceSettings.defaultTaxRate,
        paymentTerms: typeof rawSettings.paymentTerms === "string" ? rawSettings.paymentTerms : defaultWorkspaceSettings.paymentTerms,
        defaultNotes: typeof rawSettings.defaultNotes === "string" ? rawSettings.defaultNotes : defaultWorkspaceSettings.defaultNotes,
        density: normalizeDensity(rawSettings.density),
        showDashboardGreeting: typeof rawSettings.showDashboardGreeting === "boolean"
            ? rawSettings.showDashboardGreeting
            : defaultWorkspaceSettings.showDashboardGreeting,
    };
};

const readSettings = (): WorkspaceSettings => {
    if (typeof window === "undefined") {
        return defaultWorkspaceSettings;
    }

    const savedSettings = window.localStorage.getItem(SETTINGS_STORAGE_KEY);

    if (!savedSettings) {
        cachedSettingsRaw = null;
        cachedSettings = defaultWorkspaceSettings;
        return cachedSettings;
    }

    if (savedSettings === cachedSettingsRaw) {
        return cachedSettings;
    }

    try {
        const parsedSettings = JSON.parse(savedSettings);
        cachedSettingsRaw = savedSettings;
        cachedSettings = normalizeSettings(parsedSettings);
        return cachedSettings;
    } catch {
        window.localStorage.removeItem(SETTINGS_STORAGE_KEY);
        cachedSettingsRaw = null;
        cachedSettings = defaultWorkspaceSettings;
        return cachedSettings;
    }
};

const subscribeToSettings = (callback: () => void) => {
    if (typeof window === "undefined") {
        return () => undefined;
    }

    const handleStorageChange = () => {
        callback();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(SETTINGS_STORAGE_EVENT, handleStorageChange);

    return () => {
        window.removeEventListener("storage", handleStorageChange);
        window.removeEventListener(SETTINGS_STORAGE_EVENT, handleStorageChange);
    };
};

const saveSettings = (settings: WorkspaceSettings) => {
    const serializedSettings = JSON.stringify(settings);

    cachedSettingsRaw = serializedSettings;
    cachedSettings = settings;

    window.localStorage.setItem(SETTINGS_STORAGE_KEY, serializedSettings);
    window.dispatchEvent(new Event(SETTINGS_STORAGE_EVENT));
};

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
    const settings = useSyncExternalStore(subscribeToSettings, readSettings, () => defaultWorkspaceSettings);

    const updateSettings = (updates: Partial<WorkspaceSettings>) => {
        saveSettings({
            ...settings,
            ...updates,
        });
    };

    const resetSettings = () => {
        saveSettings(defaultWorkspaceSettings);
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
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
