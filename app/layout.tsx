import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ContactProvider } from "@/context/ContactContext";
import { InvoiceProvider } from "@/context/InvoiceContext";
import { SettingsProvider } from "@/context/SettingsContext";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "FLOWTRACK",
  description: "A task management app built with Next.js and Tailwind CSS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="min-h-screen max-w-full overflow-x-hidden">
        <ContactProvider>
          <SettingsProvider>
            <InvoiceProvider>
              <div className="flex min-h-screen flex-col gap-4 p-2 md:flex-row md:gap-10 md:p-0">
                <Navbar />
                <main className="w-full flex-1 px-2 pb-6 pt-2 md:px-0 md:py-10 md:pr-10">
                  {children}
                </main>
              </div>
            </InvoiceProvider>
          </SettingsProvider>
        </ContactProvider>
      </body>
    </html>
  );
}
