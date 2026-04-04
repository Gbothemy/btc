import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

// 150%/hr: hourly = price×1.5, daily = price×36, total = price×108
const plans = [
  { name: "Starter",    price: 200,  hourly: 300,   daily: 7200,  total: 21600,  welcome: 100,  popular: false },
  { name: "Pro",        price: 500,  hourly: 750,   daily: 18000, total: 54000,  welcome: 250,  popular: true  },
  { name: "Enterprise", price: 2000, hourly: 3000,  daily: 72000, total: 216000, welcome: 1000, popular: false },
];

export default function PlansPreview() {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white mb-4">Mining Plans</h2>
        <p className="text-gray-400">150% per hour · 3-day contracts · 50% welcome bonus</p>
        <div className="inline-flex items-center gap-2 mt-3 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-1.5 text-green-400 text-sm">
          🎁 50% Welcome Bonus — limited time
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.name} className={`relative ${plan.popular ? "border-amber-500/50 ring-1 ring-amber-500/30" : ""}`}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                MOST POPULAR
              </div>
            )}
            <div className="absolute top-3 right-3 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold px-2 py-0.5 rounded-full">
              +50%
            </div>
            <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
            <div className="text-3xl font-bold text-amber-400">${plan.price.toLocaleString()}</div>
            <p className="text-green-400 text-xs mb-4">+ ${plan.welcome.toLocaleString()} welcome bonus</p>
            <ul className="space-y-1.5 text-sm text-gray-400 mb-6">
              <li className="flex justify-between"><span>Mining Rate</span><span className="text-amber-400 font-medium">150% / hr</span></li>
              <li className="flex justify-between"><span>Hourly Earnings</span><span className="text-white">${plan.hourly.toLocaleString()}</span></li>
              <li className="flex justify-between"><span>Daily Earnings</span><span className="text-white">${plan.daily.toLocaleString()}</span></li>
              <li className="flex justify-between"><span>3-Day Total</span><span className="text-amber-300 font-semibold">${plan.total.toLocaleString()}</span></li>
              <li className="flex justify-between"><span>Contract</span><span className="text-white">3 Days</span></li>
            </ul>
            <Link href="/auth/register">
              <Button variant={plan.popular ? "primary" : "outline"} className="w-full">
                Get Started
              </Button>
            </Link>
          </Card>
        ))}
      </div>

      <div className="text-center mt-8">
        <Link href="/plans" className="text-amber-400 hover:text-amber-300 text-sm">
          View full earnings breakdown →
        </Link>
      </div>
    </section>
  );
}
