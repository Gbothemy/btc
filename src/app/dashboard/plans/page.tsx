import { prisma } from "@/lib/prisma";
import Card from "@/components/ui/Card";
import PurchasePlanButton from "@/components/dashboard/PurchasePlanButton";
import { formatUSD } from "@/lib/utils";

export default async function DashboardPlansPage() {
  const plans = await prisma.plan.findMany({ where: { active: true } });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">Mining Plans</h1>
      <p className="text-gray-500 mb-8">Purchase a plan to start earning Bitcoin</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className="flex flex-col">
            <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
            <div className="text-3xl font-bold text-amber-400 mb-4">{formatUSD(plan.price)}</div>
            <ul className="space-y-2 text-sm text-gray-400 mb-6 flex-1">
              <li>⚡ {plan.hashrate} TH/s Hashrate</li>
              <li>📈 {plan.roiPercent}% Daily ROI</li>
              <li>📅 {plan.durationDays} Day Contract</li>
              <li>💸 Daily Payouts</li>
              {plan.description && <li>ℹ️ {plan.description}</li>}
            </ul>
            <PurchasePlanButton planId={plan.id} planName={plan.name} price={plan.price} />
          </Card>
        ))}
      </div>
    </div>
  );
}
