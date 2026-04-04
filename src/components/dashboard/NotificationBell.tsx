"use client";
import { useEffect, useState, useRef } from "react";

type Notification = { id: string; title: string; message: string; read: boolean; createdAt: string };

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const fetchNotifications = () => {
    fetch("/api/user/notifications")
      .then((r) => r.text())
      .then((text) => {
        if (!text) return;
        const d = JSON.parse(text);
        setNotifications(d.notifications || []);
        setUnread(d.unreadCount || 0);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markRead = () => {
    fetch("/api/user/notifications", { method: "PATCH" }).then(() => {
      setUnread(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    });
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => { setOpen(!open); if (!open && unread > 0) markRead(); }}
        className="relative flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors w-full"
      >
        <span>🔔</span>
        <span className="text-sm">Notifications</span>
        {unread > 0 && (
          <span className="absolute top-1 left-5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute bottom-12 left-0 w-80 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
            <span className="text-white font-semibold text-sm">Notifications</span>
            {unread > 0 && <span className="text-xs text-gray-500">{unread} unread</span>}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-6">No notifications</p>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className={`px-4 py-3 border-b border-gray-800 ${!n.read ? "bg-amber-500/5" : ""}`}>
                  <div className="flex items-start gap-2">
                    {!n.read && <span className="w-2 h-2 bg-amber-400 rounded-full mt-1.5 flex-shrink-0" />}
                    <div>
                      <p className="text-white text-sm font-medium">{n.title}</p>
                      <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{n.message}</p>
                      <p className="text-gray-600 text-xs mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
