import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";
import { AdminMobileNav } from "@/components/admin/AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") redirect("/dashboard");

  return (
    <div className="flex min-h-screen bg-black">
      {/* Mobile nav */}
      <AdminMobileNav />

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-56 bg-gray-900 border-r border-gray-800 p-4">
        <div className="text-amber-400 font-bold text-lg mb-6 px-3">⛏ Admin</div>
        <AdminNav />
      </aside>

      <main className="flex-1 pt-14 lg:pt-0 p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}
