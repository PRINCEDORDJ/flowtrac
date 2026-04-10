'use client'
import { useState, type FormEvent } from "react";
import { Building2, CreditCard, LayoutGrid, RefreshCcw, Save, Sparkles } from "lucide-react";
import { defaultWorkspaceSettings, type WorkspaceSettings, useSettings } from "@/context/SettingsContext";

const fieldClassName = "w-full rounded-2xl border border-red-900/40 bg-black/20 p-4 text-sm text-white placeholder:text-zinc-600 focus:border-red-500/50 focus:outline-none focus:ring-4 focus:ring-red-500/10 transition-all";

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
        setSaveMessage("Workspace restored to system defaults.");
        setHasUnsavedChanges(false);
    };

    return (
      <div className="relative w-full space-y-8 pb-10 md:space-y-12">
        {/* Page Header */}
        <section className="relative overflow-hidden rounded-[2.5rem] border border-red-950/50 bg-linear-to-b from-red-950/30 via-red-950/15 to-transparent p-6 sm:p-10">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-red-600/5 blur-[100px]" />
          
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
               <div className="inline-flex items-center gap-2 rounded-full border border-red-900/30 bg-red-950/40 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-red-400">
                <LayoutGrid size={12} />
                Configuration
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                 <span className="text-red-500">Settings</span>
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-zinc-400">
                Customize your workspace identity, billing logic, and administrative preferences across the entire platform.
              </p>
            </div>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="grid gap-8 xl:grid-cols-[1.5fr_0.85fr]">
            <div className="space-y-8">
                {/* Business Identity Card */}
                <section className="relative overflow-hidden rounded-[2rem] border border-red-950/60 bg-red-950/10 p-6 backdrop-blur-xl sm:p-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
                            <Building2 size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Business Identity</h2>
                            <p className="text-sm text-zinc-500">Define how your organization appears to clients.</p>
                        </div>
                    </div>
                    
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-red-400/70">Workspace Display Name</label>
                            <input value={formState.workspaceName} onChange={(event) => handleFieldChange("workspaceName", event.target.value)} className={fieldClassName} placeholder="Acme Corp" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-red-400/70">Contact Email</label>
                            <input type="email" value={formState.workspaceEmail} onChange={(event) => handleFieldChange("workspaceEmail", event.target.value)} className={fieldClassName} placeholder="billing@acme.com" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-red-400/70">Primary Phone</label>
                            <input value={formState.workspacePhone} onChange={(event) => handleFieldChange("workspacePhone", event.target.value)} className={fieldClassName} placeholder="+1 (555) 000-0000" />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-red-400/70">Registered Address</label>
                            <textarea rows={3} value={formState.workspaceAddress} onChange={(event) => handleFieldChange("workspaceAddress", event.target.value)} className={`${fieldClassName} rounded-3xl resize-none`} placeholder="123 Growth Way, Tech Valley, CA" />
                        </div>
                    </div>
                </section>

                {/* Billing Logic Card */}
                <section className="relative overflow-hidden rounded-[2rem] border border-red-950/60 bg-red-950/10 p-6 backdrop-blur-xl sm:p-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
                            <CreditCard size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Billing Defaults</h2>
                            <p className="text-sm text-zinc-500">Pre-configure your invoice and tax settings.</p>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-red-400/70">Default Currency (ISO)</label>
                            <input value={formState.defaultCurrency} onChange={(event) => handleFieldChange("defaultCurrency", event.target.value.toUpperCase())} className={fieldClassName} placeholder="USD" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-red-400/70">Global Tax Rate (%)</label>
                            <input type="number" min="0" step="0.01" value={formState.defaultTaxRate} onChange={(event) => handleFieldChange("defaultTaxRate", Number(event.target.value))} className={fieldClassName} placeholder="0.00" />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-red-400/70">Standard Payment Terms</label>
                            <input value={formState.paymentTerms} onChange={(event) => handleFieldChange("paymentTerms", event.target.value)} className={fieldClassName} placeholder="Net 30 days" />
                        </div>
                    </div>
                </section>

                {/* Interface card */}
                 <section className="relative overflow-hidden rounded-[2rem] border border-red-950/60 bg-red-950/10 p-6 backdrop-blur-xl sm:p-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
                            <Sparkles size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Interface Customization</h2>
                            <p className="text-sm text-zinc-500">Adjust the visual density and behavior of the app.</p>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Data Density</label>
                            <div className="flex gap-2">
                                {(["comfortable", "compact"] as const).map((densityOption) => (
                                    <button key={densityOption} type="button" onClick={() => handleFieldChange("density", densityOption)} className={`flex-1 rounded-xl border py-3 text-xs font-bold transition-all ${formState.density === densityOption ? "border-red-600/50 bg-red-950/50 text-white shadow-[0_0_20px_rgba(239,68,68,0.1)]" : "border-red-950/60 bg-black/20 text-zinc-500 hover:text-zinc-300"}`}>
                                        {densityOption[0].toUpperCase() + densityOption.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center justify-between gap-4 rounded-2xl border border-red-950/60 bg-black/20 p-5">
                            <div>
                                <p className="text-sm font-bold text-white">Dynamic Greeting</p>
                                <p className="text-[10px] text-zinc-500">Show hello on dashboard</p>
                            </div>
                            <button type="button" onClick={() => handleFieldChange("showDashboardGreeting", !formState.showDashboardGreeting)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${formState.showDashboardGreeting ? "bg-red-500" : "bg-red-950/60"}`}>
                                <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${formState.showDashboardGreeting ? "translate-x-6" : "translate-x-1"}`} />
                            </button>
                        </div>
                    </div>
                </section>
            </div>

            <aside className="space-y-8">
                {/* Live Preview Card */}
                <section className="relative overflow-hidden rounded-[2.5rem] border border-red-950/60 bg-linear-to-br from-red-950/40 via-red-950/10 to-transparent p-8">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-red-500 mb-6">Live Workspace Preview</h2>
                    
                    <div className="relative rounded-[2rem] border border-red-900/40 bg-black/40 p-6 shadow-2xl overflow-hidden group">
                        <div className="absolute inset-0 bg-linear-to-br from-red-500/5 to-transparent pointer-events-none" />
                        <div className="relative flex flex-col items-center text-center gap-6">
                            <div className="flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-linear-to-br from-red-500 to-red-800 text-3xl font-bold text-white shadow-xl group-hover:scale-105 transition-transform">
                                {formState.workspaceName.charAt(0) || "F"}
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold text-white">{formState.workspaceName || "Untitled Workspace"}</h3>
                                <p className="text-xs font-semibold text-red-500/80 uppercase tracking-widest">Active Partner</p>
                            </div>
                            <div className="h-px w-full bg-linear-to-r from-transparent via-red-900/50 to-transparent" />
                            <div className="w-full space-y-3">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-zinc-500">Contact Point</span>
                                    <span className="text-zinc-200 truncate max-w-[140px]">{formState.workspaceEmail || "—"}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-zinc-500">Currency</span>
                                    <span className="text-zinc-200">{formState.defaultCurrency}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p className="mt-6 text-xs text-center text-zinc-500 italic">This is how your workspace profile appears in summaries.</p>
                </section>

                {/* Status & Actions Card */}
                <section className="rounded-[2.5rem] border border-red-950/60 bg-black/20 p-8 space-y-6">
                    <div className="p-4 rounded-2xl bg-red-900/10 border border-red-900/30">
                         <div className="flex items-center gap-3 mb-2">
                            <div className={`h-2 w-2 rounded-full ${hasUnsavedChanges ? "bg-amber-500 animate-pulse" : "bg-emerald-500"}`} />
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">System Status</span>
                         </div>
                         <p className="text-sm font-medium text-zinc-300 leading-relaxed">{saveMessage}</p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <button type="submit" className="group relative flex items-center justify-center gap-3 rounded-2xl bg-white px-8 py-4 text-sm font-bold text-black transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed" disabled={!hasUnsavedChanges}>
                            <Save size={18} />
                            Save Changes
                        </button>
                        <button type="button" onClick={handleReset} className="group flex items-center justify-center gap-3 rounded-2xl border border-red-900/40 bg-red-950/20 px-8 py-4 text-sm font-bold text-red-400 transition-all hover:bg-red-900/40 active:scale-95 uppercase tracking-widest text-[10px]">
                            <RefreshCcw size={16} />
                            Reset Defaults
                        </button>
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
