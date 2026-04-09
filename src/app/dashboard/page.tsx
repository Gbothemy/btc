import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getBtcPrice, calcDailyEarnings } from "@/lib/mining";
import Card from "@/components/ui/Card";
import { formatUSD } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import AnnouncementBanner from "@/components/dashboard/AnnouncementBanner";
import MiningWidget from "@/components/dashboard/MiningWidget";

type SubWithPlan = { id: string; hashrate: number; endDate: Date; plan: { price: number; roiPercent: number; name: string } };
type WorkerType = { online: boolean };
type WithdrawalType = { id: string; amount: number; createdAt: Date; status: string };

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  // Single query — fetch everything at once to minimize pool usage
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      subscriptions: { include: { plan: true }, where: { active: true } },
      workers: { select: { online: true } },
      withdrawals: { take: 5, orderBy: { createdAt: "desc" } },
    },
  });

  // Fetch BTC price separately (external API, not DB)
  let btcPrice = 65000;
  try { btcPrice = await getBtcPrice(); } catch {}

  const totalHashrate = user?.subscriptions.reduce((sum: number, s: SubWithPlan) => sum + s.hashrate, 0) ?? 0;
  const dailyEarnings = user?.subscriptions.reduce((sum: number, s: SubWithPlan) => {
    return sum + calcDailyEarnings(s.plan.price, s.plan.roiPercent);
  }, 0) ?? 0;
  const hourlyEarnings = dailyEarnings / 24;
  const activeWorkers = user?.workers.filter((w: WorkerType) => w.online).length ?? 0;

  const stats = [
    { label: "Account Balance", value: formatUSD(user?.balance ?? 0), icon: "💰", color: "text-amber-400" },
    { label: "Total Earned", value: formatUSD(user?.totalEarned ?? 0), icon: "📈", color: "text-green-400" },
    { label: "Hourly Earnings", value: formatUSD(hourlyEarnings), icon: "⚡", color: "text-blue-400" },
    { label: "Daily Earnings", value: formatUSD(dailyEarnings), icon: "📊", color: "text-purple-400" },
    { label: "Active Workers", value: String(activeWorkers), icon: "⛏", color: "text-orange-400" },
    { label: "BTC Price", value: formatUSD(btcPrice), icon: "₿", color: "text-amber-400" },
  ];

  return (
    <div>
      <AnnouncementBanner />
      <div className="mb-6 pt-2">
        <h1 className="text-xl sm:text-2xl font-bold text-white">
          Welcome back, {user?.name?.split(" ")[0] || "Miner"} 👋
        </h1>
        <p className="text-gray-500 mt-1 text-sm">Here&apos;s your mining overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <Card key={s.label}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{s.label}</p>
                <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
              </div>
              <span className="text-3xl">{s.icon}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Live mining widget — only shows when plans are active */}
      <MiningWidget />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-white font-semibold mb-4">Active Subscriptions</h2>
          {!user?.subscriptions.length ? (
            <p className="text-gray-500 text-sm">No active plans. <a href="/dashboard/deposit" className="text-amber-400">Deposit to get started →</a></p>
          ) : (
            <div className="space-y-3">
              {user.subscriptions.map((sub: SubWithPlan) => (
                <div key={sub.id} className="flex items-center justify-between bg-gray-800 rounded-lg px-4 py-3">
                  <div>
                    <p className="text-white text-sm font-medium">{sub.plan.name}</p>
                    <p className="text-gray-500 text-xs">{sub.hashrate} TH/s · Expires {new Date(sub.endDate).toLocaleDateString()}</p>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h2 className="text-white font-semibold mb-4">Recent Withdrawals</h2>
          {!user?.withdrawals.length ? (
            <p className="text-gray-500 text-sm">No withdrawals yet.</p>
          ) : (
            <div className="space-y-3">
              {user.withdrawals.map((w: WithdrawalType) => (
                <div key={w.id} className="flex items-center justify-between bg-gray-800 rounded-lg px-4 py-3">
                  <div>
                    <p className="text-white text-sm">{formatUSD(w.amount)}</p>
                    <p className="text-gray-500 text-xs">{new Date(w.createdAt).toLocaleDateString()}</p>
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
