"use client";
import { useState } from "react";
import Button from "@/components/ui/Button";

export default function CopyReferralLink({ link }: { link: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex gap-2">
      <input
        readOnly
        value={link}
        className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-300 text-sm"
      />
      <Button onClick={copy} variant="outline" size="sm">
        {copied ? "Copied!" : "Copy"}
      </Button>
    </div>
  );
}
