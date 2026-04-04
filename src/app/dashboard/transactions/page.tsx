import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { formatUSD } from "@/lib/utils";

export default async function TransactionsPage() {
  const session = await auth();
  const transactions = await prisma.transaction.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const typeVariant: Record<string, any> = {
    DEPOSIT: "info",
    EARNING: "success",
    WITHDRAWAL: "warning",
    REFERRAL_BONUS: "default",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Transaction History</h1>
      <Card>
        {transactions.length === 0 ? (
          <p className="text-gray-500 text-sm">No transactions yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 border-b border-gray-800">
                  <th className="text-left py-3 pr-4">Type</th>
                  <th className="text-left py-3 pr-4">Amount</th>
                  <th className="text-left py-3 pr-4">Description</th>
                  <th className="text-left py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="py-3 pr-4">
                      <Badge variant={typeVariant[tx.type]}>{tx.type.replace("_", " ")}</Badge>
                    </td>
                    <td className="py-3 pr-4 text-white font-medium">{formatUSD(tx.amount)}</td>
                    <td className="py-3 pr-4 text-gray-400">{tx.description || "—"}</td>
                    <td className="py-3 text-gray-500">{new Date(tx.createdAt).toLocaleDateString()}</td>
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
