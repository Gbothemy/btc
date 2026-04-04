import { prisma } from "@/lib/prisma";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import AdminAnnouncementForm from "@/components/admin/AdminAnnouncementForm";

export default async function AdminAnnouncementsPage() {
  const announcements = await prisma.announcement.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Announcements</h1>
        <AdminAnnouncementForm />
      </div>

      <Card>
        {announcements.length === 0 ? (
          <p className="text-gray-500 text-sm">No announcements yet.</p>
        ) : (
          <div className="space-y-4">
            {announcements.map((a) => (
              <div key={a.id} className="border border-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-semibold">{a.title}</h3>
                  <div className="flex items-center gap-3">
                    <Badge variant={a.active ? "success" : "default"}>
                      {a.active ? "Active" : "Inactive"}
                    </Badge>
                    <span className="text-gray-500 text-xs">{new Date(a.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm">{a.message}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
