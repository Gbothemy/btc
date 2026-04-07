import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await context.params;
  const { amount } = await req.json();
  if (!amount || amount <= 0) return NextResponse.json({ error: "Invalid amount" }, { status: 400 });

  await prisma.$transaction([
    prisma.user.update({
      where: { id },
      data: { balance: { increment: amount } },
    }),
    prisma.transaction.create({
      data: {
        userId: id,
        type: "DEPOSIT",
        amount,
        description: "Manual credit by admin",
      },
    }),
  ]);

  return NextResponse.json({ message: "Balance credited" });
}
