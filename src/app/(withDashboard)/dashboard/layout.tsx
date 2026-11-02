import Sidebar from "@/components/Sidebar";
import type { Metadata } from "next";
import { getCurrentUser } from "@/service/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Portfolio Dashboard",
  description: "Portfolio Dashboard",
};

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-slate-50 p-3 sm:p-5">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-64">
          <Sidebar />
        </aside>
        <main className="min-w-0 flex-1 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          {children}
        </main>
      </div>
    </div>
  );
}
