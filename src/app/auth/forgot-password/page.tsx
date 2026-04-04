"use client";
import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    setSent(true);
    toast.success("If that email exists, a reset link has been sent.");
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <span className="text-amber-400 text-2xl">⛏</span>
            <span className="text-white font-bold text-xl">HashVault</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Reset Password</h1>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
          {sent ? (
            <p className="text-center text-gray-400">Check your email for a password reset link.</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500"
                  placeholder="you@example.com"
                />
              </div>
              <Button type="submit" className="w-full" loading={loading}>Send Reset Link</Button>
            </form>
          )}
          <p className="text-center text-gray-500 text-sm mt-6">
            <Link href="/auth/login" className="text-amber-400 hover:text-amber-300">← Back to login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
