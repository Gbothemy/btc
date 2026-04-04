"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Overview", icon: "📊" },
  { href: "/admin/deposits", label: "Deposits", icon: "💳" },
  { href: "/admin/users", label: "Users", icon: "👥" },
  { href: "/admin/plans", label: "Plans", icon: "⛏" },
  { href: "/admin/withdrawals", label: "Withdrawals", icon: "💸" },
  { href: "/admin/announcements", label: "Announcements", icon: "📢" },
];

export default function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="space-y-1">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
            pathname === l.href
              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          )}
        >
          <span>{l.icon}</span>
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
