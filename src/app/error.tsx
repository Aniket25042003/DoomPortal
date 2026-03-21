"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        <p className="animate-wiggle text-5xl">💥</p>
        <h1 className="mt-4 font-heading text-2xl font-bold text-destructive">
          The portal exploded
        </h1>
        <p className="mt-2 text-muted-foreground">
          Your future self tripped over a cable. Classic.
        </p>
        <Button onClick={reset} className="mt-6">
          Try reopening the portal
        </Button>
      </main>
    </div>
  );
}
