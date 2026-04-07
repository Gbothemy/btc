"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import DashboardSidebar from "@/components/layout/DashboardSidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.replace("/auth/login");
    }
  }, [status]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-amber-400 text-xl animate-pulse">⛏ Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-black">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
