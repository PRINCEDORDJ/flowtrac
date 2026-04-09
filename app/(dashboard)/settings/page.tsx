'use client'
import { useState, type FormEvent } from "react";
import { Building2, CreditCard, LayoutGrid, RefreshCcw, Save, Sparkles } from "lucide-react";
import { defaultWorkspaceSettings, type WorkspaceSettings, useSettings } from "@/context/SettingsContext";

const fieldClassName = "w-full rounded-2xl border border-red-900/70 bg-black/15 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 transition focus:outline-none focus:ring-2 focus:ring-red-800/60";

const normalizeWorkspaceSettings = (formState: WorkspaceSettings): WorkspaceSettings => ({
    workspaceName: formState.workspaceName.trim() || defaultWorkspaceSettings.workspaceName,
    workspaceEmail: formState.workspaceEmail.trim(),
    workspacePhone: formState.workspacePhone.trim(),
    workspaceAddress: formState.workspaceAddress.trim(),
    defaultCurrency: formState.defaultCurrency.trim().toUpperCase() || defaultWorkspaceSettings.defaultCurrency,
    defaultTaxRate: Number.isFinite(formState.defaultTaxRate) ? Math.max(0, formState.defaultTaxRate) : defaultWorkspaceSettings.defaultTaxRate,
    paymentTerms: formState.paymentTerms.trim() || defaultWorkspaceSettings.paymentTerms,
    defaultNotes: formState.defaultNotes.trim() || defaultWorkspaceSettings.defaultNotes,
    density: formState.density,
    showDashboardGreeting: formState.showDashboardGreeting,
});

function SettingsForm({ initialSettings }: { initialSettings: WorkspaceSettings }) {
    const { updateSettings, resetSettings } = useSettings();
    const [formState, setFormState] = useState<WorkspaceSettings>(initialSettings);
    const [saveMessage, setSaveMessage] = useState("Your workspace preferences are synced to the cloud database.");
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const normalizedFormState = normalizeWorkspaceSettings(formState);

    const handleFieldChange = <Key extends keyof WorkspaceSettings>(field: Key, value: WorkspaceSettings[Key]) => {
        setFormState((currentForm) => ({
            ...currentForm,
            [field]: value,
        }));
        setHasUnsavedChanges(true);
        setSaveMessage("You have unsaved changes.");
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        updateSettings(normalizedFormState);
        setFormState(normalizedFormState);
        setSaveMessage("Settings saved locally and ready to power invoices and workspace defaults.");
        setHasUnsavedChanges(false);
    };

    const handleReset = () => {
        resetSettings();
        setFormState(defaultWorkspaceSettings);
        setSaveMessage("Settings reset to the local defaults for this workspace.");
        setHasUnsavedChanges(false);
    };

    return (
        <div className="w-full space-y-8 md:space-y-10">
            <div className="flex flex-col gap-1 px-1">
                <h1 className="text-3xl font-bold text-zinc-50 sm:text-4xl">Settings</h1>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-5 xl:grid-cols-[1.5fr_0.85fr]">
                <div className="space-y-5">
                    <section className="rounded-[1.75rem] border border-red-950/60 bg-red-950/25 p-5 backdrop-blur-md sm:p-6">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-bold text-zinc-50">Business Identity</h2>
                        </div>
                        <div className="mt-5 grid gap-4 md:grid-cols-2">
                            <label className="space-y-2 md:col-span-2">
                                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-red-300/65">Workspace Name</span>
                                <input value={formState.workspaceName} onChange={(event) => handleFieldChange("workspaceName", event.target.value)} className={fieldClassName} />
                            </label>
                            <label className="space-y-2">
                                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-red-300/65">Email</span>
                                <input type="email" value={formState.workspaceEmail} onChange={(event) => handleFieldChange("workspaceEmail", event.target.value)} className={fieldClassName} />
                            </label>
                            <label className="space-y-2">
                                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-red-300/65">Phone</span>
                                <input value={formState.workspacePhone} onChange={(event) => handleFieldChange("workspacePhone", event.target.value)} className={fieldClassName} />
                            </label>
                            <label className="space-y-2 md:col-span-2">
                                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-red-300/65">Address</span>
                                <textarea rows={3} value={formState.workspaceAddress} onChange={(event) => handleFieldChange("workspaceAddress", event.target.value)} className={`${fieldClassName} rounded-3xl`} />
                            </label>
                        </div>
                    </section>

                    <section className="rounded-[1.75rem] border border-red-950/60 bg-red-950/25 p-5 backdrop-blur-md sm:p-6">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-bold text-zinc-50">Billing Preferences</h2>
                        </div>
                        <div className="mt-5 grid gap-4 md:grid-cols-2">
                            <label className="space-y-2">
                                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-red-300/65">Currency</span>
                                <input value={formState.defaultCurrency} onChange={(event) => handleFieldChange("defaultCurrency", event.target.value.toUpperCase())} className={fieldClassName} />
                            </label>
                            <label className="space-y-2">
                                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-red-300/65">Tax Rate %</span>
                                <input type="number" min="0" step="0.01" value={formState.defaultTaxRate} onChange={(event) => handleFieldChange("defaultTaxRate", Number(event.target.value))} className={fieldClassName} />
                            </label>
                            <label className="space-y-2 md:col-span-2">
                                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-red-300/65">Payment Terms</span>
                                <input value={formState.paymentTerms} onChange={(event) => handleFieldChange("paymentTerms", event.target.value)} className={fieldClassName} />
                            </label>
                            <label className="space-y-2 md:col-span-2">
                                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-red-300/65">Default Notes</span>
                                <textarea rows={4} value={formState.defaultNotes} onChange={(event) => handleFieldChange("defaultNotes", event.target.value)} className={`${fieldClassName} rounded-3xl`} />
                            </label>
                        </div>
                    </section>

                    <section className="rounded-[1.75rem] border border-red-950/60 bg-red-950/25 p-5 backdrop-blur-md sm:p-6">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-bold text-zinc-50">Interface Behavior</h2>
                        </div>
                        <div className="mt-5 grid gap-4 md:grid-cols-2">
                            <div className="space-y-3">
                                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-red-300/65">Density</span>
                                <div className="flex gap-3">
                                    {(["comfortable", "compact"] as const).map((densityOption) => (
                                        <button key={densityOption} type="button" onClick={() => handleFieldChange("density", densityOption)} className={`inline-flex rounded-full border px-4 py-2 text-sm font-medium transition ${formState.density === densityOption ? "border-red-700/80 bg-red-900/45 text-zinc-100" : "border-red-950/60 bg-black/10 text-zinc-300 hover:bg-red-950/30"}`}>
                                            {densityOption[0].toUpperCase() + densityOption.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <label className="flex items-center justify-between gap-4 rounded-3xl border border-red-950/60 bg-black/10 px-4 py-4">
                                <div>
                                    <p className="text-sm font-semibold text-zinc-100">Dashboard greeting</p>
                                    <p className="text-sm leading-6 text-zinc-400">Keep the greeting visible in dashboard hero sections.</p>
                                </div>
                                <button type="button" onClick={() => handleFieldChange("showDashboardGreeting", !formState.showDashboardGreeting)} className={`relative inline-flex h-7 w-14 items-center rounded-full transition ${formState.showDashboardGreeting ? "bg-red-800" : "bg-zinc-700"}`} aria-pressed={formState.showDashboardGreeting}>
                                    <span className={`inline-block h-5 w-5 rounded-full bg-white transition ${formState.showDashboardGreeting ? "translate-x-8" : "translate-x-1"}`} />
                                </button>
                            </label>
                        </div>
                    </section>
                </div>

                <aside className="space-y-5">
                    <section className="rounded-[1.75rem] border border-red-950/60 bg-red-950/25 p-5 backdrop-blur-md sm:p-6">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-bold text-zinc-50">Current Defaults</h2>
                        </div>
                        <div className="mt-5 space-y-3 rounded-3xl border border-red-950/60 bg-black/10 p-4 text-sm leading-6 text-zinc-300">
                            <p><span className="text-zinc-500">Workspace:</span> {normalizedFormState.workspaceName}</p>
                            <p><span className="text-zinc-500">Currency:</span> {normalizedFormState.defaultCurrency}</p>
                            <p><span className="text-zinc-500">Tax Rate:</span> {normalizedFormState.defaultTaxRate}%</p>
                            <p><span className="text-zinc-500">Terms:</span> {normalizedFormState.paymentTerms}</p>
                            <p><span className="text-zinc-500">Density:</span> {normalizedFormState.density}</p>
                            <p><span className="text-zinc-500">Greeting:</span> {normalizedFormState.showDashboardGreeting ? "Visible" : "Hidden"}</p>
                        </div>
                        <p className="mt-4 text-sm leading-6 text-zinc-400">{saveMessage}</p>
                    </section>

                    <section className="rounded-[1.75rem] border border-red-950/60 bg-red-950/25 p-5 backdrop-blur-md sm:p-6">
                        <div className="flex flex-col gap-3">
                            <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-800 px-6 py-3 text-sm font-semibold text-zinc-50 shadow-[0_10px_30px_rgba(127,29,29,0.35)] transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-950/60 disabled:text-zinc-400" disabled={!hasUnsavedChanges}><Save size={16} />Save Settings</button>
                            <button type="button" onClick={handleReset} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-900/70 px-6 py-3 text-sm font-medium text-zinc-200 transition hover:bg-red-950/30"><RefreshCcw size={16} />Reset to Defaults</button>
                        </div>
                    </section>
                </aside>
            </form>
        </div>
    );
}

export default function SettingsPage() {
    const { settings, isLoading } = useSettings();
    const settingsKey = JSON.stringify(settings);

    if (isLoading) {
        return (
            <div className="flex flex-col gap-3 px-1">
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-red-300/60 font-animate-pulse">Loading...</p>
                <h1 className="text-3xl font-bold text-zinc-50 sm:text-4xl font-animate-pulse">Fetching preferences...</h1>
            </div>
        );
    }

    return <SettingsForm key={settingsKey} initialSettings={settings} />;
}
