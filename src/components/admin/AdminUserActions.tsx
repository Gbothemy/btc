"use client";
import { useState } from "react";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AdminUserActions({ userId, suspended }: { userId: string; suspended: boolean }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggle = async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/users/${userId}/suspend`, { method: "POST" });
    setLoading(false);
    if (res.ok) { toast.success("User updated"); router.refresh(); }
    else toast.error("Action failed. Please try again.");
  };

  return (
    <Button
      variant={suspended ? "outline" : "danger"}
      size="sm"
      loading={loading}
      onClick={toggle}
    >
      {suspended ? "Unsuspend" : "Suspend"}
    </Button>
  );
}
