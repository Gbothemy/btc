"use client";
import { useState } from "react";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AdminDepositActions({ depositId }: { depositId: string }) {
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);
  const router = useRouter();

  const action = async (type: "approve" | "reject") => {
    setLoading(type);
    const res = await fetch(`/api/admin/deposits/${depositId}/${type}`, { method: "POST" });
    const text = await res.text();
    const data = text ? JSON.parse(text) : {};
    setLoading(null);
    if (res.ok) {
      toast.success(type === "approve" ? "Deposit approved — plan activated!" : "Deposit rejected");
      router.refresh();
    } else {
      toast.error(data.error || "Action failed");
    }
  };

  return (
    <div className="flex gap-2">
      <Button size="sm" loading={loading === "approve"} onClick={() => action("approve")}>
        ✓ Approve
      </Button>
      <Button size="sm" variant="danger" loading={loading === "reject"} onClick={() => action("reject")}>
        ✗ Reject
      </Button>
    </div>
  );
}
