'use client'
import { useContacts, type Contact, type ContactInput } from '@/context/ContactContext'
import { Building2, Mail, Phone, UserRound, X } from 'lucide-react'
import { useState, type Dispatch, type FormEvent, type SetStateAction } from 'react'

interface AddProps {
    setOpen: Dispatch<SetStateAction<boolean>>;
    editingContact: Contact | null;
    clearEditingContact: () => void;
}

const emptyForm: ContactInput = {
    name: "",
    email: "",
    phone: "",
    company: "",
};

const fieldBaseClassName = "w-full rounded-2xl border border-red-900/70 bg-black/15 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 transition focus:border-red-600 focus:bg-red-950/30 focus:outline-none focus:ring-2 focus:ring-red-800/60 sm:text-base";

const Add = ({ setOpen, editingContact, clearEditingContact }: AddProps) => {
    const { addContact, updateContact } = useContacts();
    const [formData, setFormData] = useState<ContactInput>(() =>
        editingContact
            ? {
                name: editingContact.name,
                email: editingContact.email,
                phone: editingContact.phone,
                company: editingContact.company,
            }
            : emptyForm
    );

    const handleChange = (field: keyof ContactInput, value: string) => {
        setFormData((currentForm) => ({
            ...currentForm,
            [field]: value,
        }));
    };

    const handleClose = () => {
        clearEditingContact();
        setOpen(false);
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmedForm = {
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            company: formData.company.trim(),
        };

        if (editingContact) {
            updateContact(editingContact.id, trimmedForm);
        } else {
            addContact(trimmedForm);
        }

        setFormData(emptyForm);
        handleClose();
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4 py-8 sm:px-6 sm:py-10">
        <form
          onSubmit={handleSubmit}
          className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-red-900/60 bg-linear-to-br from-red-950/90 via-red-950/75 to-black/55 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-red-400/60 to-transparent" />

          <div className="flex items-start justify-between gap-4 border-b border-red-950/60 px-5 pb-5 pt-5 sm:px-7 sm:pb-6 sm:pt-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-300/60">
                {editingContact ? "Update Contact" : "New Contact"}
              </p>
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-zinc-50 sm:text-3xl">
                  {editingContact ? "Refresh contact details" : "Add a new contact"}
                </h1>
                <p className="max-w-xl text-sm leading-6 text-zinc-400">
                  Save the core details you need to keep this person visible inside Flowtrack.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-red-900/70 bg-red-950/35 text-zinc-200 transition hover:bg-red-900/40"
              aria-label="Close add contact form"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid gap-6 px-5 py-6 sm:px-7 sm:py-7">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-3">
                <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-red-300/65">
                  <UserRound size={14} />
                  Name
                </span>
                <input
                  type="text"
                  placeholder="Jane Cooper"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(event) => handleChange("name", event.target.value)}
                  className={fieldBaseClassName}
                />
              </label>

              <label className="space-y-3">
                <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-red-300/65">
                  <Mail size={14} />
                  Email
                </span>
                <input
                  type="email"
                  id="email"
                  required
                  placeholder="jane@company.com"
                  value={formData.email}
                  onChange={(event) => handleChange("email", event.target.value)}
                  className={fieldBaseClassName}
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-3">
                <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-red-300/65">
                  <Phone size={14} />
                  Contact
                </span>
                <input
                  type="text"
                  placeholder="+1 (555) 000-0000"
                  required
                  value={formData.phone}
                  onChange={(event) => handleChange("phone", event.target.value)}
                  className={fieldBaseClassName}
                />
              </label>

              <label className="space-y-3">
                <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-red-300/65">
                  <Building2 size={14} />
                  Company
                </span>
                <input
                  type="text"
                  placeholder="Northwind Labs"
                  required
                  value={formData.company}
                  onChange={(event) => handleChange("company", event.target.value)}
                  className={fieldBaseClassName}
                />
              </label>
            </div>

            <div className="rounded-3xl border border-red-950/60 bg-black/10 px-4 py-4 text-sm leading-6 text-zinc-400 sm:px-5">
              The contact will appear in your dashboard metrics and your recent contact details section as soon as it is saved.
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-red-950/60 px-5 py-5 sm:flex-row sm:justify-end sm:px-7 sm:py-6">
            <button
              type="button"
              onClick={handleClose}
              className="inline-flex w-full items-center justify-center rounded-2xl border border-red-900/70 bg-transparent px-5 py-3 text-sm font-medium text-zinc-200 transition hover:bg-red-950/30 sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-2xl bg-red-800 px-6 py-3 text-sm font-semibold text-zinc-50 shadow-[0_10px_30px_rgba(127,29,29,0.35)] transition hover:bg-red-700 sm:w-auto"
            >
              {editingContact ? "Save changes" : "Save contact"}
            </button>
          </div>
        </form>
      </div>
    );
}

export default Add
