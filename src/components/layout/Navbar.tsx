"use client";
import Link from "next/link";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-amber-400 text-2xl">⛏</span>
            <span className="text-white font-bold text-xl">HashVault</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/plans" className="text-gray-400 hover:text-amber-400 transition-colors text-sm">Plans</Link>
            <Link href="/about" className="text-gray-400 hover:text-amber-400 transition-colors text-sm">About</Link>
            <Link href="/faq" className="text-gray-400 hover:text-amber-400 transition-colors text-sm">FAQ</Link>
            <Link href="/contact" className="text-gray-400 hover:text-amber-400 transition-colors text-sm">Contact</Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <>
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">Dashboard</Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={() => signOut()}>Sign Out</Button>
              </>
            ) : (
              <>
                <Link href="/auth/login"><Button variant="ghost" size="sm">Login</Button></Link>
                <Link href="/auth/register"><Button size="sm">Get Started</Button></Link>
              </>
            )}
          </div>

          <button className="md:hidden text-gray-400" onClick={() => setOpen(!open)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800 px-4 py-4 space-y-3">
          <Link href="/plans" className="block text-gray-400 hover:text-white">Plans</Link>
          <Link href="/about" className="block text-gray-400 hover:text-white">About</Link>
          <Link href="/faq" className="block text-gray-400 hover:text-white">FAQ</Link>
          <Link href="/contact" className="block text-gray-400 hover:text-white">Contact</Link>
          {session ? (
            <Link href="/dashboard" className="block text-amber-400">Dashboard</Link>
          ) : (
            <Link href="/auth/login" className="block text-amber-400">Login / Register</Link>
          )}
        </div>
      )}
    </nav>
  );
}
