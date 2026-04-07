import { prisma } from "@/lib/prisma";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import AdminUserActions from "@/components/admin/AdminUserActions";
import AdminCreditBalance from "@/components/admin/AdminCreditBalance";
import { formatUSD } from "@/lib/utils";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true, suspended: true, balance: true, totalEarned: true, createdAt: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Users ({users.length})</h1>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="text-gray-500 border-b border-gray-800">
                <th className="text-left py-3 pr-4">User</th>
                <th className="text-left py-3 pr-4">Balance</th>
                <th className="text-left py-3 pr-4">Total Earned</th>
                <th className="text-left py-3 pr-4">Status</th>
                <th className="text-left py-3 pr-4">Joined</th>
                <th className="text-left py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {users.map((u: { id: string; name: string | null; email: string; role: string; suspended: boolean; balance: number; totalEarned: number; createdAt: Date }) => (
                <tr key={u.id}>
                  <td className="py-3 pr-4">
                    <p className="text-white font-medium">{u.name}</p>
                    <p className="text-gray-500 text-xs">{u.email}</p>
                    {u.role === "ADMIN" && (
                      <span className="text-xs text-amber-400 font-semibold">ADMIN</span>
                    )}
                  </td>
                  <td className="py-3 pr-4 text-white">{formatUSD(u.balance)}</td>
                  <td className="py-3 pr-4 text-green-400">{formatUSD(u.totalEarned)}</td>
                  <td className="py-3 pr-4">
                    <Badge variant={u.suspended ? "danger" : "success"}>
                      {u.suspended ? "Suspended" : "Active"}
                    </Badge>
                  </td>
                  <td className="py-3 pr-4 text-gray-500 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <AdminCreditBalance userId={u.id} userName={u.name || u.email} />
                      <AdminUserActions userId={u.id} suspended={u.suspended} />
                    </div>
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
