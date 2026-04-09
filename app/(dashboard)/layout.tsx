import DashboardSidebar from "@/components/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col gap-4 p-2 md:flex-row md:gap-10 md:p-0">
      <DashboardSidebar />
      <main className="w-full flex-1 px-2 pb-6 pt-2 md:px-0 md:py-10 md:pr-10">
        {children}
      </main>
    </div>
  );
}
