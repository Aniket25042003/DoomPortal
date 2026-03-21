"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, RotateCcw, Save } from "lucide-react";
import { ShareButtons } from "./share-buttons";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import type { Sin } from "@/types";

interface VideoPlayerProps {
  shortId: string;
  videoUrl: string;
  handle: string;
  sin: Sin;
  onMakeAnother: () => void;
  saved?: boolean;
}

export function VideoPlayer({
  shortId,
  videoUrl,
  handle,
  sin,
  onMakeAnother,
  saved: initiallySaved = false,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { data: session } = useSession();
  const [saved, setSaved] = useState(initiallySaved);

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = videoUrl;
    a.download = `doomportal-${handle}-${sin.id}.mp4`;
    a.click();
    toast.success("Download started");
  };

  const handleSaveToLibrary = async () => {
    if (!session) {
      toast.error("Sign in to save to your library");
      window.location.href = `/auth?callbackUrl=${encodeURIComponent(`/remix/${shortId}`)}`;
      return;
    }
    if (saved) {
      toast.success("Already saved to your library");
      return;
    }
    try {
      const res = await fetch("/api/remix/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shortId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSaved(true);
      toast.success("Saved to your library!");
    } catch {
      toast.error("Failed to save to library");
    }
  };

  return (
    <div className="flex w-full max-w-2xl flex-col gap-6">
      <div className="overflow-hidden rounded-lg border border-primary/20 bg-black">
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          autoPlay
          loop
          playsInline
          className="w-full"
        />
      </div>

      <div className="space-y-4">
        <h2 className="font-heading text-xl font-bold text-primary">
          {handle}&apos;s 2050 Portal Roast – {sin.name}
        </h2>

        <div className="flex flex-wrap gap-2">
          <Button onClick={handleDownload} variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Download
          </Button>
          <Button
            onClick={handleSaveToLibrary}
            variant="outline"
            size="sm"
            className="gap-2"
            disabled={saved}
          >
            <Save className="h-4 w-4" />
            {saved ? "Saved" : "Save to Library"}
          </Button>
          <Button onClick={onMakeAnother} size="sm" className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Make Another
          </Button>
        </div>

        <ShareButtons
          shortId={shortId}
          handle={handle}
          sinName={sin.name}
        />
      </div>
    </div>
  );
}
