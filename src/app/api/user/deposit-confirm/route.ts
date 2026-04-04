import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  planId: z.string(),
  currency: z.string(),
  cryptoAmount: z.string(),
  usdAmount: z.number().positive(),
  txHash: z.string().optional(),
  walletAddress: z.string(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const plan = await prisma.plan.findUnique({ where: { id: parsed.data.planId } });
  if (!plan) return NextResponse.json({ error: "Plan not found" }, { status: 404 });

  // Block duplicate pending confirmations
  const existing = await prisma.depositConfirmation.findFirst({
    where: { userId: session.user.id, planId: parsed.data.planId, status: "PENDING" },
  });
  if (existing) {
    return NextResponse.json({ error: "You already have a pending deposit for this plan" }, { status: 409 });
  }

  const welcomeBonus = plan.price * 0.5;
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + plan.durationDays);

  // Auto-credit balance + activate plan immediately
  const results = await prisma.$transaction([
    prisma.subscription.create({
      data: {
        userId: session.user.id,
        planId: plan.id,
        endDate,
        hashrate: plan.hashrate,
      },
    }),
    prisma.worker.create({
      data: {
        userId: session.user.id,
        name: `Worker-${plan.name}-${Date.now()}`,
        hashrate: plan.hashrate,
      },
    }),
    prisma.user.update({
      where: { id: session.user.id },
      data: {
        balance: { increment: parsed.data.usdAmount + welcomeBonus },
        totalEarned: { increment: welcomeBonus },
      },
    }),
    prisma.transaction.create({
      data: {
        userId: session.user.id,
        type: "DEPOSIT",
        amount: parsed.data.usdAmount,
        description: `Deposit submitted — ${parsed.data.currency} · ${plan.name} plan (pending verification)`,
      },
    }),
    prisma.transaction.create({
      data: {
        userId: session.user.id,
        type: "EARNING",
        amount: welcomeBonus,
        description: `50% welcome bonus — ${plan.name} plan`,
      },
    }),
  ]);

  const subscription = results[0] as { id: string };

  // Create the confirmation record with subscriptionId
  const confirmation = await prisma.depositConfirmation.create({
    data: {
      userId: session.user.id,
      planId: plan.id,
      subscriptionId: subscription.id,
      currency: parsed.data.currency,
      cryptoAmount: parsed.data.cryptoAmount,
      usdAmount: parsed.data.usdAmount,
      txHash: parsed.data.txHash || null,
      walletAddress: parsed.data.walletAddress,
      expiresAt,
      autoApprovedAt: new Date(),
    },
  });

  return NextResponse.json({
    message: "Deposit confirmed! Your balance has been credited and plan activated. Admin will verify within 24 hours.",
    id: confirmation.id,
    welcomeBonus,
  });
}

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const confirmations = await prisma.depositConfirmation.findMany({
    where: { userId: session.user.id },
    include: { plan: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ confirmations });
}
