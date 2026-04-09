'use client'
import { createContext, useContext, useSyncExternalStore } from "react";

export interface Contact {
    id: number;
    name: string;
    email: string;
    phone: string;
    company: string;
    createdAt?: string;
}

export interface ContactInput {
    name: string;
    email: string;
    phone: string;
    company: string;
}

interface ContactContextValue {
    contacts: Contact[];
    addContact: (contact: ContactInput) => void;
    updateContact: (id: number, updatedContact: ContactInput) => void;
    deleteContact: (id: number) => void;
}

const ContactContext = createContext<ContactContextValue | null>(null);

const CONTACTS_STORAGE_KEY = "contacts";
const CONTACTS_STORAGE_EVENT = "flowtrack:contacts-updated";
const EMPTY_CONTACTS: Contact[] = [];

let cachedContactsRaw: string | null = null;
let cachedContacts: Contact[] = EMPTY_CONTACTS;

const normalizeContact = (value: unknown): Contact | null => {
    if (!value || typeof value !== "object") {
        return null;
    }

    const rawContact = value as Partial<Contact>;

    if (typeof rawContact.id !== "number" || typeof rawContact.name !== "string") {
        return null;
    }

    return {
        id: rawContact.id,
        name: rawContact.name,
        email: typeof rawContact.email === "string" ? rawContact.email : "",
        phone: typeof rawContact.phone === "string" ? rawContact.phone : "",
        company: typeof rawContact.company === "string" ? rawContact.company : "",
        createdAt: typeof rawContact.createdAt === "string" ? rawContact.createdAt : undefined,
    };
};

const readContacts = (): Contact[] => {
    if (typeof window === "undefined") {
        return EMPTY_CONTACTS;
    }

    const savedContacts = window.localStorage.getItem(CONTACTS_STORAGE_KEY);

    if (!savedContacts) {
        cachedContactsRaw = null;
        cachedContacts = EMPTY_CONTACTS;
        return cachedContacts;
    }

    if (savedContacts === cachedContactsRaw) {
        return cachedContacts;
    }

    try {
        const parsedContacts = JSON.parse(savedContacts);

        if (!Array.isArray(parsedContacts)) {
            cachedContactsRaw = null;
            cachedContacts = EMPTY_CONTACTS;
            return cachedContacts;
        }

        cachedContactsRaw = savedContacts;
        cachedContacts = parsedContacts
            .map(normalizeContact)
            .filter((contact): contact is Contact => contact !== null);
        return cachedContacts;
    } catch {
        window.localStorage.removeItem(CONTACTS_STORAGE_KEY);
        cachedContactsRaw = null;
        cachedContacts = EMPTY_CONTACTS;
        return cachedContacts;
    }
};

const subscribeToContacts = (callback: () => void) => {
    if (typeof window === "undefined") {
        return () => undefined;
    }

    const handleStorageChange = () => {
        callback();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(CONTACTS_STORAGE_EVENT, handleStorageChange);

    return () => {
        window.removeEventListener("storage", handleStorageChange);
        window.removeEventListener(CONTACTS_STORAGE_EVENT, handleStorageChange);
    };
};

const saveContacts = (contacts: Contact[]) => {
    const serializedContacts = JSON.stringify(contacts);

    cachedContactsRaw = serializedContacts;
    cachedContacts = contacts;

    window.localStorage.setItem(CONTACTS_STORAGE_KEY, serializedContacts);
    window.dispatchEvent(new Event(CONTACTS_STORAGE_EVENT));
};

export const ContactProvider = ({ children }: { children: React.ReactNode }) => {
    const contacts = useSyncExternalStore(subscribeToContacts, readContacts, () => EMPTY_CONTACTS);

    const addContact = (contact: ContactInput) => {
        saveContacts([
            ...contacts,
            {
                id: Date.now(),
                ...contact,
                createdAt: new Date().toISOString(),
            },
        ]);
    };

    const updateContact = (id: number, updatedContact: ContactInput) => {
        saveContacts(
            contacts.map((contact) =>
                contact.id === id ? { ...contact, ...updatedContact } : contact
            )
        );
    };

    const deleteContact = (id: number) => {
        saveContacts(
            contacts.filter((contact) => contact.id !== id)
        );
    };

    return (
        <ContactContext.Provider value={{ contacts, addContact, updateContact, deleteContact }}>
            {children}
        </ContactContext.Provider>
    );
};

export const useContacts = () => {
    const context = useContext(ContactContext);

    if (!context) {
        throw new Error("useContacts must be used within a ContactProvider");
    }

    return context;
};
