import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import Button from "@/components/ui/Button";

/**
 * 150% per hour × plan price:
 *   Hourly  = price × 1.50
 *   Daily   = price × 1.50 × 24 = price × 36
 *   Total   = price × 1.50 × 72 = price × 108
 *   Bonus   = price × 0.50
 */
const plans = [
  {
    name: "Starter",
    price: 200,
    hashrate: 1,
    duration: 3,
    hourly: 300,       // 200 × 1.50
    daily: 7200,       // 300 × 24
    total: 21600,      // 300 × 72
    welcome: 100,      // 200 × 0.50
    popular: false,
  },
  {
    name: "Pro",
    price: 500,
    hashrate: 5,
    duration: 3,
    hourly: 750,       // 500 × 1.50
    daily: 18000,      // 750 × 24
    total: 54000,      // 750 × 72
    welcome: 250,      // 500 × 0.50
    popular: true,
  },
  {
    name: "Enterprise",
    price: 2000,
    hashrate: 25,
    duration: 3,
    hourly: 3000,      // 2000 × 1.50
    daily: 72000,      // 3000 × 24
    total: 216000,     // 3000 × 72
    welcome: 1000,     // 2000 × 0.50
    popular: false,
  },
];

export default function PlansPage() {
  return (
    <main>
      <Navbar />
      <div className="pt-24 pb-20 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">Mining Plans</h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            All plans run at <span className="text-amber-400 font-semibold">150% per hour</span> on your investment over a 3-day contract, plus a 50% welcome bonus on activation.
          </p>
          <div className="inline-flex items-center gap-2 mt-4 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-1.5 text-green-400 text-sm">
            🎁 50% Welcome Bonus on all plans — limited time offer
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-gray-900 border rounded-2xl p-8 flex flex-col ${plan.popular ? "border-amber-500 ring-2 ring-amber-500/20" : "border-gray-800"}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-xs font-bold px-4 py-1.5 rounded-full">
                  MOST POPULAR
                </div>
              )}
              <div className="absolute top-4 right-4 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded-full">
                +50% BONUS
              </div>

              <h2 className="text-2xl font-bold text-white mb-1">{plan.name}</h2>
              <div className="text-4xl font-bold text-amber-400 mb-1">${plan.price.toLocaleString()}</div>
              <p className="text-green-400 text-sm mb-6">+ ${plan.welcome.toLocaleString()} welcome bonus</p>

              <div className="space-y-3 mb-8 flex-1">
                {[
                  ["Hashrate", `${plan.hashrate} TH/s`],
                  ["Mining Rate", "150% / hour"],
                  ["Contract Duration", `${plan.duration} Days`],
                  ["Hourly Earnings", `$${plan.hourly.toLocaleString()}`],
                  ["Daily Earnings", `$${plan.daily.toLocaleString()}`],
                  ["Total Return (3 days)", `$${plan.total.toLocaleString()}`],
                  ["Welcome Bonus", `+$${plan.welcome.toLocaleString()}`],
                  ["Payout Frequency", "Hourly"],
                  ["Support", "24/7"],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between text-sm border-b border-gray-800 pb-2">
                    <span className="text-gray-500">{label}</span>
                    <span className={`font-medium ${
                      label === "Welcome Bonus" ? "text-green-400" :
                      label === "Mining Rate" ? "text-amber-400" :
                      label === "Total Return (3 days)" ? "text-amber-300" :
                      "text-white"
                    }`}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              <Link href="/auth/register">
                <Button variant={plan.popular ? "primary" : "outline"} size="lg" className="w-full">
                  Get Started
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Earnings breakdown */}
        <div className="mt-16 bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <h2 className="text-white font-bold text-xl mb-6 text-center">How Earnings Are Calculated</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-center">
            {[
              { label: "Formula", value: "Investment × 150% × Hours", icon: "📐" },
              { label: "Hourly Rate", value: "1.5× your investment per hour", icon: "⚡" },
              { label: "3-Day Total", value: "Investment × 1.5 × 72 hours", icon: "📅" },
            ].map((f) => (
              <div key={f.label} className="bg-gray-800 rounded-xl p-4">
                <div className="text-2xl mb-2">{f.icon}</div>
                <p className="text-gray-400 text-xs mb-1">{f.label}</p>
                <p className="text-white font-semibold">{f.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm text-center">
              <thead>
                <tr className="text-gray-500 border-b border-gray-800">
                  <th className="py-2 text-left">Plan</th>
                  <th className="py-2">Investment</th>
                  <th className="py-2">Hourly (×1.5)</th>
                  <th className="py-2">Daily (×24)</th>
                  <th className="py-2">3-Day Total (×72)</th>
                  <th className="py-2 text-green-400">+50% Bonus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {plans.map((p) => (
                  <tr key={p.name}>
                    <td className="py-3 text-left text-white font-medium">{p.name}</td>
                    <td className="py-3 text-gray-300">${p.price.toLocaleString()}</td>
                    <td className="py-3 text-amber-400">${p.hourly.toLocaleString()}</td>
                    <td className="py-3 text-white">${p.daily.toLocaleString()}</td>
                    <td className="py-3 text-amber-300 font-bold">${p.total.toLocaleString()}</td>
                    <td className="py-3 text-green-400">+${p.welcome.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          {[
            { icon: "⚡", title: "150% Hourly Rate", desc: "Earn 1.5× your investment every single hour, credited to your balance." },
            { icon: "🎁", title: "50% Welcome Bonus", desc: "Get an instant 50% bonus credited the moment you activate a plan." },
            { icon: "📅", title: "3-Day Contracts", desc: "Fast 72-hour contracts. Withdraw your earnings as soon as they land." },
          ].map((f) => (
            <div key={f.title} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-white font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
