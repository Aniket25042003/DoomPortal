"use client";

import { useState, useEffect } from "react";
import { RemixCard } from "@/components/remix-card";
import { Skeleton } from "@/components/ui/skeleton";

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

export function GalleryClient() {
  const [items, setItems] = useState<RemixItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    async function fetchPage(p: number) {
      setLoading(true);
      try {
        const res = await fetch(`/api/gallery?page=${p}&limit=24`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        if (p === 1) {
          setItems(data.items);
        } else {
          setItems((prev) => [...prev, ...data.items]);
        }
        setHasMore(data.hasMore);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPage(page);
  }, [page]);

  if (loading && items.length === 0) {
    return (
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="aspect-video w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mt-12 rounded-lg border border-dashed border-border p-12 text-center">
        <p className="text-muted-foreground">
          No remixes yet. Be the first to create one!
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((remix) => (
          <RemixCard key={remix.shortId} {...remix} />
        ))}
      </div>
      {hasMore && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={loading}
            className="rounded-lg border border-primary/30 bg-primary/10 px-4 py-2 font-heading text-sm font-semibold text-primary transition-colors hover:bg-primary/20 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
    </>
  );
}
