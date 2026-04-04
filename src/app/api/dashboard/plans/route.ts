import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const plans = await prisma.plan.findMany({
    where: { active: true },
    select: { id: true, name: true, price: true },
    orderBy: { price: "asc" },
  });

  return NextResponse.json({ plans });
}
