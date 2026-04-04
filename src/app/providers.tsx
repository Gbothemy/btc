"use client";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: "#1f2937", color: "#fff", border: "1px solid #374151" },
          success: { iconTheme: { primary: "#f59e0b", secondary: "#000" } },
        }}
      />
    </SessionProvider>
  );
}
