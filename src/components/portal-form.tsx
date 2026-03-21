"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SinSelector } from "./sin-selector";
import { PortalLoading } from "./portal-loading";
import { VideoPlayer } from "./video-player";
import { SINS } from "@/data/sins";
import type { Sin } from "@/types";
import type { Platform } from "@/types";
import { toast } from "sonner";

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function analyzeHandle(handle: string): Sin {
  const clean = handle.replace(/^@/, "").trim() || "user";
  const index = hashString(clean) % SINS.length;
  return SINS[index];
}

export function PortalForm() {
  const [handle, setHandle] = useState("");
  const [platform, setPlatform] = useState<Platform>("x");
  const [selectedSin, setSelectedSin] = useState<Sin | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    shortId: string;
    videoUrl: string;
    thumbnailUrl: string;
  } | null>(null);

  const cleanHandle = handle.replace(/^@/, "").trim();

  const handleAnalyze = useCallback(() => {
    if (!cleanHandle) {
      toast.error("Enter a handle first");
      return;
    }
    const sin = analyzeHandle(cleanHandle);
    setSelectedSin(sin);
    toast.success(`Based on @${cleanHandle} we think you're a ${sin.name} 😉`);
  }, [cleanHandle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cleanHandle || !selectedSin) {
      toast.error("Please enter a handle and select your sin");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/remix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          handle: cleanHandle,
          platform,
          sinId: selectedSin.id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to create remix");
      }

      setResult({
        shortId: data.shortId,
        videoUrl: data.videoUrl,
        thumbnailUrl: data.thumbnailUrl,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleMakeAnother = () => {
    setResult(null);
    setSelectedSin(null);
  };

  if (loading) {
    return (
      <PortalLoading
        message="Fetching your real profile pic... Generating your 2050 roast..."
      />
    );
  }

  if (result && selectedSin) {
    return (
      <VideoPlayer
        shortId={result.shortId}
        videoUrl={result.videoUrl}
        handle={`@${cleanHandle}`}
        sin={selectedSin}
        onMakeAnother={handleMakeAnother}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            placeholder="@username or full URL"
            value={handle}
            onChange={(e) => {
              const v = e.target.value;
              setHandle(v);
              if (v.includes("instagram.com") || v.includes("instagr.am")) {
                setPlatform("instagram");
              } else if (
                v.includes("x.com") ||
                v.includes("twitter.com") ||
                v.includes("t.co")
              ) {
                setPlatform("x");
              }
            }}
            className="flex-1"
          />
          <div className="flex gap-2">
            <Button
              type="button"
              variant={platform === "x" ? "default" : "outline"}
              size="sm"
              onClick={() => setPlatform("x")}
            >
              X
            </Button>
            <Button
              type="button"
              variant={platform === "instagram" ? "default" : "outline"}
              size="sm"
              onClick={() => setPlatform("instagram")}
            >
              Instagram
            </Button>
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleAnalyze}
          className="text-muted-foreground"
        >
          Analyze my handle
        </Button>
      </div>

      <div className="space-y-4">
        <h3 className="font-heading text-sm font-semibold text-foreground">
          Your Social Sin
        </h3>
        <SinSelector
          selectedSinId={selectedSin?.id ?? null}
          onSelect={setSelectedSin}
        />
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full animate-glitch font-heading"
        disabled={!cleanHandle || !selectedSin}
      >
        Open the Portal
      </Button>
    </form>
  );
}
