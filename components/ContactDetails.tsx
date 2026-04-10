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
      <section className="relative overflow-hidden rounded-[2.5rem] border border-red-950/50 bg-linear-to-b from-red-950/30 via-red-950/15 to-black/20 p-6 backdrop-blur-xl sm:p-10">
        {/* Background Decorative Element */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-red-600/5 blur-[100px]" />
        
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-900/30 bg-red-950/40 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-red-400">
              <span className="flex h-1 w-1 rounded-full bg-red-500 animate-pulse" />
              Recent Network
            </div>
            <div className="space-y-1">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Contact <span className="text-red-500">Spotlight</span>
              </h2>
              <p className="max-w-xl text-sm leading-7 text-zinc-400">
                A curated view of your most recent connections and their essential details.
              </p>
            </div>
          </div>

          <Link
            href="/contact"
            className="group relative flex items-center gap-2 self-start overflow-hidden rounded-2xl bg-white px-6 py-3 text-sm font-bold text-black transition-all hover:pr-8 active:scale-95"
          >
            <span className="relative z-10">Manage Contacts</span>
            <MoveRight 
              size={18} 
              className="absolute right-3 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" 
            />
          </Link>
        </div>

        <div className="relative mt-10">
          {recentContacts.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[2.5rem] border border-dashed border-red-900/30 bg-black/20 p-8 text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 animate-ping rounded-full bg-red-500/20" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-red-800/40 bg-red-950/50 text-red-400 shadow-[0_0_30px_rgba(239,68,68,0.15)]">
                  <UserRound size={32} strokeWidth={1.5} />
                </div>
              </div>
              <div className="max-w-xs space-y-2">
                <h3 className="text-xl font-bold text-white">Your circle is empty</h3>
                <p className="text-sm leading-relaxed text-zinc-500">
                  Begin adding contacts to see your recent network activity highlighted here.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {recentContacts.map((contact) => (
                <article
                  key={contact.id}
                  className="group relative overflow-hidden rounded-[2rem] border border-red-950/60 bg-linear-to-br from-red-950/40 via-red-950/10 to-transparent p-6 transition-all duration-500 hover:-translate-y-1 hover:border-red-500/40 hover:bg-red-950/30 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]"
                >
                  <div className="absolute inset-0 translate-x-[-100%] bg-linear-to-r from-transparent via-red-500/5 to-transparent transition-transform duration-1000 group-hover:translate-x-[100%]" />
                  
                  <div className="relative flex flex-col gap-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-red-900/40 bg-linear-to-br from-red-600/10 to-red-950/50 text-red-400 shadow-inner group-hover:border-red-500/50 group-hover:text-red-300">
                          <UserRound size={24} />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-xl font-bold text-white group-hover:text-red-50">{contact.name}</h3>
                          <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
                            <Building2 size={12} className="text-red-500" />
                            {contact.company.trim() || "Independent"}
                          </div>
                        </div>
                      </div>
                      <span className="rounded-full border border-red-900/30 bg-red-950/40 px-3 py-1 text-[10px] font-bold text-red-300/60">
                        {formatCreatedAt(contact.createdAt)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-red-950/40 bg-black/20 p-4 transition-colors group-hover:bg-black/30">
                        <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-red-400/70">
                          <Mail size={12} />
                          Email Address
                        </div>
                        <p className="truncate text-sm font-medium text-zinc-300 group-hover:text-zinc-100">
                          {contact.email.trim() || "—"}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-red-950/40 bg-black/20 p-4 transition-colors group-hover:bg-black/30">
                        <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-red-400/70">
                          <Phone size={12} />
                          Phone Number
                        </div>
                        <p className="truncate text-sm font-medium text-zinc-300 group-hover:text-zinc-100">
                          {contact.phone.trim() || "—"}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    );
}
