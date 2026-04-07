"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import AdminNav from "@/components/admin/AdminNav";
import { AdminMobileNav } from "@/components/admin/AdminNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.replace("/auth/login");
    } else if (status === "authenticated" && (session?.user as any)?.role !== "ADMIN") {
      window.location.replace("/dashboard");
    }
  }, [status, session]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-amber-400 text-xl animate-pulse">⛏ Loading...</div>
      </div>
    );
  }

  if ((session?.user as any)?.role !== "ADMIN") return null;

  return (
    <div className="flex min-h-screen bg-black">
      <AdminMobileNav />
      <aside className="hidden lg:block w-56 bg-gray-900 border-r border-gray-800 p-4">
        <div className="text-amber-400 font-bold text-lg mb-6 px-3">⛏ Admin</div>
        <AdminNav />
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
