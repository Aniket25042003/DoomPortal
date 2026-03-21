"use client";

import { useState } from "react";
import { toast } from "sonner";
import { getSinById } from "@/data/sins";

interface RemixSetting {
  shortId: string;
  handle: string;
  sinId: string;
  showInGallery: boolean;
  createdAt: string;
}

interface SettingsClientProps {
  remixes: RemixSetting[];
}

export function SettingsClient({ remixes }: SettingsClientProps) {
  const [items, setItems] = useState(remixes);

  const handleToggle = async (shortId: string, newValue: boolean) => {
    setItems((prev) =>
      prev.map((r) =>
        r.shortId === shortId ? { ...r, showInGallery: newValue } : r
      )
    );

    try {
      const res = await fetch("/api/settings/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shortId, showInGallery: newValue }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to update");
      }

      toast.success(
        newValue
          ? "This roast will now appear in the Gallery"
          : "This roast has been hidden from the Gallery"
      );
    } catch (err) {
      setItems((prev) =>
        prev.map((r) =>
          r.shortId === shortId ? { ...r, showInGallery: !newValue } : r
        )
      );
      toast.error(
        err instanceof Error ? err.message : "Failed to update setting"
      );
    }
  };

  if (items.length === 0) {
    return (
      <div className="mt-12 rounded-lg border border-dashed border-border p-12 text-center">
        <p className="text-muted-foreground">
          You don&apos;t have any roasts yet. Create one first!
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-3">
      <div className="rounded-lg border border-border/50 bg-muted/20 px-4 py-3">
        <p className="text-xs text-muted-foreground">
          Toggle the switch to show or hide each roast from the public
          Trending Gallery. New roasts are hidden by default for logged-in
          users.
        </p>
      </div>

      {items.map((remix) => {
        const sin = getSinById(remix.sinId);
        return (
          <div
            key={remix.shortId}
            className="flex items-center justify-between rounded-lg border border-border/50 px-4 py-3 transition-colors hover:bg-muted/30"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {remix.handle}{" "}
                <span className="text-muted-foreground">
                  — {sin?.name ?? remix.sinId}
                </span>
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(remix.createdAt).toLocaleDateString()}
              </p>
            </div>

            <button
              onClick={() =>
                handleToggle(remix.shortId, !remix.showInGallery)
              }
              className={`relative ml-4 inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                remix.showInGallery
                  ? "bg-primary"
                  : "bg-muted-foreground/30"
              }`}
              role="switch"
              aria-checked={remix.showInGallery}
              aria-label={`Show ${remix.handle} in gallery`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform ${
                  remix.showInGallery
                    ? "translate-x-5"
                    : "translate-x-0"
                }`}
              />
            </button>
          </div>
        );
      })}
    </div>
  );
}
