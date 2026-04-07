import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const WELCOME_BONUS_PERCENT = 0.5; // 50%

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { planId } = await req.json();
  const plan = await prisma.plan.findUnique({ where: { id: planId } });
  if (!plan) return NextResponse.json({ error: "Plan not found" }, { status: 404 });

  const user = await prisma.user.findUnique({ where: { id: session.user!.id } });
  if (!user || user.balance < plan.price) {
    return NextResponse.json({ error: "Insufficient balance. Please deposit first." }, { status: 400 });
  }

  const welcomeBonus = plan.price * WELCOME_BONUS_PERCENT;
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + plan.durationDays);

  await prisma.$transaction([
    // Create subscription
    prisma.subscription.create({
      data: {
        userId: session.user!.id,
        planId: plan.id,
        endDate,
        hashrate: plan.hashrate,
      },
    }),
    // Deduct plan price from balance
    prisma.user.update({
      where: { id: session.user!.id },
      data: { balance: { decrement: plan.price } },
    }),
    // Credit welcome bonus to balance
    prisma.user.update({
      where: { id: session.user!.id },
      data: {
        balance: { increment: welcomeBonus },
        totalEarned: { increment: welcomeBonus },
      },
    }),
    // Log plan purchase
    prisma.transaction.create({
      data: {
        userId: session.user!.id,
        type: "DEPOSIT",
        amount: plan.price,
        description: `Purchased ${plan.name} plan`,
      },
    }),
    // Log welcome bonus
    prisma.transaction.create({
      data: {
        userId: session.user!.id,
        type: "EARNING",
        amount: welcomeBonus,
        description: `50% welcome bonus — ${plan.name} plan`,
      },
    }),
    // Create worker
    prisma.worker.create({
      data: {
        userId: session.user!.id,
        name: `Worker-${plan.name}-${Date.now()}`,
        hashrate: plan.hashrate,
      },
    }),
  ]);

  return NextResponse.json({
    message: "Plan activated",
    welcomeBonus,
  });
}
