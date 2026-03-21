"use client";

interface PortalLoadingProps {
  message?: string;
}

export function PortalLoading({ message = "Opening the portal..." }: PortalLoadingProps) {
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
          {message}
        </p>
        <p className="text-sm text-muted-foreground">
          Generating your 2050 roast in &lt;25s...
        </p>
      </div>
    </div>
  );
}
