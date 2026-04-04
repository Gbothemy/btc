"use client";
import { useEffect, useState } from "react";

export default function BtcTicker() {
  const [price, setPrice] = useState<number | null>(null);
  const [change, setChange] = useState<number>(0);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true"
        );
        const data = await res.json();
        setPrice(data.bitcoin.usd);
        setChange(data.bitcoin.usd_24h_change);
      } catch {}
    };
    fetchPrice();
    const interval = setInterval(fetchPrice, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-900 border-b border-gray-800 py-2 mt-16">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <span className="text-gray-500">Live BTC Price:</span>
          {price ? (
            <span className="text-white font-bold">
              ${price.toLocaleString()}
              <span className={`ml-2 text-xs ${change >= 0 ? "text-green-400" : "text-red-400"}`}>
                {change >= 0 ? "▲" : "▼"} {Math.abs(change).toFixed(2)}%
              </span>
            </span>
          ) : (
            <span className="text-gray-600 animate-pulse">Loading...</span>
          )}
        </div>
        <div className="hidden md:flex items-center gap-6 text-gray-500">
          <span>🔒 SSL Secured</span>
          <span>⚡ 99.9% Uptime</span>
          <span>✅ Instant Payouts</span>
        </div>
      </div>
    </div>
  );
}
