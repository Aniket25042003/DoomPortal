"use client";

import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function AuthPageClient({
  callbackUrl,
}: {
  callbackUrl?: string;
}) {
  return (
    <Button
      size="lg"
      className="w-full"
      onClick={() =>
        signIn.social({
          provider: "google",
          callbackURL: callbackUrl ?? "/dashboard",
        })
      }
    >
      Sign in with Google
    </Button>
  );
}
