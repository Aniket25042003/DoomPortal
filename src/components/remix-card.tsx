"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, MoreVertical, Share2, Trash2 } from "lucide-react";
import { getSinById } from "@/data/sins";
import { toast } from "sonner";

interface RemixCardProps {
  shortId: string;
  handle: string;
  sinId: string;
  videoUrl: string;
  thumbnailUrl: string;
  views: number;
  createdAt: string;
  onDelete?: (shortId: string) => void;
  showDelete?: boolean;
}

export function RemixCard({
  shortId,
  handle,
  sinId,
  videoUrl,
  thumbnailUrl,
  views,
  createdAt,
  onDelete,
  showDelete = false,
}: RemixCardProps) {
  const sin = getSinById(sinId);
  const date = new Date(createdAt).toLocaleDateString();

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = videoUrl;
    a.download = `doomportal-${handle}-${sinId}.mp4`;
    a.click();
    toast.success("Download started");
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    try {
      const res = await fetch(`/api/remix/${shortId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      onDelete(shortId);
      toast.success("Remix deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="group overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary/30">
      <Link href={`/remix/${shortId}`} className="block">
        <div className="aspect-video bg-black">
          <video
            src={videoUrl}
            poster={thumbnailUrl}
            className="h-full w-full object-cover"
            muted
            preload="metadata"
          />
        </div>
      </Link>
      <div className="flex items-center justify-between gap-2 p-3">
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-foreground">{handle}</p>
          <p className="text-xs text-muted-foreground">
            {sin?.name ?? sinId} · {views} views · {date}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.preventDefault();
              handleDownload();
            }}
          >
            <Download className="h-4 w-4" />
          </Button>
          <Link href={`/remix/${shortId}`}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Share2 className="h-4 w-4" />
            </Button>
          </Link>
          {showDelete && onDelete && (
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground outline-none ring-offset-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring">
                <MoreVertical className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
}
