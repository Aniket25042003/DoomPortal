"use client";

import { useState, useEffect } from "react";

interface PortalLoadingProps {
  message?: string;
  previewImages?: string[];
  sinName?: string;
  handle?: string;
}

export function PortalLoading({
  message = "Opening the portal...",
  previewImages = [],
  sinName,
  handle,
}: PortalLoadingProps) {
  const [dots, setDots] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (previewImages.length <= 1) return;
    const interval = setInterval(() => {
      setImageLoaded(false);
      setActiveImageIndex((prev) => (prev + 1) % previewImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [previewImages.length]);

  const showPreview = previewImages.length > 0;

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-8">
      {showPreview ? (
        <div className="w-full max-w-lg space-y-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-primary/20 bg-black/50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewImages[activeImageIndex]}
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
            <div className="absolute bottom-3 left-3 right-3">
              <p className="font-heading text-xs font-medium text-white/70">
                AI preview — your video is rendering
              </p>
            </div>
          </div>

          {sinName && handle && (
            <p className="text-center text-sm text-muted-foreground">
              Generating <span className="text-primary font-semibold">{handle}</span>&apos;s{" "}
              <span className="text-primary font-semibold">{sinName}</span> roast video
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
          {message}{dots}
        </p>
        <p className="text-sm text-muted-foreground">
          Video generation usually takes 1–3 minutes
        </p>
      </div>
    </div>
  );
}
