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
      <main className="flex flex-1 flex-col items-center justify-center px-4">
        <h1 className="font-heading text-2xl font-bold text-destructive">
          Something went wrong
        </h1>
        <p className="mt-2 text-center text-muted-foreground">
          The portal malfunctioned. Please try again.
        </p>
        <Button onClick={reset} className="mt-6">
          Try again
        </Button>
      </main>
    </div>
  );
}
