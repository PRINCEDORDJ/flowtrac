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
    <div className="relative w-full space-y-6 md:space-y-8">
      <div className="flex flex-col gap-4 rounded-[2rem] border border-red-950/60 bg-red-950/20 p-5 shadow-[0_20px_90px_rgba(0,0,0,0.24)] backdrop-blur-xl sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-900/50 bg-red-900/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-red-200/80">
            <Users size={14} />
            Contacts hub
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
              Contacts
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
              Manage your people, right from the contacts page. Search, filter,
              and update contact details in one polished workspace.
            </p>
          </div>
        </div>

        <button
          onClick={handleCreate}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-800 px-5 py-3 text-sm font-semibold text-zinc-100 shadow-[0_12px_30px_rgba(158,25,25,0.4)] transition hover:bg-red-700"
        >
          <Plus size={18} />
          Add Contact
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-red-950/60 bg-red-950/25 p-5 backdrop-blur-md">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-red-300/65">
            Overview
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-zinc-100">
            Quick insights
          </h2>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            {totalContactsLabel}
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl bg-black/10 p-4 text-sm">
              <p className="text-xs uppercase tracking-[0.25em] text-red-300/65">
                Companies
              </p>
              <p className="mt-3 text-2xl font-semibold text-zinc-50">
                {uniqueCompanies}
              </p>
            </div>
            <div className="rounded-3xl bg-black/10 p-4 text-sm">
              <p className="text-xs uppercase tracking-[0.25em] text-red-300/65">
                Saved contacts
              </p>
              <p className="mt-3 text-2xl font-semibold text-zinc-50">
                {updatedRecently}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-red-950/60 bg-red-950/25 p-5 backdrop-blur-md">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-red-300/65">
                Search
              </p>
              <h2 className="mt-2 text-lg font-semibold text-zinc-100">
                Find contacts
              </h2>
            </div>
            <Filter size={18} className="text-red-300/80" />
          </div>
          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="sr-only">Search contacts</span>
              <div className="flex items-center gap-3 rounded-2xl border border-red-900/70 bg-black/15 px-4 py-3 text-zinc-100 focus-within:border-red-600 focus-within:ring-2 focus-within:ring-red-800/50">
                <Search size={16} className="text-red-300/80" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search by name, email, or company"
                  className="w-full bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
                />
              </div>
            </label>

            <label className="block text-sm text-zinc-300">
              Company filter
              <div className="mt-3">
                <Select value={companyFilter} onValueChange={setCompanyFilter}>
                  <SelectTrigger className="w-full" size="default">
                    <SelectValue placeholder="All companies" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company} value={company}>
                        {company === "all" ? "All companies" : company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </label>
          </div>
        </div>

        <div className="rounded-3xl border border-red-950/60 bg-red-950/25 p-5 backdrop-blur-md">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-red-300/65">
                Status
              </p>
              <h2 className="mt-2 text-lg font-semibold text-zinc-100">
                Current view
              </h2>
            </div>
            <div className="rounded-2xl bg-red-900/15 px-3 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-red-200">
              {filteredContacts.length} shown
            </div>
          </div>
          <div className="mt-5 space-y-4 text-sm text-zinc-400">
            <p>
              {contacts.length === 0
                ? "Add your first contact to populate this page."
                : filteredContacts.length === 0
                  ? "No contacts match the current search and filter."
                  : `${filteredContacts.length} contact${filteredContacts.length === 1 ? "" : "s"} match your search.`}
            </p>
            <div className="rounded-3xl border border-red-950/60 bg-black/10 p-4 text-zinc-200">
              <div className="flex items-center gap-2 text-sm text-zinc-100">
                <CheckCircle2 size={16} className="text-red-300" />
                <span>Keep contact records concise and up to date.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {contacts.length === 0 ? (
        <div className="rounded-[2rem] border border-red-950/60 bg-red-950/30 px-6 py-10 text-zinc-300 backdrop-blur-sm sm:px-8">
          <div className="max-w-2xl space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-300/70">
              No contacts yet
            </p>
            <h2 className="text-3xl font-bold text-zinc-100">
              Start building your contact network.
            </h2>
            <p className="text-sm leading-7 text-zinc-400">
              Save contacts from your team, clients, and partners. Use the add
              button to begin capturing names, emails, phones, and company
              details.
            </p>
          </div>
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="rounded-[2rem] border border-red-950/60 bg-red-950/30 px-6 py-10 text-zinc-300 backdrop-blur-sm sm:px-8">
          <div className="max-w-2xl space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-300/70">
              No results
            </p>
            <h2 className="text-3xl font-bold text-zinc-100">
              No contacts found
            </h2>
            <p className="text-sm leading-7 text-zinc-400">
              Try changing your search term or selecting a different company
              filter to find the contact you want.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredContacts.map((contact) => (
            <article
              key={contact.id}
              className="group overflow-hidden rounded-[1.75rem] border border-red-950/65 bg-red-950/25 p-6 transition hover:-translate-y-1 hover:border-red-800/80 hover:bg-red-950/40"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-zinc-50">
                    {contact.name}
                  </h2>
                  <p className="mt-1 text-sm text-zinc-400">
                    {contact.company || "No company"}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-3xl border border-red-900/70 bg-red-900/20 text-red-200">
                  <Users size={20} />
                </div>
              </div>

              <div className="mt-5 space-y-4 text-sm text-zinc-300">
                <div className="rounded-3xl border border-red-950/60 bg-black/10 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-red-300/65">
                    Email
                  </p>
                  <p className="mt-2 break-words text-sm leading-6 text-zinc-100">
                    {contact.email || "No email"}
                  </p>
                </div>
                <div className="rounded-3xl border border-red-950/60 bg-black/10 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-red-300/65">
                    Phone
                  </p>
                  <p className="mt-2 text-sm leading-6 text-zinc-100">
                    {contact.phone || "No phone"}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => handleEdit(contact)}
                  className="inline-flex items-center gap-2 rounded-2xl bg-red-900/80 px-4 py-2 text-sm font-medium text-zinc-100 transition hover:bg-red-800"
                >
                  <Pencil size={16} />
                  Edit
                </button>
                <button
                  onClick={() => deleteContact(contact.id)}
                  className="inline-flex items-center gap-2 rounded-2xl bg-transparent border border-red-900/70 px-4 py-2 text-sm font-medium text-zinc-100 transition hover:bg-red-900/25"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm">
          <Add
            key={editingContact?.id ?? "new"}
            setOpen={setOpen}
            editingContact={editingContact}
            clearEditingContact={clearEditingContact}
          />
        </div>
      )}
    </div>
  );
}
