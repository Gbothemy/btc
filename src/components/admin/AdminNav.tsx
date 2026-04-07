"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Overview", icon: "📊" },
  { href: "/admin/deposits", label: "Deposits", icon: "💳" },
  { href: "/admin/users", label: "Users", icon: "👥" },
  { href: "/admin/plans", label: "Plans", icon: "⛏" },
  { href: "/admin/withdrawals", label: "Withdrawals", icon: "💸" },
  { href: "/admin/announcements", label: "Announcements", icon: "📢" },
];

export function AdminNavLinks({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="space-y-1">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          onClick={onClose}
          className={cn(
            "flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors",
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

export default function AdminNav() {
  return <AdminNavLinks />;
}

export function AdminMobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4 h-14">
        <span className="text-amber-400 font-bold">⛏ Admin</span>
        <button onClick={() => setOpen(!open)} className="text-gray-400 p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>
      {open && <div className="lg:hidden fixed inset-0 z-30 bg-black/60" onClick={() => setOpen(false)} />}
      <aside className={cn(
        "lg:hidden fixed top-14 left-0 bottom-0 z-40 w-56 bg-gray-900 border-r border-gray-800 p-4 transition-transform duration-200",
        open ? "translate-x-0" : "-translate-x-full"
      )}>
        <AdminNavLinks onClose={() => setOpen(false)} />
      </aside>
    </>
  );
}
