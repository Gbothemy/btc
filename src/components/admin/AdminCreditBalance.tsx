"use client";
import { useState } from "react";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AdminCreditBalance({ userId, userName }: { userId: string; userName: string }) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCredit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) { toast.error("Enter a valid amount"); return; }
    setLoading(true);
    const res = await fetch(`/api/admin/users/${userId}/credit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: Number(amount) }),
    });
    const text = await res.text();
    const data = text ? JSON.parse(text) : {};
    setLoading(false);
    if (res.ok) {
      toast.success(`$${amount} credited to ${userName}`);
      setOpen(false);
      setAmount("");
      router.refresh();
    } else {
      toast.error(data.error || "Failed to credit balance");
    }
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        💳 Credit
      </Button>

      {open && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-sm">
            <h2 className="text-white font-bold mb-1">Credit Balance</h2>
            <p className="text-gray-500 text-sm mb-4">Adding funds to: <span className="text-amber-400">{userName}</span></p>
            <form onSubmit={handleCredit} className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Amount (USD)</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500"
                  placeholder="e.g. 500"
                  autoFocus
                />
              </div>
              <div className="flex gap-3">
                <Button type="submit" loading={loading} className="flex-1">Credit</Button>
                <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="flex-1">Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
