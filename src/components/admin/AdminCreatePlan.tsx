"use client";
import { useState } from "react";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AdminCreatePlan() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", price: "", hashrate: "", durationDays: "", roiPercent: "", description: "" });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/admin/plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
        hashrate: Number(form.hashrate),
        durationDays: Number(form.durationDays),
        roiPercent: Number(form.roiPercent),
      }),
    });
    setLoading(false);
    if (res.ok) {
      toast.success("Plan created");
      setOpen(false);
      setForm({ name: "", price: "", hashrate: "", durationDays: "", roiPercent: "", description: "" });
      router.refresh();
    } else toast.error("Failed to create plan");
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>+ New Plan</Button>

      {open && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-white font-bold text-lg mb-4">Create Mining Plan</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              {[
                { label: "Plan Name", key: "name", type: "text" },
                { label: "Price (USD)", key: "price", type: "number" },
                { label: "Hashrate (TH/s)", key: "hashrate", type: "number" },
                { label: "Duration (Days)", key: "durationDays", type: "number" },
                { label: "Daily ROI (%)", key: "roiPercent", type: "number" },
                { label: "Description (optional)", key: "description", type: "text" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-xs text-gray-400 mb-1">{f.label}</label>
                  <input
                    type={f.type}
                    required={f.key !== "description"}
                    value={(form as any)[f.key]}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <Button type="submit" loading={loading} className="flex-1">Create</Button>
                <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="flex-1">Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
