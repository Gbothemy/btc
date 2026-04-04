import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("bg-gray-900 border border-gray-800 rounded-xl p-6", className)}>
      {children}
    </div>
  );
}
