"use client";

import { useState, useEffect } from "react";

interface PortalLoadingProps {
  message?: string;
}

export function PortalLoading({ message = "Opening the portal..." }: PortalLoadingProps) {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-8 py-16">
      <div className="relative">
        <div
          className="h-32 w-32 animate-portal-spin rounded-full border-4 border-primary/30"
          style={{
            borderTopColor: "var(--neon-cyan)",
            borderRightColor: "var(--neon-pink)",
          }}
        />
        <div
          className="absolute inset-0 m-auto h-24 w-24 animate-portal-pulse rounded-full border-2 border-primary/50 bg-primary/5"
          style={{ borderColor: "var(--neon-cyan)" }}
        />
      </div>
      <div className="space-y-2 text-center">
        <p className="font-heading text-lg font-semibold text-primary">
          {message}{dots}
        </p>
        <p className="text-sm text-muted-foreground">
          Video generation usually takes 1–3 minutes
        </p>
      </div>
    </div>
  );
}
