import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await context.params;

  const deposit = await prisma.depositConfirmation.findUnique({ where: { id } });
  if (!deposit) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (deposit.status !== "PENDING") return NextResponse.json({ error: "Already processed" }, { status: 400 });

  const welcomeBonus = deposit.usdAmount * 0.5;
  const totalToReverse = deposit.usdAmount + welcomeBonus;

  await prisma.$transaction([
    prisma.depositConfirmation.update({
      where: { id },
      data: { status: "REJECTED" },
    }),
    ...(deposit.subscriptionId ? [
      prisma.subscription.update({
        where: { id: deposit.subscriptionId },
        data: { active: false },
      }),
    ] : []),
    prisma.user.update({
      where: { id: deposit.userId },
      data: {
        balance: { decrement: totalToReverse },
        totalEarned: { decrement: welcomeBonus },
      },
    }),
    prisma.transaction.create({
      data: {
        userId: deposit.userId,
        type: "WITHDRAWAL",
        amount: totalToReverse,
        description: `Deposit rejected by admin — ${deposit.currency} payment not verified`,
      },
    }),
    prisma.notification.create({
      data: {
        userId: deposit.userId,
        title: "Deposit Rejected ❌",
        message: `Your deposit of $${deposit.usdAmount.toLocaleString()} via ${deposit.currency} could not be verified. Your balance has been reversed. Contact support if you believe this is an error.`,
      },
    }),
  ]);

  return NextResponse.json({ message: "Deposit rejected and reversed" });
}
