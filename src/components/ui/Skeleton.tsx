import { cn } from "@/lib/utils";

export default function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse bg-gray-800 rounded-lg", className)} />
  );
}
