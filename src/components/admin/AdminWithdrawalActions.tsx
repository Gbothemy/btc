"use client";
import { useState } from "react";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AdminWithdrawalActions({ withdrawalId }: { withdrawalId: string }) {
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);
  const router = useRouter();

  const action = async (type: "approve" | "reject") => {
    setLoading(type);
    const res = await fetch(`/api/admin/withdrawals/${withdrawalId}/${type}`, { method: "POST" });
    setLoading(null);
    if (res.ok) { toast.success(`Withdrawal ${type}d`); router.refresh(); }
    else toast.error("Action failed");
  };

  return (
    <div className="flex gap-2">
      <Button size="sm" loading={loading === "approve"} onClick={() => action("approve")}>Approve</Button>
      <Button size="sm" variant="danger" loading={loading === "reject"} onClick={() => action("reject")}>Reject</Button>
    </div>
  );
}
