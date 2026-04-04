import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { title, message } = await req.json();
  if (!title || !message) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const announcement = await prisma.announcement.create({ data: { title, message } });
  return NextResponse.json(announcement);
}
