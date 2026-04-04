import { prisma } from "@/lib/prisma";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import AdminPlanActions from "@/components/admin/AdminPlanActions";
import AdminCreatePlan from "@/components/admin/AdminCreatePlan";
import { formatUSD } from "@/lib/utils";

export default async function AdminPlansPage() {
  const plans = await prisma.plan.findMany({ orderBy: { price: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Mining Plans</h1>
        <AdminCreatePlan />
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b border-gray-800">
                <th className="text-left py-3 pr-4">Name</th>
                <th className="text-left py-3 pr-4">Price</th>
                <th className="text-left py-3 pr-4">Hashrate</th>
                <th className="text-left py-3 pr-4">ROI/Day</th>
                <th className="text-left py-3 pr-4">Duration</th>
                <th className="text-left py-3 pr-4">Status</th>
                <th className="text-left py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {plans.map((plan) => (
                <tr key={plan.id}>
                  <td className="py-3 pr-4 text-white font-medium">{plan.name}</td>
                  <td className="py-3 pr-4 text-white">{formatUSD(plan.price)}</td>
                  <td className="py-3 pr-4 text-gray-300">{plan.hashrate} TH/s</td>
                  <td className="py-3 pr-4 text-green-400">{plan.roiPercent}%</td>
                  <td className="py-3 pr-4 text-gray-300">{plan.durationDays} days</td>
                  <td className="py-3 pr-4">
                    <Badge variant={plan.active ? "success" : "danger"}>
                      {plan.active ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="py-3">
                    <AdminPlanActions planId={plan.id} active={plan.active} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
