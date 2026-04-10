"use client";
import Add from "@/app/(dashboard)/contact/Add/page";
import { useContacts, type Contact } from "@/context/ContactContext";
import {
  CheckCircle2,
  Filter,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ContactPage() {
  const [open, setOpen] = useState<boolean>(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [query, setQuery] = useState("");
  const [companyFilter, setCompanyFilter] = useState("all");
  const { contacts, deleteContact, isLoading } = useContacts();

  const companies = useMemo(
    () => [
      "all",
      ...Array.from(
        new Set(contacts.map((contact) => contact.company).filter(Boolean)),
      ),
    ],
    [contacts],
  );

  const filteredContacts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return contacts.filter((contact) => {
      const matchesQuery =
        contact.name.toLowerCase().includes(normalizedQuery) ||
        contact.email.toLowerCase().includes(normalizedQuery) ||
        contact.company.toLowerCase().includes(normalizedQuery);

      const matchesCompany =
        companyFilter === "all" || contact.company === companyFilter;

      return matchesQuery && matchesCompany;
    });
  }, [contacts, companyFilter, query]);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-900 border-t-red-500" />
        <p className="text-zinc-400">Loading contacts...</p>
      </div>
    );
  }

  const totalContactsLabel =
    contacts.length === 0
      ? "No contacts created yet. Add one to begin building your network."
      : `${contacts.length} contact${contacts.length === 1 ? "" : "s"} in your workspace.`;

  const uniqueCompanies = new Set(
    contacts.map((contact) => contact.company).filter(Boolean),
  ).size;
  const updatedRecently = contacts.filter(
    (contact) => contact.createdAt,
  ).length;

  const handleCreate = () => {
    setEditingContact(null);
    setOpen(true);
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setOpen(true);
  };

  const clearEditingContact = () => {
    setEditingContact(null);
  };

  return (
    <div className="relative w-full space-y-8 pb-10 md:space-y-12">
      {/* Page Header */}
      <section className="relative overflow-hidden rounded-[2.5rem] border border-red-950/50 bg-linear-to-b from-red-950/30 via-red-950/15 to-transparent p-6 sm:p-10">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-red-600/5 blur-[100px]" />
        
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
             <div className="inline-flex items-center gap-2 rounded-full border border-red-900/30 bg-red-950/40 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-red-400">
              <Users size={12} />
              Directory
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
              Workspace <span className="text-red-500">Contacts</span>
            </h1>
          </div>

          <button
            onClick={handleCreate}
            className="group relative flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-sm font-bold text-black transition-all hover:scale-[1.02] active:scale-95"
          >
            <Plus size={18} />
            Add Contact
          </button>
        </div>
      </section>

      {/* Insights & Filters Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick Insights */}
        <div className="relative overflow-hidden rounded-[2rem] border border-red-950/60 bg-red-950/10 p-6 backdrop-blur-xl sm:p-8">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-red-400">Workspace Health</h2>
          <p className="mt-2 text-xs text-zinc-500">{totalContactsLabel}</p>
          
          <div className="mt-8 grid gap-4">
            <div className="rounded-2xl border border-red-950/50 bg-black/20 p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Active Companies</p>
              <p className="mt-2 text-3xl font-bold text-white">{uniqueCompanies}</p>
            </div>
            <div className="rounded-2xl border border-red-950/50 bg-black/20 p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Record Coverage</p>
              <div className="mt-2 flex items-center gap-3">
                <p className="text-3xl font-bold text-white">{updatedRecently}</p>
                <div className="h-1.5 flex-1 rounded-full bg-red-950/50">
                   <div 
                    className="h-full rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] transition-all duration-1000" 
                    style={{ width: `${contacts.length > 0 ? (updatedRecently / contacts.length) * 100 : 0}%` }}
                   />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Interaction */}
        <div className="relative overflow-hidden rounded-[2rem] border border-red-950/60 bg-red-950/10 p-6 backdrop-blur-xl sm:p-8 lg:col-span-2">
          <div className="flex flex-col gap-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white">Find Contacts</h2>
              <p className="text-sm text-zinc-500">Narrow down your results by name, email, or organization.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-red-400" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Seach across workspace..."
                  className="w-full rounded-2xl border border-red-900/40 bg-black/20 py-4 pl-12 pr-4 text-sm text-white placeholder:text-zinc-600 focus:border-red-500/50 focus:outline-none focus:ring-4 focus:ring-red-500/10 transition-all"
                />
              </div>

              <div className="relative">
                <Select value={companyFilter} onValueChange={setCompanyFilter}>
                  <SelectTrigger className="h-full w-full rounded-2xl border-red-900/40 bg-black/20 py-4 text-white focus:ring-red-500/10" size="default">
                    <div className="flex items-center gap-2">
                      <Filter size={14} className="text-red-400" />
                      <SelectValue placeholder="All Companies" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-red-900/40 bg-red-950/95 text-white backdrop-blur-xl">
                    {companies.map((company) => (
                      <SelectItem key={company} value={company} className="rounded-xl focus:bg-red-900/40 focus:text-white">
                        {company === "all" ? "All Companies" : company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-red-950/20 p-4">
               <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-medium text-zinc-400">Current View Status</span>
               </div>
               <span className="text-xs font-bold uppercase tracking-widest text-red-500">{filteredContacts.length} items matched</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {contacts.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-[2.5rem] border border-dashed border-red-900/30 bg-black/10 p-12 text-center">
            <div className="relative mb-6">
                <div className="absolute inset-0 animate-ping rounded-full bg-red-500/20" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-red-800/40 bg-red-950/50 text-red-400 shadow-[0_0_30px_rgba(239,68,68,0.15)]">
                  <Plus size={32} />
                </div>
            </div>
            <div className="max-w-md space-y-3">
                <h3 className="text-2xl font-bold text-white">Your directory is empty</h3>
                <p className="text-sm leading-relaxed text-zinc-500">
                    Get started by adding your first contact. Each profile captures essential details like emails, phones, and company records.
                </p>
                <button onClick={handleCreate} className="mt-4 rounded-xl bg-red-900/20 px-6 py-2 text-sm font-bold text-red-400 hover:bg-red-900/40 transition-all">Add Your First Record</button>
            </div>
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[2.5rem] border border-red-950/30 bg-black/10 p-12 text-center">
             <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-red-900/40 bg-red-950/30 text-red-400/50 mb-6">
                <Search size={28} />
             </div>
             <h3 className="text-xl font-bold text-white">No matches found</h3>
             <p className="mt-2 text-sm text-zinc-500">We could not find any contacts matching your current search or filter. Try a different term.</p>
             <button onClick={() => {setQuery(""); setCompanyFilter("all");}} className="mt-6 text-sm font-bold text-red-500 hover:text-red-400">Clear all filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredContacts.map((contact) => (
            <article
              key={contact.id}
              className="group relative overflow-hidden rounded-[2rem] border border-red-950/60 bg-linear-to-br from-red-950/40 via-red-950/10 to-transparent p-6 transition-all duration-500 hover:-translate-y-1 hover:border-red-500/40 hover:bg-red-950/30 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]"
            >
              <div className="absolute inset-0 translate-x-[-100%] bg-linear-to-r from-transparent via-red-500/5 to-transparent transition-transform duration-1000 group-hover:translate-x-[100%]" />
              
              <div className="relative flex flex-col gap-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                     <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-red-900/40 bg-linear-to-br from-red-600/10 to-red-950/50 text-red-400 shadow-inner group-hover:border-red-500/50 group-hover:text-red-300">
                      <Users size={24} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold text-white group-hover:text-red-50">{contact.name}</h3>
                      <p className="flex items-center gap-2 text-xs font-medium text-zinc-500">
                        <span className="h-1 w-1 rounded-full bg-red-500" />
                        {contact.company || "Independent"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                     <button
                        onClick={() => handleEdit(contact)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-900/20 text-red-400 transition-all hover:bg-red-900/40 hover:text-white"
                        title="Edit Record"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => deleteContact(contact.id)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/20 text-zinc-500 transition-all hover:bg-red-950 hover:text-red-500"
                        title="Delete Record"
                      >
                        <Trash2 size={16} />
                      </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="rounded-2xl border border-red-950/40 bg-black/20 p-4 transition-colors group-hover:bg-black/30">
                    <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-red-400/70 mb-1">Email Connection</p>
                    <p className="truncate text-sm font-medium text-zinc-100">{contact.email || "—"}</p>
                  </div>
                  <div className="rounded-2xl border border-red-950/40 bg-black/20 p-4 transition-colors group-hover:bg-black/30">
                    <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-red-400/70 mb-1">Direct Phone</p>
                    <p className="truncate text-sm font-medium text-zinc-100">{contact.phone || "—"}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md">
           <div className="w-full max-w-2xl px-6">
              <Add
                key={editingContact?.id ?? "new"}
                setOpen={setOpen}
                editingContact={editingContact}
                clearEditingContact={clearEditingContact}
              />
           </div>
        </div>
      )}
    </div>
  );
}
