'use client'
import { createContext, useContext, useEffect, useState } from "react";
import { getContacts, addContactAction, updateContactAction, deleteContactAction } from "@/lib/actions/contacts";

export interface Contact {
    id: number;
    name: string;
    email: string;
    phone: string;
    company: string;
    createdAt?: Date | string;
}

export interface ContactInput {
    name: string;
    email: string;
    phone: string;
    company: string;
}

interface ContactContextValue {
    contacts: Contact[];
    isLoading: boolean;
    addContact: (contact: ContactInput) => Promise<void>;
    updateContact: (id: number, updatedContact: ContactInput) => Promise<void>;
    deleteContact: (id: number) => Promise<void>;
}

const ContactContext = createContext<ContactContextValue | null>(null);

export const ContactProvider = ({ children }: { children: React.ReactNode }) => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadContacts = async () => {
            try {
                const data = await getContacts();
                setContacts(data as Contact[]);
            } catch (error) {
                console.error("Failed to load contacts:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadContacts();
    }, []);

    const addContact = async (contact: ContactInput) => {
        // Optimistic update
        const tempId = Date.now();
        const optimisticContact: Contact = {
            id: tempId,
            ...contact,
            createdAt: new Date().toISOString(),
        };
        setContacts((prev) => [optimisticContact, ...prev]);

        const result = await addContactAction(contact);
        if (result.success && result.contact) {
            // Replace optimistic contact with real one
            setContacts((prev) => 
                prev.map((c) => c.id === tempId ? (result.contact as Contact) : c)
            );
        } else {
            // Revert on failure
            setContacts((prev) => prev.filter((c) => c.id !== tempId));
        }
    };

    const updateContact = async (id: number, updatedContact: ContactInput) => {
        const previousContacts = [...contacts];
        // Optimistic update
        setContacts((prev) =>
            prev.map((contact) =>
                contact.id === id ? { ...contact, ...updatedContact } : contact
            )
        );

        const result = await updateContactAction(id, updatedContact);
        if (!result.success) {
            // Revert on failure
            setContacts(previousContacts);
        }
    };

    const deleteContact = async (id: number) => {
        const previousContacts = [...contacts];
        // Optimistic update
        setContacts((prev) => prev.filter((contact) => contact.id !== id));

        const result = await deleteContactAction(id);
        if (!result.success) {
            // Revert on failure
            setContacts(previousContacts);
        }
    };

    return (
        <ContactContext.Provider value={{ contacts, isLoading, addContact, updateContact, deleteContact }}>
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
