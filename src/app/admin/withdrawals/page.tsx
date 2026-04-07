import { prisma } from "@/lib/prisma";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import AdminWithdrawalActions from "@/components/admin/AdminWithdrawalActions";
import { formatUSD } from "@/lib/utils";

export default async function AdminWithdrawalsPage() {
  const withdrawals = await prisma.withdrawal.findMany({
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Withdrawals</h1>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className="text-gray-500 border-b border-gray-800">
                <th className="text-left py-3 pr-4">User</th>
                <th className="text-left py-3 pr-4">Amount</th>
                <th className="text-left py-3 pr-4">Wallet</th>
                <th className="text-left py-3 pr-4">Status</th>
                <th className="text-left py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {withdrawals.map((w) => (
                <tr key={w.id}>
                  <td className="py-3 pr-4">
                    <p className="text-white">{w.user.name}</p>
                    <p className="text-gray-500 text-xs">{w.user.email}</p>
                  </td>
                  <td className="py-3 pr-4 text-white">{formatUSD(w.amount)}</td>
                  <td className="py-3 pr-4 text-gray-400 font-mono text-xs">{w.walletAddress.slice(0, 16)}...</td>
                  <td className="py-3 pr-4">
                    <Badge variant={w.status === "APPROVED" ? "success" : w.status === "REJECTED" ? "danger" : "warning"}>
                      {w.status}
                    </Badge>
                  </td>
                  <td className="py-3">
                    {w.status === "PENDING" && <AdminWithdrawalActions withdrawalId={w.id} />}
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
