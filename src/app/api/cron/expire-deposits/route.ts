import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Runs hourly — reverses any PENDING deposits older than 24 hours
export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const expired = await prisma.depositConfirmation.findMany({
    where: {
      status: "PENDING",
      expiresAt: { lte: new Date() },
    },
    include: { plan: { select: { name: true } } },
  });

  let reversed = 0;

  for (const deposit of expired) {
    const welcomeBonus = deposit.usdAmount * 0.5;
    const totalToReverse = deposit.usdAmount + welcomeBonus;

    await prisma.$transaction([
      // Mark expired
      prisma.depositConfirmation.update({
        where: { id: deposit.id },
        data: { status: "EXPIRED" },
      }),
      // Deactivate subscription
      ...(deposit.subscriptionId ? [
        prisma.subscription.update({
          where: { id: deposit.subscriptionId },
          data: { active: false },
        }),
      ] : []),
      // Reverse balance
      prisma.user.update({
        where: { id: deposit.userId },
        data: {
          balance: { decrement: totalToReverse },
          totalEarned: { decrement: welcomeBonus },
        },
      }),
      // Log reversal
      prisma.transaction.create({
        data: {
          userId: deposit.userId,
          type: "WITHDRAWAL",
          amount: totalToReverse,
          description: `Deposit expired — admin did not verify within 24 hours`,
        },
      }),
      // Notify user
      prisma.notification.create({
        data: {
          userId: deposit.userId,
          title: "Deposit Expired ⏰",
          message: `Your deposit of $${deposit.usdAmount.toLocaleString()} via ${deposit.currency} was not verified by admin within 24 hours. Your balance and ${deposit.plan.name} plan have been reversed. Please contact support or resubmit your deposit.`,
        },
      }),
    ]);

    reversed++;
  }

  return NextResponse.json({ message: `Reversed ${reversed} expired deposits` });
}
