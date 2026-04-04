"use client";
import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [autoCompound, setAutoCompound] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/user/profile").then((r) => r.json()).then((d) => {
      setProfile({ name: d.name || "", email: d.email || "" });
      setAutoCompound(d.autoCompound || false);
    });
  }, []);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: profile.name, autoCompound }),
    });
    setLoading(false);
    if (res.ok) toast.success("Settings saved!");
    else toast.error("Failed to save settings. Please try again.");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>
      <div className="max-w-xl space-y-6">
        <Card>
          <h2 className="text-white font-semibold mb-4">Profile</h2>
          <form onSubmit={saveProfile} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Email</label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-500 text-sm cursor-not-allowed"
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
              <div>
                <p className="text-white text-sm font-medium">Auto-Compound Earnings</p>
                <p className="text-gray-500 text-xs">Automatically reinvest daily earnings</p>
              </div>
              <button
                type="button"
                onClick={() => setAutoCompound(!autoCompound)}
                className={`relative w-12 h-6 rounded-full transition-colors ${autoCompound ? "bg-amber-500" : "bg-gray-600"}`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${autoCompound ? "translate-x-7" : "translate-x-1"}`} />
              </button>
            </div>
            <Button type="submit" loading={loading}>Save Changes</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
