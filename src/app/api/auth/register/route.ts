import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { randomBytes } from "crypto";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  referralCode: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { name, email, password, referralCode } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ error: "Email already registered" }, { status: 409 });

  let referredById: string | undefined;
  if (referralCode) {
    const referrer = await prisma.user.findUnique({ where: { referralCode } });
    if (referrer) referredById = referrer.id;
  }

  const hashed = await bcrypt.hash(password, 12);
  const verifyToken = randomBytes(32).toString("hex");

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      verifyToken,
      referredById,
      // Auto-verify for now — remove this line when real email is configured
      emailVerified: new Date(),
    },
  });

  // Send verification email in background — don't await it
  // so registration doesn't hang if SMTP isn't configured
  import("@/lib/email").then(({ sendVerificationEmail }) => {
    sendVerificationEmail(email, verifyToken).catch(() => {
      // silently ignore email failures
    });
  });

  return NextResponse.json({ message: "Account created successfully." });
}
