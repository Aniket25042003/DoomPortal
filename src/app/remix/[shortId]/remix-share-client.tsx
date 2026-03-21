"use client";

import { useEffect, useRef, useState } from "react";
import { ShareButtons } from "@/components/share-buttons";
import type { Sin } from "@/types";

interface RemixShareClientProps {
  shortId: string;
  videoUrl: string;
  handle: string;
  sin: Sin;
  views: number;
}

export function RemixShareClient({
  shortId,
  videoUrl,
  handle,
  sin,
  views: initialViews,
}: RemixShareClientProps) {
  const [views, setViews] = useState(initialViews);
  const viewedRef = useRef(false);

  useEffect(() => {
    if (viewedRef.current) return;
    viewedRef.current = true;

    fetch("/api/remix/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shortId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.views !== undefined) setViews(data.views);
      })
      .catch(() => {});
  }, [shortId]);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-lg border border-primary/20 bg-black">
        <video
          src={videoUrl}
          controls
          autoPlay
          loop
          playsInline
          className="w-full"
        />
      </div>

      <h1 className="font-heading text-xl font-bold text-primary">
        {handle}&apos;s 2050 Portal Roast – {sin.name}
      </h1>

      <p className="text-sm text-muted-foreground">{views} views</p>

      <ShareButtons shortId={shortId} handle={handle} sinName={sin.name} />
    </div>
  );
}
