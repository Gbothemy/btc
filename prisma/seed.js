const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  await prisma.plan.deleteMany();

  await prisma.plan.createMany({
    data: [
      { name: "Starter",    price: 200,  hashrate: 1,  durationDays: 3, roiPercent: 150, description: "Hourly: $300 · Daily: $7,200 · Total: $21,600 + $100 welcome bonus" },
      { name: "Pro",        price: 500,  hashrate: 5,  durationDays: 3, roiPercent: 150, description: "Hourly: $750 · Daily: $18,000 · Total: $54,000 + $250 welcome bonus" },
      { name: "Enterprise", price: 2000, hashrate: 25, durationDays: 3, roiPercent: 150, description: "Hourly: $3,000 · Daily: $72,000 · Total: $216,000 + $1,000 welcome bonus" },
    ],
  });

  // Update admin credentials
  const adminPassword = await bcrypt.hash("HashVault@Admin2024", 12);
  await prisma.user.upsert({
    where: { email: "admin@hashvault.io" },
    update: { password: adminPassword, name: "HashVault Admin" },
    create: {
      name: "HashVault Admin",
      email: "admin@hashvault.io",
      password: adminPassword,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });

  console.log("✅ Seed complete");
  console.log("Admin email:    admin@hashvault.io");
  console.log("Admin password: HashVault@Admin2024");
}

main().catch(console.error).finally(() => prisma.$disconnect());
