'use client'
import Link from "next/link";
import { Building2, Mail, MoveRight, Phone, UserRound } from "lucide-react";
import { useContacts } from '@/context/ContactContext';

const formatCreatedAt = (createdAt?: string | Date) => {
    if (!createdAt) {
        return "Saved contact";
    }

    const parsedDate = new Date(createdAt);

    if (Number.isNaN(parsedDate.getTime())) {
        return "Saved contact";
    }

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(parsedDate);
};

export default function ContactDetails() {
    const { contacts } = useContacts();

    const recentContacts = [...contacts]
        .sort((firstContact, secondContact) => {
            const firstTimestamp = firstContact.createdAt ? new Date(firstContact.createdAt).getTime() : 0;
            const secondTimestamp = secondContact.createdAt ? new Date(secondContact.createdAt).getTime() : 0;

            return secondTimestamp - firstTimestamp;
        })
        .slice(0, 4);

    return (
      <section className="space-y-5 rounded-[1.75rem] border border-red-950/60 bg-red-950/25 p-5 backdrop-blur-md sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-300/60">Contact Spotlight</p>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-zinc-50">Recent Contact Details</h2>
              <p className="max-w-2xl text-sm leading-6 text-zinc-400">
                A quick look at the latest people in your workspace, with the details you’re most likely to need next.
              </p>
            </div>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 self-start rounded-full border border-red-800/70 bg-red-900/30 px-4 py-2 text-sm font-medium text-zinc-100 transition hover:bg-red-800/50"
          >
            Manage Contacts
            <MoveRight size={16} />
          </Link>
        </div>

        {recentContacts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-red-900/60 bg-black/10 px-5 py-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-900/60 bg-red-950/40 text-red-200">
              <UserRound size={24} />
            </div>
            <div className="mt-4 space-y-2">
              <h3 className="text-lg font-semibold text-zinc-100">No contacts yet</h3>
              <p className="text-sm leading-6 text-zinc-400">
                Once you add contacts, their latest details will appear here for quick review.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {recentContacts.map((contact) => (
              <article
                key={contact.id}
                className="group rounded-3xl border border-red-950/70 bg-linear-to-br from-red-950/55 via-red-950/35 to-black/15 p-5 transition hover:border-red-800/70 hover:bg-red-950/45 sm:p-6"
              >
                <div className="flex h-full flex-col gap-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-red-300/65">
                        {formatCreatedAt(contact.createdAt)}
                      </p>
                      <div className="space-y-1">
                        <h3 className="text-xl font-semibold text-zinc-50">{contact.name}</h3>
                        <p className="text-sm text-zinc-400">
                          {contact.company.trim() || "No company added"}
                        </p>
                      </div>
                    </div>

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-900/70 bg-red-900/25 text-red-200">
                      <UserRound size={22} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-red-950/60 bg-black/10 p-4">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-red-300/60">
                        <Mail size={14} />
                        Email
                      </div>
                      <p className="mt-3 wrap-break-word text-sm leading-6 text-zinc-200">
                        {contact.email.trim() || "No email added"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-red-950/60 bg-black/10 p-4">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-red-300/60">
                        <Phone size={14} />
                        Phone
                      </div>
                      <p className="mt-3 text-sm leading-6 text-zinc-200">
                        {contact.phone.trim() || "No phone added"}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-red-950/60 bg-black/10 p-4">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-red-300/60">
                      <Building2 size={14} />
                      Company
                    </div>
                    <p className="mt-3 text-sm leading-6 text-zinc-200">
                      {contact.company.trim() || "No company added"}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    );
}
