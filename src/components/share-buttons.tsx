"use client";

import { Button } from "@/components/ui/button";
import { Share2, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Sin } from "@/types";

interface ShareButtonsProps {
  shortId: string;
  handle: string;
  sinName: string;
  baseUrl?: string;
}

export function ShareButtons({
  shortId,
  handle,
  sinName,
  baseUrl = typeof window !== "undefined" ? window.location.origin : "",
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${baseUrl}/remix/${shortId}`;
  const shareText = `My 2050 hologram just teleported in and roasted me for being a ${sinName}! Portal opened via DoomPortal – made with Magic Hour API! Try yours: ${shareUrl}`;

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareX = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank", "noopener,noreferrer,width=550,height=420");
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleShareX}
        className="gap-2"
      >
        <Share2 className="h-4 w-4" />
        Share to X
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopyLink}
        className="gap-2"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
        Copy link
      </Button>
    </div>
  );
}
