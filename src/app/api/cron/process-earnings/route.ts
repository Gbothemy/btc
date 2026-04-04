import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getBtcPrice } from "@/lib/mining";

// Called by a cron job (e.g. Vercel Cron or external scheduler) daily
// Protect with a secret header
export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const btcPrice = await getBtcPrice();

  // Get all active subscriptions that haven't expired
  const subscriptions = await prisma.subscription.findMany({
    where: { active: true, endDate: { gt: new Date() } },
    include: { user: true, plan: true },
  });

  let processed = 0;

  for (const sub of subscriptions) {
    // 150% per hour × 24 hours = daily earnings
    // Formula: planPrice × (roiPercent / 100) × 24
    const dailyEarning = (sub.plan.price * sub.plan.roiPercent) / 100 * 24;

    // Referral commission (5% to referrer)
    const referralBonus = sub.user.referredById ? dailyEarning * 0.05 : 0;

    await prisma.$transaction([
      // Credit miningBalance (user claims manually to main balance)
      prisma.user.update({
        where: { id: sub.userId },
        data: {
          miningBalance: { increment: dailyEarning },
        },
      }),
      // Log transaction
      prisma.transaction.create({
        data: {
          userId: sub.userId,
          type: "EARNING",
          amount: dailyEarning,
          description: `Daily mining earnings — ${sub.hashrate} TH/s`,
        },
      }),
    ]);

    // Pay referral bonus
    if (sub.user.referredById && referralBonus > 0) {
      await prisma.$transaction([
        prisma.user.update({
          where: { id: sub.user.referredById },
          data: { balance: { increment: referralBonus }, totalEarned: { increment: referralBonus } },
        }),
        prisma.transaction.create({
          data: {
            userId: sub.user.referredById,
            type: "REFERRAL_BONUS",
            amount: referralBonus,
            description: `Referral commission from ${sub.user.email}`,
          },
        }),
      ]);
    }

    processed++;
  }

  // Deactivate expired subscriptions
  await prisma.subscription.updateMany({
    where: { active: true, endDate: { lte: new Date() } },
    data: { active: false },
  });

  return NextResponse.json({ message: `Processed ${processed} subscriptions`, btcPrice });
}
