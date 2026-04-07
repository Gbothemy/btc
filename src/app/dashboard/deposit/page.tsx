"use client";
import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import toast from "react-hot-toast";

const CURRENCIES = [
  { id: "BTC",  label: "Bitcoin",  icon: "₿",  network: "Bitcoin Network",  address: "bc1qspdrp80sz6ukw4dl84gzk54krlqe53nfgu5jp3" },
  { id: "ETH",  label: "Ethereum", icon: "Ξ",  network: "ERC20",            address: "0xdf723F511EC2a6d5E8CccaDb1454b1582c0E6f6A" },
  { id: "USDT", label: "Tether",   icon: "₮",  network: "ERC20",            address: "0xdf723F511EC2a6d5E8CccaDb1454b1582c0E6f6A" },
  { id: "BNB",  label: "BNB",      icon: "🔶", network: "BNB Smart Chain",  address: "0xdf723F511EC2a6d5E8CccaDb1454b1582c0E6f6A" },
];

const RATES: Record<string, number> = { BTC: 65000, ETH: 3200, USDT: 1, BNB: 600 };

type Plan = { id: string; name: string; price: number };
type Confirmation = { id: string; currency: string; usdAmount: number; status: string; createdAt: string; plan: { name: string } };

export default function DepositPage() {
  const [step, setStep] = useState<"select" | "send" | "confirm">("select");
  const [currency, setCurrency] = useState("BTC");
  const [amount, setAmount] = useState("");
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [txHash, setTxHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<Confirmation[]>([]);

  const selectedCurrency = CURRENCIES.find((c) => c.id === currency)!;
  const cryptoAmount = amount ? (Number(amount) / RATES[currency]).toFixed(8) : "0";

  useEffect(() => {
    fetch("/api/user/deposit-confirm").then((r) => r.json()).then((d) => setHistory(d.confirmations || []));
    fetch("/api/dashboard/plans").then((r) => r.json()).then((d) => {
      setPlans(d.plans || []);
      if (d.plans?.length) setSelectedPlan(d.plans[0].id);
    });
  }, []);

  const copyAddress = () => {
    navigator.clipboard.writeText(selectedCurrency.address);
    setCopied(true);
    toast.success("Address copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) { toast.error("Select a plan"); return; }
    if (!amount || Number(amount) < 10) { toast.error("Minimum deposit is $10"); return; }
    setLoading(true);
    const res = await fetch("/api/user/deposit-confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        planId: selectedPlan,
        currency,
        cryptoAmount,
        usdAmount: Number(amount),
        txHash: txHash || undefined,
        walletAddress: selectedCurrency.address,
      }),
    });
    const text = await res.text();
    const data = text ? JSON.parse(text) : {};
    setLoading(false);
    if (!res.ok) {
      toast.error(data.error || "Submission failed");
    } else {
      toast.success(`✅ Balance credited! $${data.welcomeBonus?.toLocaleString()} welcome bonus applied. Admin will verify within 24hrs.`);
      setStep("select");
      setAmount("");
      setTxHash("");
      fetch("/api/user/deposit-confirm").then((r) => r.json()).then((d) => setHistory(d.confirmations || []));
    }
  };

  const statusVariant = (s: string) => s === "APPROVED" ? "success" : s === "REJECTED" ? "danger" : "warning";

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Deposit Funds</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {/* Step 1 — Select currency & amount */}
        <Card className={step !== "select" ? "opacity-60" : ""}>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-black text-xs font-bold flex items-center justify-center">1</span>
            <h2 className="text-white font-semibold">Choose Currency & Amount</h2>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {CURRENCIES.map((c) => (
              <button key={c.id} type="button" onClick={() => setCurrency(c.id)}
                className={`p-3 rounded-lg border text-left transition-colors ${currency === c.id ? "border-amber-500 bg-amber-500/10 text-amber-400" : "border-gray-700 text-gray-400 hover:border-gray-600"}`}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{c.icon}</span>
                  <div>
                    <div className="text-sm font-semibold">{c.id}</div>
                    <div className="text-xs text-gray-500">{c.network}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div className="mb-4">
            <label className="block text-xs text-gray-400 mb-1">Amount (USD)</label>
            <input type="number" min={10} value={amount} onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500"
              placeholder="Min $10" />
            {amount && <p className="text-amber-400 text-xs mt-1">≈ {cryptoAmount} {currency}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-xs text-gray-400 mb-1">Select Plan to Activate</label>
            <select value={selectedPlan} onChange={(e) => setSelectedPlan(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500">
              {plans.map((p) => (
                <option key={p.id} value={p.id}>{p.name} — ${p.price.toLocaleString()}</option>
              ))}
            </select>
          </div>
          <Button className="w-full" onClick={() => { if (!amount || Number(amount) < 10) { toast.error("Min $10"); return; } setStep("send"); }}
            disabled={!amount || Number(amount) < 10 || !selectedPlan}>
            Next: Get Address →
          </Button>
        </Card>

        {/* Step 2 — Send crypto */}
        <Card className={step === "select" ? "opacity-60" : ""}>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-black text-xs font-bold flex items-center justify-center">2</span>
            <h2 className="text-white font-semibold">Send {currency}</h2>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-xs text-amber-400 mb-4">
            ⚠ Only send <strong>{currency}</strong> on <strong>{selectedCurrency.network}</strong>. Other assets will be lost.
          </div>
          <div className="bg-gray-800 rounded-lg p-4 mb-3">
            <p className="text-gray-500 text-xs mb-2">Send to this address:</p>
            <p className="text-white text-xs font-mono break-all leading-relaxed">{selectedCurrency.address}</p>
            <button onClick={copyAddress} className="mt-3 w-full bg-gray-700 hover:bg-gray-600 text-white text-xs py-2 rounded-lg transition-colors">
              {copied ? "✓ Copied!" : "📋 Copy Address"}
            </button>
          </div>
          <div className="bg-gray-800 rounded-lg p-3 flex justify-between mb-4">
            <div>
              <p className="text-gray-500 text-xs">Amount to Send</p>
              <p className="text-amber-400 font-bold">{cryptoAmount} {currency}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-xs">USD Value</p>
              <p className="text-white font-semibold">${Number(amount || 0).toLocaleString()}</p>
            </div>
          </div>
          <Button className="w-full" onClick={() => setStep("confirm")} disabled={step === "select"}>
            I've Sent the Payment →
          </Button>
          <button onClick={() => setStep("select")} className="w-full text-gray-500 text-xs mt-2 hover:text-gray-400">← Back</button>
        </Card>

        {/* Step 3 — Confirm */}
        <Card className={step !== "confirm" ? "opacity-60" : ""}>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-black text-xs font-bold flex items-center justify-center">3</span>
            <h2 className="text-white font-semibold">Confirm Payment</h2>
          </div>
          <p className="text-gray-400 text-sm mb-4">Submit your transaction details so admin can verify and activate your plan.</p>
          <form onSubmit={handleConfirm} className="space-y-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Transaction Hash (optional but recommended)</label>
              <input type="text" value={txHash} onChange={(e) => setTxHash(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
                placeholder="e.g. 0xabc123... or txid..." />
            </div>
            <div className="bg-gray-800 rounded-lg p-3 text-xs space-y-1 text-gray-400">
              <div className="flex justify-between"><span>Currency</span><span className="text-white">{currency}</span></div>
              <div className="flex justify-between"><span>Amount</span><span className="text-white">{cryptoAmount} {currency} (${Number(amount || 0).toLocaleString()})</span></div>
              <div className="flex justify-between"><span>Plan</span><span className="text-amber-400">{plans.find((p) => p.id === selectedPlan)?.name}</span></div>
            </div>
            <Button type="submit" className="w-full" loading={loading} disabled={step !== "confirm"}>
              Submit Confirmation
            </Button>
            <button type="button" onClick={() => setStep("send")} className="w-full text-gray-500 text-xs hover:text-gray-400">← Back</button>
          </form>
        </Card>
      </div>

      {/* Deposit history */}
      {history.length > 0 && (
        <div className="mt-8">
          <h2 className="text-white font-semibold mb-4">Your Deposit Submissions</h2>
          <Card>
            <div className="space-y-3">
              {history.map((d) => (
                <div key={d.id} className="flex items-center justify-between bg-gray-800 rounded-lg px-4 py-3">
                  <div>
                    <p className="text-white text-sm font-medium">${d.usdAmount.toLocaleString()} via {d.currency}</p>
                    <p className="text-gray-500 text-xs">Plan: {d.plan.name} · {new Date(d.createdAt).toLocaleDateString()}</p>
                  </div>
                  <Badge variant={statusVariant(d.status) as any}>{d.status}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
