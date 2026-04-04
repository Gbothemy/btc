"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

type PlanStatus = {
  id: string;
  planName: string;
  planPrice: number;
  roiPercent: number;
  hourlyRate: number;
  dailyRate: number;
  endDate: string;
  hoursRemaining: number;
  progressPct: number;
  canClaim: boolean;
  cooldownSecondsLeft: number;
  claimableAmount: number;
};

type MiningData = {
  plans: PlanStatus[];
  totalHourlyRate: number;
  totalClaimable: number;
  miningBalance: number;
  balance: number;
};

function CooldownTimer({ seconds, onExpire }: { seconds: number; onExpire: () => void }) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    setRemaining(seconds);
    if (seconds <= 0) return;
    const t = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) { clearInterval(t); onExpire(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [seconds, onExpire]);

  const m = Math.floor(remaining / 60);
  const s = remaining % 60;
  return <span className="font-mono text-xs text-gray-400">{m}:{s.toString().padStart(2, "0")}</span>;
}

export default function MiningWidget() {
  const [data, setData] = useState<MiningData | null>(null);
  const [claiming, setClaiming] = useState<string | null>(null);
  const [liveRates, setLiveRates] = useState<Record<string, number>>({});
  const tickRef = useRef<NodeJS.Timeout | null>(null);

  const fetchStatus = useCallback(async () => {
    const res = await fetch("/api/user/mining-status");
    const text = await res.text();
    if (!text) return;
    const d: MiningData = JSON.parse(text);
    setData(d);
    // Reset live counters to 0 each fetch (they tick up from 0 each hour)
    const rates: Record<string, number> = {};
    d.plans.forEach((p) => { rates[p.id] = 0; });
    setLiveRates(rates);
  }, []);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 60000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  // Tick live earnings per plan every second
  useEffect(() => {
    if (!data || data.plans.length === 0) return;
    if (tickRef.current) clearInterval(tickRef.current);
    tickRef.current = setInterval(() => {
      setLiveRates((prev) => {
        const next = { ...prev };
        data.plans.forEach((p) => {
          next[p.id] = (next[p.id] ?? 0) + p.hourlyRate / 3600;
        });
        return next;
      });
    }, 1000);
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, [data]);

  const handleClaim = async (subscriptionId: string, planName: string) => {
    setClaiming(subscriptionId);
    const res = await fetch("/api/user/claim-earnings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subscriptionId }),
    });
    const text = await res.text();
    const d = text ? JSON.parse(text) : {};
    setClaiming(null);
    if (res.ok) {
      toast.success(`$${d.amount?.toFixed(2)} from ${planName} claimed to balance!`);
      fetchStatus();
    } else {
      toast.error(d.error || "Claim failed");
    }
  };

  if (!data || data.plans.length === 0) return null;

  const fmt = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`;

  return (
    <div className="mb-8">
      {/* Header bar */}
      <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/5 border border-amber-500/30 rounded-2xl p-5 mb-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="text-2xl">⛏</span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse border-2 border-black" />
          </div>
          <div>
            <p className="text-green-400 font-bold text-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse inline-block" />
              Mining Active — {data.plans.length} plan{data.plans.length > 1 ? "s" : ""}
            </p>
            <p className="text-gray-500 text-xs">{fmt(data.totalHourlyRate)} / hour total</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-gray-400 text-xs">Total Claimable Now</p>
          <p className="text-2xl font-bold text-amber-400">{fmt(data.totalClaimable)}</p>
        </div>
      </div>

      {/* Per-plan cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.plans.map((plan) => {
          const daysLeft = Math.floor(plan.hoursRemaining / 24);
          const hrsLeft = Math.floor(plan.hoursRemaining % 24);
          const live = liveRates[plan.id] ?? 0;

          return (
            <div key={plan.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col gap-4">

              {/* Plan name + status */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold">{plan.planName} Plan</p>
                  <p className="text-gray-500 text-xs">${plan.planPrice.toLocaleString()} · {plan.roiPercent}%/hr</p>
                </div>
                <span className="bg-green-500/10 border border-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">MINING</span>
              </div>

              {/* Animated bars */}
              <div className="flex items-end gap-0.5 h-8">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className="flex-1 rounded-sm"
                    style={{
                      height: `${30 + Math.abs(Math.sin(Date.now() / 800 + i)) * 70}%`,
                      backgroundColor: i % 4 === 0 ? "rgb(245 158 11 / 0.7)" : "rgb(245 158 11 / 0.2)",
                      animation: `pulse ${0.6 + i * 0.04}s ease-in-out infinite alternate`,
                    }}
                  />
                ))}
              </div>

              {/* Live earnings this cycle */}
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <p className="text-gray-500 text-xs mb-1">Earnings this cycle</p>
                <p className="text-amber-400 font-bold text-xl font-mono tabular-nums">{fmt(live)}</p>
                <p className="text-gray-600 text-xs mt-0.5">resets on claim</p>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-gray-800 rounded-lg p-2">
                  <p className="text-gray-500">Per Hour</p>
                  <p className="text-amber-400 font-bold">{fmt(plan.hourlyRate)}</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-2">
                  <p className="text-gray-500">Time Left</p>
                  <p className="text-white font-bold">{daysLeft > 0 ? `${daysLeft}d ` : ""}{hrsLeft}h</p>
                </div>
              </div>

              {/* Progress */}
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Contract</span><span>{plan.progressPct}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-1.5">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-400 h-1.5 rounded-full transition-all"
                    style={{ width: `${plan.progressPct}%` }} />
                </div>
              </div>

              {/* Claim button */}
              {plan.canClaim ? (
                <Button
                  className="w-full"
                  loading={claiming === plan.id}
                  onClick={() => handleClaim(plan.id, plan.planName)}
                >
                  💸 Claim {fmt(plan.hourlyRate)}
                </Button>
              ) : (
                <div className="w-full bg-gray-800 rounded-lg px-4 py-2.5 text-center">
                  <p className="text-gray-500 text-xs mb-0.5">Next claim in</p>
                  <CooldownTimer
                    seconds={plan.cooldownSecondsLeft}
                    onExpire={fetchStatus}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
