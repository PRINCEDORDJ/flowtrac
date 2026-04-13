import type { Metadata } from "next";
import "./globals.css";
import { ContactProvider } from "@/context/ContactContext";
import { InvoiceProvider } from "@/context/InvoiceContext";
import { SettingsProvider } from "@/context/SettingsContext";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/next";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "FlowTrack",
  description: "Track your workflow with precision.",
  openGraph: {
    title: "FlowTrack",
    description: "Track your workflow with precision.",
    siteName: "FlowTrack",
  },
};

// Add meta tags manually as per user rules
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable, "dark")}>
      <head>
        <meta property="og:site_name" content="FlowTrack" />
        <meta property="description" content="Track your workflow with precision." />
      </head>
      <body className="min-h-screen max-w-full bg-[rgb(16,12,12)] text-white antialiased">
        <ContactProvider>
          <SettingsProvider>
            <InvoiceProvider>
                {children}
            </InvoiceProvider>
          </SettingsProvider>
        </ContactProvider>
        <Analytics />
      </body>
    </html>
  );
}
