import { prisma } from "@/lib/prisma";

export default async function AnnouncementBanner() {
  let announcement = null;
  try {
    announcement = await prisma.announcement.findFirst({
      where: { active: true },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return null; // silently skip if DB is slow
  }

  if (!announcement) return null;

  return (
    <div className="mb-6 bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-3 flex items-start gap-3">
      <span className="text-amber-400 text-lg mt-0.5">📢</span>
      <div>
        <p className="text-amber-400 font-semibold text-sm">{announcement.title}</p>
        <p className="text-gray-300 text-sm mt-0.5">{announcement.message}</p>
      </div>
    </div>
  );
}
