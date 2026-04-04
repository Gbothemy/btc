import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calcHourlyEarnings } from "@/lib/mining";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const subscriptions = await prisma.subscription.findMany({
    where: { userId: session.user.id, active: true, endDate: { gt: new Date() } },
    include: { plan: { select: { name: true, price: true, roiPercent: true } } },
  });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { balance: true, miningBalance: true },
  });

  const CONTRACT_HOURS = 72;
  const now = Date.now();

  const plans = subscriptions.map((sub: {
    id: string; createdAt: Date; endDate: Date; lastClaimedAt: Date | null;
    plan: { name: string; price: number; roiPercent: number };
  }) => {
    const hourlyRate = calcHourlyEarnings(sub.plan.price, sub.plan.roiPercent);
    const elapsedHours = (now - sub.createdAt.getTime()) / 1000 / 3600;
    const remainingHours = Math.max(0, (sub.endDate.getTime() - now) / 1000 / 3600);
    const progressPct = Math.min(100, Math.round((elapsedHours / CONTRACT_HOURS) * 100));

    // Cooldown: 1 hour since last claim (or since plan started if never claimed)
    const lastClaim = sub.lastClaimedAt ?? sub.createdAt;
    const hoursSinceLastClaim = (now - lastClaim.getTime()) / 1000 / 3600;
    const canClaim = hoursSinceLastClaim >= 1;
    const cooldownSecondsLeft = canClaim ? 0 : Math.ceil((3600 - (now - lastClaim.getTime()) / 1000));

    return {
      id: sub.id,
      planName: sub.plan.name,
      planPrice: sub.plan.price,
      roiPercent: sub.plan.roiPercent,
      hourlyRate,
      dailyRate: hourlyRate * 24,
      endDate: sub.endDate,
      hoursRemaining: remainingHours,
      progressPct,
      canClaim,
      cooldownSecondsLeft,
      claimableAmount: canClaim ? hourlyRate : 0,
    };
  });

  const totalHourlyRate = plans.reduce((sum: number, p: { hourlyRate: number }) => sum + p.hourlyRate, 0);
  const totalClaimable = plans.reduce((sum: number, p: { claimableAmount: number }) => sum + p.claimableAmount, 0);

  return NextResponse.json({
    plans,
    totalHourlyRate,
    totalClaimable,
    miningBalance: user?.miningBalance ?? 0,
    balance: user?.balance ?? 0,
  });
}
