import { prisma } from "@/lib/prisma";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import AdminDepositActions from "@/components/admin/AdminDepositActions";
import { formatUSD } from "@/lib/utils";

export default async function AdminDepositsPage() {
  const deposits = await prisma.depositConfirmation.findMany({
    include: {
      user: { select: { name: true, email: true } },
      plan: { select: { name: true, price: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const pending = deposits.filter((d: { status: string }) => d.status === "PENDING").length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">
          Deposit Confirmations
          {pending > 0 && (
            <span className="ml-3 bg-amber-500 text-black text-xs font-bold px-2 py-1 rounded-full">{pending} pending</span>
          )}
        </h1>
      </div>

      <Card>
        {deposits.length === 0 ? (
          <p className="text-gray-500 text-sm">No deposit confirmations yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 border-b border-gray-800">
                  <th className="text-left py-3 pr-4">User</th>
                  <th className="text-left py-3 pr-4">Amount</th>
                  <th className="text-left py-3 pr-4">Currency</th>
                  <th className="text-left py-3 pr-4">Plan</th>
                  <th className="text-left py-3 pr-4">Tx Hash</th>
                  <th className="text-left py-3 pr-4">Status</th>
                  <th className="text-left py-3 pr-4">Date</th>
                  <th className="text-left py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {deposits.map((d: { id: string; user: { name: string | null; email: string }; plan: { name: string; price: number }; usdAmount: number; cryptoAmount: string; currency: string; txHash: string | null; status: string; createdAt: Date }) => (
                  <tr key={d.id}>
                    <td className="py-3 pr-4">
                      <p className="text-white font-medium">{d.user.name}</p>
                      <p className="text-gray-500 text-xs">{d.user.email}</p>
                    </td>
                    <td className="py-3 pr-4">
                      <p className="text-white font-semibold">{formatUSD(d.usdAmount)}</p>
                      <p className="text-gray-500 text-xs">{d.cryptoAmount} {d.currency}</p>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="text-amber-400 font-medium">{d.currency}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <p className="text-white">{d.plan.name}</p>
                      <p className="text-gray-500 text-xs">{formatUSD(d.plan.price)}</p>
                    </td>
                    <td className="py-3 pr-4">
                      {d.txHash ? (
                        <span className="text-gray-300 text-xs font-mono">{d.txHash.slice(0, 16)}...</span>
                      ) : (
                        <span className="text-gray-600 text-xs">Not provided</span>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      <Badge variant={d.status === "APPROVED" ? "success" : d.status === "REJECTED" ? "danger" : "warning"}>
                        {d.status}
                      </Badge>
                    </td>
                    <td className="py-3 pr-4 text-gray-500 text-xs">
                      {new Date(d.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3">
                      {d.status === "PENDING" && <AdminDepositActions depositId={d.id} />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
