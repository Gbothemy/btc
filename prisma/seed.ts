import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.plan.deleteMany();

  await prisma.plan.createMany({
    data: [
      {
        name: "Starter",
        price: 200,
        hashrate: 1,
        durationDays: 3,
        roiPercent: 200,
        description: "Perfect for beginners. 200% hourly rate + $100 welcome bonus.",
      },
      {
        name: "Pro",
        price: 500,
        hashrate: 5,
        durationDays: 3,
        roiPercent: 200,
        description: "Most popular choice. 200% hourly rate + $250 welcome bonus.",
      },
      {
        name: "Enterprise",
        price: 2000,
        hashrate: 25,
        durationDays: 3,
        roiPercent: 200,
        description: "Maximum returns. 200% hourly rate + $1,000 welcome bonus.",
      },
    ],
  });

  const adminPassword = await bcrypt.hash("admin123456", 12);
  await prisma.user.upsert({
    where: { email: "admin@hashvault.io" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@hashvault.io",
      password: adminPassword,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });

  console.log("✅ Seed complete — plans updated with 200% hourly rate, 3-day contracts, 50% welcome bonus");
}

main().catch(console.error).finally(() => prisma.$disconnect());
