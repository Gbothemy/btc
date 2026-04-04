import { prisma } from "@/lib/prisma";
import Card from "@/components/ui/Card";
import { formatUSD } from "@/lib/utils";

export default async function AdminPage() {
  const [userCount, totalWithdrawals, pendingWithdrawals, totalEarned] = await Promise.all([
    prisma.user.count(),
    prisma.withdrawal.aggregate({ _sum: { amount: true } }),
    prisma.withdrawal.count({ where: { status: "PENDING" } }),
    prisma.user.aggregate({ _sum: { totalEarned: true } }),
  ]);

  const stats = [
    { label: "Total Users", value: String(userCount), icon: "👥" },
    { label: "Total Withdrawals", value: formatUSD(totalWithdrawals._sum.amount || 0), icon: "💸" },
    { label: "Pending Withdrawals", value: String(pendingWithdrawals), icon: "⏳" },
    { label: "Total Earned (Platform)", value: formatUSD(totalEarned._sum.totalEarned || 0), icon: "📈" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Admin Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{s.label}</p>
                <p className="text-2xl font-bold text-amber-400 mt-1">{s.value}</p>
              </div>
              <span className="text-3xl">{s.icon}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
