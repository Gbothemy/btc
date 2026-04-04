import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  amount: z.number().min(50),
  walletAddress: z.string().min(10),
  currency: z.enum(["BTC", "USDT"]),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse({ ...body, amount: Number(body.amount) });
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || user.balance < parsed.data.amount) {
    return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
  }

  await prisma.$transaction([
    prisma.withdrawal.create({
      data: {
        userId: session.user.id,
        amount: parsed.data.amount,
        walletAddress: parsed.data.walletAddress,
        currency: parsed.data.currency,
      },
    }),
    prisma.user.update({
      where: { id: session.user.id },
      data: { balance: { decrement: parsed.data.amount } },
    }),
    prisma.transaction.create({
      data: {
        userId: session.user.id,
        type: "WITHDRAWAL",
        amount: parsed.data.amount,
        description: `Withdrawal to ${parsed.data.walletAddress.slice(0, 8)}...`,
      },
    }),
  ]);

  return NextResponse.json({ message: "Withdrawal request submitted" });
}
