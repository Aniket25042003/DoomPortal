"use client";

import { useState } from "react";
import { RemixCard } from "@/components/remix-card";

interface RemixItem {
  shortId: string;
  handle: string;
  platform: string;
  sinId: string;
  videoUrl: string;
  thumbnailUrl: string;
  views: number;
  createdAt: string;
}

interface DashboardClientProps {
  initialRemixes: RemixItem[];
}

export function DashboardClient({ initialRemixes }: DashboardClientProps) {
  const [remixes, setRemixes] = useState(initialRemixes);

  const handleDelete = (shortId: string) => {
    setRemixes((prev) => prev.filter((r) => r.shortId !== shortId));
  };

  if (remixes.length === 0) {
    return (
      <div className="mt-12 rounded-lg border border-dashed border-border p-12 text-center">
        <p className="text-muted-foreground">
          You haven&apos;t saved any roasts yet. Create one and click &quot;Save
          to Library&quot; to add it here.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {remixes.map((remix) => (
        <RemixCard
          key={remix.shortId}
          {...remix}
          onDelete={handleDelete}
          showDelete
        />
      ))}
    </div>
  );
}
