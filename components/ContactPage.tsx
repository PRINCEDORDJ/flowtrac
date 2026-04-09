'use client'
import Add from "@/app/contact/Add/page";
import { useContacts, type Contact } from "@/context/ContactContext";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
    const [open, setOpen] = useState<boolean>(false)
    const [editingContact, setEditingContact] = useState<Contact | null>(null);
    const { contacts, deleteContact } = useContacts();

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
        <div className="flex items-center justify-between gap-4 pt-3">
                <h1 className="text-2xl font-bold sm:text-3xl">Contacts</h1>
                <button onClick={handleCreate} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-red-900 bg-red-950/40 backdrop-blur-sm transition hover:bg-red-900/30">
                    <Plus />
                </button>
            </div>

            {contacts.length === 0 ? (
                <div className="rounded-2xl border border-red-950/60 bg-red-950/30 px-5 py-8 text-sm text-zinc-400 backdrop-blur-sm">
                    No contacts yet. Use the add button to create your first contact.
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {contacts.map((contact) => (
                        <article key={contact.id} className="space-y-4 rounded-2xl border border-red-950/60 bg-red-950/30 p-5 backdrop-blur-sm">
                            <div className="space-y-1">
                                <h2 className="text-lg font-semibold text-zinc-100">{contact.name}</h2>
                                <p className="text-sm text-zinc-300">{contact.email}</p>
                            </div>
                            <div className="space-y-1 text-sm text-zinc-400">
                                <p>{contact.phone}</p>
                                <p>{contact.company}</p>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => handleEdit(contact)}
                                    className="inline-flex items-center gap-2 rounded-lg bg-red-900/70 px-4 py-2 text-sm font-medium transition hover:bg-red-800"
                                >
                                    <Pencil size={16} />
                                    Edit
                                </button>
                                <button
                                    onClick={() => deleteContact(contact.id)}
                                    className="inline-flex items-center gap-2 rounded-lg bg-red-700/80 px-4 py-2 text-sm font-medium transition hover:bg-red-600"
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
