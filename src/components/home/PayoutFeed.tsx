"use client";
import { useEffect, useState } from "react";

const NAMES = ["J***n", "A***a", "M***e", "C***s", "R***l", "S***h", "D***d", "L***a"];
const AMOUNTS = [0.0012, 0.0034, 0.0008, 0.0021, 0.0056, 0.0015, 0.0043, 0.0009];

export default function PayoutFeed() {
  const [payouts, setPayouts] = useState<{ name: string; amount: number; time: string }[]>([]);

  useEffect(() => {
    const initial = Array.from({ length: 5 }, (_, i) => ({
      name: NAMES[i % NAMES.length],
      amount: AMOUNTS[i % AMOUNTS.length],
      time: `${i + 1}m ago`,
    }));
    setPayouts(initial);

    const interval = setInterval(() => {
      setPayouts((prev) => [
        { name: NAMES[Math.floor(Math.random() * NAMES.length)], amount: AMOUNTS[Math.floor(Math.random() * AMOUNTS.length)], time: "just now" },
        ...prev.slice(0, 4),
      ]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 bg-gray-900/30 border-y border-gray-800">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-center text-2xl font-bold text-white mb-8">Live Payout Feed</h2>
        <div className="space-y-3">
          {payouts.map((p, i) => (
            <div key={i} className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-sm">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-gray-400">{p.name} received a payout</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-amber-400 font-semibold">{p.amount} BTC</span>
                <span className="text-gray-600 text-xs">{p.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
