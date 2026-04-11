"use client";
import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import toast from "react-hot-toast";
import { formatUSD } from "@/lib/utils";

const MIN_WITHDRAWAL = 1000;

export default function WithdrawPage() {
  const [balance, setBalance] = useState(0);
  const [form, setForm] = useState({ amount: "", walletAddress: "", currency: "BTC" });
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/user/balance").then((r) => r.json()).then((d) => setBalance(d.balance || 0));
    fetch("/api/user/withdrawals").then((r) => r.json()).then((d) => setHistory(d.withdrawals || []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Number(form.amount) < MIN_WITHDRAWAL) {
      toast.error(`Minimum withdrawal is $${MIN_WITHDRAWAL}`);
      return;
    }
    setLoading(true);
    const res = await fetch("/api/user/withdraw", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const text = await res.text();
    const data = text ? JSON.parse(text) : {};
    setLoading(false);
    if (!res.ok) toast.error(data.error || "Withdrawal failed. Check your balance.");
    else {
      toast.success("Withdrawal request submitted!");
      setForm({ amount: "", walletAddress: "", currency: "BTC" });
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Withdraw Funds</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <p className="text-gray-400 text-sm">Available Balance</p>
            <p className="text-3xl font-bold text-amber-400">{formatUSD(balance)}</p>
            <p className="text-gray-500 text-xs mt-1">Min withdrawal: ${MIN_WITHDRAWAL}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Currency</label>
              <select
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500"
              >
                <option value="BTC">Bitcoin (BTC)</option>
                <option value="USDT">Tether (USDT)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Wallet Address</label>
              <input
                type="text"
                required
                value={form.walletAddress}
                onChange={(e) => setForm({ ...form, walletAddress: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500"
                placeholder="Enter your wallet address"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Amount (USD)</label>
              <input
                type="number"
                required
                min={MIN_WITHDRAWAL}
                max={balance}
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500"
                placeholder={`Min $${MIN_WITHDRAWAL}`}
              />
            </div>
            <Button type="submit" className="w-full" loading={loading}>Request Withdrawal</Button>
          </form>
        </Card>

        <Card>
          <h2 className="text-white font-semibold mb-4">Withdrawal History</h2>
          {history.length === 0 ? (
            <p className="text-gray-500 text-sm">No withdrawals yet.</p>
          ) : (
            <div className="space-y-3">
              {history.map((w: any) => (
                <div key={w.id} className="flex items-center justify-between bg-gray-800 rounded-lg px-4 py-3">
                  <div>
                    <p className="text-white text-sm font-medium">{formatUSD(w.amount)}</p>
                    <p className="text-gray-500 text-xs">{w.currency} · {new Date(w.createdAt).toLocaleDateString()}</p>
                  </div>
                  <Badge variant={w.status === "APPROVED" ? "success" : w.status === "REJECTED" ? "danger" : "warning"}>
                    {w.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
