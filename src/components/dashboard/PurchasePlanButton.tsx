"use client";
import { useState } from "react";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function PurchasePlanButton({ planId, planName, price }: { planId: string; planName: string; price: number }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePurchase = async () => {
    setLoading(true);
    const res = await fetch("/api/user/purchase-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId }),
    });
    const text = await res.text();
    const data = text ? JSON.parse(text) : {};
    setLoading(false);
    if (!res.ok) toast.error(data.error || "Purchase failed. Please try again.");
    else {
      const bonus = data.welcomeBonus ? ` +$${data.welcomeBonus.toLocaleString()} welcome bonus credited!` : "";
      toast.success(`${planName} plan activated!${bonus}`);
      router.refresh();
    }
  };

  return (
    <Button onClick={handlePurchase} loading={loading} className="w-full">
      Purchase — ${price}
    </Button>
  );
}
