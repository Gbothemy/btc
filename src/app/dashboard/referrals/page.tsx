import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Card from "@/components/ui/Card";
import CopyReferralLink from "@/components/dashboard/CopyReferralLink";
import { formatUSD } from "@/lib/utils";

export default async function ReferralsPage() {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
    include: {
      referrals: { select: { id: true, name: true, email: true, createdAt: true } },
    },
  });

  const referralLink = `${process.env.NEXTAUTH_URL}/auth/register?ref=${user?.referralCode}`;
  const referralEarnings = await prisma.transaction.aggregate({
    where: { userId: session!.user.id, type: "REFERRAL_BONUS" },
    _sum: { amount: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Referral Program</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Referrals", value: String(user?.referrals.length || 0) },
          { label: "Referral Earnings", value: formatUSD(referralEarnings._sum.amount || 0) },
          { label: "Commission Rate", value: "5%" },
        ].map((s) => (
          <Card key={s.label}>
            <p className="text-gray-500 text-sm">{s.label}</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">{s.value}</p>
          </Card>
        ))}
      </div>

      <Card className="mb-6">
        <h2 className="text-white font-semibold mb-3">Your Referral Link</h2>
        <CopyReferralLink link={referralLink} />
        <p className="text-gray-500 text-xs mt-3">Earn 5% commission on every plan purchased by your referrals.</p>
      </Card>

      <Card>
        <h2 className="text-white font-semibold mb-4">Your Referrals ({user?.referrals.length})</h2>
        {user?.referrals.length === 0 ? (
          <p className="text-gray-500 text-sm">No referrals yet. Share your link to start earning!</p>
        ) : (
          <div className="space-y-3">
            {user?.referrals.map((r) => (
              <div key={r.id} className="flex items-center justify-between bg-gray-800 rounded-lg px-4 py-3">
                <div>
                  <p className="text-white text-sm">{r.name}</p>
                  <p className="text-gray-500 text-xs">{r.email}</p>
                </div>
                <p className="text-gray-500 text-xs">{new Date(r.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
