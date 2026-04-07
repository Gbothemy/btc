import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardSidebar from "@/components/layout/DashboardSidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/auth/login");

  return (
    <div className="flex min-h-screen bg-black">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto lg:ml-0">
        <div className="pt-14 lg:pt-0 p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
