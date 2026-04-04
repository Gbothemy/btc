"use client";
import { useState } from "react";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AdminPlanActions({ planId, active }: { planId: string; active: boolean }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggle = async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/plans/${planId}/toggle`, { method: "POST" });
    setLoading(false);
    if (res.ok) { toast.success("Plan updated"); router.refresh(); }
    else toast.error("Failed");
  };

  return (
    <Button variant={active ? "danger" : "outline"} size="sm" loading={loading} onClick={toggle}>
      {active ? "Deactivate" : "Activate"}
    </Button>
  );
}
