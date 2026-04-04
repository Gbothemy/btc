"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import NotificationBell from "@/components/dashboard/NotificationBell";

const links = [
  { href: "/dashboard", label: "Overview", icon: "📊" },
  { href: "/dashboard/plans", label: "Mining Plans", icon: "⛏" },
  { href: "/dashboard/deposit", label: "Deposit", icon: "💳" },
  { href: "/dashboard/withdraw", label: "Withdraw", icon: "💸" },
  { href: "/dashboard/referrals", label: "Referrals", icon: "👥" },
  { href: "/dashboard/transactions", label: "Transactions", icon: "📋" },
  { href: "/dashboard/settings", label: "Settings", icon: "⚙️" },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-amber-400 text-xl">⛏</span>
          <span className="text-white font-bold text-lg">HashVault</span>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
              pathname === link.href
                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            )}
          >
            <span>{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-800 space-y-1">
        <NotificationBell />
        <button
          onClick={() => signOut()}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-colors"
        >
          <span>🚪</span> Sign Out
        </button>
      </div>
    </aside>
  );
}
