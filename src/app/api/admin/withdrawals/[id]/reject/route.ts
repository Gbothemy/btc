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
  const withdrawal = await prisma.withdrawal.findUnique({ where: { id } });
  if (!withdrawal) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.$transaction([
    prisma.withdrawal.update({ where: { id }, data: { status: "REJECTED" } }),
    prisma.user.update({
      where: { id: withdrawal.userId },
      data: { balance: { increment: withdrawal.amount } },
    }),
  ]);

  return NextResponse.json({ message: "Rejected and refunded" });
}
