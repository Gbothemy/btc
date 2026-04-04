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

  await prisma.$transaction([
    prisma.depositConfirmation.update({
      where: { id },
      data: { status: "APPROVED" },
    }),
    prisma.notification.create({
      data: {
        userId: deposit.userId,
        title: "Deposit Verified ✅",
        message: `Your deposit of $${deposit.usdAmount.toLocaleString()} via ${deposit.currency} has been verified. Your plan is active and earnings are running.`,
      },
    }),
  ]);

  return NextResponse.json({ message: "Deposit approved" });
}
