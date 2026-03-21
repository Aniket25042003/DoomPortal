"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SinSelector } from "./sin-selector";
import { PortalLoading } from "./portal-loading";
import { VideoPlayer } from "./video-player";
import { SINS, buildPreviewPrompt } from "@/data/sins";
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

/** Reduced polling vs 200×6s. Async video needs multiple checks; a literal single poll would almost never succeed. */
const VIDEO_POLL_INTERVAL_MS = 8000;
const MAX_VIDEO_STATUS_POLLS = 45;

const IMAGE_GEN_INTERVAL_MS = 6000;
/** nano-banana-2 can take 60s+; poll immediately first, then every 2.5s, up to ~4 min per image */
const IMAGE_POLL_INTERVAL_MS = 2500;
const MAX_IMAGE_POLL_ATTEMPTS = 100;

const LOADING_MESSAGES = [
  "Fetching your profile pic...",
  "Uploading to the doom dimension...",
  "Rendering your ~24s roast at 720p...",
  "Writing your roast script from the future...",
  "Your hologram is rehearsing its lines...",
  "Filming Scene 1: catching you in the act...",
  "Filming Scene 2: the portal rips open...",
  "Filming Scene 3: the roast monologue...",
  "Still rendering...",
  "Almost there...",
];

function getLoadingMessage(elapsed: number): string {
  if (elapsed < 5000) return LOADING_MESSAGES[0];
  if (elapsed < 12000) return LOADING_MESSAGES[1];
  if (elapsed < 25000) return LOADING_MESSAGES[2];
  if (elapsed < 45000) return LOADING_MESSAGES[3];
  if (elapsed < 70000) return LOADING_MESSAGES[4];
  if (elapsed < 100000) return LOADING_MESSAGES[5];
  if (elapsed < 140000) return LOADING_MESSAGES[6];
  if (elapsed < 200000) return LOADING_MESSAGES[7];
  if (elapsed < 300000) return LOADING_MESSAGES[8];
  return LOADING_MESSAGES[9];
}

export function PortalForm() {
  const [handle, setHandle] = useState("");
  const [platform, setPlatform] = useState<Platform>("x");
  const [selectedSin, setSelectedSin] = useState<Sin | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [result, setResult] = useState<{
    shortId: string;
    videoUrl: string;
    thumbnailUrl: string;
  } | null>(null);
  const abortRef = useRef(false);
  const startTimeRef = useRef(0);
  const imageGenCountRef = useRef(0);
  const imageGenBusyRef = useRef(false);

  const cleanHandle = handle.replace(/^@/, "").trim();

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      setLoadingMessage(getLoadingMessage(elapsed));
    }, 2000);
    return () => clearInterval(interval);
  }, [loading]);

  const pollSingleImage = useCallback(async (projectId: string): Promise<string | null> => {
    for (let i = 0; i < MAX_IMAGE_POLL_ATTEMPTS; i++) {
      if (abortRef.current) return null;

      try {
        const res = await fetch(`/api/remix/preview/${projectId}`);
        const data = await res.json();

        if (data.status === "complete" && data.imageUrls?.length) {
          return data.imageUrls[0] as string;
        }
        if (data.status === "error" || data.status === "canceled") return null;
      } catch {
        return null;
      }

      if (i < MAX_IMAGE_POLL_ATTEMPTS - 1) {
        await new Promise((r) => setTimeout(r, IMAGE_POLL_INTERVAL_MS));
      }
    }
    return null;
  }, []);

  const generateAndCollectImage = useCallback(
    async (sin: Sin, handleStr: string) => {
      if (abortRef.current || imageGenBusyRef.current) return;
      imageGenBusyRef.current = true;

      try {
        const sceneIdx = imageGenCountRef.current;
        imageGenCountRef.current += 1;
        const prompt = buildPreviewPrompt(handleStr, sin, sceneIdx);

        const res = await fetch("/api/remix/preview/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          console.warn("Preview generate failed:", err);
          return;
        }

        const { projectId } = await res.json();
        if (!projectId) return;

        const imageUrl = await pollSingleImage(projectId);
        if (imageUrl && !abortRef.current) {
          setPreviewImages((prev) => [...prev, imageUrl]);
        }
      } catch (e) {
        console.warn("Preview image pipeline error:", e);
      } finally {
        imageGenBusyRef.current = false;
      }
    },
    [pollSingleImage]
  );

  const startContinuousImageGen = useCallback(
    (sin: Sin, handleStr: string, firstProjectId: string | null) => {
        if (firstProjectId) {
        void (async () => {
          const url = await pollSingleImage(firstProjectId);
          if (url && !abortRef.current) {
            setPreviewImages((prev) => [...prev, url]);
          }
        })();
      }

      void generateAndCollectImage(sin, handleStr);

      const id = setInterval(() => {
        if (abortRef.current) {
          clearInterval(id);
          return;
        }
        void generateAndCollectImage(sin, handleStr);
      }, IMAGE_GEN_INTERVAL_MS);

      return () => {
        clearInterval(id);
      };
    },
    [pollSingleImage, generateAndCollectImage]
  );

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
    setPreviewImages([]);
    setProfileImageUrl(null);
    abortRef.current = false;
    imageGenCountRef.current = 1;
    imageGenBusyRef.current = false;
    startTimeRef.current = Date.now();
    setLoadingMessage(LOADING_MESSAGES[0]);

    let stopImageGen: (() => void) | null = null;

    try {
      const kickoffRes = await fetch("/api/remix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          handle: cleanHandle,
          platform,
          sinId: selectedSin.id,
        }),
      });

      const kickoffData = await kickoffRes.json();
      if (!kickoffRes.ok) {
        throw new Error(kickoffData.error ?? "Failed to start video generation");
      }

      const { projectId, previewProjectId, profileImageUrl: pUrl } = kickoffData;
      setProfileImageUrl(pUrl);

      stopImageGen = startContinuousImageGen(
        selectedSin,
        cleanHandle,
        previewProjectId
      );

      let downloadUrl: string | null = null;
      for (let attempt = 0; attempt < MAX_VIDEO_STATUS_POLLS; attempt++) {
        if (abortRef.current) throw new Error("Generation cancelled");

        if (attempt > 0) {
          await new Promise((r) => setTimeout(r, VIDEO_POLL_INTERVAL_MS));
        }

        const statusRes = await fetch(`/api/remix/status/${projectId}`);
        const statusData = await statusRes.json();

        if (!statusRes.ok) {
          throw new Error(statusData.error ?? "Failed to check status");
        }

        if (statusData.status === "complete" && statusData.downloadUrl) {
          downloadUrl = statusData.downloadUrl;
          break;
        }

        if (statusData.status === "error") {
          throw new Error(statusData.error ?? "Video generation failed");
        }

        if (statusData.status === "canceled") {
          throw new Error("Video generation was canceled");
        }
      }

      if (!downloadUrl) {
        throw new Error(
          "Video is still rendering — please wait a bit and tap Open the Portal again to retry."
        );
      }

      const completeRes = await fetch("/api/remix/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          downloadUrl,
          handle: cleanHandle,
          platform,
          sinId: selectedSin.id,
          profileImageUrl: pUrl,
        }),
      });

      const completeData = await completeRes.json();
      if (!completeRes.ok) {
        throw new Error(completeData.error ?? "Failed to finalize remix");
      }

      setResult({
        shortId: completeData.shortId,
        videoUrl: completeData.videoUrl,
        thumbnailUrl: completeData.thumbnailUrl,
      });
    } catch (err) {
      if (!abortRef.current) {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
      }
    } finally {
      abortRef.current = true;
      stopImageGen?.();
      setLoading(false);
      setPreviewImages([]);
      setProfileImageUrl(null);
    }
  };

  const handleMakeAnother = () => {
    setResult(null);
    setSelectedSin(null);
  };

  if (loading) {
    return (
      <PortalLoading
        message={loadingMessage}
        profileImageUrl={profileImageUrl ?? undefined}
        previewImages={previewImages}
        sinName={selectedSin?.name}
        handle={`@${cleanHandle}`}
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
