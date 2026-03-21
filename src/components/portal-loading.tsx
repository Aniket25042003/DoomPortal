"use client";

import { useState, useEffect, useRef, useMemo } from "react";

interface PortalLoadingProps {
  message?: string;
  profileImageUrl?: string;
  previewImages?: string[];
  sinName?: string;
  handle?: string;
}

function mergeImageUrls(
  profileImageUrl: string | undefined,
  previewImages: string[]
): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  const add = (u: string | undefined) => {
    if (!u || seen.has(u)) return;
    seen.add(u);
    out.push(u);
  };
  add(profileImageUrl);
  for (const u of previewImages) add(u);
  return out;
}

export function PortalLoading({
  message = "Opening the portal...",
  profileImageUrl,
  previewImages = [],
  sinName,
  handle,
}: PortalLoadingProps) {
  const [dots, setDots] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const prevLengthRef = useRef(0);

  const allImages = useMemo(
    () => mergeImageUrls(profileImageUrl, previewImages),
    [profileImageUrl, previewImages]
  );

  const aiPreviewCount = previewImages.length;
  const hasAiPreviews = aiPreviewCount > 0;

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (allImages.length > prevLengthRef.current && allImages.length > 0) {
      setImageLoaded(false);
      setActiveImageIndex(allImages.length - 1);
    }
    prevLengthRef.current = allImages.length;
  }, [allImages.length]);

  useEffect(() => {
    if (allImages.length <= 1) return;
    const interval = setInterval(() => {
      setImageLoaded(false);
      setActiveImageIndex((prev) => (prev + 1) % allImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [allImages.length]);

  const hasImages = allImages.length > 0;

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-8">
      {hasImages ? (
        <div className="w-full max-w-lg space-y-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-primary/20 bg-black/50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={allImages[activeImageIndex] ?? "slide"}
              src={allImages[activeImageIndex] ?? allImages[0]}
              alt="Preview of your roast"
              className={`h-full w-full object-cover transition-opacity duration-700 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="h-10 w-10 animate-portal-spin rounded-full border-2 border-primary/30"
                  style={{
                    borderTopColor: "var(--neon-cyan)",
                    borderRightColor: "var(--neon-pink)",
                  }}
                />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <p className="font-heading text-xs font-medium text-white/70">
                {hasAiPreviews
                  ? "Sneak peek from the doom dimension"
                  : "Target acquired — loading previews..."}
              </p>
              {allImages.length > 1 && (
                <p className="font-heading text-xs text-white/50">
                  {activeImageIndex + 1}/{allImages.length}
                </p>
              )}
            </div>
          </div>

          {sinName && handle && (
            <p className="text-center text-sm text-muted-foreground">
              Cooking up{" "}
              <span className="font-semibold text-primary">{handle}</span>
              &apos;s roast for being a{" "}
              <span className="font-semibold text-destructive">{sinName}</span>
            </p>
          )}
        </div>
      ) : (
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
      )}

      <div className="space-y-2 text-center">
        <p className="font-heading text-lg font-semibold text-primary">
          {message}
          {dots}
        </p>
        <p className="text-sm text-muted-foreground">
          Your future self is getting ready... this takes 2–4 minutes
        </p>
      </div>
    </div>
  );
}
