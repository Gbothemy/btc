import { NextResponse } from "next/server";
import { getBtcPrice } from "@/lib/mining";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [btcPrice, userCount, totalPaid] = await Promise.all([
    getBtcPrice(),
    prisma.user.count(),
    prisma.withdrawal.aggregate({
      where: { status: "APPROVED" },
      _sum: { amount: true },
    }),
  ]);

  return NextResponse.json({
    btcPrice,
    userCount,
    totalPaid: totalPaid._sum.amount || 0,
    timestamp: new Date().toISOString(),
  });
}
