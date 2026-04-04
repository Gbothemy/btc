import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calcHourlyEarnings } from "@/lib/mining";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { subscriptionId } = await req.json();
  if (!subscriptionId) return NextResponse.json({ error: "Missing subscriptionId" }, { status: 400 });

  const sub = await prisma.subscription.findUnique({
    where: { id: subscriptionId, userId: session.user.id, active: true },
    include: { plan: { select: { name: true, price: true, roiPercent: true } } },
  });

  if (!sub) return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
  if (sub.endDate < new Date()) return NextResponse.json({ error: "Plan has expired" }, { status: 400 });

  // Enforce 1-hour cooldown
  const lastClaim = sub.lastClaimedAt ?? sub.createdAt;
  const hoursSinceLastClaim = (Date.now() - lastClaim.getTime()) / 1000 / 3600;

  if (hoursSinceLastClaim < 1) {
    const secsLeft = Math.ceil(3600 - (Date.now() - lastClaim.getTime()) / 1000);
    const minsLeft = Math.ceil(secsLeft / 60);
    return NextResponse.json({
      error: `Next claim available in ${minsLeft} minute${minsLeft !== 1 ? "s" : ""}`,
    }, { status: 429 });
  }

  const amount = calcHourlyEarnings(sub.plan.price, sub.plan.roiPercent);

  await prisma.$transaction([
    // Update lastClaimedAt on subscription
    prisma.subscription.update({
      where: { id: subscriptionId },
      data: { lastClaimedAt: new Date() },
    }),
    // Credit main balance
    prisma.user.update({
      where: { id: session.user.id },
      data: {
        balance: { increment: amount },
        totalEarned: { increment: amount },
      },
    }),
    // Log transaction
    prisma.transaction.create({
      data: {
        userId: session.user.id,
        type: "EARNING",
        amount,
        description: `Hourly earnings claimed — ${sub.plan.name} plan`,
      },
    }),
  ]);

  return NextResponse.json({ message: "Earnings claimed!", amount, planName: sub.plan.name });
}
